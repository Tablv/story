import AxiosUtil from "glaway-bi-util/AxiosUtil";
import { StoryPage } from "@/types/Story";

const api = {
  story: {
    /**
     * 查询故事板
     */
    find: (groupId: string) => AxiosUtil.get("/story/findOne", { groupId })
  },

  storyPage: {
    /**
     * 创建故事页
     */
    create: (page: StoryPage) => AxiosUtil.post("/storyPage/add", page),
    /**
     * 保存故事页
     */
    save: (page: StoryPage) => AxiosUtil.post("/storyPage/update", page)
  }
};

export default api;
