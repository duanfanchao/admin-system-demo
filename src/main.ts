import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from "./router";
import { setupStore } from "@/store";
import { useI18n } from "@/plugins/i18n";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/style/theme.scss'

// 一定要在main.ts中导入tailwind.css，防止vite每次hmr都会请求src/style/index.scss整体css文件导致热更新慢的问题
import "./style/tailwind.css";

// 引入重置样式
import "./style/reset.scss";
// 导入公共样式
import "./style/index.scss";
// 全局注册vue-tippy
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import VueTippy from "vue-tippy";

const app = createApp(App);
// 注册elementPlus所有的图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(VueTippy);

import { getPlatformConfig } from "./config";
getPlatformConfig(app).then(async config => {
    setupStore(app);
    app.use(ElementPlus)
    app
        .use(useI18n)
    app.use(router);
    app.mount('#app')
});
