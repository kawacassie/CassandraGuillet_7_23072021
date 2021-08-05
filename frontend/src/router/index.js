import Vue from 'vue';
import VueRouter from 'vue-router';
//Ajouter les routes 

Vue.use(VueRouter);

const routes = [
    //Ajouter les routes
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;