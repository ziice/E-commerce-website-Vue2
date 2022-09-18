//仓库
import Vuex from 'vuex';
import Vue from 'vue';
//安装插件
Vue.use(Vuex);

//引入小仓库
import home from './home';
import search from './search';
import detail from './detail';
import user from './user';
import shopcart from './shopcart'
import trade from './trade';


//对外暴露仓库
export default new Vuex.Store({
    //大仓库需要注册全部小仓库
    //vuex新增的一个配置项:模块式开发.右侧V也是对象
    modules: {
        home,
        search,
        detail,
        user,
        shopcart,
        trade
    }
})
