<template>
  <el-drawer
    class="dash-chooser"
    direction="rtl"
    :visible.sync="chooserVisible"
  >
    <span slot="title">
      <el-page-header :class="{ 'first-level': isFirstLevel }" @back="goBack">
        <span slot="content">选择仪表盘</span>
      </el-page-header>
    </span>

    <section v-if="chooserVisible" class="dash-chooser-content">
      <el-tree
        v-loading="loading"
        v-if="isFirstLevel"
        :data="groups"
        node-key="id"
        lazy
        :props="{ label: 'name', isLeaf: data => data.type === 1 }"
        :load="loadGroup"
        :render-content="treeNodeRender"
        @node-click="selectContainer"
      >
      </el-tree>

      <div v-else class="dash-snapshot-list">
        <el-card
          v-for="snapshot in snapshots"
          :key="snapshot.id"
          shadow="hover"
          class="dash-snapshot-item"
          draggable="true"
          @dragstart.native="dragDash($event, snapshot.dashboardId)"
        >
          <header class="snapshot-title" height="auto">
            {{ snapshot.title }}
          </header>
          <main>
            <el-image class="snapshot-img" :src="snapshot.fullPath"></el-image>
          </main>
        </el-card>
      </div>
    </section>
  </el-drawer>
</template>

<script lang="tsx">
import { Vue, Component, Prop } from "vue-property-decorator";
import { CreateElement } from "vue";
import { TreeNode } from "element-ui/types/tree";

import api from "@/api/common";
import { dragUtil } from "@/util/drag-util";

@Component
export default class DashboardChooser extends Vue {
  @Prop()
  visible!: boolean;

  groups: Array<ContainerGroup> = [];

  snapshots: Array<DashboardSnapshot> | null = null;

  loading = false;

  get chooserVisible() {
    return this.visible;
  }

  set chooserVisible(visible: boolean) {
    this.$emit("update:visible", visible);
  }

  get isFirstLevel() {
    return this.snapshots === null;
  }

  set isFirstLevel(isFirst: boolean) {
    this.snapshots = isFirst ? null : [];
  }

  loadGroup(node: TreeNode<string, ContainerGroup>, resolve: Function) {
    const parentId = node.data.id ? node.data.id : "0";
    api.dashboard.findGroups(parentId).then(res => {
      resolve(res.result);
    });
  }

  selectContainer(data: ContainerGroup) {
    if (data.type === 0) return;

    const groupId = data.id;

    api.dashboard
      .findSnapshotByGroupId(groupId)
      .then(res => {
        if (!res.success) throw new Error("ERROR");

        this.snapshots = res.result;
      })
      .catch(() => {
        (this as any).$message.error("加载仪表盘数据出错");
      });
  }

  treeNodeRender(
    h: CreateElement,
    context: { node: TreeNode<string, ContainerGroup>; data: ContainerGroup }
  ) {
    const { node, data } = context;
    const treeIcon = this.treeIconRender(h, data);

    return (
      <span class="tree-node">
        {treeIcon}
        <span>{node.label}</span>
      </span>
    );
  }

  treeIconRender(h: CreateElement, group: ContainerGroup) {
    if (group.type === 0) {
      return <i class="fa fa-folder folder-tree-icon"></i>;
    } else {
      return <i class="fa fa-tachometer-alt file-tree-icon"></i>;
    }
  }

  goBack() {
    this.isFirstLevel = true;
  }

  dragDash(event: DragEvent, dashId: string) {
    dragUtil.putDashboard(event, dashId);
    setTimeout(() => (this.chooserVisible = false), 300);
  }
}

interface ContainerGroup {
  id: string;

  name: string;

  /**
   * 类型
   *  - 0: 文件夹
   *  - 1：仪表盘
   */
  type: 0 | 1;
}

interface DashboardSnapshot {
  id: string;

  title: string;

  dashboardId: string;

  fullPath: string;
}
</script>

<style lang="scss">
.dash-chooser {
  user-select: none;

  .dash-snapshot-list {
    padding: 10px 20px;

    .dash-snapshot-item {
      cursor: grab;

      &:active {
        cursor: grabbing;
      }

      & + .dash-snapshot-item {
        margin-top: 14px;
      }

      .snapshot-title {
        margin-bottom: 14px;
        font-size: 16px;
        text-align: center;
        font-weight: bold;
      }

      .snapshot-img {
        width: 100%;
        border-radius: 4px;

        .el-image__error {
          min-height: 120px;
        }
      }
    }
  }
}
</style>
