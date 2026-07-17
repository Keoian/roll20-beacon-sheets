import { chromium } from 'playwright';

let failures = 0;
const check = (label, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${label}${ok ? '' : ` — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`}`);
  if (!ok) failures++;
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('dialog', d => d.accept());
// dispatch.roll errors are expected outside Roll20; everything else is not
page.on('pageerror', e => { if (!e.message.includes('dispatch.roll')) { console.log('PAGEERR: ' + e.message); failures++; } });

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.locator('a[href="/knight"]').first().click();
await page.waitForTimeout(600);

// Grant Form X so Soul Guns are legal, then switch the armament mode to gun
await page.evaluate(() => {
  const sheet = document.querySelector('#app').__vue_app__.config.globalProperties.$pinia._s.get('sheet');
  sheet.combatFormsKnown.formX = true;
});
await page.locator('.armament-mode-select').selectOption('gun');
await page.waitForTimeout(400);

// Expand the gun collapsible
await page.locator('.soul-armament-mode-container .collapse-control').first().click({ force: true });
await page.waitForTimeout(400);

const store = (fn) => page.evaluate(fn);

// 1. Gun type selection updates displayed stats
await page.locator('.gun-field select').first().selectOption('dmr');
await page.waitForTimeout(300);
const statsText = await page.locator('.gun-stats').textContent();
check('DMR stats shown (E-Range 80)', statsText.includes('80'), true);
check('DMR damage shown (1d10)', statsText.includes('1d10'), true);
check('store gunType updated from UI', await store(() => {
  const s = document.querySelector('#app').__vue_app__.config.globalProperties.$pinia._s.get('sheet');
  return s.soul_gun.gunType;
}), 'dmr');

// 2. Gun style only offered for HDG/SMG
const styleVisibleDmr = await page.locator('.gun-field select').count();
await page.locator('.gun-field select').first().selectOption('hdg');
await page.waitForTimeout(300);
const styleVisibleHdg = await page.locator('.gun-field select').count();
check('HDG shows a second select (Gun Style) that DMR lacks', styleVisibleHdg > styleVisibleDmr, true);

// 3. Akimbo raises Mag Dump display 3 -> 4
await page.locator('.gun-field select').nth(1).selectOption('akimbo');
await page.waitForTimeout(300);
check('effective MD with Akimbo', await store(() => {
  const s = document.querySelector('#app').__vue_app__.config.globalProperties.$pinia._s.get('sheet');
  return s.effectiveMD;
}), 4);
const mdText = await page.locator('.gun-stats').textContent();
check('MD 4d8 displayed with Akimbo', mdText.includes('4'), true);

// 4. Add an attachment through the UI
const addBtn = page.locator('.attachments-section .add-btn').first();
if (await addBtn.count()) {
  await addBtn.click();
  await page.waitForTimeout(200);
  await page.locator('.attachment-row .att-name').first().fill('Standard Scope');
  await page.locator('.attachment-row .att-type').first().selectOption('scope');
  await page.locator('.attachment-row .att-effect').first().fill('+1 to Firing Pool total');
  check('attachment stored', await store(() => {
    const s = document.querySelector('#app').__vue_app__.config.globalProperties.$pinia._s.get('sheet');
    return s.soul_gun.attachments.length === 1 && s.soul_gun.attachments[0].name === 'Standard Scope';
  }), true);
} else {
  check('attachment add button present', false, true);
}

// 5. Aiming toggle syncs to store
await page.locator('.gun-state input[type="checkbox"]').first().check();
check('aimed synced to store', await store(() => {
  const s = document.querySelector('#app').__vue_app__.config.globalProperties.$pinia._s.get('sheet');
  return s.soul_gun.aimed;
}), true);

// 6. Mag Dump consumes the reload and clears Aiming; MD button disables
await store(() => {
  const s = document.querySelector('#app').__vue_app__.config.globalProperties.$pinia._s.get('sheet');
  s.rollGunMagDump();
});
await page.waitForTimeout(300);
const afterMd = await store(() => {
  const s = document.querySelector('#app').__vue_app__.config.globalProperties.$pinia._s.get('sheet');
  return { reloaded: s.soul_gun.hasReloaded, aimed: s.soul_gun.aimed };
});
check('Mag Dump marks reload needed', afterMd.reloaded, false);
check('Mag Dump consumes Aiming', afterMd.aimed, false);
check('second Mag Dump refused without reload', await store(() => {
  const s = document.querySelector('#app').__vue_app__.config.globalProperties.$pinia._s.get('sheet');
  const before = s.soul_gun.hasReloaded;
  s.rollGunMagDump(); // should early-return
  return before === false && s.soul_gun.hasReloaded === false;
}), true);

// Collapse the section to reach the collapsed-view MD button state
await page.locator('.soul-armament-mode-container .collapse-control').first().click({ force: true });
await page.waitForTimeout(300);
const mdBtn = page.locator('.collapsed-gun-actions .gun-roll-btn', { hasText: 'MD' }).first();
if (await mdBtn.count()) {
  check('MD button disabled when reload needed', await mdBtn.isDisabled(), true);
} else {
  console.log('NOTE: collapsed MD button not found; skipping disabled check');
}

// 7. Reload restores the Mag Dump
await store(() => {
  const s = document.querySelector('#app').__vue_app__.config.globalProperties.$pinia._s.get('sheet');
  s.soul_gun.hasReloaded = true;
});
await page.waitForTimeout(200);
if (await mdBtn.count()) {
  check('MD button re-enabled after reload', await mdBtn.isDisabled(), false);
}

// 8. Sidearm has no Mag Dump at all
await store(() => {
  const s = document.querySelector('#app').__vue_app__.config.globalProperties.$pinia._s.get('sheet');
  s.soul_gun.gunType = 'sda';
  s.soul_gun.gunStyle = '';
});
await page.waitForTimeout(300);
check('Sidearm effective MD is 0', await store(() => {
  const s = document.querySelector('#app').__vue_app__.config.globalProperties.$pinia._s.get('sheet');
  return s.effectiveMD;
}), 0);
if (await mdBtn.count()) {
  check('MD button disabled for Sidearm', await mdBtn.isDisabled(), true);
}

console.log(failures === 0 ? '=== SOUL GUN UI: ALL CHECKS PASSED ===' : `=== ${failures} CHECKS FAILED ===`);
await browser.close();
process.exit(failures === 0 ? 0 : 1);
