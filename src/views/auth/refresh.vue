<template>
  <div>
    <div v-show="visitable">
      <!-- 下面是展示的内容层-->
      <div class="content">
        <span v-html="message"></span>
      </div>
      <div>
        <div class="over">

        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {

  data() {
    return {
      visitable: true,
      message: '请稍等,正在重新进行身份认证...',
      redirectURL: null,
    }
  },
  created() {
    this.redirectURL = this.$route.query.redirectURL || '/';
    console.log(this.redirectURL);
    this.refreshLogin();
  },
  methods: {
    //通过刷新令牌刷新认证信息
    refreshLogin() {
      this.$store.dispatch('RefreshAuth').then(() => {
        //重定向回应用
        this.message = '请稍等,正在重新进行身份认证...';
        window.location.href = this.redirectURL;
      }).catch(() => {
        //刷新失败
        this.message = `您的身份已过期,请点击<a href="/?redirectURL=${this.redirectURL}">重新登录</a>`
      });
    },
  },
}
</script>
<style scoped>
@import '../../assets/style/refresh.css';
</style>