<script lang="tsx">
import { Vue, Component, Provide, Inject } from "vue-property-decorator";
import Page from "@/types/Page";
import { CreateElement } from "vue";
import text from "./toolbars/Text.vue";
import img from "./toolbars/Image.vue";

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
    alert(123)
  }

  render(h: CreateElement) {
    const toolbar = this.state.currentWidget ? this.toolbarRegistry[this.state.currentWidget.type] : null;

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
            type="primary"
            disabled={ !this.state.isSaveRequired }
            onClick={ this.savePage }
          >保存</el-button>
        </div>
      </el-row>
    );

    return element;
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
}
</style>
