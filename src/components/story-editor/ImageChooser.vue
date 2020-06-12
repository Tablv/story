<template>
  <el-drawer
    class="image-chooser"
    direction="rtl"
    :visible.sync="chooserVisible"
    title="选择图片"
  >
    <el-tree
      :data="groups"
      node-key="id"
      lazy
      :props="{ label: 'name', isLeaf: data => data.type === 1 }"
      :load="loadGroup"
      :render-content="treeNodeRender"
      @node-click="selectImage"
    >
    </el-tree>
  </el-drawer>
</template>

<script lang="tsx">
import { Vue, Component, Prop, Inject } from "vue-property-decorator";
import { CreateElement } from "vue";
import { TreeNode } from "element-ui/types/tree";

import api from "@/api/common";
import StoryBuilder from "@/config/StoryBuilder";
import { WidgetType } from "@/config/WidgetType";
import Page from "@/types/EditorPage";
import { StoryWidget, widgetConfig } from "@/types/StoryWidget";

@Component
export default class ImageChooser extends Vue {
  @Inject()
  state!: Page.State;

  @Inject()
  getter!: Page.Getter;

  @Prop()
  visible!: boolean;

  groups: Array<MateGroup> = [];

  loading = false;

  get chooserVisible() {
    return this.visible;
  }

  set chooserVisible(visible: boolean) {
    this.$emit("update:visible", visible);
  }

  loadGroup(node: TreeNode<string, MateGroup>, resolve: Function) {
    api.matelib.findAllDir(node.data.id).then(res => {
      resolve(res.result);
    });
  }

  selectImage(data: MateGroup) {
    if (data.type === 0 || !this.state.currentPage) return;

    const imgWidget = StoryBuilder.buildWidget(WidgetType.IMAGE, {
      x: 0,
      y: 0,
      z: this.state.currentPage.widgets.length
    }) as StoryWidget<widgetConfig.Image>;

    imgWidget.config.url = data.url;
    this.state.currentPage?.widgets.push(imgWidget);
  }

  treeNodeRender(
    h: CreateElement,
    context: { node: TreeNode<string, MateGroup>; data: MateGroup }
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

  treeIconRender(h: CreateElement, group: MateGroup) {
    if (group.type === 0) {
      return <i class="fa fa-folder folder-tree-icon"></i>;
    } else {
      return <i class="fa fa-tachometer-alt dash-tree-icon"></i>;
    }
  }
}

interface MateGroup {
  id: string;

  name: string;

  /**
   * 类型
   *  - 0: 文件夹
   *  - 1：图片
   */
  type: 0 | 1;

  url: null | string;
}
</script>

<style lang="scss">
.image-chooser {
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
