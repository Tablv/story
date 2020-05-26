<template>
  <div class="story-aside">
    <div class="thumbnail-list" v-if="state.data">
      <draggable :animation="200">
        <div
          class="thumbnail-wrapper"
          v-for="(page, index) in state.data.pages"
          :key="page.id"
          @contextmenu.prevent="openMenu($event, page.id, index)"
        >
          <page-thumbnail :data="page" @select-story="setCurrentPage" />
        </div>
      </draggable>
    </div>

    <div class="thumbnail-container add-page-box">
      <div class="thumbnail-box" @click="addPage">
        <div class="thumbnail-main thumbnail-btn-box">
          <button class="add-btn">
            <i class="fa fa-plus"></i>
          </button>
        </div>
      </div>
    </div>

    <context-menu
      :list="pageMethods"
      :visible.sync="menuVisible"
      :position="position"
    ></context-menu>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject } from "vue-property-decorator";
import draggable from "vuedraggable";
import Page from "@/types/Page";
import StoryBuilder from "@/config/StoryBuilder";
import PageThumbnail from "@/components/PageThumbnail.vue";
import ContextMenu, { ContextMenuItem } from "@/components/ContextMenu.vue";
import ObjectUtil from "glaway-bi-util/ObjectUtil";
import UUID from "glaway-bi-util/UUID";
import { StoryPage } from "@/types/Story";

@Component({
  components: {
    draggable,
    PageThumbnail,
    ContextMenu
  }
})
export default class StoryAside extends Vue {
  @Inject()
  state!: Page.State;

  /**
   * 右键菜单
   */
  currentPageId: string | null = null;

  menuVisible = false;

  // 页面右键菜单方法
  pageMethods: Array<ContextMenuItem> = [
    {
      name: "复制本页",
      handle: this.copyPage
    },
    {
      name: "删除本页",
      handle: this.deletePage,
      divided: true
    }
  ];

  position = {
    top: 0,
    left: 0
  };

  setCurrentPage(index: number) {
    this.state.currentIndex = index;
  }

  addPage() {
    if (this.state.data) {
      const storyboardId = this.state.data.id,
        sortNum = this.state.data.pages.length;

      this.state.data.pages.push(StoryBuilder.buildPage(storyboardId, sortNum));
    }
  }

  openMenu(evt: MouseEvent, pageId: string, pageIndex: number) {
    this.state.currentIndex = pageIndex;
    this.position = {
      top: evt.clientY,
      left: evt.clientX
    };
    this.currentPageId = pageId;
    this.menuVisible = true;
  }

  copyPage() {
    if (this.state.data?.pages) {
      const lastIndex = this.state.data.pages.length - 1;

      let newPage = ObjectUtil.copy(
        this.state.data.pages.filter(page => page.id === this.currentPageId)[0]
      );
      newPage.id = UUID.generate();
      newPage.sortNum = lastIndex + 1;

      this.state.data.pages.splice(lastIndex + 1, 0, newPage);
    }
  }

  deletePage() {
    if (this.state.data?.pages && this.currentPageId) {
      const index = this.state.data.pages
        .map(page => page.id)
        .indexOf(this.currentPageId);
      this.state.data.pages.splice(index, 1);

      // 重新排序
      this.state.data.pages.forEach((page, index) => {
        page.sortNum = index;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
$addBtnSize: 34px;
$themeColor: (
  normal: #42b3ff,
  hover: #09f,
  active: #007fd3
);

$thumbnailGap: 24px;

.story-aside {
  margin: $thumbnailGap 0;
  user-select: none;

  .thumbnail-list {
    .thumbnail-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: column nowrap;

      & + .thumbnail-wrapper {
        margin-top: $thumbnailGap;
      }
    }
  }

  .add-page-box {
    margin-top: $thumbnailGap;
  }

  .thumbnail-btn-box {
    .add-btn {
      width: $addBtnSize;
      height: $addBtnSize;
      cursor: inherit;
      border-radius: 50%;
      background-color: transparent;
      color: map-get($themeColor, normal);
      border: 2px solid map-get($themeColor, normal);
      transition: color 0.2s, border 0.2s;
    }

    &:hover .add-btn {
      color: map-get($themeColor, hover);
      border: 2px solid map-get($themeColor, hover);
    }

    &:active .add-btn {
      color: map-get($themeColor, active);
      border: 2px solid map-get($themeColor, active);
    }
  }
}
</style>
