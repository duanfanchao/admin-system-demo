<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<el-table-column
		v-if="!column.children && column.type !== 'selection' && column.type !== 'expand'"
		:prop="column.prop"
		:label="column.label"
		:width="column.width"
		:show-overflow-tooltip="column.showOverflowTooltip"
		:fixed="column.fixed"
		:min-width="column.minWidth"
		:align="column.align"
		:type="column.type"
		:resizable="column.resizable"
		:sortable="column.sortable"
		:selectable="column.selectable"
		:column-key="column.columnKey"
		:filters="column.filters"
		:filter-method="column.filterMethod"
		:sort-method="column.sortMethod"
        :sort-by="column.sortBy"
        :sort-orders="column.sortOrders"
        :header-align="column.headerAlign"
        :class-name="column.className"
        :label-class-name="column.labelClassName"
        :reserve-selection="column.reserveSelection"
        :filter-placement="column.filterPlacement"
        :filter-class-name="column.filterClassName"
        :filter-multiple="column.filterMultiple"
        :filter-value="column.filterValue"
	>
		<template #default="{ row, $index }">
			<template v-if="column.formatter">
				<template v-if="isStringFormatter(row, $index)">
					{{
						column.formatter(row, column, row[column.prop], $index)
					}}
				</template>
				<template v-else>
					<component
						:is="
							column.formatter(
								row,
								column,
								row[column.prop],
								$index
							)
						"
					/>
				</template>
			</template>
			<template v-if="column.index && !column.formatter">
				{{ column.index($index) }}
			</template>
			<component
				:is="column.slots.default"
				:row="row"
				:index="$index"
				v-if="column.slots && column.slots.default"
			/>
		</template>
		<template #header="scope" v-if="column.slots && column.slots.header">
			<component
				:is="column.slots.header"
				:row="scope.row"
				:index="scope.$index"
			/>
		</template>
	</el-table-column>
    <!-- 多级表头 -->
	<el-table-column
		v-if="column.children && column.type !== 'expand'"
		:prop="column.prop"
		:label="column.label"
		:align="column.align"
		:type="column.type"
		:resizable="column.resizable"
	>
		<template v-for="child in column.children" :key="child.prop">
			<table-column-item :column="child" />
		</template>
	</el-table-column>
    <!-- 多选 -->
	<el-table-column
		v-if="column.type == 'selection'"
		type="selection"
		:width="column.width"
		:selectable="column.selectable"
	/>
	<!-- 展开行 -->
	<el-table-column v-if="column.type == 'expand'" type="expand">
		<template #default="{ row, $index }">
			<component
				:is="column.slots.default"
                :row="row"
				:index="$index"
			/>
		</template>
	</el-table-column>
</template>

<script lang="ts">
import { PropType } from "vue";
import { ColumnItem } from "../../../../type";
import { ElTable, ElTableColumn } from "element-plus";

export default {
	name: "TableColumnItem",
	props: {
		column: {
			type: Object as PropType<ColumnItem>,
			default: {},
		},
	},
	components: {
		ElTableColumn,
	},
	setup(props, context) {
		const isStringFormatter = (row: any, index: number): boolean => {
			const formattedValue = props.column.formatter(
				row,
				props.column,
				row[props.column.prop],
				index
			);
			return typeof formattedValue === "string";
		};
		return {
			isStringFormatter,
		};
	},
};
</script>

<style lang="scss" scoped>
</style>