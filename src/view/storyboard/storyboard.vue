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
import { StoryPage, StoryContainer } from "@/types/Story";
import api from "@/api/editor";
import StoryBuilder from '../../config/StoryBuilder';

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
    currentPage: null,

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
      this.brokenStory();
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
    api.story.find(id)
      .then(res => {
        const story = res.result;
        if (story === null) throw new Error("ERROR");
        if (story.config === null) story.config = StoryBuilder.buildContainerConfig();

        this.state.data = res.result;

        if (this.state.data?.pages.length !== 0) {
          this.state.currentPage = this.state.data?.pages[0] as StoryPage;
        }
      })
      .catch((err) => {
        console.error(err)
        this.brokenStory();
      });
    // const storyboardId = UUID.generate();

    // this.state.data = {
    //   id: storyboardId,
    //   name: "测试故事板",
    //   teamId: "",
    //   config: {},
    //   pages: [
    //     {
    //       id: "111",
    //       sortNum: 0,
    //       storyboardId,
    //       lockUser: null,
    //       thumbnail: "//127.0.0.1:3364/demo.png",
    //       widgets: []
    //     },
    //     {
    //       id: "222",
    //       sortNum: 1,
    //       storyboardId,
    //       lockUser: null,
    //       thumbnail: "//127.0.0.1:3364/demo.png",
    //       widgets: []
    //     }
    //   ]
    // };

  }

  /**
   * 故事板参数有误
   *  - 禁止操作
   */
  brokenStory() {
    (this as any).$loading({
      text: "故事板参数错误",
      spinner: "el-icon-error"
    });
    (this as any).$message.error({
      message: "故事板参数错误，系统无法正常加载数据",
      duration: 0
    });
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
