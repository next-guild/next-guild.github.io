import gwSkillData from '../data/gwSkillData';
import gwConsumableData from '../data/gwConsumableData';
import gwTitleData from '../data/gwTitleData';

const PROFESSION_IDS = ['?', 'W', 'R', 'Mo', 'N', 'Me', 'E', 'A', 'Rt', 'P', 'D'];

const PROFESSION_NAMES = {
    '?': 'No profession',
    W: 'Warrior',
    R: 'Ranger',
    Mo: 'Monk',
    N: 'Necromancer',
    Me: 'Mesmer',
    E: 'Elementalist',
    A: 'Assassin',
    Rt: 'Ritualist',
    P: 'Paragon',
    D: 'Dervish',
};

const ATTRIBUTE_IDS = {
    0: 'fas',
    1: 'ill',
    2: 'dom',
    3: 'ins',
    4: 'blo',
    5: 'death',
    6: 'sou',
    7: 'cur',
    8: 'air',
    9: 'ear',
    10: 'fir',
    11: 'wat',
    12: 'ene',
    13: 'hea',
    14: 'smi',
    15: 'pro',
    16: 'div',
    17: 'str',
    18: 'axe',
    19: 'ham',
    20: 'swo',
    21: 'tac',
    22: 'bea',
    23: 'exp',
    24: 'wil',
    25: 'mar',
    29: 'dag',
    30: 'dead',
    31: 'sha',
    32: 'com',
    33: 'res',
    34: 'cha',
    35: 'cri',
    36: 'spa',
    37: 'spe',
    38: 'comma',
    39: 'mot',
    40: 'lea',
    41: 'scy',
    42: 'win',
    43: 'earthp',
    44: 'mys',
};

const ATTRIBUTE_NAMES = {
    fas: 'Fast Casting',
    ill: 'Illusion Magic',
    dom: 'Domination Magic',
    ins: 'Inspiration Magic',
    blo: 'Blood Magic',
    death: 'Death Magic',
    sou: 'Soul Reaping',
    cur: 'Curses',
    air: 'Air Magic',
    ear: 'Earth Magic',
    fir: 'Fire Magic',
    wat: 'Water Magic',
    ene: 'Energy Storage',
    hea: 'Healing Prayers',
    smi: 'Smiting Prayers',
    pro: 'Protection Prayers',
    div: 'Divine Favor',
    str: 'Strength',
    axe: 'Axe Mastery',
    ham: 'Hammer Mastery',
    swo: 'Swordsmanship',
    tac: 'Tactics',
    bea: 'Beast Mastery',
    exp: 'Expertise',
    wil: 'Wilderness Survival',
    mar: 'Marksmanship',
    dag: 'Dagger Mastery',
    dead: 'Deadly Arts',
    sha: 'Shadow Arts',
    com: 'Communing',
    res: 'Restoration Magic',
    cha: 'Channeling Magic',
    cri: 'Critical Strikes',
    spa: 'Spawning Power',
    spe: 'Spear Mastery',
    comma: 'Command',
    mot: 'Motivation',
    lea: 'Leadership',
    scy: 'Scythe Mastery',
    win: 'Wind Prayers',
    earthp: 'Earth Prayers',
    mys: 'Mysticism',
};

const BASE64_VALUES = Object.fromEntries(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
        .split('')
        .map((char, index) => [char, index]),
);

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function bitsToInt(bits) {
    return parseInt(String(bits).split('').reverse().join(''), 2);
}

function templateToBits(templateCode) {
    let bits = '';
    for (const char of String(templateCode).trim()) {
        const value = BASE64_VALUES[char];
        if (value == null) {
            return null;
        }

        const reversedBits = value.toString(2).split('').reverse().join('');
        bits += reversedBits.padEnd(6, '0');
    }
    return bits;
}

