<template>
	<sz-main tabbar>
		<sz-navbar :back="false" bg="sz-BG-Main" op isSlot>
			<view class="flex-center p-3 sz-col-12" > 
				<text>分类</text>
			</view>
		</sz-navbar>
		<view class="section" :style="sectionStyle">
			<!-- 左侧类型 -->
			<scroll-view scroll-y="true" class="left">
				<view v-for="(item, index) in types" :index="index" @click="tapType(item)"
					:class="[item.id == currType ? 'active' : '']" style="font-size:33rpx">
					{{item.name}}
				</view>
			</scroll-view>

			<!-- 右侧数据 -->
			<scroll-view scroll-y="true" class="right">
				<view class="typeTree">
					<view class="brand" v-for="(data, index) in typeTree" :index="index">
						<navigator :url="`../listdetail/listdetail?cat_id={$data.id}&title={$data.name}`" class="item">
							<image :src="data.bz_1"></image>
							<text>{{data.name}}</text>
						</navigator>
					</view>
				</view>
			</scroll-view>
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
				typeTree: {}, // 数据缓存
				currType: 0, // 当前类型
				types: [],
				typeTree: []
			}
		},
		onLoad() {
			request.post('/Api/Category/index').then(res => {
				if (res.status == 1) {
					this.types = res.list;
					this.typeTree = res.catList;
				} else {
					uni.showToast({
						icon: "none",
						title: res.err
					});
				}
			});
		},
		computed: {
			sectionStyle(){
				let top = this.sz_statusBar + this.sz_navBar, tabbarHeight = uni.getStorageSync('tabbar');
				return `top:${top}px;height:calc(100% - ${tabbarHeight + top}px)`;
			}
		},
		methods: {
			tapType(item) {
				this.currType = item.id;
				request.post('/Api/Category/getcat', {cat_id: this.currType}).then(res => {
					if (res.status == 1) {
						this.typeTree = res.catList;
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
	.section{ position: absolute; left:0; top:0; width: 100%; height: 100% ; overflow: hidden;}
	.left{ position: absolute; left: 0; top: 0; height: 100%; width: 90px; background: #F6F6F6; text-align: center;font-size:28rpx;}
	.left::before{ content: ""; position: absolute; background: #dcdcdc; right: 0; top: 0; height: 100%; }
	.left view.active{ background: #FFF; position: relative; z-index: 2;}
	.left view{ display: block; height: 60px; line-height: 60px; border-bottom: 0px solid #dcdcdc;}
	
	.right{ margin-left: 90px; height: 100%; overflow: hidden; width: auto;background: #fff;}
	.right text{ font-size: 15px}
	.typeTree{ padding-top: 10px;width: 100%}
	.typeTree .item{  text-align: center; display: inline-block; vertical-align: top;}
	.typeTree .brand,
	.typeTree .category{ flex-wrap: wrap; overflow: hidden;display: inline-block;width: 40%;margin-left: 6%}
	.typeTree .title{ padding: 10px 0; display: block; color: #333;}
	.typeTree image { width: 100px; margin: 0 auto;}
	.typeTree .brand image{ height: 100px;}
	.typeTree .category image{ height: 85px;}
	.typeTree .category{ padding-bottom: 10px;}
	.item text{ padding-bottom: 10px; display: block;}
</style>