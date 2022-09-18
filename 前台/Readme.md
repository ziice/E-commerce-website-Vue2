文件夹：
> * node_modules：项目依赖
> * public：放置静态资源（图片）（webpack打包时会原封不动打包到dist文件夹中）
> * src：  
    ①  assets:多个组件共用的静态资源（webpack打包时会当模块打包到JS文件里）  
    ② components：非路由组件或全局组件   
    ③ App.vue：唯一的根组件   
    ④ Main.js：程序的入口文件  
    ⑤ pages/views（自增）：放置路由组件
> * babel.config.js：配置文件（例如ES6翻译为ES5）
> * package.json：项目配置文件
> * package-lock.json：缓存性文件

路由：

> 前端路由：key:url value:组件
> * 组件：  
>   a. 路由组件：Home首页路由、Search搜索路由、login登录路由、Register注册路由，在router中注册，以组件名字使用  
>   b. 非路由组件：Footer【首页、搜索页】、Header【首页、搜索页、登录、注册】，以标签使用
>
> * 不论路由组件还是非路由组件都有以下两个属性:  
>   a. $route:获取路由信息【路径、query、params】  
>   b. $router:编程式导航进行路由跳转【push|replace】
>
> * Footer的显示与隐藏：v-if、v-show   
>   a. 根据$route.path判断  
>   ```<Footer v-show="$route.path === '/home'||$route.path === '/search'"></Footer>```    
>   b. 配置路由的时候，给路由添加路由元信息【meta】  
>   ```meta: {show: true} <Footer v-show="$route.meta.show"></Footer>```
>
> * 路由传参  
>   a. params参数：属于路径的一部分，在配置路由时需要占位，  ``` path: '/search/:keyword'```  
>   b. query参数：不属于路径的一部分，不需要占位，类似于ajax中的queryString /home?k=v&kv=  
>   c. 编程式导航:  
>
>   ​    1.字符串形式：```this.$router.push('/search/'+this.keyword+"?k="+this.keyword.toUpperCase());```
>
>   ​    2.模板字符串形式：```this.$route.push(`/search/${this.keyword}?k=${this.keyword.toUpperCase()}`)```  
>
>   ​    3.对象形式：
>
>   ​     ```this.$route.push({name:'search',params:{keyword:this.keyword},query:{k:this.keyword.toUpperCase()}})``` 
>
>   d. 声明式导航：router-link(to )
>   e. 注：   
>       ① 路由传递参数（对象写法）path不能结合params参数一起使用：  
>     ```this.$router.push({path:'/search',params:{keyword:this.keyword},query:{k:this.keyword.toUpperCase()}})```         	② 若路由要求传递params参数，没传导致URL出现问题：  
>       ```this.$router.push({name:'search',query:{k:this.keyword.toUpperCase()}})```  
>       ```错误：http://127.0.0.1:8080/#/?k=APP 正确：http://127.0.0.1:8080/#/search?k=APP```  
>       指定params参数可传可不传：配置路由时，在占位的后面加上一个问号：  
>       ``` path: '/search/:keyword?'```  
>       ③ params参数传递是空串：  
>       ```this.$router.push({name:'search',params:{keyword:''},query:{k:this.keyword.toUpperCase()}})```  
>       ```错误：http://127.0.0.1:8080/#/?k= 正确：http://127.0.0.1:8080/#/search?k=```  
>       使用undefined:  
>       ```params:{keyword:''||undefined}```  
>       ④ 路由组件可以传递props数据：  布尔值写法：只能传递params参数```props:true```  
>
>   ​                                                                对象写法：额外给路由传递一些props```props:{a:1,b:2}```  
>
>   ​                                                                函数写法：params、query
>
>   ​                                                              ```props:($route)=>{return {keyword:$route.params.keyword,k:$route.query.k}}```     	⑤ 编程式路由跳转到当前路由（参数不变），多次执行会抛出NavigationDuplicated警告错误，声明式导航没有该问题（vue-router底层已经处理好）:  
>
>   1. 给push传入成功和失败的回调函数，可以捕获到当前的错误（治标不治本，在别的组件中push|replace，编程式导航仍有错误 ） ```() => {}, (error) => {console.log(error)}```  
>
>   2. this：当前组件实例；this.$router属性：当前这个属性，属性值是VueRouter类的一个实例，当在入口文件注册路由时，给组件实例添加$route|$router属性；push：VueRouter类的一个实例：是原型对象的方法

