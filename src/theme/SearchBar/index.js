import React, { useMemo, useState } from 'react';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import styles from './styles.module.css';

const SEARCH_ENTRIES = [
    { title: 'Start Here', path: '/tactics/start-here', text: 'beginner first run empathy gear check teach discord' },
    { title: 'DoA Overview', path: '/tactics/', text: 'overview map city veil gloom foundry quests goals' },
    { title: 'Fundamentals', path: '/tactics/fundamentals', text: 'communication calls cast range aggro management skill notes' },
    { title: 'Glossary', path: '/tactics/glossary', text: 'aggro skill abbreviations gameplay abbreviations c-target bad aggro share aggro' },
    { title: '3-3 Teaching', path: '/tactics/4-mesmers-3-3', text: 'teaching beginner roles empathy backfire tk vor ua emo mt tt spiking guide' },
    { title: 'Empathy', displayTitle: '3-3 Teaching > Empathy', path: '/tactics/4-mesmers-3-3/empathy', text: '3-3 empathy first role c-target mesmer beginner' },
    { title: 'Backfire', displayTitle: '3-3 Teaching > Backfire', path: '/tactics/4-mesmers-3-3/backfire', text: '3-3 backfire caster killer mesmer beginner' },
    { title: 'TK', displayTitle: '3-3 Teaching > TK', path: '/tactics/4-mesmers-3-3/tk', text: '3-3 tk edge of extinction off damage mesmer beginner' },
    { title: 'VoR', displayTitle: '3-3 Teaching > VoR', path: '/tactics/4-mesmers-3-3/vor', text: '3-3 visions of regret caller spiker mesmer beginner' },
    { title: 'UA', displayTitle: '3-3 Teaching > UA', path: '/tactics/4-mesmers-3-3/ua', text: '3-3 ua unyielding aura seed of life healer' },
    { title: 'Emo', displayTitle: '3-3 Teaching > Emo', path: '/tactics/4-mesmers-3-3/emo', text: '3-3 emo ether renewal protective bond bonding' },
    { title: 'MT', displayTitle: '3-3 Teaching > MT', path: '/tactics/4-mesmers-3-3/mt', text: '3-3 mt main tank shadow form' },
    { title: 'TT', displayTitle: '3-3 Teaching > TT', path: '/tactics/4-mesmers-3-3/tt', text: '3-3 tt trench tank shadow form splits' },
    { title: '4 Mez 6-0', path: '/tactics/4-mesmers-6-0', text: '6-0 advanced roles iau mlk tk vor ua emo mt tt spiking guide' },
    { title: 'IAU', displayTitle: '4 Mez 6-0 > IAU', path: '/tactics/4-mesmers-6-0/iau', text: '6-0 iau mesmer c-target unstoppable' },
    { title: 'MLK', displayTitle: '4 Mez 6-0 > MLK', path: '/tactics/4-mesmers-6-0/mlk', text: '6-0 mlk monk lord killer backfire empathy' },
    { title: 'TK', displayTitle: '4 Mez 6-0 > TK', path: '/tactics/4-mesmers-6-0/tk', text: '6-0 tk mesmer' },
    { title: 'VoR', displayTitle: '4 Mez 6-0 > VoR', path: '/tactics/4-mesmers-6-0/vor', text: '6-0 vor visions of regret mesmer' },
    { title: 'UA', displayTitle: '4 Mez 6-0 > UA', path: '/tactics/4-mesmers-6-0/ua', text: '6-0 ua unyielding aura seed of life' },
    { title: 'Emo', displayTitle: '4 Mez 6-0 > Emo', path: '/tactics/4-mesmers-6-0/emo', text: '6-0 emo ether renewal bonding' },
    { title: 'MT', displayTitle: '4 Mez 6-0 > MT', path: '/tactics/4-mesmers-6-0/mt', text: '6-0 mt main tank shadow form' },
    { title: 'TT', displayTitle: '4 Mez 6-0 > TT', path: '/tactics/4-mesmers-6-0/tt', text: '6-0 tt trench tank shadow form' },
    { title: '5 Mez City Split', path: '/tactics/5-mesmers-city-split', text: '5 mez city split memo city spike advanced' },
    { title: 'IAU', displayTitle: '5 Mez City Split > IAU', path: '/tactics/5-mesmers-city-split/iau', text: '5 mez city split iau mesmer c-target' },
    { title: 'MLK', displayTitle: '5 Mez City Split > MLK', path: '/tactics/5-mesmers-city-split/mlk', text: '5 mez city split mlk monk lord killer mesmer' },
    { title: 'TK', displayTitle: '5 Mez City Split > TK', path: '/tactics/5-mesmers-city-split/tk', text: '5 mez city split tk mesmer' },
    { title: 'VoR', displayTitle: '5 Mez City Split > VoR', path: '/tactics/5-mesmers-city-split/vor', text: '5 mez city split vor visions of regret mesmer' },
    { title: 'MeMo', displayTitle: '5 Mez City Split > MeMo', path: '/tactics/5-mesmers-city-split/memo', text: '5 mez city split memo mesmer healing seed spike power' },
    { title: 'Emo', displayTitle: '5 Mez City Split > Emo', path: '/tactics/5-mesmers-city-split/emo', text: '5 mez city split emo ether renewal bonding' },
    { title: 'MT', displayTitle: '5 Mez City Split > MT', path: '/tactics/5-mesmers-city-split/mt', text: '5 mez city split mt main tank shadow form' },
    { title: 'TT', displayTitle: '5 Mez City Split > TT', path: '/tactics/5-mesmers-city-split/tt', text: '5 mez city split tt trench tank shadow form recall' },
    { title: '5 Mez Veil Split', path: '/tactics/5-mesmers-veil-split', text: '5 mez veil split advanced work in progress' },
    { title: '4 Mez + Derv', path: '/tactics/4-mesmers-iau-derv', text: '4 mesmer derv iau dervish advanced' },
    { title: 'Mesmer Gear', path: '/tactics/gear/mesmer', text: 'mesmer gear armor weapons runes insignia pcons titles empathy' },
    { title: 'MT Gear', path: '/tactics/gear/mt', text: 'mt gear tank armor weapons' },
    { title: 'TT Gear', path: '/tactics/gear/tt', text: 'tt gear tank armor weapons' },
    { title: 'Emo Gear', path: '/tactics/gear/emo', text: 'emo gear bonder ether renewal armor weapons' },
    { title: 'UA Gear', path: '/tactics/gear/ua', text: 'ua gear healer unyielding aura armor weapons' },
    { title: 'Recoveries', path: '/tactics/recoveries', text: 'recover failed cave rift cap foundry quest derv hill' },
    { title: 'In Depth Concepts', path: '/tactics/in-depth-concepts', text: 'fast wall monk lord first snake tk city pull' },
    { title: 'About Next', path: '/about', text: 'guild leaders officers runs recruiting discord' },
];

