<template>
    <main>
        <div class="container-account">
            <div class="one-card">
                <div class="one-title">
                    <p class="card-info">{{ first_name + " " + last_name }}</p>
                    <div class="one-img">
                        <img v-if="avatar" :src="avatar" alt="Photo de profil" height="200">
                        <img v-else src="../assets/default-avatar.png" alt="Photo de profil par défault" height="200">
                        <div>
                            <a id="lien-formulaire-avatar" @click="masquerDiv('formulaire-avatar')"><i class="fas fa-edit"></i> Changer la photo de profil</a>
                        </div>
                        <form @submit.prevent="updateAvatar()" enctype="multipart/form-data">
                            <div id="formulaire-avatar">
                                <label for="File">Choisir une nouvelle photo : </label>
                                <input @change="onFileChange()" type="file" ref="file" name="image_url" id="File" accept=".jpg, .jpeg, .gif, .png, .webp" :class="{ 'is-invalid': submitted && !file }">
                                <div v-show="submitted && !file">Une nouvelle photo est requise</div>
                                <div class="form-footer">
                                    <input type="reset">
                                    <input type="submit">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="one-body">
                    <p class="card-info">Informations :</p>
                    <p>{{ email }}</p>
                    <p>{{ bio }}</p>
                    <div>
                        <a id="lien-formulaire-bio" @click="masquerDiv('formulaire-bio')"><i class="fas fa-edit"></i> Changer la bio</a>
                    </div>
                    <div id="formulaire-bio">
                        <form @submit.prevent="updateBio()" enctype="multipart/form-data">
                            <label for="bio">Modifier la bio : </label>
                            <textarea name="bio" id="bio" v-model="bio" cols="50" rows="4" placeholder="Ajoutez des informations sur vous..."></textarea>
                            <div class="form-footer">
                                <input type="reset">
                                <input type="submit">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div>
                <a id="lien-delete-account" @click="masquerDiv('delete-account')"><i class="fas fa-trash-alt"></i> Supprimer mon compte ?</a>
            </div>
            <div id="delete-account">
                <form enctype="multipart/form-data">
                    <p>ATTENTION ! Cette action est irréversible ! <br> Vous ne pourrez plus vous connecter à ce compte, vos posts et commentaires seront supprimés !</p>
                    <p>Êtes-vous certain de vouloir supprimer votre compte ?</p>
                    <button type="submit" @click.prevent="deleteAccount()">Je supprime !</button>
                </form>
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
        masquerDiv(id) {
            if (document.getElementById(id).style.display =='block') 
            {
                document.getElementById(id).style.display = 'none';
            }
            else {
                document.getElementById(id).style.display = 'block';
            }
        },
        updateAvatar() {
            this.submitted = true
            const formData = new FormData()
            formData.append("image_url", this.file);
            axios.put('http://localhost:3000/api/users/accounts/' + localStorage.getItem("userId"), formData, { headers : { "Authorization" : localStorage.getItem("token")} })
            .then(function(response) {
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
        updateBio(){
            this.submitted = true
            const formData = new FormData()
            formData.set("bio", this.bio.toString());
            axios.put('http://localhost:3000/api/users/accounts/' + localStorage.getItem("userId"), formData, { headers : { "Authorization" : localStorage.getItem("token")} })
            .then(() => {
                this.bio = ""
                Swal.fire({
                    text: "La bio a été mise à jour", 
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
                    case "400" : messageError = "La bio n'a pas été mise à jour"; break
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
            if (confirm("La suppression d'un compte est irréversible, voulez vous continuer ?"))
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