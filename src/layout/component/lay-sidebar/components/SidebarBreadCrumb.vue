<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<div class="sidebar-breadcrumb">
		<el-breadcrumb class="!leading-[50px] select-none" separator="/">
			<transition-group name="breadcrumb">
				<el-breadcrumb-item
					v-for="item in levelList"
					:key="item.path"
					class="!inline !items-stretch"
				>
					<a @click.prevent="handleLink(item)">
						{{ item.meta.title }}
					</a>
				</el-breadcrumb-item>
			</transition-group>
		</el-breadcrumb>
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
import { useRoute, useRouter } from "vue-router";
import { getParentPaths, queryCurrentRoute } from "../../../../router/utils";

export default {
	name: "SidebarBreadCrumb",
	props: {},
	components: {},
	setup(props, context) {
		const route = useRoute();
		const levelList = ref([]);
		const router = useRouter();
		const routes: any = router.options.routes;

		const handleLink = (val: RouteItem) => {
            const index = levelList.value.findIndex(ele => ele.meta.title === val.meta.title);
            levelList.value = levelList.value.slice(0, index + 1);
            const subItem = val.children.find(item => item.path === val.redirect);
            levelList.value.push(subItem);
            router.push(subItem.path);            
		};

		const getBreadcrumb = (): void => {
			// 当前路由的父级路径组成的数组
			const parentRoutes = getParentPaths(
				router.currentRoute.value.name as string,
				routes,
				"name"
			);
            const target = routes.find((ele: any) => ele.path === parentRoutes[0]).children;
			levelList.value = queryCurrentRoute(
				target,
				router.currentRoute.value.fullPath,
			);                     
		};

		watch(
			() => route.path,
			(newVal, oldVal) => {
				getBreadcrumb();
			},
			{ deep: true, immediate: true }
		);
		return {
			levelList,
			handleLink,
		};
	},
};
</script>

<style lang="scss" scoped>
</style>