<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<component
		:is="isExternalLink ? 'a' : 'router-link'"
		v-bind="getLinkProps(to)"
	>
		<slot />
	</component>
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
import { menuType } from "@/layout/types";
import { isUrl } from '@/utils/common';

export default {
	name: "sidebarItemLink",
	props: {
        to: {},
    },
	components: {},
	setup(props, context) {
        const isExternalLink = computed(() => isUrl(props.to.name));
		const getLinkProps = (item: menuType) => {
			if (isExternalLink.value) {
				return {
					href: item.name,
					target: "_blank",
					rel: "noopener",
				};
			}
			return {
				to: item,
			};
		};
		return {
            getLinkProps,
            isExternalLink,
        };
	},
};
</script>