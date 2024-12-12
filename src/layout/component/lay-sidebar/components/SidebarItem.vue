<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<SidebarItemLink v-if="hasOneShowingChild(item.children, item)" :to="item">
		<el-menu-item
			:index="item.path"
			:class="{ 'submenu-title-noDropdown': !isNest }"
			:style="getNoDropdownStyle"
			v-bind="attrs"
		>
			<div
				v-if="item.meta.icon"
				class="sub-menu-icon"
				:style="getSubMenuIconStyle"
			>
				<component :is="item.meta.icon" />
			</div>
			<ReText
				v-if="!item?.meta.icon && isCollapse"
				truncated
				class="!w-full !pl-4 !text-inherit"
			>
				{{ onlyOneChild.meta.title }}
			</ReText>
			<template #title>
				<div :style="getDivStyle">
					<ReText
						:tippyProps="{
							offset: [0, -10],
							theme: 'light',
						}"
						class="!w-full !text-inherit"
					>
						{{ onlyOneChild.meta.title }}
					</ReText>
					<SidebarExtraIcon
						:extraIcon="onlyOneChild.meta.extraIcon"
					/>
				</div>
			</template> </el-menu-item
	></SidebarItemLink>
	<el-sub-menu
        v-else
		ref="subMenu"
		teleported
		:index="item.path"
	>
		<template #title>
			<div
				v-if="item.meta.icon"
				:style="getSubMenuIconStyle"
				class="sub-menu-icon"
			>
				<component :is="item.meta && item.meta.icon" />
			</div>
			<ReText
				v-if="!(isCollapse && item.parentId === null)"
				:tippyProps="{
					offset: [0, -10],
					theme: 'light',
				}"
				:class="{
					'!w-full': true,
					'!text-inherit': true,
				}"
			>
				{{ item.meta.title }}
			</ReText>
			<SidebarExtraIcon
				v-if="!isCollapse"
				:extraIcon="item.meta.extraIcon"
			/>
		</template>

		<sidebar-item
			v-for="child in item.children"
			:key="child.path"
			:is-nest="true"
			:item="child"
			:base-path="child.path"
			class="nest-menu"
		/>
	</el-sub-menu>
</template>

<script lang="ts">
import {
	computed,
	ref,
	reactive,
	onMounted,
	onBeforeUnmount,
	type CSSProperties,
	watch,
	toRefs,
	nextTick,
	useAttrs,
} from "vue";
import { menuType } from "@/layout/types";
import { type PropType } from "vue";
import SidebarItemLink from "./SidebarItemLink.vue";
import path from "path-browserify";
import { useNav } from "@/layout/hooks/useNav";
import SidebarExtraIcon from "./SidebarExtraIcon.vue";
import { ReText } from "../../../../components/re-text/index";

export default {
	name: "sidebarItem",
	props: {
		item: {
			type: Object as PropType<menuType>,
		},
		isNest: {
			type: Boolean,
			default: false,
		},
		basePath: {
			type: String,
			default: "",
		},
	},
	components: {
		SidebarItemLink,
		SidebarExtraIcon,
		ReText,
	},
	setup(props, context) {
		const { isCollapse, getDivStyle } = useNav();
		const attrs = useAttrs();
		const onlyOneChild: menuType = ref(null);
		function hasOneShowingChild(
			children: menuType[] = [],
			parent: menuType
		) {
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
		}
		// function resolvePath(routePath: string) {
		// 	const httpReg = /^http(s?):\/\//;
		// 	if (httpReg.test(routePath) || httpReg.test(props.basePath)) {
		// 		return routePath || props.basePath;
		// 	} else {
		// 		// 使用path.posix.resolve替代path.resolve 避免windows环境下使用electron出现盘符问题
		// 		return path.posix.resolve(props.basePath, routePath);
		// 	}
		// }
		const getSubMenuIconStyle = computed((): CSSProperties => {
			return {
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				margin: isCollapse.value ? "0 auto" : "0 5px 0 0",
			};
		});
		const getNoDropdownStyle = computed((): CSSProperties => {
			return {
				width: "100%",
				display: "flex",
				alignItems: "center",
			};
		});
		return {
			// resolvePath,
			onlyOneChild,
			hasOneShowingChild,
			getNoDropdownStyle,
			attrs,
			getDivStyle,
			getSubMenuIconStyle,
			isCollapse,
		};
	},
};
</script>

<style lang="scss" scoped>
</style>