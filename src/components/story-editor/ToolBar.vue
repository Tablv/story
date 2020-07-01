<script lang="tsx">
import { Vue, Component, Provide, Inject } from "vue-property-decorator";
import { CreateElement } from "vue";
import ObjectUtil from "glaway-bi-util/ObjectUtil";
import { ResultJSON } from "glaway-bi-util/AxiosUtil";
import Page from "@/types/EditorPage";
import { StoryPage } from "@/types/Story";

import text from "./toolbars/Text.vue";
import img from "./toolbars/Image.vue";
import dashboard from "./toolbars/Image.vue";

@Component({
  components: {}
})
export default class ToolBar extends Vue {
  @Inject()
  state!: Page.State;

  @Inject()
  getter!: Page.Getter;

  @Inject()
  action!: Page.Action;

  toolbarRegistry: any = {
    text,
    img,
    shape: null,
    dashboard
  };

  /**
   * 是否可编辑
   */
  get isEditVisible() {
    const noLock = !this.state.currentPage?.lockUser;
    return noLock;
  }

  get isSaveVisible() {
    const currentUserEditing =
      this.state.currentPage &&
      this.state.currentPage?.lockUser === this.state.currentUser?.id;
    return currentUserEditing;
  }

  /**
   * 是否需要保存
   */
  // get isSaveRequired() {
  //   return (
  //     this.state.unsavedPage !== null &&
  //     this.state.unsavedPage.id === this.state.currentPage?.id
  //   );
  // }

  editPage() {
    if (!this.state.currentPage) return;

    this.action
      .getLock()
      .then(() => {
        if (this.state.currentPage && this.state.currentUser) {
          this.state.currentPage.lockUser = this.state.currentUser.id;
        }
      })
      .catch((res: Error | ResultJSON | undefined) => {
        if (res instanceof Error || !res) {
          (this as any).$message.error(`获取编辑权限失败`);
          return;
        }

        if (res.result) {
          if (this.state.currentPage) {
            this.state.currentPage.lockUser = res.result.lockUser;
            this.state.currentPage.lockUserName = res.result.lockUserName;
          }
          (this as any).$message.error(
            `获取编辑权限失败，${res.result.lockUserName} 正在编辑当前页`
          );
        } else {
          (this as any).$message.warning("请先保存其他已编辑页面");
        }
      });
  }

  savePage() {
    if (!this.state.currentPage) return;
    const page = this.state.currentPage;

    this.state.snapshotMoment = true;

    this.$nextTick(() => {
      this.captureSnapshot(page).finally(() => {
        this.state.snapshotMoment = false;
        this.action
          .savePage(page)
          .then(() => {
            (this as any).$message.success("保存成功");
          })
          .catch(() => {
            (this as any).$message.error("保存失败");
          });
      });
    });
  }

  /**
   * 清除选中，截取页面缩略图
   */
  captureSnapshot(page: StoryPage): Promise<void> {
    this.state.currentWidget = null;

    const node = document.querySelector(".widgets-container") as HTMLElement;
    return this.action.captureSnapshot(node).then(result => {
      page.thumbnail = result;
    });
  }

  /**
   * 工具栏
   */
  toolbar(h: CreateElement) {
    let toolbarInner = null;

    if (this.getter.pageLockedByMe && this.state.currentWidget) {
      toolbarInner = this.toolbarRegistry[this.state.currentWidget.type];
    }

    return (
      <div class="tool-bar">
        <transition
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          duration="200"
        >
          <toolbarInner
            class="tool-bar-inner"
            style={{ animationDuration: "200ms" }}
          />
        </transition>
      </div>
    );
  }

  btnGroup(h: CreateElement) {
    const buttons = [];

    this.isEditVisible &&
      buttons.push(
        <el-button
          class="edit-button"
          type="primary"
          icon="el-icon-edit"
          onClick={this.editPage}
        >
          <span>编辑</span>
        </el-button>
      );

    this.isSaveVisible &&
      buttons.push(
        <el-button
          class="save-button"
          type="success"
          icon="el-icon-check"
          onClick={this.savePage}
        >
          <span>保存</span>
        </el-button>
      );

    return <div class="btn-group">{buttons.map(button => button)}</div>;
  }

  render(h: CreateElement) {
    if (this.state.currentPage === null) return null;

    return (
      <el-row
        class="tool-bar-wrapper"
        type="flex"
        justify="space-between"
        align="middle"
      >
        {this.toolbar(h)}
        {this.btnGroup(h)}
      </el-row>
    );
  }
}
</script>

<style lang="scss">
@import "./toolbar";
</style>
