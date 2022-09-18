import VueRouter from "vue-router";
import Vue from "vue";

Vue.use(VueRouter);
//引入路由相关的配置项
import routes from './routes'

//引入仓库
import store from '@/store'
//把原型对象的push方法进行保存
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;
//VueRouter.prototype原型对象添加一个方法
//location:路由跳转相关的信息
VueRouter.prototype.push = function (location, resolve, reject) {
    //当前函数this：即为VueRouter类的实例
    //相当于push方法里面this，是windows
    //利用人家push方法实现路由跳转，保证push里面this,应该vueRouter类的实例

    //函数apply与call区别?
    //相同的地方:都可以篡改函数里面this
    //不同的地方:apply传递参数 数组  call传递参数 逗号分割

    if (resolve && reject) {
        //代表真:代表着两个形参接受参数【箭头函数】
        originPush.call(this, location, resolve, reject);
    } else {
        originPush.call(this, location, () => {}, () => {});
    }
}


VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        //代表真:代表着两个形参接受参数【箭头函数】
        originReplace.call(this, location, resolve, reject);
    } else {
        originReplace.call(this, location, () => {
        }, () => {
        });
    }
}

//第二步:暴露VueRouter类的实例
//对外暴露一个路由器,实质是VueRouter类的实例,一个路由器可以管理多个路由
const router = new VueRouter({
    //配置路由
    routes,
    // 使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样。
    //设置滚动条的位置
    scrollBehavior() {
        //滚动行为这个函数,需要有返回值,返回值为一个对象。
        //经常可以设置滚动条x|y位置 [x|y数值的设置一般最小是零]
        return {y: 0};
    }
});

export default router;


//全局守卫:只要项目中有任何路由变化，全局守卫都会进行拦截

//全局守卫:全局前置守卫【访问之前进行触发】

//全局前置守卫
router.beforeEach(async (to, from, next) => {
    //to:去的那个路由的信息
    //from:从那个路由而来的信息
    //next:放行函数
    //第一种：next(),放行函数，放行到它想去的路由
    //第二种:next(path),守卫放行到指定的路由去

    //用户是否登录:取决于仓库里面是否有token
    //每一次路由跳转之前需要用有用户信息在跳转,没有发请求获取用户信息在跳转
    //token
    let hasToken = store.state.user.token;
    //用户信息
    let hasNickName = store.state.user.nickName;
    //用户登录
    if (hasToken) {
        //用户登录了,不能去login
        if (to.path == "/login") {
            next('/home');
        } else {
            //用户登陆了,而且还有用户信息【去的并非是login】
            if (hasNickName) {
                next();
            } else {
                //用户登陆了,但是没有用户信息
                try {
                    //发请求获取用户信息以后再放行
                    await store.dispatch('getUserInfo');
                    next();
                } catch (error) {
                    //用户没有信息，还携带token发请求获取用户信息【失败】
                    //token【认证失效了】
                    //token失效:本地清空数据、服务器的token通知服务器清除
                    await store.dispatch('logout');
                    //回到登录页，重新获取一个新的认证
                    next('/login');
                }
            }
        }
    } else {
        //用户未登录||目前的判断都是放行
        //用户未登录:不能进入/trade、/pay、/paysuccess、/center、/center/myorder  /center/teamorder
        let toPath = to.path;
        if (toPath.indexOf('trade') != -1 || toPath.indexOf('pay') != -1 || toPath.indexOf('center') != -1) {
            // 未登录想去而没去的地址存储在地址栏
            next('/login?redirect=' + toPath);
        } else {
            next();
        }
    }
});


//全局后置守卫,几乎不用
// router.afterEach((to,from)=>{
//   console.log('后置守卫');
// })
