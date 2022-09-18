<template>
  <div class="type-nav">
    <div class="container">
      <!-- 事件的委派 -->
      <div @mouseleave="leaveHandler" @click="goSearch">
        <h2 class="all" @mouseenter="changeShow">全部商品分类</h2>
        <!--商品分类的地方:虽然刚开始的时候商品分类结构在底部,调整到当前位置，但是页面结构没有太大的变化,因为老师们已经把样式搞定了-->
        <transition name="sort">
          <div class="sort" v-show="show">
            <div class="all-sort-list2">
              <!--一级分类地盘-->
              <div class="item" v-for="(c1, index) in category" :key="c1.categoryId" >
                <h3 @mouseenter="enterHandler(index)" :class="{ active: currentIndex == index }" >
                  <a :data-categoryName="c1.categoryName" :data-category1Id="c1.categoryId" >{{ c1.categoryName }}</a>
                </h3>
                <!-- 通过JS实现动态行内样式，进行二级、三级分类的显示与隐藏(display:none|block切换的) -->
                <div class="item-list clearfix" :style="{ display: currentIndex == index ? 'block' : 'none' }">
                  <!--二级分类-->
                  <div class="subitem" v-for="(c2,index) in c1.categoryChild" :key="c2.categoryId">
                    <dl class="fore">
                      <dt>
                        <a :data-categoryName="c2.categoryName" :data-category2Id="c2.categoryId">{{ c2.categoryName }}</a>
                      </dt>
                      <dd>
                        <!--三级分类-->
                        <em v-for="(c3, index) in c2.categoryChild" :key="c3.categoryId">
                          <a :data-categoryName="c3.categoryName" :data-category3Id="c3.categoryId">{{ c3.categoryName }}</a>
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
//利用辅助函数获取仓库state数据--->mapState
import {mapState} from "vuex";
//mapState辅助函数执行:数组、对象
//底下的这种写法:是将lodash全部API引入,将来项目打包的时候，体积会大一些
// import _ from "lodash";
//引入手段:按需引入
import throttle from "lodash/throttle";

export default {
  name: "TypeNav",
  data() {
    return {
      //利用响应式属性,将来存储用户鼠标进入哪一个一级分类的索引值
      currentIndex: -1,
      show: true, //默认显示
    };
  },
  methods: {
    //鼠标进入的方法
    enterHandler: throttle(function (index) {
      //修改响应式数据
      this.currentIndex = index;
      //用户行为过快,浏览器反应不过来,导致业务丢失!!!!
      // 函数的节流
      // console.log("处理业务" + index);
    }, 10),
    //鼠标移出事件
    leaveHandler() {
      //鼠标移出高亮的效果消失
      this.currentIndex = -1;
      //隐藏商品分类
      //鼠标离开:在search路由下,在修改数据
      if (this.$route.path != "/home") {
        this.show = false;
      }
    },
    //全部商品分类鼠标进入
    changeShow() {
      //鼠标进入:在search路由下,在修改数据
      if (this.$route.path != "/home") {
        this.show = true;
      }
    },
    //将全部的子节点的事件委派给父节点->事件回调就一个
    goSearch(event) {
      //第一个问题:div父节点子元素太多【h3、h2、em、dt、dd、dl...a】？你怎么知道你点击的一定是a
      //第二个问题:要区分一级分类、二级分类、三级分类的a标签【category1Id|category2Id|category2Id】
      let targetNode = event.target;
      //获取触发事件节点的自定义属性【a:data-categoryName】
      let {categoryname, category1id, category2id, category3id} =
          targetNode.dataset;
      //判断点击的是a【不管是1|2|3】
      if (categoryname) {
        //点击只要是a,就是往search模块跳转
        var locations = {
          name: "search",
          query: {categoryName: categoryname},
        };
        //一级分类的a
        if (category1id) {
          locations.query.category1Id = category1id;
        } else if (category2id) {
          //二级分类的a
          locations.query.category2Id = category2id;
        } else {
          //三级分类的a
          locations.query.category3Id = category3id;
        }
        //点击商品分类按钮的时候,如果路径当中携带params参数,需要合并携带给search模块
        if (this.$route.params.keyword) {
          locations.params = this.$route.params;
        }
        //目前商品分类这里携带参数只有query参数
        this.$router.push(locations);
      }
    },
  },
  //不管是Home|Search利用的都是全局组件TypeNav,TypeNav在Home路由与Search路由下状态不一样的。
  //VC身上有$route,知道当前TypeNav处于那个路由下
  mounted() {
    //派发action
    // this.$store.dispatch('getCategory')
    //路由切换的时候,路由组件会被销毁重建【子组件不也是】
    if (this.$route.path != "/home") {
      this.show = false;
    }
  },
  //计算属性
  computed: {
    //数组的写法:目前书写的是大仓库state的K  ...mapState(['home'])
    //对象写法,对象的K,给VC新增的属性
    ...mapState({
      //右侧属性值为箭头函数返回的结果。当使用这个计算属性的时候，右侧函数会立即执行一次
      //箭头函数执行，注入一个参数state->大仓库【包含小仓库】
      category: (state) => state.home.category, //对象简写形式
    }),
  },
};
</script>

<style scoped lang="less">
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }

            &.active {
              background: yellowgreen;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          /*温馨提示:豪哥不想利用样式控制二级、三级分类显示与隐藏,下面的代码进行注释*/
          /* &:hover {
            .item-list {
              display: block;
            }
          }
          */
        }
      }
    }

    /*过渡动画:商品分类 进入阶段*/

    .sort-enter {
      height: 0px;
    }
    // 定义动画时间，速率
    .sort-enter-active {
      transition: all 0.3s;
    }
    // 过渡动画结束
    .sort-enter-to {
      height: 461px;
    }
  }
}
</style>

