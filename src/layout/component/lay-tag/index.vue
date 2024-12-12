<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<div v-if="!showTags" class="tags-view" ref="containerDom">
		<span v-show="isShowArrow" class="arrow-left">
			<el-icon @click="handleScroll(200)" :size="14"
				><ArrowLeftBold
			/></el-icon>
		</span>
		<div
			ref="scrollbarDom"
			class="scroll-container"
			:class="showModel === 'chrome' && 'chrome-scroll-container'"
			@wheel.prevent="handleWheel"
		>
			<div ref="tabDom" class="tab select-none" :style="getTabStyle">
				<div
					v-for="(item, index) in multiTags"
					:ref="'dynamic' + index"
					:key="item.path"
					:class="[
						'scroll-item is-closable',
						linkIsActive(index) ? 'is-active' : '',
					]"
					@contextmenu.prevent="openMenu(item, $event)"
					@mouseenter.prevent="onMouseenter(item.path, index)"
					@mouseleave.prevent="onMouseleave(item.path, index)"
					@click="tagOnClick(item)"
				>
					<template v-if="true">
						<span
							class="tag-title dark:!text-text_color_primary dark:hover:!text-primary"
							>{{ item.meta.title }}</span
						>
						<span
							class="el-icon-close"
							v-if="
								(index !== 0 && linkIsActive(index)) ||
								tagHoverStyle(index, item.path)
							"
							@click.stop="deleteMenuF(item, 'self')"
							><el-icon :size="14"><Close /></el-icon
						></span>
						<span
							:ref="'schedule' + index"
							:class="[
								linkIsActive(index) ? 'schedule-active' : '',
							]"
						/>
					</template>
				</div>
			</div>
		</div>
		<span v-show="isShowArrow" class="arrow-right">
			<el-icon @click="handleScroll(-200)" :size="14"
				><ArrowRightBold
			/></el-icon>
		</span>
		<!-- 右键菜单按钮 -->
		<transition name="el-zoom-in-top">
			<ul
				v-show="rightKeyVisible"
				ref="contextmenuRef"
				:style="getContextMenuStyle"
				class="contextmenu"
				@mouseleave.prevent="hoverRightKeyIndex = -1"
			>
				<div
					v-for="(item, key) in tagsViews.slice(0, 6)"
					:key="key"
					style="display: flex; align-items: center"
				>
					<li
						v-show="item.show"
						@click="selectTag(key, item)"
						@mouseenter.prevent="hoverRightKeyIndex = key"
					>
						<img
							:src="
								hoverRightKeyIndex === key
									? item.hoverIcon
									: item.defaultIcon
							"
							style="
								width: 16px;
								height: 16px;
								margin-right: 8px;
								opacity: 0.8;
							"
							alt=""
						/>
						{{ item.text }}
					</li>
				</div>
			</ul>
		</transition>
		<!-- 右侧功能按钮 -->
		<el-dropdown
			trigger="click"
			placement="bottom-end"
			@command="handleCommand"
			@visibleChange="visibleChange"
		>
			<span class="arrow-down">
				<el-icon class="el-icon--right" :size="16">
					<arrow-down />
				</el-icon>
			</span>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item
						v-for="(item, key) in tagsViews"
						:key="key"
						:command="{ key, item }"
						:divided="item.divided"
						:disabled="item.disabled"
						@mouseenter="!item.disabled ? (hoverIndex = key) : null"
					>
						<img
							:src="
								hoverIndex === key && !item.disabled
									? item.hoverIcon
									: item.defaultIcon
							"
							:style="{
								width: '16px',
								height: '16px',
								marginRight: '8px',
								opacity: !item.disabled ? 0.8 : 0.2,
							}"
							alt=""
						/>
						{{ item.text }}
					</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
</template>

