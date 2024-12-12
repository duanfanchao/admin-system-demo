import {
    ref,
    unref,
    computed,
    reactive,
    onMounted,
    type CSSProperties,
    getCurrentInstance,
    toRaw,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { LocalStorageService } from "../../utils/localStorageService";
import type { tagsViewsType } from "../types";
import { useSettingStoreHook } from "../../store/modules/settings";
import ICON_ALL_ACTIVE from '@/assets/icon-all-active.png'; // 关闭全部
import ICON_CLOSE_ACTIVE from '@/assets/icon-close-active.png'; // 关闭当前
import ICON_CLOSE_LEFT_ACTIVE from '@/assets/icon-close-left-active.png'; // 关闭左侧
import ICON_CLOSE_RIGHT_ACTIVE from '@/assets/icon-close-right-active.png'; // 关闭右侧
import ICON_CLOSE_OTHER_ACTIVE from '@/assets/icon-close-other-active.png'; // 关闭其他
import ICON_FULL_SCREEN_ACTIVE from '@/assets/icon-full-screen-active.png'; // 全屏
// import ICON_EXIT_FULL_SCREEN_ACTIVE from '@/assets/icon-exit-full-screen-active.png'; // 退出全屏
import ICON_RELOAD_ACTIVE from '@/assets/icon-reload-active.png'; // 重新加载

import ICON_ALL from '@/assets/icon-all.png';
import ICON_CLOSE from '@/assets/icon-close.png';
import ICON_CLOSE_LEFT from '@/assets/icon-close-left.png';
import ICON_CLOSE_RIGHT from '@/assets/icon-close-right.png';
import ICON_CLOSE_OTHER from '@/assets/icon-close-other.png';
// import ICON_EXIT_FULL_SCREEN from '@/assets/icon-exit-full-screen.png';
import ICON_FULL_SCREEN from '@/assets/icon-full-screen.png';
import ICON_RELOAD from '@/assets/icon-reload.png';


export function useTags() {
    const instance = getCurrentInstance();
    const localStorageService = new LocalStorageService();
    const pureSetting = useSettingStoreHook();

    // 当前右键选中的路由信息
    const currentSelect = ref({});
    const multiTags = ref<RouteItem[]>([]);
    const tagsViews = reactive<Array<tagsViewsType>>([
        {
            icon: 'refresh-right',
            defaultIcon: ICON_RELOAD,
            hoverIcon: ICON_RELOAD_ACTIVE,
            text: '重新加载',
            divided: false,
            disabled: false,
            show: true
        },
        {
            icon: 'close',
            defaultIcon: ICON_CLOSE,
            hoverIcon: ICON_CLOSE_ACTIVE,
            text: '关闭当前标签页',
            divided: false,
            disabled: multiTags.value.length > 1 ? false : true,
            show: true
        },
        {
            icon: 'close',
            defaultIcon: ICON_CLOSE_LEFT,
            hoverIcon: ICON_CLOSE_LEFT_ACTIVE,
            text: '关闭左侧标签页',
            divided: true,
            disabled: multiTags.value.length > 1 ? false : true,
            show: true
        },
        {
            icon: 'close',
            defaultIcon: ICON_CLOSE_RIGHT,
            hoverIcon: ICON_CLOSE_RIGHT_ACTIVE,
            text: '关闭右侧标签页',
            divided: false,
            disabled: multiTags.value.length > 1 ? false : true,
            show: true
        },
        {
            icon: 'close',
            defaultIcon: ICON_CLOSE_OTHER,
            hoverIcon: ICON_CLOSE_OTHER_ACTIVE,
            text: '关闭其他标签页',
            divided: true,
            disabled: multiTags.value.length > 2 ? false : true,
            show: true
        },
        {
            icon: 'minus',
            defaultIcon: ICON_ALL,
            hoverIcon: ICON_ALL_ACTIVE,
            text: '关闭全部标签页',
            divided: false,
            disabled: multiTags.value.length > 1 ? false : true,
            show: true
        },
        {
            icon: 'full-screen',
            defaultIcon: ICON_FULL_SCREEN,
            hoverIcon: ICON_FULL_SCREEN_ACTIVE,
            text: '内容区全屏',
            divided: true,
            disabled: false,
            show: true
        }
    ]);

    /** 是否隐藏标签页，默认显示 */
    const showTags = ref<boolean>(false);
    /** 显示模式，默认灵动模式 */
    const showModel = ref("smart");
    const isScrolling = ref(false);
    const buttonTop = ref(0);
    const buttonLeft = ref(0);
    const translateX = ref(0);
    // 用于设置激活tag
    const activeIndex = ref(-1);
    // 鼠标悬浮时的key
    const keyHover = ref("");
    // 右键菜单按钮显示与隐藏
    const rightKeyVisible = ref(false);
    const route = useRoute();
    const router = useRouter();
    const routes: any = router.options.routes;

    // computed

    const getContextMenuStyle = computed((): CSSProperties => {
        return { left: buttonLeft.value + "px", top: buttonTop.value + "px" };
    });
    const getTabStyle = computed((): CSSProperties => {
        return {
            transform: `translateX(${translateX.value}px)`,
            transition: isScrolling.value ? "none" : "transform 0.5s ease-in-out"
        };
    });
    const tagHoverStyle = computed(() => {
        return (index: number, path: string) => {
            return index !== 0 ? path === keyHover.value : false;
        };
    });
    const linkIsActive = computed(() => {
        return (index: number) => {
            return activeIndex.value === index;
        };
    });

    // method

    const setDropMenuShow = (val: boolean) => {
        Array.of(1, 2, 3, 4, 5).forEach(v => {
            tagsViews[v].show = val;
            tagsViews[v].disabled = true;
        });
    }
    const queryRouteByPath = (val: string) => {
        let route;
        const mapRoutes = (data: any) => {
            data.forEach((ele: any) => {
                if (ele.path === val) {
                    route = ele;
                }
                if (ele.children && ele.children.length > 0) {
                    mapRoutes(ele.children)
                }
            })
        }
        mapRoutes(routes);
        return route;
    }
    // 判断类名
    const hasClass = (element: HTMLElement, className: string) => {
        return element.classList.contains(className);
    };
    // 类名切换
    const toggleClass = (
        bool: boolean,
        element: HTMLElement,
        className: string
    ) => {
        if (bool) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    };
    /** 鼠标移入添加激活样式 */
    const onMouseleave = (path: string, index: number): void => {
        keyHover.value = "";
        if (instance) {
            const scheduleRef = instance.refs[
                "schedule" + index
            ] as HTMLElement[];
            if (!hasClass(scheduleRef[0], "schedule-active")) {
                toggleClass(false, scheduleRef[0], "schedule-in");
                toggleClass(true, scheduleRef[0], "schedule-out");
            }
        }
    };
    /** 鼠标移出恢复默认样式 */
    const onMouseenter = (path: string, index: number): void => {
        keyHover.value = path;
        if (instance) {
            const scheduleRef = instance.refs[
                "schedule" + index
            ] as HTMLElement[];
            if (!hasClass(scheduleRef[0], "schedule-active")) {
                toggleClass(false, scheduleRef[0], "schedule-out");
                toggleClass(true, scheduleRef[0], "schedule-in");
            }
        }
    };
    const handleTag = (val: string): void => {
        const data =
            localStorageService.getItem<RouteItem[]>("menuCacheList");

        let routeInfo: any = queryRouteByPath(val);
        if (data) {
            if (data.find((ele: RouteItem) => ele.path === val)) {
                multiTags.value = data;
            } else {
                data.push(routeInfo);
                localStorageService.setItem("menuCacheList", data);
                multiTags.value = data;
            }
            const index = data.findIndex(
                (ele: RouteItem) => ele.path === val
            );
            activeIndex.value = index;
        } else {
            // 初始化进入，缓存“首页”菜单信息
            localStorageService.setItem("menuCacheList", [routeInfo]);
            multiTags.value = [routeInfo];
            activeIndex.value = 0;
        }
    };
    /**
     * 查找索引
     * @param path 匹配路径
     * @param data 匹配数据
     * @returns    “匹配路径”在“匹配数据”的索引
     */
    const queryIndex = (path: string, data: RouteItem[]): number => {
        return data.findIndex((ele: RouteItem) => ele.path === path);
    }
    const deleteMenu = (val: RouteItem, type: string): void => {
        
        // 右键所在菜单的索引
        const targetIndex = queryIndex(val.path, multiTags.value);
        // 删除自身
        if (type === 'self') {
            multiTags.value = multiTags.value.filter(
                (ele: RouteItem) => ele.path !== val.path
            );
            // 判断当前删除的是否是激活的tag
            if (targetIndex === activeIndex.value) {
                activeIndex.value = multiTags.value.length - 1;
                router.push(multiTags.value[activeIndex.value].path);
            } else {
                activeIndex.value = queryIndex(route.path, multiTags.value);
            }
        } else if (type === 'left') {
            // 当前激活的菜单索引
            const currentActiveIndex = queryIndex(route.path, multiTags.value);
            multiTags.value = [multiTags.value[0], ...multiTags.value.slice(targetIndex)];
            activeIndex.value = queryIndex(route.path, multiTags.value);
            if (targetIndex >= currentActiveIndex) {
                // 右键所在菜单在激活菜单的右边或同一个位置，路由切换为当前右键所在菜单
                router.push(route.path);
            }
        } else if (type === 'right') {
            // 当前激活的菜单索引
            const currentActiveIndex = queryIndex(route.path, multiTags.value);
            multiTags.value = multiTags.value.slice(0, targetIndex + 1);
            if (targetIndex <= currentActiveIndex) {
                // 右键所在菜单在激活菜单的左边或同一个位置，路由切换为当前右键所在菜单
                activeIndex.value = targetIndex;
                router.push(multiTags.value[activeIndex.value].path);
            } else {
                // 右键所在菜单在激活菜单的右边，清除右键所在菜单后面的菜单项(不涉及路由切换)
                activeIndex.value = currentActiveIndex;
            }
        } else if (type === 'all') {
            multiTags.value = [multiTags.value[0]];
            activeIndex.value = 0;
            router.push('/');
        } else if (type === 'other') {
            multiTags.value = [multiTags.value[0], multiTags.value[targetIndex]];
            activeIndex.value = queryIndex(val.path, multiTags.value);
            router.push(val.path);
        }
        localStorageService.setItem("menuCacheList", multiTags.value);
    };
    const tagOnClick = (item: RouteItem): void => {
        router.push(item.path);
        keyHover.value = item.path;
        const index = multiTags.value.findIndex(
            (ele: RouteItem) => ele.path === item.path
        );
        activeIndex.value = index;
    };
    const closeMenu = () => {
        rightKeyVisible.value = false;
    }
    const onContentFullScreen = () => {
        pureSetting.hiddenSideBar
            ? pureSetting.changeSetting({ key: "hiddenSideBar", value: false })
            : pureSetting.changeSetting({ key: "hiddenSideBar", value: true });
    }
    return {
        setDropMenuShow,
        activeIndex,
        showTags,
        showModel,
        isScrolling,
        getTabStyle,
        translateX,
        linkIsActive,
        queryRouteByPath,
        onMouseleave,
        keyHover,
        onMouseenter,
        tagHoverStyle,
        handleTag,
        multiTags,
        tagOnClick,
        deleteMenu,
        rightKeyVisible,
        getContextMenuStyle,
        tagsViews,
        buttonLeft,
        buttonTop,
        closeMenu,
        currentSelect,
        onContentFullScreen,
        instance,
    }
}