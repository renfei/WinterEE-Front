import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
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

new Vue({
    vuetify,
    i18n,
    router,
    render: h => h(App)
}).$mount('#app')
