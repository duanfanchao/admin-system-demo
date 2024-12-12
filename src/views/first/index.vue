<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<el-card shadow="never">
		<template #header>
			<div class="card-header">
				<span class="font-medium">
					引导页常用于引导式介绍项目的基本功能或亮点
				</span>
			</div>
		</template>
		<el-button @click="onGuide"> 打开引导页 (intro.js) </el-button>
		<el-button @click="onTour"> 打开引导页 (el-tour) </el-button>

		<el-tour v-model="tourOpen">
			<el-tour-step
				v-for="step in stepsList"
				:key="step.title"
				:target="() => step.element"
				:title="step.title"
				:description="step.intro"
				:placement="step.position"
			/>
		</el-tour>
	</el-card>
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
import intro from "intro.js";
import "intro.js/minified/introjs.min.css";

export default {
	name: "first",
	props: {},
	components: {},
	setup(props, context) {
		interface GuideStep {
			element: string | HTMLElement;
			title: string;
			intro: string;
			position: "left" | "right" | "top" | "bottom";
		}
		const stepsList = ref<GuideStep[]>([]);
		const tourOpen = ref(false);
		const onGuide = () => {
			intro()
				.setOptions({
					steps: stepsList.value,
				})
				.start();
		};
		const onTour = () => {
			tourOpen.value = true;
		};
		onMounted(() => {
			nextTick(() => {
				stepsList.value = [
					{
						element: document.querySelector("#header-search") as
							| string
							| HTMLElement,
						title: "搜索菜单",
						intro: "您可以在这里搜索想要查看的菜单",
						position: "left",
					},
					{
						element: document.querySelector("#full-screen") as
							| string
							| HTMLElement,
						title: "全屏",
						intro: "您可以在这里进行全屏切换",
						position: "left",
					},
				];
			});
		});

		return {
			stepsList,
			tourOpen,
			onGuide,
			onTour,
		};
	},
};
</script>

<style lang="scss" scoped>
.first {
	height: 100%;
	width: 100%;
}
</style>