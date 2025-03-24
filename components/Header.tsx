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
} from '@carbon/icons-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function DashboardHeader() {
    const { theme, toggleTheme } = useTheme();
    
    return (
        <HeaderContainer
            render={({ isSideNavExpanded, onClickSideNavExpand }) => (
                <>
                    <Header aria-label="IBM IntelliSphere® Optim™">
                        <HeaderName href='/' prefix="IBM IntelliSphere®">Optim™</HeaderName>
                            <HeaderGlobalBar>
                                <Tooltip 
                                    align="bottom"
                                    direction="bottom"
                                    label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
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
                                        Dashboard
                                    </SideNavLink>
                                    <SideNavLink renderIcon={Archive} href="/dashboard/archive">
                                        Archive
                                    </SideNavLink>
                                    <SideNavLink renderIcon={Document} href="/dashboard/documents">
                                        Documents
                                    </SideNavLink>
                                </SideNavItems>
                            </SideNav>
                    </Header>
                </>
            )}
        />
    );
}
