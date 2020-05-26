<template>
  <!-- 边框 -->
  <el-popover
    placement="bottom"
    width="400"
    trigger="click">
    <el-button slot="reference" icon="fa fa-border-style"></el-button>

    <el-form label-width="80px">
      <el-form-item label="边框">
        <el-switch
          v-model="border.enable"
          active-color="#13ce66"
          @change="toggleBorderEnable"
        ></el-switch>
      </el-form-item>
      
      <div v-if="borderProps">
        <el-form-item label="边框样式">
          <!-- 宽度 -->
          <el-slider
            v-model="borderProps.width"
            class="border-width-slider"
            :min="1"
            :max="10"
          ></el-slider>
        </el-form-item>

        <el-form-item label="边框样式">
          <!-- 样式 -->
          <el-select v-model="borderProps.style" placeholder="请选择">
            <el-option value="dashed">
              <span class=""></span>
            </el-option>
          </el-select>
        </el-form-item>
          
        <el-form-item label="边框颜色">
          <!-- 颜色 -->
          <el-color-picker
            v-model="borderProps.color"
          ></el-color-picker>
        </el-form-item>

      </div>
    </el-form>
  </el-popover>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Page from "@/types/Page";
import { widgetConfig, StoryWidget } from "@/types/StoryWidget";
import { WidgetType } from "@/config/WidgetType";
import { WidgetBuilder } from '../../../../config/WidgetBuilder';

@Component({
  components: {}
})
export default class BorderStyle extends Vue {
  @Prop()
  data!: widgetConfig.Border;

  get border(): widgetConfig.Border {
    return this.data;
  }

  set border(border: widgetConfig.Border) {
    this.$emit("update:data", border);
  }

  get borderProps(): widgetConfig.Border["props"] {
    return this.border.props;
  }
  
  set borderProps(props: widgetConfig.Border["props"]) {
    this.border.props = props;
  }

  toggleBorderEnable(enable: boolean) {
    if (enable && this.borderProps === null) {
      this.borderProps = new WidgetBuilder(null).buildBorder(true).props;
    } else if (!enable && this.borderProps !== null) {
      this.borderProps = null;
    }
  }
}
</script>

<style lang="scss">
$sliderBtnSize: 8px;

.border-width-slider {
  .el-slider__button {
    width: $sliderBtnSize;
    height: $sliderBtnSize;
  }
}
</style>
