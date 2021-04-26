<template>
  <div class="wrapper">
    <el-carousel :interval="4000" type="card" class="chooseApps" >
      <el-carousel-item class="my-carousel-item" v-for="(item,index) in appList" :label="item.desc" :key="index">
        <el-image fit="cover" :src="item.banner" @click="jump(item.url)"/>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>

export default {
  name: 'Apps',
  data() {
    return {
      appList:[
        {
          url:'http://www.gzkaiyu56.cn',
          banner:'http://server.kaiyu.work:9000/test/gzkaiyu56.png',
          desc:'官网'
        },
        {
          url:'http://localhost:1024',
          banner:'http://server.kaiyu.work:9000/test/logo.png',
          desc:'LMS管理系统'
        },
        {
          url:'https://www.baidu.com',
          banner:'http://server.kaiyu.work:9000/test/baidu.png',
          desc:'Baidu'
        },
      ]
    }
  },
  watch: {

  },
  created() {
  },
  mounted() {

  },
  methods: {
    jump(url){
      window.location.href=url;
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
  .chooseApps{
    width: 40%;
  }
}
.my-carousel-item{
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
