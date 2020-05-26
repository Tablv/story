<script lang="ts">
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

  render(h: CreateElement) {
    if (this.state.currentWidget) {
      const component = this.toolbarRegistry[this.state.currentWidget.type];
      if (component) return h(component);
    }
  }
}
</script>

<style lang="scss">
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
</style>
