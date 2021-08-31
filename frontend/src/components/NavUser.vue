<template>
    <div class="container">
        <img v-if="avatar ==! null" :src="avatar" alt="Image de profil" height="40"> 
        <img v-else src="../assets/default-avatar.png" alt="Avatar par défaut" height="40">
        <span id="user_name">{{ first_name + " " + last_name }}</span>
        <ul id="nav_user">
            <li><router-link to='/accounts'><i class="fas fa-users"></i> Tous les utilisateurs</router-link></li>
            <li><router-link to='/accounts/:id'><i class="fas fa-user-edit"></i> Mon compte</router-link></li>
            <li><router-link to='/posts'><i class="fas fa-comments"></i> Voir les posts</router-link></li>
            <li><a @click="deconnexion" href="#"><i class="fas fa-sign-out-alt"></i> Déconnexion</a></li>
        </ul>
    </div>
</template>

<script>
import Swal from 'sweetalert2'

export default {
    name: "NavUser",
    data() {
        return {
            first_name: "",
            last_name: "",
            avatar: ""
        }
    },
    created: function() {
        this.first_name = localStorage.getItem("first_name")
        this.last_name = localStorage.getItem("last_name")
        this.avatar = localStorage.getItem("avatar")
    },
    methods: {
        deconnexion: function() {
            localStorage.clear()
            Swal.fire({
                text: "Déconnexion en cours",
                footer: "Redirection en cours...",
                icon: "info",
                timer: 2000,
                showConfirmButton: false, 
                timerProgressBar: true,
                willClose: () => { location.reload() }
            })
        }
    }
}
</script>