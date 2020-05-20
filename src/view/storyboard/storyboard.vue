<template>
  <el-container class="storyboard">
    <el-header>
      <el-row
        type="flex"
        justify="space-between"
        align="middle"
      >
          <h3>故事板</h3>
          <el-button type="text" icon="fa fa-ellipsis-v"></el-button>
      </el-row>
    </el-header>
    <el-container class="container">
      <el-aside width="240px">
        <page-gallery />
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import ObjectUtil from "glaway-bi-util/ObjectUtil";
import { CommonStore, EditorStore } from "@/store/modules-model";
import PathUtil from "glaway-bi-util/PathUtil";
import PageGallery from "@/components/PageGallery.vue";

@Component({
  components: {
    PageGallery
  }
})
export default class Storyboard extends Vue { 
  /**
   * CommonStore
   */

  // 仪表盘集ID
  @CommonStore.State("dashboardSetId")
  setId!: string;

  // 当前仪表盘集ID
  @CommonStore.Mutation("setDashboardSetId")
  setDashboardSetId!: Function;

  // 删除仪表盘
  @CommonStore.Mutation("deleteDashboard")
  deleteDashboard!: Function;

  // 加载仪表盘集
  @CommonStore.Action("loadDashboardSet")
  loadDashboardSet!: Function;

  // 当前选中仪表盘下标
  @CommonStore.State("dashboardIndex")
  activeIndex!: number;

  /**
   * EditorStore
   */

  // 菜单是否可见
  @EditorStore.State("menuVisible")
  menuVisible!: boolean;

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
    // this.loadData(id);
  }

  /**
   * 加载数据
   * 并对加载失败的结果进行处理
   */
  loadData(id: string): void {
  }
}
</script>

<style lang="scss" scoped>
.el-button--text {
  width: 32px;
}

.storyboard {
  height: 100%;

  .container {
    background-color: #f1f3f6;
    overflow: auto;
  }

  .el-aside {
    border-right: 1px solid #e6e6e6;
  }
}
</style>
