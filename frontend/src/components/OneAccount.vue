<template>
    <main>
        <div class="container">
            <div class="card">
                <p>{{ first_name + " " + last_name }}</p>
            </div>
        </div>

    </main>
</template>

<script>
import axios from "axios"
import Swal from "sweetalert2"

export default {
    name: "OneAccount",
    data() {
        return {
            first_name: "",
            last_name: "",
            email: "",
            createdAt: "",
            avatar: "",
            bio: "",
            file: null, 
            submitted: false
        }
    },
    methods: {
        onFileChange(){
            this.file = this.$refs.file.files[0];
            this.avatar = URL.createObjectURL(this.file)
        },
        updateAccount() {
            this.submitted = true
            const formData = new FormData()
            formData.append("image", this.file);
            formData.set("bio", this.bio.toString());
            axios.put('http://localhost:3000/api/users/accounts/' + localStorage.getItem("userId"), formData, { headers : { "Authorization" : localStorage.getItem("token")} })
            .then(function(response) {
                this.bio = "",
                localStorage.setItem("avatar", response.data.user.avatar)
                Swal.fire({
                    text: "L'avatar a été mis à jour", 
                    footer: "Redirection en cours...",
                    icon: "success",
                    timer: 1000, 
                    showConfirmButton: false, 
                    timerProgressBar: true, 
                    willClose: () => { location.reload() }
                })
            })
            .catch(function(error) {
                const codeError = error.message.split("code ")[1]
                let messageError = ""
                switch (codeError) {
                    case "400" : messageError = "L'avatar n'a pas été mis à jour"; break
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
        deleteAccount() {
            axios.delete('http://localhost:3000/api/users/accounts/' + localStorage.getItem("userId"), { headers : { "Authorization" : localStorage.getItem("token")} })
            .then(() => {
                localStorage.clear()
                Swal.fire({
                    text: "Le compte a été supprimé",
                    footer: "Déconnexion en cours...",
                    icon: "success",
                    timer: 4000,
                    showConfirmButton: false, 
                    timerProgressBar: true, 
                    willClose: () => { location.reload() }
                })
            })
            .catch(function(error) {
                const codeError = error.message.split("code ")[1]
                let messageError = ""
                switch (codeError) {
                    case "400" : messageError = "La suppression du compte n'a pas aboutie"; break
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
    },
    created: function() {
        axios.get('http://localhost:3000/api/users/accounts/' + localStorage.getItem("userId"), { headers : { "Authorization" : localStorage.getItem("token")} })
        .then(user => {
            this.first_name = user.data.first_name
            this.last_name = user.data.last_name
            this.email = user.data.email
            this.createdAt = user.data.createdAt.slice(0,10).split('-').reverse().join('/') + ' à ' + user.data.createdAt.slice(11,16)
            this.avatar = user.data.avatar
            this.bio = user.data.bio 
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
    }
}


</script>