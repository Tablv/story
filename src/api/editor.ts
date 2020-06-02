import AxiosUtil from "glaway-bi-util/AxiosUtil";
import { StoryPage } from "@/types/Story";

const api = {
  user: {
    find: () => AxiosUtil.post("/storyPage/getUserHelper", null)
  },
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
     * 创建故事页
     */
    remove: (id: string) => AxiosUtil.post("/storyPage/remove", { id }),

    /**
     * 保存故事页
     */
    save: (page: StoryPage) =>
      AxiosUtil.post("/storyPage/updateStoryPage", page, true),

    /**
     * 保存故事页
     */
    copy: (page: StoryPage) =>
      AxiosUtil.post("/storyPage/copyStoryPage", page, true),

    /**
     * 获取页面锁
     */
    getLock: (id: string) => AxiosUtil.post("/storyPage/getLock", { id }),

    /**
     * 释放页面锁
     */
    releaseLock: (id: string) =>
      AxiosUtil.post("/storyPage/releaseLock", { id })
  }
};

export default api;
