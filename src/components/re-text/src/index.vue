<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<el-text
		v-bind="{
			truncated: !lineClamp,
			lineClamp,
			...$attrs,
		}"
		ref="textRef"
		@mouseover.self="handleHover"
	>
		<slot />
	</el-text>
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
	useSlots,
	h,
	PropType,
} from "vue";
import { type TippyOptions, useTippy } from "vue-tippy";

export default {
	name: "reText",
	props: {
		// 行数
		lineClamp: {
			type: [String, Number],
		},
		tippyProps: {
			type: Object as PropType<TippyOptions>,
			default: () => ({}),
		},
	},
	components: {},
	setup(props, context) {
		const $slots = useSlots();
		const textRef = ref();
		const tippyFunc = ref();
		const isTextEllipsis = (el: HTMLElement) => {
			if (!props.lineClamp) {
				// 单行省略判断
				return el.scrollWidth > el.clientWidth;
			} else {
				// 多行省略判断
				return el.scrollHeight > el.clientHeight;
			}
		};
		const getTippyProps = () => ({
			content: h($slots.content || $slots.default),
			...props.tippyProps,
		});
		function handleHover(event: MouseEvent) {
			if (isTextEllipsis(event.target as HTMLElement)) {
				tippyFunc.value.setProps(getTippyProps());
				tippyFunc.value.enable();
			} else {
				tippyFunc.value.disable();
			}
		}
		onMounted(() => {
			tippyFunc.value = useTippy(textRef.value?.$el, getTippyProps());
		});

		return {
			handleHover,
			getTippyProps,
			textRef,
			tippyFunc,
			isTextEllipsis,
		};
	},
};
</script>

<style lang="scss" scoped>
</style>