>    ```
>  // 先把VueRouter原型对象的push保存  
>  let originPush = VueRouter.prototype.push;
>   // 重写push|replace 第一个参数：告诉原来的push方法往哪里跳
>   VueRouter.prototype.push = function (location,resolve,reject){
>       if(resolve&&reject){
>           // call和apply：都可以篡改函数的上下文一次，call传递参数用逗号隔开，apply方法执行传递数组
>           originPush.call(this,location,resolve,reject)
>       }else{
>           originPush.call(this,location,()=>{},()=>{})
>     }
>   }
>    ```

三级联动

> 注册为全局组件：```Vue.component(组件.name，组件)```

axios二次封装

> * 请求、响应拦截器前后处理一些业务
>
>   ```
>   let requests = axios.create({
>       //基础路径,发请求URL携带api
>       baseURL: "/api",
>       //超时的设置
>       timeout: 5000
>   });
>   requests.interceptors.request.use(config => {});
>   requests.interceptors.response.use((res) => {
>       return res.data;
>   }, (err) => {
>       alert(err.message);
>       // return new Promise();
>       return Promise.reject(new Error('faile'))
>   });
>   ```
>
> * 跨域问题：  
>   协议、域名、端口号不同
>   JSONP、CORS
>
>   代理
>
>   ```
>   devServer: {
>     proxy: {
>       "/api": {
>         target: "http://gmall-h5-api.atguigu.cn",
>       },
>     },
>   },
>   ```

vuex状态管理库
> * vuex:  
>   官方提供一个插件，状态管理库，集中式管理项目中组件共用的数据
>
> * state：存放数据，状态
>
> * mutations：唯一修改state
>
> * actions：处理action，书写业务逻辑，处理异步
>
> * getters：计算属性，用于简化仓库数据，组件获取仓库数据更方便
>
> * 模块式开发 ：modules:{小仓库，小仓库。。。}
>
> * 组件实例：$store
>
>   ```
>   import {mapState} from 'vuex'
>   // 数组写法
>   computed:{...mapState(['count'])}
>               
>   this.$store.dispatch('add')
>               
>   const actions={add({commit}){commit('ADD',count)}}
>   const mututions={ADD(state,count){state.count=count}}
>   const state={count:1}
>               
>   // 对象写法
>   //右侧属性值为箭头函数返回的结果。当使用这个计算属性的时候，右侧函数会立即执行一次
>   computed:{...mapState({categoryList:(state)=>state.home.categoryList})}
>   ```

防抖、节流

> * 正常：事件触发频繁，且每次触发，回调函数都要执行（若时间很短，而回调函数内部有计算，那么很可能出现浏览器卡顿）
>
> * 防抖：前面的所有触发都被取消，最后一次执行在规定时间之后才触发，快速连续触发只执行一次
>
> * 节流：规定的间隔时间范围内不会重复触发回调，只有大于这个时间间隔才会触发回调，把频发触发变为少量触发
>
> * lodash插件：里面封装函数的防抖和节流【闭包+延时器】，暴露函数对象_
>
>   ​                        import _ from 'lodash'
>
>   ​                        _.debounce(function(){},1000) 防抖
>
>   ​                        _.throttle(function(){},1000)节流

三级联动组件的路由跳转与传递参数

> * 若使用声明式导航router-link，出现卡顿，因为是一个组件，当服务器数据返回后会循环很多router-link组件
>
> * 若使用编程式导航，循环过多多次绑定事件回调
>
> * 编程式导航+事件委派 （判断点击a标签，如何获取参数）
>
>   1. 判断点击a标签
>
>   ​       把子节点中的a标签，加上自定义属性data-categoryName
>
>   ​	   let ele = event.target 获取当前触发这个事件的节点[h3,a,dt,dl]，需要带有自定义属性的元素[一定是a]
>
>   ​       let {categoryname} = ele.dataset节点的dataset属性获取节点的自定义属性和值
>
>   ​	   区分1，2，3级标签：data-category1Id
>
>   2. 如何获取参数
>
>      ```
>      let {categoryname, category1id, category2id, category3id} = targetNode.dataset;
>      var locations = { name: "search",
>                query: {categoryName: categoryname}};
>      locations.query.category1Id = category1id;
>      locations.params = this.$route.params;
>      this.$router.push(locations);
>      ```

