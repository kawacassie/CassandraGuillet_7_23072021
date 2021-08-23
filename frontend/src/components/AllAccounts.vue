<template>
    <main>
        <v-card v-for="user of users" :key="user.id" :user="user" class="users" outlined shaped elevation="3">
            <v-card-title flat dense dark>
                <v-avatar size="42px">
                    <img v-if="user.avatar" :src="user.avatar" alt="Photo de profil">
                    <img v-else src="../assets/default-avatar.png" alt="Photo de profil">
                </v-avatar>
                <div>
                    <span>{{ user.first_name }}</span>
                    <span>{{ user.last_name }}</span>
                </div>
            </v-card-title>
            <v-card-text>
                <div>{{ user.bio }}</div>
            </v-card-text>
        </v-card>
    </main>
</template>

<script>
import axios from "axios"
import Swal from "sweetalert2"

export default {
    name: "AllAccounts",
    data() {
        return {
            first_name: "",
            last_name: "",
            avatar: "",
            bio: "",
        }
    },
    created: function() {
        axios.get('http://localhost:3000/api/users/accounts', { headers : { "Authorization" : localStorage.getItem("token")} })
        .then(users => {
            this.first_name = users.data.first_name
            this.last_name = users.data.last_name
            this.avatar = users.data.avatar
            this.bio = users.data.bio 
        })
        .catch(function(error) {
            const codeError = error.message.split("code ")[1]
            let messageError = ""
            switch (codeError){
                case "400" : messageError = "Les informations utilisateurs n'ont pas été récupérées"; break
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
    }
}


</script>