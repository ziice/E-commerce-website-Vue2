//登录、注册模块的小仓库
import { reqGetCode, reqRegister, reqUserLogin, reqUserInfo, reqUserLogout } from '@/api';
let state = {
     //验证码
     code: '',
     //身份标识符很重要【存储在vuex】
     token: localStorage.getItem("TOKEN"),
     //用户名
     nickName: ''
};
let mutations = {
     GETCODE(state, code) {
          state.code = code;
     },
     SET_TOKEN(state, token) {
          state.token = token;
     },
     SET_USERINFO(state, nickName) {
          state.nickName = nickName;
     },
     CLEAR(state) {
          //清除仓库相关用户信息
          state.token = '';
          state.nickName = '';
          //本地存储令牌清空
          localStorage.removeItem('TOKEN');
     }
};
let actions = {
     //获取验证码
     async getCode({ commit, state, dispatch }, phone) {
          let result = await reqGetCode(phone);
          if (result.code == 200) {
               commit('GETCODE', result.data);
               return 'ok';
          } else {
               return Promise.reject(new Error('faile'));
          }
     }
     ,
     //注册用户的地方
     async registerUser({ commit, state, dispatch }, obj) {
          //注册接口没有返回data,不需要提交mutation
          let result = await reqRegister(obj);
          if (result.code == 200) {
               //注册成功
               return 'ok';
          } else {
               //注册失败
               return Promise.reject(new Error(result.message));
          }
     },
     //用户登录
     async userLogin({ commit, state, dispatch }, data) {
          /*
             {
                   code:200,
                   data:{
                        token:'1e4vdadhajkhdakj6sahdajk'
                   },
                   message:'登录成功'
             }
          */
          let result = await reqUserLogin(data);
          //登录成功
          if (result.code == 200) {
               commit('SET_TOKEN', result.data.token);
               localStorage.setItem('TOKEN', result.data.token);
               return 'ok';
          } else {
               return Promise.reject(new Error(result.message));
          }
     },
     //获取用户信息
     async getUserInfo({ commit, state, dispatch }) {
          let result = await reqUserInfo();
          if (result.code == 200) {
               commit('SET_USERINFO', result.data.nickName);
               return 'ok';
          } else {
               return Promise.reject();
          }
     },
     //退出登录的业务
     async logout({ commit, state, dispatch }) {
          //发请求通知服务器销毁当前token【学生证】
          let result = await reqUserLogout();
          if (result.code == 200) {
               commit('CLEAR');
               return 'ok';
          } else {
               return Promise.reject(new Error(result.message));
          }
     }
};
let getters = {};

//对外暴露
export default {
     state,
     mutations,
     actions,
     getters
}
