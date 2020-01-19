<template>
    <div class="scroll">
        <sn-scroll>
            <ul>
                <li v-for="item in count" :key="item">{{item}}</li>
            </ul>
        </sn-scroll>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop, Watch, Emit} from "vue-property-decorator";

    @Component
    export default class ClassName extends Vue {
        private count: number = 10
    }
</script>
