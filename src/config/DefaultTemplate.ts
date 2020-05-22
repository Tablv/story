import { widgetConfig } from "@/types/StoryWidget";
import { WidgetType } from "@/config/WidgetType";

/**
 * 元素模板
 */
export class ElementTemplate {
  constructor(
    public type: WidgetType,
    public position: widgetConfig.Position
  ) {}

  public getConfig() {
    const configBuilder = this.widgetConfigBuilders[this.type];
    if (!configBuilder) {
      return {};
    }

    return configBuilder();
  }

  private widgetConfigBuilders: { [type: string]: Function } = {
    text: (): widgetConfig.TextArea => {
      return {
        position: this.position,
        size: {
          width: 400,
          height: 100
        },
        border: {
          enable: false,
          props: null
        },
        value: "",
        font: {
          color: "#666",
          size: 16,
          bold: false,
          italic: false,
          underline: false
        },
        alignment: {
          horizontal: "left",
          vertical: "top"
        }
      };
    },
    img: (): widgetConfig.Image => {
      return {
        position: this.position,
        size: {
          width: 400,
          height: 400
        },
        border: {
          enable: false,
          props: null
        },
        url: null
      };
    },
    dashboard: (): widgetConfig.DashboardConf => {
      return {
        position: this.position,
        size: {
          width: 600,
          height: 600
        },
        border: {
          enable: false,
          props: null
        },
        dashboardId: "",
        data: null
      };
    }
  };
}
