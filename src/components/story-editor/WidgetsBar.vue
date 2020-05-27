<template>
  <div class="widgets-bar">
    <!-- 文本 -->
    <div
      class="block-btn draggable"
      draggable="true"
      @dragstart="dragWidgetHandle($event, 'text')"
    >
      <i class="fa fa-pen"></i>
    </div>

    <!-- 图片 -->
    <div
      class="block-btn draggable"
      draggable="true"
      @dragstart="dragWidgetHandle($event, 'img')"
    >
      <i class="fa fa-images"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject } from "vue-property-decorator";
import Page from "@/types/Page";
import { WidgetType } from "@/config/WidgetType";

@Component({
  components: {}
})
export default class WidgetsBar extends Vue {
  @Inject()
  state!: Page.State;

  dragWidgetHandle(event: DragEvent, widgetType: WidgetType) {
    event.dataTransfer?.setData("widgetType", widgetType);
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
    color: #666;

    &.draggable {
      cursor: grab;

      &:active {
        cursor: grabbing;
      }
    }

    &:hover {
      background-color: #e6e9ec;
    }
  }
}
</style>
