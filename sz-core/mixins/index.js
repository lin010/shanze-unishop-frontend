export default {
	computed: {},
	methods: {
		/**
		 * 保留当前页面，跳转到应用内的某个页面
		 * @param {*} url
		 */
		navigateTo(url){
			uni.navigateTo({
				url
			})
		},
		/**
		 * 转义符换成普通字符
		 * @param {*} str
		 * @returns
		 */
		escape2Html (str) {
		    if (!str) return str
		    var arrEntities = {
		        'lt': '<',
		        'gt': '>',
		        'nbsp': ' ',
		        'amp': '&',
		        'quot': '"'
		    }
		    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
		        return arrEntities[t]
		    })
		},
		/**
		 * 普通字符转换成转义符
		 * @param {*} sHtml
		 * @returns
		 */
		html2Escape (sHtml) {
		    if (!sHtml) return sHtml
		    return sHtml.replace(/[<>&"]/g, function (c) {
		        return {
		            '<': '&lt;',
		            '>': '&gt;',
		            '&': '&amp;',
		            '"': '&quot;'
		        }[c]
		    })
		}
	}
}