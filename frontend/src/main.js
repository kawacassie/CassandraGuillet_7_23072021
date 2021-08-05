import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Vuetify from 'vuetify';
import store from './store/index';
import { sync } from 'vuex-router-sync';

Vue.config.productionTip = false;

const moment = require ('moment')
require('moment/locale/fr')
Vue.use(require('vue-moment'), {
    moment
});
Vue.use(Vuetify);
const unsync = sync(store, router);

new Vue({
    router, 
    store, 
    Vuetify, 
    render: (h) => h(App),
}).$mount('#app');

unsync();
