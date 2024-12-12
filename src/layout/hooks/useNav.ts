import { useAppStoreHook } from "../../store/modules/app";
import { computed, type CSSProperties } from "vue";
import { getConfig } from "../../config/index";
import { useFullscreen } from "@vueuse/core";

export function useNav() {
    const pureApp = useAppStoreHook();
    const { isFullscreen, toggle } = useFullscreen();
    /** 平台`layout`中所有`el-tooltip`的`effect`配置，默认`light` */
    const tooltipEffect = getConfig()?.TooltipEffect ?? "light";
    const title = "PureAdmin";
    /** 获取`logo` */
    function getLogo() {
        return new URL("/logo.svg", import.meta.url).href;
    }
    const isCollapse = computed(() => {
        return !pureApp.getSidebarStatus;
    });
    const device = computed(() => {
        return pureApp.getDevice;
    });
    function toggleSideBar() {
        pureApp.toggleSideBar();
    }
    const getDivStyle = computed((): CSSProperties => {
        return {
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            overflow: "hidden"
        };
    });
    return {
        title,
        getLogo,
        isCollapse,
        toggleSideBar,
        device,
        pureApp,
        tooltipEffect,
        getDivStyle,
        toggle,
        isFullscreen,
    }
}