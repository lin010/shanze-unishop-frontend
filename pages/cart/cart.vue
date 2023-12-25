<template>
	<sz-main tabbar>
		<sz-navbar :back="false" bg="sz-BG-Main" op isSlot>
			<view class="flex-center p-3 sz-col-12">
				<text>购物车</text>
			</view>
		</sz-navbar>
		<view class="page">
			<view class="container carts-list" v-if="carts==''">
				<view class="pp">
					<image class="kong" src="/static/images/cart.jpg" mode="aspectFill" />
					<view class="cla">购物车空空如也</view>
				</view>
			</view>
			<view class="container carts-list">
				<view v-for="(item, index) in carts" class="carts-item" :data-title="item.pro_name" :id="item.id">
					<icon v-if="item.selected" type="success_circle" size="20" @click="bindCheckbox"
						:data-index="index" />
					<icon v-else type="circle" size="20" @click="bindCheckbox" :data-index="index" />
					<view>
						<image class="carts-image" :src="item.photo_x" mode="aspectFill" />
					</view>
					<view class="carts-text">
						<text class="carts-title">{{item.pro_name}}</text>
						<view class="carts-subtitle">
							<text class="carts-price">¥ {{item.price}}</text>
						</view>
					</view>
					<view class="title">
						<text @click="removeShopCard" :data-cartid="item.id" class="modal-close">x</text>
						<view class="stepper">
							<!-- 减号 -->
							<text :class="minusStatuses[index]" :data-index="index" @click="bindMinus"
								:data-cartid="item.id">-</text>
							<!-- 数值 -->
							<input type="number" disabled :value="item.num" />
							<!-- 加号 -->
							<text class="normal" :data-index="index" @click="bindPlus" :data-cartid="item.id">+</text>
						</view>
					</view>
				</view>
			</view>

			<!--底部-->
			<view class="carts-footer" :style="{bottom: bottomOffset + 'px'}">
				<view @click="bindSelectAll" class="flex" style="align-items: center;">
					<icon v-if="selectedAllStatus" type="success_circle" size="24" style="margin-top: 0;"/>
					<icon v-else type="circle" size="24" style="margin-top: 0;"/>
					<text>全选</text>
					<text class="reds">{{total}}</text>
				</view>
				<view class="button" @click='bindCheckout'>立即结算 </view>
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
				page: 1,
				minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled'],
				total: 0,
				carts: [],
				selectedAllStatus: false,
				bottomOffset: 55
			}
		},
		onShow() {
			this.loadProductData();
			this.bottomOffset = uni.getStorageSync('tabbar');
		},
		methods: {
			bindCheckout() {
				// 初始化toastStr字符串
				let toastStr = '';
				// 遍历取出已勾选的cid
				for (let i = 0; i < this.carts.length; i++) {
					if (this.carts[i].selected) {
						toastStr += this.carts[i].id;
						toastStr += ',';
					}
				}
				if (toastStr == '') {
					uni.showToast({
						icon: "none",
						title: "请选择要结算的商品！"
					});
					return false;
				}
				uni.navigateTo({
					url: '/pages/order/pay?cartId=' + toastStr
				})
			},
			bindSelectAll() {
				// 取反操作
				this.selectedAllStatus = !this.selectedAllStatus;
				// 购物车数据，关键是处理selected值
				for (let i = 0; i < this.carts.length; i++) {
					this.carts[i].selected = this.selectedAllStatus;
				}
				this.sum();
			},
			bindPlus(e) {
				var index = parseInt(e.currentTarget.dataset.index),
					num = this.carts[index].num,
					cart_id = e.currentTarget.dataset.cartid;

				// 自增
				num++;

				request.post('/Api/Shopping/up_cart', {
					user_id: this.sz_userId,
					num: num,
					cart_id: cart_id
				}).then(res => {
					if (res.status == 1) {
						// 只有大于一件的时候，才能normal状态，否则disable状态
						let minusStatus = num <= 1 ? 'disabled' : 'normal';
						// 购物车数据
						this.carts[index].num = num;
						// 按钮可用状态
						this.minusStatuses[index] = minusStatus;

						this.sum();
					} else {
						uni.showToast({
							icon: "none",
							title: "操作失败！"
						});
					}
				});
			},
			bindMinus(e) {
				var index = parseInt(e.currentTarget.dataset.index),
					num = this.carts[index].num,
					cart_id = e.currentTarget.dataset.cartid;

				// 如果只有1件了，就不允许再减了
				if (num > 1) num--;

				request.post('/Api/Shopping/up_cart', {
					user_id: this.sz_userId,
					num: num,
					cart_id: cart_id
				}).then(res => {
					if (res.status == 1) {
						// 只有大于一件的时候，才能normal状态，否则disable状态
						let minusStatus = num <= 1 ? 'disabled' : 'normal';
						// 购物车数据
						this.carts[index].num = num;
						// 按钮可用状态
						this.minusStatuses[index] = minusStatus;

						this.sum();
					} else {
						uni.showToast({
							icon: "none",
							title: "操作失败！"
						});
					}
				});
			},
			removeShopCard(e) {
				let cardId = e.currentTarget.dataset.cartid,
					that = this;
				uni.showModal({
					title: '提示',
					content: '你确认移除吗',
					success(e) {
						if (e.confirm) {
							request.post('/Api/Shopping/delete', {
								cart_id: cardId
							}).then(res => {
								if (res.status == 1) {
									that.loadProductData();
								} else {
									uni.showToast({
										icon: "none",
										title: "操作失败！"
									});
								}
							});
						}
					}
				});
			},
			bindCheckbox(e) {
				let index = parseInt(e.currentTarget.dataset.index),
					selected = this.carts[index].selected;
				// 对勾选状态取反
				this.carts[index].selected = !selected;
				this.sum();
			},
			loadProductData() {
				request.post('/Api/Shopping/index', {
					user_id: this.sz_userId
				}).then(res => {
					this.carts = res.cart;
					this.sum();
				});
			},
			sum() {
				var carts = this.carts,
					total = 0,
					i;
				// 计算总金额
				for (i = 0; i < carts.length; i++) {
					if (carts[i].selected) {
						total += carts[i].num * carts[i].price;
					}
				}
				this.carts = carts;
				this.total = '¥ ' + total;
			}
		}
	}
