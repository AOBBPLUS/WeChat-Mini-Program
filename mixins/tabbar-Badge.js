import { mapGetters } from 'vuex'

// 导出一个 mixin 对象
export default {
  computed: {
    ...mapGetters('m_cart', ['total']),
  },
  onShow() {
    // 在页面刚展示的时候，设置数字徽标
    this.setBadge()
  },
  methods: {
    setBadge() {
      // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
      if (this.total !== 0){
        uni.setTabBarBadge({
        
        index: 2,
        text: this.total + '', // 注意：text 的值必须是字符串，不能是数字
      })
      }
      else {
        uni.removeTabBarBadge({index:2}) //购车数量为0隐藏红点
      }
      
    },
  },
  //及时更新 tabbar 的购物车商品数量
  watch:{     
    total:{       
      handler(newVal){       
        this.setBadge()       
       },   
        immediate:true,
    },
  }
}