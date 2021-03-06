<template>
  <div class="wrapper">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">用户登录</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" auto-complete="off" placeholder="账号" type="text">
          <svg-icon slot="prefix" class="el-input__icon input-icon" icon-class="user"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          auto-complete="off"
          placeholder="密码"
          type="password"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" class="el-input__icon input-icon" icon-class="password"/>
        </el-input>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          style="width:100%;"
          type="primary"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { decrypt, encrypt } from '@/utils/jsencrypt'

export default {
  name: 'Login',
  data() {
    return {
      codeUrl: '',
      cookiePassword: '',
      loginForm: {
        username: 'admin',
        password: '123456',
        rememberMe: false,
        code: '',
        uuid: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' }
        ],
        code: [ { required: true, trigger: 'change', message: '验证码不能为空' } ]
      },
      loading: false,
      redirectURL: undefined,
      authStatus: false,
    }
  },
  watch: {
    $route: {
      handler: function ( route ) {
        this.redirectURL = route.query && route.query.redirectURL
      },
      immediate: true
    }
  },
  created() {
  },
  mounted() {
    this.getCookie()
    const { redirectURL } = this.$route.params
    if ( redirectURL ) {
      this.redirectURL = redirectURL
    }
  },
  methods: {
    getCookie() {
      const username = Cookies.get( 'username' )
      const password = Cookies.get( 'password' )
      const rememberMe = Cookies.get( 'rememberMe' )
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt( password ),
        rememberMe: rememberMe === undefined ? false : Boolean( rememberMe )
      }
    },
    handleLogin() {
      const redirectURL = this.redirectURL
      this.$refs.loginForm.validate( valid => {
        if ( valid ) {
          this.loading = true
          if ( this.loginForm.rememberMe ) {
            Cookies.set( 'username', this.loginForm.username, { expires: 30 } )
            Cookies.set( 'password', encrypt( this.loginForm.password ), { expires: 30 } )
            Cookies.set( 'rememberMe', this.loginForm.rememberMe, { expires: 30 } )
          } else {
            Cookies.remove( 'username' )
            Cookies.remove( 'password' )
            Cookies.remove( 'rememberMe' )
          }
          this.$store.dispatch( 'Login', this.loginForm ).then( () => {
            this.loading = false
            if ( redirectURL && redirectURL.length > 0 ) {
              window.location.href = redirectURL
            } else {
              this.$router.push( { path: '/' } ).catch( () => {} )
            }
          } ).catch( () => {
            this.loading = false
          } )
        }
      } )
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  width: 400px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
</style>
