import { table } from "../enums";

export default {
    path: '/table',
    redirect: '/table/index',
    meta: {
        title: '表格',
        rank: table,
        icon: 'wind-power',
    },
    children: [
        {
            path: '/table/index',
            name: 'table',
            component: () => import('../../views/table/index.vue'),
            meta: {
                title: '卡片列表',
                icon: 'credit-card',
                showParent: true,
            }
        }
    ]
}