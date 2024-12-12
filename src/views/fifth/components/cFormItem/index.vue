<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<el-col
		:md="baseSpan * span"
		:lg="baseSpan * span"
		:xl="baseSpan * span"
		:class="[isBtn ? 'btn-style' : '', 'search-item']"
		:offset="offset"
		v-show="formItemStatus"
	>
		<el-form-item v-bind="$attrs"><slot></slot></el-form-item>
	</el-col>
</template>

<script lang="ts">
import { computed, ref } from "vue";
import { useResize } from "@/layout/hooks/useResize";

export default {
	name: "cFormItem",
	components: {},
	props: {
		span: {
			type: Number,
			default: 1,
		},
		isBtn: {
			type: Boolean,
			default: false,
		},
		isExpand: {
			type: Boolean,
			required: true,
		},
		colTotal: {
			type: Number,
			default: 1,
		},
		itemIndex: {
			type: Number,
			required: true,
		},
	},
	setup(props, context) {
		const baseSpan = ref(0);

		// 计算按钮的offset值
		const calculateOffset = (
			val: number,
			colTotalValue: number,
			status: boolean
		): number => {
			if (val) {
				// 每一个筛选项的份数

				// 每行可放表单项的数量
				const itemSpan = 24 / val;
				// 最后一行筛选项的个数
				const remainder = colTotalValue % itemSpan;

				if (status) {
					// 展开状态

					if (screenWidth.value >= 992) {
						if (colTotalValue == 1) return 0;
						return (itemSpan - remainder - 1) * val;
					} else if (screenWidth.value < 992) {
						return 0;
					}
					// if (screenWidth.value >= 1200) {
					//     if (colTotalValue == 1) return 0;
					//     return (itemSpan - remainder - 1) * val;
					// } else if (screenWidth.value >= 992) {
					//     if (colTotalValue == 1) return 0;
					//     return (itemSpan - remainder - 1) * val;
					// } else if (screenWidth.value < 992) {
					//     return 0;
					// }
				} else {
					// 收起状态

					const itemSpan = 24 / val;
					const overNum = colTotalValue - itemSpan;
					if (screenWidth.value >= 1200) {
						if (colTotalValue < 4) {
							return (itemSpan - colTotalValue - 1) * val;
						}
						return overNum >= 3
							? 0
							: (itemSpan - overNum - 1) * val;
					} else if (screenWidth.value >= 992) {
						return overNum >= 2 || colTotalValue < itemSpan
							? 0
							: (itemSpan - overNum - 1) * val;
					} else if (screenWidth.value < 992) {
						return 0;
					}
				}
			}
		};

		const screenWidth = ref(0);

		// 表单项的显示与隐藏
		const formItemStatus = computed(() => {
			let bool = true;
			if (!props.isExpand) {
				if (screenWidth.value >= 1200) {
					bool = !(props.itemIndex >= 8);
				} else if (screenWidth.value >= 992) {
					bool = !(props.itemIndex >= 6);
				} else if (screenWidth.value < 992) {
					if (props.itemIndex <= 5) {
						bool = true;
					} else {
						bool = props.isExpand;
					}
				}
			}
			if (props.isBtn) bool = true;
			return bool;
		});

		useResize(
			document.body,
			(width, height) => {
				if (width >= 1200) {
					baseSpan.value = 6;
				} else if (width >= 992) {
					baseSpan.value = 8;
				} else if (width < 992) {
					baseSpan.value = 24;
				}
				screenWidth.value = width;
			},
			300
		);

		const offset = computed(() => {
			if (props.isBtn) {
				return calculateOffset(
					baseSpan.value,
					props.colTotal,
					props.isExpand
				);
			} else {
				return 0;
			}
		});
		return {
			offset,
			baseSpan,
			formItemStatus,
		};
	},
};
</script>

<style lang="scss" scoped>
.btn-style {
	::v-deep .el-form-item__content {
		justify-content: flex-end;
		margin-left: 0 !important;
	}
}
</style>