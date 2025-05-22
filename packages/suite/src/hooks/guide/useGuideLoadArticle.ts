import { useEffect, useState } from 'react';

import type { GuideNode } from '@suite-common/suite-types';
import { resolveStaticPath } from '@suite-common/suite-utils';

import type { Locale } from 'src/config/suite/languages';

export async function loadPageMarkdownFile(id: string, language = 'en'): Promise<string> {
    const res = await fetch(resolveStaticPath(`/guide/${language}${id}`));

    if (!res.ok) {
        throw new Error(`[${res.status}] Failed to fetch article "${id}" for "${language}"`);
    }

    return res.text();
}

export const useGuideLoadArticle = (currentNode: GuideNode | null, language: Locale = 'en') => {
    const [markdown, setMarkdown] = useState<string>();
    const [hasError, setHasError] = useState<boolean>(false);

    useEffect(() => {
        if (!currentNode) return;
        loadPageMarkdownFile(currentNode.id, language)
            .catch(() => loadPageMarkdownFile(currentNode.id))
            .then(res => setMarkdown(res))
            .catch(e => {
                console.error(`Loading of ${currentNode.id} article failed: ${e}`);
                setHasError(true);
            });
    }, [currentNode, language]);

    return {
        markdown,
        hasError,
    };
};
