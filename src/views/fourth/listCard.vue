<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<div class="list-card-item">
		<div class="list-card-item_detail bg-bg_color">
			<p class="list-card-item_detail--name text-text_color_primary">
				{{ product.name }}
			</p>
			<p class="list-card-item_detail--desc text-text_color_regular">
				{{ product.description }}
			</p>
		</div>
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
	PropType,
} from "vue";
import { CardProductType } from "./type";

export default {
	name: "listCard",
	props: {
		product: {
			type: Object as PropType<CardProductType>,
		},
	},
	components: {},
	setup(props, context) {
		return {};
	},
};
</script>

<style lang="scss" scoped>
.list-card-item {
	display: flex;
	flex-direction: column;
	margin-bottom: 12px;
	overflow: hidden;
	cursor: pointer;
	border-radius: 3px;
	background-color: #fff;
	&_detail {
		flex: 1;
		min-height: 140px;
		padding: 24px 32px;
	}
	&--name {
		margin: 24px 0 8px;
		font-size: 16px;
		font-weight: 400;
	}

	&--desc {
		display: -webkit-box;
		height: 40px;
		margin-bottom: 24px;
		overflow: hidden;
		font-size: 12px;
		line-height: 20px;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
}
</style>