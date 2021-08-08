<template>
    <main>
        <h1>Bienvenue sur le réseau social interne de Groupomania</h1>
        <h2>Veuillez vous identifier : </h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="InputEmail">Adresse e-mail :</label>
                <input type="email" v-model="InputEmail" name="InputEmail" class="form-control" id="InputEmail" placeholder="Adresse e-mail" :class="{ 'is-invalid': submitted && !InputEmail }">
                <div v-show="submitted && !InputEmail" class="invalid-feedback">Une adresse e-mail est requise</div>
            </div>
            <div class="form-group">
                <label for="InputPassword">Mot de passe :</label>
                <input type="password" v-model="InputPassword" name="InputPassword" class="form-control" id="InputPassword" placeholder="Mot de passe" :class="{ 'is-invalid': submitted && !InputPassword }">
                <div v-show="submitted && !InputPassword" class="invalid-feedback">Un mot de passe est requis</div>
            </div>
            <button>Se connecter</button>
        </form>
        <h2>Pas encore de compte ?</h2>
        <router-link to='/signup'>Inscrivez-vous</router-link>
    </main>
</template>

<script>
import axios from 'axios'
import router from '../router'
import Swal from 'sweetalert2'

export default {
    name: "Login",
    data() {
        return {
            InputEmail: "",
            InputPassword: "",
            submitted: false
        }
    },
    methods: {
        handleSubmit() {
            this.submitted = true
            axios.post('http://localhost:8080/api/user/login', { email: this.InputEmail, password: this.InputPassword })
            .then(function (response) {
                localStorage.setItem("token", response.data.token)
                localStorage.setItem("userId", response.data.userId)
                localStorage.setItem("first_name", response.data.first_name)
                localStorage.setItem("last_name", response.data.last_name)
                localStorage.setItem("avatar", response.data.avatar)
                localStorage.setItem("is_admin", response.data.is_admin)
                Swal.fire({
                    text: "Connexion réussie",
                    footer: "Redirection en cours...",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false, 
                    timerProgressBar: true, 
                    willClose: () => { router.push("/posts") }
                })
            })
            .catch(function(error) {
                const codeError = error.message.split("code ")[1]
                let messageError = ""
                switch (codeError){
                    case "401": messageError = "Mot de passe erroné"; break
                    case "403": messageError = "Le compte associé à cette adresse e-mail a été supprimé"; break
                    case "404": messageError = "Utilisateur non trouvé"; break
                }
                Swal.fire({
                    title: "Une erreur est survenue",
                    text: messageError || error.message,
                    icon: "error",
                    timer: 4000,
                    showConfirmButton: false,
                    timerProgressBar: true
                })
            })
        }
    }
}
</script>