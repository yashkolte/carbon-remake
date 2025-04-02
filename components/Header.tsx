'use client';

import {
    Header,
    HeaderContainer,
    HeaderName,
    HeaderGlobalBar,
    HeaderGlobalAction,
    SideNav,
    SideNavItems,
    SideNavLink,
    Tooltip,
    OverflowMenu,
    OverflowMenuItem,
} from '@carbon/react';
import {
    UserAvatar,
    Settings,
    Notification,
    Dashboard,
    Archive,
    Document,
    Light,
    Asleep,
    Globe,
} from '@carbon/icons-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

export default function DashboardHeader() {
    const { theme, toggleTheme } = useTheme();
    const { t, i18n } = useTranslation('common');
    const router = useRouter();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        // Refresh the current page to apply the language change
        router.refresh();
    };

    return (
        <HeaderContainer
            render={({ isSideNavExpanded, onClickSideNavExpand }) => (
                
                    <Header aria-label="IBM IntelliSphere® Optim™">
                        <HeaderName href='/' prefix="IBM IntelliSphere®">Optim™</HeaderName>
                        <HeaderGlobalBar >
                            {/* Language Switcher */}
                            <OverflowMenu
                                renderIcon={() => <Globe size={20} />}
                                ariaLabel={t('header.language.select')}
                                flipped
                            >
                                <OverflowMenuItem
                                    itemText={t('header.language.en')}
                                    onClick={() => changeLanguage('en')}
                                    disabled={i18n.language === 'en'}
                                />
                                <OverflowMenuItem
                                    itemText={t('header.language.fr')}
                                    onClick={() => changeLanguage('fr')}
                                    disabled={i18n.language === 'fr'}
                                />
                                <OverflowMenuItem
                                    itemText={t('header.language.de')}
                                    onClick={() => changeLanguage('de')}
                                    disabled={i18n.language === 'de'}
                                />
                                <OverflowMenuItem
                                    itemText={t('header.language.es')}
                                    onClick={() => changeLanguage('es')}
                                    disabled={i18n.language === 'es'}
                                />
                            </OverflowMenu>

                            {/* Theme Toggle */}
                            <Tooltip
                                size="sm"
                                align="bottom"
                                direction="bottom"
                                label={theme === 'light'
                                    ? t('header.theme.toggleDark')
                                    : t('header.theme.toggleLight')
                                }
                            >
                                <HeaderGlobalAction
                                    aria-label="Theme toggle"
                                    onClick={toggleTheme}
                                    isActive={false}
                                >
                                    {theme === 'light' ? <Asleep size={20} /> : <Light size={20} />}
                                </HeaderGlobalAction>
                            </Tooltip>
                            <HeaderGlobalAction aria-label="Notifications">
                                <Notification size={20} />
                            </HeaderGlobalAction>
                            <HeaderGlobalAction aria-label="Settings">
                                <Settings size={20} />
                            </HeaderGlobalAction>
                            <HeaderGlobalAction aria-label="User">
                                <UserAvatar size={20} />
                            </HeaderGlobalAction>
                        </HeaderGlobalBar>
                        <SideNav
                            aria-label="Side navigation"
                            expanded={isSideNavExpanded}
                            isPersistent={false}
                        >
                            <SideNavItems>
                                <SideNavLink renderIcon={Dashboard} href="/dashboard">
                                    {t('header.dashboard')}
                                </SideNavLink>
                                <SideNavLink renderIcon={Archive} href="/dashboard/archive">
                                    {t('header.archive')}
                                </SideNavLink>
                                <SideNavLink renderIcon={Document} href="/dashboard/documents">
                                    {t('header.documents')}
                                </SideNavLink>
                            </SideNavItems>
                        </SideNav>
                    </Header>
                
            )}
        />
    );
}
