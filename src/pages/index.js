import React, { useEffect } from 'react';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import DiscordIcon from '@site/static/img/discord.svg';
import LinkIcon from '@site/static/img/link.svg';
import styles from './index.module.css';

function Home() {
    useEffect(() => {
        document.documentElement.classList.add('home-page');
        document.body.classList.add('home-page');
        return () => {
            document.documentElement.classList.remove('home-page');
            document.body.classList.remove('home-page');
        };
    }, []);

    const advancedItems = [
        '4 Mez 6-0',
        '5 Mez City Split',
        '5 Mez Veil Split',
        'Nextway',
    ];

    const teachItems = [
        translate({ id: 'home.teach.item.beginner', message: '3-3 beginner path' }),
        translate({ id: 'home.teach.item.guides', message: 'Guides and explanations' }),
        translate({ id: 'home.teach.item.progression', message: 'Role progression' }),
        translate({ id: 'home.teach.item.resources', message: 'Teaching resources' }),
    ];

    const resources = [
        {
            title: translate({ id: 'home.resource.nextDiscord.title', message: 'Next Discord' }),
            description: translate({ id: 'home.resource.nextDiscord.description', message: 'Guild runs and Next community.' }),
            href: 'https://discord.gg/EZm8W3t5AZ',
            label: translate({ id: 'home.resource.nextDiscord.cta', message: 'Join Next' }),
            icon: <DiscordIcon />,
        },
        {
            title: translate({ id: 'home.resource.internationalTeach.title', message: 'Inter Teach Discord' }),
            description: translate({ id: 'home.resource.internationalTeach.description', message: 'International teaching runs and progression.' }),
            href: 'https://discord.gg/3Txr4x6',
            label: translate({ id: 'home.resource.internationalTeach.cta', message: 'Join Teach' }),
            icon: <DiscordIcon />,
        },
        {
            title: translate({ id: 'home.resource.wiki.title', message: 'Wiki' }),
            description: translate({ id: 'home.resource.wiki.description', message: 'General Guild Wars speed clear wiki.' }),
            href: 'https://wiki.gwscr.com/wiki/Main_Page',
            label: translate({ id: 'home.resource.wiki.cta', message: 'Open wiki' }),
            icon: <LinkIcon />,
        },
    ];

    return (
        <Layout
            title={translate({ id: 'home.meta.title', message: 'DoA speed clear tactics' })}
            description={translate({
                id: 'home.meta.description',
                message: 'Resources to get started in your DoA speed clear journey.',
            })}
        >
            <main className={styles.home}>
                <img className={styles.margoLeft} src="/img/margo-left-2.png" alt="" aria-hidden="true" loading="eager" fetchPriority="high" />
                <img className={styles.margoRight} src="/img/margo-right-2.png" alt="" aria-hidden="true" loading="eager" fetchPriority="high" />
                <section className={styles.hero}>
                    <p className={styles.kicker}>
                        <Translate id="home.hero.kicker">Welcome to</Translate>
                    </p>
                    <img className={styles.heroLogo} src="/img/logo-wide.png" alt="Next" />
                    <h1>
                        <Translate id="home.hero.title">DoA speed clear tactics</Translate>
                    </h1>
                    <p>
                        <Translate id="home.hero.tagline">Welcome ! We share here resources to get you started in your DoA speed clear journey.</Translate>
                    </p>
                    <span className={styles.prompt}>
                        <Translate id="home.hero.prompt">Choose your path</Translate>
                    </span>
                </section>

                <section className={styles.pathGrid} aria-label={translate({ id: 'home.paths.aria', message: 'Main paths' })}>
                    <Link className={`${styles.pathCard} ${styles.pathCardAdvanced}`} to="/tactics/4-mesmers-6-0">
                        <span className={styles.pathBadge}>
                            <Translate id="home.advanced.badge">Advanced tactics</Translate>
                        </span>
                        <h2>
                            <Translate id="home.advanced.title">Next Guild</Translate>
                        </h2>
                        <p className={styles.pathSubtitle}>
                            <Translate id="home.advanced.subtitle">Optimization and performance</Translate>
                        </p>
                        <p>
                            <Translate id="home.advanced.description">Advanced tactics and optimizations for practical, efficient guild runs.</Translate>
                        </p>
                        <ul>
                            {advancedItems.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                        <span className={styles.pathAction}>
                            <Translate id="home.advanced.cta">Open Next tactics</Translate>
                        </span>
                    </Link>

                    <Link className={`${styles.pathCard} ${styles.pathCardTeach}`} to="/tactics/start-here">
                        <span className={styles.pathBadge}>
                            <Translate id="home.teach.badge">Beginner-friendly</Translate>
                        </span>
                        <h2>
                            <Translate id="home.teach.title">Teaching</Translate>
                        </h2>
                        <p className={styles.pathSubtitle}>
                            <Translate id="home.teach.subtitle">Learn and progress</Translate>
                        </p>
                        <p>
                            <Translate id="home.teach.description">Beginner-friendly explanations, 3-3 roles, fundamentals, and role progression.</Translate>
                        </p>
                        <ul>
                            {teachItems.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                        <span className={styles.pathAction}>
                            <Translate id="home.teach.cta">Start learning</Translate>
                        </span>
                    </Link>
                </section>

                <section className={styles.resourceGrid} aria-label={translate({ id: 'home.resources.aria', message: 'Community resources' })}>
                    {resources.map((resource) => {
                        const content = (
                            <>
                                <span className={styles.resourceIcon} aria-hidden="true">
                                    {resource.icon}
                                </span>
                                <span>
                                    <strong>{resource.title}</strong>
                                    <span>{resource.description}</span>
                                    <em>{resource.label}</em>
                                </span>
                            </>
                        );

                        return resource.internal ? (
                            <Link key={resource.title} className={styles.resourceCard} to={resource.href}>
                                {content}
                            </Link>
                        ) : (
                            <a key={resource.title} className={styles.resourceCard} href={resource.href} target="_blank" rel="noreferrer">
                                {content}
                            </a>
                        );
                    })}
                </section>
            </main>
        </Layout>
    );
}

export default Home;
