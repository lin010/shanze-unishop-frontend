<template>
	<sz-main tabbar>
		<sz-navbar :back="true" bg="sz-BG-Main" op>
			<text slot="center">订单详情</text>
		</sz-navbar>
		
		<view class="w100">
			<view class="p_all bg_white df item" v-for="(item, index) in proData" :key="index">
				<view class="cp_photo">			
					<image :src="item.photo_x"></image>
				</view>
				<view class="df_1">	
					<view class="font_14 mt5 ovh1">{{item.name}}</view>
					<text class="gm_ovh_1h red pt10">¥{{item.price}}</text>
					<view class="sl">数量：{{item.num}}</view>
				</view>
			</view>		
		</view>
		
		<view class="p_all bg_white mt10 font_14">
			<view class="df">
				<view class="df_1 c6">
				<view class="l_h20">收货人：{{orderData.receiver}}<text class="fl_r mr10">{{orderData.tel}}</text></view>
				<view class="l_h20 mt5">地址：{{orderData.address_xq}}</view>
				</view>
			</view>
		</view>	
		
		<view class="p_all bg_white mt10 c6 l_h20  font_14">
			<view >
				订单状态：<text class="red">{{orderData.order_status}}</text>
			</view>
			<view >
				订单编号：{{orderData.order_sn}}
			</view>
			<view class="mt10">
				订单时间：{{orderData.addtime}}
			</view>         
		</view>
		
		<view class="p_all bg_white mt10 font_14">
			<textarea class="min_60" auto-height name="remark" disabled placeholder="订单备注" :value="orderData.remark ? orderData.remark : '未备注'"/> 
		</view>	
		
		<view class="zhifu mt10 tc">金额：<span class="font_20 red">¥ {{orderData.price}}</span></view>
		
		<view class="p_all mt10">
			<view class="btnGreen">
				<!-- <button type="warn" size="{{warnSize}}" loading="{{loading}}" plain="{{plain}}"
					disabled="{{disabled}}" bindtap="warn"> 确认 </button> -->
				<!--<contact-button type="default-light" session-from="orderNo_{{orderData.OrderNo}}">
					客服
				</contact-button>-->
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
				orderId:0,
				orderData:{},
				proData:[],
			}
		},
		computed: {},
		onLoad(options){
			this.orderId = options.orderId;
			this.loadProductDetail();
		},
		methods: {
			loadProductDetail(){
				let that = this;
				request.post('/Api/Order/order_details', {
					order_id: that.orderId,
				}).then(res => {
					let status = res.status;
					if(status == 1){
						let pro = res.pro, ord = res.ord;
						this.orderData = ord;
						this.proData = pro;
						
					}else{
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
.item .cp_photo{ 
    width: 60px; 
    height: 60px;
    overflow: hidden; 
    border-radius: 3px; 
    margin-right: 10px;
}
.item .cp_photo image{ 
    width: 60px; 
    height: 60px;
}
.gm_ovh_2h{
    line-height:25px; 
    height: 50px; 
    margin:0; 
    overflow:hidden;  
    text-overflow:ellipsis; 
    display:-webkit-box; 
    -webkit-line-clamp:2;  
    -webkit-box-orient:vertical; 
    font-size: 16px;
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
.h10_hui{
    height: 10px;
    width: 100%;
    background: #eee;
}

.min_60{
    min-height: 60px;
}

.w100{ width: 100%}

.iconWarn{
   vertical-align:top;padding-right:2px;
}

.iconClear{
  float:right;
  padding-top: 5px;
  padding-left: 10px;
  padding-right:10px;
  margin-top:-36px;
  height: 28px;
}

.inputStyle{
  height: 36px;
  line-height: 36px;
  padding-left: 2px;
  width:80%;
}

.tips{
  margin-bottom:10px;
}
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
.gms_view{  
    width: 100%;
    display: inline-block;
    text-align: right;
}
.gms_view navigator{
    border: 1px solid #ddd;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    color: #666;
    font-size: 12px;
    text-align: center;
    line-height: 22px;
    float: right;
    font-weight: bold;
    
}
.gms_view input{
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 2px;
    font-size: 12px;
    width: 30px;
    margin: 0 5px;
    text-align: center;
    color: #999;
    float: right;
}

.red{
    color: red;
}

.sl{
  font-size: 12px;
  color: #999;
}
</style>