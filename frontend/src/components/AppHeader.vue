<template>
    <div class="container">
        <div class="row">
            <nav class="col navbar navbar-dark">
                <img src="../assets/icon-left-font-monochrome-black.svg" alt="logo Groupomania">
                <NavUser v-if="isLogged"></NavUser>
                <NavDefault v-else></NavDefault>
            </nav>
        </div>
    </div>
</template>

<script>
import NavUser from "./NavUser.vue"
import NavDefault from "./NavDefault.vue"

export default {
    name: "AppHeader",
    components: {
        NavUser,
        NavDefault
    },
    computed: {
        isLogged() {
            if (localStorage.getItem("token") !== null ) {
                return true 
            }
            return false
        }
    }
}
</script>

<style></style>