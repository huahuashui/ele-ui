<template>
  <div
    class="demo-block"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false">
    <div class="source">
      <slot name="source"></slot>
    </div>
    <div
      class="meta" ref="meta"
      :style="{height: isExpanded ? 'auto' : '0'}"
    >
      <div class="description" v-if="$slots.default">
        <slot></slot>
      </div>
      <div class="highlight">
        <slot name="highlight"></slot>
      </div>

    </div>

    <div
      class="demo-block-control"
      ref="control"
      :class="{ 'is-fixed': fixedControl }"
    >
      <sn-button @click="isExpanded = !isExpanded">{{ controlText }}</sn-button>
    </div>
  </div>
</template>

<script lang="ts">
    /* eslint-disable */
    import {Vue, Component, Watch} from "vue-property-decorator";
    @Component
    export default class DemoBlock extends Vue  {
        public isExpanded: boolean = false;
        public hovering: boolean = false;
        public fixedControl: boolean = false;

        private scrollParent: any = null;
        get controlText() {
            return this.isExpanded ? '隐藏代码' : '显示代码';
        }
        get codeArea(): HTMLElement {
            return this.$refs['meta'] as HTMLElement;
        }
        get controlRef(): HTMLElement {
            return this.$refs['control'] as HTMLElement;
        }
        get codeAreaHeight() {
            const descriptionEl = this.$el.getElementsByClassName('description') as HTMLCollectionOf<Element>
            const highlightEl = this.$el.getElementsByClassName('highlight') as HTMLCollectionOf<Element>
            if (descriptionEl.length > 0) {
                return descriptionEl[0].clientHeight +
                    highlightEl[0].clientHeight + 20;
            }
            return highlightEl[0].clientHeight;
        }

        private scrollHandler() {
            const { top, bottom, left } = this.codeArea.getBoundingClientRect();
            this.fixedControl = bottom > document.documentElement.clientHeight &&
                top + 44 <= document.documentElement.clientHeight;
            this.controlRef.style.left = this.fixedControl ? `${ left }px` : '0';
        }

        private removeScrollHandler() {
            this.scrollParent && this.scrollParent.removeEventListener('scroll', this.scrollHandler);
        }
        @Watch('isExpanded') private change(val:boolean) {
            this.codeArea.style.height = val ? `${ this.codeAreaHeight + 1 }px` : '0';
            if (!val) {
                this.fixedControl = false;
                this.controlRef.style.left = '0';
                this.removeScrollHandler();
                return;
            }
            setTimeout(() => {
                this.scrollParent = document.querySelector('.g-container');
                this.scrollParent && this.scrollParent.addEventListener('scroll', this.scrollHandler);
                this.scrollHandler();
            }, 200);
        }
    };
</script>

<style lang="scss">
  .demo-block {
    border: solid 1px #ebebeb;
    border-radius: 3px;
    transition: .2s;
    margin-bottom: 24px;
    &.hover {
      box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5);
    }

    code {
      font-family: Menlo, Monaco, Consolas, Courier, monospace;
    }

    .demo-button {
      float: right;
    }

    .source {
      padding: 24px;
    }

    .meta {
      background-color: #fafafa;
      border-top: solid 1px #eaeefb;
      overflow: hidden;
      height: 0;
      transition: height .2s;
    }

    .description {
      padding: 20px;
      box-sizing: border-box;
      border: solid 1px #ebebeb;
      border-radius: 3px;
      line-height: 22px;
      color: #666;
      word-break: break-word;
      margin: 10px;
      background-color: #fff;

      p {
        margin: 0;
        line-height: 26px;
        font-size: 14px;
      }

      code {
        color: #5e6d82;
        background-color: #e6effb;
        margin: 0 4px;
        display: inline-block;
        padding: 1px 5px;
        font-size: 12px;
        border-radius: 3px;
        height: 18px;
        line-height: 18px;
      }
    }


    .demo-block-control {
      border-top: solid 1px #eaeefb;
      box-sizing: border-box;
      padding: 10px 0;
      background-color: #fff;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      text-align: center;
      margin-top: -1px;
      color: #d3dce6;
      cursor: pointer;
      position: relative;

      &.is-fixed {
        position: fixed;
        bottom: 0;
        width: 898px;
      }

      i {
        font-size: 16px;
        line-height: 44px;
        transition: .3s;
        &.hovering {
          transform: translateX(-40px);
        }
      }

      > span {
        position: absolute;
        transform: translateX(-30px);
        font-size: 14px;
        line-height: 44px;
        transition: .3s;
        display: inline-block;
      }

      &:hover {
        color: #409EFF;
        background-color: #f9fafc;
      }

      & .text-slide-enter,
      & .text-slide-leave-active {
        opacity: 0;
        transform: translateX(10px);
      }

      .control-button {
        line-height: 26px;
        position: absolute;
        top: 0;
        right: 0;
        font-size: 14px;
        padding-left: 5px;
        padding-right: 25px;
      }
    }
  }
</style>

