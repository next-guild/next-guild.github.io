const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const fs = require('fs');
const remarkGwbbcodePath = require.resolve('./plugins/remark-gwbbcode');
const remarkGwbbcode = require(remarkGwbbcodePath);
const gwbbcodeHydratorPath = require.resolve('./src/clientModules/gwbbcodeHydrator');
const localeRedirectPath = require.resolve('./src/clientModules/localeRedirect');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Next',
    tagline: 'Speed clear tactics, builds, and community resources',
    url: 'https://next-guild.github.io',
    baseUrl: '/',
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'fr'],
        localeConfigs: {
            en: {
                label: 'English',
                htmlLang: 'en',
            },
            fr: {
                label: 'Français',
                htmlLang: 'fr',
            },
        },
    },
    headTags: [
        {
            tagName: 'link',
            attributes: {
                rel: 'preload',
                href: '/img/margo.png',
                as: 'image',
                fetchpriority: 'high',
            },
        },
        {
            tagName: 'link',
            attributes: {
                rel: 'preload',
                href: '/img/logo-small.png',
                as: 'image',
            },
        },
    ],
    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/logo-small.png',
    organizationName: 'next-guild',
    projectName: 'next-guild.github.io',
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    routeBasePath: 'tactics',
                    editUrl: 'https://github.com/next-guild/next-guild.github.io/tree/main/',
                    remarkPlugins: [[remarkGwbbcode, { cacheKey: fs.statSync(remarkGwbbcodePath).mtimeMs }]],
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],
    markdown: {
        mermaid: true,
    },
    themes: ['@docusaurus/theme-mermaid'],
    plugins: [
        function gwbbcodeClientPlugin() {
            return {
                name: 'gwbbcode-client-plugin',
                getClientModules() {
                    return [gwbbcodeHydratorPath, localeRedirectPath];
                },
            };
        },
    ],
    themeConfig: {
        image: 'img/next-banner-v2.png',
        docs: {
            sidebar: {
                autoCollapseCategories: true,
            },
        },
        colorMode: {
            defaultMode: 'dark',
            disableSwitch: true,
            respectPrefersColorScheme: false,
        },
        navbar: {
            logo: {
                alt: 'Guild logo',
                src: 'img/logo-wide.png',
            },
            items: [
                {
                    type: 'search',
                    position: 'right',
                },
                {
                    to: '/about',
                    label: 'About',
                    position: 'right',
                },
                {
                    href: 'https://discord.gg/QDZX5ATnaH',
                    label: 'Discord',
                    position: 'right',
                },
                {
                    type: 'localeDropdown',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            copyright: `© ${new Date().getFullYear()} Next Guild`,
        },
        prism: {
            theme: lightCodeTheme,
            darkTheme: darkCodeTheme,
        },
    },
};

module.exports = config;
