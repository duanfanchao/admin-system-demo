<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<div class="table-list">
		<!-- lazy
			:load="load"
			:tree-props="{ children: 'children', hasChildren: 'hasChildren' }" -->
		<c-Table
			:span-method="arraySpanMethod"
			show-summary
			:summary-method="getSummaries"
			:default-expand-all="false"
			:row-class-name="tableRowClassName"
			ref="tableRef"
			:data="tableData"
			:columns="columns"
			border
			stripe
			style="width: 100%"
			height="500"
			row-key="name"
			highlight-current-row
			@current-change="handleCurrentChange"
			table-layout="auto"
		>
			<template v-slot:empty>
				<div style="text-align: center; padding: 20px; color: #999">
					<p>没有数据可显示</p>
					<el-button type="primary">添加数据</el-button>
				</div>
			</template>
		</c-Table>
		<div style="margin-top: 20px">
			<el-button @click="setCurrent(tableData[1])">选择第二行</el-button>
			<el-button @click="setCurrent()">清除选中行</el-button>
			<el-button
				@click="toggleSelection([tableData[1], tableData[2]], false)"
			>
				勾选目标行
			</el-button>
			<el-button @click="toggleSelection()">清除勾选数据</el-button>
		</div>
	</div>
</template>

<script lang="ts">
import { ref, defineComponent, reactive, toRefs, h, VNode } from "vue";
import CTable from "./components/c-table/index.vue";
import {
	TableData,
	SlotsItem,
	ColumnItem,
	SummaryMethodProps,
	SpanMethodProps,
} from "./type";
import { ElButton, ElIcon, ElInput } from "element-plus";
import type { TableColumnCtx } from "element-plus";
import { Check, Close } from "@element-plus/icons-vue";

