<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<div class="lay-navbar bg-[#fff] shadow-sm shadow-[rgba(0,21,41,0.08)]">
		<LaySidebarBreadCrumb class="breadcrumb-container" />
		<div class="vertical-header-right">
            <!-- 菜单搜索 -->
            <LaySearch id="header-search" />
			<!-- 全屏 -->
			<LaySidebarFullScreen id="full-screen" />
		</div>
	</div>
</template>

<script>
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
import LaySidebarBreadCrumb from "../lay-sidebar/components/SidebarBreadCrumb.vue";
import LaySidebarFullScreen from "../lay-sidebar/components/SidebarFullScreen.vue";
import LaySearch from '../lay-search/index.vue';

export default {
	name: "layNavbar",
	props: {},
	components: {
		LaySidebarBreadCrumb,
		LaySidebarFullScreen,
        LaySearch,
	},
	setup(props, context) {
		return {};
	},
};
</script>

<style lang="scss" scoped>
.lay-navbar {
	width: 100%;
	height: 48px;
	overflow: hidden;
	box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
	.breadcrumb-container {
		float: left;
		margin-left: 16px;
	}
	.hamburger-container {
		float: left;
		height: 100%;
		line-height: 48px;
		cursor: pointer;
	}
	.vertical-header-right {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		min-width: 280px;
		height: 48px;
		color: #000000d9;
	}
}
</style>