过渡动画：

> * 前提组件或元素必须有v-if或v-show
>
>   ```
>   <transition name="sort"></transition>
>      .sort-enter {
>         height: 0px;
>       }
>       // 定义动画时间，速率
>       .sort-enter-active {
>         transition: all 0.3s;
>       }
>       // 过渡动画结束
>       .sort-enter-to {
>         height: 461px;
>       }
>   ```

合并params和query参数

mockjs假数据：生成随机数据，拦截ajax请求

> * 准备JSON数据
>
> * mock数据需要的图片放入public文件夹
>
> * 创建mockSerer.js通过mockjs插件实现模拟数据
>
>   ```
>   Mock.mock("/mock/banner", { code: 200, data: banner });
>   ```

webpack默认对外暴露：图片、JSON数据格式

轮播图-swiper

> * 引入css js包
>
>   ```
>   import Swiper from "swiper";
>   import "swiper/css/swiper.min.css";
>   ```
>
> * 引入页面结构
>
>   ```
>   <div class="swiper-container" ref="mySwiper">
>   	<!-- swiper-wrapper里面每一个slider即为一张图片 -->
>   	<div class="swiper-wrapper">
>       	<div class="swiper-slide" v-for="(item, index) in bannerList" :key="item.id">
>       		<img :src="item.imgUrl"/>
>       	</div>
>       </div>
>       <!-- 如果需要分页器 -->
>       <div class="swiper-pagination"></div>
>   	<!-- 如果需要导航按钮 -->
>       <div class="swiper-button-prev"></div>
>       <div class="swiper-button-next"></div>
>   </div>
>   ```
>
> * 轮播图添加动态效果 new Swiper
>
>   ```
>   setTimeout(() => {
>   	//初始化Swiper类的实例
>       var mySwiper = new Swiper(this.$refs.mySwiper, {
>           //设置轮播图方向
>           direction: "horizontal",
>           //开启循环模式
>           loop: true,
>           // 如果需要分页器
>           pagination: {
>             el: ".swiper-pagination",
>             //分页器类型
>             type: "bullets",
>             //点击分页器，切换轮播
>             clickable: true,
>           },
>           //自动轮播
>           autoplay: {
>             delay: 1000,
>             //新版本的写法：目前是5版本
>             // pauseOnMouseEnter: true,
>             //如果设置为true，当切换到最后一个slide时停止自动切换
>             stopOnLastSlide: true,
>             //用户操作swiper之后，是否禁止autoplay
>             disableOnInteraction: false,
>           },
>           // 如果需要前进后退按钮
>           navigation: {
>             nextEl: ".swiper-button-next",
>             prevEl: ".swiper-button-prev",
>           },
>           //切换效果
>           // effect: "cube",
>         });
>           
>         //1:swiper插件,对外暴露一个Swiper构造函数
>         //2:Swiper构造函数需要传递参数 1、结构总根节点CSS选择器|根节点真实DOM节点  2、轮播图配置项
>         //鼠标进入停止轮播
>         mySwiper.el.onmouseover = function () {
>           mySwiper.autoplay.stop();
>         };
>         //鼠标离开开始轮播
>         mySwiper.el.onmouseout = function () {
>           mySwiper.autoplay.start();
>         };
>       }, 2000);
>   ```
>   
>   * 操作不能放在mounted中，因为派发action中存在await async请求异步：
>   
>   ​        可以设置settimeout(延时加载出点击分页器)
>   
>   ​        updated（响应式数据更新则执行）
>   
>   ​        watch:nextTick：在下次DOM更新循环结束后执行延迟回调，在修改数据之后立即使用这个方法，获取更新后的DOM
>   
>   ```
>   this.$nextTick(() => {
>   	//初始化Swiper类的实例
>       var mySwiper = new Swiper(this.$refs.mySwiper, {...})}
>   ```
>   
>   * floor和listContainer区别：floor轮播图数据从父亲来，所以可以在mounted中写，且值没有发生过变化
>   * 把首页当中轮播图拆分为一个共用组件

