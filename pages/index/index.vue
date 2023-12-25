<template>
	<sz-main tabbar>
		<sz-navbar :back="false" bg="sz-BG-Main" op isSlot>
			<view class="flex-center p-3 sz-col-12" > 
				<text>{{appName}}</text>
			</view>
		</sz-navbar>
		
		<swiper :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
			<block v-for="(item, index) in imgUrls">
				<swiper-item>
					<image :src="item.photo" class="slide-image" width="100%" height="200" />
				</swiper-item>
			</block>
		</swiper>
		
		<view class="cont">
			<navigator class="pr" :url="'../product/detail?productId='+item.id" hover-class="changestyle"
				v-for="(item, index) in productData">
				<image class="photo" :src="item.photo_x"></image>
				<view class="title">{{item.name}}</view>
				<view style="display:flex;line-height:50rpx;padding:10rpx 0;">
					<view class="gmxx" style="color:red;">¥ {{item.price_yh}}</view>
					<view class="gmx">¥ {{item.price}}</view>
				</view>
				<view style="display:flex;line-height:50rpx;color:#999">
					<view class="gmxx" style="font-size:28rpx;width:30%">
						<text v-if="item.is_show==1">新品</text>
						<text v-else-if="item.is_hot==1">热销</text>
						<text v-else>推荐</text>
					</view>
					<view class="ku" style="width:60%">销量：{{item.shiyong}}</view>
				</view>
			</navigator>
		</view>
		<view class="clear mt10" @click="getMore">点击查看更多</view>
	</sz-main>
</template>

<script>
	import {
		request
	} from "@/utils/request";
	import config from "@/utils/config";

	var appName = config.appName;

	export default {
		data() {
			return {
				appName: appName,
				isFirst: false,
				imgUrls: [],
				indicatorDots: true,
				autoplay: true,
				interval: 5000,
				duration: 1000,
				circular: true,
				productData: [],
				proCat: [],
				page: 2,
				index: 2,
				brand: [],
				// 滑动
				imgUrl: [],
				kbs: [],
				lastcat: [],
				course: []
			}
		},
		onLoad() {
			let self = this; // 设置页面标题：文章分类

			uni.setNavigationBarTitle({
				title: appName
			});

			let isFirstStorage = uni.getStorageSync('isFirst');
			if (!isFirstStorage) {
				uni.setStorageSync('isFirst', 'no');
			}

			request.post('/Api/Index/index').then(e => {
				this.imgUrls = e.ggtop;
				this.proCat = e.procat,
				this.productData = e.prolist;
				this.brand = e.brand;
				this.course = e.course;
			});
		},
		methods: {
			getMore() {
				request.post('/Api/Index/getlist', {
					page: this.page
				}).then(res => {
					let prolist = res.prolist;
					if (prolist == '' ) {
						uni.showToast({
							icon: "none",
							title: "没有更多数据"
						});
						return false;
					}
					this.page += 1;
					this.productData.push(...prolist);
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.swiper-item {
		display: block;
		height: 150px;
	}

	.slide-image {
		width: 100%;
		height: 150px;
	}

	.cont {
		width: 100%;
		padding-top: 10rpx;
		.pr {
			margin-bottom: 10px;
			background: #fff;
			display: inline-block;
			width: 46%;
			border: 1px solid #EDEDED;
			margin-left: 18rpx;
			.photo {
				height: 345rpx;
				width: 345rpx;
			}
			.title {
				font-size: 28rpx;
				color: #333;
				line-height: 20px;
				margin: 0;
				height: 40px;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				padding: 1% 5% 0 5%;
			}
			.gmxx {
				padding-left: 20rpx;
				width: 74%;
			}
			.gmx {
				text-align: left;
				width: 50%;
				font-size: 26rpx;
				margin-right: 10rpx;
				text-decoration: line-through;
				color: #999
			}
			.ku {
				text-align: right;
				width: 50%;
				font-size: 26rpx;
				margin-right: 10rpx;
			}
		}
	}
	.mt10 {
		margin: 0 auto;
		text-align: center;
		height: 70rpx;
		width: 450rpx;
		line-height: 70rpx;
		border-radius: 10rpx;
		border: 1px solid #999;
		font-size: 30rpx;
		margin-top: 30rpx;
	}
</style>