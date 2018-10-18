<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item" :class="{'current' : currentIndex === index}" @click="selectMenu(index,$event)">
          <span class="text">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="(food, index) in item.foods" class="food-item" @click="selectFood(food, $event)">
              <div class="icon">
                <img :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <v-cartcontrol @add="addFood" :food="food"></v-cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <v-shopcart 
      ref="shopcart"
      :select-foods="selectFoods"
      :delivery-price="seller.deliveryPrice" 
      :min-price="seller.minPrice">
    </v-shopcart>
    <v-food @add="addFood" :food="selectedFood" ref="food"></v-food>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import food from 'components/food/food';
  const ERR_OK = 0;

  export default {
    props:{
      seller:{
        type: Object
      }
    },
    components:{
      'v-shopcart': shopcart,
      'v-cartcontrol': cartcontrol,
      'v-food': food
    }, 
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      }
    },
    created() {
      this.classMap = ['decrease','discount','special','invoice','guarantee']

      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if(response.errno === ERR_OK){
          this.goods = response.data;
          //DOM更新了，操作dom时一定要在$nextTick里
          this.$nextTick(() => {
            this._initScroll(); 
            this._calculateHeight();
          });
             
        }
      });
    },
    methods: {
      _initScroll: function(){
        this.menuScroll = new BScroll(this.$refs.menuWrapper,{
          click: true
        });
        this.foodScroll = new BScroll(this.$refs.foodWrapper,{
          click: true,
          probeType: 3    //监测实时滚动的位置
        })

        this.foodScroll.on("scroll", (pos) => {
          //拿到实时的Y坐标
          this.scrollY = Math.abs(Math.round(pos.y));
        })
      },
      _calculateHeight: function(){
        //获取食物的li Dom节点列表
        let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for(let i = 0; i < foodList.length; i++){
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      selectMenu: function(index,event){
        //better-scroll 可以监听到此事件，浏览器原生不能监听到，防止PC端出现两次点击
        if(!event._constructed){
          return;
        }
        //获取食物的li Dom节点列表
        let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        //调用better-scroll 方法滚动到响应位置
        this.foodScroll.scrollToElement(el, 300);
      },
      selectFood: function(food,event){
        if(!event._constructed){
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show();
      },
      addFood: function(target){
        this._drop(target);
      },
      _drop: function(target){
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
      }
    },
    computed: {
      currentIndex: function(){
        for(let i = 0; i < this.listHeight.length; i++){
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
            return i;
          }
        }
        return 0;
      },
      selectFoods: function(){
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if(food.count){
              foods.push(food);
            }
          });
        })
        return foods;
      }
    }
  };
</script>