export default defineComponent({
	name: "tableList",
	props: {},
	components: {
		CTable,
	},
	setup() {
		const search = ref("");
		const searchValueChange = (val: any) => {
			console.log("searchValueChange", val);
		};
		const handleInputChange = (val: any) => {
			console.log("handleInputChange", val);
		};
		const filterHandler = (
			value: string,
			row: TableData,
			column: TableColumnCtx<TableData>
		) => {
			const property = column.property as keyof TableData;
			return row[property] === value;
		};
		const subTableRef = ref();
		const tableInfo = reactive({
			tableData: [
				{
					date: "2016-05-03",
					name: "Alice",
					address: "No. 189, Grove St, Los Angeles1",
					state: "California",
					city: "Los Angeles",
					zip: "CA 90036",
					result: 0,
					amount: 12,
					// hasChildren: true,
					// propsData: [
					// 	{
					// 		name: "Jerry",
					// 		state: "California",
					// 		city: "San Francisco",
					// 		address: "3650 21st St, San Francisco",
					// 		zip: "CA 94114",
					// 	},
					// ],
				},
				{
					date: "2016-05-02",
					name: "Tom",
					address: "No. 189, Grove St, Los Angeles2",
					state: "California",
					city: "Los Angeles",
					zip: "CA 90036",
					result: 1,
					amount: 19,
				},
				{
					date: "2016-05-01",
					name: "Bob",
					address: "No. 189, Grove St, Los Angeles12",
					state: "California",
					city: "Los Angeles",
					zip: "CA 90038",
					result: 0,
					amount: 120,
				},
			] as TableData[],
			subColumn: [
				{
					prop: "name",
					label: "name",
					width: 120,
				},
				{
					prop: "state",
					label: "state",
					width: 120,
				},
				{
					prop: "city",
					label: "city",
					width: 120,
				},
				{
					prop: "address",
					label: "address",
					width: 120,
				},
				{
					prop: "zip",
					label: "zip",
				},
			] as ColumnItem[],

			columns: [
				{
					label: "索引",
					width: 60,
					fixed: true,
					type: "index",
					formatter: (
						row: any,
						column: any,
						cellValue: any,
						index: number
					): string => {
						return String(index * 2);
					},
				},
				{
					type: "selection",
					width: 100,
					selectable: (val: TableData) => {
						return true;
					},
					reserveSelection: true,
				},
				{
					type: "expand",
					slots: {
						default: ({ index, row }: SlotsItem): VNode => {
							return h(CTable, {
								ref: subTableRef,
								data: row.propsData,
								columns: tableInfo.subColumn,
								border: true,
								stripe: true,
								style: { width: "100%" },
								height: "auto",
								"row-key": "name",
								"highlight-current-row": true,
								"table-layout": "auto",
							});
						},
					},
				},
				{
					prop: "date",
					label: "时间",
					width: 140,
					sortable: true,
					columnKey: "date",
					filterMethod: filterHandler,
					filterValue: ["2016-05-01", "2016-05-02"],
					filters: [
						{ text: "2016-05-01", value: "2016-05-01" },
						{ text: "2016-05-02", value: "2016-05-02" },
						{ text: "2016-05-03", value: "2016-05-03" },
						{ text: "2016-05-04", value: "2016-05-04" },
					],
				},
				{
					prop: "name",
					label: "姓名",
					width: 240,
					formatter: (
						row: any,
						column: any,
						cellValue: any,
						index: number
					): VNode | string => {
						if (!cellValue) return h("span", "");
						return h(
							"span",
							{ style: { color: "red" } },
							cellValue
						);
					},
					sortable: true,
					sortMethod: (a, b) => {
						return a.name.localeCompare(b.name);
					},
					sortOrders: ["ascending", "descending"],
					align: "center",
					className: "custom-column",
					labelClassName: "custom-labelClassName",
				},
				{
					prop: "address",
					label: "地址",
					width: 120,
					// renderHeader: (data) => {
					//     console.log('-----', data);
					//     return '1'
					// } -> 建议通过插槽的方式实现
				},
				{
					label: "第一级表头",
					align: "center",
					resizable: true,
					children: [
						{
							label: "第二级表头",
							align: "center",
							resizable: true,
							children: [
								{
									prop: "state",
									label: "州",
									width: 320,
									resizable: true,
								},
								{
									prop: "city",
									label: "城市",
									width: 400,
									resizable: true,
								},
							],
						},
						{
							prop: "zip",
							label: "Zip",
							resizable: true,
							width: 280,
						},
					],
				},
				{
					prop: "amount",
					label: "数量",
					width: 120,
				},
				{
					prop: "result",
					label: "校验结果",
					align: "center",
					width: 120,
					slots: {
						default: ({ row }: SlotsItem): VNode => {
							return h(
								ElIcon,
								{
									id: "result-i",
									size: 14,
									color: row.result == 1 ? "red" : "green",
								},
								{
									default: () =>
										row.result == 0 ? h(Check) : h(Close),
								}
							);
						},
					},
				},
				{
					label: "操作",
					fixed: "right",
					minWidth: 180,
					slots: {
						default: (val: SlotsItem): VNode => {
							return h(
								ElButton,
								{
									type: "primary",
									onClick: (event) => {
										event.stopPropagation(); // 阻止事件冒泡
										checkF(val.row);
									},
								},
								() => "查看"
							);
						},
						header: (val: SlotsItem): VNode => {
							return h(ElInput, {
								size: "small",
								placeholder: "请输入",
								modelValue: search.value,
								"onUpdate:modelValue": (value) => {
									search.value = value; // 更新 search
								},
								onChange: (value) => {
									searchValueChange(value); // 处理 change 事件,失去焦点才会触发
								},
								onInput: (value) => {
									handleInputChange(value); // 处理 input 事件
								},
								disabled: false,
							});
						},
					},
				},
			] as ColumnItem[],
		});
		const tableRef = ref();
		const currentRow = ref();

		const load = (
			row: TableData,
			treeNode: unknown,
			resolve: (data: TableData[]) => void
		) => {
			setTimeout(() => {
				resolve([
					{
						date: "2016-05-01",
						name: "wangxiaohu",
						address: "No. 189, Grove St, Los Angeles",
					},
					{
						date: "2016-05-01",
						name: "wangxiaohu",
						address: "No. 189, Grove St, Los Angeles",
					},
				]);
			}, 1000);
		};

		const getSummaries = (param: SummaryMethodProps) => {
			const { columns, data } = param;
			const sums: (string | VNode)[] = [];
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = h(
						"div",
						{ style: { textDecoration: "underline" } },
						["Total Cost"]
					);
					return;
				}
				const values = data.map((item: any) =>
					Number(item[column.property])
				);
				if (!values.every((value) => Number.isNaN(value))) {
					sums[index] = `$ ${values.reduce((prev, curr) => {
						const value = Number(curr);
						if (!Number.isNaN(value)) {
							return prev + curr;
						} else {
							return prev;
						}
					}, 0)}`;
				} else {
					sums[index] = "N/A";
				}
			});

			return sums;
		};
		const tableRowClassName = ({
			rowIndex,
		}: {
			rowIndex: number;
		}): string => {
			if (rowIndex === 1) {
				return "warning-row";
			} else if (rowIndex === 3) {
				return "success-row";
			}
			return "";
		};
		const checkF = (val: TableData) => {
			console.log("checkF", val, tableRef.value);
		};
		const handleCurrentChange = (val: TableData | undefined) => {
			currentRow.value = val;
		};
		const setCurrent = (row?: TableData) => {
			tableRef.value.elTableRef!.setCurrentRow(row);
		};
		const toggleSelection = (
			rows?: TableData[],
			ignoreSelectable?: boolean
		) => {
			if (rows) {
				rows.forEach((row) => {
					tableRef.value.elTableRef!.toggleRowSelection(
						row,
						undefined,
						ignoreSelectable
					);
				});
			} else {
				tableRef.value.elTableRef!.clearSelection();
			}
		};
		const arraySpanMethod = ({
			row,
			column,
			rowIndex,
			columnIndex,
		}: SpanMethodProps) => {
			if (rowIndex % 2 === 0) {
				if (columnIndex === 0) {
					return [1, 2];
				} else if (columnIndex === 1) {
					return [0, 0];
				}
			}
		};
		return {
			...toRefs(tableInfo),
			tableRowClassName,
			checkF,
			tableRef,
			handleCurrentChange,
			currentRow,
			setCurrent,
			toggleSelection,
			getSummaries,
			arraySpanMethod,
			load,
		};
	},
});
</script>

<style lang="scss" scoped>
.table-list {
	height: 100%;
	width: 100%;
	padding: 12px;
	::v-deep .el-table {
		.warning-row .el-table__cell {
			background-color: #fdf6ec;
		}
		.success-row .el-table__cell {
			background-color: #f0f9eb;
		}
		.el-button:focus {
			outline: none;
			border: none;
		}
	}
}
</style>