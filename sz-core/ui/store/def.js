export default {
	state: {
		isTheme: true, // 是否开启多主题（true:会读缓存，能设置对应的主题)
		themeAuto: false, // 跟随系统
		theme: 'light', // 设置默认主题
		main: 'white', // 设置默认强调色
		text: 1, // 设置默认字号等级(0-4)
		domain: '',
		apiPath: '/api/',
		homePath: '/pages/index/index', // 设置首页路径(一些组件会用到跳回主页，请每个项目设置好！)
		tabbar: [],
		nav: []
	},
	getters: {
		getCustomTheme: state => {
			return state.theme
		},
		getCustomMain: state => {
			return state.main
		},
		getCustomText: state => {
			return state.text
		},
		getTabbar: state => {
			return state.tabbar
		},
		getNav: state => {
			return state.nav
		},
		getDomain: state => {
			return state.domain
		},
		getApiPath: state => {
			return state.apiPath
		}
	},
	mutations: {},
	actions: {}
}