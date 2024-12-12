import { fifth } from "../enums";

export default {
    path: '/fifth',
    name: 'fifth',
    component: () => import('../../views/fifth/index.vue'),
    meta: {
        title: '第五页',
        rank: fifth,
        icon: 'coin',
    }
}