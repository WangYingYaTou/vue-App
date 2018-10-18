<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left" :class="{'highlight': totalCount > 0}">
          <div class="logo-wrapper">
            <div class="logo">
              <span class="iconfont icon-shopping_cart"></span>
            </div>
            <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
          </div>
          <div class="price">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">{{payDesc}}</div>
        </div>
      </div>
      <div class="ball-container">
        <template v-for="ball in balls">
          <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </template>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food border-1px" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">￥{{food.price * food.count}}</div>
                <div class="cartcontrol-wrapper">
                  <v-cartcontrol @add="addFood" :food="food"></v-cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>


<script>
import BScroll from 'better-scroll';
  import cartcontrol from 'components/cartcontrol/cartcontrol';

  export default{
    props: {
      selectFoods: {
        type: Array,
        default() {
          return [];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    components:{
      'v-cartcontrol': cartcontrol
    }, 
    data() {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true  /*折叠*/
      }
    },
    computed: {
      totalPrice: function(){
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount: function(){
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc: function(){
        if(this.totalPrice === 0){
          return `￥${this.minPrice}元起送`;
        }else if(this.totalPrice < this.minPrice){
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`;
        }else{
          return '去结算';
        }       
      },
      payClass: function(){
        if(this.totalPrice < this.minPrice){
          return 'no-enough';
        }else{
          return 'enough';
        }
      },
      listShow: function(){
        if(!this.totalCount){
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if(show){
          this.$nextTick(() => {
            if(!this.scroll){
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            }else{
              //重新计算高度
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    methods: {
      drop: function(el){
        for(let i=0; i < this.balls.length; i++){
          let ball = this.balls[i];
          if(!ball.show){
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeEnter: function(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            // getBoundingClientRect 这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);

            el.style.display = '';

            el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
            el.style.transform = `translate3d(0, ${y}px, 0)`;

            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
            inner.style.transform = `translate3d(${x}px, 0, 0)`;
          }
        }
      },
      enter: function(el) {
        /* 触发浏览器重绘 */
        let rf = el.offsetHeight;

        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0, 0, 0)';
          el.style.transform = 'translate3d(0, 0, 0)';

          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0, 0, 0)';
          inner.style.transform = 'translate3d(0, 0, 0)';
        });
      },
      afterEnter: function(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
            ball.show = false;
            el.style.display = 'none';
        }
      },
      toggleList: function(){
        if(!this.totalCount){
          return;
        }
        this.fold = !this.fold;
      },
      empty: function(){
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      hideList: function(){
        this.fold = true;
      },
      pay: function(){
        if(this.totalPrice < this.minPrice){
          return;
        }
        window.alert(`支付${this.totalPrice}元`)
      },
      addFood: function(target){
        this.drop(target);
      }

    }
  }
</script>