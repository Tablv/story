<template>
  <div
    v-if="currentPage"
    class="story-canvas"
    @dragover.prevent
    @drop="dropWidgetHandle"
    @click="clearSelect"
  >
    <editable-widget
      v-for="widget in widgets"
      :key="widget.id"
      :widget-data.sync="widget"
      @activated="setActivedWidget"
      @click.native.stop
    ></editable-widget>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject } from "vue-property-decorator";

// Vue-Draggable-Resizable
import vdr from "vue-draggable-resizable-gorkys";
import "vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css";

import Page from "@/types/Page";
import { WidgetType } from "@/config/WidgetType";
import StoryBuilder from "@/config/StoryBuilder";
import { StoryWidget } from "@/types/StoryWidget";
import { StoryPage } from "@/types/Story";

import EditableWidget from "./EditableWidget.vue";

@Component({
  components: {
    EditableWidget
  }
})
export default class StoryCanvas extends Vue {
  @Inject()
  state!: Page.State;

  @Inject()
  getCurrentPage!: () => StoryPage;

  get currentPage(): StoryPage {
    return this.getCurrentPage();
  }

  get widgets() {
    return this.currentPage.widgets;
  }

  get currentWidget() {
    return this.state.currentWidget;
  }

  set currentWidget(widget: StoryWidget<any> | null) {
    this.state.currentWidget = widget;
  }

  /**
   * 清除部件选择
   */
  clearSelect() {
    this.currentWidget = null;
  }

  setActivedWidget(widget: StoryWidget<any>) {
    this.currentWidget = widget;
  }
  
  dropWidgetHandle(event: DragEvent) {
    const widgetType = event.dataTransfer?.getData("widgetType"),
      $canvasDOM = document.querySelector(".story-canvas");
    
    if (widgetType && this.currentPage && $canvasDOM) {
      const domRect = $canvasDOM.getBoundingClientRect();
      const newWidget = StoryBuilder.buildWidget(widgetType as WidgetType, {
        x: event.clientX - domRect.left,
        y: event.clientY - domRect.top,
        z: this.widgets.length
      });

      this.widgets.push(newWidget);
    }
  }

}
</script>

<style lang="scss" scoped>
.story-canvas {
  display: block;
  position: relative;
  height: 560px;
  background-color: #fff;
  user-select: none;
}
</style>
