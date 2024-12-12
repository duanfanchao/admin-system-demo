import {
    type RouterHistory,
    type RouteRecordRaw,
    type RouteComponent,
    createWebHistory,
    createWebHashHistory
} from "vue-router";

/**
 * @description 创建层级关系
 * @param tree 树
 * @param pathList 每一项的id组成的数组
 * @returns 创建层级关系后的树
 */
export const buildHierarchyTree = (tree: any[], pathList = []): any => {
    if (!Array.isArray(tree)) {
        console.warn("tree must be an array");
        return [];
    }
    if (!tree || tree.length === 0) return [];
    for (const [key, node] of tree.entries()) {
        node.id = key;
        node.parentId = pathList.length ? pathList[pathList.length - 1] : null;
        node.pathList = [...pathList, node.id];
        const hasChildren = node.children && node.children.length > 0;
        if (hasChildren) {
            buildHierarchyTree(node.children, node.pathList);
        }
    }
    return tree;
};

/**
 * 将多级嵌套路由处理成一维数组
 * @param routesList 传入路由
 * @returns 返回处理后的一维路由
 */
function formatFlatteningRoutes(routesList: RouteRecordRaw[]) {
    if (routesList.length === 0) return routesList;
    let hierarchyList = buildHierarchyTree(routesList);
    for (let i = 0; i < hierarchyList.length; i++) {
        if (hierarchyList[i].children) {
            hierarchyList = hierarchyList
                .slice(0, i + 1)
                .concat(hierarchyList[i].children, hierarchyList.slice(i + 1));
        }
    }
    return hierarchyList;
}

/**
 * 一维数组处理成多级嵌套数组（三级及以上的路由全部拍成二级，keep-alive 只支持到二级缓存）
 * https://github.com/pure-admin/vue-pure-admin/issues/67
 * @param routesList 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成规定路由的格式
 */
function formatTwoStageRoutes(routesList: RouteRecordRaw[]) {
    if (routesList.length === 0) return routesList;
    const newRoutesList: RouteRecordRaw[] = [];
    routesList.forEach((v: RouteRecordRaw) => {
        if (v.path === "/") {
            newRoutesList.push({
                component: v.component,
                name: v.name,
                path: v.path,
                redirect: v.redirect,
                meta: v.meta,
                children: []
            });
        } else {
            newRoutesList[0]?.children.push({ ...v });
        }
    });
    return newRoutesList;
}

// 重构后端返回路由菜单，与前端路由保持一致
function refactoringTree(array: any[]): any[] {
    let run = function (data: any[]): void {
        for (let obj of data) {
            if (obj.componentPath) {
                obj['component'] = () => import(`@/views/${obj.componentPath}.vue`)
            }
            if (obj.children) {
                run(obj.children)
            }
        }
    }
    run(array);
    return array;
}

export {
    formatFlatteningRoutes,
    formatTwoStageRoutes,
    refactoringTree,
}
