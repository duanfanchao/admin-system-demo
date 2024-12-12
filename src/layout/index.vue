<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 入口
    @path: /
    @lastChange: duanfc
-->

<template>
	<div ref="appWrapperRef" :class="['app-wrapper', set.classes]">
		<NavVertical v-if="!pureSetting.hiddenSideBar" />
		<div
			:class="[
				'main-container',
				pureSetting.hiddenSideBar ? 'main-hidden' : '',
			]"
		>
			<div v-if="set.fixedHeader">
				<LayHeader :set="set" />
				<!-- 主体内容 -->
				<LayContent :fixed-header="set.fixedHeader" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {
	computed,
	ref,
	reactive,
	onMounted,
	onBeforeUnmount,
	watch,
	toRefs,
	provide,
	inject,
	nextTick,
	defineComponent,
	h,
} from "vue";
import NavVertical from "./component/lay-sidebar/NavVertical.vue";
import { setType } from "./types";
import { useAppStoreHook } from "../store/modules/app";
import { useSettingStoreHook } from "../store/modules/settings";
import LayHeader from "./component/lay-header/index.vue";
import LayContent from "./component/lay-content/index.vue";
import { useResize } from "./hooks/useResize";

export default defineComponent({
	name: "layout",
	components: {
		NavVertical,
		LayHeader,
		LayContent,
	},
	setup(props, ctx) {
		const pureSetting = useSettingStoreHook();
		const set: setType = reactive({
			sidebar: computed(() => {
				return useAppStoreHook().sidebar;
			}),
			device: computed(() => {
				return useAppStoreHook().device;
			}),
			fixedHeader: computed(() => {
				return pureSetting.fixedHeader;
			}),
			classes: computed(() => {
				return {
					hideSidebar: !set.sidebar.opened,
					openSidebar: set.sidebar.opened,
					withoutAnimation: set.sidebar.withoutAnimation,
					mobile: set.device === "mobile",
				};
			}),
		});
		// 判断是否可自动关闭菜单栏
		let isAutoCloseSidebar = true;
		function toggle(device: string, bool: boolean) {
			useAppStoreHook().toggleDevice(device);
			useAppStoreHook().toggleSideBar(bool, "resize");
		}
		const appWrapperRef = ref<HTMLElement | null>(null);
		/** width app-wrapper类容器宽度
		 * 0 < width <= 760 隐藏侧边栏
		 * 760 < width <= 990 折叠侧边栏
		 * width > 990 展开侧边栏
		 */
		// useResize(
		// 	appWrapperRef,
		// 	(width, height) => {
		// 		if (width > 0 && width <= 760) {
		// 			// 移动端
		// 			toggle("mobile", false);
		// 			isAutoCloseSidebar = true;
		// 		} else if (width > 760 && width <= 990) {
		// 			if (isAutoCloseSidebar) {
		// 				toggle("desktop", false);
		// 				isAutoCloseSidebar = false;
		// 			}
		// 		} else if (width > 990 && !set.sidebar.isClickCollapse) {
		// 			toggle("desktop", true);
		// 			isAutoCloseSidebar = true;
		// 		} else {
		// 			toggle("desktop", false);
		// 			isAutoCloseSidebar = false;
		// 		}
		// 	},
		// 	500
		// );
		onMounted(() => {});

		onBeforeUnmount(() => {});
		return {
			set,
			appWrapperRef,
			pureSetting,
		};
	},
});
</script>

<style lang="scss" scoped>
.app-wrapper {
	position: relative;
	width: 100%;
	height: 100%;
}
</style>