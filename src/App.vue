<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import header from './components/header/header.vue';

const ERR_OK = 0;

export default {
  name: 'App',
  components: {
    'v-header': header
  },
  data() {
    return {
      seller: {}
    }
  },
  created() {
    this.$http.get('./api/seller').then((response) => {
      response = response.body;
      if(response.errno === ERR_OK){
        this.seller = response.data;
      }
    });
  }
  
}
</script>
