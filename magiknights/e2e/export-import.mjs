import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';

const OUT = 'e2e/output';
let failures = 0;
const check = (label, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${label}${ok ? '' : ` — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`}`);
  if (!ok) failures++;
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('pageerror', e => console.log('PAGEERR: ' + e.message.slice(0, 150)));
page.on('dialog', d => d.accept());

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

// ---------- 1. Edit fields THROUGH THE UI ----------
// Base Stats: set an ability score via its input, toggle a condition
const strInput = page.locator('.ability-score-section input, .ability-scores input').first();
// Ability circles: find the STR score input specifically via store-checked edit below;
// safer: use visible inputs on the Student tab instead for text fields.

// Set Reputation via header (MasterHeader input) and level
// The header has inputs bound to level/reputation; use store-verified UI edits where selectors are stable:
await page.locator('a[href="/student"]').first().click();
await page.waitForTimeout(500);
await page.locator('input[list="student-type-options"]').fill('Agile');
await page.locator('input[list="student-type-options"]').dispatchEvent('change');

// Add a gear item via UI
const gearAdd = page.locator('.gear-section .rep-add-button').first();
await gearAdd.click();
await page.waitForTimeout(300);
const gearName = page.locator('.gear-section input[placeholder=" Item name"]').first();
if (await gearName.count()) await gearName.fill('Rope');

// Base stats tab: toggle a condition via UI
await page.locator('a[href="/"]').first().click();
await page.waitForTimeout(500);
await page.getByText('Conditions', { exact: false }).first().click();
await page.waitForTimeout(300);
const distressed = page.locator('.condition-item', { hasText: 'Distressed' }).first();
if (await distressed.count()) {
  await distressed.locator('input[type="checkbox"]').check();
} else {
  console.log('NOTE: condition panel not found for UI toggle');
}

// Add a shard from the library via UI
const shardLib = page.getByText('Shard Library (Quick Add)').first();
await shardLib.click();
await page.waitForTimeout(300);
await page.locator('.shard-library-btn', { hasText: 'Shard of Confidence' }).first().click();

// Knight tab: apply a weapon preset via UI
await page.locator('a[href="/knight"]').first().click();
await page.waitForTimeout(500);
const chevron = page.locator('.soul-armament-mode-container .collapse-control').first();
await chevron.click({ force: true });
await page.waitForTimeout(300);
await page.locator('#soul-weapon-preset').selectOption({ index: 5 }); // Defender's Massive Weapon

// Remaining stat edits via store (level/rep/scores lack stable selectors)
await page.evaluate(() => {
  const vm = document.querySelector('#app').__vue_app__;
  const sheet = vm.config.globalProperties.$pinia._s.get('sheet');
  sheet.level = 7;
  sheet.reputation = 3;
  sheet.abilityScores.constitution.score = 14;
  sheet.mam = 'wisdom';
  sheet.abilityScores.wisdom.score = 16;
  sheet.stress = 2;
  sheet.combatFormsKnown.formX = true;
  sheet.totalFocus = true;
  sheet.divinationTier = 3;
});
await page.waitForTimeout(400);

// Sanity-check derived values in the LIVE UI before export
const derived = await page.evaluate(() => {
  const vm = document.querySelector('#app').__vue_app__;
  const sheet = vm.config.globalProperties.$pinia._s.get('sheet');
  return {
    prof: Number(sheet.proficiency),
    hpMax: sheet.hp.max,
    shpMax: sheet.shp.max,
    mpMax: sheet.mp.max,
    armamentArmor: sheet.soulArmamentArmorBonus,
    weaponName: sheet.soul_weapon.name,
    weaponQualities: Object.entries(sheet.soul_weapon.qualities).filter(([, v]) => v).map(([k]) => k).sort()
  };
});
check('live proficiency reacts to reputation 3', derived.prof, 4);
check('live HP max (CON 14, level 7)', derived.hpMax, 12 + 6 * 8);
check('live SHP max (CON 14, rep 3)', derived.shpMax, 15);
check('live MP max (MCO 7+3+3 x2)', derived.mpMax, 26);
check('live armament armor bonus at rep 3', derived.armamentArmor, 2);
check('weapon preset applied via UI', derived.weaponName, "Defender's Massive Weapon");
check('weapon qualities from preset', derived.weaponQualities, ['massive', 'staggeringBlow', 'twoHanded', 'vicious']);

// ---------- 2. Export via UI, validate the file ----------
await page.locator('a[href="/settings"]').first().click();
await page.waitForTimeout(500);
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByText('Export JSON', { exact: true }).click()
]);
const exportPath = `${OUT}/exported-character.json`;
await download.saveAs(exportPath);
const exported = JSON.parse(readFileSync(exportPath, 'utf8'));
const sheetData = exported.attributes?.sheet;
check('export has attributes.sheet', !!sheetData, true);
check('exported level', sheetData.level, 7);
check('exported reputation', sheetData.reputation, 3);
check('exported CON score', sheetData.abilityScores?.constitution?.score, 14);
check('exported stress', sheetData.stress, 2);
check('exported student type', sheetData.student_type, 'Agile');
check('exported student ability autofilled', sheetData.student_ability?.name, 'Unstoppable Momentum');
check('exported distressed condition', sheetData.conditions?.distressed, true);
check('exported weapon name', sheetData.soul_weapon?.name, "Defender's Massive Weapon");
check('exported weapon massive quality', sheetData.soul_weapon?.qualities?.massive, true);
check('exported form X known', sheetData.combatFormsKnown?.formX, true);
check('exported total focus', sheetData.totalFocus, true);
check('exported divination tier', sheetData.divinationTier, 3);
const shardRows = Object.values(sheetData.shards || {});
check('exported shard from library', shardRows.some(r => r.name === 'Shard of Confidence'), true);
const gearRows = Object.values(sheetData.gear || {});
check('exported gear item', gearRows.some(r => r.name === 'Rope'), true);

// ---------- 3. Fresh page, import, verify restoration ----------
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
const fresh = await page.evaluate(() => {
  const vm = document.querySelector('#app').__vue_app__;
  return vm.config.globalProperties.$pinia._s.get('sheet').level;
});
check('fresh page reset (not the edited level)', fresh !== 7, true);

await page.locator('a[href="/settings"]').first().click();
await page.waitForTimeout(500);
await page.locator('.import-btn input[type="file"]').setInputFiles(exportPath);
await page.waitForTimeout(1000);

const restored = await page.evaluate(() => {
  const vm = document.querySelector('#app').__vue_app__;
  const sheet = vm.config.globalProperties.$pinia._s.get('sheet');
  return {
    level: sheet.level,
    reputation: sheet.reputation,
    prof: Number(sheet.proficiency),
    con: sheet.abilityScores.constitution.score,
    hpMax: sheet.hp.max,
    studentType: sheet.student_type,
    distressed: sheet.conditions.distressed,
    weaponName: sheet.soul_weapon.name,
    massive: sheet.soul_weapon.qualities.massive,
    formX: sheet.combatFormsKnown.formX,
    totalFocus: sheet.totalFocus,
    divinationTier: sheet.divinationTier,
    shard: sheet.sections.shards.rows.some(r => r.name === 'Shard of Confidence'),
    gear: sheet.sections.gear.rows.some(r => r.name === 'Rope'),
    stress: sheet.stress
  };
});
check('import restores level', restored.level, 7);
check('import restores reputation', restored.reputation, 3);
check('import restores derived proficiency', restored.prof, 4);
check('import restores CON', restored.con, 14);
check('import restores derived HP max', restored.hpMax, 60);
check('import restores student type', restored.studentType, 'Agile');
check('import restores condition', restored.distressed, true);
check('import restores weapon', restored.weaponName, "Defender's Massive Weapon");
check('import restores weapon quality', restored.massive, true);
check('import restores form X known', restored.formX, true);
check('import restores total focus', restored.totalFocus, true);
check('import restores divination tier', restored.divinationTier, 3);
check('import restores shard row', restored.shard, true);
check('import restores gear row', restored.gear, true);
check('import restores stress', restored.stress, 2);

console.log(failures === 0 ? '=== ALL CHECKS PASSED ===' : `=== ${failures} CHECKS FAILED ===`);
await browser.close();
process.exit(failures === 0 ? 0 : 1);
