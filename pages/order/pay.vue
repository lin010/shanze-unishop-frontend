<template>
	<sz-main>
		<sz-navbar :back="true" bg="sz-BG-Main" op>
			<text slot="center">订单确认</text>
		</sz-navbar>
		
		<view class="w100">
			<view class="p_all bg_white df item" v-for="(item, index) in productData" :key="index">
				<view class="cp_photo">			
					<image :src="item.photo_x"></image>
				</view>
				<view class="df_1">	
					<view class="font_14 mt5 ovh1">
						{{item.name}}
					</view>
					<text class="gm_ovh_1h red pt10">¥{{item.price}}</text>
					<text class="gm_ovh_1h pt10">数量：{{item.num}}</text>
				</view>
			</view>
			
			<view class="p_all bg_white mt10 font_14" v-if="addemt==0">
				<navigator :url="`/pages/address/user-address/user-address?cartId=${cartId}`" hover-class="none" style="width:100%;">
					<view class="df" style="width: 100%;">
						<view class="df_1 c6">
							<view class="l_h20">收货人：{{address.name}}<text style="margin-left:20rpx">{{address.tel}}</text></view>
							<view class="l_h20 mt5">地址：{{address.address_xq}}</view>
						</view>
						<image class="x_right mt15" src="/static/images/x_right.png"></image>
					</view>
				</navigator>
			</view>
			<view class="p_all bg_white mt10 font_14" v-else>
				<navigator :url="`/pages/address/user-address/user-address?cartId=${cartId}`" hover-class="none">
					<view class="df">
				        <text>添加收货地址</text>
					</view>
				</navigator>
			</view>
			
			<view class="xuan" v-if="vou != ''">
				<view class="hui"><text>可使用优惠券：</text></view>
				<!--设置监听器，当点击radio时调用-->
				<radio-group @change="listenerRadioGroup" class="hui">
					<!--label通常与radio和checkbox结合使用-->
					<label style="display: flex" v-for="(item, index1) in vou" :key="index1" class="xuan" @click="getvou" :data-id="item.vid" :data-price="item.amount">
						<radio :value="item.vid" />满{{item.full_money}}立减{{item.amount}}元
					</label>
					<label style="display: flex" class="xuan" @click="getvou" :data-id="0" :data-price="0">
						<radio value="0" />不使用优惠券
					</label>
				</radio-group>
			</view>
			
			<view class="p_all bg_white mt10">
			    <textarea class="min_60 font_14" auto-height name="remark" placeholder="备注" @input="remarkInput" :value="remark" />
			</view>
			
			<view class="zhifu mt10 tc">应共支付：<span class="font_20 red">¥ {{total}}</span></view>
			
			<view class="p_all mt10">
				<view class="btnGreen">
					<button class="wx_pay_submit" type="primary" id="wxPay" :disabled="btnDisabled" formType="submit" @click="createProductOrderByWX">微信支付</button>
					<button class="xx_pay_submit" type="default" id="xxPay" :disabled="btnDisabled" formType="submit" @click="createProductOrderByXX">线下支付</button>
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
				itemData:{},
				userId:0,
				paytype:'weixin',//0线下1微信
				remark:'',
				cartId:0,
				addrId:0,//收货地址//测试--
				btnDisabled:false,
				productData:[],
				address:{},
				total:0,
				vprice:0,
				vid:0,
				addemt:1,
				vou:[]
			}
		},
		onLoad(options){
			this.cartId = options.cartId || '';
			this.userId = this.sz_userId;
			this.loadProductDetail();
		},
		methods: {
			//微信支付
			createProductOrderByWX(){
				this.paytype = 'weixin';
				this.createProductOrder();
			},
			//线下支付
			createProductOrderByXX(){
				
			},
			//确认订单
			createProductOrder(){
				request.post('/Api/Payment/payment', {
					uid: this.sz_userId,
					cart_id: this.cartId,
					type: this.paytype,
					aid: this.addrId,//地址的id
					remark: this.remark,//用户备注
					price: this.total,//总价
					vid: this.vid,//优惠券ID
				}).then(res => {
					if(res.status == 1){
						//创建订单成功
						if(res.arr.pay_type == 'cash'){
							uni.showToast({
								icon: "none",
								title: "请自行联系商家进行发货!"
							});
						}else if(res.arr.pay_type == 'weixin'){
							//微信支付
							this.wxpay(res.arr);
						}
					}else{
						uni.showToast({
							icon: "none",
							title: "下单失败!"
						});
					}
				});
			},
			//调起微信支付
			wxpay(order){
				request.post('/Api/Wxpay/wxpay', {
					order_id: order.order_id,
					order_sn: order.order_sn,
					uid: this.sz_userId,
				}).then(res => {
					if(res.status == 1){
						var order = res.arr;
						console.log('order', order);
						wx.requestPayment({
							timeStamp: order.timeStamp,
							nonceStr: order.nonceStr,
							package: order.package,
							signType: 'MD5',
							paySign: order.paySign,
							success: function(res){
								uni.showToast({
									icon: "none",
									title: "支付成功!"
								});
								setTimeout(function(){
									uni.redirectTo({
										url: '/pages/user/dingdan?currentTab=1&otype=deliver'
									})
								},2500);
							},
							fail: function(res) {
								uni.showToast({
									icon: "none",
									title: res
								});
							}
						})
					}else{
						wx.showToast({
							title: res.data.err,
							duration: 2000
						});
					}
				});
			},
			remarkInput(e){
				this.remark = e.detail.value;
			},
			listenerRadioGroup(e){},
			loadProductDetail(){
				request.post('/Api/Payment/buy_cart', {
					cart_id: this.cartId,
					uid: this.userId,
				}).then(res => {
					if(res.err){
						uni.showToast({
							icon: "none",
							title: res.err
						});
					}else{
						let adds = res.adds;
						if (adds){
							this.address = adds;
							this.addrId = adds.id;
						}
						this.addemt = res.addemt;
						this.productData = res.pro;
						this.total = res.price;
						this.vprice = res.price;
						this.vou = res.vou;
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item{
		.cp_photo{
		    width: 60px; 
		    height: 60px;
		    overflow: hidden; 
		    border-radius: 3px; 
		    margin-right: 10px;
			
			image{
			    width: 60px; 
			    height: 60px;
			}
		}
	}
	
	.gm_ovh_1h{
	    line-height:25px; 
	    height: 25px; 
	    margin:0; 
	    overflow:hidden;  
	    text-overflow:ellipsis; 
	    display:-webkit-box; 
	    -webkit-line-clamp:2;  
	    -webkit-box-orient:vertical; 
	    font-size: 16px;
	} 
	
	.min_60{
	    min-height: 60px;
	}
	
	.w100{ width: 100%}
	
	.x_right{
	    width:16px;
	    height: 18px;
	    display:inline-block; 
	    vertical-align: middle;
	    float: right; 
	}
	
	.zhifu{
	    background: #fff;
	    margin-bottom: 1px;
	    padding: 4%;
	    width: 92%;
	    font-size: 14px;
	    color: #666;
	}
	
	.font_20{
	    font-size: 20px;
	    font-weight: bold;
	}
	
	.xx_pay_submit{
	  margin-top: 10px;
	}
	
	.hui{
	    margin-left: 28rpx;
	    font-size: 30rpx;
	    
	}
	
	.xuan{
	    padding: 10rpx 0;
	    font-size: 30rpx;
	}
</style>