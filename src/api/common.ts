import AxiosUtil from "glaway-bi-util/AxiosUtil";

const api = {
  dashboard: {
    findGroups: (parentId: string) =>
      AxiosUtil.get("/dashboard/group/findAll", {
        filter: JSON.stringify({ parentId })
      }),

    findSnapshotByGroupId: (groupId: string) =>
      AxiosUtil.get("/dashboard/findSnapshotByGroupId", { groupId }),

    findById: (id: string) => AxiosUtil.get("/dashboard/findById", { id })
  },

  matelib: {
    findAllDir: (parentId: string) =>
      AxiosUtil.get("/mate/findAllDir", {
        filter: JSON.stringify({ parentId })
      })
  }
};

export default api;
