<template>
	<sz-main >
		<sz-navbar :back="true" bg="sz-BG-Main" op>
			<text slot="center">商品详情</text>
		</sz-navbar>

		<view class="cont">
			<swiper style="height:375px" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				:duration="duration">
				<block v-for="(item, index) in bannerItem">
					<swiper-item>
						<image :src="item" class="slide-image" :key="index" />
					</swiper-item>
				</block>
			</swiper>
			<view class="title">{{itemData.name}}</view>

			<view class="gmxx">
				<view>
					<text class="jiage">¥：{{itemData.price_yh}}</text>
					<text class="c6 fl_r font_14" style='color:#ccc'>库存：{{itemData.num}}</text>
				</view>
				<view class="font_14 c6">品牌：{{itemData.brand}}</view>
				<view class="font_14 c6">支付：微信支付</view>
			</view>

		</view>

		<!--弹窗-->
		<view class="drawer_screen" @click="setModalStatus(0)" :hidden="!showModalStatus"></view>
		<view :animation="animationData" :style="{transform: 'translateY('+attrBoxOffsetY+'px)'}" class="drawer_attr_box" :hidden="!showModalStatus">
			<view class="close_icon" @click="setModalStatus(0)">×</view>
			<view class="drawer_attr_content">
				<view class="text_center">
					<image class="drawer_image" :src="itemData.photo_x"></image>
					<view class="mingcheng">
						<view>{{itemData.name}}</view>
						<view style="font-size:29rpx;color:red">¥ {{itemData.price_yh}}</view>
						<view style="font-size:26rpx;color:#ccc">库存：{{itemData.num}}</view>
					</view>
				</view>
				<view class="shu">
					<text class="cun">购买数量</text>
					<view class="dian">
						<view class="stepper">
							<!-- 减号 -->
							<text @click="changeNum(0)">-</text>
							<!-- 数值 -->
							<view class="nownum">{{buynum}}</view>
							<!-- 加号 -->
							<text class="normal" @click="changeNum(1)">+</text>
						</view>
					</view>
				</view>
				<view class="footc" @click="addShopCart('buynow', 1)">
					<text>立即购买</text>
				</view>
			</view>
		</view>

		<!--图文详情头部-->
		<view>
			<view class="swiper-tab">
				<view class="bre swiper-tab-list" :class="[{on: currentTab == 0}]" @click="swichNav(0)">图文详情</view>
				<view class="swiper-tab-list" :class="[{on: currentTab == 1}]" @click="swichNav(1)">产品参数</view>
			</view>
			<swiper :current="currentTab" class="swiper-box" :duration="300" :style="{height:(winHeight - 31) + 'px'}"
				@change="bindChange">

				<!-- 图文详情 -->
				<swiper-item>
					<!-- <import src="../../wxParse/wxParse.wxml" /> -->
					<view class="wxParse">
						<scroll-view style="height:2000rpx;" :scroll-y="true">
							<rich-text :nodes="itemData.content"></rich-text>
						</scroll-view>
					</view>
				</swiper-item>

				<!-- 产品参数 -->
				<swiper-item>
					<view class="p_all">
						<view class="canshu df">
							<view class="name">商品名称：</view>
							<view class="df_1 c3">{{itemData.name}}</view>
						</view>
						<view class="canshu df">
							<view class="name">商品编号：</view>
							<view class="df_1 c3">{{itemData.pro_number}}</view>
						</view>
						<view class="canshu df">
							<view class="name">分类：</view>
							<view class="df_1 c3">{{itemData.cat_name}}</view>
						</view>
						<view class="canshu df">
							<view class="name">售后：</view>
							<view class="df_1 c3">签收之日48小时无条件退货</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<!---底部开始-->
		<view class="footfixed tc">
			<view class="fl_l w40 font_12 hui03 flex">
				<view class="flex-sub l_h15 pt5 bre">
					<button open-type="contact" type="default-light" :session-from="'productId_'+itemData.id" class="ke">
						<image class="icon_kf" src="/static/images/kefu.png" ></image>
						<view class="dbtext">客服</view>
					</button>
				</view>
				<view class="flex-sub l_h15 pt5">
					<view @click="addFavorites">
						<image class="icon_kf" src="/static/images/shc.png"></image>
						<view class="dbtext">收藏</view>
					</view>
				</view>
			</view>
			<view class="fl_l w60">
				<view class="w50 fl_l bg_cheng white flex-center" @click="addShopCart('addcart')">加入购物车</view>
				<view class="bg_red white w50 fl_l flex-center" @click="setModalStatus(1)">立刻购买</view>
			</view>
		</view>

	</sz-main>
