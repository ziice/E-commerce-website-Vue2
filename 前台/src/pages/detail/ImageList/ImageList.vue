<template>
  <div class="swiper-container" ref="cur">
    <div class="swiper-wrapper">
      <div
        class="swiper-slide"
        v-for="(slide, index) in skuInfo.skuImageList"
        :key="index"
      >
        <img
          :src="slide.imgUrl"
          :class="{ active: currentIndex == index }"
          @click="handler(index)"
        />
      </div>
    </div>
    <div class="swiper-button-next" @click="add"></div>
    <div class="swiper-button-prev" @click="minus"></div>
  </div>
</template>

<script>
import Swiper from "swiper";
import "swiper/css/swiper.min.css";
import { mapGetters } from "vuex";
export default {
  name: "ImageList",
  data() {
    return {
      //控制小图类名的索引值
      currentIndex: 0,
    };
  },
  computed: {
    ...mapGetters(["skuInfo"]),
  },
  watch: {
    skuInfo() {
      //保证数据发生修改,页面结构再次渲染完毕。再初始化Swiper实例
      this.$nextTick(() => {
        //初始化Swiper类的实例
        let mySwiper = new Swiper(this.$refs.cur, {
          //设置轮播图防线
          direction: "horizontal",
          // loop:true,
          // 如果需要前进后退按钮
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          //展示区域同时展示三张图片
          slidesPerView: 3,
          slidesPerGroup:2 // 一次切换几个
        });
      });
    },
  },
  methods: {
    //小图的点击事件
    handler(index) {
      //修改响应式数据存储当前用户点击的索引值
      this.currentIndex = index;
      //全局事件总线，通知兄弟当前图片的索引值
      this.$bus.$emit("sendIndex", index);
    },
    minus() {
      this.currentIndex--;
      if (this.currentIndex <= 0) this.currentIndex = 0;
      this.$bus.$emit("sendIndex", this.currentIndex);
    },
    add() {
      this.currentIndex++;
      if (this.currentIndex >= this.skuInfo.skuImageList.length - 1) {
        this.currentIndex = this.skuInfo.skuImageList.length - 1;
      }
      this.$bus.$emit("sendIndex", this.currentIndex);
    },
  },
};
</script>

<style lang="less" scoped>
.swiper-container {
  height: 56px;
  width: 412px;
  box-sizing: border-box;
  padding: 0 12px;

  .swiper-slide {
    width: 56px;
    height: 56px;

    img {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      padding: 2px;
      width: 50px;
      height: 50px;
      display: block;

      &.active {
        border: 2px solid #f60;
        padding: 1px;
      }
    }
  }

  .swiper-button-next {
    left: auto;
    right: 0;
  }

  .swiper-button-prev {
    left: 0;
    right: auto;
  }

  .swiper-button-next,
  .swiper-button-prev {
    box-sizing: border-box;
    width: 12px;
    height: 56px;
    background: rgb(235, 235, 235);
    border: 1px solid rgb(204, 204, 204);
    top: 0;
    margin-top: 0;
    &::after {
      font-size: 12px;
    }
  }
}
</style>
