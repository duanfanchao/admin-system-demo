<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<el-form v-bind="$attrs" ref="elFormRef" class="el-form-style">
		<el-row :gutter="16">
			<slot name="formItem"></slot>
		</el-row>
	</el-form>
</template>

<script lang="ts">
import { ref } from "vue";
import type { ElForm } from "element-plus";

export default {
	name: "CForm",
	props: {},
	components: {},
	setup(props, context) {
		const elFormRef = ref<InstanceType<typeof ElForm> | null>(null);
		return {
			elFormRef,
		};
	},
};
</script>

<style lang="scss" scoped>
.el-form-style {
	width: calc(100% - 32px);
	margin-left: 16px;
	border-bottom: 1px solid #f0f0f0;
	.search-item:last-child {
		padding-right: 0 !important;
	}
	.search-item:first-child {
		padding-left: 0 !important;
	}
}
// 屏幕宽度小于992px
@media only screen and (max-width: 992px) {
	.search-item {
		padding: 0 !important;
	}
}
// 屏幕宽度大于等于992px但小于1200px
@media screen and (min-width: 992px) and (max-width: 1200px) {
	.search-item:nth-child(3n) {
		padding-right: 0 !important;
	}
	.search-item:nth-child(3n + 1) {
		padding-left: 0 !important;
	}
}
// 屏幕宽度大于等于1200px
@media screen and (min-width: 1200px) {
	.search-item:nth-child(4n) {
		padding-right: 0 !important;
	}
	.search-item:nth-child(4n + 1) {
		padding-left: 0 !important;
	}
}
</style>