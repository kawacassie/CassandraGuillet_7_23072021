<template>
    <header>
        <nav>
            <NavLogo></NavLogo>
            <NavUser></NavUser>
            <NavDefault></NavDefault>
        </nav>
    </header>
</template>

<script>
import NavLogo from './NavLogo.vue'
import NavUser from './NavUser.vue'
import NavDefault from './NavDefault.vue'

export default {
    name: 'AppHeader',
    components: {
        NavUser,
        NavDefault,
        NavLogo
    },
    computed: {
        isLogged() {
            if (localStorage.getItem("token") !== null) {
                return true
            }
            return false
        }
    }
}
</script>