<template>
	<view>
    <!-- <my-search :bgcolor="'purple'" :radius="17"></my-search> -->
    <my-search @click="gotoSearch"></my-search>
		<view class="scroll-view-container">
      <!-- 左侧滑动区域 -->
      <scroll-view class="left-scroll-view" scroll-y="true" :style="{height: screen_height + 'px'}">
        <block v-for="(item,i) in cateList" :key="i">
          <view :class="['left-scroll-view-item', i === active ? 'active' : '']" @click="activeChanged(i)">
            {{item.cat_name}}
          </view>
        </block>
      </scroll-view>
      <!-- 右侧滑动区域 -->
      <scroll-view scroll-y="true" :style="{height: screen_height + 'px' }" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
          <!-- 二级分类的标题 -->
          <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
          <!-- 当前二级分类下的三级分类列表 -->
          <view class="cate-lv3-list">
            <!-- 三级分类的Item项 -->
            <view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
              <!-- 三级分类的图片 -->
              <!-- replace函数解决图片，图片链接处理时会将web存为dev
               例如：
               原图片链接：
               https://api-ugo-web.itheima.net/full/2fb113b32f7a2b161f5ee4096c319afedc3fd5a1.jpg
               获取后：
               https://api-ugo-dev.itheima.net/full/2fb113b32f7a2b161f5ee4096c319afedc3fd5a1.jpg
               -->
              <image :src="item3.cat_icon.replace('dev','web')"></image>
              <!-- 三级分类的文本 -->
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
	</view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-Badge.js'
	export default {
    mixins:[badgeMix],
		data() {
			return {
				//屏幕可用高度
        screen_height: 0,
        //分类数据数组
        cateList: [],
        //检查按钮是否激活
        active: 0,
        //右侧滑动区与顶部距离为零，使每次渲染时都重置页面到顶部
        scrollTop: 0,
        //二级分类列表
        cateLevel2: []
			};
		},
    onLoad() {
      const sysInfo = uni.getSystemInfoSync()
      this.screen_height = sysInfo.windowHeight-50
      this.getCateList()
    },
    methods: {
      async getCateList(){
        const {data: res } = await uni.$http.get('/api/public/v1/categories')
        if(res.meta.status !== 200 ) return uni.$showMsg()
        this.cateList = res.message
        
        //为二级分类列表赋值
        this.cateLevel2 = res.message[0].children
      },
      activeChanged(i) {
        this.active = i

        // 重新为二级分类赋值
         this.cateLevel2 = this.cateList[i].children
        //因为sroll-top不能每次赋同一个值，所有我们让其在0与1之间变化，1像素之差，用户很难察觉
         //this.scrollTop = this.scrollTop === 0 ? 2 : 0
         this.scrollTop = 1 - this.scrollTop
      },
      // 跳转到商品列表页面
      gotoGoodsList(item) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?cid=' + item.cat_id
        })
      },
      gotoSearch() {
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }
    }
	}
</script>

<style lang="scss">
.scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        background-color: #F7F7F7;
        line-height: 60px;
        text-align: center;
        font-size: 12px;

        &.active {
          background-color: #FFFFFF;
          position: relative;

          &::before {
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #ffaaff;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
          }
        }
      }
    }
  }

  .cate-lv2-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }

  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;

    .cate-lv3-item {
      width: 33.33%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;

      image {
        width: 60px;
        height: 60px;
      }

      text {
        font-size: 12px;
      }
    }
  }
</style>
