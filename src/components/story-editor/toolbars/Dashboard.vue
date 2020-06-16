<template>
  <div class="dash-tool-bar">
    <!-- 边框 -->
    <border-style :data="widget.config.border"></border-style>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject } from "vue-property-decorator";
import Page from "@/types/EditorPage";
import { widgetConfig, StoryWidget } from "@/types/StoryWidget";
import { WidgetType } from "@/config/WidgetType";
import BorderStyle from "./common/BorderStyle.vue";

@Component({
  components: {
    BorderStyle
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

<style lang="scss">
.dash-tool-bar {
  > * + * {
    margin-left: 10px;
  }
}
</style>
