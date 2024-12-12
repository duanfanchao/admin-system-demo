import {
    type Router,
    createRouter,
    type RouteComponent
} from "vue-router";
import {
    getHistoryMode,
    ascending,
} from "./utils";
import { buildHierarchyTree, formatFlatteningRoutes, formatTwoStageRoutes } from '../utils/tree';
import remainingRouter from "./modules/remaining";
import NProgress from "../utils/progress";
import { RouteRecordRaw } from 'vue-router';

// 1.前端写死路由的加载方式

/** 自动导入全部静态路由，无需再手动引入！匹配 src/router/modules 目录（任何嵌套级别）中具有 .ts 扩展名的所有文件，除了 remaining.ts 文件
 * 如何匹配所有文件请看：https://github.com/mrmlnc/fast-glob#basic-syntax
 * 如何排除文件请看：https://cn.vitejs.dev/guide/features.html#negative-patterns
 */
const modules: Record<string, any> = import.meta.glob(
    ["./modules/**/*.ts", "!./modules/**/remaining.ts"],
    {
        eager: true
    }
);

/** 原始静态路由 */
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/home',
        component: () => import('../layout/index.vue'),
        meta: {
            title: '主页'
        },
        children: []
    }
]

Object.keys(modules).forEach(key => {
    const module = modules[key].default;
    if (module && module.path) {
        if (!routes[0].children) routes[0].children = []; // 如果是 undefined，初始化为空数组
        routes[0].children.push(module);
    }
});

/** 导出处理后的静态路由（三级及以上的路由全部拍成二级） */
export const constantRoutes: Array<RouteRecordRaw> = formatFlatteningRoutes(buildHierarchyTree(ascending(routes.flat(Infinity))));

export const constantMenus = buildHierarchyTree(ascending(routes))[0].children;

/** 创建路由实例 */
export const router: Router = createRouter({
    history: getHistoryMode(import.meta.env.VITE_ROUTER_HISTORY),
    routes: ascending(routes).concat(...remainingRouter), // 前端写死路由的加载方式
    strict: true,
    scrollBehavior(to, from, savedPosition) {
        return new Promise(resolve => {
            if (savedPosition) {
                return savedPosition;
            } else {
                if (from.meta.saveSrollTop) {
                    const top: number =
                        document.documentElement.scrollTop || document.body.scrollTop;
                    resolve({ left: 0, top });
                }
            }
        });
    }
});

router.beforeEach(async (to: any, _from, next) => {
    NProgress.start();
    next();
});

router.afterEach(() => {
    NProgress.done();
});

export default router;