function parseAttributes(attributeText) {
    const attrs = {};
    const source = String(attributeText ?? '');
    const matcher = /([a-z][\w-]*)=(?:"([^"]*)"|'([^']*)'|([^\s\]]+))/gi;
    let match;

    while ((match = matcher.exec(source)) !== null) {
        attrs[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
    }

    const doubledQuoteMatcher = /([a-z][\w-]*)=""([^"]*?)""(?=\s|$)/gi;
    while ((match = doubledQuoteMatcher.exec(source)) !== null) {
        attrs[match[1].toLowerCase()] = `"${match[2]}"`;
    }

    return attrs;
}

function normalizeSkillName(name) {
    return String(name ?? '')
        .trim()
        .replace(/['"!]/g, '')
        .toLowerCase();
}

function normalizeConsumableName(name) {
    return String(name ?? '')
        .trim()
        .replace(/['"!]/g, '')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .toLowerCase();
}

function getConsumableByName(name) {
    const normalized = normalizeConsumableName(name);
    const id = gwConsumableData.consumableIdsByName[normalized];

    if (id) {
        return gwConsumableData.consumables[id] || null;
    }

    return null;
}

function getTitleByName(name) {
    const normalized = normalizeConsumableName(name);
    const id = gwTitleData.titleIdsByName[normalized];

    if (id) {
        return gwTitleData.titles[id] || null;
    }

    return null;
}

function getSkillById(id) {
    return gwSkillData.skillsById[String(id)] || null;
}

function getSkillByName(name) {
    const normalized = normalizeSkillName(name);
    const expandedName = gwSkillData.abbreviations[normalized];
    const lookupName = expandedName ? normalizeSkillName(expandedName) : normalized;
    const exactId = gwSkillData.skillIdsByName[lookupName];

    if (exactId != null) {
        return getSkillById(exactId);
    }

    if (lookupName.length >= 4) {
        const partialName = Object.keys(gwSkillData.skillIdsByName).find((skillName) => skillName.startsWith(lookupName));
        if (partialName) {
            return getSkillById(gwSkillData.skillIdsByName[partialName]);
        }
    }

    return null;
}

function getSkillNameById(id) {
    return getSkillById(id)?.name || `Unknown skill id ${id}`;
}

export function templateToGwbbcode(input) {
    let templateCode = String(input ?? '').trim();
    let buildName = '';
    const namedTemplate = templateCode.match(/^([^\[\];]+);([^;\]\s]+)$/);

    if (namedTemplate) {
        buildName = namedTemplate[1].trim();
        templateCode = namedTemplate[2].trim();
    }

    let bits = templateToBits(templateCode);
    if (!bits) {
        return { error: 'Invalid template characters' };
    }

    if (bits.startsWith('0111')) {
        bits = bits.slice(4);
    }

    const header = bits.match(/^([01]{6})([01]{4})([01]{4})([01]{4})([01]{4})/);
    if (!header) {
        return { error: 'Could not decode build template' };
    }

    if (header[1] !== '000000') {
        return { error: 'Invalid build header' };
    }

    let cursor = header[0].length;
    const primary = PROFESSION_IDS[bitsToInt(header[2])] || '?';
    const secondary = PROFESSION_IDS[bitsToInt(header[3])] || '?';
    const attributeCount = bitsToInt(header[4]);
    const attributeBitSize = 4 + bitsToInt(header[5]);
    const attrs = [];

    for (let index = 0; index < attributeCount; index += 1) {
        const attributeBits = bits.slice(cursor, cursor + attributeBitSize);
        const valueBits = bits.slice(cursor + attributeBitSize, cursor + attributeBitSize + 4);
        if (attributeBits.length !== attributeBitSize || valueBits.length !== 4) {
            return { error: 'Could not decode attribute block' };
        }

        cursor += attributeBitSize + 4;
        const attributeId = bitsToInt(attributeBits);
        const key = ATTRIBUTE_IDS[attributeId] || `attr${attributeId}`;
        attrs.push([key, bitsToInt(valueBits)]);
    }

    const skillSizeBits = bits.slice(cursor, cursor + 4);
    if (skillSizeBits.length !== 4) {
        return { error: 'Could not decode skill size' };
    }

    cursor += 4;
    const skillBitSize = 8 + bitsToInt(skillSizeBits);
    const skills = [];

    for (let index = 0; index < 8; index += 1) {
        const skillBits = bits.slice(cursor, cursor + skillBitSize);
        if (skillBits.length !== skillBitSize) {
            return { error: 'Could not decode skill id' };
        }

        cursor += skillBitSize;
        const skillId = bitsToInt(skillBits);
        if (skillId !== 0) {
            skills.push(getSkillNameById(skillId));
        }
    }

    return {
        attrs,
        buildName,
        primary,
        secondary,
        skills,
        templateCode,
    };
}

export function buildToBbcode(build) {
    if (build.error) {
        return `[build error="${build.error}"][/build]`;
    }

    const attrText = build.attrs.map(([key, value]) => `${key}=${value}`).join(' ');
    const nameText = build.buildName ? ` name="${build.buildName.replace(/"/g, "''")}"` : '';
    const buildAttrs = [`prof=${build.primary}/${build.secondary}`, attrText, nameText.trim()]
        .filter(Boolean)
        .join(' ');
    const skills = build.skills.map((skillName) => `[${skillName}]`).join('');

    return `[build ${buildAttrs}]${skills}[/build]`;
}

function wikiUrl(pageName) {
    return `https://wiki.guildwars.com/wiki/${encodeURIComponent(pageName.replaceAll(' ', '_'))}`;
}

function formatSkillFacts(skill) {
    if (!skill) {
        return '';
    }

    return [
        skill.elite ? 'Elite' : '',
        skill.profession && skill.profession !== 'No Profession' ? skill.profession : '',
        skill.attribute && skill.attribute !== 'No Attribute' ? skill.attribute : '',
        skill.type,
    ]
        .filter(Boolean)
        .join(' / ');
}

function formatRequirement(label, value) {
    if (!value || Number(value) === 0) {
        return '';
    }

    return `<span>${escapeHtml(label)} ${escapeHtml(value)}</span>`;
}

function renderSkillDetails(skill) {
    const facts = formatSkillFacts(skill);
    const factsHtml = facts ? `<span class="gwbbcode-skill__facts">${escapeHtml(facts)}</span>` : '';
    const requirementHtml = skill
        ? [
            formatRequirement('E', skill.energy),
            formatRequirement('A', skill.adrenaline),
            formatRequirement('Cast', skill.casting),
            formatRequirement('Recharge', skill.recharge),
        ].filter(Boolean).join('')
        : '';
    const requirements = requirementHtml ? `<span class="gwbbcode-skill__requirements">${requirementHtml}</span>` : '';
    const description = skill?.desc ? `<span class="gwbbcode-skill__description">${escapeHtml(skill.desc)}</span>` : '';

    return `${factsHtml}${requirements}${description}`;
}

function renderSkill(name, options = {}) {
    const skill = getSkillByName(name);
    const resolvedName = skill?.name || name;
    const shownName = options.show || resolvedName;
    const noIconClass = options.noicon ? ' gwbbcode-skill--no-icon' : '';
    const eliteClass = skill?.elite ? ' gwbbcode-skill--elite' : '';
    const cardClass = options.variant === 'card' || options.card ? ' gwbbcode-skill--card' : ' gwbbcode-skill--inline';
    const imageHtml = skill && !options.noicon
        ? `<img class="gwbbcode-skill__icon" src="/gwbbcode/skills/${skill.id}.jpg" alt="" loading="lazy" />`
        : '';
    const details = renderSkillDetails(skill);
    const title = skill?.desc ? ` title="${escapeHtml(`${resolvedName}: ${skill.desc}`)}"` : '';

    if (options.variant === 'card' || options.card) {
        return `<a class="gwbbcode-skill${cardClass}${noIconClass}${eliteClass}" href="${wikiUrl(resolvedName)}" target="_blank" rel="noreferrer"${title}>${imageHtml}<span class="gwbbcode-skill__body"><span class="gwbbcode-skill__name">${escapeHtml(shownName)}</span>${details}</span></a>`;
    }

    const tooltip = skill
        ? `<span class="gwbbcode-skill__tooltip" role="tooltip">${imageHtml}<span class="gwbbcode-skill__body"><span class="gwbbcode-skill__name">${escapeHtml(resolvedName)}</span>${details}</span></span>`
        : '';

    return `<a class="gwbbcode-skill${cardClass}${noIconClass}${eliteClass}" href="${wikiUrl(resolvedName)}" target="_blank" rel="noreferrer">${imageHtml}<span class="gwbbcode-skill__name">${escapeHtml(shownName)}</span>${tooltip}</a>`;
}

function renderSkillIcon(name, options = {}) {
    const skill = getSkillByName(name);
    const resolvedName = skill?.name || name;
    const shownName = options.show || resolvedName;
    const eliteClass = skill?.elite ? ' gwbbcode-skill-icon--elite' : '';
    const imageHtml = skill
        ? `<img class="gwbbcode-skill-icon__image" src="/gwbbcode/skills/${skill.id}.jpg" alt="${escapeHtml(resolvedName)}" loading="lazy" />`
        : `<span class="gwbbcode-skill-icon__missing">${escapeHtml(shownName.slice(0, 2))}</span>`;
    const details = renderSkillDetails(skill);
    const tooltip = `<span class="gwbbcode-skill__tooltip gwbbcode-skill-icon__tooltip" role="tooltip">${skill ? `<img class="gwbbcode-skill__icon" src="/gwbbcode/skills/${skill.id}.jpg" alt="" loading="lazy" />` : ''}<span class="gwbbcode-skill__body"><span class="gwbbcode-skill__name">${escapeHtml(resolvedName)}</span>${details}</span></span>`;

    return `<a class="gwbbcode-skill-icon${eliteClass}" href="${wikiUrl(resolvedName)}" target="_blank" rel="noreferrer" aria-label="${escapeHtml(shownName)}">${imageHtml}${tooltip}</a>`;
}

function renderCopyButton(templateCode, label = 'Copy') {
    if (!templateCode) {
        return '';
    }

    return `<button type="button" class="gwbbcode-copy" data-template="${escapeHtml(templateCode)}" aria-label="${escapeHtml(label)} build code" title="${escapeHtml(label)} build code"><img class="gwbbcode-copy__icon" src="/gwbbcode/ui/copy.svg" alt="" loading="lazy" /><span class="gwbbcode-copy__label">${escapeHtml(label)}</span></button>`;
}

function renderConsumable(name) {
    const consumable = getConsumableByName(name);
    const label = consumable?.name || String(name ?? '').trim();
    const imageHtml = consumable
        ? `<img class="gwbbcode-consumable__icon" src="${escapeHtml(consumable.image)}" alt="" loading="lazy" />`
        : '';
    const missingClass = consumable ? '' : ' gwbbcode-consumable--missing';

    return `<span class="gwbbcode-consumable${missingClass}" title="${escapeHtml(label)}">${imageHtml}<span class="gwbbcode-consumable__name">${escapeHtml(label)}</span></span>`;
}

const CONSUMABLE_ITEM_TAG = '(?:con|pcon|consumable|item)';
const CONSUMABLE_GROUP_TAG = '(?:cons|pcons|consumables)';
const TITLE_ITEM_TAG = '(?:title|rank)';
const TITLE_GROUP_TAG = '(?:titles|ranks)';
const RARITIES = new Set(['green', 'gold', 'purple', 'blue', 'white']);

function renderConsumableHeader(text) {
    return `<div class="gwbbcode-consumables__section-header">${escapeHtml(text)}</div>`;
}

function extractConsumableItems(inner) {
    const items = [];
    const source = String(inner ?? '');
    const matcher = new RegExp(
        `\\[header\\]([\\s\\S]*?)\\[\\/header\\]|\\[${CONSUMABLE_ITEM_TAG}(?:\\s+[^\\]]*)?\\]([\\s\\S]*?)\\[\\/${CONSUMABLE_ITEM_TAG}\\]|\\[([^\\[\\]\\r\\n]+)\\]`,
        'gi',
    );
    let match;

    while ((match = matcher.exec(source)) !== null) {
        const header = match[1]?.trim();
        const taggedItem = match[2]?.trim();
        const shorthandItem = match[3]?.trim();

        if (header) {
            items.push({ type: 'header', text: header });
        } else if (taggedItem) {
            items.push({ type: 'consumable', name: taggedItem });
        } else if (shorthandItem) {
            items.push({ type: 'consumable', name: shorthandItem });
        }
    }

    return items;
}

function renderConsumables(attributeText, inner) {
    const attrs = parseAttributes(attributeText);
    const title = attrs.name || attrs.title || 'Personal consumables';
    const items = extractConsumableItems(inner);
    const itemHtml = items.length
        ? items.map((item) => (item.type === 'header' ? renderConsumableHeader(item.text) : renderConsumable(item.name))).join('')
        : '<span class="gwbbcode-build__empty">No consumables listed</span>';

    return [
        '<div class="gwbbcode-consumables">',
        `<div class="gwbbcode-consumables__header">${escapeHtml(title)}</div>`,
        `<div class="gwbbcode-consumables__items">${itemHtml}</div>`,
        '</div>',
    ].join('');
}

function renderTitle(attributeText, content = '') {
    const attrs = parseAttributes(attributeText);
    const rawName = attrs.name || attrs.title || content.trim();
    const rank = attrs.rank || attrs.value || attrs.level || '';
    const title = getTitleByName(rawName);
    const label = title?.name || rawName;
    const imageHtml = title
        ? `<img class="gwbbcode-title__icon" src="${escapeHtml(title.image)}" alt="" loading="lazy" />`
        : '';
    const missingClass = title ? '' : ' gwbbcode-title--missing';
    const rankHtml = rank ? `<span class="gwbbcode-title__rank">${escapeHtml(rank)}</span>` : '';

    return `<span class="gwbbcode-title${missingClass}" title="${escapeHtml(label)}">${imageHtml}<span class="gwbbcode-title__name">${escapeHtml(label)}</span>${rankHtml}</span>`;
}

function renderTitles(attributeText, inner) {
    const attrs = parseAttributes(attributeText);
    const title = attrs.name || attrs.title || 'Titles';
    const titles = [];
    let normalized = String(inner || '');

    normalized = normalized.replace(new RegExp(`\\[${TITLE_ITEM_TAG}(?:\\s+([^\\]]*))?\\]([\\s\\S]*?)\\[\\/${TITLE_ITEM_TAG}\\]`, 'gi'), (_all, titleAttrs = '', content = '') => {
        titles.push(renderTitle(titleAttrs, content));
        return '';
    });

    normalized = normalized.replace(/\[title(?:\s+([^\]]*))?\](?:\[\/title\])?/gi, (_all, titleAttrs = '') => {
        titles.push(renderTitle(titleAttrs));
        return '';
    });

    normalized.replace(/\[([^\[\]\r\n]+)\]/g, (_all, titleName) => {
        const trimmed = titleName.trim();
        if (trimmed) {
            titles.push(renderTitle(`name="${trimmed.replace(/"/g, '&quot;')}"`));
        }
        return '';
    });

    return [
        '<div class="gwbbcode-titles">',
        `<div class="gwbbcode-titles__header">${escapeHtml(title)}</div>`,
        `<div class="gwbbcode-titles__items">${titles.length ? titles.join('') : '<span class="gwbbcode-build__empty">No titles listed</span>'}</div>`,
        '</div>',
    ].join('');
}

function renderInlineItemText(value) {
    return escapeHtml(value)
        .replace(/(&quot;.*?&quot;)/g, '<span class="gwbbcode-gear__primary">$1</span>')
        .replace(/(\([^)]*\))/g, '<span class="gwbbcode-gear__muted">$1</span>');
}

function renderGearText(value) {
    return escapeHtml(value)
        .replace(/(\([^)]*\))/g, '<span class="gwbbcode-gear__muted">$1</span>');
}

function rarityClass(rarity) {
    const normalized = String(rarity || '').trim().toLowerCase();
    return RARITIES.has(normalized) ? ` gwbbcode-rarity--${normalized}` : '';
}

function renderArmorRow(attributeText) {
    const attrs = parseAttributes(attributeText);
    const piece = attrs.piece || attrs.slot || attrs.type || 'Armor piece';
    const base = attrs.base || '';
    const rating = attrs.rating || attrs.armor || '';
    const rune = attrs.rune || '';
    const insignia = attrs.insignia || '';

    return [
        '<div class="gwbbcode-armor">',
        `<div class="gwbbcode-armor__piece">${escapeHtml(piece)}</div>`,
        '<div class="gwbbcode-armor__mods">',
        base ? `<div><span>Base</span>${renderInlineItemText(base)}</div>` : '',
        rating ? `<div><span>Armor</span>${escapeHtml(rating)}</div>` : '',
        rune ? `<div><span>Rune</span>${renderInlineItemText(rune)}</div>` : '',
        insignia ? `<div><span>Insignia</span>${renderInlineItemText(insignia)}</div>` : '',
        '</div>',
        '</div>',
    ].join('');
}

function renderModLine(attributeText, content = '') {
    const attrs = parseAttributes(attributeText);
    const name = attrs.name || attrs.mod || attrs.inscription || '';
    const effect = attrs.effect || attrs.text || content.trim();
    const normalizedName = String(name).trim()
        .replace(/^&quot;/i, '"')
        .replace(/&quot;$/i, '"')
        .replace(/^&#34;/i, '"')
        .replace(/&#34;$/i, '"');
    const escapedName = escapeHtml(normalizedName);
    const isInscription = /^".*"$/.test(normalizedName);

    return [
        '<div class="gwbbcode-weapon-mod">',
        isInscription ? `<div class="gwbbcode-weapon-mod__name">Inscription ${escapedName}</div>` : '',
        effect ? `<div class="gwbbcode-weapon-mod__effect">${renderGearText(effect)}</div>` : '',
        '</div>',
    ].join('');
}

function renderWeapon(attributeText, inner) {
    const attrs = parseAttributes(attributeText);
    const type = attrs.type || attrs.slot || 'Weapon';
    const name = attrs.name || type;
    const baseStats = [attrs.base, attrs.base2, attrs.base3].filter(Boolean);
    const stat = attrs.stat || attrs.stats || attrs.damage || attrs.energy || '';
    const rarity = rarityClass(attrs.rarity || attrs.color);
    const lines = [];

    String(inner || '').replace(/\[mod(?:\s+([^\]]*))?\]([\s\S]*?)\[\/mod\]/gi, (_all, modAttrs = '', content = '') => {
        lines.push(renderModLine(modAttrs, content));
        return '';
    });

    String(inner || '').replace(/\[line(?:\s+([^\]]*))?\]([\s\S]*?)\[\/line\]/gi, (_all, lineAttrs = '', content = '') => {
        lines.push(renderModLine(lineAttrs, content));
        return '';
    });

    return [
        `<div class="gwbbcode-weapon gwbbcode-rarity${rarity}">`,
        `<strong class="gwbbcode-weapon__name">${escapeHtml(name)}</strong>`,
        ...baseStats.map((baseStat) => `<div class="gwbbcode-weapon__stat">${renderGearText(baseStat)}</div>`),
        stat ? `<div class="gwbbcode-weapon__stat">${renderGearText(stat)}</div>` : '',
        lines.length ? `<div class="gwbbcode-weapon__mods">${lines.join('')}</div>` : '',
        '</div>',
    ].join('');
}

function renderGear(attributeText, inner) {
    const attrs = parseAttributes(attributeText);
    const title = attrs.name || attrs.title || 'Role gear';
    const armorRows = [];
    const weaponRows = [];

    String(inner || '').replace(/\[armor(?:\s+([^\]]*))?\](?:\[\/armor\])?/gi, (_all, armorAttrs = '') => {
        armorRows.push(renderArmorRow(armorAttrs));
        return '';
    });

    String(inner || '').replace(/\[weapon(?:\s+([^\]]*))?\]([\s\S]*?)\[\/weapon\]/gi, (_all, weaponAttrs = '', weaponInner = '') => {
        weaponRows.push(renderWeapon(weaponAttrs, weaponInner));
        return '';
    });

    return [
        '<div class="gwbbcode-gear">',
        `<div class="gwbbcode-gear__header"><strong>${escapeHtml(title)}</strong></div>`,
        armorRows.length ? `<div class="gwbbcode-gear__section"><div class="gwbbcode-gear__section-title">Armor</div>${armorRows.join('')}</div>` : '',
        weaponRows.length ? `<div class="gwbbcode-gear__section"><div class="gwbbcode-gear__section-title">Weapons</div>${weaponRows.join('')}</div>` : '',
        '</div>',
    ].join('');
}

