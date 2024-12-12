import { first } from "../enums";

export default {
    path: '/first',
    name: 'first',
    component: () => import("../../views/first/index.vue"),
    meta: {
        title: '第一页',
        rank: first,
        icon: 'aim',
    }
}
