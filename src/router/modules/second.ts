import { second } from "../enums";

export default {
    path: '/second',
    name: 'second',
    component: () => import('../../views/second/index.vue'),
    meta: {
        title: '第二页',
        rank: second,
        icon: 'baseball',
    }
}
