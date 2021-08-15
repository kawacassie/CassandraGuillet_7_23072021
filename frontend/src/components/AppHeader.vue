<template>
    <header>
        <nav>
            <NavLogo></NavLogo>
            <NavUser v-if="isLogged === true"></NavUser>
            <NavDefault v-else></NavDefault>
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
                console.log(localStorage)
                return true
            }
            return false
        }
    }
}
</script>