<template>
    <div class="m-badge-demo">
        <sn-badge model="20">
            <sn-button>按钮</sn-button>
        </sn-badge>
        <sn-badge model="提示">
            <sn-button>按钮</sn-button>
        </sn-badge>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";

    @Component({
        name: 'BadgeDemo',
        components: {}
    })
    export default class BadgeDemo extends Vue {

        public created() {

        };

        public mounted() {

        };
    }
</script>

<style lang="scss">
    .m-badge-demo {
        margin: 20px;
        
        .sn-badge {
            margin-left: 20px;
        }
    }
</style>
