<template>
  <el-container class="storyboard-editor">
    <el-header>
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
import Page from "@/types/Page";

import StoryHeader from "@/layout/story-editor/StoryHeader.vue";
import StoryAside from "@/layout/story-editor/StoryAside.vue";
import StoryMain from "@/layout/story-editor/StoryMain.vue";
import { StoryPage } from "@/types/Story";

@Component({
  components: {
    StoryHeader,
    StoryAside,
    StoryMain
  }
})
export default class Storyboard extends Vue {
  @Provide()
  state: Page.State = {
    /**
     * 当前页下标
     */
    currentIndex: null,

    /**
     * 当前选中组件
     */
    currentWidget: null,

    /**
     * 故事板数据
     */
    data: null,

    /**
     * 是否需要保存
     */
    isSaveRequired: false
  };

  @Provide()
  getCurrentPage(): StoryPage {
    return this.state.data?.pages[
      this.state.currentIndex as number
    ] as StoryPage;
  }

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
      (this as any).$loading({
        text: "故事板参数错误",
        spinner: "el-icon-error"
      });
      (this as any).$message.error({
        message: "故事板参数错误，系统无法正常加载数据",
        duration: 0
      });
      return;
    }

    // 加载数据
    this.loadData(id);
  }

  /**
   * 加载数据
   * 并对加载失败的结果进行处理
   */
  loadData(id: string): void {
    const storyboardId = UUID.generate();

    this.state.data = {
      id: storyboardId,
      name: "测试故事板",
      teamId: "",
      config: {},
      pages: [
        {
          id: "111",
          sortNum: 0,
          storyboardId,
          lockUser: null,
          thumbnail: "//127.0.0.1:3364/demo.png",
          widgets: []
        },
        {
          id: "222",
          sortNum: 1,
          storyboardId,
          lockUser: null,
          thumbnail: "//127.0.0.1:3364/demo.png",
          widgets: []
        }
      ]
    };

    this.state.currentIndex = 0;
  }
}
</script>

<style lang="scss" scoped>
.storyboard-editor {
  height: 100%;

  .container {
    background-color: #f1f3f6;
    overflow: auto;

    .aside {
      border-right: 1px solid #e6e6e6;
    }

    .main {
      padding: 0;
    }
  }
}
</style>
