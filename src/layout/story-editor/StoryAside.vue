<template>
  <div class="story-aside">
    <div class="thumbnail-list" v-if="state.data">
      <draggable v-model="pages" :animation="200">
        <div
          class="thumbnail-wrapper"
          v-for="page in pages"
          :key="page.id"
          @contextmenu.prevent="openMenu($event, page)"
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

    <context-menu :visible.sync="menuVisible" :position="position">
      <li @click="copyPage">复制本页</li>
      <li @click="deletePage" divided>删除本页</li>
    </context-menu>
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
import api from "../../api/editor";

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
  menuVisible = false;

  position = {
    top: 0,
    left: 0
  };

  get pages() {
    return this.state.data?.pages || [];
  }

  set pages(draggedPages: Array<StoryPage>) {
    if (this.state.data) {
      // 当前页
      const currentPage = this.state.currentPage as StoryPage;
      let currentIndex = currentPage.sortNum;

      // 重新排序
      const sortedPages = draggedPages.map((page: StoryPage, index: number) => {
        // 更新下标
        if (page.id === currentPage.id) currentIndex = index;

        page.sortNum = index;
        return page;
      });

      // 后端请求参数
      const params = sortedPages.map((page: StoryPage) => {
        const { id, sortNum } = page;
        return { id, sortNum };
      });

      this.state.data.pages = sortedPages;

      // 设置当前页
      this.state.currentPage = this.state.data.pages[currentIndex];
    }
  }

  setCurrentPage(page: StoryPage) {
    this.state.currentPage = page;
  }

  addPage() {
    if (!this.state.data) return;

    const pageLength = this.state.data?.pages.length,
      sortNum = pageLength === undefined ? 0 : pageLength;

    const newPage = StoryBuilder.buildPage(this.state.data.id, sortNum);
    api.storyPage
      .create(newPage)
      .then(() => {
        this.state.data?.pages.splice(sortNum, 0, newPage);
        (this as any).$message.success("创建故事页");
      })
      .catch(() => {
        (this as any).$message.error("创建故事页失败");
      });
  }

  openMenu(evt: MouseEvent, page: StoryPage) {
    this.state.currentPage = page;

    this.position = {
      top: evt.clientY,
      left: evt.clientX
    };
    this.menuVisible = true;
  }

  copyPage() {
    if (this.state.data?.pages) {
      const lastIndex = this.state.data.pages.length - 1;

      let newPage = ObjectUtil.copy(this.state.currentPage as StoryPage);
      newPage.id = UUID.generate();
      newPage.sortNum = lastIndex + 1;

      this.state.data.pages.splice(lastIndex + 1, 0, newPage);
    }
  }

  deletePage() {
    if (this.state.data?.pages) {
      const index = this.state.data.pages.indexOf(
        this.state.currentPage as StoryPage
      );
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
