import Vue from 'vue'
import {
	mapState
} from 'vuex';
const mixin = {
	data() {
		return {
			_uid: this._uid, //vue实例id
			sz_scrollTop: 0, //实例所在页面滚动值
			sz_atPage: true, //实例是否在页面里显示
			sz_layer: 0, //实例层级
			slots:{}
		};
	},
	watch: {},
	computed: {
		...mapState({
			sz_theme: state => state.sz_theme,
			sz_main: state => state.sz_main,
			sz_info: state => state.sz_info,
			sz_text: state => state.sz_text,
			sz_statusBar: state => state.sz_statusBar,
			sz_homePath: state => state.defStore.homePath
		}),
		sz_navBar() {
			return this.$store.getters.sz_navBar
		},
		sz_capsule() {
			return this.$store.getters.sz_capsule
		},
		sz_isFirstPage() {
			//实例是否为路由栈的第一个页面
			let pages = getCurrentPages(); 
			return pages.length == 1
		},
		isPc(){
			return uni.getSystemInfoSync().windowWidth > 750
		}
	},
	created() {
		if (this._uid != this.$root._uid) {
			this._onShow();
		}
		if (this.$parent) {
			this.sz_layer = (this.$parent.sz_layer ? this.$parent.sz_layer : 0) + 1
		}
	},
	onLoad() {},
	onShow() {
		uni.$emit('_onShow_' + this._uid);
	},
	onReachBottom() {
		uni.$emit('_onReachBottom_' + this._uid);
	},
	mounted() {
		uni.$on('_onShow_' + this.$root._uid, () => {
			this._onShow();
		})
		uni.$on('_onHide_' + this.$root._uid, () => {
			this._onHide();
		})
		uni.$on('_onReachBottom_' + this.$root._uid, () => {
			this._onReachBottom();
		})
	    this.slots = this.$scopedSlots;
	},
	onReady() {
		this._h5SetScrollTop();
	},
	onShow() {
		this._h5SetScrollTop();
	},
	onHide() {
		uni.$emit('_onHide_' + this._uid);
	},
	destroyed() {
		uni.$off('_onShow_' + this._uid);
		uni.$off('_onHide_' + this._uid);
		this.sz_atPage = false;
	},
	onPageScroll(e) {
		this.sz_scrollTop = e.scrollTop;
		uni.$emit('_scrollTop_' + this._uid, e.scrollTop)
		if (e.scrollTop < 0) {
			return false
		}
	},
	methods: {
		_h5SetScrollTop(){
			this.$nextTick(function() {
				// #ifdef H5
				// 刷新后保持导航栏位置x
				let top = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop
				this.sz_scrollTop = top;
				uni.$emit('_scrollTop_' + this.$root._uid, top);
				// #endif
				uni.$emit('_hideLoading_' + this.$root._uid, false);
			});
		},
		_onShow() {
			this.sz_atPage = true;
		},
		_onReachBottom() {},
		_onHide() {
			this.sz_atPage = false;
		},
		_backPage() {
			if (this.sz_isFirstPage) {
				this._toHome();
			} else {
				// #ifdef H5
				window.history.back();
				// #endif
			
				// #ifndef H5
				uni.navigateBack({
					delta: 1,
					fail(res) {
						console.log(res);
					}
				});
				// #endif
			}
		},
		_toHome() {
			uni.switchTab({
				url: this.sz_homePath,
				fail(res) {
					console.log(res);
				}
			});
		},
		_has(data, str) {
			 return data.indexOf(str) != -1
		},
		_to(url, type = '') {
			switch (type) {
				case 'switchTab':
					uni.switchTab({
						url: url,
						fail(res) {
							console.log(res);
						}
					});
					break;
				case 'reLaunch': 
					uni.reLaunch({
						url: url,
						success(res) {
							console.log(res);
						},
						fail(res) {
							console.log(res);
						}
					});
					break;
				case 'redirectTo':
					uni.redirectTo({
						url: url,
						fail(res) {
							console.log(res);
						}
					});
					break;
				default:
					uni.navigateTo({
						url: url,
						fail(res) {
							console.log(res);
						}
					})
					break;
			}
		},
		_getParent(name) {
			let parent = this.$parent;
			if (parent) {
				let parentName = parent.$options.name;
				while (parentName !== name) {
					parent = parent.$parent;
					if (parent) {
						parentName = parent.$options.name;
					} else {
						return null;
					}
				}
				return parent;
			}
			return null;
		},
	}
}

export default mixin
Vue.mixin(mixin)