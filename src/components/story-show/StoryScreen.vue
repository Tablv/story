<template>
  <section v-if="visible" class="story-screen">
    <div class="story-slide-wrapper" :style="slideSize">
      <story-slide v-if="hasPage" :page="currentPage" :scale="scale" />

      <nav>
        <el-button>Previous</el-button>
        <el-button>Next</el-button>
      </nav>
    </div>
  </section>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Provide,
  Watch,
  Prop,
  Emit
} from "vue-property-decorator";

import { WidgetType } from "@/config/WidgetType";
import StoryBuilder from "@/config/StoryBuilder";
import { widgetConfig } from "@/types/StoryWidget";
import { StoryPage, StoryContainer } from "@/types/Story";

import StorySlide from "@/components/story-show/StorySlide.vue";
import { getCanvasScale, scaledStyle } from "@/util/scale-util";

let syncThumbnail!: Function;

@Component({
  components: {
    StorySlide
  }
})
export default class StoryScreen extends Vue {
  @Prop()
  visible!: boolean;

  @Prop()
  container!: StoryContainer;

  /**
   * 页面下标
   */
  @Prop({ default: 0 })
  index!: number;

  @Prop()
  scale!: number;

  @Emit("exit")
  exit() {
    this.pageVisible = false;
  }

  get pageIndex() {
    return this.index;
  }

  set pageIndex(index: number) {
    this.$emit("update:index", index);
  }

  get pageVisible() {
    return this.visible;
  }

  set pageVisible(visible: boolean) {
    this.$emit("update:visible", visible);
  }

  /**
   * 页面数据
   */
  get pages() {
    return this.container?.pages;
  }

  get hasPage() {
    return this.pages && this.pages.length > 0;
  }

  get maxPageIndex() {
    return this.pages.length - 1;
  }

  get currentPage() {
    return this.pages[this.pageIndex];
  }

  toPrevPage() {
    if (this.pageIndex === 0) return;

    this.pageIndex--;
  }

  toNextPage() {
    if (this.pageIndex === this.maxPageIndex) return;

    this.pageIndex++;
  }

  /**
   * 屏幕放映比例
   */
  get slideSize() {
    return scaledStyle.getCanvasSize(this.container.config, this.scale);
  }

  @Watch("visible", {
    immediate: true
  })
  onVisibleUpdate() {
    this.visible ? this.bindKeyEvent() : this.unbindKeyEvent();
  }

  /**
   * 绑定键盘事件
   */
  bindKeyEvent() {
    window.addEventListener("keyup", this.keyEventHandle);
  }

  /**
   * 解绑键盘事件
   */
  unbindKeyEvent() {
    window.removeEventListener("keyup", this.keyEventHandle);
  }

  keyEventHandle(e: KeyboardEvent) {
    switch (e.keyCode) {
      // Escape
      case 27:
        this.exit();
        break;

      // ArrowLeft
      case 37:
      // ArrowUp
      case 38:
        this.toPrevPage();
        break;

      // ArrowRight
      case 39:
      // ArrowDown
      case 40:
        this.toNextPage();
        break;
    }

    e.stopPropagation();
  }
}
</script>

<style lang="scss" scoped>
.story-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: #000;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  
  .story-slide-wrapper {
    margin: auto;
    width: 80%;
    height: 100%;

    nav {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 40px;
    }
  }
}
</style>