模块流程：

> * 静态页面+静态组件拆分出来
> * 接口发请求
> * vuex
> * 组件获取仓库数据，动态展示数据

getters{}

> ```
> ...mapGetters(["goodsList"])
> 
>  goodsList(state) {
>           return state.searchList.goodsList;
>      },
> ```

Object.assign():合并对象

监听路由的变化重新发起请求

> watch:{
>
> ​	$route():{}
>
> }

动态开发面包屑

> 分类面包屑(品牌、商品属性)
>
> 关键字面包屑

排序（后台）

> * 综合1，价格2（升序esc、降序desc）
>
>   1:desc（降序）

优化

> * 按需加载
> * 三级列表请求一次，放在app根组件的mounted中
> * 图片懒加载
> * 分页器

分页器

> * 解决卡顿
>
> * pageNo
>
> * pageSize
>
> * total
>
> * continues:连续页码个数，需计算起始和结束页码
>
>   ```
>   startAndEnd() {
>         //算出连续页码:开始与结束这两个数字
>         let start = 0,
>           end = 0;
>         const { totalPage, pagerCount, pageNo } = this;
>         //特殊情况:总共页数小于连续页码数
>         if (totalPage < pagerCount) {
>           start = 1;
>           end = totalPage;
>         } else {
>           //正常情况：分页器总页数大于连续页码数
>           start = pageNo - parseInt(pagerCount / 2);
>           end = pageNo + parseInt(pagerCount / 2);
>           //约束start|end在合理范围之内
>           //约束头部
>           if (start < 1) {
>             start = 1;
>             end = pagerCount;
>           }
>           //约束尾部
>           if (end > totalPage) {
>             end = totalPage;
>             start = totalPage - pagerCount + 1;
>           }
>         }
>         return { start, end };
>         
>         
>   <div class="pagination">
>       <button @click="$emit('currentPage',pageNo - 1)" :disabled="pageNo==1">上一页</button>
>       <button v-if="startAndEnd.start > 1" @click="$emit('currentPage',1)">1</button>
>       <button v-if="startAndEnd.start > 2">.....</button>
>       
>       <!-- 中间连续页码的地方:v-for、数组、对象、数字、字符串 -->
>       <button v-for="page in startAndEnd.end" :key="page" v-if="page >= startAndEnd.start" @click="$emit('currentPage',page)" :class="{active:pageNo==page}">{{ page }}</button>
>                   
>       <button v-if="startAndEnd.end < totalPage - 1 ">......</button>
>       <button v-if="startAndEnd.end < totalPage" @click="$emit('currentPage',totalPage)">{{ totalPage }}</button>
>                   
>       <button  @click="$emit('currentPage',pageNo + 1)" :disabled="pageNo==totalPage">下一页</button>
>                   
>       <button style="margin-left: 30px">共 {{ total }} 条</button>
>     </div>
>   ```

滚动行为

> 使用前端路由，当切换到新路由时，想要页面滚到顶部，或者保持原先的滚动位置，就像重新加载页面一样，vue-router可以做到。
>
> ```
> const router = new VueRouter({
>     //配置路由
>     routes,
>     //设置滚动条的位置
>     scrollBehavior() {
>         //滚动行为这个函数,需要有返回值,返回值为一个对象。
>         //经常可以设置滚动条x|y位置 [x|y数值的设置一般最小是零]
>         return {y: 0};
>     }
> });
> ```

放大镜

> ```
>     handler(e) {
>       //获取蒙板
>       let mask = this.$refs.mask;
>       let big = this.$refs.big;
>       let ori = this.$refs.ori;
>       //计算蒙板的left|top数值
>       let l = e.offsetX - mask.offsetWidth / 2;
>       let t = e.offsetY - mask.offsetHeight / 2;
>       //约束蒙板的上下左右范围
>       if (l < 0) l = 0;
>       if (l > ori.offsetWidth - mask.offsetWidth) l = mask.offsetWidth;
>       if (t < 0) t = 0;
>       if (t > ori.offsetHeight - mask.offsetHeight) t = mask.offsetHeight;
>       mask.style.left = l + "px";
>       mask.style.top = t + "px";
>       big.style.left = -2 * l + "px";
>       big.style.top = -2 * t + "px";
>     },
> ```

