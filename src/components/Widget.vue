<script lang="tsx">
import { Vue, Component, Provide, Inject, Prop } from "vue-property-decorator";
import Page from "@/types/EditorPage";
import { CreateElement } from "vue";
import text from "./widgets/Text.vue";
import img from "./widgets/Image.vue";
import dashboard from "./widgets/Dashboard.vue";
import { StoryWidget } from "@/types/StoryWidget";

import BorderConfigurable from "./widgets/style-mixins/Border";
import BackgroundConfigurable from "./widgets/style-mixins/Background";

/**
 * 组件页面配置项（Provide/Inject 注入）
 */
export interface WidgetPageConfig {
  /**
   * 页面编辑模式
   */
  pageEditMode: boolean;

  /**
   * 是否可编辑
   */
  widgetEditMode: boolean;

  /**
   * 组件缩放比例
   */
  scale: number;
}

@Component({
  mixins: [BorderConfigurable, BackgroundConfigurable]
})
export default class Widget extends Vue {
  @Prop()
  data!: StoryWidget<any>;

  widgetRegistry: any = {
    text,
    img,
    shape: null,
    dashboard
  };

  render(h: CreateElement) {
    const component = this.widgetRegistry[this.data.type];
    if (!component) return null;

    return (
      <component
        class="widget-item"
        id={"widget-" + this.data.id}
        data={this.data}
        style={[(this as any).borderStyle, (this as any).backgroundStyle]}
      ></component>
    );
  }
}
</script>

<style lang="scss">
.widget-item {
  width: 100%;
  height: 100%;
}
</style>
