import { elementConfig } from '@/types/StoryElement';

/**
 * 元素模板
 */
export class ElementTemplate {
  constructor(
    public type: elementConfig.Type,
    public position: elementConfig.Position
  ) {}

  public getConfig() {
    const configBuilder = this.elementConfigBuilders[this.type];
    if (!configBuilder) {
      return {};
    }
    
    return configBuilder();
  }

  private elementConfigBuilders: { [ type: string ]: Function } = {
    text: (): elementConfig.TextArea => {
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
      }
    },
    img: (): elementConfig.Image => {
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
      }
    },
    dashboard: (): elementConfig.DashboardConf => {
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
      }
    }

  }
}