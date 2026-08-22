// src/syntax/syntax.ts
const ALLOWED_TAGS = ['Esharp', 'exeName', 'compileHtml2exe', 'icon'];

export function validateAndParseEsharp(sourceCode: string): Record<string, string> {
    const config: Record<string, string> = {};
    
    // Очищаем код от JS-импортов, если они есть перед XML
    const cleanCode = sourceCode.replace(/import\s+.*?from\s+['"].*?['"];?/g, '');
    
    const tagRegex = /<\/?([a-zA-Z0-9]+)([^>]*)\/?>/g;
    let match;
    let rootOpened = false;

    while ((match = tagRegex.exec(cleanCode)) !== null) {
        const tagName = match[1];
        const attrString = match[2];

        if (!ALLOWED_TAGS.includes(tagName)) {
            throw new Error(`Esharp XML Error: Unknown tag "<${tagName}>" `);
        }

        if (tagName === 'Esharp') {
            rootOpened = true;
            continue;
        }

        const attrRegex = /(name|src)\s*=\s*"([^"]+)"/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(attrString)) !== null) {
            config[tagName] = attrMatch[2];
        }
    }

    if (!rootOpened) {
        throw new Error(`Esharp XML Error: Missing root <Esharp> tag.`);
    }

    return config;
}