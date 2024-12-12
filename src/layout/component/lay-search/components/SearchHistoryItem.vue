<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<component :is="item.meta?.icon" :class="iconSizeClass" />
	<span class="history-item-title">
		{{ item.meta?.title }}
	</span>
	<el-icon
		size="16"
		class="w-[18px] h-[18px] mr-2 hover:text-[#d7d5d4]"
		v-show="item.type === 'history'"
		@click.stop="handleCollect(item)"
		><Star
	/></el-icon>
	<el-icon
		size="16"
		class="w-[18px] h-[18px] hover:text-[#d7d5d4] cursor-pointer"
		@click.stop="handleDelete(item)"
		><Close
	/></el-icon>
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
import { optionsItem } from "../../../types";

export default {
	name: "demo",
	props: {
		item: {
			type: Object as PropType<optionsItem>,
		},
        iconStatus: {
            type: Boolean,
        },
	},
    emits: ["collectItem", "deleteItem"],
	components: {},
	setup(props, { emit }) {
        const iconSizeClass = computed(() => {
            return props.iconStatus ? 'w-[18px] h-[18px]' : 'w-[14px] h-[14px]';
        });
		function handleCollect(item: optionsItem) {
			emit("collectItem", item);
		}

		function handleDelete(item: optionsItem) {
			emit("deleteItem", item);
		}
		return {
            handleCollect,
            handleDelete,
            iconSizeClass,
        };
	},
};
</script>

<style lang="scss" scoped>
.history-item-title {
	display: flex;
	flex: 1;
	margin-left: 5px;
}
</style>