<script lang="tsx">
import { Vue, Component, Provide, Inject } from "vue-property-decorator";
import Page from "@/types/Page";
import { CreateElement } from "vue";
import text from "./toolbars/Text.vue";
import img from "./toolbars/Image.vue";
import ObjectUtil from "glaway-bi-util/ObjectUtil";

@Component({
  components: {}
})
export default class ToolBar extends Vue {
  @Inject()
  state!: Page.State;

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
  get isSaveRequired() {
    return (
      this.state.unsavedPage !== null &&
      this.state.unsavedPage.id === this.state.currentPage?.id
    );
  }

  editPage() {
    if (!this.state.currentPage) return;

    this.action
      .getLock()
      .then(() => {
        if (this.state.currentPage && this.state.currentUser) {
          this.state.currentPage.lockUser = this.state.currentUser.id;
        }
      })
      .catch(() => {
        (this as any).$message.error("获取编辑权限失败");
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

  render(h: CreateElement) {
    const toolbar = this.state.currentWidget
      ? this.toolbarRegistry[this.state.currentWidget.type]
      : null;

    const element = (
      <el-row
        class="tool-bar-wrapper"
        type="flex"
        justify="space-between"
        align="middle"
      >
        <div class="tool-bar">
          <toolbar />
        </div>

        <div class="btn-group">
          {this.isEditVisible ? (
            <el-button
              class="edit-button"
              type="primary"
              onClick={this.editPage}
            >
              <span>编辑</span>
            </el-button>
          ) : null}

          {this.isSaveVisible ? (
            <el-button
              class="save-button"
              type="primary"
              disabled={!this.isSaveRequired}
              onClick={this.savePage}
            >
              {this.isSaveRequired ? (
                <span>保存</span>
              ) : (
                <span>
                  <i class="el-icon-check"></i>
                  <span>已保存</span>
                </span>
              )}
            </el-button>
          ) : null}
        </div>
      </el-row>
    );

    return this.state.currentPage !== null ? element : null;
  }
}
</script>

<style lang="scss">
.tool-bar-wrapper {
  height: 100%;

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
