<template>
	<sz-main tabbar>
		<view class="page">
			<view class="userinfo">
				<image class="userinfo-avatar fl_l" :src="userInfo.avatarUrl" background-size="cover"></image>
				<text class="fl_l">{{userInfo.nickName}}</text>
			</view>
			<!--订单详情-->
			<view class="qbdd mt10">
				<span class="font_14 c3">全部订单</span>
				<navigator class="fl_r c9 font_12 l_h20" url="/pages/user/dingdan?currentTab=0" hover-class="none">
					查看全部订单 >
				</navigator>
			</view>
			<view class="sc df tc bte ">
				<navigator class="df_1" url="/pages/user/dingdan?currentTab=0&otype=pay" hover-class="none">
					<view>
						<image src="/static/images/dfk.png"></image>
					</view>
					<text class="font_12">待付款<text style="color:red">({{orderInfo.pay_num}})</text></text>
				</navigator>
				<navigator class="df_1" url="/pages/user/dingdan?currentTab=2&otype=receive" hover-class="none">
					<view>
						<image src="/static/images/dpl.png"></image>
					</view>
					<text class="font_12">待收货<text style="color:red">({{orderInfo.rec_num}})</text></text>
				</navigator>
				<navigator class="df_1" url="/pages/user/dingdan?currentTab=3&otype=finish" hover-class="none">
					<view>
						<image src="/static/images/dsh.png"></image>
					</view>
					<text class="font_12">已完成<text style="color:red">({{orderInfo.finish_num}})</text></text>
				</navigator>
				<navigator class="df_1" url="/pages/user/dingdan?currentTab=4" hover-class="none">
					<view>
						<image src="/static/images/tksh.png"></image>
					</view>
					<text class="font_12">退款/售后<text style="color:red">({{orderInfo.refund_num}})</text></text>
				</navigator>
			</view>
			<view class="qbdd mt10">
				<view @click="navigateTo('/pages/address/user-address/user-address')" style="display:block;">
					<span class="font_14 c3">地址管理</span>
					<span class="fl_r c9 font_12 l_h20" hover-class="none"> ></span>
				</view>
			</view>
			<view class="qbdd mt10">
				<view @click="navigateTo('/pages/rituall/rituall')">
					<span class="font_14 c3">优惠劵</span>
					<span class="fl_r c9 font_12 l_h20" hover-class="none"> ></span>
				</view>
			</view>
			<view class="qbdd mt10">
				<view>
					<span class="font_14 c3">联系客服</span>
					<span class="fl_r c9 font_12 l_h20" hover-class="none"> ></span>
				</view>
			</view>
		</view>
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
				userInfo: {},
				orderInfo: {},
				projectSource: 'https://github.com/liuxuanqiang/wechat-weapp-mall',
				userListInfo: [{
					icon: '/static/images/iconfont-dingdan.png',
					text: '我的订单',
					isunread: true,
					unreadNum: 2
				}, {
					icon: '/static/images/iconfont-card.png',
					text: '我的代金券',
					isunread: false,
					unreadNum: 2
				}, {
					icon: '/static/images/iconfont-icontuan.png',
					text: '我的拼团',
					isunread: true,
					unreadNum: 1
				}, {
					icon: '/static/images/iconfont-shouhuodizhi.png',
					text: '收货地址管理'
				}, {
					icon: '/static/images/iconfont-kefu.png',
					text: '联系客服'
				}, {
					icon: '/static/images/iconfont-help.png',
					text: '常见问题'
				}],
				loadingText: '加载中...',
				loadingHidden: false,
			}
		},
		onLoad() {
			let that = this;
			//调用应用实例的方法获取全局数据
			this.getUserInfo(function(userInfo){
				that.userInfo = userInfo;
				that.loadingHidden = true;
			});
		},
		onShow() {
			this.loadOrderStatus();
		},
		methods: {
			loadOrderStatus(){
				//获取用户订单数据
				let that = this;
				request.post('/Api/User/getorder', {
					userId: this.sz_userId,
				}).then(res => {
					if(res.status == 1){
						that.orderInfo = res.orderInfo;
					}else{
						uni.showToast({
							icon: "none",
							title: "非法操作"
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.userinfo {
		position: relative;
		width: 750rpx;
		height: 320rpx;
		background: #008842;
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		
		.userinfo-avatar {
			display: block;
			width: 160rpx;
			height: 160rpx;
			margin: 20rpx;
			margin-top: 50rpx;
			border-radius: 50%;
			border: 2px solid #fff;
			box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
		}
	}

	.sc {
		background: #fff;
		width: 100%;
		font-size: 12px;
		line-height: 16px;
		color: #666;
		padding: 4% 0;
		.df_1{display: flex;flex-direction: column;align-items: center;}
		image {
			width: 24px;
			height: 24px;
			display: inline-block;
		}
	}

	.bte {
		border-top: 1px solid #eee;
	}

	.qbdd {
		background: #fff;
		font-size: 12px;
		color: #666;
		padding: 4%;
		border-bottom: 1px solid #eee
		
	}


</style>
