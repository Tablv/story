<template>
  <div class="story-aside">
    <div class="thumbnail-list" v-if="state.data">
      <draggable class="draggable" v-model="pages" :animation="200">
        <div
          class="thumbnail-item"
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
import api from "@/api/editor";

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

  @Inject()
  action!: Page.Action;

  /**
   * 右键菜单
   */
  menuVisible = false;

  position = {
    top: 0,
    left: 0
  };

  /**
   * 当前操作ID
   */
  currentOperationPage!: StoryPage;

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

    this.action
      .addPage(this.state.data.id)
      .then(() => {
        // 首次创建页面，置为第一页
        if (this.state.data?.pages.length === 1) {
          this.state.currentPage = this.state.data.pages[0];
        }
      })
      .catch(() => {
        (this as any).$message.error("创建故事页失败");
      });
  }

  openMenu(evt: MouseEvent, page: StoryPage) {
    this.currentOperationPage = page;

    this.position = {
      top: evt.clientY,
      left: evt.clientX
    };
    this.menuVisible = true;
  }

  copyPage() {
    if (this.state.data?.pages) {
      const lastIndex = this.state.data.pages.length - 1;

      let newPage = ObjectUtil.copy(this.currentOperationPage as StoryPage);
      newPage.id = UUID.generate();
      newPage.sortNum = lastIndex + 1;

      api.storyPage
        .copy(newPage)
        .then(async res => {
          (this as any).$message.success("已复制页面");
          const sortNum = newPage.sortNum;
          const newSortNum = res.result;
          if (newSortNum !== sortNum) {
            this.state.data = await this.action.loadStory(this.state.groupId);
          }

          this.state.data?.pages.splice(lastIndex + 1, 0, newPage);
        })
        .catch(() => {
          (this as any).$message.error("复制页面出错");
        });
    }
  }

  deletePage() {
    if (!this.currentOperationPage.id) return;

    if (
      this.currentOperationPage?.lockUser &&
      this.currentOperationPage.lockUser !== this.state.currentUser?.id
    ) {
      (this as any).$message.error(
        `删除页面出错，请等待用户 ${this.currentOperationPage.lockUserName} 编辑完成`
      );
      return;
    }

    api.storyPage
      .remove(this.currentOperationPage.id)
      .then(async () => {
        (this as any).$message.success("已删除页面");

        this.state.data = await this.action.loadStory(this.state.groupId);

        if (
          !this.state.data?.pages.some(
            page => page.id === this.state.currentPage?.id
          )
        ) {
          this.state.currentPage = null;
        }
      })
      .catch(() => {
        (this as any).$message.error("删除页面出错");
      });
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
    .thumbnail-item {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: column nowrap;

      & + .thumbnail-item {
        margin-top: $thumbnailGap;
      }
    }
  }

  .add-page-box {
    margin-top: $thumbnailGap;
  }

  .thumbnail-btn-box {
    display: flex;
    justify-content: center;
    align-items: center;

    .add-btn {
      width: $addBtnSize;
      height: $addBtnSize;
      cursor: inherit;
      border-radius: 50%;
      background-color: transparent;
      color: map-get($themeColor, normal);
      border: 2px solid map-get($themeColor, normal);
      transition: color 0.2s, border 0.2s;

      &:focus {
        outline: none;
      }
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
