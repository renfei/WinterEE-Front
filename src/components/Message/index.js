import Vue from 'vue'
import Main from './Message.vue'

let MessageConstructor = Vue.extend(Main);

const Message = function (options, color) {
    if (options === undefined || options === null) {
        options = {
            text: '',
            snackbar: true
        }
    } else if (typeof options === 'string' || typeof options === 'number') {
        options = {
            text: options
        }
        if (color != undefined && options != null) {
            options.color = color;
            options.snackbar = true;
        }
    }

    let instance = new MessageConstructor({
        data: options
    }).$mount();

    document.body.appendChild(instance.$el)

    Vue.nextTick(() => {
        instance.visible = true
    })
}

export default Message
