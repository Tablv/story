<template>
  <div class="tool-bar-inner text-tool-bar">
    <!-- 字号 -->
    <label class="label-text">字号</label>
    <el-select
      v-model="textFont.size"
      filterable
      allow-create
      default-first-option
      placeholder=""
      style="width: 100px"
    >
      <el-option
        v-for="fontSize in fontSizeOptions"
        :key="fontSize"
        :value="fontSize">
      </el-option>
    </el-select>

    <div class="switch-btn-group">
      <!-- 加粗 -->
      <el-checkbox-group v-model="textFont.bold">
        <el-checkbox-button>
          <i class="fa fa-bold"></i>
        </el-checkbox-button>
      </el-checkbox-group>

      <!-- 斜体 -->
      <el-checkbox-group v-model="textFont.italic">
        <el-checkbox-button>
          <i class="fa fa-italic"></i>
        </el-checkbox-button>
      </el-checkbox-group>

      <!-- 下划线 -->
      <el-checkbox-group v-model="textFont.underline">
        <el-checkbox-button>
          <i class="fa fa-underline"></i>
        </el-checkbox-button>
      </el-checkbox-group>
    </div>

    <!-- 颜色 -->
    <el-color-picker
      class="font-color-picker"
      v-model="textFont.color"
      show-alpha
    ></el-color-picker>

    <!-- 水平对齐 -->
    <el-radio-group v-model="textAlignment.horizontal">
      <!-- 左对齐 -->
      <el-radio-button label="left">
        <i class="fa fa-align-left"></i>
      </el-radio-button>

      <!-- 居中 -->
      <el-radio-button label="center">
        <i class="fa fa-align-center"></i>
      </el-radio-button>

      <!-- 右对齐 -->
      <el-radio-button label="right">
        <i class="fa fa-align-right"></i>
      </el-radio-button>
    </el-radio-group>

    <!-- 垂直对齐 -->
    <el-radio-group v-model="textAlignment.vertical">
      <!-- 上对齐 -->
      <el-radio-button label="top">
        <i class="fa fa-angle-double-up"></i>
      </el-radio-button>

      <!-- 居中 -->
      <el-radio-button label="middle">
        <i class="fa fa-align-justify"></i>
      </el-radio-button>

      <!-- 下对齐 -->
      <el-radio-button label="bottom">
        <i class="fa fa-angle-double-down"></i>
      </el-radio-button>
    </el-radio-group>

    <!-- 边框 -->
    <border-style
      :data="widget.config.border"
    ></border-style>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject } from "vue-property-decorator";
import Page from "@/types/Page";
import { widgetConfig, StoryWidget } from "@/types/StoryWidget";
import { WidgetType } from "@/config/WidgetType";
import BorderStyle from "./common/BorderStyle.vue";

@Component({
  components: {
    BorderStyle
  }
})
export default class TextToolBar extends Vue {
  @Inject()
  state!: Page.State;

  fontSizeOptions = [8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 54, 60, 66, 72, 80, 88, 96, 104, 112, 120, 128, 136, 144, 152, 160, 168, 176, 184, 192];

  get widget(): StoryWidget<widgetConfig.TextArea> {
    return this.state.currentWidget as StoryWidget<widgetConfig.TextArea>;
  }

  get textFont(): widgetConfig.TextArea["font"] {
    return this.widget.config.font;
  }

  get textAlignment(): widgetConfig.TextArea["alignment"] {
    return this.widget.config.alignment;
  }
}
</script>

<style lang="scss">
.text-tool-bar {

  .font-color-picker,
  .switch-btn-group,
  .el-radio-group {
    margin-right: 10px;
  }
  .el-checkbox-group {
    margin-right: 6px;
  }

  .switch-btn-group {
    display: flex;
    margin-left: 10px;

    .el-checkbox-button__inner {
      border-radius: 4px !important;
    }
  }

  .font-color-picker {
    &:hover .el-color-picker__trigger:before {
      color: #409eff;
    }

    .el-color-picker__trigger {
      padding: 0;
      margin-top: 24px;
      height: 6px;

      &:before {
        content: "A";
        position: absolute;
        bottom: 6px;
        text-align: center;
        width: 100%;
        font-size: 16px;
        color: #606266;
        transition: color 0.2s;
      }

      .el-color-picker__color.is-alpha {
        background-image: none;
      }

      .el-color-picker__icon {
        display: none;
      }
    }
  }
}
</style>
