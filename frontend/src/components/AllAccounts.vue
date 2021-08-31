<template>
    <main>
        <v-card v-for="user of users" :key="user.id" :user="user" class="users">
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
            users: [],
        }
    },
    created: function() {
        this.isAdmin = localStorage.getItem("is_admin")
        this.UserId = localStorage.getItem("userId")
        if (localStorage.getItem("refresh") === null) {
            localStorage.setItem("refresh", 0)
            location.reload()
        }
        axios.get("http://localhost:3000/api/users/accounts", { headers: {"Authorization": localStorage.getItem("token")} })
        .then(response => {
            console.log(response.data)
            const rep = response.data
            this.users = rep
        })
        .catch((error) => {
            const codeError = error.message.split("code ")[1]
            let messageError = ""
            switch (codeError){
                case "400": messageError = "La liste des posts n'a pas été récupérée"; break
            }
            Swal.fire({
                title: "Une erreur est survenue",
                text: messageError || error.message,
                icon: "error",
                timer: 3500, 
                showConfirmButton: false, 
                timerProgressBar: true
            })
        })
    }
}


</script>