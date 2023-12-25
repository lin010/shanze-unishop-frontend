<template>
	<sz-main >
		
		<sz-navbar :back="true" bg="sz-BG-Main" op>
			<text slot="center">地址管理</text>
		</sz-navbar>
		
		<radio-group class="radio-group" >
			<view class="address" v-for="(item, index) in address" >
				<view class="address-icon" @click="setDefault(item.id)">
					<radio :checked="item.is_default == 1 ? true : false" disabled :value="index+''" />
				</view>
				<view class="address-detail">
					<view class="address-name-phone">
						<text class="address-name">{{item.name}}</text>
						<text class="address-phone">{{item.tel}}</text>
					</view>
					<view class="address-info">{{item.address_xq}}</view>
					<view class="address-edit">
						<view>
							<text :hidden="item.is_default == 0 ? false:true"></text>
						</view>
						<view>
							<text :hidden="item.is_default == 0 ? false : true" @click="setDefault(item.id)">设置默认</text>
							<text :hidden="item.is_default == 0 ? false : true"> | </text>
							<text @click="delAddress(index)">删除</text>
						</view>
					</view>
				</view>
			</view>
		</radio-group>
		<navigator :url="'/pages/address/address?cartId='+cartId" style="width:100%;">
			<view class="add-address">
				<image class="add-address-icon" src="#"></image>
				<view>新增地址</view>
			</view>
		</navigator>
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
				address: [],
				radioindex: '',
				pro_id:0,
				num:0,
				cartId:0
			}
		},
		onLoad: function (options) {
			// 页面初始化 options为页面跳转所带来的参数
			this.cartId = options.cartId || '';
			this.dataOnLoad();
		},
		methods: {
			setDefault(addrId){
				request.post('/Api/Address/set_default', {
					uid: this.sz_userId,
					addr_id: addrId
				}).then(res => {
					if(res.status == 1){
						if (this.cartId) {
							uni.redirectTo({
								url: '/pages/order/pay?cartId=' + this.cartId
							});
							return;
						}
						uni.showToast({
							icon: "none",
							title: "操作成功"
						});
						this.dataOnLoad();
					}
				});
			},
			delAddress(index){
				let that = this;
				uni.showModal({
					title: '提示',
					content: '你确认移除吗',
					success(e){
						if(e.confirm){
							request.post('/Api/Address/del_adds', {
								user_id: that.sz_userId,
								id_arr: that.address[index].id
							}).then(res => {
								 if(res.status == 1){
									that.address.splice(index, 1);
								}
							});
						}
					}
				});
			},
			dataOnLoad(){
				request.post('/Api/Address/index', {
					user_id: this.sz_userId,
				}).then(res => {
					// success
					this.address = res.adds || [];
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .page-body-main {
		background-color: #efeff4;
		font-size: 10pt;
		-webkit-user-select: none;
		user-select: none;
		overflow-x: hidden;
	}
	.address {
		display: flex;
		flex-wrap: wrap;
		background-color: #fff;
		margin-top: 1px;
		padding: 30rpx;
		margin: 30rpx 0;
		.address-icon {
			width: 100rpx;
		}
		.address-detail {
			width: 590rpx;
			.address-name-phone {
				margin-bottom: 20rpx;
				font-size: 11pt;
				font-weight: 900;
			}
			.address-name{
				margin-right: 20rpx;
			}
			.address-info {
				margin-bottom: 30rpx;
			}
			.address-edit {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				border-top: 1px #efeff4 solid;
				padding-top: 30rpx;
			}
		}
	}
	.add-address {
		width:100%;
		display: flex;
		align-items: center;
		margin-top: 20px;
		padding: 18rpx;
		background-color: #fff;
		font-size: 11pt;
		font-weight: 900;
	}
	.add-address-icon {
		height: 20px;
		width: 20px;
	}
</style>