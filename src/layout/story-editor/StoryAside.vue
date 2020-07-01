<template>
  <div class="story-aside">
    <el-container class="layout-container">
      <el-header class="new-page-box" height="auto">
        <el-button class="new-page-btn" @click="addPage">
          <span>添加故事页</span>
        </el-button>
      </el-header>
      <el-main class="thumbnail-list" v-if="state.data">
        <!-- <draggable class="draggable" v-model="pages" :animation="200"> -->
        <page-thumbnail
          v-for="page in pages"
          :key="page.id"
          :data="page"
          @contextmenu.native.prevent="openMenu($event, page)"
          @select-story="setCurrentPage"
        />
        <!-- </draggable> -->
      </el-main>
    </el-container>

    <context-menu :visible.sync="menuVisible" :position="position">
      <li @click="copyPage">复制本页</li>
      <li @click="deletePage" divided>删除本页</li>
    </context-menu>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject } from "vue-property-decorator";
import draggable from "vuedraggable";
import Page from "@/types/EditorPage";
import StoryBuilder from "@/config/StoryBuilder";
import PageThumbnail from "@/components/PageThumbnail.vue";
import ContextMenu from "@/components/ContextMenu.vue";
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
    if (this.currentOperationPage.lockUser) {
      (this as any).$message.warning("该故事页正在编辑中 无法完成复制");
      return;
    }

    if (this.state.data?.pages) {
      const lastIndex = this.state.data.pages.length - 1;

      let newPage = ObjectUtil.copy(this.currentOperationPage as StoryPage);
      newPage.id = UUID.generate();
      newPage.sortNum = lastIndex + 1;

      api.storyPage
        .copy(newPage)
        .then(async res => {
          // (this as any).$message.success("已复制页面");
          const sortNum = newPage.sortNum;
          const newSortNum = res.result;

          // 不相等时，刷新页面
          if (newSortNum !== sortNum) {
            this.state.data = await this.action.loadStory(this.state.groupId);

            this.state.data.pages.every(
              page => page.id !== this.state.currentPage?.id
            );
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
        // (this as any).$message.success("已删除页面");

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
  user-select: none;
  height: 100%;

  .layout-container {
    height: 100%;
  }

  .new-page-box {
    text-align: center;
    padding: 20px 10px 0;
  }

  .thumbnail-list {
    padding: $thumbnailGap 0;
    overflow: auto;

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
}
</style>
