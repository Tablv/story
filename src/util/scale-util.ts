import { widgetConfig } from "@/types/StoryWidget";
import { ContainerConfig } from "@/types/Story";

/**
 * 计算画布缩放尺寸
 *
 * @param canvas 画布DOM
 * @param config 画布配置
 * @param paddingSize 画布 Padding
 */
export function getScale(
  canvas: HTMLElement,
  config: ContainerConfig,
  paddingSize: number = 30
) {
  const canvasWidth = canvas.clientWidth - paddingSize;
  const canvasHeight = canvas.clientHeight - paddingSize;

  const widthScale = canvasWidth / config.standardSize.width;
  const heightScale = canvasHeight / config.standardSize.height;

  // 屏幕缩放 取最小值
  let screenScale = widthScale > heightScale ? heightScale : widthScale;
  // 取后6位
  screenScale = parseFloat(screenScale.toFixed(6));

  return screenScale;
}

/**
 * 缩放后样式
 */
export const scaledStyle = {
  /**
   * 获取画布缩放尺寸样式
   *
   * @param config 画布配置
   * @param scale 缩放比例
   */
  getCanvasSize(config: ContainerConfig, scale: number) {
    return {
      width: `${config.standardSize.width * scale}px`,
      height: `${config.standardSize.height * scale}px`
    };
  },

  /**
   *
   * @param config 组件配置
   * @param scale 缩放比例
   */
  getWidgetSize(config: widgetConfig.Base, scale: number) {
    const { size, position } = config;

    return {
      position: {
        x: scale * position.x,
        y: scale * position.y
      },
      size: {
        width: scale * size.width,
        height: scale * size.height
      }
    };
  }
};
