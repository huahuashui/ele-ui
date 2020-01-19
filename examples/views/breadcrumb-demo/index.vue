<template>
    <div>
        <sn-breadcrumb>
            <sn-breadcrumb-item :to="router" replace>{{router.name}}</sn-breadcrumb-item>
            <sn-breadcrumb-item>第二项</sn-breadcrumb-item>
            <sn-breadcrumb-item>第三项</sn-breadcrumb-item>
        </sn-breadcrumb>
        
        <sn-breadcrumb separator="+">
            <sn-breadcrumb-item :to="router" replace>{{router.name}}</sn-breadcrumb-item>
            <sn-breadcrumb-item>第二项</sn-breadcrumb-item>
            <sn-breadcrumb-item>第三项</sn-breadcrumb-item>
        </sn-breadcrumb>
        
        <sn-breadcrumb separator-class="sn-input-clear">
            <sn-breadcrumb-item :to="router" replace>{{router.name}}</sn-breadcrumb-item>
            <sn-breadcrumb-item>第二项</sn-breadcrumb-item>
            <sn-breadcrumb-item>第三项</sn-breadcrumb-item>
        </sn-breadcrumb>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {routerTree} from "../../router/route-config";

    @Component({
        components: {}
    })
    export default class ComponentName extends Vue {
        protected router = routerTree[0];

        public created() {
        
        };

        public mounted() {

        };
    }
</script>

<style lang="scss">

</style>
