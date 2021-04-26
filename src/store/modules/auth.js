import {login, logout, refreshAuth} from '@/api/auth';
import {Key, PcCookie} from '@/utils/cookie'

const state = {
  userInfo: PcCookie.get(Key.userInfoKey) ? JSON.parse(PcCookie.get(Key.userInfoKey)) : null, //用户信息
  accessToken: PcCookie.get(Key.accessTokenKey), //访问令牌
  refreshToken: PcCookie.get(Key.refreshTokenKey), //刷新令牌，当前访问令牌如果过期了，则通过刷新令牌获取新令牌
};
//改变状态值
const mutations = {
  // 赋值用户状态
  SET_USER_STATE(state, data) {
    const {userInfo, access_token, refresh_token} = data;
    //状态赋值
    state.userInfo = userInfo;
    state.accessToken = access_token;
    state.refreshToken = refresh_token;
    //保存到cookie
    PcCookie.set(Key.userInfoKey, userInfo)
    PcCookie.set(Key.accessTokenKey, access_token)
    PcCookie.set(Key.refreshTokenKey, refresh_token)
  },
  // 重置用户状态
  RESET_USER_STATE(state) {
    state.userInfo = null;
    state.accessToken = null;
    state.refreshToken = null;
    PcCookie.remove(Key.userInfoKey);
    PcCookie.remove(Key.accessTokenKey);
    PcCookie.remove(Key.refreshTokenKey);
  },
}
// 定义行为
const actions = {
  UserLogin({commit}, userData) {
    const {username, password} = userData;

    return new Promise((resolve, reject) => {
      login({username: username.trim(), password: password.trim()}).then(response => {
        const {code, data} = response;
        console.log(response)
        if (code === 20000) {
          commit('SET_USER_STATE', data);
        }
        resolve(response);// 正常响应钩子
      }).catch(error => {
        //重置状态
        commit('RESET_USER_STATE');
        reject(error); //异常响应钩子
      });
    });
  },
  //刷新令牌
  RefreshAuth({state, commit}) {
    return new Promise((resolve, reject) => {
      const refreshToken = state.refreshToken;
      //调用接口
      if (!refreshToken) {
        commit('RESET_USER_STATE');
        reject('没有刷新令牌');
        return
      }
      //发送请求
      refreshAuth(refreshToken).then(response => {
        const {code, message, data} = response;
        if (code === 20000) {
          console.log('获取到的新认证信息', data)
          commit('SET_USER_STATE', data);
          resolve(message);
        }
      }).catch(error => {
        //重置用户状态
        commit('RESET_USER_STATE');
        reject(error);
      });
    });
  },
  //登出
  UserLogout({state, commit}, redirectURL) {
    logout(state.accessToken).then(response => {
      const {code, data} = response;
      if (code === 20000) {
        console.log(data);
        //重置状态
        commit('RESET_USER_STATE');
        //重定向回来源地址
        window.location.href = redirectURL || '/';
      }
    }).catch(error => {
      console.log(error)
      //重置状态
      commit('RESET_USER_STATE');
      //重定向回来源地址
      window.location.href = redirectURL || '/';
    });
  },
}
export default {
  state, mutations, actions
}