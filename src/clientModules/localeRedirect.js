const REDIRECT_KEY = 'next-preferred-locale';

function getPreferredLocale() {
    try {
        return localStorage.getItem(REDIRECT_KEY);
    } catch {
        return null;
    }
}

function setPreferredLocale(locale) {
    try {
        localStorage.setItem(REDIRECT_KEY, locale);
    } catch {
        // Ignore storage failures. The redirect is a convenience, not required navigation.
    }
}

function isFrenchBrowser() {
    return (navigator.languages || [navigator.language || ''])
        .filter(Boolean)
        .some((language) => language.toLowerCase().startsWith('fr'));
}

function shouldRedirectToFrench(pathname) {
    if (pathname === '/fr' || pathname.startsWith('/fr/')) {
        return false;
    }

    if (getPreferredLocale()) {
        return false;
    }

    return isFrenchBrowser();
}

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    const { pathname, search, hash } = window.location;

    if (pathname === '/fr' || pathname.startsWith('/fr/')) {
        setPreferredLocale('fr');
    } else if (shouldRedirectToFrench(pathname)) {
        setPreferredLocale('fr');
        const nextPath = pathname === '/' ? '/fr/' : `/fr${pathname}`;
        window.location.replace(`${nextPath}${search}${hash}`);
    }
}
