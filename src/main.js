import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import BaiduMap from 'vue-baidu-map'
import router from './router/index'
import i18n from './locales/i18n'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import globalVariable from './libs/global_variable'
import {setStore, getStore, removeStore} from './libs/storage'
import Message from './components/Message'
import {getRequest, postRequest, putFormRequest, deleteRequest, uploadFileRequest} from './libs/axios'

Vue.config.productionTip = false

Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putFormRequest = putFormRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.uploadFileRequest = uploadFileRequest;
Vue.prototype.setStore = setStore;
Vue.prototype.getStore = getStore;
Vue.prototype.removeStore = removeStore;
Vue.prototype.$message = Message;
Vue.prototype.$global = globalVariable;

Vue.use(BaiduMap, {
    // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
    ak: 'OljGGx6QqphRhH277gS63dUqzcF4zQwt'
});

new Vue({
    vuetify,
    i18n,
    router,
    render: h => h(App)
}).$mount('#app')