<script lang="ts">
import { useTags } from "../../hooks/useTag";
import {
	computed,
	ref,
	reactive,
	onMounted,
	onBeforeUnmount,
	watch,
	toRefs,
	unref,
	nextTick,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { onClickOutside } from "@vueuse/core";
import { getParentPaths } from "../../../router/utils";
import { RouteConfigs } from "../../types";
import { useSettingStoreHook } from "../../../store/modules/settings";
import { useResize } from "../../hooks/useResize";
import ICON_FULL_SCREEN_ACTIVE from "@/assets/icon-full-screen-active.png"; // 全屏
import ICON_EXIT_FULL_SCREEN_ACTIVE from "@/assets/icon-exit-full-screen-active.png"; // 退出全屏
import ICON_EXIT_FULL_SCREEN from "@/assets/icon-exit-full-screen.png";
import ICON_FULL_SCREEN from "@/assets/icon-full-screen.png";

export default {
	name: "layTag",
	props: {},
	components: {},
	setup(props, context) {
		const {
			instance,
			showTags,
			showModel,
			isScrolling,
			getTabStyle,
			translateX,
			linkIsActive,
			onMouseleave,
			keyHover,
			onMouseenter,
			tagHoverStyle,
			handleTag,
			multiTags,
			tagOnClick,
			deleteMenu,
			rightKeyVisible,
			getContextMenuStyle,
			tagsViews,
			buttonLeft,
			buttonTop,
			closeMenu,
			setDropMenuShow,
			currentSelect,
			onContentFullScreen,
		} = useTags();
		const pureSetting = useSettingStoreHook();
		const route = useRoute();
		const router = useRouter();
		const containerDom = ref();
		const scrollbarDom = ref();
		const contextmenuRef = ref();
		const tabDom = ref();
		const isShowArrow = ref(false);
		const hoverIndex = ref(-1);
		const hoverRightKeyIndex = ref(-1);

		const handleScroll = (offset: number): void => {
			const scrollbarDomWidth = scrollbarDom.value
				? scrollbarDom.value?.offsetWidth
				: 0;
			const tabDomWidth = tabDom.value ? tabDom.value.offsetWidth : 0;
			if (offset > 0) {
				translateX.value = Math.min(0, translateX.value + offset);
			} else {
				if (scrollbarDomWidth < tabDomWidth) {
					if (
						translateX.value >= -(tabDomWidth - scrollbarDomWidth)
					) {
						translateX.value = Math.max(
							translateX.value + offset,
							scrollbarDomWidth - tabDomWidth
						);
					}
				} else {
					translateX.value = 0;
				}
			}
		};
		const smoothScroll = (offset: number): void => {
			// 每帧滚动的距离
			const scrollAmount = 20;
			let remaining = Math.abs(offset);

			const scrollStep = () => {
				const scrollOffset =
					Math.sign(offset) * Math.min(scrollAmount, remaining);
				handleScroll(scrollOffset);
				remaining -= Math.abs(scrollOffset);

				if (remaining > 0) {
					requestAnimationFrame(scrollStep);
				}
			};

			requestAnimationFrame(scrollStep);
		};
		const handleWheel = (event: WheelEvent): void => {
			isScrolling.value = true;
			const scrollIntensity =
				Math.abs(event.deltaX) + Math.abs(event.deltaY);
			let offset = 0;
			if (event.deltaX < 0) {
				offset = scrollIntensity > 0 ? scrollIntensity : 100;
			} else {
				offset = scrollIntensity > 0 ? -scrollIntensity : -100;
			}
			smoothScroll(offset);
		};
		const routes: any = router.options.routes;

		const handleTagStatus = (tag: any) => {
			const length = getParentPaths(tag.path, routes, "path").length;
			// “重新加载”只有在右键所在菜单与激活菜单一致时展示
			if (tag.path === route.path || length === 1) {
				tagsViews[0].show = true;
				tagsViews[0].disabled = false;
			} else {
				tagsViews[0].show = false;
				tagsViews[0].disabled = true;
			}

			if (multiTags.value.length > 2) {
				tagsViews[5].show = true;
				tagsViews[1].show = true;
				tagsViews[4].show = true;
				tagsViews[5].disabled = false;
				tagsViews[1].disabled = false;
				tagsViews[4].disabled = false;
			}
			const targetIndex = multiTags.value.findIndex(
				(ele: RouteItem) => ele.path === tag.path
			);
			const leftLength = multiTags.value.slice(1, targetIndex).length;
			if (leftLength > 0) {
				tagsViews[2].show = true;
				tagsViews[2].disabled = false;
			}
			const rightLength = multiTags.value.slice(
				targetIndex + 1,
				multiTags.value.length
			).length;
			if (rightLength > 0) {
				tagsViews[3].show = true;
				tagsViews[3].disabled = false;
			}
			if (length === 1) {
				// 右键菜单为激活菜单，只显示“重新加载”
				setDropMenuShow(false);
			}
            // “鼠标右键所在菜单”左右两侧均没有其他标签（首页除外）
            // 显示“关闭当前标签页、关闭全部标签页”
			if (leftLength === 0 && rightLength === 0) {
                tagsViews[1].show = true;
                tagsViews[5].show = true;
				tagsViews[1].disabled = false;
				tagsViews[5].disabled = false;
			}
		};
		const openMenu = (tag: RouteItem, e: any): void => {
			closeMenu();
			setDropMenuShow(false);
			handleTagStatus(tag);
			currentSelect.value = tag;
			const menuMinWidth = 140;
			const offsetLeft = unref(containerDom).getBoundingClientRect().left;
			const offsetWidth = unref(containerDom).offsetWidth;
			const maxLeft = offsetWidth - menuMinWidth;
			const left = e.clientX - offsetLeft + 5;
			if (left > maxLeft) {
				buttonLeft.value = maxLeft;
			} else {
				buttonLeft.value = left;
			}
			buttonTop.value = e.clientY - 40;
			nextTick(() => {
				rightKeyVisible.value = true;
			});
		};
		/** 刷新路由 */
		function onFresh() {
			const { fullPath, query } = unref(route);
			router.go(0);
		}
		const onClickDrop = (
			key: any,
			item: any,
			selectRoute?: RouteConfigs
		) => {
			// if (item && item.disabled) return;
			let selectTagRoute: any;
			if (Reflect.ownKeys(selectRoute).length !== 0) {
				selectTagRoute = {
					path: selectRoute.path,
					meta: selectRoute.meta,
					name: selectRoute.name,
					query: selectRoute?.query,
					params: selectRoute?.params,
				};
			} else {
				selectTagRoute = { path: route.path, meta: route.meta };
			}
			// 当前路由信息
			switch (key) {
				case 0:
					// 刷新路由
					onFresh();
					break;
				case 1:
					// 关闭当前标签页
					deleteMenu(selectTagRoute, "self");
					break;
				case 2:
					// 关闭左侧标签页
					deleteMenu(selectTagRoute, "left");
					break;
				case 3:
					// 关闭右侧标签页
					deleteMenu(selectTagRoute, "right");
					break;
				case 4:
					// 关闭其他标签页
					deleteMenu(selectTagRoute, "other");
					break;
				case 5:
					// 关闭全部标签页
					deleteMenu(selectTagRoute, "all");
					break;
				case 6:
					// 内容区全屏
					onContentFullScreen();
					setTimeout(() => {
						if (pureSetting.hiddenSideBar) {
							tagsViews[6].defaultIcon = ICON_EXIT_FULL_SCREEN;
							tagsViews[6].hoverIcon =
								ICON_EXIT_FULL_SCREEN_ACTIVE;
							tagsViews[6].icon = "help";
							tagsViews[6].text = "内容区退出全屏";
						} else {
							tagsViews[6].defaultIcon = ICON_FULL_SCREEN;
							tagsViews[6].hoverIcon = ICON_FULL_SCREEN_ACTIVE;
							tagsViews[6].icon = "full-screen";
							tagsViews[6].text = "内容区全屏";
						}
					}, 100);
					break;
			}
		};
		/** 触发右键中菜单的点击事件 */
		const selectTag = (key: any, item: any) => {
			closeMenu();
			onClickDrop(key, item, currentSelect.value);
		};

		watch(
			() => route.path,
			(newVal, oldVal) => {
				handleTag(newVal);
				nextTick(() => {
					dynamicTagView();
				});
			},
			{ deep: true, immediate: true }
		);
		onClickOutside(contextmenuRef, closeMenu, {
			detectIframe: true,
		});
		interface Command {
			item: {};
			key: number;
		}
		const handleCommand = ({ item, key }: Command): void => {
			closeMenu();
			onClickDrop(key, item, currentSelect.value);
			hoverIndex.value = -1;
		};
		const visibleChange = (bool: boolean) => {
			if (!bool) hoverIndex.value = -1;

			if (bool) {
				setDropMenuShow(false);
				const targetRouteItem = multiTags.value.find(
					(ele: RouteItem) => ele.path === route.path
				);
				handleTagStatus(targetRouteItem);
			}
		};
		const moveToView = async (index: number): Promise<void> => {
			await nextTick();
			const tabNavPadding = 10;
			if (!instance.refs["dynamic" + index]) return;
			const tabItemEl = (
				instance.refs["dynamic" + index] as HTMLElement[]
			)[0];
			const tabItemElOffsetLeft = (tabItemEl as HTMLElement)?.offsetLeft;
			const tabItemOffsetWidth = (tabItemEl as HTMLElement)?.offsetWidth;
			// 标签页导航栏可视长度（不包含溢出部分）
			const scrollbarDomWidth = scrollbarDom.value
				? scrollbarDom.value?.offsetWidth
				: 0;
			// 已有标签页总长度（包含溢出部分）
			const tabDomWidth = tabDom.value ? tabDom.value?.offsetWidth : 0;
			scrollbarDomWidth <= tabDomWidth
				? (isShowArrow.value = true)
				: (isShowArrow.value = false);
			if (tabDomWidth < scrollbarDomWidth || tabItemElOffsetLeft === 0) {
				translateX.value = 0;
			} else if (tabItemElOffsetLeft < -translateX.value) {
				// 标签在可视区域左侧
				translateX.value = -tabItemElOffsetLeft + tabNavPadding;
			} else if (
				tabItemElOffsetLeft > -translateX.value &&
				tabItemElOffsetLeft + tabItemOffsetWidth <
					-translateX.value + scrollbarDomWidth
			) {
				// 标签在可视区域
				translateX.value = Math.min(
					0,
					scrollbarDomWidth -
						tabItemOffsetWidth -
						tabItemElOffsetLeft -
						tabNavPadding
				);
			} else {
				// 标签在可视区域右侧
				translateX.value = -(
					tabItemElOffsetLeft -
					(scrollbarDomWidth - tabNavPadding - tabItemOffsetWidth)
				);
			}
		};
		const dynamicTagView = async () => {
			await nextTick();
			const index = multiTags.value.findIndex(
				(ele: RouteItem) => ele.path === route.path
			);
			moveToView(index);
		};
		const deleteMenuF = (item: RouteItem, type: string) => {
			deleteMenu(item, type);
			dynamicTagView();
		};

		useResize(
			scrollbarDom,
			() => {
				dynamicTagView();
			},
			500
		);
		onMounted(() => {});
		return {
			hoverRightKeyIndex,
			visibleChange,
			handleScroll,
			handleCommand,
			containerDom,
			scrollbarDom,
			showTags,
			showModel,
			handleWheel,
			getTabStyle,
			multiTags,
			openMenu,
			onMouseenter,
			onMouseleave,
			tagOnClick,
			linkIsActive,
			tagHoverStyle,
			deleteMenuF,
			keyHover,
			rightKeyVisible,
			contextmenuRef,
			getContextMenuStyle,
			tagsViews,
			selectTag,
			isShowArrow,
			tabDom,
			hoverIndex,
		};
	},
};
</script>

<style lang="scss" scoped>
@import url("./index.scss");
</style>