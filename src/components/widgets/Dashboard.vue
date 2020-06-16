<template>
  <div class="dash-widget" v-loading="loading" :style="borderStyle">
    <div v-if="loadError" class="error-mask">
      <el-alert
        type="error"
        title="仪表盘暂不可用"
        description="当前仪表盘暂不可用 请稍后重试"
        show-icon
        :closable="false"
      />
    </div>
    <chart-component
      ref="chartComponent"
      v-if="dashboardAvailable"
      :dashboard="dashboardData"
      :analysisdata="analysisResult"
    ></chart-component>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Provide,
  Inject,
  Prop,
  Watch
} from "vue-property-decorator";
import Page from "@/types/EditorPage";
import { widgetConfig, StoryWidget } from "@/types/StoryWidget";
import { WidgetType } from "@/config/WidgetType";
import BorderConfigurable from "./mixins/BorderConfigurable";
import ChartComponent from "glaway-bi-component/src/components/ChartComponent.vue";
import { AnalysisResults } from "glaway-bi-model/types/AnalysisResults";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import ChartUIService from "glaway-bi-component/src/interfaces/ChartUIService";
import { WidgetPageConfig } from "../Widget.vue";
import api from "@/api/common";
import ObjectUtil from "glaway-bi-util/ObjectUtil";

@Component({
  mixins: [BorderConfigurable],
  components: {
    ChartComponent
  }
})
export default class DashboardWidget extends Vue {
  @Prop()
  data!: StoryWidget<widgetConfig.DashboardConf>;

  @Inject()
  widgetConfig!: WidgetPageConfig;

  analysisResult: AnalysisResults | null = null;

  loading = false;
  loadError = false;

  created() {
    this.loading = true;

    this.loadDashboard().finally(() => {
      this.loading = false;
    });
  }

  loadDashboard(): Promise<void> {
    const dashboardId = this.data.config.dashboardId;
    if (!dashboardId) return Promise.reject(new Error("仪表盘ID为空"));

    return api.dashboard
      .findById(dashboardId)
      .then(res => {
        const serialized = res.result;
        if (!serialized) return Promise.reject();

        // 反序列化、赋值
        const dashboard = ObjectUtil.deserialize(serialized);
        this.dashboardData = dashboard;

        // 分析仪表盘数据
        return api.dashboard.analysis(dashboard);
      })
      .then(res => {
        this.analysisResult = res.result;
        this.loadError = false;

        this.$nextTick(() => {
          this.chartComponent?.initChart();
          this.chartComponent?.renderChart();
        });
      })
      .catch(err => {
        this.loadError = true;
      });
  }

  get dashId(): string {
    return this.data.config.dashboardId;
  }

  get dashboardData() {
    return this.data.config.data;
  }

  set dashboardData(data: Dashboard | null) {
    this.data.config.data = data;
  }

  get dashboardAvailable() {
    return this.dashboardData && this.analysisResult;
  }

  get chartComponent(): ChartUIService | null {
    return (this.$refs.chartComponent as any) as ChartUIService;
  }

  /**
   * 图表 Resize
   */
  get dashboardSize() {
    return this.data.config.size;
  }

  get widgetScale() {
    return this.widgetConfig.scale;
  }

  @Watch("widgetScale")
  @Watch("dashboardSize", {
    deep: true
  })
  resizeHook() {
    this.chartComponent?.resizeChart();
  }
}
</script>

<style lang="scss">
@mixin zebraLines($deepColor, $lightColor, $size: 40px, $deg: 135deg) {
  background: linear-gradient(
    $deg,
    #{$deepColor} 25%,
    #{$lightColor} 25%,
    #{$lightColor} 50%,
    #{$deepColor} 50%,
    #{$deepColor} 75%,
    #{$lightColor} 75%,
    #{$lightColor} 0
  );

  background-size: $size $size;
}

.dash-widget {
  .error-mask {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    @include zebraLines(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.02));
    background-color: white;

    .el-alert {
      width: 70%;
      padding: 16px 20px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(8px);

      .el-alert__content {
        padding-left: 14px;

        .el-alert__title {
          font-size: 16px;
        }

        .el-alert__description {
          font-size: 14px;
          margin-top: 8px;
        }
      }
    }
  }
}
</style>
