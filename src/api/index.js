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

// 查询账户列表
export const getAccountList = (params) => {
    return getRequest('/core/account', params)
};

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

// 添加账户
export const addAccount = (params) => {
    return postRequest('/core/account', params)
};

// 修改账户
export const updateAccount = (params) => {
    return putRequest('/core/account', params)
};

// 修改密码
export const changePassword = (params) => {
    return putRequest('/core/account/mypassword', params)
};

// 重置指定用户的密码
export const resetPassword = (params) => {
    return putRequest('/core/account/resetpassword', params)
};

// </editor-fold>

// <editor-fold desc="菜单类接口" defaultstate="collapsed">

// 获取菜单树
export const getMenuTree = (params) => {
    return getRequest('/core/menu/tree', params)
};

// 获取菜单树
export const getMenuAndAuthorityTree = (params) => {
    return getRequest('/core/menu/treeAndAuthority', params)
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

// <editor-fold desc="组织机构类接口" defaultstate="collapsed">

// 获取公司信息列表
export const getAllOrganizationTree = (params) => {
    return getRequest('/core/organization', params)
};

// 获取公司信息列表
export const getCompanyList = (params) => {
    return getRequest('/core/organization/company', params)
};

// 获取公司列表（简单列表非树状）
export const getCompanySimpleList = (params) => {
    return getRequest('/core/organization/company/simpleList', params)
};

// 获取我的公司信息列表
export const getMyCompanyList = (params) => {
    return getRequest('/core/organization/myCompany', params)
};

// 添加公司信息
export const addCompany = (params) => {
    return postRequest('/core/organization/company', params)
};

// 修改公司信息
export const updateCompany = (params) => {
    return putRequest('/core/organization/company', params)
};

// 获取部门信息列表
export const getDepartmentList = (params) => {
    return getRequest('/core/organization/department', params)
};

// 获取部门信息列表
export const getDepartmentSimpleList = (params) => {
    return getRequest('/core/organization/department/simpleList', params)
};

// 添加部门信息
export const addDepartment = (params) => {
    return postRequest('/core/organization/department', params)
};

// 修改部门信息
export const updateDepartment = (params) => {
    return putRequest('/core/organization/department', params)
};

// </editor-fold>

// <editor-fold desc="角色类接口" defaultstate="collapsed">

// 获取角色信息列表
export const getRoleList = (params) => {
    return getRequest('/core/role/list', params)
};

// 添加角色信息
export const addRole = (params) => {
    return postRequest('/core/role/data', params)
};

// 修改角色信息
export const updateRole = (params) => {
    return putRequest('/core/role/data', params)
};

// 删除角色信息
export const deleteRole = (params) => {
    return deleteRequest('/core/role/data', params)
};
// </editor-fold>

// <editor-fold desc="CMS类接口" defaultstate="collapsed">

// 获取站点信息列表
export const getSiteList = (params) => {
    return getRequest('/core/cms/site/list', params)
};

// 获取站点信息
export const getSite = (params) => {
    return getRequest('/core/cms/site', params)
};

// 添加站点信息
export const addSite = (params) => {
    return postRequest('/core/cms/site', params)
};

// 更新站点信息
export const updateSite = (params) => {
    return putRequest('/core/cms/site', params)
};

// 删除站点
export const deleteSite = (params) => {
    return deleteRequest('/core/cms/site', params)
};

// 获取文章分类信息列表
export const getCategoryList = (params) => {
    return getRequest('/core/cms/category/list', params)
};

// 获取文章分类信息
export const getCategory = (params) => {
    return getRequest('/core/cms/category', params)
};

// 添加文章分类信息
export const addCategory = (params) => {
    return postRequest('/core/cms/category', params)
};

// 修改文章分类信息
export const updateCategory = (params) => {
    return putRequest('/core/cms/category', params)
};

// 删除文章分类
export const deleteCategory = (params) => {
    return deleteRequest('/core/cms/category', params)
};

// 获取文章列表
export const getPostsList = (params) => {
    return getRequest('/core/cms/posts/list', params)
};

// 添加文章
export const addPosts = (params) => {
    return postRequest('/core/cms/posts', params)
};

// 修改文章
export const updatePosts = (params) => {
    return putRequest('/core/cms/posts', params)
};

// 删除文章
export const deletePosts = (params) => {
    return deleteRequest('/core/cms/posts', params)
};

// 获取文章标签列表
export const getTagList = (params) => {
    return getRequest('/core/cms/tag/list', params)
};

// 获取文章标签
export const getTag = (params) => {
    return getRequest('/core/cms/tag', params)
};

// 添加文章标签
export const addTag = (params) => {
    return postRequest('/core/cms/tag', params)
};

// 修改文章标签
export const updateTag = (params) => {
    return putRequest('/core/cms/tag', params)
};

// 删除文章标签
export const deleteTag = (params) => {
    return deleteRequest('/core/cms/tag', params)
};

// </editor-fold>

export const uploadPublicFile = (params) => {
    return uploadFileRequest('/core/uploadPublicFile', params)
}

export const uploadPrivateFile = (params) => {
    return uploadFileRequest('/core/uploadPrivateFile', params)
}