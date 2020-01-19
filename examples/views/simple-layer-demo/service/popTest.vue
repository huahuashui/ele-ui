<template>
    <div>
         {{model ? model : "this is no params pop"}}
    </div>
</template>
<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    @Component({
    })
    export default class PopTest extends Vue {
        @Prop() private model: string;
        private mounted() {
        }
    }
</script>
