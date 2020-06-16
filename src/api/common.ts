import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import AxiosUtil from "glaway-bi-util/AxiosUtil";
import ParamsConverter from "glaway-bi-component/src/util/ParamsConverter";

const api = {
  dashboard: {
    findGroups: (parentId: string) =>
      AxiosUtil.get("/dashboard/group/findAll", {
        filter: JSON.stringify({ parentId })
      }),

    findSnapshotByGroupId: (groupId: string) =>
      AxiosUtil.get("/dashboard/findSnapshotByGroupId", { groupId }),

    findById: (id: string) => AxiosUtil.get("/dashboard/findById", { id }),

    analysis: (dashboard: Dashboard) => {
      const dto = ParamsConverter.getAnalysisDTO(dashboard);
      return AxiosUtil.post("/api/adhoc/build", dto, true);
    }
  },

  matelib: {
    findAllDir: (parentId: string) =>
      AxiosUtil.get("/mate/findAllDir", {
        filter: JSON.stringify({ parentId })
      })
  }
};

export default api;
