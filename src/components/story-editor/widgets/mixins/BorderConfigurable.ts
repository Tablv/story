import { Vue, Component, Inject } from "vue-property-decorator";
import { StoryWidget, widgetConfig } from "@/types/StoryWidget";

/**
 * 可配置边框的部件
 */
@Component
export default class BorderConfigurable extends Vue {
  @Inject()
  widgetData!: StoryWidget<widgetConfig.TextArea>;

  /**
   * 边框配置
   */
  get borderConfig(): widgetConfig.Border {
    return this.widgetData.config.border;
  }

  getBorderStyle() {
    const borderProps = this.borderConfig.props;

    if (this.borderConfig.enable && borderProps) {
      const { width, style, color } = borderProps;
      return {
        border: `${width}px ${style} ${color}`
      };
    }

    return {};
  }
}
