<template>
  <el-container class="storyboard">
    <el-header>
      <el-row
        type="flex"
        justify="space-between"
        align="middle"
        class="story-title"
      >
          <span class="title-text">故事板</span>
          <el-button type="text" icon="fa fa-ellipsis-v"></el-button>
      </el-row>
    </el-header>
    <el-container class="story-container">
      <el-aside class="story-aside" width="240px">
        <page-gallery />
      </el-aside>
      <el-main class="story-main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue, Watch, Provide } from "vue-property-decorator";
import ObjectUtil from "glaway-bi-util/ObjectUtil";
import UUID from "glaway-bi-util/UUID";
import { CommonStore, EditorStore } from "@/store/modules-model";
import PathUtil from "glaway-bi-util/PathUtil";
import PageGallery from "@/components/PageGallery.vue";
import Page from "@/types/Page";

@Component({
  components: {
    PageGallery
  }
})
export default class Storyboard extends Vue {

  @Provide()
  state: Page.State = {
    currentIndex: null,
    currentElement: null,
    data: null
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
      viewUsers: [ "Finok" ],
      pages: [
        {
          id: "111",
          sortNum: 0,
          storyboardId,
          lockUser: null,
          thumbnail: "//127.0.0.1:3364/demo.png",
          elements: []
        },
        {
          id: "222",
          sortNum: 1,
          storyboardId,
          lockUser: null,
          thumbnail: "//127.0.0.1:3364/demo.png",
          elements: []
        }
      ]
    };
  }
}
</script>

<style lang="scss" scoped>
.el-button--text {
  width: 32px;
}

.storyboard {
  height: 100%;
  
  .story-title {
    height: 100%;

    .title-text {
      color: #666;
      font-size: 16px;
    }
  }

  .story-container {
    background-color: #f1f3f6;
    overflow: auto;
    
    .story-aside {
      border-right: 1px solid #e6e6e6;
    }

    .story-main {
      padding: 0;
    }
  }
}
</style>
