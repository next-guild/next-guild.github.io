import React from 'react';
import {parseGwbbcode} from '../utils/gwbbcode';

export default function GwBBCode({code}) {
    const Wrapper = /\[(?:build[=\s]|bar[=\s]|gear\b|titles?\b|ranks?\b|cons\b|pcons\b|consumables?\b|[^\]\r\n]+;[A-Za-z0-9+/]+)/.test(code) ? 'div' : 'span';

    return <Wrapper className="gwbbcode" dangerouslySetInnerHTML={{__html: parseGwbbcode(code)}} />;
}
