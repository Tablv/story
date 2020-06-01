<script lang="ts">
import { Vue, Component, Provide, Inject, Prop } from "vue-property-decorator";
import Page from "@/types/Page";
import { CreateElement } from "vue";
import text from "./widgets/Text.vue";
import img from "./widgets/Image.vue";
import { StoryWidget } from "@/types/StoryWidget";

@Component({})
export default class Widget extends Vue {
  @Inject()
  widgetData!: StoryWidget<any>;

  @Inject()
  state!: Page.State;

  widgetRegistry: any = {
    text,
    img,
    shape: null,
    dashboard: null
  };

  render(h: CreateElement) {
    const component = this.widgetRegistry[this.widgetData.type];
    if (component) return h(component);
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
