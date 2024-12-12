<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 搜索历史
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<div ref="historyRef" class="history">
		<template v-if="historyList.length">
			<div :style="titleStyle">搜索历史</div>
			<div
				v-for="(item, index) in historyList"
				:key="item.path"
				:ref="'historyItemRef' + index"
				class="history-item dark:bg-[#1d1d1d]"
				:style="itemStyle(item)"
				@click="handleTo"
				@mouseenter="handleMouse(item)"
			>
				<SearchHistoryItem
					:item="item"
                    :icon-status="item.path === active"
					@delete-item="handleDelete"
					@collect-item="handleCollect"
				/>
			</div>
		</template>
		<template v-if="collectList.length">
			<div :style="titleStyle">
				{{ `收藏${collectList.length > 1 ? "(可拖拽排序)" : ""}` }}
			</div>
			<div class="collect-container">
				<div
					v-for="(item, index) in collectList"
					:key="item.path"
					:ref="'historyItemRef' + (index + historyList.length)"
					class="history-item dark:bg-[#1d1d1d]"
					:style="itemStyle(item)"
					@click="handleTo"
					@mouseenter="handleMouse(item)"
				>
					<SearchHistoryItem
						:item="item"
                        :icon-status="item.path === active"
						@delete-item="handleDelete"
					/>
				</div>
			</div>
		</template>
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
	nextTick,
} from "vue";
import { useResize } from "../../../hooks/useResize";
import Sortable from "sortablejs";
import SearchHistoryItem from "./SearchHistoryItem.vue";

export default {
	name: "searchHistory",
	props: {
		options: {
			type: Array as PropType<RouteItem[]>,
		},
		value: {
			type: String,
		},
	},
	emits: ["collect", "delete", "enter", "update:value", "drag"], // 声明事件
	components: {
		SearchHistoryItem,
	},
	setup(props, { emit }) {
		const instance = getCurrentInstance()!;
		const innerHeight = ref();
		const historyRef = ref();
		/** 判断是否停止鼠标移入事件处理 */
		const stopMouseEvent = ref(false);
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
						item.path === active.value ? "rgb(64, 158, 255)" : "",
					color: item.path === active.value ? "#fff" : "",
					fontSize: item.path === active.value ? "16px" : "14px",
				};
			};
		});
		const titleStyle = computed(() => {
			return {
				color: "rgb(64, 158, 255)",
				fontWeight: 500,
			};
		});
		watch(
			() => props.value,
			(newValue) => {
				if (newValue) {
					if (stopMouseEvent.value) {
						setTimeout(() => {
							stopMouseEvent.value = false;
						}, 100);
					}
				}
			}
		);
		const historyList = computed(() => {
			return props.options.filter((item: any) => item.type === "history");
		});
		const collectList = computed(() => {
			return props.options.filter((item: any) => item.type === "collect");
		});
		function handleCollect(item: RouteItem) {
			emit("collect", item);
		}
		function handleDelete(item: RouteItem) {
			stopMouseEvent.value = true;
			emit("delete", item);
		}
		/** 鼠标移入 */
		async function handleMouse(item: RouteItem) {
			if (!stopMouseEvent.value) active.value = item.path;
		}
		function handleTo() {
			emit("enter");
		}
		function resizeResult() {
			// el-scrollbar max-height="calc(90vh - 140px)"
			innerHeight.value =
				window.innerHeight - window.innerHeight / 10 - 140;
		}
		useResize(
			historyRef,
			(width, height) => {
				resizeResult();
			},
			300
		);
		function handleScroll(index: number) {
			const curInstance =
				instance?.proxy?.$refs[`historyItemRef${index}`];
			if (!curInstance) return 0;
			const curRef = Array.isArray(curInstance)
				? (curInstance as HTMLElement[])[0]
				: (curInstance as HTMLElement);
			const scrollTop = curRef.offsetTop + 128; // 128 两个history-item（56px+56px=112px）高度加上下margin（8px+8px=16px）
			return scrollTop > innerHeight.value
				? scrollTop - innerHeight.value
				: 0;
		}
		const handleChangeIndex = (evt: any): void => {
			emit("drag", { oldIndex: evt.oldIndex, newIndex: evt.newIndex });
		};
		let sortableInstance: any = null;
		watch(
			collectList,
			(val) => {
				if (val.length > 1) {
					nextTick(() => {
						const wrapper: HTMLElement =
							document.querySelector(".collect-container");
						if (!wrapper || sortableInstance) return;
						sortableInstance = Sortable.create(wrapper, {
							animation: 160,
							onStart: (event: any) => {
								event.item.style.cursor = "move";
							},
							onEnd: (event: any) => {
								event.item.style.cursor = "pointer";
							},
							onUpdate: handleChangeIndex,
						});
						resizeResult();
					});
				}
			},
			{ deep: true, immediate: true }
		);
		return {
			titleStyle,
			itemStyle,
			historyRef,
			handleScroll,
			historyList,
			handleTo,
			handleMouse,
			handleDelete,
			handleCollect,
			collectList,
            active,
		};
	},
};
</script>

<style lang="scss" scoped>
.history {
	padding-bottom: 12px;

	&-item {
		display: flex;
		align-items: center;
		height: 56px;
		padding: 14px;
		margin: 8px auto 10px;
		cursor: pointer;
		border: 0.1px solid #ccc;
		border-radius: 4px;
		transition: font-size 0.16s;
	}
}
</style>