<template>
    <main>
        <div class="container">
            <!-- MODIFIER LE POST -->
            <div>
                <a id="lien-edit-post" @click="masquerDiv('edit-post')"><i class="fas fa-edit"></i> Modifier le post ?</a>
            </div>
            <div id="edit-post">
                <form method="POST" enctype="multipart/form-data" class="form-group">
                    <label for="title">Nouveau titre : </label>
                    <textarea name="title" id="title" v-model="title" cols="50" rows="2" placeholder="Le nouveau titre de votre post ici..."></textarea>
                    <label for="newPost">Nouveau contenu du post : </label>
                    <textarea name="newPost" id="newPost" v-model="content" cols="50" rows="10" placeholder="Écrivez votre nouveau texte ici..."></textarea>
                    <label for="File">Choisir une nouvelle image : </label>
                    <input @change="onFileChange()" type="file" ref="file" name="image_url" id="file" accept=".jpg, .jpeg, .gif, .png, .webp">
                    <div class="form-footer">
                        <input type="reset">
                        <input type="submit" @click.prevent="modifyPost()">
                    </div>
                </form>
            </div>

            <!-- SUPPRIMER LE POST -->
            <div>
                <a id="lien-delete-post" @click="masquerDiv('delete-post')"><i class="fas fa-trash-alt"></i> Supprimer le post ?</a>
            </div>
            <div id="delete-post">
                <form enctype="multipart/form-data">
                    <p>ATTENTION ! Cette action est irréversible !</p>
                    <p>Êtes-vous certain de vouloir supprimer ce post ?</p>
                    <button type="submit" @click.prevent="deletePost()">Je supprime !</button>
                </form>
            </div>

            <!-- RETOUR AUX POSTS -->
            <div id="retour-posts">
                <router-link to="/posts"><i class="fas fa-undo-alt"></i> Retour</router-link>
            </div>
        </div>

    </main>
</template>

<script>
import axios from "axios"
import Swal from "sweetalert2"
import router from "../router"

export default {
    name: "OnePost",
    data() {
        return {
            title: "",
            content: "",
            image_url: "",
            UserId: "",
            file: null, 
            submitted: false,
        }
    },
    methods: {
        onFileChange(){
            this.file = this.$refs.file.files[0];
            this.image_url = URL.createObjectURL(this.file)
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
        modifyPost() {
            this.submitted = true
            const formData = new FormData()
            formData.set("title", this.title.toString())
            formData.set("content", this.content.toString())
            formData.set("image_url", this.file);
            axios.put('http://localhost:3000/api/posts/' + localStorage.getItem("PostId"), formData, { headers : { "Authorization" : localStorage.getItem("token")} })
            .then(response => {
                if (response.status === 200) {
                    Swal.fire({
                        text: "Le post a été mis à jour", 
                        footer: "Redirection en cours...",
                        icon: "success",
                        timer: 1000, 
                        showConfirmButton: false, 
                        timerProgressBar: true, 
                        willClose: () => { router.push("/posts") }
                    })
                }
            })
            .catch(function(error) {
                const codeError = error.message.split("code ")[1]
                let messageError = ""
                switch (codeError) {
                    case "400" : messageError = "Le post n'a pas été mis à jour"; break
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
        deletePost() {
            if (confirm("La suppression d'un post est irréversible, voulez vous continuer ?"))
            axios.delete('http://localhost:3000/api/posts/' + localStorage.getItem("PostId"), { headers : { "Authorization" : localStorage.getItem("token")} })
            .then(response => {
                if (response.status === 200) { 
                    Swal.fire({
                        text: "Le post a été supprimé",
                        footer: "Déconnexion en cours...",
                        icon: "success",
                        timer: 4000,
                        showConfirmButton: false, 
                        timerProgressBar: true, 
                        willClose: () => { router.push("/posts") }
                    })
                }
            })
            .catch(function(error) {
                const codeError = error.message.split("code ")[1]
                let messageError = ""
                switch (codeError) {
                    case "400" : messageError = "La suppression du post n'a pas aboutie"; break
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
        axios.get('http://localhost:3000/api/posts/' + localStorage.getItem("PostId"), { headers : { "Authorization" : localStorage.getItem("token")} })
        .then(post => {
            this.title = post.data.title
            this.content = post.data.content
            this.image_url = post.data.image_url
            this.UserId = post.data.UserId
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