<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<el-dialog
		v-model="show"
		top="5vh"
		class="pure-search-dialog"
		:show-close="false"
		width="40vw"
		:before-close="handleClose"
		:style="{
			borderRadius: '6px',
		}"
		append-to-body
		@opened="inputRef.focus()"
		@closed="inputRef.blur()"
	>
		<el-input
			ref="inputRef"
			v-model="keyword"
			size="large"
			clearable
			placeholder="搜索菜单(支持拼音搜索)"
			@input="handleSearch"
		>
			<template #prefix>
				<el-icon class="text-primary w-[24px] h-[24px]" size="24"
					><Search
				/></el-icon>
			</template>
		</el-input>
		<div class="search-content">
			<el-scrollbar ref="scrollbarRef" max-height="calc(90vh - 140px)">
				<el-empty v-if="showEmpty" description="暂无搜索结果" />
				<SearchHistory
					v-if="showSearchHistory"
					v-model:value="historyPath"
					ref="historyRef"
					:options="historyOptions"
					@click="handleEnter"
					@delete="handleDelete"
					@collect="handleCollect"
					@drag="handleDrag"
				/>
				<SearchResult
					v-if="showSearchResult"
					ref="resultRef"
					v-model:value="activePath"
					:options="resultOptions"
					@click="handleEnter"
				/>
			</el-scrollbar>
		</div>
		<template #footer>
			<SearchFooter :total="resultOptions.length" />
		</template>
	</el-dialog>
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
	shallowRef,
} from "vue";
import { useDebounceFn, onKeyStroke } from "@vueuse/core";
import SearchFooter from "./SearchFooter.vue";
import SearchHistory from "./SearchHistory.vue";
import SearchResult from "./SearchResult.vue";
import { constantRoutes } from "@/router/index";
import { handleFirstMenu } from "@/utils/common";
import { useRouter } from "vue-router";
import { LocalStorageService } from "@/utils/localStorageService";
import { optionsItem, dragItem } from "../../../types";

const LOCALEHISTORYKEY = "menu-search-history"; // 搜索历史纪录
const LOCALECOLLECTKEY = "menu-search-collect"; // 收藏记录
const HISTORY_TYPE = "history";
const COLLECT_TYPE = "collect";