</script>

<style lang="scss" scoped>

	.page view{box-sizing: content-box;}

	/*外部容器*/
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
	}

	/*复选框样式*/
	.carts-list icon {
		margin-top: 60rpx;
		margin-right: 20rpx;
	}

	/*整体列表*/
	.carts-list {
		display: flex;
		flex-direction: column;
		padding: 20rpx 40rpx;
		background: #fff;
		
		/*每行单元格*/
		.carts-item {
			display: flex;
			flex-direction: row;
			height: 150rpx;
			/*width属性解决标题文字太短而缩略图偏移*/
			width: 100%;
			border-bottom: 1px solid #eee;
			padding: 30rpx 0;
			
			/*左部图片*/
			.carts-image {
				width: 150rpx;
				height: 150rpx;
			}
			
			/*右部描述*/
			.carts-text {
				width: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				
				/*右上部分标题*/
				.carts-title {
					margin: 10rpx;
					font-size: 28rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					width: 201rpx;
				}
				
				/*右下部分价格与数量*/
				.carts-subtitle {
					font-size: 25rpx;
					color: darkgray;
					padding: 0 20rpx;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					
					/*价格*/
					.carts-price {
						color: #f60;
					}
				}
			}
		}
	}

	.kong {
		width: 200rpx;
		height: 200rpx;
	}

	/*底部按钮*/
	.carts-footer {
		width: 100%;
		height: 80rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		position: fixed;
		bottom: 55px;
		border-top: 1px solid #eee;
		background: #ffffff;
		z-index: 999;
		
		/*复选框*/
		icon {
			margin-left: 20rpx;
			margin-top: 10rpx;
			color: #fff;
		}
		
		text {
			font-size: 32rpx;
			margin-left: 8rpx;
			line-height: 10rpx;
		}
		
		/*立即结算按钮*/
		.button {
			line-height: 80rpx;
			text-align: center;
			width: 220rpx;
			height: 80rpx;
			background-color: #FF8247;
			color: white;
			font-size: 36rpx;
			font-weight: 700;
			border-radius: 0;
			border: 0;
		}
	}

	.stepper {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding-top: 40rpx;
		
		text {
			background-color: #f2f2f2;
			margin: 5px 0;
			width: 26px;
			height: 26px;
			line-height: 26px;
			text-align: center;
			font-weight: 900;
			color: #939393;
			border-radius: 6rpx;
			border: 1px solid #fff;
			/*border-left:1px solid #fff ;*/
		}
		
		input {
			width: 43px;
			height: 25px;
			text-align: center;
			/*background-color: #f2f2f2;*/
			border-radius: 6rpx;
			border-top: 1px solid #f2f2f2;
			border-bottom: 1px solid #f2f2f2
		}
	}
	
	.modal-close {
		margin-left: 200rpx;
		padding: 20px 0;
		color: #939393;
	}

	.reds {
		color: red;

	}

	.pp {
		text-align: center;
		margin-top: 264rpx;
	}

	.cla {
		font-family: '微软雅黑';
		color: #ccc;

	}
</style>
