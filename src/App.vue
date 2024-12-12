<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<el-config-provider>
		<router-view />
	</el-config-provider>
</template>

<script setup lang="ts">
import {
	computed,
	ref,
	reactive,
	onMounted,
	onBeforeUnmount,
	watch,
	toRefs,
	provide,
	inject,
	nextTick,
} from "vue";
</script>

<style lang="scss">
.common-layout {
	height: 100%;
	width: 100%;
}
</style>