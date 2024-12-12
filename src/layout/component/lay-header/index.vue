<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<div :class="{ 'fixed-header': set.fixedHeader }">
		<LayNavbar v-show="!pureSetting.hiddenSideBar" />
		<LayTag />
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
import LayNavbar from "../lay-navbar/index.vue";
import LayTag from "../lay-tag/index.vue";
import { useSettingStoreHook } from "../../../store/modules/settings";
import { setType } from "../../types";

export default {
	name: "layHeader",
	props: {
		set: {
			type: Object as () => setType, // 确定类型,
			default: () => ({} as setType), // 确保默认值的类型,
		},
	},
	components: {
		LayNavbar,
		LayTag,
	},
	setup(props, context) {
		const pureSetting = useSettingStoreHook();
		return {
            pureSetting,
        };
	},
};
</script>

<style lang="scss" scoped>
</style>