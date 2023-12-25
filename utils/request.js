
import config from "@/utils/config";
import {mockInvoke} from "@/mock/index.js";
import mockApiSets from "@/mock/apiSets";

function requestFun(url, data = {}, header = {}, method = "POST") {
	let baseURL = config.baseURL;
	if(config.mock && mockApiSets[url]){
		return mockInvoke(mockApiSets[url], data, method, header);
	}
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${baseURL}${url}`,
			data,
			method,
			header: {
				'Content-Type':  'application/x-www-form-urlencoded',
				...header
			},
			success: function (res) {
				resolve(res.data);
			},
			fail: function (err) {
				uni.showToast({
					icon: "none",
					title: "网络连接失败"
				});
				reject(err);
			}
		});
	});
}

export const request = {
	get(url, data, header) {
		return requestFun(url, data, header, "GET")
	},
	post(url, data, header) {
		return requestFun(url, data, header, "POST")
	},
	put(url, data, header) {
		return requestFun(url, data, header, "PUT")
	},
	delect(url, data, header) {
		return requestFun(url, data, header, "DELECT")
	},
}