function renderAttributes(attrs) {
    const pairs = Object.entries(attrs)
        .filter(([key]) => ATTRIBUTE_NAMES[key] && /^\d+$/.test(attrs[key]))
        .map(([key, value]) => `<span><strong>${escapeHtml(value)}</strong> ${escapeHtml(ATTRIBUTE_NAMES[key])}</span>`);

    if (pairs.length === 0) {
        return '';
    }

    return `<div class="gwbbcode-build__attributes">${pairs.join('')}</div>`;
}

function extractSkills(inner) {
    const skills = [];
    let normalized = String(inner ?? '');

    normalized = normalized.replace(/\[skill([^\]]*)\]([\s\S]*?)\[\/skill\]/gi, (_all, rawAttrs, skillName) => {
        skills.push({
            attrs: parseAttributes(rawAttrs),
            name: skillName.trim(),
        });
        return '';
    });

    normalized.replace(/\[([^\[\]\r\n]+)\]/g, (_all, skillName) => {
        const trimmed = skillName.trim();
        if (!/^(?:build(?:\s|=|$)|\/build$|\/skill$|b$|\/b$|i$|\/i$|u$|\/u$|br$|url(?:=|$))/i.test(trimmed)) {
            skills.push({ attrs: {}, name: trimmed });
        }
        return '';
    });

    return skills.filter((skill) => skill.name);
}

