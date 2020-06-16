<template>
  <el-container class="story-main">
    <el-container class="story-container" :class="{ 'is-edit': editMode }">
      <!-- 顶部文本工具栏 -->
      <el-header height="70px">
        <tool-bar></tool-bar>
      </el-header>

      <!-- 画布 -->
      <el-main class="canvas-wrapper">
        <story-canvas></story-canvas>
      </el-main>
    </el-container>

    <!-- 侧边工具栏 -->
    <transition
      enter-active-class="animated fadeInRight"
      leave-active-class="animated fadeOutRight"
    >
      <el-aside v-if="editMode" class="widgets-aside" width="auto">
        <widgets-bar></widgets-bar>
      </el-aside>
    </transition>

    <!-- 预览 -->
    <story-screen
      v-if="screenVisible"
      :visible.sync="screenVisible"
      :index.sync="screenIndex"
      :container="pageContainer"
      :scale="screenScale"
    />
  </el-container>
</template>

<script lang="ts">
import { Vue, Component, Inject } from "vue-property-decorator";
import ToolBar from "@/components/story-editor/ToolBar.vue";
import WidgetsBar from "@/components/story-editor/WidgetsBar.vue";
import StoryCanvas from "@/components/story-editor/StoryCanvas.vue";
import StoryScreen from "@/components/story-show/StoryScreen.vue";
import Page from "@/types/EditorPage";
import { WidgetType } from "@/config/WidgetType";
import StoryBuilder from "@/config/StoryBuilder";
import { StoryPage } from "@/types/Story";

@Component({
  components: {
    ToolBar,
    WidgetsBar,
    StoryCanvas,
    StoryScreen
  }
})
export default class StoryMain extends Vue {
  @Inject()
  state!: Page.State;

  @Inject()
  getter!: Page.Getter;

  /**
   * 预览
   */
  get screenVisible() {
    return this.state.previewMode;
  }

  set screenVisible(visible: boolean) {
    this.state.previewMode = visible;
  }

  get screenIndex() {
    const index = this.state.currentPage?.sortNum;
    return index || 0;
  }

  set screenIndex(index: number) {
    const currentPage = this.state.data?.pages[index];

    if (currentPage) this.state.currentPage = currentPage;
  }

  get pageContainer() {
    return this.state.data;
  }

  get screenScale() {
    return this.state.screenScale;
  }

  get editMode() {
    return this.getter.pageLockedByMe;
  }
}
</script>

<style lang="scss" scoped>
.story-main {
  width: 100%;
  height: 100%;
  position: relative;
  overflow-x: hidden;

  .story-container {
    transition: padding 0.5s;
    transition-delay: 0.1s;

    &.is-edit {
      padding-right: 84px;
    }

    .canvas-wrapper {
      padding: 0 20px;
    }

    .story-canvas {
      box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 9px 0px;
    }
  }

  .animated {
    transition-duration: 0.3s !important;
  }

  .widgets-aside {
    border-left: 1px solid #e6e6e6;
    position: absolute;
    height: 100%;
    top: 0;
    right: 0;
  }
}
</style>
