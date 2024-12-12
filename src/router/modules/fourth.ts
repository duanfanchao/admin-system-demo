import { fourth } from "../enums";

export default {
    path: '/fourth',
    name: 'fourth',
    component: () => import('../../views/fourth/index.vue'),
    meta: {
        title: '第四页',
        rank: fourth,
        icon: 'chat-line-round',
    }
}