<template>
  <el-container class="storyboard-editor">
    <el-header class="header">
      <story-header></story-header>
    </el-header>
    <el-container class="container">
      <el-aside class="aside" width="240px">
        <story-aside></story-aside>
      </el-aside>
      <el-main class="main">
        <story-main></story-main>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue, Watch, Provide } from "vue-property-decorator";
import ObjectUtil from "glaway-bi-util/ObjectUtil";
import UUID from "glaway-bi-util/UUID";
import PathUtil from "glaway-bi-util/PathUtil";
import Page from "@/types/EditorPage";

import StoryHeader from "@/layout/story-editor/StoryHeader.vue";
import StoryAside from "@/layout/story-editor/StoryAside.vue";
import StoryMain from "@/layout/story-editor/StoryMain.vue";
import { StoryPage, StoryContainer, ContainerConfig } from "@/types/Story";
import { pageState, pageGetter, pageAction } from "@/store/EditorStore";
import StoryBuilder from "@/config/StoryBuilder";

import { getCanvasScale, getSlideScale } from "@/util/scale-util";

@Component({
  components: {
    StoryHeader,
    StoryAside,
    StoryMain
  }
})
export default class StoryEditor extends Vue {
  @Provide()
  state: Page.State = pageState;

  @Provide()
  getter: Page.Getter = pageGetter;

  @Provide()
  action: Page.Action = pageAction;

  /**
   * 创建时执行方法
   */
  created(): void {
    // 加载数据
    const { id, debuggerMode } = PathUtil.getPathParams();

    if (debuggerMode === "true") {
      // 不加载数据
      return;
    }

    if (ObjectUtil.isEmptyString(id)) {
      this.storyBroken();
      return;
    }

    // 加载数据
    this.loadData(id);
  }

  mounted() {
    window.addEventListener("resize", this.syncScreenScale);
  }

  beforeDestroy() {
    window.removeEventListener("resize", this.syncScreenScale);
  }

  get previewMode() {
    return this.state.previewMode;
  }

  @Watch("previewMode")
  onPreviewModeUpdate() {
    this.syncScreenScale();
  }

  /**
   * 同步屏幕缩放比例
   */
  syncScreenScale() {
    const config = this.state.data?.config as ContainerConfig;
    if (!config) return;

    /**
     * 画布 DOM：
     *  - 预览时，获取幻灯片全屏缩放比例
     *  - 编辑时，获取编辑器画布缩放比例
     */
    if (this.previewMode) {
      // 幻灯片全屏缩放比例
      this.state.screenScale = getSlideScale(config);
    } else {
      // 编辑器画布缩放比例
      const canvas = document.querySelector(".canvas-wrapper") as HTMLElement;
      this.state.screenScale = getCanvasScale(canvas, config);
    }
  }

  /**
   * 加载数据
   * 并对加载失败的结果进行处理
   */
  loadData(groupId: string): void {
    pageState.groupId = groupId;

    pageAction
      .loadUser()
      .then(async () => {
        // 加载故事板
        const container = await pageAction.loadStory(groupId);

        if (!container) return Promise.reject();

        // 加载未保存页
        const unsavedPage = await this.action.loadUnsavedPage(container.id);

        // 恢复暂存数据
        if (unsavedPage) {
          container.pages.forEach((page: StoryPage, index: number) => {
            if (unsavedPage.id === page.id) {
              this.$set(container.pages, index, unsavedPage);
            }
          });
        }

        // 赋值
        this.state.data = container;

        // 设置首页
        if (this.state.data?.pages?.length !== 0) {
          this.state.currentPage = this.state.data?.pages[0] as StoryPage;
        }

        this.syncScreenScale();
      })
      .catch(() => {
        this.storyNotExist();
      });
  }

  /**
   * 故事板参数有误
   *  - 禁止操作
   */
  storyBroken() {
    (this as any).$loading({
      text: "故事板参数错误",
      spinner: "el-icon-error"
    });
    (this as any).$message.error({
      message: "故事板参数错误，系统无法正常加载数据",
      duration: 0
    });
  }

  /**
   * 故事板不存在
   *  - 禁止操作
   */
  storyNotExist() {
    (this as any).$loading({
      text: "故事板不存在",
      spinner: "el-icon-error"
    });
    (this as any).$message.error({
      message: "故事板不存在，系统无法正常加载数据",
      duration: 0
    });
  }
}
</script>

<style lang="scss" scoped>
.storyboard-editor {
  height: 100%;

  .header {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    position: relative;
  }

  .container {
    background-color: #f1f3f6;
    overflow: auto;

    .aside {
      border-right: 1px solid #e6e6e6;
      overflow: hidden;
    }

    .main {
      padding: 0;
    }
  }
}
</style>
