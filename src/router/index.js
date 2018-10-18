import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'

//商品
import goods from 'components/goods/goods'

//评论
import ratings from 'components/ratings/ratings'

//商家
import seller from 'components/seller/seller'

Vue.use(Router);

const router = new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/goods',
      name: 'goods',
      component: goods
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: ratings
    },
    {
      path: '/seller',
      name: 'seller',
      component: seller
    }
  ]
})

// 设置afterEach钩子函数
router.afterEach((to, from, next) => {
  document.title = to.name;
})

router.push('/goods');

export default router;


