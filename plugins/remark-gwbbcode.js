const {Parser} = require('acorn');

const GWBBCODE_PATTERN = /\[(?:build[=\s]|skill\b|gear\b|armor\b|weapon\b|mod\b|line\b|titles?\b|ranks?\b|cons\b|con\b|pcons\b|pcon\b|consumables?\b|item\b|b\]|i\]|u\]|url[=\]]|pre\]|nobb\]|[^\]\r\n]+;[A-Za-z0-9+/]+|[A-Z][^\]\r\n]{2,}\](?!\())/;
const IMPORT_VALUE = "import GwBBCode from '@site/src/components/GwBBCode';";
const IMPORT_ESTREE = Parser.parse(IMPORT_VALUE, {
    ecmaVersion: 'latest',
    sourceType: 'module',
});
const FLOW_BLOCK_START = /^\[(?:gear|build|titles?|ranks?|cons|pcons|consumables?)\b/i;
const FLOW_BLOCK_END = /\[\/(?:gear|build|titles?|ranks?|cons|pcons|consumables?)\]/i;
const STANDALONE_FLOW_PATTERN = /^\s*\[(?:build[=\s][\s\S]*|bar[=\s][\s\S]*|[^\]\r\n]+;[A-Za-z0-9+/]+)\]\s*(?:\[\/(?:build|bar)\])?\s*$/i;

function textValue(node) {
    if (!node) {
        return '';
    }

    if (node.type === 'text') {
        return node.value;
    }

    if (Array.isArray(node.children)) {
        return node.children.map(textValue).join('');
    }

    return '';
}

function gwbbcodeNode(value, flow = false) {
    const expression = JSON.stringify(value);
    const estree = Parser.parse(`(${expression})`, {
        ecmaVersion: 'latest',
        sourceType: 'module',
    });

    return {
        type: flow ? 'mdxJsxFlowElement' : 'mdxJsxTextElement',
        name: 'GwBBCode',
        attributes: [
            {
                type: 'mdxJsxAttribute',
                name: 'code',
                value: {
                    type: 'mdxJsxAttributeValueExpression',
                    value: expression,
                    data: {
                        estree,
                    },
                },
            },
        ],
        children: [],
    };
}

function transformChildren(node) {
    if (!node || !Array.isArray(node.children)) {
        return false;
    }

    let changed = false;
    const nextChildren = [];

    for (let index = 0; index < node.children.length; index += 1) {
        const child = node.children[index];
        const childText = textValue(child).trim();

        if (child.type === 'paragraph' && FLOW_BLOCK_START.test(childText) && !FLOW_BLOCK_END.test(childText)) {
            const blockParts = [childText];
            let endIndex = index;

            while (endIndex + 1 < node.children.length) {
                endIndex += 1;
                const nextText = textValue(node.children[endIndex]).trim();
                if (nextText) {
                    blockParts.push(nextText);
                }

                if (FLOW_BLOCK_END.test(nextText)) {
                    break;
                }
            }

            if (endIndex > index && FLOW_BLOCK_END.test(blockParts.join('\n'))) {
                nextChildren.push(gwbbcodeNode(blockParts.join('\n'), true));
                changed = true;
                index = endIndex;
                continue;
            }
        }

        if (child.type === 'paragraph' && STANDALONE_FLOW_PATTERN.test(childText)) {
            nextChildren.push(gwbbcodeNode(childText, true));
            changed = true;
            continue;
        }

        if (child.type === 'text' && GWBBCODE_PATTERN.test(child.value)) {
            nextChildren.push(gwbbcodeNode(child.value));
            changed = true;
            continue;
        }

        changed = transformChildren(child) || changed;
        nextChildren.push(child);
    }

    node.children = nextChildren;
    return changed;
}

function remarkGwbbcode() {
    return function transformer(tree) {
        const changed = transformChildren(tree);
        if (!changed) {
            return;
        }

        tree.children.unshift({
            type: 'mdxjsEsm',
            value: IMPORT_VALUE,
            data: {
                estree: IMPORT_ESTREE,
            },
        });
    };
}

module.exports = remarkGwbbcode;
