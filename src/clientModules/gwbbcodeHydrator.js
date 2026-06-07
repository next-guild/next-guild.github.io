import {parseGwbbcode} from '../utils/gwbbcode';

const RAW_GWBBCODE_PATTERN = /\[(?:build[=\s]|bar[=\s]|skill\b|gear\b|armor\b|weapon\b|mod\b|line\b|titles?\b|ranks?\b|cons\b|con\b|pcons\b|pcon\b|consumables?\b|item\b|b\]|i\]|u\]|url[=\]]|pre\]|nobb\]|[^\]\r\n]+;[A-Za-z0-9+/]+|[A-Z][^\]\r\n]{2,}\](?!\())/;
const FLOW_BLOCK_START = /^\[(?:gear|build|titles?|ranks?|cons|pcons|consumables?)\b/i;
const FLOW_BLOCK_END = /\[\/(?:gear|build|titles?|ranks?|cons|pcons|consumables?)\]/i;
const TEXT_ONLY_NODES = new Set(['#text', 'BR']);
const SKIP_SELECTOR = '.gwbbcode, pre, code, script, style, textarea';
const MARKDOWN_SELECTOR = '.theme-doc-markdown, .markdown, article';

function isTextOnlyElement(element) {
    return Array.from(element.childNodes).every((node) => TEXT_ONLY_NODES.has(node.nodeName));
}

function canHydrate(element) {
    return (
        element
        && !element.dataset.gwbbcodeHydrated
        && !element.closest(SKIP_SELECTOR)
        && isTextOnlyElement(element)
        && RAW_GWBBCODE_PATTERN.test(element.textContent || '')
    );
}

function parsedWrapper(rawText) {
    const container = document.createElement('div');
    container.className = 'gwbbcode gwbbcode--hydrated';
    container.innerHTML = parseGwbbcode(rawText);
    return container;
}

function hydrateSingleElement(element) {
    const rawText = element.textContent.trim();
    if (!rawText) {
        return;
    }

    if (element.tagName === 'LI') {
        element.dataset.gwbbcodeHydrated = 'true';
        element.innerHTML = parseGwbbcode(rawText);
        return;
    }

    element.replaceWith(parsedWrapper(rawText));
}

function hydrateFlowBlock(elements, startIndex) {
    const parts = [];
    const consumed = [];

    for (let index = startIndex; index < elements.length; index += 1) {
        const element = elements[index];
        if (!canHydrate(element)) {
            break;
        }

        const text = element.textContent.trim();
        parts.push(text);
        consumed.push(element);

        if (FLOW_BLOCK_END.test(text)) {
            break;
        }
    }

    const rawText = parts.join('\n');
    if (consumed.length < 2 || !FLOW_BLOCK_END.test(rawText)) {
        return false;
    }

    consumed[0].replaceWith(parsedWrapper(rawText));
    consumed.slice(1).forEach((element) => element.remove());
    return true;
}

function hydrateMarkdownRoot(root) {
    const candidates = Array.from(root.querySelectorAll('p, li'));

    for (let index = 0; index < candidates.length; index += 1) {
        const element = candidates[index];
        if (!canHydrate(element)) {
            continue;
        }

        const rawText = element.textContent.trim();
        if (FLOW_BLOCK_START.test(rawText) && !FLOW_BLOCK_END.test(rawText) && hydrateFlowBlock(candidates, index)) {
            continue;
        }

        hydrateSingleElement(element);
    }
}

function hydrateRawGwbbcode() {
    document.querySelectorAll(MARKDOWN_SELECTOR).forEach(hydrateMarkdownRoot);
}

function scheduleHydration() {
    requestAnimationFrame(() => {
        hydrateRawGwbbcode();
        setTimeout(hydrateRawGwbbcode, 50);
        setTimeout(hydrateRawGwbbcode, 250);
    });
}

async function copyText(text) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-1000px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
}

if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scheduleHydration, {once: true});
    } else {
        scheduleHydration();
    }

    window.addEventListener('popstate', scheduleHydration);
    window.addEventListener('hashchange', scheduleHydration);

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function pushStateWithGwbbcodeHydration(...args) {
        const result = originalPushState.apply(this, args);
        scheduleHydration();
        return result;
    };

    window.history.replaceState = function replaceStateWithGwbbcodeHydration(...args) {
        const result = originalReplaceState.apply(this, args);
        scheduleHydration();
        return result;
    };

    document.addEventListener('click', async (event) => {
        const target = event.target instanceof Element ? event.target : event.target?.parentElement;
        const button = target?.closest('.gwbbcode-copy');
        if (!button) {
            return;
        }

        const template = button.dataset.template;
        if (!template) {
            return;
        }

        event.preventDefault();
        await copyText(template);
        const previousLabel = button.getAttribute('aria-label') || 'Copy build code';
        const previousTitle = button.getAttribute('title') || previousLabel;
        button.setAttribute('aria-label', 'Copied build code');
        button.setAttribute('title', 'Copied build code');
        button.classList.add('gwbbcode-copy--copied');
        window.setTimeout(() => {
            button.setAttribute('aria-label', previousLabel);
            button.setAttribute('title', previousTitle);
            button.classList.remove('gwbbcode-copy--copied');
        }, 1200);
    });
}
