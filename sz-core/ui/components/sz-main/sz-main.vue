<template>
	<view class="sz-page" :class="['theme-' + sz_theme, 'main-' + sz_main, 'font-' + sz_text]">
		<view class="page-body" :class="[bg, ui]" :style="[styles]">
			<view class="page-body-main">
				<sz-navbar :back="true" :bg="navBg"  v-if="title"></sz-navbar>
				<slot></slot>
				<sz-footer v-if="footer"></sz-footer>
				<sz-tabbar ui="shadow border-top" v-if="tabbar"></sz-tabbar>
				
				<view class="loading-body bg-blur" :style="[{ zIndex: 1999 }]" v-if="isloading">
					<view class="_icon-loading icon-spin text-sl mb-3"></view>
					<view>加载中</view>
				</view>
			</view>
			
			<sz-modal
				name="sz_dialog"
				:title="dialog.title"
				:content="dialog.content"
				:showCancel="dialog.showCancel"
				:cancelText="dialog.cancelText"
				:confirmText="dialog.confirmText"
				@success="dialog.success($event)"
			></sz-modal>
			
			<sz-toast
				name="sz_dialog"
				:title="toast.title"
				:duration="toast.duration"
				:mask="toast.mask"
				:isLoading="toast.isLoading"
				:image="toast.image"
				:icon="toast.icon"
				@success="toast.success($event)"
			></sz-toast>
			
			<image :src="img" mode="aspectFill" v-if="img" class="page-img"></image>
			
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	var _this = {};
	export default {
		name: 'SzMain',
		data() {
			return {
				isloading: true
			};
		},
		props: {
			styles: {
				type: Object,
				default() {
					return {};
				}
			},
			bg: {
				type: String,
				default: 'sz-BG'
			},
			ui: {
				type: String,
				default: ''
			},
			img: {
				type: String,
				default: ''
			},
			navBg: {
				type: String,
				default: 'bg-blur'
			},
			loading: {
				type: [String, Boolean],
				default: 'auto'
			},
			title: {
				type: String,
				default: ''
			},
			footer: {
				type: Boolean,
				default: true
			},
			tabbar: {
				type: Boolean,
				default: false
			}
		},
		created() {
			_this = this;
			uni.$on('_hideLoading_' + this.$root._uid, e => {
				if (this.loading == 'auto') {
					this.isloading = e;
				}
			});
		},
		watch:{
			loading: {
				handler(val) {
					if (val == false) {
						this.isloading = false;
					}
				},
				immediate: true
			}
		},
		computed: {
			...mapState({
				dialog: state => state.modal.dialog,
				toast: state => state.modal.toast
			})
		},
		mounted() {
			setTimeout(() => {
				if (this.loading == 'auto') {
					this.isloading = false;
				}
			}, 800);
		},
		destroyed() {
			uni.$off('_hideLoading_' + this.$root._uid);
		},
		methods: {}
	}
</script>

<style lang="scss">
	.sz-page {
		position: relative;
		color: var(--sz-TC);
		background-color: var(--sz-BG-1) !important;
		z-index: 2;
		display: flex;
		.page-body {
			flex: 1;
			min-height: 100vh;
			position: relative;
			z-index: 1;
			overflow: hidden;
			.page-body-main {
				position: relative;
				z-index: 1;
				min-height: 100vh;
			}
			.page-img {
				height: 177vw;
				width: 100vw;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 0;
			}
		}
	}
	.loading-body {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}
</style>