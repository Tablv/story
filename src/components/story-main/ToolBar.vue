<template>
  <div class="rich-text-bar">
    <div class="rich-text-props">
      
    </div>
    <div class="mask"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject } from 'vue-property-decorator';
import Page from "@/types/Page";

@Component({
  components: {
  }
})
export default class ToolBar extends Vue {

  @Inject()
  state!: Page.State;

  pages: Array<any> = [
    {
      id: "111",
      index: 0,
      thumbnail: "http://127.0.0.1:3364/demo.png"
    },
    {
      id: "222",
      index: 1,
      thumbnail: "http://127.0.0.1:3364/demo.png"
    }
  ];

  setCurrentPage(index: number) {
    this.state.currentIndex = index;
  }

}
</script>

<style lang="scss" scoped>
.page-gallery-box {
  height: 100%;
  user-select: none;
  
  .thumbnail-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column nowrap;
    margin-top: 24px;

    &:last-of-type {
      margin-bottom: 24px;
    }
  }
}
</style>