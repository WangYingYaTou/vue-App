<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count > 0"  @click.stop.prevent="decreaceCart">
        <span class="inner iconfont icon-remove_circle_outlin"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add iconfont icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script>
  import Vue from 'vue';

  export default{
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {};
    },
    methods: {
      addCart: function(event){
        //防止多次被点击
        if(!event._constructed){
          return;
        }
        if(!this.food.count){
          //添加food不存在的字段时，需要调用vue.set方法添加，这样才可以通过vue观测到这个字段的变化
          Vue.set(this.food, 'count', 1);
        }else{
          this.food.count++;
        }
        this.$emit('add', event.target);
      },
      decreaceCart: function(event){
        //防止多次被点击
        if(!event._constructed){
          return;
        }
        if(this.food.count){
          this.food.count--;
        }
      }
    }
  }
</script>