<template>
  <div class="widgets-bar">
    <!-- 文本 -->
    <button class="block-btn draggable" draggable="true" @dragstart="dragText">
      <i class="fa fa-font"></i>
    </button>

    <!-- 图片 -->
    <button class="block-btn" @click="openImageChooser">
      <i class="fa fa-images"></i>
    </button>
    <image-chooser :visible.sync="imgChooserVisible"></image-chooser>

    <!-- 仪表盘 -->
    <button class="block-btn" @click="openDashboardChooser">
      <!-- @dragstart="" -->
      <i class="fa fa-tachometer-alt"></i>
    </button>
    <dashboard-chooser :visible.sync="dashChooserVisible"></dashboard-chooser>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject } from "vue-property-decorator";
import Page from "@/types/EditorPage";
import { WidgetType } from "@/config/WidgetType";

import ImageChooser from "@/components/story-editor/ImageChooser.vue";
import DashboardChooser from "@/components/story-editor/DashboardChooser.vue";
import { dragUtil } from "@/util/drag-util";

@Component({
  components: {
    ImageChooser,
    DashboardChooser
  }
})
export default class WidgetsBar extends Vue {
  @Inject()
  state!: Page.State;

  @Inject()
  getter!: Page.Getter;

  imgChooserVisible = false;

  dashChooserVisible = false;

  openImageChooser() {
    if (!this.getter.pageLockedByMe) {
      (this as any).$message.warning("请进入编辑状态");
      return;
    }

    this.imgChooserVisible = true;
  }

  openDashboardChooser() {
    if (!this.getter.pageLockedByMe) {
      (this as any).$message.warning("请进入编辑状态");
      return;
    }

    this.dashChooserVisible = true;
  }

  dragText(event: DragEvent) {
    dragUtil.putText(event);
  }
}
</script>

<style lang="scss" scoped>
$blockSize: 84px;

.widgets-bar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-flow: column nowrap;
  height: 100%;

  .block-btn {
    width: $blockSize;
    height: $blockSize;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 22px;
    cursor: pointer;
    border: none;
    color: #666;
    background-color: transparent;

    &:focus {
      outline: none;
    }

    &.draggable {
      cursor: grab;

      &:hover {
        background: #409eff;
        border-color: #409eff;
        color: #fff;
      }

      &:active {
        cursor: grabbing;
        background: #3a8ee6;
        border-color: #3a8ee6;
        color: #fff;
        outline: none;
      }
    }

    &:hover {
      background-color: #e6e9ec;
    }
  }
}
</style>
