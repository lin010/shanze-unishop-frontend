import Vue from 'vue'
import Vuex from 'vuex'
import defStore from '@/sz-core/ui/store/def.js'
import modal from '@/sz-core/ui/store/modal.js'

Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		sz_theme: uni.getStorageSync('sz_theme') ? uni.getStorageSync('sz_theme') : defStore.state.theme, // light dark
		sz_main: uni.getStorageSync('sz_main') ? uni.getStorageSync('sz_main') : defStore.state.main, // color
		sz_text: 1,
		sz_info: uni.getSystemInfoSync(),
		sz_statusBar: uni.getSystemInfoSync().statusBarHeight,
		sz_tabbar: uni.getStorageSync('sz_tabbar') ? uni.getStorageSync('sz_tabbar') : defStore.state.tabbar
	},
	getters: {
		sz_getTabbar: state => {
			return state.sz_tabbar
		},
		sz_capsule() {
			// #ifdef MP
			// #ifndef MP-ALIPAY
			let capsule = uni.getMenuButtonBoundingClientRect();
			if (!capsule) {
				console.log('getMenuButtonBoundingClientRect error');
				capsule = {
					bottom: 56,
					height: 32,
					left: 278,
					right: 365,
					top: 24,
					width: 87
				};
			}
			return capsule;
			// #endif
			// #endif
		
			// #ifndef MP
			return {
				bottom: 56,
				height: 32,
				left: 278,
				right: 365,
				top: 24,
				width: 87
			};
			// #endif
		},
		sz_navBar() {
			// #ifndef MP
			return uni.getSystemInfoSync().statusBarHeight + 50;
			// #endif
			
			// #ifdef MP
			// #ifndef MP-ALIPAY
			let capsule = uni.getMenuButtonBoundingClientRect();
			if (!capsule) {
				console.log('getMenuButtonBoundingClientRect error');
				capsule = {
					bottom: 56,
					height: 32,
					left: 278,
					right: 365,
					top: 24,
					width: 87
				};
			}
			return capsule.bottom + capsule.top - uni.getSystemInfoSync().statusBarHeight;
			// #endif
			// #endif
			
			// #ifdef MP-ALIPAY
			return uni.getSystemInfoSync().statusBarHeight + uni.getSystemInfoSync().titleBarHeight;
			// #endif
		}
	},
	mutations: {
		setTabbar(state, data) {
			uni.setStorageSync('sz_tabbar', data);
			state.sz_tabbar = data;
		},
		//设置主题
		setTheme(state, data) {
			uni.setStorageSync('sz_theme', data);
			state.sz_theme = data;
			// #ifdef H5
			document.getElementsByTagName('html')[0].className =
				`theme-${state.sz_theme} main-${state.sz_main}`;
			// #endif
			
			if (data == 'auto') {
				// #ifdef MP
				this.commit('setStatusStyle', uni.getSystemInfoSync().theme == 'light' ? 'dark' : 'light');
				// #endif
			} else {
				this.commit('setStatusStyle', data == 'light' ? 'dark' : 'light');
			}
		},
		setText(state, data) {
			uni.setStorageSync('sz_text', data);
			state.sz_text = data;
		},
		setStatusStyle(state, status) {
			// #ifdef H5
			return false
			// #endif 
			if (status == 'light') {
				// #ifndef MP-ALIPAY
				uni.setNavigationBarColor({
					frontColor: '#ffffff',
					backgroundColor: '#000000',
					animation: {
						duration: 200,
						timingFunc: 'easeIn'
					}
				});
				// #endif
			
				// #ifdef APP-PLUS
				plus.navigator.setStatusBarStyle('light');
				// #endif
			
				// #ifdef MP-ALIPAY
				uni.setNavigationBarColor({
					frontColor: '#ffffff',
					backgroundColor: '#000000'
				});
				// #endif
			} else {
				// #ifndef MP-ALIPAY
				uni.setNavigationBarColor({
					frontColor: '#000000',
					backgroundColor: '#ffffff',
					animation: {
						duration: 200,
						timingFunc: 'easeIn'
					}
				});
				// #endif
			
				// #ifdef APP-PLUS
				plus.navigator.setStatusBarStyle('dark');
				// #endif
			
				// #ifdef MP-ALIPAY
				uni.setNavigationBarColor({
					frontColor: '#000000'
					backgroundColor: '#ffffff'
				});
				// #endif
			}
		},
		//设置主颜色
		setMain(state, data) {
			uni.setStorageSync('sz_main', data);
			state.sz_main = data;
			// #ifdef H5
			document.getElementsByTagName('html')[0].className = 
				`theme-${state.sz_main} main-${state.sz_main}`;
			// #endif
		}
	},
	actions: {
		
	},
	modules: {
		defStore,
		modal
	}
})

Vue.prototype.$store = store
export default store;