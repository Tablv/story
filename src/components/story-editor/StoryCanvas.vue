<template>
  <div
    v-if="currentPage"
    class="story-canvas"
    @dragover.prevent
    @drop="dropWidgetHandle"
  >
    <vdr
      v-for="widget in widgets"
      :key="widget.id"
      @dragstop="onDragStop"
      @resizestop="onResizeStop"
      :grid="[1, 1]"
      :w="widget.config.size.width"
      :h="widget.config.size.height"
      :x="widget.config.position.x"
      :y="widget.config.position.y"
      :z="widget.config.position.z"
      :class="isActiveWidget(widget.id)"
    >
      <div class="widget-item">
        {{ widget }}
      </div>
    </vdr>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject } from "vue-property-decorator";

// Vue-Draggable-Resizable
import vdr from "vue-draggable-resizable-gorkys";
import Page from "@/types/Page";
import { WidgetType } from "@/config/WidgetType";
import StoryBuilder from "@/util/StoryBuilder";
import { StoryWidget } from "@/types/StoryWidget";
import { StoryPage } from "@/types/Story";

@Component({
  components: {
    vdr
  }
})
export default class StoryCanvas extends Vue {
  @Inject()
  state!: Page.State;

  get currentPage(): StoryPage {
    return this.state.data?.pages[this.state.currentIndex as number] as StoryPage;
  }

  get widgets(): Array<StoryWidget<any>> {
    return this.currentPage.widgets;
  }

  get currentWidget() {
    return this.state.currentWidget;
  }

  isActiveWidget(widgetId: string): boolean {
    return widgetId === this.state.currentWidget?.id;
  }

  dropWidgetHandle(event: DragEvent) {
    const widgetType = event.dataTransfer?.getData("widgetType"),
      $canvasDOM = document.querySelector(".story-canvas");
    if (widgetType && this.currentPage && $canvasDOM) {
      const domRect = $canvasDOM.getBoundingClientRect();
      const newWidget = StoryBuilder.buildWidget(widgetType as WidgetType, {
        x: domRect.top,
        y: domRect.left,
        z: this.widgets.length
      })
      this.widgets.push(newWidget);
    }
  }

  onDragStop() {
    console.log(arguments);
  }

  onResizeStop() {
    console.log(arguments);
    
  }
}
</script>

<style lang="scss" scoped>
.story-canvas {
  height: 100%;

  .widget-item {
    width: 100%;
    height: 100%;
    background-color: #fff;
    border: 1px solid #00f;
  }
}
</style>
