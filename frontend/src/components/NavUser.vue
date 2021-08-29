<template>
    <div class="container">
        <img :src="avatar" alt="Image de profil" height="37">
        <p>{{ first_name + " " + last_name }}</p>
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
            avatar: "./assets/default-avatar.png"
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