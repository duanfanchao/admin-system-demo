import { defineStore } from "pinia";
import {
    // type cacheType,
    store,
    // debounce,
    // ascending,
    // getKeyList,
    // filterTree,
    // filterNoPermissionTree,
    // formatFlatteningRoutes
} from "../utils";
import { constantMenus } from "../../router";

export const usePermissionStore = defineStore({
    id: 'pure-permission',
    state: () => ({
        // 静态路由生成的菜单
        constantMenus: constantMenus,
        // 整体路由生成的菜单（静态、动态）
        wholeMenus: [],
        // 整体路由（一维数组格式）
        flatteningRoutes: [],
        // 缓存页面keepAlive
        cachePageList: []
    }),
    actions: {
        /** 清空缓存页面 */
        clearAllCachePage() {
            this.wholeMenus = [];
            this.cachePageList = [];
        }
    }
});

export function usePermissionStoreHook() {
    return usePermissionStore(store);
}