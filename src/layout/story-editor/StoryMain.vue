<template>
  <el-container class="story-main">
    <el-container class="container">
      <!-- 顶部文本工具栏 -->
      <el-header height="50px">
        <tool-bar></tool-bar>
      </el-header>
      <!-- 画布 -->
      <el-main class="canvas-wrapper">
        <story-canvas></story-canvas>
      </el-main>
    </el-container>

    <!-- 侧边工具栏 -->
    <el-aside class="widgets-bar" width="auto">
      <widgets-bar></widgets-bar>
    </el-aside>
  </el-container>
</template>

<script lang="ts">
import { Vue, Component, Inject } from "vue-property-decorator";
import ToolBar from "@/components/story-editor/ToolBar.vue";
import WidgetsBar from "@/components/story-editor/WidgetsBar.vue";
import StoryCanvas from "@/components/story-editor/StoryCanvas.vue";
import Page from "@/types/Page";
import { WidgetType } from "@/config/WidgetType";
import StoryBuilder from "@/util/StoryBuilder";

@Component({
  components: {
    ToolBar,
    WidgetsBar,
    StoryCanvas
  }
})
export default class StoryMain extends Vue {
  @Inject()
  state!: Page.State;
}
</script>

<style lang="scss" scoped>
.story-main {
  width: 100%;
  height: 100%;

  .canvas-wrapper {
    padding: 0 20px;
  }

  .story-canvas {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 9px 0px;
  }
}

.widgets-bar {
  border-left: 1px solid #e6e6e6;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-flow: row nowrap;
}
</style>
