<template>
  <div
    v-if="currentPage"
    class="story-canvas"
    @dragover.prevent
    @drop="dropWidgetHandle"
    @click="clearSelect"
    ref="storyCanvas"
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

    <context-menu
      :visible.sync="widgetMenu.visible"
      :position="widgetMenu.position"
    >
      <li>上移一层</li>
      <li>下移一层</li>
      <li>置于顶层</li>
      <li>置于底层</li>
      <li divided>删除</li>
    </context-menu>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject, Watch } from "vue-property-decorator";

// Vue-Draggable-Resizable
import vdr from "vue-draggable-resizable-gorkys";
import "vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css";
import html2canvas from "html2canvas";

import Page from "@/types/Page";
import { WidgetType } from "@/config/WidgetType";
import StoryBuilder from "@/config/StoryBuilder";
import { StoryWidget } from "@/types/StoryWidget";
import { StoryPage } from "@/types/Story";

import ContextMenu from "@/components/ContextMenu.vue";
import EditableWidget from "./EditableWidget.vue";
import debounce from "@/util/debounce";

let syncThumbnail!: Function;

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
  getter!: Page.Getter;

  @Inject()
  action!: Page.Action;

  widgetMenu = {
    visible: false,
    position: {
      top: 0,
      left: 0
    }
  };

  created() {
    syncThumbnail = debounce(1000, () => {
      html2canvas(this.$refs["storyCanvas"] as HTMLElement, {
        width: 960,
        height: 540
      }).then((canvas: HTMLCanvasElement) => {
        this.currentPage.thumbnail = canvas.toDataURL("image/png");
      });
    })
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
    return this.state.currentPage as StoryPage;
  }

  get widgets() {
    return this.currentPage?.widgets;
  }

  get currentWidget() {
    return this.state.currentWidget;
  }

  set currentWidget(widget: StoryWidget<any> | null) {
    this.state.currentWidget = widget;
  }

  @Watch("widgets", {
    deep: true,
    immediate: true
  })
  onWidgetsChange(newValue: any, oldValue: any) {
    const noCurrent = this.state.currentPage === null;
    const notLockedByMe = !this.getter.pageLockedByMe;
    const noBeforeVal = oldValue === undefined;

    if (noCurrent || notLockedByMe || noBeforeVal) {
      return;
    }

    // 暂存配置
    this.action.stashUnsavedPage();

    // 存储缩略图
    syncThumbnail && syncThumbnail();
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
    const noLock = !this.getter.pageLocked,
      notLockByMe = !this.getter.pageLockedByMe;
    
    if (noLock) {
      (this as any).$message.warning("请先进入编辑模式");
      return;
    } else if (notLockByMe) {
      (this as any).$message.warning(`当前页面正在编辑中，请等待用户 ${this.currentPage.lockUserName} 编辑完成`);
      return;
    }

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
  width: 960px;
  height: 540px;
  margin: auto;
  background-color: #fff;
  user-select: none;

  .editable-widgets {
    width: 100%;
    height: 100%;
  }
}
</style>
