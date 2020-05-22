import { StoryWidget } from "@/types/StoryWidget";
import { StoryContainer } from "./Story";

declare namespace Page {
  /**
   * 页面状态数据 (Provide/Inject)
   */
  type State = {
    currentIndex: number | null;
    currentWidget: StoryWidget | null;
    data: StoryContainer | null;
  };
}

export default Page;
