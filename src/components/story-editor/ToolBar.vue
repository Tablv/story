<script lang="tsx">
import { Vue, Component, Provide, Inject } from "vue-property-decorator";
import Page from "@/types/Page";
import { CreateElement } from "vue";
import text from "./toolbars/Text.vue";
import img from "./toolbars/Image.vue";
import ObjectUtil from "glaway-bi-util/ObjectUtil";
import { StoryPage } from "@/types/Story";
import { ResultJSON } from "glaway-bi-util/AxiosUtil";

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
    dashboard: null
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

    this.action
      .savePage(this.state.currentPage)
      .then(() => {
        (this as any).$message.success("保存成功");
      })
      .catch(() => {
        (this as any).$message.error("保存失败");
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
        <toolbarInner />
      </div>
    );
  }

  btnGroup(h: CreateElement) {
    const buttons = [];

    this.isEditVisible &&
      buttons.push(
        <el-button class="edit-button" type="primary" icon="el-icon-edit" onClick={this.editPage}>
          <span>编辑</span>
        </el-button>
      );

    this.isSaveVisible &&
      buttons.push(
        <el-button class="save-button" type="success" icon="el-icon-check" onClick={this.savePage}>
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
.tool-bar-wrapper {
  height: 100%;
  overflow: hidden;

  .tool-bar {
    min-width: 700px;
  }

  .tool-bar-inner {
    width: 100%;
    height: 100%;
    user-select: none;
    position: relative;
    display: flex;
    align-items: center;

    .label-text {
      margin-right: 6px;
    }
  }

  .btn-group {
    .save-button.is-disabled {
      &,
      &:focus,
      &:hover {
        cursor: default;
      }
    }
  }
}
</style>
