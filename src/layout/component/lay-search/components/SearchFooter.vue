<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<div class="search-footer text-[#333] dark:text-white">
		<span class="search-footer-item">
			<span class="key__span">
				<img src="../../../../assets/enter.png" alt="" />
			</span>
			确认
		</span>
		<span class="search-footer-item">
			<span class="key__span">
				<el-icon><Top /></el-icon>
			</span>
			<span class="key__span">
				<el-icon><Bottom /></el-icon>
			</span>
			切换
		</span>
		<span class="search-footer-item">
			<span class="key__span">esc</span>
			关闭
		</span>
		<p v-if="total > 0" class="search-footer-total">
			{{ `共 ${total}` }}
		</p>
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
	name: "searchFooter",
	props: {
        total: {
            type: Number,
        }
    },
	components: {},
	setup(props, context) {
		return {};
	},
};
</script>

<style lang="scss" scoped>
.search-footer {
	display: flex;

	.search-footer-item {
		display: flex;
		align-items: center;
		margin-right: 14px;
		.key__span {
			height: 24px;
			width: 24px;
			margin-right: 3px;
			display: inline-block;
			box-shadow: inset 0 -2px #cdcde6, inset 0 0 1px 1px #fff,
				0 1px 2px 1px #1e235a66;
			font-size: 14px;
			line-height: 24px;
			text-align: center;
			.el-icon {
				height: 24px;
				width: 24px;
				font-size: 24px;
			}
		}
	}

	.search-footer-total {
		position: absolute;
		right: 20px;
	}
}
</style>