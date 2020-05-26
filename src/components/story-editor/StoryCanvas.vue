<template>
  <div
    v-if="currentPage"
    class="story-canvas"
    @dragover.prevent
    @drop="dropWidgetHandle"
    @click="clearSelect"
  >
    <div class="editable-widgets">
      <editable-widget
        v-for="widget in widgets"
        :key="widget.id"
        :widget-data.sync="widget"
        @activated="setActivedWidget"
        @click.native.stop
        @contextmenu.native.prevent="openContextMenu($event, widget)"
      ></editable-widget>
    </div>
    
    <context-menu :visible.sync="widgetMenu.visible" :position="widgetMenu.position">
      <li>上移一层</li>
      <li>下移一层</li>
      <li>置于顶层</li>
      <li>置于底层</li>
      <li divided>删除</li>
    </context-menu>
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

import ContextMenu from "@/components/ContextMenu.vue";
import EditableWidget from "./EditableWidget.vue";

@Component({
  components: {
    EditableWidget,
    ContextMenu
  }
})
export default class StoryCanvas extends Vue {
  @Inject()
  state!: Page.State;

  @Inject()
  getCurrentPage!: () => StoryPage;

  widgetMenu = {
    visible: false,
    position: {
      top: 0,
      left: 0
    }
  }

  openContextMenu(event: MouseEvent, currentWidget: StoryWidget<any>) {
    this.state.currentWidget = currentWidget;
    
    this.widgetMenu.position = {
      top: event.clientY,
      left: event.clientX
    };

    this.widgetMenu.visible = true;
  }

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

  .editable-widgets {
    width: 100%;
    height: 100%;
  }
}
</style>
