<template>
	<sz-main tabbar>
		<sz-navbar :back="true" bg="sz-BG-Main" op>
			<text slot="center">我的订单</text>
		</sz-navbar>
		<view class="swiper-tab">
			<view class="swiper-tab-list" :class="{'on':currentTab==0}" :data-current="0" data-otype="pay" @click="swichNav">待付款</view>
			<view class="swiper-tab-list" :class="{'on':currentTab==1}" :data-current="1" data-otype="deliver" @click="swichNav">待发货</view>
			<view class="swiper-tab-list" :class="{'on':currentTab==2}" :data-current="2" data-otype="receive" @click="swichNav">待收货</view>
			<view class="swiper-tab-list" :class="{'on':currentTab==3}" :data-current="3" data-otype="finish" @click="swichNav">已完成</view>
			<view class="swiper-tab-list" :class="{'on':currentTab==4}" :data-current="4" @click="swichNav">退款/售后</view>
		</view>
	
		<view :style="{height:cNavBarH + 'px'}"></view>
		
		<swiper :current="currentTab" class="swiper-box" duration="300" :style="{height:(cHeight + 'px')}" @change="bindChange">
			<!-- 待付款 -->
			<swiper-item>
				<view class="search_no" v-if="!orderList0.length">
					<view class="font_14">
						<image class="scimg" src="/static/images/search_no.png"></image>
					</view>
					<text>没有可用订单/(ㄒoㄒ)/~~</text>
				</view>
			    <view v-else  style="height:100%;overflow: auto;">
					<view class="shop df" v-for="(item, index) in orderList0" :key="index">
						<image class="sh_slt" :src="item.photo_x"></image>
						<view class="df_1">
							<view class="sp_text">
								<navigator :url="'/pages/product/detail?productId=' + item.pid" hover-class="changestyle">
									<view class="sp_tit ovh1">{{item.name}}</view>
								</navigator>
								<view class="sp_neb">单价：¥ {{item.price_yh}} 数量：×{{item.product_num}} 产品：×{{item.pro_count}}</view>
								<view class="sp_jg">¥：{{item.price}}</view>
								<view class="font_12 red fl_r" @click="payOrderByWechat" :data-orderId="item.id" :data-ordersn="item.order_sn" v-if="item.type=='weixin'">微信支付</view>
								<!--<navigator class="font_12 red fl_r" url="../order/downline?orderId={{item.id}}" wx:if="{{item.PayType=='cash'}}">线下支付</navigator>-->
								<view class="font_12 red fl_r mr_5" @click="removeOrder" :data-order-id="item.id">取消订单</view>
								<navigator :url="'/pages/order/detail?orderId='+item.id" class="font_12 red fl_r mr_5">订单详情</navigator>
							</view>
						</view>
					</view>
				</view>
			</swiper-item>
			  
			<!-- 待发货 -->
			<swiper-item>
				<view v-if="!orderList1.length" class="search_no" >
			        <view class="font_14">
						<image class="scimg" src="/static/images/search_no.png"></image>
			        </view>
			        <text>没有可用订单/(ㄒoㄒ)/~~</text>
				</view>
				<view v-else  style="height:100%;overflow: auto;">
					<view class="shop df" v-for="(item, index) in orderList1" :key="index">
					    <image class="sh_slt" :src="item.photo_x"></image>
					    <view class="df_1">
							<view class="sp_text">
								<navigator :url="'/pages/product/detail?productId=' + item.pid" hover-class="changestyle">
									<view class="sp_tit ovh1">{{item.name}}</view>
								</navigator>
								<view class="sp_neb">单价：¥ {{item.price_yh}} 数量：×{{item.product_num}} 产品：×{{item.pro_count}}</view>
								<view class="sp_jg">¥：{{item.price}}</view>
								<navigator class="font_12 red fl_r" :url="'tuihuo?orderId=' + item.id">申请退款</navigator>
								<navigator :url="'/pages/order/detail?orderId='+item.id" class="font_12 red fl_r mr_5">订单详情</navigator>
							</view>
					    </view>
					</view>
				</view>
			</swiper-item>
			
			<!-- 待收货 -->
			<swiper-item>
			    <view class="search_no" v-if="!orderList2.length">
					<view class="font_14">
						<image class="scimg" src="/static/images/search_no.png"></image>
					</view>
					<text>没有可用订单/(ㄒoㄒ)/~~</text>
			    </view>
				<view v-else  style="height:100%;overflow: auto;">
					<view class="shop df" v-for="(item, index) in orderList2" :key="index">
						<image class="sh_slt" :src="item.photo_x"></image>
						<view class="df_1">
							<view class="sp_text">
								<navigator :url="'/pages/product/detail?productId=' + item.pid" hover-class="changestyle">
									<view class="sp_tit ovh1">{{item.name}}</view>
								</navigator>
								<view class="sp_neb">单价：¥ {{item.price_yh}} 数量：×{{item.product_num}} 产品：×{{item.pro_count}}</view>
								<view class="sp_jg">¥：{{item.price}}</view>
								<navigator class="font_12 red fl_r" :url="'tuihuo?orderId=' + item.id">申请退款</navigator>
								<view class="font_12 red fl_r mr_5" @click="recOrder" :data-order-id="item.id">确认收货</view>
								<navigator :url="'/pages/order/detail?orderId='+item.id" class="font_12 red fl_r mr_5">订单详情</navigator>
							</view>
						</view>
					</view>
				</view>
			</swiper-item>
			  
			  
			<!-- 已完成-->
			<swiper-item>
			    <view class="search_no" v-if="!orderList3.length">
					<view class="font_14">
						<image class="scimg" src="/static/images/search_no.png"></image>
					</view>
					<text>没有可用订单/(ㄒoㄒ)/~~</text>
			    </view>
				<view v-else  style="height:100%;overflow: auto;">
					<view class="shop df" v-for="(item, index) in orderList3" :key="index">
						<image class="sh_slt" :src="item.photo_x"></image>
						<view class="df_1">
							<view class="sp_text">
								<navigator :url="'/pages/product/detail?productId=' + item.pid" hover-class="changestyle">
									<view class="sp_tit ovh1">{{item.name}}</view>
								</navigator>
								<view class="sp_neb">单价：¥ {{item.price_yh}} 数量：×{{item.product_num}} 产品：×{{item.pro_count}}</view>
								<view class="sp_jg">¥：{{item.price}}</view>
								<navigator :url="'/pages/order/detail?orderId='+item.id" class="font_12 red fl_r mr_5">订单详情</navigator>
							</view>
						</view>
					</view>
				</view>
			</swiper-item>
			
			<!-- 退款/售后 -->
			<swiper-item>
				<view class="search_no" v-if="!orderList4.length">
					<view class="font_14">
						<image class="scimg" src="/static/images/search_no.png"></image>
					</view>
					<text>没有可用订单/(ㄒoㄒ)/~~</text>
				</view>
				<view v-else style="height:100%;overflow: auto;">
					<view class="shop df" v-for="(item, index) in orderList4" :key="index">
						<image class="sh_slt" :src="item.photo_x"></image>
						<view class="df_1">
							<view class="sp_text">
								<navigator :url="'/pages/product/detail?productId=' + item.pid" hover-class="changestyle">
									<view class="sp_tit ovh1">{{item.name}}</view>
								</navigator>
								<view class="sp_neb">单价：¥ {{item.price_yh}} 数量：×{{item.product_num}} 产品：×{{item.pro_count}}</view>
								<view class="sp_jg">¥：{{item.price}}</view>
								<view class="font_12 red fl_r">{{item.desc}}</view>
								<!--<navigator :url="'/pages/order/detail?orderId='+item.id" class="font_12 red fl_r mr_5">订单详情</navigator>-->
							</view>
						</view>
					</view>
				</view>
			  </swiper-item>
		</swiper>
		
	</sz-main>
