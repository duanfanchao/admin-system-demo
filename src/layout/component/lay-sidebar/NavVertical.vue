<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<div
		class="sidebar-container has-logo"
		@mouseenter.prevent="isShow = true"
		@mouseleave.prevent="isShow = false"
	>
		<LaySidebarLogo :collapse="isCollapse" />
		<el-scrollbar wrap-class="scrollbar-wrapper" class="pc">
			<el-menu
				unique-opened
				mode="vertical"
				popper-class="pure-scrollbar"
				class="outer-most select-none"
				:collapse="isCollapse"
				:collapse-transition="false"
				:popper-effect="tooltipEffect"
				:default-active="defaultActive"
			>
				<LaySidebarItem
					v-for="routes in menuData"
					:key="routes.path"
					:item="routes"
					:base-path="routes.path"
				/>
			</el-menu>
		</el-scrollbar>
		<LaySidebarCenterCollapse
			:is-active="pureApp.sidebar.opened"
			v-if="isShow || isCollapse"
			@toggleClick="toggleSideBar"
		/>
		<LaySidebarLeftCollapse
			v-if="device !== 'mobile'"
			@toggleClick="toggleSideBar"
			:is-active="pureApp.sidebar.opened"
		/>
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
	nextTick,
} from "vue";
import LaySidebarLogo from "../lay-sidebar/components/SidebarLogo.vue";
import LaySidebarCenterCollapse from "../lay-sidebar/components/SidebarCenterCollapse.vue";
import LaySidebarLeftCollapse from "../lay-sidebar/components/SidebarLeftCollapse.vue";
import { useNav } from "@/layout/hooks/useNav";
import { useAppStoreHook } from "@/store/modules/app";
import { useRoute } from "vue-router";
import { menuType } from "@/layout/types";
import { usePermissionStoreHook } from "../../../store/modules/permission";
import { useRouteStoreHook } from '../../../store/modules/route';
import MenuIcon from "@/components/menu-icon/index.vue";
import LaySidebarItem from "./components/SidebarItem.vue";
import { isAllEmpty, filterTree } from "../../../router/utils";

export default {
	name: "NavVertical",
	props: {},
	components: {
		LaySidebarLogo,
		LaySidebarCenterCollapse,
		LaySidebarLeftCollapse,
		MenuIcon,
		LaySidebarItem,
	},
	setup() {
		const isShow = ref(false);
		const { toggleSideBar, isCollapse, device, pureApp, tooltipEffect } =
			useNav();
		const route = useRoute();
		const defaultActive = computed(() => {
			return !isAllEmpty(route.meta?.activePath)
				? route.path
				: route.path;
		});
		const menuData = computed(() => {            
            return filterTree(usePermissionStoreHook().constantMenus); // 前端写死的路由
            // return filterTree(useRouteStoreHook().routeData); // 模拟后端返回的路由
		});
		const onlyOneChild: menuType = ref(null);
		const hasOneShowChild = (children: menuType[] = [], item: menuType) => {
			const showingChildren = children.filter((item: any) => {
				onlyOneChild.value = item;
				return true;
			});
			if (showingChildren[0]?.meta?.showParent) {
				return false;
			}
			if (showingChildren.length === 1) {
				return true;
			}
			if (showingChildren.length === 0) {
				onlyOneChild.value = {
					...parent,
					path: "",
					noShowingChildren: true,
				};
				return true;
			}
			return false;
		};
		onMounted(() => {
			window.document.body.setAttribute("layout", "vertical");
		});
		return {
			isShow,
			isCollapse,
			toggleSideBar,
			device,
			pureApp,
			tooltipEffect,
			defaultActive,
			menuData,
			hasOneShowChild,
			onlyOneChild,
		};
	},
};
</script>

<style lang="scss" scoped>
:deep(.el-loading-mask) {
	opacity: 0.45;
}
</style>