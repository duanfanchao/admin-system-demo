<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<div class="second">
		<div id="step1">功能 1</div>
		<div id="step2">功能 2</div>
		<el-button id="startButton" @click="startGuide">开始引导</el-button>
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
import intro from "intro.js";
import "intro.js/minified/introjs.min.css";

export default {
	name: "second",
	props: {},
	components: {},
	setup(props, context) {
		const startGuide = () => {
			const introInstance = intro();
			introInstance.setOptions({
				steps: [
					{
						intro: "欢迎使用我们的应用！",
					},
					{
						element: "#step1" as string | HTMLElement,
						title: "功能1",
						intro: "这是第一个重要的功能。",
						position: "right",
					},
					{
						element: "#step2" as string | HTMLElement,
						title: "功能2",
						intro: "这里是第二个功能。",
						position: "bottom",
					},
				],
				skipLabel: "跳过",
				nextLabel: "下一步",
				prevLabel: "上一步",
				doneLabel: "完成",
				hidePrev: true,
				hideNext: false,
			});
			introInstance.start();
			introInstance.oncomplete(function () {
				alert("完成");
			});
			introInstance.oncomplete(() => {
				console.log("用户点击了完成按钮");
				// 处理完成逻辑
			});

			// 监听退出事件
			introInstance.onexit(() => {
				console.log("用户点击了关闭按钮");
				// 处理关闭逻辑
			});

			// 可选：监听步骤变化
			introInstance.onchange((stepIndex) => {
				console.log(`用户当前处于步骤 ${stepIndex}`);
			});
		};

		onMounted(() => {});
		return {
			startGuide,
		};
	},
};
</script>

<style lang="scss" scoped>
.second {
	height: 100%;
	width: 100%;
	padding: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	#step1,
	#step2 {
		border: 1px solid #ccc;
		margin-bottom: 20px;
		width: 400px;
		height: 40px;
		line-height: 40px;
		text-align: center;
	}
}
</style>