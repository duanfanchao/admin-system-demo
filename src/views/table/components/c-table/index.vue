<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<el-table v-bind="$attrs" :data="tableData" ref="elTableRef">
		<TableColumnItem
			v-for="column in columns"
			:key="column.prop"
			:column="column"
		></TableColumnItem>
		<!-- 自定义空数据时的内容 -->
		<template v-slot:empty>
			<slot name="empty"></slot>
		</template>
	</el-table>
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
	PropType,
} from "vue";
import { TableData, ColumnItem } from "../../type";
import TableColumnItem from "./components/table-column-item/index.vue";
import { ElButton, ElIcon, ElTable } from "element-plus";

export default {
	name: "CTable",
	props: {
		tableData: {
			type: Array as PropType<TableData[]>,
			default: [],
		},
		columns: {
			type: Array as PropType<ColumnItem[]>,
			default: [],
		},
	},
	components: {
		TableColumnItem,
	},
	setup(props, ctx) {
		const elTableRef = ref<InstanceType<typeof ElTable>>();
		return {
			elTableRef,
		};
	},
};
</script>