<template>
  <vdr
    class="editable-widget"
    :draggable="isDraggable"
    :resizable="isDraggable"
    :w="widget.config.size.width"
    :h="widget.config.size.height"
    :x="widget.config.position.x"
    :y="widget.config.position.y"
    :z="widget.config.position.z"
    :parent="true"
    :class="{ bordered: noBorder }"
    @activated="onActivated"
    @dragstop="onDragStop"
    @resizestop="onResizeStop"
    :snap="true"
    :snapTolerance="10"
    @refLineParams="syncRefLines"
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

/**
 * 参考线数据
 */
export interface RefLineParams {
  /**
   * 水平参考线
   */
  hLine: Array<RefLineParam>;

  /**
   * 垂直参考线
   */
  vLine: Array<RefLineParam>;
}

export interface RefLineParam {
  /**
   * 是否显示
   */
  display: boolean;

  /**
   * 左侧位移
   */
  origin: string;

  /**
   * 顶部位移
   */
  position: string;

  /**
   * 宽度
   */
  lineLength: string;
}

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

  /**
   * 是否可拖拽
   */
  get isDraggable() {
    return this.getter.pageLockedByMe && !this.widgetEditable.value;
  }

  get noBorder() {
    return !this.widgetData.config.border.enable;
  }

  /**
   * 启用编辑
   */
  enableEditable() {
    if (!this.getter.pageLockedByMe) return;

    this.widgetEditable.value = true;
    window.addEventListener("click", debounce(300, this.clickOnEditing));
  }

  /**
   * 编辑中的点击回调
   */
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

  syncRefLines(param: RefLineParams) {
    this.$emit("syncRefLines", param);
  }
}
</script>

<style lang="scss">
@import "@/assets/vdr";
</style>

<style lang="scss" scoped>
$borderColor: #00a2ff;

.editable-widget {
  &.bordered,
  &.active {
    border: 1px solid $borderColor;
  }

  // 当前激活的元素
  &.active {
    box-shadow: 0 0 6px #58bee9;
  }

  .widget-item {
    width: 100%;
    height: 100%;
    overflow: hidden;
    user-select: none;
    box-sizing: border-box;
  }
}
</style>
