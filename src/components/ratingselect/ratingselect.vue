<template>
  <div class="ratingselect">
    <div class="rating-type">
      <span @click="select(2,$event)" class="block positive" :class="{'active' : selectType === 2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="block positive" :class="{'active' : selectType === 0}">{{desc.positive}}<span class="count">{{positive.length}}</span></span>
      <span @click="select(1,$event)" class="block negative" :class="{'active' : selectType === 1}">{{desc.negative}}<span class="count">{{negative.length}}</span></span>
    </div>
    <div @click="toggleContent" class="switch" :class="{'on': onlyContent}">
      <i class="iconfont icon-check_circle"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
  
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default{
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    data() {
      return {
        selectType2: this.selectType,
        onlyContent2: this.onlyContent
      }
    },
    methods: {
      select: function(type, event){
        if(!event._constructed){
          return;
        }
        this.$emit('select',type);
      },
      toggleContent: function(event){
        if(!event._constructed){
          return;
        }
        this.$emit('toggle');
      }
    },
    computed: {
      positive: function(){
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      negative: function(){
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
    }
  }
</script>