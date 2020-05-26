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
        icon="fa fa-expand-arrows-alt"
        title="放映"
      ></el-button>

      <el-dropdown trigger="click" class="more-dropdown">
        <el-button
          type="text"
          class="el-dropdown-link"
          icon="fa fa-ellipsis-v"
          title="更多"
        ></el-button>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>重命名</el-dropdown-item>
          <el-dropdown-item divided>删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </span>
  </el-row>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class StoryHeader extends Vue {}
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
