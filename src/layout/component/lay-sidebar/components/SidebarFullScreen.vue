<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<span class="fullscreen-icon navbar-bg-hover" @click="toggle">
        <img class="full-screen" src="@/assets/icon-full-screen.png" alt="" v-if="!screenIcon">
        <img class="exit-full-screen" src="@/assets/exit-full-screen.png" alt="" v-else>
	</span>
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
import { useNav } from "@/layout/hooks/useNav";

export default {
	name: "sidebarFullScreen",
	props: {},
	components: {},
	setup(props, context) {
		const { toggle, isFullscreen } = useNav();

		const screenIcon = ref(false);

		watch(
			isFullscreen,
			(full) => {
				screenIcon.value = full;
			},
			{
				immediate: true,
			}
		);

		return {
			toggle,
            screenIcon,
		};
	},
};
</script>

<style lang="scss" scoped>
.exit-full-screen {
    height: 24px;
    width: 24px;
}
.full-screen {
    height: 16px;
    width: 16px;
}
</style>