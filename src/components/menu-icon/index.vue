<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<el-icon :size="size">
		<component :is="icon" />
	</el-icon>
    <span>{{ title }}</span>
</template>

<script>
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
	name: "menuIcon",
	props: {
        title: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: false,
        },
        size: {
            type: Number,
            default: 16,
        },
    },
	components: {},
	setup(props, context) {
		return {};
	},
};
</script>

<style lang="scss" scoped>
</style>