<template>
    <main>
        <h2>Ajouter un nouveau post :</h2> 
        <form method="POST" enctype="multipart/form-data" class="form-group">
            <label for="title">Titre : </label>
            <textarea name="title" id="title" v-model="title" cols="50" rows="2" placeholder="Le titre de votre post ici..."></textarea>
            <label for="newPost">Contenu du post : </label>
            <textarea name="newPost" id="newPost" v-model="content" cols="50" rows="10" placeholder="Écrivez votre texte ici..."></textarea>
            <label for="File">Choisir une nouvelle image : </label>
            <input @change="onFileChange()" type="file" ref="file" name="image_url" id="file" accept=".jpg, .jpeg, .gif, .png, .webp">
            <div class="form-footer">
                <input type="reset">
                <input type="submit" @click.prevent="createPost()">
            </div>
        </form>

        <div v-for="post in posts" :key="post.id" class="allposts">
            <div class="posts">
                <div class="post-header">
                    <img v-if="post.User.avatar" :src="post.User.avatar" alt="avatar utilisateur" height="40">
                    <img v-else src="../assets/default-avatar.png" alt="Avatar par défaut" height="40">
                    <span>
                        Posté par {{ post.User.first_name + " " + post.User.last_name }} <br>
                    </span>
                </div>
                <div v-if="post.UserId === this.UserId || this.is_admin === 'true'">
                    <a href="'#/posts/' + post.id "><i class="fas fa-edit"></i> Éditer le post</a>
                    <button @click="deletePost(post.id)"><i class="fas fa-trash-alt"></i> Supprimer le post</button>
                </div>
                <div class="post-body">
                    <h3>{{ post.title }}</h3>
                    <p>{{ post.content }}</p>
                    <img :src="post.image_url" alt="Image du post" v-if="post.image_url !== null">
                </div>
                <div class="post-footer">
                    <!-- AJOUTER COMMENTAIRES ET LIKES ICI -->
                </div>
            </div>
        </div>
        <NoPost v-if="NoPost === true"></NoPost>
        <div class="card-footer">
            <p>Il n'y a pas de message plus ancien que celui au-dessus...</p>
        </div>
    </main>
</template>

<script>
import NoPost from "./NoPost.vue"
import axios from "axios"
import Swal from "sweetalert2"

export default {
    name: "Posts",
    components: {
        NoPost
    },
    data() {
        return {
            NoPost: false,
            is_admin: false, 
            title: "",
            content: "",
            image_url: "",
            UserId: "",
            file: null,
            posts: [],

        }
    },
    methods: {
        onFileChange() {
            this.file = this.$refs.file.files[0];
            this.image_url = URL.createObjectURL(this.file)
        },
        createPost(){
            const formData = new FormData()
            formData.set("image_url", this.file)
            formData.set("UserId", this.UserId.toString())
            formData.set("title", this.title.toString())
            formData.set("content", this.content.toString())
            axios.post("http://localhost:3000/api/posts/add", formData, { headers: { "Authorization": localStorage.getItem("token")} })
            .then(() => {
                this.UserId = ""
                this.title = ""
                this.content = ""
                this.file = null
                Swal.fire({
                    text: "Post publié",
                    footer: "Redirection en cours...",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                    timerProgressBar: true, 
                    willClose: () => { location.reload() }
                })
            })
            .catch((error) => {
                const codeError = error.message.split("code ")[1]
                let messageError = ""
                switch (codeError){
                    case "400": messageError = "Le post n'a pas été publié"; break
                    case "401": messageError = "Requête non-authentifiée"; break
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
        },
        deletePost(postId){
            if (confirm("La suppression d'une publication est irréversible, voulez-vous continuer ?")){
                fetch("http://localhost:3000/api/posts/" + this.posts.id, {
                    body: JSON.stringify({ post_id: postId}),
                    method: "delete",
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    },
                })
                .then(() => {
                    Swal.fire({
                        text: "Post supprimé",
                        footer: "Redirection en cours...",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                        timerProgressBar: true, 
                        willClose: () => { location.reload() }
                    })
                })
                .catch((error) => {
                    const codeError = error.message.split("code ")[1]
                    let messageError = ""
                    switch (codeError){
                        case "400": messageError = "Le post n'a pas pu être supprimé"; break
                        case "401": messageError = "Requête non-authentifiée"; break
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
    },
    created: function() {
        this.isAdmin = localStorage.getItem("is_admin")
        this.UserId = localStorage.getItem("userId")
        if (localStorage.getItem("refresh") === null) {
            localStorage.setItem("refresh", 0)
            location.reload()
        }
        axios.get("http://localhost:3000/api/posts", { headers: {"Authorization": localStorage.getItem("token")} })
        .then(response => {
            console.log(response.data)
            const rep = response.data
            if (rep.length === 0) { this.NoPost = true } else { this.NoPost = false}
            this.posts = rep
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