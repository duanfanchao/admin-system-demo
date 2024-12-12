export interface setType {
    sidebar: {
        opened: boolean;
        withoutAnimation: boolean;
        isClickCollapse: boolean;
    };
    device: string;
    classes: {
        hideSidebar: boolean;
        openSidebar: boolean;
        withoutAnimation: boolean;
        mobile: boolean;
    };
    fixedHeader: boolean,
}

export type menuType = {
    id?: number;
    name?: string;
    path?: string;
    noShowingChildren?: boolean;
    children?: menuType[];
    value: unknown;
    meta?: {
        icon?: string;
        title?: string;
        rank?: number;
        showParent?: boolean;
        extraIcon?: string;
    };
    showTooltip?: boolean;
    parentId?: number;
    pathList?: number[];
    redirect?: string;
};

export type tagsViewsType = {
    icon: string;
    text: string;
    divided: boolean;
    disabled: boolean;
    show: boolean;
    defaultIcon: string,
    hoverIcon: string,
};

export type routeMetaType = {
    title?: string;
    icon?: string;
    showLink?: boolean;
    savedPosition?: boolean;
    auths?: Array<string>;
};

export type RouteConfigs = {
    path?: string;
    query?: object;
    params?: object;
    meta?: routeMetaType;
    children?: RouteConfigs[];
    name?: string;
};

export interface optionsItem {
    path: string;
    type?: "history" | "collect";
    meta: {
        icon?: string;
        title?: string;
    };
}

export interface dragItem {
    oldIndex: number;
    newIndex: number;
}