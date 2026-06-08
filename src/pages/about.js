import React from 'react';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './about.module.css';

const leaders = ['Insane Candy', 'Cute Mila'];
const officers = ['Karen Jay', 'Tear', 'Panda Goes Slayer'];

function MemberList({ title, members }) {
    return (
        <section className={styles.rosterGroup}>
            <h2>{title}</h2>
            <ul>
                {members.map((member) => (
                    <li key={member}>{member}</li>
                ))}
            </ul>
        </section>
    );
}

export default function About() {
    return (
        <Layout
            title={translate({ id: 'about.meta.title', message: 'About Next' })}
            description={translate({
                id: 'about.meta.description',
                message: "Next is an international DoA speed clear guild.",
            })}
        >
            <main className={styles.page}>
                <section className={styles.hero}>
                    <div className={styles.copy}>
                        <p className={styles.eyebrow}>Next</p>
                        <h1>
                            <Translate id="about.title">About the guild</Translate>
                        </h1>
                        <p className={styles.lead}>
                            <Translate id="about.lead">
                                Next is an international DoA SC guild with lots of frenchies.
                            </Translate>
                        </p>
                        <div className={styles.notes}>
                            <p>
                                <Translate id="about.schedule">
                                    We mainly run DoA 6-0, and runs are usually formed around 20:30 CET.
                                </Translate>
                            </p>
                            <p>
                                <Translate id="about.recruitment">
                                    We are not recruiting new players. To join, you must have been through a teaching Discord first.
                                </Translate>
                            </p>
                        </div>
                    </div>
                    <figure className={styles.capeFrame}>
                        <img src="/img/next-cape.png" alt={translate({ id: 'about.cape.alt', message: 'Next guild cape' })} />
                    </figure>
                </section>

                <section className={styles.roster} aria-label={translate({ id: 'about.roster.aria', message: 'Guild roster' })}>
                    <MemberList title={translate({ id: 'about.leaders', message: 'Leaders' })} members={leaders} />
                    <MemberList title={translate({ id: 'about.officers', message: 'Officers' })} members={officers} />
                </section>
            </main>
        </Layout>
    );
}
