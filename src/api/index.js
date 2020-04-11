// 统一请求路径前缀在libs/axios.js中修改
import {getRequest, postRequest, putRequest, deleteRequest, uploadFileRequest} from '../libs/axios';

// <editor-fold desc="秘钥交换接口" defaultstate="collapsed">

// 获取服务器端的RSA公钥
export const getRSAkey = (params) => {
    return getRequest('/core/secretkey', params)
};

// 上报客户端的RSA公钥
export const uploadRSAkey = (params) => {
    return postRequest('/core/secretkey', params)
};

// </editor-fold>

// <editor-fold desc="账户类接口" defaultstate="collapsed">

// 查询账户
export const checkAccount = (params) => {
    return getRequest('/core/account/check', params)
};

// 登陆账户
export const signIn = (params) => {
    return postRequest('/uaa/oauth/token', params)
};

// </editor-fold>