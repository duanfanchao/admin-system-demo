<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<div class="pure-admin-utils">
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column type="expand">
				<template #default="props">
					<div m="4">
						<!-- <p m="t-0 b-2">State: {{ props.row.state }}</p>
						<p m="t-0 b-2">City: {{ props.row.city }}</p>
						<p m="t-0 b-2">Address: {{ props.row.address }}</p>
						<p m="t-0 b-2">Zip: {{ props.row.zip }}</p>
						<h3>Family</h3> -->
						<el-table :data="props.row.family" border>
							<el-table-column label="Name" prop="name" />
							<el-table-column label="State" prop="state" />
							<el-table-column label="City" prop="city" />
							<el-table-column label="Address" prop="address" />
							<el-table-column label="Zip" prop="zip" />
						</el-table>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="Date" prop="date" />
			<el-table-column label="Name" prop="name" />
		</el-table>
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
	name: "pureAdminUtils",
	props: {},
	components: {},
	setup(props, context) {
		const tableData = [
			{
				date: "2016-05-03",
				name: "Tom",
				state: "California",
				city: "San Francisco",
				address: "3650 21st St, San Francisco",
				zip: "CA 94114",
				family: [
					{
						name: "Jerry",
						state: "California",
						city: "San Francisco",
						address: "3650 21st St, San Francisco",
						zip: "CA 94114",
					},
					{
						name: "Spike",
						state: "California",
						city: "San Francisco",
						address: "3650 21st St, San Francisco",
						zip: "CA 94114",
					},
					{
						name: "Tyke",
						state: "California",
						city: "San Francisco",
						address: "3650 21st St, San Francisco",
						zip: "CA 94114",
					},
				],
			},
			{
				date: "2016-05-02",
				name: "Tom",
				state: "California",
				city: "San Francisco",
				address: "3650 21st St, San Francisco",
				zip: "CA 94114",
				family: [],
			},
		];
		return {
            tableData
        };
	},
};
</script>

<style lang="scss" scoped>
</style>