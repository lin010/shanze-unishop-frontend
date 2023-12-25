/*
 * XXX系统
 * author: YiLin L
 * organization: 广州珊泽网络科技有限公司 www.33wangluo.com
 * Copyright (c) 2023 广州珊泽网络科技有限公司 www.33wangluo.com All rights reserved.
 */

export default {
	computed: {
		sz_userId(){
			return 4;
		},
		sz_userInfo(){
			return {"nickName":"微信用户","gender":0,"language":"","city":"","province":"","country":"","avatarUrl":"https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132","sessionId":"jY0uKybggXDU+SvjZCAp5g==","openid":"ocGqJ69DkgFeamUrcfrQ7Yi6h4RI","id":4,"NickName":"微信用户","HeadUrl":"https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132"};
		}
	},
	methods: {
		getUserInfo(cb) {
			let that = this
			if(this.sz_userInfo){
				typeof cb == "function" && cb(this.sz_userInfo);
			}else{
				//调用登录接口
				
			}
		}
	}
}