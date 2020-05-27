import { StoryWidget } from "@/types/StoryWidget";
import { StoryContainer } from "./Story";

declare namespace Page {
  /**
   * 页面状态数据 (Provide/Inject)
   */
  type State = {
    /**
     * 当前页下标
     */
    currentIndex: number | null;

    /**
     * 当前选中组件
     */
    currentWidget: StoryWidget<any> | null;

    /**
     * 故事板数据
     */
    data: StoryContainer | null;

    /**
     * 是否需要保存
     */
    isSaveRequired: boolean;
  };
}

export default Page;
