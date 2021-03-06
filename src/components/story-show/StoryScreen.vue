<template>
  <section v-if="visible" class="story-screen">
    <div class="story-slide-wrapper" :style="slideSize">
      <main class="slides-box">
        <transition-group
          :enter-active-class="flickAnimation[0]"
          :leave-active-class="flickAnimation[1]"
          :duration="flickAnimationDuration"
        >
          <div
            class="slide"
            :style="{ 'animation-duration': flickAnimationDuration + 'ms' }"
            v-for="page in [currentPage]"
            :key="page.id"
          >
            <story-slide
              :page="page"
              :scale="scale"
              @next-page="toNextPage"
              @click.native="toNextPage"
            />
          </div>
        </transition-group>
      </main>

      <nav class="slide-controls">
        <el-button
          type="info"
          :disabled="noPrevPage"
          @click="toPrevPage"
          circle
          icon="el-icon-arrow-left"
        ></el-button>
        <el-button
          type="info"
          :disabled="noNextPage"
          @click="toNextPage"
          circle
          icon="el-icon-arrow-right"
        ></el-button>
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

  // 最大页数
  get maxPageIndex() {
    return this.pages.length - 1;
  }

  // 当前页
  get currentPage() {
    return this.pages[this.pageIndex];
  }

  get noPrevPage() {
    return this.pageIndex === 0;
  }

  get noNextPage() {
    return this.pageIndex === this.maxPageIndex;
  }

  /**
   * 页面过渡动画
   */
  // 是否往下一页（用于计算前进后退）
  flickNext = true;

  flickAnimationDuration = 800;

  get flickAnimation() {
    return this.flickNext
      ? ["animated fadeInRight", "animated fadeOutLeft"]
      : ["animated fadeInLeft", "animated fadeOutRight"];
  }

  toPrevPage() {
    if (this.noPrevPage) {
      return;
    }

    this.flickNext = false;

    this.pageIndex--;
  }

  toNextPage() {
    if (this.noNextPage) {
      this.exit();
      return;
    }

    this.flickNext = true;

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
      // Space
      case 32:
        this.toNextPage();
        break;
    }

    e.stopPropagation();
    e.preventDefault();
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

    .slides-box {
      position: relative;
      width: 100%;
      height: 100%;

      .slide {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }

    .slide-controls {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 40px;
      padding: 0 2vw;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .el-button {
        opacity: 0.6;

        &.is-disabled {
          opacity: 0.3;
        }
      }
    }
  }
}
</style>
