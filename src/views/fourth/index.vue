<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<div class="fourth">
		<el-row :gutter="16">
			<el-col
				v-for="table in tableData"
				:key="table.name"
				:xs="24 * table.span"
				:sm="12 * table.span"
				:md="6 * table.span"
				:lg="6 * table.span"
				:xl="6 * table.span"
			>
				<ListCard :product="table" />
			</el-col>
		</el-row>
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
import ListCard from "./listCard.vue";
import { useResize } from "@/layout/hooks/useResize";

export default {
	name: "fourth",
	props: {},
	components: {
		ListCard,
	},
	setup(props, context) {
		const tableData = reactive([
			{ name: "a1", description: "31231", span: 1 },
			{ name: "a2", description: "31231", span: 1 },
			{ name: "a3", description: "31231", span: 2 },
			{ name: "a4", description: "31231", span: 1 },
			{ name: "a5", description: "31231", span: 1 },
			{ name: "a6", description: "31231", span: 1 },
			{ name: "a7", description: "31231", span: 1 },
			// { name: "a8", type: 3, isSetup: true, description: "31231" },
			// { name: "a9", type: 4, isSetup: false, description: "31231" },
			// { name: "a10", type: 5, isSetup: true, description: "31231" },
			// { name: "a11", type: 1, isSetup: true, description: "31231" },
			// { name: "a12", type: 2, isSetup: true, description: "31231" },
			// { name: "a13", type: 3, isSetup: false, description: "31231" },
		]);
		useResize(document.body, (width, height) => {}, 300);
		onMounted(() => {});
		return {
			tableData,
		};
	},
};
</script>

<style lang="scss" scoped>
.fourth {
	height: 100%;
	width: 100%;
	background-color: #f0f2f5;
}
</style>