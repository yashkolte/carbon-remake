'use client';

import { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/client';

interface I18nProviderProps {
    children: ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
    useEffect(() => {
        // Initialize i18n on client side
        if (!i18n.isInitialized) {
            i18n.init();
        }
    }, []);

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}