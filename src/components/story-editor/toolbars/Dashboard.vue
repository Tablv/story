<template>
  <div class="dash-tool-bar">
    <!-- 边框 -->
    <border-style :data="widget.config.border"></border-style>

    <!-- 背景 -->
    <background-style :data="widget.config.background"></background-style>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject } from "vue-property-decorator";
import Page from "@/types/EditorPage";
import { widgetConfig, StoryWidget } from "@/types/StoryWidget";
import { WidgetType } from "@/config/WidgetType";
import BorderStyle from "./common/BorderStyle.vue";
import BackgroundStyle from "./common/BackgroundStyle.vue";

@Component({
  components: {
    BorderStyle,
    BackgroundStyle
  }
})
export default class DashToolBar extends Vue {
  @Inject()
  state!: Page.State;

  get widget(): StoryWidget<widgetConfig.DashboardConf> {
    return this.state.currentWidget as StoryWidget<widgetConfig.DashboardConf>;
  }
}
</script>
