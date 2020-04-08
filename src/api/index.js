// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest, putRequest, deleteRequest, uploadFileRequest } from '../libs/axios';

//查询账户
export const checkAccount = (params) => {
    return getRequest('/core/account/check', params)
};

//登陆账户
export const signIn = (params) => {
    return postRequest('/uaa/oauth/token', params)
};