</template>

<script>
	import {
		request
	} from "@/utils/request";
	import config from "@/utils/config";
	export default {
		data() {
			return {
				tabTop: 0,
				winWidth: 0,  
				winHeight: 0,  
				currentTab: 0, // tab切换  
				isStatus:'pay',//10待付款，20待发货，30待收货 40、50已完成
				page:0,
				refundpage:0,
				orderList0:[],
				orderList1:[],
				orderList2:[],
				orderList3:[],
				orderList4:[],
			}
		},
		computed: {
			cTabTop(){
				return 0;
			},
			cNavBarH(){
				return this.$store.getters.sz_navBar || 0;
			},
			cHeight(){
				let tabbarH = uni.getStorageSync('tabbar') || 0;
				return this.winHeight - tabbarH - this.cNavBarH - 43;
			}
		},
		onLoad(options){
			this.initSystemInfo();
			this.currentTab = parseInt(options.currentTab);
			this.isStatus = options.otype || '';
			if (this.currentTab == 4) {
				this.loadReturnOrderList();
			} else {
				this.loadOrderList();
			}
		},
		
		methods: {
			swichNav(e){
				if (this.currentTab === e.target.dataset.current) {
					return false;
				}else{
					var current = e.target.dataset.current;
					this.currentTab = parseInt(current);
					this.isStatus = e.target.dataset.otype;
					
					//没有数据就进行加载
					switch (this.currentTab) {
						case 0:
							!this.orderList0.length && this.loadOrderList();
							break;
						case 1:
							!this.orderList1.length && this.loadOrderList();
							break;
						case 2:
							!this.orderList2.length && this.loadOrderList();
							break;
						case 3:
							!this.orderList3.length && this.loadOrderList();
							break;
						case 4:
							this.orderList4.length = 0;
							this.loadReturnOrderList();
							break;
					}
				}
			},
			initSystemInfo(){
				let that = this;
				uni.getSystemInfo({
					success: function (res) {
						console.log('res', res);
						that.winWidth = res.windowWidth;
						that.winHeight = res.windowHeight;
					}
				});
			},
			bindChange(e){
				console.log('bindChange', e.detail.current);
				this.currentTab = e.detail.current;
			},
			loadReturnOrderList(){
				request.post('/Api/Order/order_refund', {
					uid: this.sz_userId,
					page: this.refundpage,
				}).then(res => {
					//--init data
					var data = res.ord;
					if (res.status == 1) {
						this.orderList4 = this.orderList4.concat(data);
					} else {
						uni.showToast({
							icon: "none",
							title: res.err
						});
					}
				});
			},
			loadOrderList(){
				let that = this;
				request.post('/Api/Order/index', {
					uid: this.sz_userId,
					order_type: that.isStatus,
					page: that.page,
				}).then(res => {
					let status = res.status, list = res.ord;
					switch (that.currentTab) {
						case 0:
							this.orderList0 = list;
						break;
					  case 1:
							this.orderList1 = list;
						break;
					  case 2:
							this.orderList2 = list;
						break;
					  case 3:
							this.orderList3 = list;
						break;
					  case 4:
							this.orderList4 = list;
						break;
					}
				}); 
			},
			//取消订单
			removeOrder(e){
				let that = this, orderId = e.currentTarget.dataset.orderId;
				uni.showModal({
					title: '提示',
					content: '你确定要取消订单吗？',
					success: function (res) {
						if (res.confirm) {
							request.post('/Api/Order/orders_edit', {
								id: orderId,
								type: 'cancel',
							}).then(res => {
								//--init data
								let status = res.status;
								if (status == 1) {
									uni.showToast({
										icon: "none",
										title: "操作成功！"
									});
									that.loadOrderList();
								} else {
									uni.showToast({
										icon: "none",
										title: res.err
									});
								}
							});
						}
					}
				});
			},
			//微信支付
			payOrderByWechat(e){
				let order_id = e.currentTarget.dataset.orderId, order_sn = e.currentTarget.dataset.ordersn;
				if (!order_sn) {
					uni.showToast({
						icon: "none",
						title: "订单异常!"
					});
					return false;
				}
				request.post('/Api/Wxpay/wxpay', {
					order_id: order_id,
					order_sn: order_sn,
					uid: this.sz_userId,
				}).then(res => {
					if (res.status == 1) {
						let order = res.arr;
						wx.requestPayment({
							timeStamp: order.timeStamp,
							nonceStr: order.nonceStr,
							package: order.package,
							signType: 'MD5',
							paySign: order.paySign,
							success: function (res) {
								uni.showToast({
									icon: "none",
									title: "支付成功!"
								});
								setTimeout(function () {
									uni.redirectTo({
										url: '/pages/user/dingdan?currentTab=1&otype=deliver'
									})
								}, 3000);
							},
							fail: function (res) {
								uni.showToast({
									icon: "none",
									title: res
								});
							}
						})
					} else {
						uni.showToast({
							icon: "none",
							title: res.err
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{overflow: hidden;}
	.swiper-tab{  
	    width: 100%;  
	    border-bottom: 1px solid #eee;  
	    text-align: center;  
	    line-height: 80rpx;
	    background: #fff;  
	    position: fixed;
	    z-index: 999;
		.swiper-tab-list{  
			font-size: 12px;  
			display: inline-block;  
			width: 20%;  
			color: #666;  
		}  
		.on{ 
			color: #dd2727;  
			border-bottom: 5rpx solid #dd2727;
		}  
	} 
	.c_t60{
	    clear: both;
	    height: 1px;
	    padding-top: 48px;
	}
	.swiper-box{ 
		display: block; 
		height: 100%; 
		width: 100%; 
		overflow: hidden; 
		
		.shop{
		    background: #fff;
		    padding: 4%;
		    margin-bottom: 10px;
			border-bottom: 1px solid #eee;
			
			checkbox{
			    margin-top: 27px;
			}
			
			.sh_slt{
			    width: 80px;
			    height: 80px;
			    overflow: hidden;
			    border-radius: 5px;
			    margin-right: 4%;
			    float: left;
			}
			
			.sp_text{
			    float: left;
			    line-height: 20px;
			    width: 100%;
			    text-align: left;
				.sp_tit{
				    width: 100%;
				    overflow: hidden;
				    font-size: 14px;
				}
				.sp_neb{
				    width: 100%;
				    overflow: hidden;
				    font-size: 12px;
				    color: #999;
				}
				.sp_jg{
				    width: 100%;
				    overflow: hidden;
				    font-size: 14px;
				    color: #fc0628;
				}
			}
		}
		
	} 
	
	
	.mr_5{
	    margin-right: 5px;
	}
</style>
