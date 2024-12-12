import {
    type RouterHistory,
    type RouteRecordRaw,
    type RouteComponent,
    createWebHistory,
    createWebHashHistory
} from "vue-router";
import { getConfig } from "../config";

// declare function isAllEmpty<T = unknown>(val: T): val is T;
function isAllEmpty(val: any) {
    return val ? true : false;
}

function handRank(routeInfo: any) {
    const { name, path, parentId, meta } = routeInfo;
    return isAllEmpty(parentId)
        ? isAllEmpty(meta?.rank) ||
            (meta?.rank === 0 && name !== "Home" && path !== "/")
            ? true
            : false
        : false;
}

/** 通过指定 `key` 获取父级路径集合，默认 `key` 为 `path` */
function getParentPaths(value: string, routes: RouteRecordRaw[], key = "path") {
    // 深度遍历查找
    function dfs(routes: RouteRecordRaw[], value: string, parents: string[]) {
        for (let i = 0; i < routes.length; i++) {
            const item = routes[i];
            // 返回父级path
            if (item[key] === value) return parents;
            // children不存在或为空则不递归
            if (!item.children || !item.children.length) continue;
            // 往下查找时将当前path入栈
            parents.push(item.path);

            if (dfs(item.children, value, parents).length) return parents;
            // 深度遍历查找未找到时当前path 出栈
            parents.pop();
        }
        // 未找到时返回空数组
        return [];
    }

    return dfs(routes, value, []);
}

/** 按照路由中meta下的rank等级升序来排序路由 */
function ascending(arr: any[]) {
    return arr.map(item => {
        // 克隆对象并对 children 排序
        const sortedChildren = item.children.slice().sort((a: any, b: any) => a.meta.rank - b.meta.rank);
        return {
            ...item,
            children: sortedChildren, // 返回排序后的 children
        };
    });
}
/** 过滤meta中showLink为false的菜单 */
function filterTree(data: RouteComponent[]) {
    return data.filter(ele => ele.meta?.showLink !== false);
}

/** 获取路由历史模式 https://next.router.vuejs.org/zh/guide/essentials/history-mode.html */
function getHistoryMode(routerHistory): RouterHistory {
    // len为1 代表只有历史模式 为2 代表历史模式中存在base参数 https://next.router.vuejs.org/zh/api/#%E5%8F%82%E6%95%B0-1
    const historyMode = routerHistory.split(",");
    const leftMode = historyMode[0];
    const rightMode = historyMode[1];
    // no param
    if (historyMode.length === 1) {
        if (leftMode === "hash") {
            return createWebHashHistory("");
        } else if (leftMode === "h5") {
            return createWebHistory("");
        }
    } //has param
    else if (historyMode.length === 2) {
        if (leftMode === "hash") {
            return createWebHashHistory(rightMode);
        } else if (leftMode === "h5") {
            return createWebHistory(rightMode);
        }
    }
}

/**
 * 
 * @param routes        全局路由数据
 * @param targetRoute   目标路由信息（当前路由的path）
 * @param routePathList 当前路由字符串集合
 */
function queryCurrentRoute(routes: RouteRecordRaw[], targetPath: string) {
    let result: RouteRecordRaw[] = [];
    // // 菜单路由数据
    // const menuRouteData = routes.filter(ele => ele.path === routePathList[0]);
    // // 菜单所有子路由数据
    // const subRouteList = menuRouteData[0].children;
    // if (subRouteList) {
    //     if (routePathList.length == 1) {
    //         res.push(subRouteList.find(ele => ele.path === targetRoute));
    //     } else {
    //         for (let i = 0; i < routePathList.length; i++) {
    //             if (routePathList[i] === '/' || routePathList.length !== (i + 1)) {
    //                 res.push(subRouteList.find(ele => ele.path === routePathList[i + 1]))
    //             }
    //             if (routePathList.length === (i + 1)) {
    //                 const obj = subRouteList.find(ele => ele.path === targetRoute);
    //                 const lastItem: any = res[res.length - 1];
    //                 if (obj && lastItem?.meta.title !== obj?.meta.title) {
    //                     res.push(obj);
    //                 }
    //             }
    //         }
    //     }
    // }
    // return res;
    function search(node: RouteRecordRaw, currentPath: string) {
        // 如果当前节点的路径匹配目标路径的一部分，则加入结果数组
        if (currentPath === targetPath) {
            result.push(node);
            return true;
        }

        // 如果当前路径是目标路径的一部分（即路径前缀匹配）
        if (targetPath.startsWith(currentPath)) {
            result.push(node);  // 将当前节点加入结果
        }

        // 继续查找子节点
        if (node.children) {
            for (let child of node.children) {
                if (search(child, child.path)) {
                    return true; // 找到目标路径就终止搜索
                }
            }
        }

        return false;
    }
    // 从根节点开始搜索
    for (let item of routes) {
        if (search(item, item.path)) {
            break;  // 一旦找到路径，退出循环
        }
    }

    return result;
}

export {
    getHistoryMode,
    ascending,
    isAllEmpty,
    getParentPaths,
    filterTree,
    queryCurrentRoute,
}