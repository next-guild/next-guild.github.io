# GWBBCode authoring guide

GWBBCode can be written directly inside Docusaurus markdown/MDX files. The remark plugin renders it during build, and the client hydrator also catches raw tags that survive MDX parsing.

Use quotes around attribute values that contain spaces:

```bbcode
[gear name="Panic Mesmer Gear"]
```

## Skills

Inline skill tags render as a small icon plus skill name. Hovering the skill shows the full skill card.

```bbcode
[Empathy]
[Spiritual pain]
[skill]Visions of regret[/skill]
```

This is best for prose and table cells:

```md
Good single target damage with [Empathy] and [Spiritual pain].
```

## Builds

### Expanded build from a Guild Wars template code

Use this when a role page should show the full build card. The copy button is added automatically.

```bbcode
[Empathy;OQpjAwCc6QLBnAmO0laATP2k4UA]
```

You can also use the explicit form:

```bbcode
[build=OQpjAwCc6QLBnAmO0laATP2k4UA][/build]
```

### Compact bar from a Guild Wars template code

Use this for overview/team-build pages. It renders the build name, professions, skill icons, hover cards, and a copy button.

```bbcode
[bar Empathy;OQpjAwCc6QLBnAmO0laATP2k4UA]
```

or:

```bbcode
[bar=OQpjAwCc6QLBnAmO0laATP2k4UA][/bar]
```

### Manual build

Manual builds are useful for testing, placeholders, or builds without a template code.

```bbcode
[build prof=Me/R name="DoA Panic" dom=12 fas=10 ins=8]
[Empathy][Spiritual pain][Cry of frustration][Power drain]
[/build]
```

Set `display=bar`, `mode=bar`, `view=bar`, or `layout=bar` for a compact manual build:

```bbcode
[build prof=Me/R name="DoA Panic" display=bar]
[Empathy][Spiritual pain][Cry of frustration][Power drain]
[/build]
```

Common profession codes: `W`, `R`, `Mo`, `N`, `Me`, `E`, `A`, `Rt`, `P`, `D`.

Common attribute keys: `fas`, `ill`, `dom`, `ins`, `hea`, `pro`, `div`, `air`, `ear`, `fir`, `wat`, `ene`, `dag`, `sha`, `cri`, `scy`, `win`, `earthp`, `mys`.

## Gear

Gear blocks render armor and weapons. The gear title uses the site text color; rarity colors are only applied to weapons.

```bbcode
[gear name="Panic Mesmer Gear"]
[armor piece="Headgear" base="Domination Magic +1" rating=60 rune="Rune of Superior Domination Magic +3" insignia="Radiant Insignia +2 energy"]
[armor piece="Chest" rating=60 rune="Rune of Vitae +10 health" insignia="Radiant Insignia +2 energy"]
[armor piece="Hand" rating=60 rune="Rune of Attunement +2 energy" insignia="Radiant Insignia +2 energy"]
[armor piece="Leg" rating=60 rune="Rune of Vitae +10 health" insignia="Radiant Insignia +2 energy"]
[armor piece="Footwear" rating=60 rune="Rune of Vitae +10 health" insignia="Radiant Insignia +2 energy"]

[weapon type="Wand" rarity=gold name="Fiery Sword of Demonslaying" stat="11-22 (Requires Protection Magic 9)"]
[mod name="&quot;Aptitude not Attitude&quot;" effect="Halves casting time of spells of Domination Magic (Chance 20%)"][/mod]
[mod effect="Halves skill recharge of Domination Magic spells (Chance 20%)"][/mod]
[/weapon]

[weapon type="Staff" rarity=gold name="Domination Staff of Enchanting" base="Energy +10" stat="11-22 (Requires Domination Magic 9)"]
[mod name="&quot;Aptitude not Attitude&quot;" effect="Halves casting time of spells of Domination Magic (Chance 20%)"][/mod]
[mod effect="Enchantments last 20% longer"][/mod]
[/weapon]
[/gear]
```

Supported armor attributes:

- `piece`, `slot`, or `type`
- `base`
- `rating` or `armor`
- `rune`
- `insignia`

Supported weapon attributes:

- `type` or `slot`
- `name`
- `base`, `base2`, or `base3`
- `stat`, `stats`, `damage`, or `energy`
- `rarity` or `color`: `green`, `gold`, `purple`, `blue`, `white`

Supported modifier tags:

```bbcode
[mod name="&quot;Strength and Honor!&quot;" effect="Damage +15% (when health is above 50%)"][/mod]
[mod effect="Damage +20% (against demons)"][/mod]
[line effect="Enchantments last 20% longer"][/line]
```

If a modifier `name` is wrapped in quotes, it renders as an inscription line. Modifier names that are not inscriptions are intentionally hidden; only their effect is shown.

Text in parentheses is muted automatically inside gear stats and effects.

## Consumables

Use `[cons]` for personal consumables and party-wide consumables.

```bbcode
[cons name="Required consumables"]
[Grail of Might]
[Essence of Celerity]
[Armor of Salvation]
[Birthday Cupcake]
[header]Self DP removal[/header]
[Pumpkin Cookie][Shining Blade Rations][Wintergreen Candy Cane][Peppermint Candy Cane]
[/cons]
```

Longer item tags also work:

```bbcode
[cons title="Optional consumables"]
[item]Powerstone of Courage[/item]
[con]Red Rock Candy[/con]
[/cons]
```

Supported group tags: `[cons]`, `[pcons]`, `[consumables]`.

Supported item tags: `[con]`, `[pcon]`, `[consumable]`, `[item]`.

Use `[header]...[/header]` inside a consumable group to start a small full-width subsection:

```bbcode
[header]Throwaway stone such as[/header]
[Legionnaire Summoning Crystal]
[Zaishen Summoning Stone]
```

Consumable icons come from `static/gwbbcode/consumables`, generated by:

```sh
npm run generate:gwbbcode
```

## Titles

Use a group when a role needs several title tracks:

```bbcode
[titles name="Required titles"]
[title name="Lightbringer" rank=8][/title]
[title name="Asura" rank=10][/title]
[/titles]
```

Short item syntax also works:

```bbcode
[titles]
[Lightbringer]
[Asura]
[Dwarven]
[/titles]
```

Single title tags can be used inline:

```bbcode
[title name="Lightbringer" rank=8][/title]
[rank value=10]Asura[/rank]
```

Supported group tags: `[titles]`, `[ranks]`.

Supported item tags: `[title]`, `[rank]`.

Title icons come from `static/gwbbcode/titles`, generated by:

```sh
npm run generate:gwbbcode
```

## Basic formatting

These light BBCode helpers are also supported:

```bbcode
[b]bold[/b]
[i]italic[/i]
[u]underlined[/u]
[br]
[url=https://wiki.guildwars.com]Guild Wars Wiki[/url]
[url]https://wiki.guildwars.com[/url]
```

Use `[pre]...[/pre]` to render escaped preformatted text, or `[nobb]...[/nobb]` to show raw text without parsing BBCode.

## Asset generation

Skill data and icons are generated from the local Guild Wars/PvX source folders by:

```sh
npm run generate:gwbbcode
```

Generated files live in `src/data` and `static/gwbbcode`. Do not edit generated data files by hand; update the source images or generator instead.
