<template>
  <div class="thumbnail-container" :class="{ 'active': isActivePage }">
    <div class="thumbnail-box" :data-page-num="pageNum">
      <el-image
        class="thumbnail-img"
        :src="data.thumbnail"
        fit="cover"
      >
      </el-image>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Inject, Emit } from 'vue-property-decorator';

@Component({})
export default class PageThumbnail extends Vue {
  @Prop()
  data!: any;

  @Inject()
  current!: { index: number };

  get isActivePage() {
    return this.current.index === this.data.index;
  }

  get pageNum() {
    return this.data.index + 1;
  }
}
</script>

<style lang="scss" scoped>
.thumbnail-container {
  position: relative;

  .thumbnail-box {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex-flow: row nowrap;
    margin: 24px 24px 0;

    &::before {
      content: attr(data-page-num);
      position: absolute;
      width: 7px;
      height: 25px;
      line-height: 25px;
      vertical-align: text-bottom;
      bottom: 0px;
      left: 5px;
    }

    .thumbnail-img {
      width: 160px;
      height: 90px;
      border-radius: 4px;
      background-color: #fff;
      box-shadow: 0 1px 4px 2px rgba(0, 0, 0, 0.1);
      border: 2px solid transparent;
    }
  }

  &.active {
    .thumbnail-img {
      border: 2px solid #09f;
    }
  }
}
</style>