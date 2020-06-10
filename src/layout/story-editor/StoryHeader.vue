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
        :icon="
          isFullScreen ? 'fa fa-compress-arrows-alt' : 'fa fa-expand-arrows-alt'
        "
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
    if (this.isFullScreen) {
      this.exitFullScreen().catch(() => {
        this.intoFullScreen();
      });
    } else {
      this.intoFullScreen();
    }
  }

  exitFullScreen() {
    return document.exitFullscreen().then(() => {
      this.isFullScreen = false;
    });
  }

  intoFullScreen() {
    return document.documentElement.requestFullscreen().then(() => {
      this.isFullScreen = true;
    });
  }

  get showSlideAvailable() {
    return this.state.data?.pages?.length as number > 0;
  }

  showPreviewScreen() {
    if (this.showSlideAvailable) {
      this.state.previewMode = true;
      
      (this as any).$message.info({
        message: "按 Esc 退出放映",
        customClass: "slide-tips",
        duration: 900
      });
    } else {
      (this as any).$message.warning("当前无故事页");
    }
  }
}
</script>

<style lang="scss">
.el-message.slide-tips {
  padding: 14px 26px 14px 13px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  width: 330px;

  .el-message__icon {
    height: 24px;
    width: 24px;
    font-size: 24px;
  }

  .el-message__content {
    color: #606266;
  }
}
</style>

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
