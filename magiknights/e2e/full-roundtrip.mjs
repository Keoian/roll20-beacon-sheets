import { chromium } from 'playwright';
import { readFileSync } from 'fs';

const OUT = 'e2e/output';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('dialog', d => d.accept());
page.on('pageerror', e => console.log('PAGEERR: ' + e.message.slice(0, 150)));

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

// ---------- Populate essentially every persisted field with non-defaults ----------
await page.evaluate(() => {
  const vm = document.querySelector('#app').__vue_app__;
  const pinia = vm.config.globalProperties.$pinia;
  const sheet = pinia._s.get('sheet');
  const meta = pinia._s.get('meta');

  if (meta) { meta.name = 'Roundtrip Hero'; }

  // scalars
  sheet.sheet_mode = 'pc';
  sheet.isTransformed = true;
  sheet.studentTokenImage = 'https://example.com/student.png';
  sheet.knightTokenImage = 'https://example.com/knight.png';
  sheet.level = 9;
  sheet.reputation = 4;
  sheet.player = 'Tester';
  sheet.inspiration = 2;
  sheet.stress = 3;
  sheet.exhaustion = 2;
  sheet.rollMode = 'advantage';
  sheet.student_type = 'Spiritual';
  sheet.customProficiency = '';
  sheet.elemental_affinity = 'void';
  sheet.magic_style = 'Soul';
  sheet.element_name = 'Starlight';
  sheet.mam = 'wisdom';
  sheet.elemental_enhancement_1 = 'hpPerLevel';
  sheet.elemental_enhancement_2 = 'armor';
  sheet.roll_resist_proficiency = 'Using your Magic Ability Modifier';
  sheet.gloom_gems = 120;
  sheet.unity_points = 2;
  sheet.rested = true;
  sheet.studied = true;
  sheet.studiedCombat = true;
  sheet.studiedSchool = true;
  sheet.wellFed = true;
  sheet.budgetTallies = 5;
  sheet.trainingTallies = 3;
  sheet.clubTallies = 4;
  sheet.clubPosition = 'president';
  sheet.detentionTickets = 1;
  sheet.resoundingGrowths = 2;
  sheet.fortunePool = 2;
  sheet.fortunePoolEnabled = true;
  sheet.masteredSkill = 'mysticism';
  sheet.statIncreases = [{ level: 3, type: '+2', stat: 'wisdom' }, { level: 6, type: '+1/+1', stats: ['constitution', 'charisma'] }];
  sheet.enduranceDieEnabled = false;
  sheet.freakingOutToday = true;
  sheet.sleepEffect = 'feverish';
  sheet.sealImplantGiven = true;
  sheet.sealImplantReceived = true;
  sheet.soulSacrificeCount = 1;
  sheet.totalFocus = true;
  sheet.veilPiercingUsed = true;
  sheet.manaConduitUsed = true;
  sheet.energySurgeUsed = true;
  sheet.isFlying = true;
  sheet.activeCombatForm = 'formIII';
  sheet.combatFormsCollapsed = false;
  sheet.levelAbilitiesCollapsed = true;
  sheet.releaseMagicCollapsed = false;
  sheet.formationsCollapsed = false;
  sheet.combosCollapsed = false;
  sheet.activeFormation = 'arrow';
  sheet.comboParticipants = 3;
  sheet.signatureCard1 = 'king';
  sheet.signatureCard2 = 'light';
  sheet.divinationTier = 5;
  sheet.npc_role = 'brute';
  sheet.npc_name = 'Test Outsider';
  sheet.npc_type = 'nemesis';
  sheet.npc_size = 'Huge';
  sheet.npc_creature_type = 'Outsider';
  sheet.npc_armor = 17;
  sheet.npc_move = 40;
  sheet.npc_invasion_level = 3;
  sheet.npc_horrific_rating = '13';
  sheet.npc_physical_check = 6;
  sheet.npc_magical_check = 4;
  sheet.npc_inert_spectral_energy = '4d8';
  sheet.npc_whisper_rolls = true;
  sheet.npc_notes = 'test notes';
  sheet.npc_sheet_type = 'monster';
  sheet.npc_social_name = 'Ms. Chalk';
  sheet.npc_social_role = 'Teacher';
  sheet.npc_social_heart_stage = 'cooperative';

  // nested objects / arrays
  sheet.abilityScores.strength.score = 12;
  sheet.abilityScores.dexterity.score = 14;
  sheet.abilityScores.constitution.score = 13;
  sheet.abilityScores.intelligence.score = 15;
  sheet.abilityScores.wisdom.score = 16;
  sheet.abilityScores.charisma.score = 11;
  sheet.skills.mysticism.proficiency = true;
  sheet.skills.athletics.ability = 'strength';
  sheet.skills.stealth.overrideValue = 7;
  sheet.hp.current = 40; sheet.hp.temp = 5;
  sheet.mp.current = 12;
  sheet.shp.current = 9;
  sheet.crystal.facet1 = true; sheet.crystal.facet4 = true;
  sheet.eclipse_blips.splice(0, 8, 1, 2, 0, 3, 1, 0, 2, 0);
  sheet.eclipse.splice(0, 8, 1, 0, 0, 2, 0, 0, 0, 0);
  sheet.conditions.bleeding = true;
  sheet.conditions.soulSiphoned2 = true;
  sheet.resistModifiers.magic.advantage = true;
  sheet.resistModifiers.purity.disadvantage = true;
  sheet.combatFormsKnown.formIII = true;
  sheet.combatFormsKnown.formX = true;
  sheet.combatFormMastery.formIII = true;
  sheet.student_ability.name = 'Self-Disciplined';
  sheet.student_ability.description = 'WIS ability';
  sheet.fate.card = 'queen';
  sheet.fate.name = 'New Person';
  sheet.armor_weave.selected = 'lightningDust';
  sheet.armor_weave.name = 'Lightning Dust Weave';
  sheet.armor_weave.description = 'zap';
  sheet.soul_weapon.name = 'Test Blade';
  sheet.soul_weapon.range = 'Melee (5ft)';
  sheet.soul_weapon.damage = '1d8';
  sheet.soul_weapon.damageType = 'magical';
  sheet.soul_weapon.qualities.accurate = true;
  sheet.soul_weapon.qualities.vicious = true;
  sheet.soul_gun.name = 'Test Gun';
  sheet.soul_gun.gunType = 'dmr';
  sheet.soul_gun.gunStyle = '';
  sheet.soul_gun.firingPoolBonus = 1;
  sheet.soul_gun.hasReloaded = false;
  if ('aimed' in sheet.soul_gun) sheet.soul_gun.aimed = true;
  sheet.soul_gun.attachments = [{ name: 'Standard Scope', type: 'scope', effect: '+1 pool' }];
  sheet.magical_implement.name = 'Test Wand';
  sheet.magical_implement.description = '1d4';
  sheet.magical_implement.qualities.manaAttunement = true;
  sheet.magical_implement.qualities.warding = true;
  sheet.herald.name = 'Puffy';
  sheet.herald.bondLevel = 4;
  sheet.herald.notes = 'herald notes';
  sheet.squire.name = 'Pip';
  sheet.squire.level = 9;
  sheet.squire.healthBlips.splice(0, 6, true, true, false, true, true, false);
  sheet.squire.manaBlips.splice(0, 3, true, false, true);
  sheet.squire.spellPath1 = 'Beam';
  sheet.squire.spellPath2 = 'Curing';
  sheet.squire.skills = 'Athletics, Stealth';
  sheet.squire.notes = 'squire notes';
  sheet.visor.type = 'virtualHUD';
  sheet.elementalSummon.name = 'Void Wisp';
  sheet.elementalSummon.hp = 12;
  sheet.elementalSummon.hpMax = 15;
  sheet.elementalSummon.armor = 13;
  sheet.elementalSummon.attack = 4;
  sheet.elementalSummon.damage = '1d6+2';
  sheet.elementalSummon.active = true;
  sheet.npc_hp.current = 60; sheet.npc_hp.max = 80;
  sheet.npc_horde_hp[0].current = 5; sheet.npc_horde_hp[0].defeated = true;
  sheet.npc_primary_attack.name = 'Claw';
  sheet.npc_primary_attack.attackBonus = 7;
  sheet.npc_primary_attack.damage = '2d6+3';
  sheet.npc_traits.push({ name: 'Horrific Presence', description: 'scary' });

  // repeating sections: one populated row each
  const rows = {
    techniques: { name: 'Counter Blast', type: 'Battle', levelRequired: 5, frequency: '1/Turn', maxUses: 1, usesRemaining: 0, actionType: 'Reaction', description: 'reduce dmg' },
    tactics: { name: 'Adept of Magic', effectType: 'Passive', automaticBonus: '+1 Rep for MCO', active: true, prerequisites: 'None' },
    shards: { name: 'Shard of Confidence', rarity: 2, cost: '8', description: '+1d12 next check' },
    gear: { name: 'Rope', description: '50ft hemp' },
    relics: { name: 'Cursed Mirror', description: 'spooky' },
    forms: { name: 'Custom Form Note', description: 'notes' },
    runes: { name: 'Deflection', slotCost: 2, description: '+1 resists' },
    spells: { name: 'Beam', range: '60ft', tier_I_name: 'Beam I', tier_I_dice: '3d8' },
    'npc-social': { name: 'Choco', points: 25, bond_ability: 'Friendly Assistance', heartStage: 'friendly' },
    'squadron-social': { name: 'Riko', points: 55, bond_ability: 'Synchronized Teamwork', heartStage: 'caring' },
    'club-goalTallies': { name: 'Budget', description: '3 tallies' }
  };
  for (const [section, data] of Object.entries(rows)) {
    sheet.addRow(section);
    const row = sheet.sections[section].rows[sheet.sections[section].rows.length - 1];
    Object.assign(row, data);
  }

  // deck systems
  sheet.initializeReleaseDeck();
  sheet.drawInitialHand();
  sheet.divineTheFuture();
  sheet.divinationSlots[1].expended = true;

  // bio
  sheet.interests = 'trains';
  sheet.virtues = 'honesty';
  sheet.strengths = 'brave';
  sheet.weaknesses = 'sweets';
  sheet.electives = 'kendo club';
  sheet.characteristics = 'tall';
  sheet.quote = 'onward';
  sheet.player_links = 'link1';
  sheet.backstory = 'a long story';
});
await page.waitForTimeout(500);

