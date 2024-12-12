<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<section
		:class="[fixedHeader ? 'app-main' : 'app-main-nofixed-header']"
		:style="getSectionStyle"
	>
		<div class="grow">
			<div class="content">
				<router-view v-slot="{ Component }">
					<transition name="fade-transform" mode="out-in">
						<keep-alive>
							<component :is="Component" />
						</keep-alive>
					</transition>
				</router-view>
			</div>
		</div>
	</section>
</template>

<script>
import {
	computed,
	ref,
	reactive,
	onMounted,
	defineComponent,
	watch,
	toRefs,
	Transition,
} from "vue";
import LayFooter from "../lay-footer/index.vue";
import { isNumber } from "../../../utils/common";
import { usePermissionStoreHook } from "../../../store/modules/permission";
import { useRoute } from "vue-router";
import LayFrame from "../lay-frame/index.vue";

export default {
	name: "layContent",
	props: {
		fixedHeader: {
			type: Boolean,
		},
	},
	components: {
		LayFooter,
		LayFrame,
	},
	setup(props, context) {
		// const { $storage, $config } = useGlobal();
		const currentRoute = useRoute();
		const cachedViews = () => {
			return [];
		};
		const key = computed(() => {
			return currentRoute.path;
		});
		const getSectionStyle = computed(() => {
			return ["padding-top: 81px;"];
		});
		const stretch = computed(() => {
			return false;
		});
		const isKeepAlive = computed(() => {
			return true;
		});
		const getMainWidth = computed(() => {
			return isNumber(stretch.value)
				? stretch.value + "px"
				: stretch.value
				? "1440px"
				: "100%";
		});
		const cachePageList = computed(() => {
			return usePermissionStoreHook.cachePageList;
		});
		const transitions = computed(() => {
			return (route) => {
				return route.meta.transition;
			};
		});
		const transitionMain = defineComponent({
			props: {
				route: {
					type: undefined,
					required: true,
				},
			},
			render() {
				const transitionName =
					transitions.value(this.route)?.name || "fade-transform";
				const enterTransition = transitions.value(
					this.route
				)?.enterTransition;
				const leaveTransition = transitions.value(
					this.route
				)?.leaveTransition;
				return h(
					Transition,
					{
						name: enterTransition
							? "pure-classes-transition"
							: transitionName,
						enterActiveClass: enterTransition
							? `animate__animated ${enterTransition}`
							: undefined,
						leaveActiveClass: leaveTransition
							? `animate__animated ${leaveTransition}`
							: undefined,
						mode: "out-in",
						appear: true,
					},
					{
						default: () => [this.$slots.default()],
					}
				);
			},
		});
		return {
			getSectionStyle,
			getMainWidth,
			isKeepAlive,
			cachePageList,
			transitionMain,
			cachedViews,
		};
	},
};
</script>

<style lang="scss" scoped>
.app-main {
	position: relative;
	width: 100%;
	height: 100vh;
	overflow-x: hidden;
	display: flex;
	.grow {
		padding: 16px;
        height: 100%;
		width: calc(100% - 32px);
		.content {
			height: 100%;
			width: 100%;
			background-color: #fff;
		}
	}
}

.app-main-nofixed-header {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
}

.main-content {
	margin: 24px;
}
</style>