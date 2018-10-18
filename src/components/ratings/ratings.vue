<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <v-star :size="36" :score="seller.serviceScore"></v-star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <v-star :size="36" :score="seller.foodScore"></v-star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <v-split></v-split>
      <v-ratingselect 
        :select-type="selectType"
        :only-content="onlyContent"
        :ratings="ratings"
        @select = "selectRating"
        @toggle = "toggleContent">  
      </v-ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="(rating,index) in ratings" class="rating-item" v-show="needShow(rating.rateType, rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <v-star :size="24" :score="rating.score"></v-star>
                <span class="delivery" v-if="rating.deliveryTime">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-if="rating.recommend && rating.recommend.length">
                <i class="iconfont icon-thumb_up"></i>
                <span v-for="item in rating.recommend" class="item">{{item}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import split from 'components/split/split';
  import ratingselect from 'components/ratingselect/ratingselect';
  import {formatDate} from '../../assets/js/date';
  import star from 'components/star/star';

  const ALL = 2;
  const ERR_OK = 0;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: true
      }
    },
    created() {
      this.$http.get('/api/ratings').then((response) => {
        response = response.body;
        if(response.errno === ERR_OK){
          this.ratings = response.data;
          //DOM更新了，操作dom时一定要在$nextTick里
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.ratings, {
              click: true
            })
          });         
        }
      });
    },
    components: {
      'v-split': split,
      'v-ratingselect': ratingselect,
      "v-star": star
    },
    methods: {
      select: function(type){
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      onlyContent2: function(onlyContent){
        this.onlyContent = onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      needShow: function(type, text){
        if(this.onlyContent && !text){
          return false;
        }
        if(this.selectType === ALL){
          return true;
        }else{
          return type === this.selectType;
        }
      },
      selectRating: function(type){
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      toggleContent: function(){
        this.onlyContent = !this.onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      }
    },
    filters: {
      formatDate: function(time){
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    }
  };
</script>