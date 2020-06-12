<template>
  <el-drawer
    class="dash-chooser"
    direction="rtl"
    :visible.sync="chooserVisible"
    :with-header="false"
  >
    <el-container>
      <el-header height="auto">
        <el-page-header :class="{ 'first-level': isFirstLevel }" @back="goBack">
          <span slot="content">选择仪表盘</span>
        </el-page-header>
      </el-header>

      <el-main v-loading="loading">
        <el-tree
          v-if="isFirstLevel"
          :data="groups"
          node-key="id"
          lazy
          :props="{ label: 'name', isLeaf: data => data.type === 1 }"
          :load="loadGroup"
          :render-content="treeNodeRender"
          @node-click="selectDash"
        >
        </el-tree>

        <el-row v-else>
          <span v-for="snapshot in snapshots" :key="snapshot.id">
            {{ snapshot }}
          </span>
        </el-row>
      </el-main>
    </el-container>
  </el-drawer>
</template>

<script lang="tsx">
import { Vue, Component, Prop } from "vue-property-decorator";
import { CreateElement } from "vue";
import { TreeNode } from "element-ui/types/tree";

import api from "@/api/common";

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
    api.dashboard.findGroups(node.data.id).then(res => {
      resolve(res.result);
    });
  }

  selectDash(data: ContainerGroup) {
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
      return <i class="fa fa-tachometer-alt dash-tree-icon"></i>;
    }
  }

  goBack() {
    this.isFirstLevel = true;
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

  snapshot: string;
}
</script>

<style lang="scss">
.dash-chooser {
  user-select: none;

  .el-container {
    height: 100%;
  }

  .el-drawer:focus {
    outline: none;
  }

  .el-page-header {
    padding: 14px 4px;

    &.first-level {
      .el-page-header__left {
        display: none;
      }
    }
  }

  .el-tree {
    [class$="tree-icon"] {
      padding-right: 8px;
    }

    .folder-tree-icon {
      color: #ffe17b;
    }

    .dash-tree-icon {
      color: #409eff;
    }
  }
}
</style>