// ---------- Export through the UI ----------
await page.locator('a[href="/settings"]').first().click();
await page.waitForTimeout(500);
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByText('Export JSON', { exact: true }).click()
]);
const exportPath = `${OUT}/full-roundtrip.json`;
await download.saveAs(exportPath);
const exported = JSON.parse(readFileSync(exportPath, 'utf8'));

// ---------- Fresh page, import through the UI, re-serialize ----------
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.locator('a[href="/settings"]').first().click();
await page.waitForTimeout(500);
await page.locator('.import-btn input[type="file"]').setInputFiles(exportPath);
await page.waitForTimeout(1200);

const reserialized = await page.evaluate(() => {
  const vm = document.querySelector('#app').__vue_app__;
  const app = vm.config.globalProperties.$pinia._s.get('app');
  return JSON.parse(JSON.stringify(app.dehydrateStore()));
});

// ---------- Deep diff every key ----------
const diffs = [];
function diff(a, b, path) {
  if (typeof a !== typeof b) { diffs.push(`${path}: type ${typeof a} vs ${typeof b} (${JSON.stringify(a)} vs ${JSON.stringify(b)})`); return; }
  if (a && typeof a === 'object') {
    const keys = new Set([...Object.keys(a), ...Object.keys(b || {})]);
    for (const k of keys) diff(a[k], (b || {})[k], `${path}.${k}`);
    return;
  }
  if (a !== b) diffs.push(`${path}: ${JSON.stringify(a)} -> ${JSON.stringify(b)}`);
}
diff(exported, reserialized, 'root');

const total = (function count(o) { return o && typeof o === 'object' ? Object.values(o).reduce((n, v) => n + count(v), 0) : 1 })(exported);
console.log(`Compared ~${total} leaf fields.`);
if (diffs.length === 0) {
  console.log('=== FULL ROUND-TRIP: every exported field matches after import ===');
} else {
  console.log(`=== ${diffs.length} FIELD MISMATCHES ===`);
  diffs.slice(0, 40).forEach(d => console.log(d));
}
await browser.close();
process.exit(diffs.length ? 1 : 0);
