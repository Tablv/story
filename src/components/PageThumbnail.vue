<template>
  <section
    class="thumbnail-item"
    :class="{ active: isActivePage }"
    :data-page-num="pageNum"
    @click="onSelectStory"
  >
    <main class="thumbnail-main">
      <el-image
        v-if="data.thumbnail"
        class="thumbnail-img"
        :src="data.thumbnail"
        fit="cover"
        @load="onLoadFinish"
      >
        <div slot="placeholder" class="image-slot">
          <span>正在加载...</span>
        </div>
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>

      <section class="lock-tip-mask" v-if="lockedUserName">
        <span class="lock-tip">
          <i class="fa fa-user"></i>
          <span>{{ lockedUserName }} 正在编辑...</span>
        </span>
      </section>
    </main>
  </section>
</template>

<script lang="ts">
import { Vue, Prop, Component, Inject, Emit } from "vue-property-decorator";
import { StoryPage } from "@/types/Story";
import Page from "@/types/EditorPage";

@Component({})
export default class PageThumbnail extends Vue {
  @Inject()
  state!: Page.State;

  @Prop()
  data!: StoryPage;

  @Emit("select-story")
  onSelectStory() {
    return this.data;
  }

  get isActivePage() {
    return this.data.sortNum === this.state.currentPage?.sortNum;
  }

  get pageNum() {
    return this.data.sortNum + 1;
  }

  get lockedUserName() {
    return this.data.lockUserName;
  }

  onLoadFinish(e: Event) {
    (e.target as HTMLImageElement).setAttribute("draggable", "false");
  }
}
</script>

<style lang="scss">
$radius: 4px;
$width: 160px;
$height: 90px;

.thumbnail-item {
  position: relative;
  width: $width;
  height: $height;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-flow: row nowrap;
  margin: auto;

  &.active {
    .thumbnail-main {
      box-shadow: 0 0 0 3px #42b3ff;
    }
  }

  &::before {
    content: attr(data-page-num);
    position: absolute;
    width: 7px;
    height: 25px;
    line-height: 25px;
    vertical-align: text-bottom;
    bottom: 0px;
    left: -20px;
    color: #606266;
  }

  .thumbnail-main {
    width: 100%;
    height: 100%;
    background-color: #fff;
    box-shadow: 0 1px 4px 2px rgba(0, 0, 0, 0.1);
    cursor: pointer;

    border-radius: $radius;
    position: relative;
    overflow: hidden;

    .lock-tip-mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: flex-end;

      .lock-tip {
        width: 100%;
        background-color: rgba(0, 0, 0, 0.2);
        color: #fff;
        padding: 2px 6px;
        font-size: 13px;

        i {
          margin-right: 4px;
        }
      }
    }
  }

  .thumbnail-img {
    border-radius: $radius;
    width: 100%;
    height: 100%;

    .image-slot {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: #c0c4cc;
      vertical-align: middle;
      background: #f5f7fa;
    }
  }
}
</style>
