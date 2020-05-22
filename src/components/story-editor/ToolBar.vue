<script lang="ts">
import { Vue, Component, Provide, Inject } from "vue-property-decorator";
import Page from "@/types/Page";
import { CreateElement } from "vue";
import text from "./custom-toolbar/Text.vue";
import img from "./custom-toolbar/Image.vue";

@Component({
  components: {}
})
export default class ToolBar extends Vue {
  @Inject()
  state!: Page.State;

  toolbarRegistry = {
    text,
    img,
    shape: null,
    dashboard: null
  };

  render(h: CreateElement) {
    // if (this.state.currentWidget) {
    //   this.toolbarRegistry[this.state.currentWidget.type]
    //   h();
    // }
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
