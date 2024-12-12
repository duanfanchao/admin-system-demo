<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<div>
		<div
			class="search-container w-[40px] h-[48px] flex-c cursor-pointer navbar-bg-hover"
			@click="handleSearch"
		>
			<el-icon :size="16"><Search /></el-icon>
		</div>
        <SearchModal v-model:value="show" />
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
import { useBoolean } from '../../hooks/useBoolean';
import SearchModal from './components/SearchModal.vue';

export default {
	name: "search",
	props: {},
	components: {
        SearchModal,
    },
	setup(props, context) {
        const { bool: show, toggle } = useBoolean();
		const handleSearch = () => {
			toggle();
		};
		return {
			handleSearch,
            show,
		};
	},
};
</script>

<style lang="scss" scoped>
</style>