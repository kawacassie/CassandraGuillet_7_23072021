<template>
    <main>
        <h1>Bienvenue sur le réseau social interne de Groupomania</h1>
        <h2>Veuillez vous inscrire : </h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="InputFirstName">Prénom : </label>
                <input type="text" v-model="InputFirstName" name="InputFirstName" class="form-control" id="InputFirstName" required placeholder="Prénom" :class="{ 'is-invalid': submitted && !InputFirstName }">
                <div v-show="submitted && !InputFirstName" class="invalid-feedback"><i class="fas fa-exclamation"></i> Un prénom est requis <i class="fas fa-exclamation"></i></div>
            </div>
            <div class="form-group">
                <label for="InputLastName">Nom : </label>
                <input type="text" v-model="InputLastName" name="InputLastName" class="form-control" id="InputLastName" required placeholder="Nom" :class="{ 'is-invalid': submitted && !InputLastName }">
                <div v-show="submitted && !InputLastName" class="invalid-feedback"><i class="fas fa-exclamation"></i> Un nom est requis <i class="fas fa-exclamation"></i></div>
            </div>
            <div class="form-group">
                <label for="InputEmail">Adresse e-mail : </label>
                <input type="email" v-model="InputEmail" name="InputEmail" class="form-control" id="InputEmail" required placeholder="Adresse e-mail" :class="{ 'is-invalid': submitted && !InputEmail }">
                <div v-show="submitted && !InputEmail" class="invalid-feedback"><i class="fas fa-exclamation"></i> Une adresse e-mail est requise <i class="fas fa-exclamation"></i></div>
            </div>
            <div class="form-group">
                <label for="InputPassword">Mot de passe : </label>
                <input type="password" v-model="InputPassword" name="InputPassword" class="form-control" id="InputPassword" required placeholder="Mot de passe" :class="{ 'is-invalid': submitted && !InputPassword }">
                <div v-show="submitted && !InputPassword" class="invalid-feedback"><i class="fas fa-exclamation"></i> Un mot de passe est requis <i class="fas fa-exclamation"></i></div>
            </div>
            <button>S'inscrire</button>
        </form>
        <h2>Déjà un compte ?</h2>
        <router-link to='/login'><i class="fas fa-sign-in-alt"></i> Connectez-vous</router-link>
    </main>
</template>

<script>
import axios from 'axios'
import router from '../router'
import Swal from 'sweetalert2'

export default {
    name: "SignUp",
    data() {
        return {
            InputFirstName: "",
            InputLastName: "",
            InputEmail: "",
            InputPassword: "",
            submitted: false
        }
    },
    methods: {
        handleSubmit() {
            const InputFirstName = this.InputFirstName
            const InputLastName = this.InputLastName
            const InputEmail = this.InputEmail
            const InputPassword = this.InputPassword
            this.submitted = true; 
            axios.post('http://localhost:3000/api/users/signup', { first_name: InputFirstName, last_name: InputLastName, email: InputEmail, password: InputPassword })
            .then(function(response) {
                if (response.statusText==="Created") {
                    axios.post('http://localhost:3000/api/users/login', { email: InputEmail, password: InputPassword })
                    .then(function(response) {
                    localStorage.setItem("token", response.data.token)
                    localStorage.setItem("userId", response.data.user.id)
                    localStorage.setItem("first_name", response.data.user.first_name)
                    localStorage.setItem("last_name", response.data.user.last_name)
                    localStorage.setItem("avatar", response.data.user.avatar)
                    localStorage.setItem("is_admin", response.data.user.is_admin)
                    Swal.fire({
                        text: "Inscription réussie", 
                        footer: "Connexion en cours...",
                        icon: 'success',
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
            })
            .catch(function(error) {
                const codeError = error.message.split("code ")[1]
                let messageError = ""
                switch (codeError) {
                    case "401": messageError = "Adresse email déjà utilisée"; break
                }
                Swal.fire({
                    title: "Une erreur est survenue",
                    text: messageError || error.message,
                    icon: "error",
                    timer: 4000,
                    showConfirmButton: false, 
                    timerProgressBar: true
                })
            });
        }
    }
}
</script>