<template>
    <div class="sn-button-group">
        <slot></slot>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    
    @Component({
        name: 'SnButtonGroup'
    })
    export default class SnButtonGroup extends Vue {};
</script>
