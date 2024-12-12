<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<div class="vue2">vue2</div>
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
	name: "vue2",
	props: {},
	components: {},
	setup(props, context) {
		return {};
	},
};
</script>

<style lang="scss" scoped>
.vue2 {
	height: 100%;
	width: 100%;
}
</style>