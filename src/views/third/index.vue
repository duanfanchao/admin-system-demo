<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<div class="third">
		<h2>主题切换</h2>
		<div class="container">
			<span
				:class="['text', currentItem === item.age ? 'active-text' : '']"
				v-for="item in data"
				:key="item.age"
				@click="selectItem(item)"
				>{{ item.name }}</span
			>
		</div>
		<el-button type="primary" @click="toggleTheme">切换主题</el-button>
	</div>
</template>

<script lang="ts">
import {
	computed,
	ref,
	reactive,
	onMounted,
	defineComponent,
	watch,
	toRefs,
	nextTick,
} from "vue";
import { itemType } from "./type";

export default defineComponent({
	name: "third",
	props: {},
	components: {},
	setup(props, context) {
		const data = reactive<itemType[]>([
			{ name: "孙悟空1", age: 1 },
			{ name: "孙悟空2", age: 2 },
			{ name: "孙悟空3", age: 3 },
			{ name: "孙悟空4", age: 4 },
			{ name: "孙悟空5", age: 5 },
			{ name: "孙悟空6", age: 6 },
			{ name: "孙悟空7", age: 7 },
			{ name: "孙悟空8", age: 8 },
			{ name: "孙悟空9", age: 9 },
			{ name: "孙悟空10", age: 10 },
			{ name: "孙悟空11", age: 11 },
		]);
		const currentItem = ref<number>(0);
		const selectItem = (val: itemType): void => {
			currentItem.value = val.age;
		};
		// 主题切换方法
		const isDarkTheme = ref<boolean>(false);
		const toggleTheme = () => {
			isDarkTheme.value = !isDarkTheme.value;
            if (isDarkTheme.value) {
				document.body.classList.add('dark-theme');
			} else {
				document.body.classList.remove('dark-theme');
			}
		};
		return {
			data,
			selectItem,
			toggleTheme,
			currentItem,
			isDarkTheme,
		};
	},
});
</script>

<style lang="scss" scoped>
.third {
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	.container {
		height: 400px;
		width: 600px;
		margin: 12px 0;
		display: flex;
		flex-direction: column;
		overflow: auto;
		border: 1px solid var(--border-color);
		background-color: var(--background-color);
		.text {
			color: var(--text-color);
			height: 40px;
			line-height: 40px;
			padding-left: 12px;
			cursor: pointer;
			&:hover {
				color: var(--text-color-hover);
			}
		}
		.active-text {
			background-color: var(--background-color-active);
			color: var(--text-color-active) !important;
		}
	}
}
</style>