加入购物车

> 路由跳转前发请求
>
> 路由跳转后：会话存储
>
> （简单数据通过query形式给路由组件传递，复杂数据通过会话存储，然而一般存储字符串，不能存储对象）
>
> ```
> sessionStorage.setItem('SKUINFO',JSON.stringify(this.skuInfo));
> info:JSON.parse(sessionStorage.getItem('SKUINFO'))||{}
> ```

uuid 游客身份：点击加入购物车时，通过请求头给服务器带临时身份给服务器，存储某一个用户购物车数据会话存储

```
//利用uuid生成未登录用户临时标识符
import { v4 as uuidv4 } from 'uuid';
//封装函数:只能生成一次用户临时身份
let userId;
export const SET_USERID = () => {
    userId = localStorage.getItem('USERTEMPID');
    if (!userId) {
        userId = uuidv4();
        localStorage.setItem('USERTEMPID', userId);
    }
    return userId;
}

requests.interceptors.request.use(config => {
    //请求拦截器:请求头【header】,请求头能否给服务器携带参数
    if (store.state.shopcart.USER_ID) {
        config.headers.userTempId = store.state.shopcart.USER_ID;
    }
```

购物车

> * 购物车商品总价
>
>   ```
>   totalPrice() {
>     return this.cartInfoList.reduce((a, b) => a + b.skuPrice * b.skuNum, 0);
>   },
>   totalPrice() {
>     let sum = 0
>     this.cartInfoList.forEach(item=>{sum+=item.skuNum*item.skuPrice})
>     return sum
>   }
>   ```
>
> * 全选按钮
>
>   ```
>   isCartChecked(){
>   	return this.cartInfoList.filter(item=>item.isChecked=='1').length===this.cartInfoList.length;
>   	return this.cartInfoList.every(item=>item.isChecked===1)
>   }
>   ```
>
> * 修改数量
>
>   ```
>   //修改商品数据->加的操作
>   addSkuNum:throttle(async function (cart) {
>     //整理参数
>     let params = { skuId: cart.skuId, skuNum: 1 };
>     //发请求:通知服务器修改当前商品的个数
>     //再次获取购物车的最新的数据：保证这次修改数据完毕【成功以后在获取购物车数据】
>     try {
>       //修改商品个数成功
>       await this.$store.dispatch("addOrUpdateCart", params);
>       //再次获取最新的购物车的数据
>       this.getData();
>     } catch (error) {
>       alert("修改数量失败");
>     }
>   },2000)
>   
>   changeSkuNum: debounce(async function (cart, e) {
>      //整理参数
>      let params = { skuId: cart.skuId };
>      //计算出SkuNum携带的数据
>      let userResultValue = e.target.value * 1;
>      //用户输入完毕，最终结果【非法条件】
>      if (isNaN(userResultValue) || userResultValue < 1) {
>        params.skuNum = 0;
>      } else {
>        //正常情况
>        params.skuNum = parseInt(userResultValue) - cart.skuNum;
>      }
>      //发请求：修改商品的个数
>      try {
>         //修改商品的个数、成功以后再次获取购物车的数据
>         await this.$store.dispatch("addOrUpdateCart", params);
>         this.getData();
>         } catch (error) {
>           alert("修改数量失败");
>      }
>   }, 500),
>   ```
>
> * 修改某一个商品勾选状态
>
>   ```
>   //修改某一个商品的勾选的状态
>   async changeChecked(cart, e) {
>     //整理参数
>     let params = {
>       skuId: cart.skuId,
>       isChecked: e.target.checked ? "1" : "0",
>     };
>     //发请求:修改商品的勾选的状态
>     try {
>       await this.$store.dispatch("changeChecked", params);
>       this.getData();
>     } catch (error) {
>       alert(error.message)
>     }
>   },
>   ```
>
> * 删除单个商品
>
>   ```
>   //删除某一个商品
>   async deleteCartById(cart) {
>     //整理参数
>     let skuId = cart.skuId;
>     try {
>       //删除商品成功
>       await this.$store.dispatch("deleteCartById", skuId);
>       //再次获取购物车最新的数据
>       this.getData();
>     } catch (error) {
>       alert("删除失败");
>     }
>   }
>   ```
>
> * 全选
>
>   ```
>   //全选的业务
>   async updateAllChecked(e) {
>     //获取全选的复选框勾选的状态,接口需要的1|0
>     let isChecked = e.target.checked ? "1" : "0";
>     try {
>       //await等待成功:购物车全部商品勾选状态成功以后
>       await this.$store.dispatch("allUpdateChecked", isChecked);
>       this.getData();
>     } catch (error) {
>       alert('修改失败');
>     }
>   },
>   
>   //修改全部商品的勾选的状态
>        allUpdateChecked({ commit, state, dispatch }, isChecked) {
>             let arr = [];
>             //获取购物车商品的个数,进行遍历
>             state.shopCartInfo[0].cartInfoList.forEach(item => {
>                  //调用修改某一个商品的action【四次】
>                  let ps = dispatch("changeChecked", { skuId: item.skuId, isChecked });
>                  arr.push(ps);
>             })
>             //Promise.all():参数需要的是一个数组【数组里面需要promise】
>             //Promise.all()执行一次,返回的是一个Promise对象,Promise对象状态：成功、失败取决于什么?
>             //成功、还是失败取决于数组里面的promise状态:四个都成功、返回成功Promise、只要有一个失败、返回Promise失败状态！！！
>             return Promise.all(arr);
>        },
>   ```
>
> * 删除选中的商品
>
>   ```
>   //删除选中的商品
>       async deleteAllCart(){
>          try {
>            //等待全部勾选商品删除以后
>            await this.$store.dispatch('deleteAllCart');
>            //再次获取购物车的数据
>            this.getData();
>          } catch (error) {
>            alert('删除失败');
>          }
>       }
>           
>   //删除选中的商品
>   deleteAllCart({ commit, state, dispatch }) {
>        let arr = [];
>        //获取仓库里面购物车的数据
>        state.shopCartInfo[0].cartInfoList.forEach(item => {
>             //商品的勾选状态是勾选的,发请求一个一个删除
>             if (item.isChecked == 1) {
>                  let ps = dispatch('deleteCartById', item.skuId);
>                  arr.push(ps);
>             }
>        })
>        return Promise.all(arr); // 每一个都是Promise对象，若有一个失败，则失败，否则成功
>   }
>   ```