function normalize(value) {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function compact(value) {
    return normalize(value).replace(/[^a-z0-9]/g, '');
}

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const normalizedQuery = normalize(query.trim());
    const compactQuery = compact(query.trim());

    const results = useMemo(() => {
        if (normalizedQuery.length < 2) {
            return [];
        }

        return SEARCH_ENTRIES.map((entry) => {
            const title = normalize(entry.title);
            const compactTitle = compact(entry.title);
            const haystack = normalize(`${entry.title} ${entry.text}`);
            const compactHaystack = compact(`${entry.title} ${entry.text}`);
            const titleMatch = title.includes(normalizedQuery) || compactTitle.includes(compactQuery);
            const textMatch = haystack.includes(normalizedQuery) || compactHaystack.includes(compactQuery);

            return {
                ...entry,
                score: titleMatch ? 0 : 1,
                textMatch,
            };
        })
            .filter((entry) => entry.textMatch)
            .sort((a, b) => a.score - b.score || a.title.localeCompare(b.title))
            .slice(0, 8);
    }, [compactQuery, normalizedQuery]);

    return (
        <div className={styles.search}>
            <label className={styles.label}>
                <span>{translate({ id: 'theme.SearchBar.label', message: 'Search' })}</span>
                <input
                    className={styles.input}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={translate({ id: 'theme.SearchBar.placeholder', message: 'Search' })}
                    aria-label={translate({ id: 'theme.SearchBar.label', message: 'Search' })}
                />
            </label>
            {query.trim().length > 0 && (
                <div className={styles.results}>
                    {results.length > 0 ? (
                        results.map((result) => (
                            <Link key={result.path} className={styles.result} to={result.path} onClick={() => setQuery('')}>
                                {result.displayTitle ?? result.title}
                            </Link>
                        ))
                    ) : (
                        <span className={styles.empty}>{translate({ id: 'theme.SearchBar.noResults', message: 'No results' })}</span>
                    )}
                </div>
            )}
        </div>
    );
}
