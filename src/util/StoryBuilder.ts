import { ElementTemplate } from "@/config/DefaultTemplate";
import UUID from "glaway-bi-util/UUID";
import { StoryPage } from "@/types/Story";
import { StoryElement, elementConfig } from '@/types/StoryElement';

/**
 * 故事板构建类
 */
export class StoryBuilder {
  /**
   * 构建页面
   * 
   * @param storyboardId 故事板ID
   * @param sortNum 排序下标
   */
  public buildPage(storyboardId: string, sortNum: number): StoryPage {
    return {
      id: UUID.generate(),
      storyboardId,
      sortNum,
      lockUser: null,
      thumbnail: null,
      elements: []
    };
  }

  /**
   * 构建元素
   * 
   * @param type 元素类型
   * @param position 元素位置
   */
  public buildElement(type: elementConfig.Type, position: elementConfig.Position): StoryElement {
    return {
      id: UUID.generate(),
      type,
      config: new ElementTemplate(type, position).getConfig()
    };
  }

  /**
   * 元素配置项构建
   */
}