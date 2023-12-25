import Vue from 'vue'
import store from '@/sz-core/ui/store'
import modal from '@/sz-core/ui/js/modal.js'
import request from '@/sz-core/ui/js/request.js'
import util from '@/sz-core/ui/js/util.js'
import mixin from '@/sz-core/ui/js/mixin.js'

if (uni.getStorageSync("VUE_APP_NAME") != process.env.VUE_APP_NAME) {
	uni.clearStorage();
	uni.setStorageSync('VUE_APP_NAME', process.env.VUE_APP_NAME);
}

/*分析主题*/
var theme = uni.getStorageSync("sz_theme");
var main = uni.getStorageSync("sz_main");
var text = uni.getStorageSync("sz_text");

if (!theme) {
	theme = store.getters.getCustomTheme;
}

if (!main) {
	main = store.getters.getCustomMain;
}

if (!text) {
	text = store.getters.getCustomText;
}

store.commit('setTheme', theme);
store.commit('setMain', main);
store.commit('setText', text);