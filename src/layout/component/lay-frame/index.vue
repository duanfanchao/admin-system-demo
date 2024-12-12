<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<!-- <template v-for="[fullPath, Comp] in compList" :key="fullPath">
		<div v-show="fullPath === currRoute.fullPath" class="w-full h-full">
			<slot
				:fullPath="fullPath"
				:Comp="Comp"
				:frameInfo="{ frameSrc: currRoute.meta?.frameSrc, fullPath }"
			/>
		</div>
	</template> -->
	<div class="w-full h-full">
        <span>{{ normalComp }}</span>
        <span>{{ currRoute.fullPath }}</span>
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
	PropType,
	toRefs,
	type Component,
	shallowRef,
} from "vue";
import { type RouteRecordRaw, RouteLocationNormalizedLoaded } from "vue-router";
import { getConfig } from "@/config";
import { useMultiFrame } from "@/layout/hooks/useMultiFrame";
import { useMultiTagsStoreHook } from "../../../store/modules/multiTags";

export default {
	name: "layFrame",
	props: {
		currRoute: {
			type: Object as PropType<RouteLocationNormalizedLoaded>,
		},
		currComp: {
			type: Object as PropType<Component>,
		},
	},
	components: {},
	setup(props, context) {
		const compList = shallowRef([]);
		const { setMap, getMap, MAP, delMap } = useMultiFrame();
		const keep = computed(() => {
			return (
				getConfig().KeepAlive &&
				props.currRoute.meta?.keepAlive &&
				!!props.currRoute.meta?.frameSrc
			);
		});
		// 避免重新渲染 LayFrame
		const normalComp = computed(() => props.currComp);
        
		watch(useMultiTagsStoreHook().multiTags, (tags: any) => {
			if (!Array.isArray(tags) || !keep.value) {
				return;
			}
			const iframeTags = tags.filter((i) => i.meta?.frameSrc);
			// tags必须是小于MAP，才是做了关闭动作，因为MAP插入的顺序在tags变化后发生
			if (iframeTags.length < MAP.size) {
				for (const i of MAP.keys()) {
					if (!tags.some((s) => s.path === i)) {
						delMap(i);
						compList.value = getMap();
					}
				}
			}
		});
		watch(
			() => props.currRoute.fullPath,
			(path) => {
				const multiTags = useMultiTagsStoreHook()
					.multiTags as RouteRecordRaw[];
				const iframeTags = multiTags.filter((i) => i.meta?.frameSrc);
				if (keep.value) {
					if (iframeTags.length !== MAP.size) {
						const sameKey = [...MAP.keys()].find((i) => path === i);
						if (!sameKey) {
							// 添加缓存
							setMap(path, props.currComp);
						}
					}
				}

				if (MAP.size > 0) {
					compList.value = getMap();
				}
			},
			{
				immediate: true,
			}
		);
		return {
			keep,
			normalComp,
            compList,
		};
	},
};
</script>

<style lang="scss" scoped>
</style>