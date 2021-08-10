<template>
    <div class="container">
        <router-link to='/login'><i class="fas fa-sign-in-alt"></i> Connexion</router-link>
        <router-link to='/signup'><i class="fas fa-user-plus"></i> Inscription</router-link>
    </div>
</template>

<script>
export default {
    name: "NavDefault"
}
</script>