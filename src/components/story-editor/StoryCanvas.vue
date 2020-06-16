<template>
  <div
    v-if="currentPage"
    class="story-canvas"
    @dragover.prevent
    @drop="dropWidgetHandle"
    @click="clearSelect"
    ref="storyCanvas"
    :style="canvasSize"
  >
    <div class="widgets-container">
      <editable-widget
        v-for="widget in widgets"
        :key="widget.id"
        :widget-data.sync="widget"
        @syncRefLines="syncRefLines"
        @activated="setActivedWidget"
        @click.native.stop
        @contextmenu.native.prevent="openContextMenu($event, widget)"
      ></editable-widget>
    </div>

    <!--辅助线-->
    <div class="ref-lines">
      <div class="ref-v-lines">
        <span
          class="ref-line v-line"
          v-for="(line, index) in refLines.vLine"
          :key="index"
          :style="{
            left: line.position,
            top: line.origin,
            height: line.lineLength
          }"
        ></span>
      </div>

      <div class="ref-v-lines">
        <span
          class="ref-line h-line"
          v-for="(line, index) in refLines.hLine"
          :key="index"
          :style="{
            top: line.position,
            left: line.origin,
            width: line.lineLength
          }"
        ></span>
      </div>
    </div>
    <!--辅助线END-->

    <context-menu
      :visible.sync="widgetMenu.visible"
      :position="widgetMenu.position"
    >
      <li @click="setLevelUp">上移一层</li>
      <li @click="setLevelDown">下移一层</li>
      <li @click="setLevelTop">置于顶层</li>
      <li @click="setLevelBottom">置于底层</li>
      <li @click="deleteWidget" divided>删除</li>
    </context-menu>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject, Watch } from "vue-property-decorator";

// Vue-Draggable-Resizable
import vdr from "vue-draggable-resizable-gorkys";
import "vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css";

import Page from "@/types/EditorPage";
import { StoryWidget, widgetConfig } from "@/types/StoryWidget";
import { StoryPage, ContainerConfig } from "@/types/Story";

import ContextMenu from "@/components/ContextMenu.vue";
import EditableWidget, {
  RefLineParams,
  RefLineParam
} from "./EditableWidget.vue";
import debounce from "@/util/debounce";
import { scaledStyle } from "@/util/scale-util";
import { dragUtil } from "@/util/drag-util";

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
    if (!this.getter.pageLockedByMe) return;
    this.state.currentWidget = widget;
  }

  get canvasSize() {
    const config = this.state.data?.config as ContainerConfig;
    const scale = this.state.screenScale;
    return scaledStyle.getCanvasSize(config, scale);
  }

  /**
   * 部件右键菜单
   */
  widgetMenu = {
    visible: false,
    position: {
      top: 0,
      left: 0
    }
  };

  /**
   * 画布参考线
   */
  refLines: RefLineParams = {
    hLine: [],
    vLine: []
  };

  syncRefLines(params: RefLineParams) {
    this.refLines = params;
  }

  created() {
    // 创建同步缩略图方法
    syncThumbnail = debounce(2000, () => {
      const node = document.querySelector(".widgets-container") as HTMLElement;
      this.action.captureSnapshot(node).then(result => {
        this.currentPage.thumbnail = result;
      });
    });
  }

  /**
   * 右键菜单部分
   */
  // 打开菜单
  openContextMenu(event: MouseEvent, currentWidget: StoryWidget<any>) {
    if (!this.getter.pageLockedByMe) return;

    this.currentWidget = currentWidget;

    this.widgetMenu.position = {
      top: event.clientY,
      left: event.clientX
    };

    this.widgetMenu.visible = true;
  }

  // 上移一层
  setLevelUp() {
    this._moveLevel(1);
  }

  // 下移一层
  setLevelDown() {
    this._moveLevel(-1);
  }

  // 置于顶层
  setLevelTop() {
    const maxIndex = this.currentPage.widgets.length - 1;
    const offsetToTop = maxIndex - this.currentWidget?.config.position.z;
    this._moveLevel(offsetToTop);
  }

  // 置于底层
  setLevelBottom() {
    const offsetToZero = -(this.currentWidget as StoryWidget<widgetConfig.Base>)
      .config.position.z;
    this._moveLevel(offsetToZero);
  }

  // 删除部件
  deleteWidget() {
    if (!this.currentWidget) return;

    // 记录下标
    const wIndex = (this.currentWidget as StoryWidget<widgetConfig.Base>).config
      .position.z;

    // 删除
    this.currentPage.widgets.splice(
      this.currentPage.widgets.indexOf(this.currentWidget as any),
      1
    );

    // 当前对象置为空
    this.currentWidget = null;

    // 重新排序
    this.currentPage.widgets.forEach(
      (widget: StoryWidget<widgetConfig.Base>) => {
        if (widget.config.position.z > wIndex) {
          widget.config.position.z--;
        }
      }
    );
  }

  // 移动层级
  _moveLevel(offset: number) {
    if (!this.currentWidget) return;

    const currentWidget = this.currentWidget as StoryWidget<widgetConfig.Base>;

    // 校验层级
    const currentIndex = currentWidget.config.position.z;
    const maxIndex = this.currentPage.widgets.length - 1;
    if (offset < 0 && currentIndex === 0) return;
    if (offset > 0 && currentIndex === maxIndex) return;

    // 排序
    this.currentPage.widgets.forEach(
      (widget: StoryWidget<widgetConfig.Base>) => {
        const wIndex = widget.config.position.z;
        // 减
        if (offset < 0) {
          if (wIndex < currentIndex && wIndex >= currentIndex + offset) {
            widget.config.position.z++;
          }
        }

        // 加
        if (offset > 0) {
          if (wIndex > currentIndex && wIndex <= currentIndex + offset) {
            widget.config.position.z--;
          }
        }
      }
    );

    currentWidget.config.position.z += offset;
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
      (this as any).$message.warning(
        `当前页面正在编辑中，请等待用户 ${this.currentPage.lockUserName} 编辑完成`
      );
      return;
    }

    const $canvasDOM = document.querySelector(".story-canvas");

    if (this.currentPage && $canvasDOM) {
      // 通过事件，构造组件
      let newWidget = dragUtil.getWidget(event);
      if (newWidget === null) {
        console.error("组件拖拽出错");
        return false;
      }

      // 获取组件位置
      const domRect = $canvasDOM.getBoundingClientRect();
      const widgetPosition = {
        x: (event.clientX - domRect.left) / this.state.screenScale,
        y: (event.clientY - domRect.top) / this.state.screenScale,
        z: this.widgets.length
      };

      (newWidget as StoryWidget<
        widgetConfig.Base
      >).config.position = widgetPosition;

      // 添加到组件数组
      this.widgets.push(newWidget);
    }
  }
}
</script>

<style lang="scss" scoped>
.story-canvas {
  display: block;
  position: relative;
  margin: auto;
  background-color: #fff;
  user-select: none;
  overflow: visible;

  .widgets-container {
    width: 100%;
    height: 100%;
  }
}
</style>
