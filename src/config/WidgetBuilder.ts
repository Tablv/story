import { widgetConfig } from "@/types/StoryWidget";
import { WidgetType } from "@/config/WidgetType";

/**
 * 元素模板
 */
export class WidgetBuilder {
  constructor(
    public type: WidgetType | null,
    public position?: widgetConfig.Position
  ) {}

  public buildConfig() {
    if (!this.type || !this.position) {
      throw new Error("部件构造器的构造函数参数有误");
    }

    const configBuilder = this.widgetConfigBuilders[this.type];
    if (!configBuilder) {
      return {};
    }

    return configBuilder();
  }

  public buildBorder(enable: boolean): widgetConfig.Border {
    return enable
      ? {
          enable: true,
          props: {
            width: 1,
            style: "solid",
            color: "#000"
          }
        }
      : {
          enable: false,
          props: null
        };
  }

  private widgetConfigBuilders: { [type: string]: Function } = {
    text: (): widgetConfig.TextArea => {
      return {
        position: this.position as widgetConfig.Position,
        border: this.buildBorder(false),
        size: {
          width: 400,
          height: 100
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
        position: this.position as widgetConfig.Position,
        border: this.buildBorder(false),
        size: {
          width: 400,
          height: 400
        },
        url: null
      };
    },
    dashboard: (): widgetConfig.DashboardConf => {
      return {
        position: this.position as widgetConfig.Position,
        border: this.buildBorder(false),
        size: {
          width: 600,
          height: 600
        },
        dashboardId: "",
        data: null
      };
    }
  };
}
