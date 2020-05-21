<template>
  <div class="thumbnail-container" :class="{ 'active': isActivePage }">
    <div class="thumbnail-box" :data-page-num="pageNum" @click="onSelectStory">
      <el-image
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
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Inject, Emit } from 'vue-property-decorator';
import { StoryPage } from "@/types/Story";
import Page from "@/types/Page";

@Component({})
export default class PageThumbnail extends Vue {
  @Inject()
  state!: Page.State;

  @Prop()
  data!: StoryPage;

  @Emit("select-story")
  onSelectStory() {
    return this.data.sortNum;
  };

  get isActivePage() {
    return this.state.currentIndex === this.data.sortNum;
  }

  get pageNum() {
    return this.data.sortNum + 1;
  }

  onLoadFinish(e: Event) {
    (e.target as HTMLImageElement).setAttribute("draggable", "false");
  }
}
</script>

<style lang="scss">
.thumbnail-container {
  position: relative;

  .thumbnail-box {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex-flow: row nowrap;
    margin: 0 24px;

    &::before {
      content: attr(data-page-num);
      position: absolute;
      width: 7px;
      height: 25px;
      line-height: 25px;
      vertical-align: text-bottom;
      bottom: 0px;
      left: 5px;
    }

    .thumbnail-img {
      width: 160px;
      height: 90px;
      border-radius: 4px;
      background-color: #fff;
      box-shadow: 0 1px 4px 2px rgba(0, 0, 0, 0.1);
      border: 2px solid transparent;
      cursor: pointer;

      .image-slot {
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

  &.active {
    .thumbnail-img {
      border: 2px solid #09f;
    }
  }
}
</style>