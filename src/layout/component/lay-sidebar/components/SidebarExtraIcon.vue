<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<div v-if="extraIcon" class="flex justify-center items-center">
		<component
			:is="toRaw(extraIcon)"
			class="w-[30px] h-[30px]"
		/>
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
    toRaw,
} from "vue";

export default {
	name: "sidebarExtraIcon",
	props: {
		extraIcon: {
			type: String,
			default: "",
		},
	},
	components: {},
	setup(props, context) {

		return {};
	},
};
</script>