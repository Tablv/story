import { elementConfig } from './StoryElement';
import { StoryContainer } from './Story';

declare namespace Page {
  /**
   * 页面状态数据 (Provide/Inject)
   */
  type State = {
    currentIndex: number | null,
    currentElement: elementConfig.Type | null,
    data: StoryContainer | null
  };

}

export default Page;
