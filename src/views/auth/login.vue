<template>
  <div class="login_page">
    <div></div>
    <div class="login_box">
      <div class="center_box">
        <!-- 登录&注册-->
        <div :class="{login_form: true, rotate: tab == 2}">
          <div :class="{tabs: true, r180: reverse == 2}">
            <div class="fl tab" id="changeLoginTab" @click="changeTab(1)">
              <span :class="{on: tab == 1}">登录</span>
            </div>
            <div class="fl tab" id="changeRegTab" @click="changeTab(2)">
              <span :class="{on: tab == 2}">注册</span>
            </div>
          </div>

          <!-- 登录 -->
          <div v-if="reverse == 1" class="form_body">
            <!-- submit.prevent 阻止默认表单事件提交，采用loginSubmit -->
            <form @submit.prevent="loginSubmit">
              <input v-model="loginData.username" autocomplete="off" placeholder="请输入用户名" type="text">
              <input v-model="loginData.password" autocomplete="off" placeholder="请输入密码" type="password">
              <div class="error_msg">{{ loginMessage }}</div>
              <input v-if="subState" class="btn" disabled="disabled" type="submit" value="登录中···"/>
              <input v-else class="btn" type="submit" value="登录" @submit="loginSubmit"/>
            </form>
          </div>

          <!-- 注册 -->
          <div v-if="reverse == 2" class="form_body r180">
            <form @submit.prevent="regSubmit">
              <input v-model="registerData.username" @change="this.checkUsername" autocomplete="off"
                     placeholder="请输入用户名" type="text">
              <input v-model="registerData.password" autocomplete="off" placeholder="6-30位密码，可用数字/字母/符号组合"
                     type="password">
              <input v-model="registerData.repPassword" placeholder="确认密码" type="password">
              <div class="error_msg">{{ regMessage }}</div>
              <div class="agree">
                <input id="tonyi" v-model="registerData.check" type="checkbox">
                <label for="tonyi">我已经阅读并同意</label><a href="javascript:;" @click="protocol = true">《用户协议》</a>
              </div>
              <input v-if="subState" class="btn" disabled="disabled" type="submit" value="提交中···">
              <input v-else class="btn" type="submit" value="注册">
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户协议 -->
    <div v-if="protocol" class="xieyi" @click.self="protocol = false">
      <div class="xieyi_content">
        <div class="xieyi_title">请认真阅读用户协议</div>
        <div v-if="protocolContent" class="xieyi_body" v-html="protocolContent">
        </div>
        <input class="xieyi_btn" type="button" value="确定" @click="protocol = false">
      </div>
    </div>
  </div>
</template>
<script>
import {isvalidUsername} from '@/utils/validate'
import {getProtocol, register, getUserByUsername} from "@/api/auth";

export default {

  data() {
    return {
      tab: 1, // 高亮当前标签名
      reverse: 1, // 旋转 1 登录，2 注册
      loginMessage: '', //登录错误提示信息
      regMessage: '', //注册错误提示信息
      subState: false, //提交状态
      protocol: false, // 显示隐藏协议内容
      protocolContent: null, // 协议内容
      redirectURL: '//120.77.158.242', // 登录成功后重写向地址
      loginData: { // 登录表单数据
        username: '',
        password: ''
      },
      registerData: { // 注册表单数据
        username: '',
        password: '',
        repPassword: '',
        check: false
      },
    }
  },

  created() {
    const redirectURL = this.$route.query.redirectURL;
    const type = +this.$route.query.type;
    if (type)
      this.changeTab(type);
    if (redirectURL) {
      this.redirectURL = redirectURL;
    }
    this.getProtocolContent();
  },

  methods: {
    async getProtocolContent() {
      this.protocolContent = await getProtocol();
    },
    // 切换标签
    changeTab(int) {
      this.tab = int;
      // let _that = this;
      setTimeout(() => {
        this.reverse = int
      }, 200)
      // console.log(_that);
    },

    // 提交登录
    loginSubmit() {
      if (this.subState) {
        return false;
      }
      if (!isvalidUsername(this.loginData.username)) {
        this.loginMessage = '请输入正确的用户名'
        return false;
      }
      if (this.loginData.password.length < 6) {
        this.loginMessage = '请输入正确的用户名或密码'
        return false;
      }

      this.subState = true;

      this.$store.dispatch('UserLogin', this.loginData).then(response => {
        const {code, message} = response;
        if (code === 20000) {
          //跳转回来源地址
          window.location.href = this.redirectURL;
        } else {
          this.loginMessage = message;
        }
      }).catch(error => {
        this.subState = false;
        console.log(error);
        this.loginMessage = error + '系统繁忙,请稍后重试'
      })
    },

    async checkUsername() {
      console.log("1")
      const {code, message, data} = await getUserByUsername(this.registerData.username);
      if (code !== 20000) {
        this.regMessage = message;
        return false;
      }
      if (data === true) {
        this.regMessage = '用户名已被注册,请重新输入用户名';
        return false;
      }
    },

    // 提交注册
    async regSubmit() {
      if (this.subState) {
        return false;
      }
      const {username, password, repPassword, check} = this.registerData;
      if (!isvalidUsername(username)) {
        this.regMessage = '请输入正确的用户名'
        return false;
      }
      if (password.length < 6 || password.length > 30) {
        this.regMessage = '请输入6-30位密码,区分大小写且不可有空格'
        return false;
      }
      if (!(password === repPassword)) {
        this.regMessage = '两次密码输入不相等'
        return false;
      }

      if (!check) {
        this.regMessage = '请阅读并同意协议'
        return false;
      }

      this.subState = true;
      register(this.registerData).then(response => {
        this.subState = false;
        const {code, message} = response;
        if (code === 20000) {
          this.changeTab(1);
        } else {
          this.regMessage = message;
        }
      }).catch(error => {
        this.subState = false;
        console.log(error)
        this.regMessage = '系统繁忙,请稍后再试';
      });
      // this.$store.dispatch('UserLogin', this.registerData).then(response => {
      //   const {code, message} = response;
      //   if (code === 20000) {
      //     //跳转回来源地址
      //     window.location.href = this.redirectURL;
      //   } else {
      //     this.regMessage = message;
      //   }
      // }).catch(error => {
      //   this.subState = false;
      //   this.regMessage = error+'系统繁忙,请稍后重试'
      // })
    }

  },
}
</script>
<style scoped>
@import '../../assets/style/login.css';
</style>