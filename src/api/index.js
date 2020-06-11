// 统一请求路径前缀在libs/axios.js中修改
import {
    getRequest,
    postRequest,
    postFormRequest,
    putRequest,
    deleteRequest,
    uploadFileRequest
} from '../libs/axios';

// <editor-fold desc="秘钥交换接口" defaultstate="collapsed">

// 获取服务器端的RSA公钥
export const getRSAkey = (params) => {
    return getRequest('/core/secretkey', params)
};

// 上报客户端的RSA公钥
export const uploadRSAkey = (params) => {
    return postRequest('/core/secretkey', params, "application/json")
};

// </editor-fold>

// <editor-fold desc="账户类接口" defaultstate="collapsed">

// 查询账户
export const checkAccount = (params) => {
    return getRequest('/core/account/check', params)
};

// 登陆账户
export const signIn = (params) => {
    return postFormRequest('/uaa/oauth/token', params)
};

export const getMyInfo = (params) => {
    return getRequest('/core/account/myinfo', params)
};

// </editor-fold>

// <editor-fold desc="菜单类接口" defaultstate="collapsed">

// 获取菜单树
export const getMenuTree = (params) => {
    return getRequest('/core/menu/tree', params)
};

// 获取管理的菜单树
export const getSettingMenuTree = (params) => {
    return getRequest('/core/setting/menu/tree', params)
};

// 获取管理的菜单列表
export const getSettingMenuList = (params) => {
    return getRequest('/core/setting/menu/list', params)
};

// 获取管理的菜单详情
export const getSettingMenu = (params) => {
    return getRequest('/core/setting/menu', params)
};

// 添加管理的菜单详情
export const addSettingMenu = (params) => {
    return postRequest('/core/setting/menu', params)
};

// 修改管理的菜单详情
export const updateSettingMenu = (params) => {
    return putRequest('/core/setting/menu', params)
};

// 删除管理的菜单
export const deleteSettingMenu = (params) => {
    return deleteRequest('/core/setting/menu', params)
};

// </editor-fold>

// <editor-fold desc="日志类接口" defaultstate="collapsed">

// 获取日志的类别列表
export const getSettingLogTypeList = (params) => {
    return getRequest('/core/setting/logs/type', params)
};

// 获取日志的子类别列表
export const getSettingLogSubTypeList = (params) => {
    return getRequest('/core/setting/logs/subtype', params)
};

// 获取日志
export const getSettingLog = (params) => {
    return getRequest('/core/setting/logs', params)
};

// </editor-fold>

// <editor-fold desc="租户类接口" defaultstate="collapsed">

// 获取租户列表
export const getTeantList = (params) => {
    return getRequest('/core/setting/tenantlist', params)
}

// 获取租户列表
export const getSettingTeantList = (params) => {
    return getRequest('/core/setting/tenant', params)
};

// 新增租户
export const addSettingTeantList = (params) => {
    return postRequest('/core/setting/tenant', params)
};

// 修改租户
export const updateSettingTeantList = (params) => {
    return putRequest('/core/setting/tenant', params)
};

//获取租户基础信息
export const getTeantInfo = (params) => {
    return getRequest('/core/tenant/info', params)
};

//更新租户基础信息
export const updateTeantInfo = (params) => {
    return postRequest('/core/tenant/info', params)
};

// </editor-fold>

// <editor-fold desc="OAuth客户端类接口" defaultstate="collapsed">

// 获取OAuth客户端列表
export const getSettingOAuthClientList = (params) => {
    return getRequest('/core/setting/oauthclient', params)
};

// 新增OAuth客户端
export const addSettingOAuthClient = (params) => {
    return postRequest('/core/setting/oauthclient', params)
};

// 修改OAuth客户端
export const updateSettingOAuthClient = (params) => {
    return putRequest('/core/setting/oauthclient', params)
};

// 删除OAuth客户端
export const deleteSettingOAuthClient = (params) => {
    return deleteRequest('/core/setting/oauthclient', params)
};
// </editor-fold>