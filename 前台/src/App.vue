<template>
  <div>
    <Header></Header>
    <!-- 路由组件出口的位置:不设置路由组件不知道在哪里显示 -->
    <router-view></router-view>
    <!-- 发现底部的Footer会随着路由的变化进行显示与隐藏 -->
    <Footer v-show="$route.meta.show"></Footer>
    <!-- 分页器务必知道四个条件:total pageSize pageNo pagerCount -->

  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      searchParams: {
        pageNo: 6,
        pageSize: 3,
      },
    };
  },
  mounted() {
    //App的根组件挂载完毕,发一次请求即可，获取商品分类的三级列表数据
    this.$store.dispatch("getCategory");
  }
};
</script>

<style scoped>
</style>
