<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
    <div class="error-500">抱歉，服务器出错了</div>
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
    name: "error-500",
    props: {},
    components: {},
    setup(props, context) {

        return {};
    },
};
</script>

<style lang="scss" scoped>
.error-500 {

}
</style>