function renderBuild(attributeText, inner, options = {}) {
    const attrs = parseAttributes(attributeText);
    const [primary = '?', secondary = '?'] = String(attrs.prof || '?/?').split('/');
    const title = attrs.name || options.name || 'Guild Wars build';
    const skills = extractSkills(inner);
    const display = attrs.display || attrs.mode || attrs.view || attrs.layout || options.display || '';

    if (/^(?:bar|compact|icons?)$/i.test(display)) {
        const skillIcons = skills.length
            ? skills.map((skill) => renderSkillIcon(skill.name, skill.attrs)).join('')
            : '<span class="gwbbcode-build__empty">No skills listed</span>';

        return [
            '<div class="gwbbcode-build-bar">',
            '<div class="gwbbcode-build-bar__meta">',
            `<strong>${escapeHtml(title)}</strong>`,
            `<span>${escapeHtml(primary)}/${escapeHtml(secondary)}</span>`,
            '</div>',
            `<div class="gwbbcode-build-bar__skills">${skillIcons}</div>`,
            renderCopyButton(options.templateCode),
            '</div>',
        ].join('');
    }

    const skillHtml = skills.length
        ? skills.map((skill) => renderSkill(skill.name, { ...skill.attrs, variant: 'card' })).join('')
        : '<span class="gwbbcode-build__empty">No skills listed</span>';
    const templateHtml = options.templateCode
        ? `<div class="gwbbcode-build__template"><code>${escapeHtml(options.templateCode)}</code>${renderCopyButton(options.templateCode)}</div>`
        : '';

    return [
        '<div class="gwbbcode-build">',
        '<div class="gwbbcode-build__header">',
        `<div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(PROFESSION_NAMES[primary] || primary)} / ${escapeHtml(PROFESSION_NAMES[secondary] || secondary)}</span></div>`,
        `<span class="gwbbcode-build__prof">${escapeHtml(primary)}/${escapeHtml(secondary)}</span>`,
        '</div>',
        renderAttributes(attrs),
        `<div class="gwbbcode-build__skills">${skillHtml}</div>`,
        templateHtml,
        '</div>',
    ].join('');
}

