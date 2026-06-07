import React, { useEffect } from 'react';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import DiscordIcon from '@site/static/img/discord.svg';
import LinkIcon from '@site/static/img/link.svg';
import styles from './index.module.css';

function Home() {
    const discordLinks = [
        {
            label: translate({ id: 'home.discord.next.label', message: 'Next Discord' }),
            href: 'https://discord.gg/QDZX5ATnaH',
            description: translate({ id: 'home.discord.next.description', message: 'Guild and community runs' }),
        },
        {
            label: translate({ id: 'home.discord.french.label', message: 'French Teach Discord' }),
            href: 'https://discord.gg/52ZyPCejAn',
            description: translate({ id: 'home.discord.french.description', message: 'French teaching runs' }),
        },
        {
            label: translate({ id: 'home.discord.international.label', message: 'International Teach Discord' }),
            href: 'https://discord.gg/3Txr4x6',
            description: translate({ id: 'home.discord.international.description', message: 'International teaching runs' }),
        },
    ];

    const referenceLinks = [
        {
            label: translate({ id: 'home.reference.wiki.label', message: 'Speed clear wiki' }),
            href: 'https://wiki.gwscr.com/wiki/Main_Page',
            description: translate({ id: 'home.reference.wiki.description', message: 'General speed clear wiki' }),
        },
        {
            label: translate({ id: 'home.reference.records.label', message: 'Speed clear records' }),
            href: 'https://gwscr.com',
            description: translate({ id: 'home.reference.records.description', message: 'Records forum and run submissions' }),
        },
    ];

    useEffect(() => {
        document.documentElement.classList.add('home-page');
        document.body.classList.add('home-page');
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'visible';
            document.documentElement.classList.remove('home-page');
            document.body.classList.remove('home-page');
        };
    }, []);

    return (
        <main className={styles.hero}>
            <img
                className={styles.heroMargonites}
                src="/img/margo.png"
                alt=""
                aria-hidden="true"
                loading="eager"
                fetchPriority="high"
                decoding="async"
            />
            <div className={styles.heroContent}>
                <p className={styles.subhead}>Next</p>
                <h1 className={styles.title}>
                    <Translate id="home.hero.title">DoA speed clear tactics</Translate>
                </h1>
                <p className={styles.tagline}>
                    <Translate id="home.hero.tagline">Welcome ! We share here resources to get you started in your DoA speed clear journey.</Translate>
                </p>
                <section className={styles.resourceSection} aria-label={translate({ id: 'home.resources.aria', message: 'Community resources' })}>
                    <div className={styles.discordPanel}>
                        <div className={styles.panelHeader}>
                            <span className={styles.panelIcon} aria-hidden="true">
                                <DiscordIcon />
                            </span>
                            <div>
                                <h2>
                                    <Translate id="home.discord.title">Discords</Translate>
                                </h2>
                                <p>
                                    <Translate id="home.discord.description">Find runs, ask questions, and join teaching communities.</Translate>
                                </p>
                            </div>
                        </div>
                        <div className={styles.discordList}>
                            {discordLinks.map((discord) => (
                                <a key={discord.label} className={styles.discordLink} href={discord.href} target="_blank" rel="noreferrer">
                                    <strong>{discord.label}</strong>
                                    <span>{discord.description}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className={styles.referencePanel}>
                        <div className={styles.panelHeader}>
                            <span className={styles.panelIcon} aria-hidden="true">
                                <LinkIcon />
                            </span>
                            <div>
                                <h2>
                                    <Translate id="home.reference.title">Reference</Translate>
                                </h2>
                                <p>
                                    <Translate id="home.reference.description">Useful external speed clear resources.</Translate>
                                </p>
                            </div>
                        </div>
                        <div className={styles.externalList}>
                            {referenceLinks.map((resource) => (
                                <a key={resource.label} className={styles.externalLink} href={resource.href} target="_blank" rel="noreferrer">
                                    <strong>{resource.label}</strong>
                                    <span>{resource.description}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
                <section className={styles.featureSection}>
                    <h2>
                        <Translate id="home.featured.title">Featured tactics</Translate>
                    </h2>
                    <div className={styles.featureGrid}>
                        <Link className={styles.featureCard} to="/tactics/4-mesmers-3-3">
                            <h3>4 Mez 3-3</h3>
                            <p>
                                <Translate id="home.featured.3-3.description">Beginner-friendly tactics for 21-22min runs.</Translate>
                            </p>
                        </Link>
                        <Link className={styles.featureCard} to="/tactics/4-mesmers-6-0">
                            <h3>4 Mez 6-0</h3>
                            <p>
                                <Translate id="home.featured.6-0.description">Most commonly played tactics for 19-20min runs.</Translate>
                            </p>
                        </Link>
                        <Link className={styles.featureCard} to="/tactics/5-mesmers-city-split">
                            <h3>5 Mez City Split</h3>
                            <p>
                                <Translate id="home.featured.city.description">Introduces a MeMo mesmer for faster city tactics and 18min runs.</Translate>
                            </p>
                        </Link>
                        <Link className={styles.featureCard} to="/tactics/5-mesmers-veil-split">
                            <h3>5 Mez Veil Split</h3>
                            <p>
                                <Translate id="home.featured.veil.description">Introduces a minion mesmer for faster veil tactics and 17min runs.</Translate>
                            </p>
                        </Link>
                        <Link className={styles.featureCard} to="/tactics/4-mesmers-iau-derv">
                            <h3>4 Mez 1 Derv</h3>
                            <p>
                                <Translate id="home.featured.derv.description">Introduces an IAU dervish for faster spikes, on spawn 360/cave and 15-16min runs.</Translate>
                            </p>
                        </Link>
                    </div>
                </section>
            </div>
            <div className={styles.glowLayer} />
        </main>
    );
}

export default Home;
