import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../components/Home'),
    },

    {
        path: '/login',
        name: 'Login',
        component: () => import('../components/Login'),
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: () => import('../components/SignUp')
    }, 
    {
        path: '/posts',
        name: 'Posts',
        component: () => import('../components/Posts'),
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const publicPages = ['/', '/login', '/signup']
    const authRequired = !publicPages.includes(to.path)
    const loggedIn = localStorage.getItem('userId')
    const loggedToken = localStorage.getItem('token')
    if (authRequired && !loggedIn && !loggedToken) {
        return next ('/login')
    }
    next()
})

export default router