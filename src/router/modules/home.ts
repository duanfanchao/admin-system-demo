import { home } from "../enums";

export default {
    path: '/home',
    name: 'home',
    component: () => import("../../views/home/index.vue"),
    meta: {
        title: '主页',
        icon: 'location',
        rank: home,
    }
}
