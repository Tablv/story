<template>
  <vdr
    class="editable-widget"
    :draggable="isDraggable"
    :resizable="isDraggable"
    :w="widget.config.size.width"
    :h="widget.config.size.height"
    :x="widget.config.position.x"
    :y="widget.config.position.y"
    :z-index="widget.config.position.z"
    :parent="true"
    :class="{ active: isActiveWidget() }"
    @activated="onActivated"
    @dragstop="onDragStop"
    @resizestop="onResizeStop"
  >
    <widget @dblclick.native="enableEditable"></widget>
  </vdr>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Provide,
  Inject,
  Prop,
  Emit
} from "vue-property-decorator";

// Vue-Draggable-Resizable
import vdr from "vue-draggable-resizable-gorkys";
import "vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css";

import debounce from "@/util/debounce";
import Page from "@/types/Page";
import { WidgetType } from "@/config/WidgetType";
import StoryBuilder from "@/config/StoryBuilder";
import { StoryWidget } from "@/types/StoryWidget";
import { StoryPage } from "@/types/Story";
import Widget from "./Widget.vue";

@Component({
  components: {
    vdr,
    Widget
  }
})
export default class EditableWidget extends Vue {
  @Inject()
  state!: Page.State;

  @Inject()
  getter!: Page.Getter;

  @Prop()
  @Provide()
  widgetData!: StoryWidget<any>;

  @Emit("activated")
  onActivated() {
    return this.widgetData;
  }

  @Provide()
  widgetEditable = {
    value: false
  };

  get isDraggable() {
    this.getter.pageLockedByMe;
    const isCurrentUser =
      this.state.currentUser !== null &&
      this.state.currentUser.id === this.state.currentPage?.lockUser;
    return isCurrentUser && !this.widgetEditable.value;
  }

  enableEditable() {
    this.widgetEditable.value = true;

    window.addEventListener("click", debounce(300, this.clickOnEditing));
  }

  clickOnEditing(evt: MouseEvent) {
    const $toolbar = document.querySelector(".tool-bar") as HTMLDivElement;
    const toolbarClicked = $toolbar.contains(evt.target as Node);

    if (toolbarClicked) return;

    this.widgetEditable.value = false;
    window.removeEventListener("click", this.clickOnEditing);
  }

  get widget() {
    return this.widgetData;
  }

  set widget(widget: StoryWidget<any>) {
    this.$emit("update:data", widget);
  }

  get currentWidget() {
    return this.state.currentWidget;
  }

  isActiveWidget(): boolean {
    return this.widget.id === this.currentWidget?.id;
  }

  /**
   * 拖拽结束 回调
   */
  onDragStop(x: number, y: number) {
    this.widget.config.position.x = x;
    this.widget.config.position.y = y;
  }

  /**
   * 调整大小结束 回调
   */
  onResizeStop(x: number, y: number, width: number, height: number) {
    this.widget.config.size.width = width;
    this.widget.config.size.height = height;
  }
}
</script>

<style lang="scss">
@import "@/assets/vdr";
</style>

<style lang="scss" scoped>
.editable-widget {
  .widget-item {
    width: 100%;
    height: 100%;
    overflow: hidden;
    user-select: none;
    box-sizing: border-box;
  }
}
</style>
