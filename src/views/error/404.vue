<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
    <div class="error">抱歉，你访问的页面不存在</div>
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

export default {
    name: "error",
    props: {},
    components: {},
    setup(props, context) {

        return {};
    },
};
</script>

<style lang="scss" scoped>
.error {

}
</style>