<template>
	<sz-main tabbar>
		<sz-navbar :back="true" bg="sz-BG-Main" op>
			<text slot="center">退货退款</text>
		</sz-navbar>
		
		<view class="w100">
			<view class="p_all">请认真填写好下面退货信息</view>
			<view class="p_all01 mt10 bg">
				<view class=" mt10">
					<!-- <view class="c3">退货描述</view> -->
					<textarea class="min_60 inputStyle" auto-height name="remark" placeholder="退款原因" @input="remarkInput" :value="remark"/> 
				</view>
				<!--<view class=" mt10">
					<view class="c3">图片凭证</view>
					<button bindtap="uploadImgs">上传图片</button>
				</view>-->
				
			</view>
			
			<view class="p_all01 mtt0">
				<view class="btnGreen">
					<button type="primary" hover-class="is-hover" style="backgroundColor:#1aad19;borderColor:#1aad19"  id="btnPay" formType="submit" @click="submitReturnData">确定</button>
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
				orderId:0,
				reason:'',
				remark:'',
				imgUrl:'',
			}
		},
		computed: {},
		onLoad(options){
			this.orderId = options.orderId;
		},
		methods: {
			submitReturnData(){
				//数据验证
				if(!this.remark){
					uni.showToast({
						icon: "none",
						title: "请填写退款原因"
					});
					return;
				}
				request.post('/Api/Order/orders_edit', {
					id: this.orderId,
					type:'refund',
					back_remark:this.remark,
				}).then(res => {
					var status = res.status;
					if(status == 1){
						uni.showToast({
							icon: "none",
							title: "您的申请已提交审核！"
						});
						uni.navigateBack();
					}else{
						uni.showToast({
							icon: "none",
							title: res.err
						});
					}
				});
			},
			reasonInput(){
				this.reason = e.detail.value;
			},
			remarkInput(e){
				this.remark = e.detail.value;
			},
			uploadImgs(){
				uni.chooseImage({
					success(res){
						let tempFilePaths = res.tempFilePaths;
						uni.uploadFile({
							url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							formData:{
								'user': 'test'
							},
							success(res){
								var data = res.data
							}
						});
					}
				})
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.is-hover {
		color: rgba(255, 255, 255, 0.6);
		background-color: #008842 !important;
		border-color: #008842 !important;
	}
	  
	.w100{ width: 100%}
	.p_all{
	    background: #fff;
	    width: 92%;
	    padding:2% 4%;
	    color: #666;
	    font-size: 14px;
	    display: block;
	    line-height: 25px;
	}
	.p_all01{
	    width: 92%;
	    padding:4%;
	    color: #666;
	    font-size: 14px;
	    display: block;
	    line-height: 25px;
		box-sizing: content-box;
		text{
		    width: 100%;
		    display: block;
		}
	}
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
		border:1px solid #ddd;
		border-radius: 3px;
		width: 100%;
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
	.min_60{
	    min-height: 60px;
	}
</style>