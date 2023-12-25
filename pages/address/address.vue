<template>
	<sz-main >
		<sz-navbar :back="true" bg="sz-BG-Main" op>
			<text slot="center">地址管理</text>
		</sz-navbar>
		
		<view class="container">
			<form @submit="formSubmit">
				<view class="section">
					<input type="text" :hidden="true" :value="mid" name="user_id"/>
					<input type="text" name="name" placeholder="收货人姓名" />
				</view>
				<view class="section">
					<input type="text" name="phone" placeholder="电话号码" />
				</view>
				<view class="section">
					<picker @change="bindPickerChangeshengArr" :value="shengIndex" :range="shengArr" :data-id="shengId[shengIndex]">
				        <view class="picker">
							选择省份：{{shengArr[shengIndex]}}
							<input :hidden="true" name="province" :value="shengArr[shengIndex]"/>
				        </view>
					</picker>
				</view>
				<view class="section">
					<picker @change="bindPickerChangeshiArr" :value="shiIndex" :range="shiArr">
				        <view class="picker">
							选择城市：{{shiArr[shiIndex]}}
							<input :hidden="true" name="city" :value="shiArr[shiIndex]"/>
				        </view>
					</picker>
				</view>
				<view class="section">
					<picker @change="bindPickerChangequArr" :value="quIndex" :range="quArr">
				        <view class="picker">
							选择地区：{{quArr[quIndex]}}
							<input :hidden="true" name="town" :value="quArr[quIndex]"/>
				        </view>
					</picker>
				</view>
				<view class="section">
					<input type="text" class="ww" name="address" placeholder="详细地址" />
				</view>
				<view><label></label></view>
				<view class="btn-area">
					<button formType="submit">保存地址</button>
				</view>
			</form>
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
				shengArr: [],//省级数组
				shengId: [],//省级id数组
				shiArr: [],//城市数组
				shiId: [],//城市id数组
				quArr: [],//区数组
				shengIndex: 0,
				shiIndex: 0,
				quIndex: 0,
				mid: 0,
				sheng:0,
				city:0,
				area:0,
				code:0,
				cartId:0
			}
		},
		onLoad: function (options) {
			this.cartId = options.cartId || '';
			
			//获取省级城市
			request.post('/Api/Address/get_province', {}).then(res => {
				let status = res.status, province = res.list, sArr = [], sId = [];
				sArr.push('请选择');
				sId.push('0');
				for (let i = 0; i < province.length; i++) {
					sArr.push(province[i].name);
					sId.push(province[i].id);
				}
				this.shengArr = sArr;
				this.shengId = sId;
			});
		},
		methods: {
			formSubmit(e){
				let adds = e.detail.value;
				request.post('/Api/Address/add_adds', {
					user_id: this.sz_userId,
					receiver: adds.name,
					tel: adds.phone,
					sheng: this.sheng,
					city: this.city,
					quyu: this.area,
					adds: adds.address,
					code: this.code,
				}).then(res => {
					if(res.status == 1){
						uni.showToast({
							title: '保存成功！',
							icon: "none",
						});
						uni.redirectTo({
							url: 'user-address/user-address?cartId=' + this.cartId
						});
					}else{
						uni.showToast({
							title: res.err,
							icon: "none",
						});
					}
				});
			},
			bindPickerChangeshengArr(e){
				this.shengIndex = e.detail.value;
				this.shiArr = [];
				this.shiId = [];
				this.quArr = [];
				this.quiId = [];
				request.post('/Api/Address/get_city', {
					sheng:e.detail.value
				}).then(res => {
					// success
					if(res.err){
						uni.showToast({
							icon: "none",
							title: res.err
						});
						return;
					}
					let status = res.status, city = res.city_list, hArr = [], hId = [];
					hArr.push('请选择');
					hId.push('0');
					for (let i = 0; i < city.length; i++) {
						hArr.push(city[i].name);
						hId.push(city[i].id);
					}
					this.sheng  = res.sheng;
					this.shiArr = hArr;
					this.shiId  = hId;
				});
			},
			bindPickerChangeshiArr(e){
				this.shiIndex = e.detail.value;
				this.quArr = [];
				this.quiId = [];
				request.post('/Api/Address/get_area', {
					city: e.detail.value,
					sheng: this.sheng
				}).then(res => {
					if(res.err){
						uni.showToast({
							icon: "none",
							title: res.err
						});
						return;
					}
					let status = res.status, area = res.area_list, qArr = [], qId = [];
					qArr.push('请选择');
					qId.push('0');
					for (let i = 0; i < area.length; i++) {
						qArr.push(area[i].name)
						qId.push(area[i].id)
					}
					this.city = res.city;
					this.quArr = qArr;
					this.quiId = qId;
				});
			},
			bindPickerChangequArr(e){
				this.quIndex = e.detail.value;
				request.post('/Api/Address/get_code', {
					quyu: e.detail.value,
					city: this.city
				}).then(res => {
					this.area = res.area;
					this.code = res.code;
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .page-body-main {
		background-color: #efeff4;
	}
	
	.container {
		font-size: 12px;
		background-color: white;
		
		.section {
			height: 100rpx;
			border-bottom: 1px lightgrey solid;
			display: flex;
			align-items: center;
			margin: 0 30rpx;
		}
		
		.btn-area {
			display: flex;
			justify-content: center;
		}

		button {
			width: 90%;
			position: fixed;
			bottom: 40rpx;
			color: #fff;
			background-color: #fc0;
		}
		
		.picker {
			width: 600rpx;
			height: 100%;
		}
		
		.ww{
			width: 250px;
		}
	}
</style>