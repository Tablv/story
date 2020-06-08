<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    class="story-header"
  >
    <span class="left">
      <span class="title-text">故事板</span>
    </span>

    <span class="right">
      <el-button
        type="text"
        icon="fa fa-tv"
        title="放映"
        @click="showPreviewScreen"
      ></el-button>

      <el-button
        type="text"
        icon="fa fa-expand-arrows-alt"
        :title="isFullScreen ? '退出全屏' : '进入全屏'"
        @click="toggleFullScreen"
      ></el-button>

      <el-dropdown trigger="click" class="more-dropdown">
        <el-button
          type="text"
          class="el-dropdown-link"
          icon="fa fa-ellipsis-v"
          title="更多"
        ></el-button>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>导出</el-dropdown-item>
          <el-dropdown-item divided>分享</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </span>
  </el-row>
</template>

<script lang="ts">
import { Vue, Component, Inject } from "vue-property-decorator";
import Page from "@/types/EditorPage";

@Component({})
export default class StoryHeader extends Vue {
  @Inject()
  state!: Page.State;

  isFullScreen = false;

  toggleFullScreen() {
    const element = document.documentElement;

    if (this.isFullScreen) {
      document.exitFullscreen().then(() => {
        this.isFullScreen = false;
      });
    } else {
      element.requestFullscreen().then(() => {
        this.isFullScreen = true;
      });
    }
  }

  showPreviewScreen() {
    this.state.showPreviewScreen = true;
  }
}
</script>

<style lang="scss" scoped>
.story-header {
  height: 100%;
  user-select: none;

  .title-text {
    color: #666;
    font-size: 16px;
  }

  .right > * + * {
    margin-left: 8px;
    vertical-align: middle;
  }

  .el-button--text {
    font-size: 16px;
  }

  .el-button,
  .more-dropdown {
    width: 32px;
    text-align: center;
    cursor: pointer;
  }

  .more-dropdown {
    > .el-dropdown-link {
      display: inline-block;
      width: 100%;
    }
  }
}
</style>
