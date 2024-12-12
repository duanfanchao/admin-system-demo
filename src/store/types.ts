import type { RouteRecordName } from "vue-router";

export type cacheType = {
    mode: string;
    name?: RouteRecordName;
};

export type positionType = {
    startIndex?: number;
    length?: number;
};

export type RouteItem = {
    path: string;
    redirect?: string;
    componentPath?: string;
    parentName?: string;
    component?: any;
    meta?: {
        title?: string;
        icon?: string;
        showLink?: boolean;
        showParent?: boolean;
        saveSrollTop?: boolean;
        rank?: number;
    };
    children?: RouteItem[];
    name?: string;
}

export type appType = {
    sidebar: {
        opened: boolean;
        withoutAnimation: boolean;
        // 判断是否手动点击Collapse
        isClickCollapse: boolean;
    };
    layout: string;
    device: string;
    viewportSize: { width: number; height: number };
    sortSwap: boolean;
};

export type multiType = {
    path: string;
    name: string;
    meta: any;
    query?: object;
    params?: object;
};

export type setType = {
    title: string | undefined;
    fixedHeader: boolean | undefined;
    hiddenSideBar: boolean | undefined;
};

export type userType = {
    avatar?: string;
    username?: string;
    nickname?: string;
    roles?: Array<string>;
    permissions?: Array<string>;
    verifyCode?: string;
    currentPage?: number;
    isRemembered?: boolean;
    loginDay?: number;
};
