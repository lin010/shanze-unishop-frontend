/*
 * XXX系统
 * author: YiLin L
 * organization: 广州珊泽网络科技有限公司 www.33wangluo.com
 * Copyright (c) 2023 广州珊泽网络科技有限公司 www.33wangluo.com All rights reserved.
 */

export default {
	appName: "广州珊泽网络科技",
	mock: false,
	baseURL: "https://001.33wangluo.com/index.php",
	tabbar: [{
		title: '首页',
		icon: 'szw-home',
		curIcon: 'szw-home',
		url: '/pages/index/index',
		type: 'tab'
	},
	{
		title: '分类',
		icon: 'szw-apps',
		curIcon: 'szw-apps',
		url: '/pages/category/category',
		type: 'tab'
	},
	{
		title: '购物车',
		icon: 'szw-cart',
		curIcon: 'szw-cart',
		url: '/pages/cart/cart',
		type: 'tab'
	},
	{
		title: '我的',
		icon: 'szw-people',
		curIcon: 'szw-people',
		url: '/pages/user/user',
		type: 'tab'
	}]
}
