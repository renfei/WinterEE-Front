import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import Vue18n from 'vue-i18n'
import router from './router/index'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import {setStore, getStore, removeStore} from './libs/storage'
import Message from './components/Message'
import { getRequest, postRequest, putRequest, deleteRequest, uploadFileRequest } from './libs/axios'

Vue.config.productionTip = false

Vue.use(Vue18n);

Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.uploadFileRequest = uploadFileRequest;
Vue.prototype.setStore = setStore;
Vue.prototype.getStore = getStore;
Vue.prototype.removeStore = removeStore;
Vue.prototype.$message = Message;

const i18n = new Vue18n({
    locale: localStorage.getItem('locale') || 'zh-CN',    // 语言标识
    messages: {
        'zh-CN': require('./locales/zh-CN'),
        'en-US': require('./locales/en-US'),
        'ja-JP': require('./locales/ja-JP')
    }
});

new Vue({
    vuetify,
    i18n,
    router,
    render: h => h(App)
}).$mount('#app')