export default {
	name: "searchModal",
	props: {
		value: {
			type: Boolean,
		},
	},
	components: {
		SearchFooter,
		SearchHistory,
		SearchResult,
	},
	setup(props, context) {
		const localStorageService = new LocalStorageService();
		const router = useRouter();
		const keyword = ref<any>("");
		const inputRef = ref();
		const scrollbarRef = ref();
		const resultRef = ref();
		const historyRef = ref();
		const activePath = ref("");
		const historyPath = ref("");
		const resultOptions = shallowRef([]);
		const historyOptions = shallowRef([]);
		const historyNum = 6; // 设置历史记录最多存6条

		const showSearchHistory = computed(() => {
			return !keyword.value && historyOptions.value.length > 0;
		});
		const showEmpty = computed(() => {
			return (
				(!keyword.value && historyOptions.value.length === 0) ||
				(keyword.value && resultOptions.value.length === 0)
			);
		});
		const showSearchResult = computed(() => {
			return keyword.value && resultOptions.value.length > 0;
		});
		const show = computed({
			get() {
				return props.value;
			},
			set(val: boolean) {
				context.emit("update:value", val);
			},
		});

		function getStorageItem(key: string) {
			return localStorageService.getItem<optionsItem[]>(key) || [];
		}
		function setStorageItem(key: string, value: optionsItem[]) {
			localStorageService.setItem(key, value);
		}

		/** 更新存储的搜索记录 */
		function updateHistory() {
			let searchHistoryList = getStorageItem("menu-search-history");
			const historyIndex = searchHistoryList.findIndex(
				(item) => item.path === historyPath.value
			);
			if (historyIndex !== -1) {
				const [historyItem] = searchHistoryList.splice(historyIndex, 1);
				searchHistoryList.unshift(historyItem);
				setStorageItem(LOCALEHISTORYKEY, searchHistoryList);
			}
		}

		/** 存储搜索记录 */
		function saveHistory() {
			const { path, meta } = resultOptions.value.find(
				(item) => item.path === activePath.value
			);
			const searchHistoryList = getStorageItem(LOCALEHISTORYKEY);
			const searchCollectList = getStorageItem(LOCALECOLLECTKEY);
			const isCollected = searchCollectList.some(
				(item) => item.path === path
			);
			const existingIndex = searchHistoryList.findIndex(
				(item) => item.path === path
			);
			// 判断是否被收藏
			if (!isCollected) {
				// 未收藏
				if (existingIndex !== -1)
					searchHistoryList.splice(existingIndex, 1);
				if (searchHistoryList.length >= historyNum)
					searchHistoryList.pop();
				const obj: optionsItem = {
					path,
					meta,
					type: HISTORY_TYPE,
				};
				searchHistoryList.unshift(obj);
				setStorageItem(LOCALEHISTORYKEY, searchHistoryList);
			} else {
				// 已收藏，什么都不做
			}
		}

		/** 获取本地历史记录 */
		function getHistory() {
			const searchHistoryList = getStorageItem(LOCALEHISTORYKEY);
			const searchCollectList = getStorageItem(LOCALECOLLECTKEY);
			historyOptions.value = [...searchHistoryList, ...searchCollectList];
			historyPath.value = historyOptions.value[0]?.path;
		}

		watch(
			() => props.value,
			(newValue) => {
				if (newValue) getHistory();
			}
		);

		const handleClose = () => {
			show.value = false;
			/** 延时处理防止用户看到某些操作 */
			setTimeout(() => {
				resultOptions.value = [];
				historyPath.value = "";
				keyword.value = "";
			}, 200);
		};
		/** 获取当前选项和路径 */
		function getCurrentOptionsAndPath() {
			const isResultOptions = resultOptions.value.length > 0;
			const options = isResultOptions
				? resultOptions.value
				: historyOptions.value;
			const currentPath = isResultOptions
				? activePath.value
				: historyPath.value;
			return { options, currentPath, isResultOptions };
		}

		// 查询
		const search = (val: any) => {
			const flatMenusData = constantRoutes;
			const filterData = flatMenusData.filter((menu: HistoryRouteItem) =>
				keyword.value
					? menu.meta?.title.includes(keyword.value.trim())
					: false
			);
			resultOptions.value = handleFirstMenu(filterData);
			activePath.value =
				resultOptions.value?.length > 0
					? resultOptions.value[0].path
					: "";
		};
		const handleSearch = useDebounceFn(search, 300);

		/** key enter */
		const handleEnter = () => {
			const { options, currentPath, isResultOptions } =
				getCurrentOptionsAndPath();
			if (options.length === 0 || currentPath === "") return;
			const index = options.findIndex(
				(item: HistoryRouteItem) => item.path === currentPath
			);
			if (index === -1) return;
			if (isResultOptions) {
				saveHistory();
			} else {
				updateHistory();
			}
			router.push(options[index].path);
			handleClose();
		};

		/** 删除历史记录 */
		const handleDelete = (item: HistoryRouteItem) => {
			const key =
				item.type === HISTORY_TYPE
					? LOCALEHISTORYKEY
					: LOCALECOLLECTKEY;
			let list = getStorageItem(key);
			list = list.filter((listItem) => listItem.path !== item.path);
			setStorageItem(key, list);
			getHistory();
		};

		/** 拖拽改变收藏顺序 */
		const handleDrag = (item: dragItem) => {
			const searchCollectList = getStorageItem(LOCALECOLLECTKEY);
			const [reorderedItem] = searchCollectList.splice(item.oldIndex, 1);
			searchCollectList.splice(item.newIndex, 0, reorderedItem);
			setStorageItem(LOCALECOLLECTKEY, searchCollectList);
			historyOptions.value = [
				...getStorageItem(LOCALEHISTORYKEY),
				...getStorageItem(LOCALECOLLECTKEY),
			];
			historyPath.value = reorderedItem.path;
		};

		/** 收藏历史记录 */
		const handleCollect = (item: HistoryRouteItem) => {
			let searchHistoryList = getStorageItem(LOCALEHISTORYKEY);
			let searchCollectList = getStorageItem(LOCALECOLLECTKEY);
			searchHistoryList = searchHistoryList.filter(
				(historyItem) => historyItem.path !== item.path
			);
			setStorageItem(LOCALEHISTORYKEY, searchHistoryList);
			if (
				!searchCollectList.some(
					(collectItem) => collectItem.path === item.path
				)
			) {
				searchCollectList.unshift({ ...item, type: COLLECT_TYPE });
				setStorageItem(LOCALECOLLECTKEY, searchCollectList);
			}
			getHistory();
		};

		function scrollTo(index: number) {
			const ref = resultOptions.value.length
				? resultRef.value
				: historyRef.value;
			const scrollTop = ref.handleScroll(index);
			scrollbarRef.value.setScrollTop(scrollTop);
		}

		/** 更新路径并滚动到指定项 */
		function updatePathAndScroll(newIndex: number, isResultOptions: any) {
			if (isResultOptions) {
				activePath.value = resultOptions.value[newIndex].path;
			} else {
				historyPath.value = historyOptions.value[newIndex].path;
			}
			scrollTo(newIndex);
		}

		/** key up */
		function handleUp() {
			const { options, currentPath, isResultOptions } =
				getCurrentOptionsAndPath();
			if (options.length === 0) return;
			const index = options.findIndex(
				(item) => item.path === currentPath
			);
			const prevIndex = (index - 1 + options.length) % options.length;
			updatePathAndScroll(prevIndex, isResultOptions);
		}

		/** key down */
		function handleDown() {
			const { options, currentPath, isResultOptions } =
				getCurrentOptionsAndPath();
			if (options.length === 0) return;
			const index = options.findIndex(
				(item) => item.path === currentPath
			);
			const nextIndex = (index + 1) % options.length;
			updatePathAndScroll(nextIndex, isResultOptions);
		}

		onMounted(() => {
			onKeyStroke("Enter", handleEnter);
			onKeyStroke("ArrowUp", handleUp);
			onKeyStroke("ArrowDown", handleDown);
		});
		return {
			show,
			handleClose,
			keyword,
			handleSearch,
			inputRef,
			scrollbarRef,
			showEmpty,
			resultOptions,
			showSearchHistory,
			historyPath,
			resultRef,
			activePath,
			showSearchResult,
			handleEnter,
			historyOptions,
			historyRef,
			handleDelete,
			handleCollect,
			handleDrag,
		};
	},
};
</script>

<style lang="scss" scoped>
:deep(input::placeholder) {
	font-size: 16px;
}
.search-content {
	margin-top: 12px;
}
</style>