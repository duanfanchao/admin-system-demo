import { third } from "../enums";

export default {
    path: '/third',
    name: 'third',
    component: () => import('../../views/third/index.vue'),
    meta: {
        title: '第三页',
        rank: third,
        icon: 'calendar',
    }
}