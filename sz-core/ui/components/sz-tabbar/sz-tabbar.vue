<template>
	<sz-fixed bottom @getHeight="tabbarheight" :bg="bg" :placeholder="true" :ui="ui" :noFixed="noFixed">
		<view class="sz-tabbar-box">
			<view class="sz-tabbar">
				<block class="" v-for="(item, index) in tabbar" :key="index">
					<view class="sz-tabbar-item" :class="[index == cur ? curText : text, item.type, { cur: index == cur }]" @tap="clickItem(item)">
						<view class="sz-tabbar-icon" :class="item.center ? `center border shadow-${sz_main}` : ''">
							<text class="iconfont" :class="index == cur ? item.curIcon : item.icon" ></text>
						</view>
						<view class="sz-tabbar-text">{{ item.title }}</view>
					</view>
				</block>
			</view>
		</view>
	</sz-fixed>
</template>

<script>
	export default {
		name: 'SzTabbar',
		data() {
			return {
				cur: 0
			};
		},
		props: {
			tpl: {
				type: String,
				default: ''
			},
			icon: {
				type: String,
				default: ''
			},
			bg: {
				type: String,
				default: 'bg-blur'
			},
			ui: {
				type: String,
				default: ''
			},
			curText: {
				type: String,
				default: 'sz-TC-Main'
			},
			text: {
				type: String,
				default: 'text-c'
			},
			noFixed: {
				type: Boolean,
				default: false
			}
		},
		watch: {},
		computed: {
			tabbar() {
				return this.$store.getters.sz_getTabbar;
			}
		},
		created() {
			uni.hideTabBar();
		},
		methods: {
			_onShow() {
				let page = getCurrentPages();
				let url = page[page.length - 1].route
				this.tabbar.map((item,index)=>{
					if(item.url == '/'+url){
						this.cur = index
					}
				})
			},
			clickItem(item) {
				if (item.type == 'tab') {
					this.changeTab(item.url);
				}
				if (item.type == 'nav') {
					this.navTo(item.url);
				}
			},
			changeTab(url) {
				uni.switchTab({
					url: url,
					fail(res) {
						console.log(res);
					}
				});
			},
			navTo(url) {
				uni.navigateTo({
					url: url,
					fail(res) {
						console.log(res);
					}
				});
			},
			tabbarheight(val) {
				uni.setStorageSync('tabbar', val);
			}
		}
	}
</script>

<style lang="scss">
	.sz-tabbar-box {
		.sz-tabbar {
			padding: 10rpx;
			display: flex;
			.sz-tabbar-item {
				text-align: center;
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				position: relative;
				z-index: 10;
				.sz-tabbar-icon {
					height: 60rpx;
					width: 60rpx;
					position: relative;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 45rpx;
					
					.sz-tabbar-image {
						width: 50rpx;
						height: 50rpx;
					}
					
					&.center {
						background-color: var(--sz-BG-Main);
						border-radius: 50%;
						color: #ffffff;
						font-size: 32rpx;
						transform: scale(1.3) translateY(-6px);
					}
					
					.badge {
						top: 0;
					}
				}
				
				.sz-btn {
					margin-top: -10px;
					margin-bottom: 5px;
					position: relative;
				}
				
				.sz-tabbar-text {
					font-size: 24rpx;
					color: var(--sz-TC-2);
				}
				
				&.cur .sz-tabbar-text {
					color: var(--sz-TC-Main);
				}
			}
		}
	}
</style>