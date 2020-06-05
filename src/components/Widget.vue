<script lang="ts">
import { Vue, Component, Provide, Inject, Prop } from "vue-property-decorator";
import Page from "@/types/EditorPage";
import { CreateElement } from "vue";
import text from "./widgets/Text.vue";
import img from "./widgets/Image.vue";
import { StoryWidget } from "@/types/StoryWidget";

/**
 * 组件页面配置项（Provide/Inject 注入）
 */
export interface WidgetPageConfig {
  /**
   * 是否可编辑
   */
  editable: boolean;
}

@Component({})
export default class Widget extends Vue {
  @Prop()
  data!: StoryWidget<any>;

  widgetRegistry: any = {
    text,
    img,
    shape: null,
    dashboard: null
  };

  render(h: CreateElement) {
    const component = this.widgetRegistry[this.data.type];
    if (component) return h(component, {
      props: {
        data: this.data
      }
    });
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