</template>

<script>
	import {
		request
	} from "@/utils/request";

	export default {
		data() {
			return {
				bannerApp: true,
				winWidth: 0,
				winHeight: 0,
				currentTab: 0, //tab切换  
				productId: 0,
				itemData: {},
				bannerItem: [],
				buynum: 1,
				// 产品图片轮播
				indicatorDots: true,
				autoplay: true,
				interval: 5000,
				duration: 1000,
				// 属性选择
				firstIndex: -1,
				//准备数据
				//数据结构：以一组一组来进行设定
				commodityAttr: [],
				attrValueList: [],
				showModalStatus: false,
				minusStatuses: [],
				attrBoxOffsetY: 300,
				animationData: {}
			}
		},
		onLoad(options) {
			this.productId = options.productId;
			this.loadProductDetail();
		},
		methods: {
			addFavorites() {
				request.post('/Api/Product/col', {
					uid: this.sz_userId,
					pid: this.productId
				}).then(res => {
					if (res.status == 1) {
						uni.showToast({
							title: "操作成功！",
							icon: "none"
						});
						//变成已收藏，但是目前小程序可能不能改变图片，只能改样式
						this.itemData.isCollect = true;
					} else {
						uni.showToast({
							title: res.err,
							icon: "none"
						});
					}
				});
			},
			bindChange(e) {
				this.currentTab = e.detail.current;
			},
			//点击tab切换
			swichNav(current) {
				var that = this;
				if (this.currentTab === current) {
					return false;
				} else {
					this.currentTab = current;
				}
			},
			addShopCart(ptype, status) {
				request.post('/Api/Shopping/add', {
					uid: this.sz_userId,
					pid: this.productId,
					num: this.buynum,
				}).then(res => {
					if (res.status == 1) {
						if (ptype == 'buynow') {
							uni.navigateTo({
								url: '../order/pay?cartId=' + res.cart_id
							})
							return;
						} else {
							uni.showToast({
								title: "加入购物车成功",
								icon: "none"
							});
						}
					} else {
						uni.showToast({
							icon: "none",
							title: res.err
						});
					}
				});
			},
			changeNum(alphaBeta) {
				if (alphaBeta == 0) {
					if (this.buynum <= 1) {
						this.buynum = 1
					} else {
						this.buynum = this.buynum - 1;
					};
				} else {
					this.buynum = this.buynum + 1;
				};
			},
			loadProductDetail() {
				request.post('/Api/Product/index', {
					pro_id: this.productId
				}).then(res => {
					if (res.status == 1) {
						this.itemData = res.pro;
						this.bannerItem = res.pro.img_arr;
						this.commodityAttr = res.commodityAttr;
						this.attrValueList = res.attrValueList;
					} else {
						uni.showToast({
							icon: "none",
							title: res.err
						});
					}
				});
			},
			// 弹窗
			setModalStatus(status) {
				 var animation = uni.createAnimation({
					duration: 200,
					timingFunction: "linear",
					delay: 0
				})
				this.animation = animation;
				
				if (status == 1) {
					animation.translateY(0).step();
					this.animationData = animation.export(); 
					this.showModalStatus = true;
				}else{
					animation.translateY(300).step();
					this.animationData = animation.export(); 
					let that = this;
					setTimeout(function(){
						that.showModalStatus = false;
					}, 200);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ad {
		width: 100%;
		background: rgba(0, 0, 0, .6);
		padding: 3% 0;
		display: inline-table;
		position: fixed;
		z-index: 9999;
		display: none;
	}

	.ad .text-title {
		font-size: 14px;
		color: #fff;
		width: 60%;
		text-align: center;
		float: left;
		line-height: 15px;

	}

	.ad .button_icon {
		border-radius: 20px;
		background: #fd9d21;
		width: 20%;
		text-align: center;
		font-size: 14px;
		color: #fff;
		padding: 5px 10px;
		float: left;

	}

	.ad .cl_button {
		width: 16px;
		height: 16px;
		float: right;
		margin: 8px 10px;
	}

	.cont {
		width: 100%;
		background: #fff;
		margin-bottom: 10px;
	}

	.tp_image {
		width: 100%;
		height: 910rpx;
	}

	.cont .title {
		font-size: 15px;
		color: #333;
		line-height: 20px;
		margin: 0;
		max-height: 40px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		padding: 5% 5% 0 5%;
		font-weight: 700
	}

	.gmxx {
		padding: 1% 5% 5% 5%;
		line-height: 25px;
	}

	.gmxx .jiage {
		font-size: 15px;
		color: #dd2727;
		padding-top: 10px;
	}

	.icon_kf {
		width: 20px;
		height: 20px;
		display: inline-block;
		margin-top: 5px;

	}

	.ke {
		text-align: center;
		margin:0;
		display:inline-block;
		padding:0;
		border:none;
		background:white;
		line-height:34rpx;
	}
	.ke::after{border:none;}

	.l_h15 {
		line-height: 15px;
		text-align: center;
	}

	.dbtext {
		line-height: 15px;
		color: #666;
		font-size: 12px;
	}

	.canshu {
		border-bottom: 1px solid #eee;
		font-size: 14px;
		line-height: 23px;
		width: 100%;
		padding: 2% 0;
	}

	.canshu .name {
		width: 80px;
		color: #999;
		font-size: 28rpx;

	}

	.canshu span {
		color: #333;
	}

	.swiper-tab {
		width: 100%;
		border-bottom: 2rpx solid #eee;
		text-align: center;
		line-height: 80rpx;
		background: #fff;
		font-size: 14px;
	}

	.swiper-tab-list {
		font-size: 29rpx;
		display: inline-block;
		width: 49.5%;
		color: #333;


	}

	.swiper-box {
		background: #fff;
		display: block;
		/*heigaqht: 100%;. */
		width: 100%;
		/*overflow: hidden;*/
	}

	.on {
		color: #dd2727;
		border-bottom: 5rpx solid #dd2727;
	}

	.tw_text {
		font-size: 28rpx;
		color: #000;
		line-height: 25px;
	}

	.c3 {
		font-size: 28rpx;
	}

	.fl_l {
		font-weight: 700
	}

	.footfixed {
		display: block;
		position: fixed;
		bottom: 0;
		left: 0;
		background: #fff;
		z-index: 100;
		width: 100%;
		font-size: 14px;
		border-top: 1px solid #eee;
		line-height: 50px;
		/*background: #dd2727;*/
		font-weight: 700;
		color: snow
	}

	.footc {
		display: block;
		position: fixed;
		bottom: 0;
		left: 0;
		background: red;
		z-index: 100;
		width: 100%;
		font-size: 14px;
		border-top: 1px solid #eee;
		line-height: 50px;
		font-weight: 700;
		color: snow;
		text-align: center
	}

	/*弹窗*/
	.drawer_screen {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #000;
		opacity: 0.2;
		overflow: hidden;
		z-index: 1000;
		color: #fff;
	}

	.drawer_attr_box {
		width: 100%;
		overflow: hidden;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 2000;
		background: #fff;
	}

	.close_icon {
		width: 25rpx;
		height: 25rpx;
		line-height: 20rpx;
		font-size: 30rpx;
		position: absolute;
		right: 5rpx;
		top: 5rpx;
		padding: 10rpx;
		color: #ccc;
		/*border: 1rpx solid #ccc;*/
		border-radius: 50%;
		text-align: center;
		background: #fff;
		box-sizing: content-box;
	}


	.drawer_attr_content {
		padding: 20rpx;
		/*height: 600rpx;*/
		overflow-y: scroll;
	}

	.text_center {
		width: 100%;
	}

	.mingcheng {
		width: 60%;
		display: inline-block;
		font-size: 35rpx;
		line-height: 50rpx;
		margin-left: 40rpx;
	}

	.drawer_image {
		width: 28%;
		height: 200rpx;
	}

	.drawer_desc {
		font-size: 28rpx;
		margin: 20rpx;
		height: 150rpx;
		width: 100%;
	}

	.cun {
		margin: 5px;
		font-size: 30rpx;
		padding-left: 20rpx;
		width: 20%
	}

	.chi {
		width: 40%;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		border: 1px solid #999;
		display: inline-block;
		margin: 5px;
	}

	.btn {
		width: 80%;
		padding: 15rpx 0;
		border-radius: 10rpx;
		text-align: center;
	}

	.open_btn {
		margin: 40rpx 10%;
		border-radius: 10rpx;
		background: #20bb21;
		color: #fff;
	}

	/*数量*/
	.dian {
		width: 70%;
		display: inline-block;
	}

	.shu {
		width: 100%;
		margin-top: 35rpx;
		margin-bottom: 160rpx;
	}

	.stepper {
		text-align: right;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 200rpx;
		overflow: hidden;
		margin-left: 250rpx;
		border-radius: 29rpx;
		background: #FCFCFC
	}

	.stepper text {
		background-color: #fff;
		border: 1px solid #eee;
		border-radius: 50%;
		width: 26px;
		height: 26px;
		line-height: 26px;
		text-align: center;
		font-weight: 900;
		color: #939393;
	}

	.stepper input {
		width: 30px;
		height: 25px;
		text-align: center;
		/*background-color: #f2f2f2;*/
		/*border-top:  1px solid #666;
	  border-bottom:  1px solid #666;*/
	}


	/*分类选择*/
	.title {
		padding: 10rpx 20rpx;
		margin: 10rpx 0;
		border-left: 4rpx solid #ccc;
	}

	/*全部属性的主盒子*/
	.commodity_attr_list {
		background: #fff;
		padding: 0 20rpx;
		font-size: 26rpx;
		overflow: hidden;
		width: 100%;
	}

	/*每组属性的主盒子*/
	.attr_box {
		width: 100%;
		overflow: hidden;
		border-bottom: 1rpx solid #ececec;
	}

	/*属性名*/
	.attr_name {
		width: 20%;
		float: left;
		padding: 15rpx 0;
		font-size: 30rpx;
		margin-top: 20rpx;
	}

	/*属性值*/
	.attr_value_box {
		width: 80%;
		float: left;
		padding: 15rpx 0;
		overflow: hidden;
	}

	/*每个属性值*/
	.attr_value {
		padding: 10rpx 20rpx;
		float: left;
		/*padding: 0 20rpx;*/
		margin: 0 10rpx;
		border: 1rpx solid #ececec;
		font-size: 33rpx;
	}

	/*每个属性选中的当前样式*/
	.attr_value_active {
		background: #dd2727;
		border-radius: 10rpx;
		color: #fff;
		/*padding: 0 20rpx;*/
		padding: 10rpx 20rpx;

	}

	/*禁用属性*/
	.attr_value_disabled {

		color: #ccc;
	}

	/*button*/
	.btn-area {
		margin: 1.17647059em 15px 0.3em;
	}

	.btn {
		margin-top: 15px;
		background-color: #FFCC00;
		color: #fff;
	}

	.btn:first-child {
		margin-top: 0;
	}

	swiper {
		width: 100%;
		height: 2000rpx;
	}

	.swiper-item {
		display: block;
		height: 100%;
	}

	.slide-image {
		width: 100%;
		height: 100%;
	}

	.pos {
		position: absolute;
		top: 10px;
		left: 23px;
		opacity: 0;
	}
</style>