<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<div class="center-collapse" @click="toggleClick">
		<DArrowLeft
			v-if="isActive"
			v-tippy="{
				content: '点击折叠',
				theme: 'light',
				hideOnClick: 'toggle',
				placement: 'right',
			}"
            :class="iconClass"
		/>
		<DArrowRight
			v-tippy="{
				content: '点击展开',
				theme: 'light',
				hideOnClick: 'toggle',
				placement: 'right',
			}"
			v-else
            :class="iconClass"
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

export default {
	name: "laySidebarCenterCollapse",
	props: {
		isActive: {
			type: Boolean,
		},
	},
	emits: ["toggleClick"], // 声明事件
	components: {},
	setup(props, { emit }) {
		const toggleClick = () => {
			emit("toggleClick");
		};
		const iconClass = computed(() => {
			return ["w-[16px]", "h-[16px]"];
		});
		return {
			toggleClick,
            iconClass,
		};
	},
};
</script>

<style lang="scss" scoped>
.center-collapse {
	position: absolute;
	top: 50%;
	right: 2px;
	z-index: 1002;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 34px;
	cursor: pointer;
	background: var(--el-bg-color);
	border: 1px solid var(--pure-border-color);
	border-radius: 4px;
	transform: translate(12px, -50%);
}
</style>