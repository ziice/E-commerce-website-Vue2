<template>
  <div class="spec-preview">
    <img :src="bigObj.imgUrl" ref="ori"/>
    <!-- 绑定鼠标移动事件 -->
    <div class="event" @mousemove="handler"></div>
    <div class="big">
      <img :src="bigObj.imgUrl" ref="big" />
    </div>
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Zoom",
  data(){
    return {
      index:0
    }
  },
  computed: {
    ...mapGetters(["skuInfo"]),
    //比如:服务器的数据没有回来,skuInfo空对象,如果空对象.skuImageList->undefined
    skuImageList() {
      return this.skuInfo.skuImageList || [];
    },
    bigObj() {
      return this.skuImageList[this.index] || {};
    },
  },
  methods: {
    handler(e) {
      //获取蒙板
      let mask = this.$refs.mask;
      let big = this.$refs.big;
      let ori = this.$refs.ori;
      //计算蒙板的left|top数值
      let l = e.offsetX - mask.offsetWidth / 2;
      let t = e.offsetY - mask.offsetHeight / 2;
      //约束蒙板的上下左右范围
      if (l < 0) l = 0;
      if (l > ori.offsetWidth - mask.offsetWidth) l = mask.offsetWidth;
      if (t < 0) t = 0;
      if (t > ori.offsetHeight - mask.offsetHeight) t = mask.offsetHeight;
      mask.style.left = l + "px";
      mask.style.top = t + "px";
      big.style.left = -2 * l + "px";
      big.style.top = -2 * t + "px";
    },
  },
  mounted(){
    //接受兄弟组件传递过来的索引值
    this.$bus.$on('sendIndex',(index)=>{
        this.index = index;
    })
  }
};
</script>

<style lang="less">
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
  }

  .event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

  .mask {
    width: 50%;
    height: 50%;
    background-color: rgba(0, 255, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }

  .big {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -1px;
    left: 100%;
    border: 1px solid #aaa;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;

    img {
      width: 200%;
      max-width: 200%;
      height: 200%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .event:hover ~ .mask,
  .event:hover ~ .big {
    display: block;
  }
}
</style>
