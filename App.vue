<script>
	import config from "@/utils/config";
	export default {
		data() {
			return {}
		},
		onThemeChange: function(res) {
			if (store.state.sz_theme == 'auto') {
				store.commit('setStatusStyle', res.theme == 'light' ? 'dark' : 'light');
			}
		},
		onLaunch: function() {
			console.log('App Launch')
			this.$store.commit('setTabbar', config.tabbar);
		},
		onShow: function() {

			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/sz-core/ui/scss/ui';

	page {
		background: #fff;
		font-family: '微软雅黑'
	}
	
	uni-page-body, html, body{height:100%;box-sizing: border-box;}
	
	.search_no{
		width: 100%; 
		display: block;
		color: #666;
		text-align: center;
		font-size: 14px;
	}
	
	.scimg{
	    width: 100px;
	    height: 100px;
	    display: inline-block;
	    background-size:100px; 
	}

	.container {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding: 200rpx 0;
		box-sizing: border-box;
		font-family: '微软雅黑'
	}

	.df {
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
	}

	.df_1 {
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		-ms-flex: 1;
		flex: 1;
		-webkit-tap-highlight-color: transparent;
	}

	.df_2 {
		-webkit-box-flex: 2;
		-webkit-flex: 2;
		-ms-flex: 2;
		flex: 2;
		-webkit-tap-highlight-color: transparent;
	}

	.bg {
		background: #fff;
	}

	.bg_white {
		background: #fff;
	}

	.bg_hui {
		background: #eee;
	}

	.bg_red {
		background: #dd2727;
	}

	.bg_green {
		background: #02bf02;
	}

	.bg_cheng {
		background: #f85;
	}

	.clear {
		clear: both;
	}

	.ovh1 {
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	.red {
		color: #dd2727;
	}

	.c3 {
		color: #333;
	}

	.c6 {
		color: #666;
	}

	.c9 {
		color: #999;
	}

	.white {
		color: #fff;
	}

	.font_16 {
		font-size: 16px;
	}

	.font_14 {
		font-size: 13px;
	}

	.font_12 {
		font-size: 12px;
	}

	.font_10 {
		font-size: 10px;
	}

	.l_h20 {
		line-height: 20px;
	}


	/*边框*/
	.bte {
		border-top: 1px solid #eee;
	}

	.bbe {
		border-bottom: solid 1px #eee;
	}

	.bre {
		border-right: 1px solid #eee;
	}

	.ble {
		border-left: 1px solid #eee;
	}

	/*浮动*/
	.fl_l {
		float: left;
	}

	.fl_r {
		float: right;
	}

	.w10 {
		width: 10%;
	}

	.w20 {
		width: 20%;
	}

	.w30 {
		width: 30%;
	}

	.w40 {
		width: 40%;
	}

	.w50 {
		width: 50%;
	}

	.w60 {
		width: 60%;
	}

	.w70 {
		width: 70%;
	}

	.w80 {
		width: 80%;
	}

	.w90 {
		width: 90%;
	}

	.w100 {
		width: 100%;
	}

	.font_16 {
		font-size: 16px;
	}

	.font_14 {
		font-size: 13px;
	}

	.font_12 {
		font-size: 12px;
	}

	.font_10 {
		font-size: 10px;
	}

	.bg {
		background: #fff;
	}

	.bg_white {
		background: #fff;
	}

	.bg_hui {
		background: #eee;
	}

	.bg_red {
		background: #dd2727;
	}

	.bg_green {
		background: #02bf02;
	}

	.bg_cheng {
		background: #f85;
	}
	
	/*对齐*/
	.tl{text-align: left;}
	.tc{text-align: center;}
	.tr{text-align: right;}

	/*间距*/
	.mt1 {
		margin-top: 1px;
	}

	.mt5 {
		margin-top: 5px;
	}

	.mt8 {
		margin-top: 8px;
	}

	/*.mt10{margin-top: 10px;}*/
	.mt15 {
		margin-top: 15px;
	}

	.mt20 {
		margin-top: 20px;
	}

	.mt25 {
		margin-top: 25px;
	}

	.mt30 {
		margin-top: 30px;
	}

	.mt35 {
		margin-top: 35px;
	}

	.mt40 {
		margin-top: 40px;
	}

	.mt60 {
		margin-top: 60px;
	}

	.p_all {
		padding: 3%;
	}
</style>
