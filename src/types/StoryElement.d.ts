import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";

/**
 * 故事元素
 */
export interface StoryElement {
  /**
   * ID
   */
  id: string;

  /**
   * 元素类型
   */
  type: elementConfig.Type;

  /**
   * 配置项
   */
  config: elementConfig.TextArea | elementConfig.Image | elementConfig.DashboardConf;
}

declare namespace elementConfig {
  /**
   * 元素位置
   */
  type Position = {
    x: number,
    y: number,
    z: number
  }

  /**
   * 
   */
  type Size = {
    width: number,
    height: number
  }

  /**
   * 
   */
  type Border = {
    enable: boolean,
    props: {
      width: number,
      color: string, // Hex
    } | null
  }

  /**
   * 故事元素基础配置项
   */
  type Base = {
    /**
     * 坐标
     */
    position: Position;

    /**
     * 尺寸
     */
    size: Size;

    /**
     * 边框
     */
    border: Border;
  }

  /**
   * 故事元素类型
   */
  enum Type {
    /**
     * 文本框
     */
    TEXT_AREA = "text",
    
    /**
     * 形状
     */
    SHAPE = "shape",

    /**
     * 图片
     */
    IMAGE = "img",

    /**
     * 仪表盘
     */
    DASHBOARD = "dashboard"
  }

  /**
   * 文本框配置
   */
  type TextArea = Base & {
    /**
     * 数值
     */
    value: "",

    /**
     * 字体
     */
    font: {
      color: string,
      size: number,
      bold: boolean,
      italic: boolean,
      underline: boolean
    },

    /**
     * 对齐方式
     */
    alignment: {
      horizontal: "left" | "center" | "right",
      vertical: "top" | "middle" | "bottom"
    }
  }

  /**
   * 图片配置
   */
  type Image = Base & {
    /**
     * URL
     */
    url: string | null
  }

  /**
   * 仪表盘配置
   */
  type DashboardConf = Base & {
    /**
     * 仪表盘ID
     */
    dashboardId: string;

    /**
     * 仪表盘数据
     */
    data: Dashboard | null;
  }

}
