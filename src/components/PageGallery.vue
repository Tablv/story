<template>
  <div class="page-gallery-box">
    <div
      class="thumbnail-wrapper"
      v-for="page in pages"
      :key="page.id"
    >
      <page-thumbnail :data="page" @click.native="setCurrentPage(page.index)" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide } from 'vue-property-decorator';
import PageThumbnail from "./PageThumbnail.vue";

@Component({
  components: {
    PageThumbnail
  }
})
export default class PageGallery extends Vue {

  @Provide()
  current = {
    index: 0
  };

  pages: Array<any> = [
    {
      id: "abc",
      index: 0,
      thumbnail: "//www.baidu.com/img/flexible/logo/pc/result.png"
    },
    {
      id: "ab123124c",
      index: 1,
      thumbnail: "//www.baidu.com/img/flexible/logo/pc/result.png"
    }
  ];

  setCurrentPage(index: number) {
    this.current.index = index;
  }

}
</script>

<style lang="scss" scoped>
.page-gallery-box {
  height: 100%;
  
  .thumbnail-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column nowrap;
  }
}
</style>