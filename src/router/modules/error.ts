import { error } from "../enums";

export default {
    path: '/error',
    redirect: '/error/404',
    meta: {
        title: '错误页',
        rank: error,
        icon: 'warning',
    },
    children: [
        {
            path: '/error/404',
            name: '404',
            component: () => import('../../views/error/404.vue'),
            meta: {
                title: '404',
            }
        },
        {
            path: '/error/500',
            name: '500',
            component: () => import('../../views/error/500.vue'),
            meta: {
                title: '500',
            }
        },
    ]
}