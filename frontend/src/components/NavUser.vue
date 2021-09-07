<template>
    <div class="container">
        <div class="img_name">
            <img v-if="avatar" :src="avatar" alt="Image de profil" height="40"> 
            <img v-else src="../assets/default-avatar.png" alt="Avatar par défaut" height="40">
            <span id="user_name">{{ first_name + " " + last_name }}</span>
        </div>
        <div class="logo_nav">
            <a id="masque_nav" @click="masquerDiv('nav_hidden')"><i class="fas fa-bars"></i> Voir plus</a>
            <div id="nav_hidden">
                <ul id="nav_user">
                    <li><router-link to='/accounts'><i class="fas fa-users"></i> Tous les utilisateurs</router-link></li>
                    <li><router-link to='/accounts/:id'><i class="fas fa-user-edit"></i> Mon compte</router-link></li>
                    <li><router-link to='/posts'><i class="fas fa-comments"></i> Voir les posts</router-link></li>
                    <li><a @click="deconnexion" href="#"><i class="fas fa-sign-out-alt"></i> Déconnexion</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
import axios from 'axios'

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
        axios.get('http://localhost:3000/api/users/accounts/' + localStorage.getItem("userId"), { headers : { "Authorization" : localStorage.getItem("token")} })
        .then(user => {
            this.first_name = user.data.first_name
            this.last_name = user.data.last_name
            this.avatar = user.data.avatar
        })
        .catch(function(error) {
            const codeError = error.message.split("code ")[1]
            let messageError = ""
            switch (codeError){
                case "400" : messageError = "Vos informations n'ont pas été récupérées"; break
                case "401" : messageError = "Requête non-authentifiée"; break
            }
            Swal.fire({
                title: "Une erreur est survenue",
                text: messageError || error.message,
                icon: "error",
                timer: 1500,
                showConfirmButton: false,
                timerProgressBar: true
            })
        })
    },
    methods: {
        masquerDiv(id) {
            if (document.getElementById(id).style.display =='block') 
            {
                document.getElementById(id).style.display = 'none';
            }
            else {
                document.getElementById(id).style.display = 'block';
            }
        },
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