export function parseGwbbcode(text) {
    if (text == null) {
        return '';
    }

    let output = String(text).replace(/\r\n?/g, '\n');
    const protectedBlocks = [];

    output = output.replace(/\[(pre|nobb)\]([\s\S]*?)\[\/\1\]/gi, (_all, tag, content) => {
        const index = protectedBlocks.push(tag.toLowerCase() === 'pre' ? `<pre>${escapeHtml(content)}</pre>` : escapeHtml(content)) - 1;
        return `\u0000GWBBCODE_BLOCK_${index}\u0000`;
    });

    output = output.replace(/\[build=([^\]]+)\](?:\[\/build\])?/gi, (_all, templateCode) => {
        const decoded = templateToGwbbcode(templateCode);
        return decoded.error
            ? `<span class="gwbbcode-error">${escapeHtml(decoded.error)}</span>`
            : renderBuild(`prof=${decoded.primary}/${decoded.secondary}${decoded.buildName ? ` name="${decoded.buildName}"` : ''} ${decoded.attrs.map(([key, value]) => `${key}=${value}`).join(' ')}`, decoded.skills.map((skill) => `[${skill}]`).join(''), {
                templateCode: decoded.templateCode,
            });
    });

    output = output.replace(/\[bar=([^\]]+)\](?:\[\/bar\])?/gi, (_all, templateCode) => {
        const decoded = templateToGwbbcode(templateCode);
        return decoded.error
            ? `<span class="gwbbcode-error">${escapeHtml(decoded.error)}</span>`
            : renderBuild(`prof=${decoded.primary}/${decoded.secondary}${decoded.buildName ? ` name="${decoded.buildName}"` : ''} ${decoded.attrs.map(([key, value]) => `${key}=${value}`).join(' ')}`, decoded.skills.map((skill) => `[${skill}]`).join(''), {
                display: 'bar',
                templateCode: decoded.templateCode,
            });
    });

    output = output.replace(/\[bar\s+([^\]\r\n]+;[A-Za-z0-9+/]+)\]/g, (_all, templateCode) => {
        const decoded = templateToGwbbcode(templateCode);
        return decoded.error
            ? `<span class="gwbbcode-error">${escapeHtml(decoded.error)}</span>`
            : renderBuild(`prof=${decoded.primary}/${decoded.secondary}${decoded.buildName ? ` name="${decoded.buildName}"` : ''} ${decoded.attrs.map(([key, value]) => `${key}=${value}`).join(' ')}`, decoded.skills.map((skill) => `[${skill}]`).join(''), {
                display: 'bar',
                templateCode: decoded.templateCode,
            });
    });

    output = output.replace(/\[([^\]\r\n]+;[A-Za-z0-9+/]+)\]/g, (_all, templateCode) => {
        const decoded = templateToGwbbcode(templateCode);
        return decoded.error
            ? `<span class="gwbbcode-error">${escapeHtml(decoded.error)}</span>`
            : renderBuild(`prof=${decoded.primary}/${decoded.secondary}${decoded.buildName ? ` name="${decoded.buildName}"` : ''} ${decoded.attrs.map(([key, value]) => `${key}=${value}`).join(' ')}`, decoded.skills.map((skill) => `[${skill}]`).join(''), {
                templateCode: decoded.templateCode,
            });
    });

    output = output.replace(/\[gear(?:\s+([^\]]*))?\]([\s\S]*?)\[\/gear\]/gi, (_all, attrs, inner) => renderGear(attrs, inner));
    output = output.replace(new RegExp(`\\[${TITLE_GROUP_TAG}(?:\\s+([^\\]]*))?\\]([\\s\\S]*?)\\[\\/${TITLE_GROUP_TAG}\\]`, 'gi'), (_all, attrs, inner) => renderTitles(attrs, inner));
    output = output.replace(new RegExp(`\\[${TITLE_ITEM_TAG}(?:\\s+([^\\]]*))?\\]([\\s\\S]*?)\\[\\/${TITLE_ITEM_TAG}\\]`, 'gi'), (_all, attrs, name) => renderTitle(attrs, name.trim()));
    output = output.replace(/\[title(?:\s+([^\]]*))?\](?:\[\/title\])?/gi, (_all, attrs = '') => renderTitle(attrs));
    output = output.replace(new RegExp(`\\[${CONSUMABLE_GROUP_TAG}(?:\\s+([^\\]]*))?\\]([\\s\\S]*?)\\[\\/${CONSUMABLE_GROUP_TAG}\\]`, 'gi'), (_all, attrs, inner) => renderConsumables(attrs, inner));
    output = output.replace(new RegExp(`\\[${CONSUMABLE_ITEM_TAG}(?:\\s+[^\\]]*)?\\]([\\s\\S]*?)\\[\\/${CONSUMABLE_ITEM_TAG}\\]`, 'gi'), (_all, name) => renderConsumable(name.trim()));
    output = output.replace(/\[build\s+([^\]]*)\]([\s\S]*?)\[\/build\]/gi, (_all, attrs, inner) => renderBuild(attrs, inner));
    output = output.replace(/\[skill([^\]]*)\]([\s\S]*?)\[\/skill\]/gi, (_all, rawAttrs, name) => renderSkill(name.trim(), parseAttributes(rawAttrs)));
    output = output.replace(/\[b\]([\s\S]*?)\[\/b\]/gi, (_all, content) => `<strong>${escapeHtml(content)}</strong>`);
    output = output.replace(/\[i\]([\s\S]*?)\[\/i\]/gi, (_all, content) => `<em>${escapeHtml(content)}</em>`);
    output = output.replace(/\[u\]([\s\S]*?)\[\/u\]/gi, (_all, content) => `<u>${escapeHtml(content)}</u>`);
    output = output.replace(/\[br\]/gi, '<br/>');
    output = output.replace(/\[url=([^\]]+)\]([\s\S]*?)\[\/url\]/gi, (_all, href, label) => `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`);
    output = output.replace(/\[url\]([\s\S]*?)\[\/url\]/gi, (_all, href) => `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${escapeHtml(href)}</a>`);
    output = output.replace(/\[([^\[\]\r\n]+)\](?!\()/g, (_all, skillName) => renderSkill(skillName.trim()));

    protectedBlocks.forEach((block, index) => {
        output = output.replace(`\u0000GWBBCODE_BLOCK_${index}\u0000`, block);
    });

    return output;
}