登录、注册

css中 ~@是src别名

> * Token令牌：登陆成功，服务器下发token，本地存储token，带着token访问服务器信息
>
> * VUEX仓库数据不是持久化存储
>
>   问题：
>
> * 多个组件展示用户信息需要在每一个组件的mounted中触发，获取用户信息：在哪里派发？
>
> * 用户已经登录了，就不应该回登录页
>
> * 导航守卫：全局守卫（项目路由发生变化触发：前置、解析、后置）、路由独享守卫、组件内守卫
>
>   全局守卫：
>   
>   router.beforeEach(async (to, from, next) => {
>       //to:去的那个路由的信息
>       //from:从那个路由而来的信息
>       //next:放行函数
>       //第一种：next(),放行函数，放行到它想去的路由
>       //第二种:next(path),守卫放行到指定的路由去
>   
>       //用户是否登录:取决于仓库里面是否有token
>       //每一次路由跳转之前需要用有用户信息在跳转,没有发请求获取用户信息在跳转
>       //token
>       let hasToken = store.state.user.token;
>       //用户信息
>       let hasNickName = store.state.user.nickName;
>       //用户登录
>       if (hasToken) {
>           //用户登录了,不能去login
>           if (to.path == "/login") {
>               next('/home');
>           } else {
>               //用户登陆了,而且还有用户信息【去的并非是login】
>               if (hasNickName) {
>                   next();
>               } else {
>                   //用户登陆了,但是没有用户信息
>                   try {
>                       //发请求获取用户信息以后再放行
>                       await store.dispatch('getUserInfo');
>                       next();
>                   } catch (error) {
>                       //用户没有信息，还携带token发请求获取用户信息【失败】
>                       //token【认证失效了】
>                       //token失效:本地清空数据、服务器的token通知服务器清除
>                       await store.dispatch('logout');
>                       //回到登录页，重新获取一个新的认证
>                       next('/login');
>                   }
>               }
>           }
>       } else {
>           //用户未登录||目前的判断都是放行
>           //用户未登录:不能进入/trade、/pay、/paysuccess、/center、/center/myorder  /center/teamorder
>           let toPath = to.path;
>           if (toPath.indexOf('trade') != -1 || toPath.indexOf('pay') != -1 || toPath.indexOf('center') != -1) {
>               next('/login?redirect=' + toPath);
>           } else {
>               next();
>           }
>       }
>   
>   路由独享守卫：
>   
>   ```
>   {
>           path: '/pay',
>           component: Pay,
>           meta: {show: true},
>           beforeEnter:(to,from,next)=>{
>               if(from.path=='/trade'){
>                   next();
>               }
>               else{
>                   next(false); //next(false)：中断当前导航，若url改变，url地址会重置到from路由对应的地址
>               }
>           }
>       },
>   ```
>   
>   组件内守卫：
>   
>   ```
>       // 在渲染该组件的对应路由被confirm前调用，不能获取组件实例this，因为当守卫执行前，组件实例还没有被创建
>       beforeRouteEnter(to,from,next){
>         if(from.path=='/pay'){
>           next();
>         }else{
>           next(false);
>         }
>       },
>       // 在当前路由改变，但是该组件被复用时调用，例如当一个带有动态参数的路径/foo/:id,在/foo/1和/foo/2之间跳转，会渲染同样的Foo组件，因此组件实例会被复用，可以访问组件实例this
>       beforeUpdate() {
>       
>       },
>       // 导航离开组件的对应路由时调用，可以访问组件实例this
>       beforeRouteLeave(to,from,next){
>         next()
>       }
>   ```

账号：13700000000 密码：111111

生成二维码插件：qrcode

> ```
> async open() {
>   //生成一个二维码URL
>   let url = await QRCode.toDataURL(this.payInfo.codeUrl);
>   //第一个参数:即为内容区域
>   //第二个参数:标题
>   //第三个参数:组件的配置项
>   this.$alert(`<img src=${url}>`, "请你微信扫码支付", {
>     dangerouslyUseHTMLString: true, //将字符串转换为标签
>     center: true, //居中
>     showClose: false, //右上角的关闭按钮不显示
>     confirmButtonText: "支付成功", //确定按钮的文本
>     showCancelButton: true, //显示取消按钮
>     cancelButtonText: "支付遇见问题", //取消按钮的文本
>     closeOnClickModal: true, //点击遮罩层关闭messagebox
>     beforeClose: (action, instance, done) => { //在消息盒子关闭之前会触发
>       //action参数:可以区分用户点击的是取消【cancel】、确定【confirm】
>       //instance参数:当前消息框组件VC
>       //done参数：是一个函数,函数可以关闭消息盒子
>       // if (action == 'confirm' && this.code == 200) {
>       if (action == 'confirm') {
>         //清除定时器
>         clearInterval(this.timer);
>         this.timer = null;
>         //关闭盒子
>         done();
>         //路由跳转
>         this.$router.push('/paysuccess');
>       } else if (action == 'cancel' && this.code != 200) {
>         //清除定时器
>         clearInterval(this.timer);
>         this.timer = null;
>         //关闭盒子
>         done();
>         this.$message.error('支付遇见问题请联系超管');
>       }
>     }
>   });
>   //查询支付结果,开启定时器每隔一段时间询问支付结果
>   this.timer = setInterval(async () => {
>     //发请求获取支付结果
>     let result = await this.$http.reqPayResult(this.payInfo.orderId);
>     //返回数据当中：code=200代表支付成功  code=205未支付
>     if (result.code == 200) {
>       //支付成功了
>       //存储一下支付成功的code数值，通过它判断支付是否成功
>       this.code = result.code;
>       //清除定时器
>       clearInterval(this.timer);
>       //关闭messagebox
>       this.$msgbox.close();
>       //在路由跳转
>       this.$router.push('/paySuccess');
>     } else {
>       //未支付
>       this.code = result.code;
>     }
>   }, 1000);
> },
> ```

我的订单

> 二级目录：
>
> ```
> {
>     path: '/center',
>     component: Center,
>     meta: {show: true},
>     //二级路由配置的地方
>     children: [
>         //我的订单
>         {
>             path: 'myorder',
>             component: MyOrder
>         },
>         {
>             path: 'teamorder',
>             component: TeamOrder
>         },
>         {
>             path: '/center',
>             redirect: '/center/myorder'
>         }
>     ]
> },
> ```

图片懒加载

> * vue-lazyload
>
>   ```
>   <img v-lazy="good.defaultImg" />
>       
>   import Vuelazyload from 'vue-lazyload';
>   import a from '@/assets/default.gif';
>   Vue.use(Vuelazyload,{
>       loading:a
>   })
>   ```

vee-validate表单验证：

> ```
> // vee-validate表单验证插件
> import Vue from 'Vue';
> import VeeValidate from 'vee-validate'
> Vue.use(VeeValidate)
> // 中文提示信息
> import zh_CN from 'vee-validate/dist/locale/zh_CN'
> VeeValidate.Validator.localize('zh_CN', {
>     messages: {
>         ...zh_CN.messages,
>         is: (field) => `${field}必须与密码相同` // 修改内置规则的 message，让确认密码和密码相同
>     },
>     attributes: { // 给校验的 field 属性名映射中文名称
>         phone: '手机号',
>         code: '验证码',
>         password:'密码',
>         password1:'确认密码',
>         agree:'协议'
>     }
> })
> //自定义校验规则
> //定义协议必须打勾同意
> VeeValidate.Validator.extend('tongyi', {
>     validate: value => {
>         return value
>     },
>     getMessage: field => field + '必须同意'
> })
> 
> <!-- 登录密码 -->
>       <div class="content">
>         <label>登录密码:</label>
>         <!--<input type="password" placeholder="请输入你的登录密码" v-model="password"/>-->
>         <input
>             type="password"
>             placeholder="请输入你的登录密码"
>             v-model="password"
>             name="password"
>             v-validate="{ required: true, regex: /^[0-9A-Za-z]{8,20}$/ }"
>             :class="{ invalid: errors.has('password') }"
>         />
>         <!--<span class="error-msg">错误提示信息</span>-->
>         <span class="error-msg">{{ errors.first("password") }}</span>
>       </div>
>       <!-- 确认密码 -->
>       <div class="content">
>         <label>确认密码:</label>
>         <input
>             type="password"
>             placeholder="请输入确认密码"
>             v-model="password1"
>             name="password1"
>             v-validate="{ required: true, is:password }"
>             :class="{ invalid: errors.has('password1') }"
>         />
>         <!--<input type="password" placeholder="请输入确认密码" v-model="password1"/>-->
>         <!--<span class="error-msg">错误提示信息</span>-->
>         <span class="error-msg">{{ errors.first("password1") }}</span>
>       </div>
>       <!-- 勾选协议 -->
>       <div class="controls">
>         <input name="agree"
>                type="checkbox"
>                v-model="agree"
>                v-validate="{ required: true, 'tongyi':true }"
>                :class="{ invalid: errors.has('agree') }"/>
>         <span>同意协议并注册《尚品汇用户协议》</span>
>         <span class="error-msg">{{ errors.first("agree") }}</span>
>       </div>
>       
>       
> const success = await this.$validator.validateAll(); //全部表单验证
> if(success){}
> ```

路由懒加载

> 当打包构建应用时，js包很大，影响页面加载，若能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，结合VUE的异步组件和webpack的代码分割功能实现
>
> ```
> component: ()=>{
>     return import('@/pages/register')
> },
> ```

打包上限：

> 打包 npm run build
>
> 项目打包后，代码都是经过压缩加密的，若运行报错，输出的错误信息无法准确得知是哪里的代码报错
>
> map像未加密的代码一样，准确输出哪一行那一列有错，所以该文件打包可以去掉
>
> vue.config.js:productionSourceMap:false

ngnix

> 高性能的HTTP和反向代理web服务器

组件通信：

> 
