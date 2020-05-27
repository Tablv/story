<script lang="tsx">
import { Vue, Component, Provide, Inject } from "vue-property-decorator";
import Page from "@/types/Page";
import { CreateElement } from "vue";
import text from "./toolbars/Text.vue";
import img from "./toolbars/Image.vue";
import api from "@/api/editor";

@Component({
  components: {}
})
export default class ToolBar extends Vue {
  @Inject()
  state!: Page.State;

  toolbarRegistry: any = {
    text,
    img,
    shape: null,
    dashboard: null
  };

  savePage() {
    if (!this.state.currentPage) return;

    api.storyPage.save(this.state.currentPage)
      .then(() => {
        (this as any).$message.success("保存成功");
        this.state.isSaveRequired = false;
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
          <el-button
            class="save-button"
            type="primary"
            disabled={!this.state.isSaveRequired}
            onClick={this.savePage}
          >
            {
              this.state.isSaveRequired ? (
                  <span>保存</span>
              ) : (
                <span>
                  <i class="el-icon-check"></i>
                  <span>已保存</span>
                </span>
              )
            }
          </el-button>
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
