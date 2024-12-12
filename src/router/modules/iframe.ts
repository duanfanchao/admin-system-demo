import { iframe } from "../enums";

export default {
    path: '/iframe',
    redirect: '/iframe/embedded',
    meta: {
        title: '外部页面',
        rank: iframe,
        icon: 'link',
    },
    children: [
        {
            path: '/iframe/embedded',
            redirect: '/iframe/embedded/vue2',
            meta: {
                title: '文档内嵌',
                showParent: true,
            },
            children: [
                {
                    path: '/iframe/embedded/vue2',
                    name: 'vue2',
                    component: () => import('../../views/iframe/embedded/vue2/index.vue'),
                    meta: {
                        title: 'vue2',
                    }
                },
                {
                    path: '/iframe/embedded/vue3',
                    name: 'vue3',
                    component: () => import('../../views/iframe/embedded/vue3/index.vue'),
                    meta: {
                        title: 'vue3',
                    }
                },
            ]
        },
        {
            path: '/iframe/external',
            redirect: '/iframe/external/pure-admin-utils',
            meta: {
                title: '文档外链',
                showParent: true,
            },
            children: [
                {
                    path: '/iframe/external/pure-admin-utils',
                    name: 'pure-admin-utils',
                    component: () => import('../../views/iframe/external/pure-admin-utils/index.vue'),
                    meta: {
                        title: 'pure-admin-utils',
                    }
                },
                {
                    path: '/iframe/external/vue-admin-pure',
                    name: 'vue-admin-pure',
                    component: () => import('../../views/iframe/external/vue-admin-pure/index.vue'),
                    meta: {
                        title: 'vue-admin-pure',
                    }
                },
            ]
        }
    ]
}