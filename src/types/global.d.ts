
declare global {
    interface PlatformConfigs {
        Version?: string;
        Title?: string;
        FixedHeader?: boolean;
        HiddenSideBar?: boolean;
        MultiTagsCache?: boolean;
        MaxTagsLevel?: number;
        KeepAlive?: boolean;
        Locale?: string;
        Layout?: string;
        Theme?: string;
        DarkMode?: boolean;
        OverallStyle?: string;
        Grey?: boolean;
        Weak?: boolean;
        HideTabs?: boolean;
        HideFooter?: boolean;
        Stretch?: boolean | number;
        SidebarStatus?: boolean;
        EpThemeColor?: string;
        ShowLogo?: boolean;
        ShowModel?: string;
        MenuArrowIconNoTransition?: boolean;
        CachingAsyncRoutes?: boolean;
        TooltipEffect?: Effect;
        ResponsiveStorageNameSpace?: string;
        MenuSearchHistory?: number;
        MapConfigure?: {
            amapKey?: string;
            options: {
                resizeEnable?: boolean;
                center?: number[];
                zoom?: number;
            };
        };
    }
    interface RouteItem {
        redirect: string;
        name: string;
        path: string;
        children?: RouteItem[];
        meta: {
            title: string;
            icon?: string;
        };
        query?: any,
        params?: any,
    }
    interface HistoryRouteItem {
        type: string;
        meta: {
            title: string;
            icon?: string;
        };
        path: string;
        name: string;
        redirect: string;
    }
}

export { };