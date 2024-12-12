<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<div ref="resultRef" class="search-result">
		<div
			v-for="(item, index) in options"
			:key="item.path"
			:ref="'resultItemRef' + index"
			class="search-result-item dark:bg-[#1d1d1d]"
			:style="itemStyle(item)"
			@click="handleTo"
			@mouseenter="handleMouse(item)"
		>
			<component :is="item.meta.icon" />
			<span class="search-result-item-title">
				{{ item.meta.title }}
			</span>
			<span class="key__span">
				<img
					src="../../../../assets/default-enter.png"
					alt=""
					v-if="item.path === active"
				/>
				<img src="../../../../assets/enter.png" alt="" v-else />
			</span>
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
	getCurrentInstance,
	PropType,
} from "vue";
import { useResize } from "../../../hooks/useResize";

export default {
	name: "searchResult",
	props: {
		value: {
			type: String,
		},
		options: {
			type: Array as PropType<RouteItem[]>,
		},
	},
	emits: ["update:value"], // 声明事件
	components: {},
	setup(props, { emit }) {
		const resultRef = ref();
		const innerHeight = ref();
		const instance = getCurrentInstance()!;

		const active = computed({
			get() {
				return props.value;
			},
			set(val: string) {
				emit("update:value", val);
			},
		});
		const itemStyle = computed(() => {
			return (item: RouteItem) => {
				return {
					background:
						item?.path === active.value ? "rgb(64, 158, 255)" : "",
					color: item.path === active.value ? "#fff" : "",
					fontSize: item.path === active.value ? "16px" : "14px",
				};
			};
		});

		const resizeResult = () => {
			innerHeight.value =
				window.innerHeight - window.innerHeight / 10 - 140;
		};
		const handleMouse = (item: RouteItem) => {
			active.value = item.path;
		};
		const handleTo = () => {};
		const handleScroll = (index: number) => {
			const curInstance = instance?.proxy?.$refs[`resultItemRef${index}`];
			if (!curInstance) return 0;
			const curRef = (curInstance as HTMLElement[])[0];
			const scrollTop = curRef.offsetTop + 128; // 128 两个result-item（56px+56px=112px）高度加上下margin（8px+8px=16px）
			return scrollTop > innerHeight.value
				? scrollTop - innerHeight.value
				: 0;
		};
		useResize(
			resultRef,
			(width, height) => {
				resizeResult();
			},
			300
		);
		onMounted(() => {
			resizeResult();
		});
		return {
			resultRef,
			handleMouse,
			handleTo,
			itemStyle,
			handleScroll,
			active,
		};
	},
};
</script>

<style lang="scss" scoped>
.search-result {
	padding-bottom: 12px;
	&-item {
		display: flex;
		align-items: center;
		height: 56px;
		padding: 14px;
		margin-top: 8px;
		cursor: pointer;
		border: 0.1px solid #ccc;
		border-radius: 4px;
		transition: font-size 0.16s;
		svg {
			height: 16px;
			width: 16px;
		}

		&-title {
			display: flex;
			flex: 1;
			margin-left: 5px;
            line-height: 1;
		}
		.key__span {
			height: 24px;
			width: 24px;
			display: inline-block;
		}
	}
}
</style>