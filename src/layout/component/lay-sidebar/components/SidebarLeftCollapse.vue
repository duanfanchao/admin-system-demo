<!--
 @author: duanfc
 @time: 2024-07-09 12:00:00
 @description: 描述
 @path: /demo
 @lastChange: duanfc
-->

<template>
	<div class="left-collapse" @click="toggleClick">
		<Fold
			:class="iconClass"
			v-if="isActive"
			v-tippy="{
				placement: 'right',
				hideOnClick: 'toggle',
				content: '点击折叠',
                theme: 'light',
			}"
		/>
		<Expand
			:class="iconClass"
			v-else
			v-tippy="{
				placement: 'right',
				hideOnClick: 'toggle',
				content: '点击展开',
                theme: 'light',
			}"
		/>
	</div>
</template>

<script lang='ts'>
import {
	ref,
	reactive,
	defineComponent,
	onMounted,
	computed,
	toRefs,
} from "vue";

export default defineComponent({
	name: "leftCollapse",
	components: {},
	props: {
		isActive: {
			type: Boolean,
		},
	},
	emits: ["toggleClick"], // 声明事件
	setup(_, { emit }) {
		onMounted(() => {});
		const toggleClick = () => {
			emit("toggleClick");
		};
		const iconClass = computed(() => {
			return [
				"ml-4",
				"mb-1",
				"w-[16px]",
				"h-[16px]",
				"inline-block",
				"align-middle",
				"cursor-pointer",
				"duration-[100ms]",
			];
		});
		return {
			toggleClick,
			iconClass,
		};
	},
});
</script>

<style lang="less" scoped>
.left-collapse {
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 40px;
	line-height: 40px;
	box-shadow: 0 0 6px -3px var(--el-color-primary);
}
</style>