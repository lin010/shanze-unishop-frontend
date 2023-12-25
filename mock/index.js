import mock from 'mockjs';
import {request} from "@/utils/request.js";
	
export const mockInvoke = (param, data, method, header) => {
	mock.mock(param.url, {code: 200, data: param['data']});
	return request.post(param.url, data);
}