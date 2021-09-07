<template>
    <main>
        <!-- AJOUTER NOUVEAU POST -->
        <div>
            <a id="lien-formulaire-post" @click="masquerDiv('formulaire-post')"><i class="fas fa-plus"></i> Ajouter un nouveau post</a> 
        </div>
        <div id="formulaire-post">
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
        </div>

        <!-- AFFICHER LES POSTS --> 
        <div v-for="post in posts" :key="post.id" class="allposts">
            <div class="posts">
                <div class="post-header">
                    <div class="img-name, s-size">
                        <img v-if="post.User.avatar" :src="post.User.avatar" alt="avatar utilisateur" height="40">
                        <img v-else src="../assets/default-avatar.png" alt="Avatar par défaut" height="40">
                        <div class="post-name"> Posté par {{ post.User.first_name + " " + post.User.last_name }} </div>
                    </div>
                    <div id="edit-delete" class="s-size" v-if="post.User.id == this.userId || this.is_admin == 'true'">
                    <router-link to="/posts/:id" @click.prevent="getPostId(post.id)">
                        <i class="fas fa-edit"></i> Éditer le post <br>
                        <i class="fas fa-trash-alt"></i> Supprimer le post
                    </router-link>
                </div>
                </div>
                <div class="post-body">
                    <h3>{{ post.title }}</h3>
                    <p>{{ post.content }}</p>
                    <img :src="post.image_url" alt="Image du post" v-if="post.image_url !== null">
                </div>
                <!-- PARTIE COMMENTAIRES --> 
                <div class="post-footer">
                    <div>
                        <p class="s-size" v-if="post.Comments.length === 0">Il n'y a aucun commentaire.</p>
                        <p class="s-size" v-if="post.Comments.length === 1">Il y a 1 commentaire.</p>
                        <p class="s-size" v-if="post.Comments.length > 1">Il y a {{post.Comments.length}} commentaires.</p>

                        <div class="space">
                            <a id="lien-formulaire-comment" @click="masquerDiv('formulaire-comment')"><i class="fas fa-plus"></i> Ajouter un commentaire</a> 
                        </div>
                        <div id="formulaire-comment">
                            <form id="form-comment" enctype="multipart/form-data">
                                <label for="message">Commentaire : </label>
                                <textarea name="message" id="message" cols="30" rows="3" v-model="message" placeholder="Votre commentaire ici..." required :class="{ 'is-invalid': submitted && !message }"></textarea>
                                <div v-show="submitted && !message">Un commentaire est requis</div>
                                <input type="submit" @click.prevent="addComment(post.id)">
                            </form>
                        </div>

                        <div v-for="comment in comments" :key="comment.id">
                            <span>Commentaire de {{ comment.User.first_name + " " + comment.User.last_name }}</span>
                            <p>{{ comment.comment }}</p>
                            <!-- AJOUTER SUPPRESSION COMMENTAIRE -->
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- PAS DE POST OU FIN DES POSTS -->
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
            userId: "",
            first_name: "",
            last_name: "",
            file: null,
            posts: [],
            submitted: false,
            message: "",
            comments: [],
        }
    },
    methods: {
        onFileChange() {
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
        createPost(){
            const formData = new FormData()
            formData.set("image_url", this.file)
            formData.set("userId", this.userId.toString())
            formData.set("title", this.title.toString())
            formData.set("content", this.content.toString())
            axios.post("http://localhost:3000/api/posts/add", formData, { headers: { "Authorization": localStorage.getItem("token")} })
            .then(() => {
                this.userId = ""
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
        getPostId(id) {
            this.id = id
            localStorage.setItem("PostId", this.id)
            console.log(localStorage)
        },
        addComment(id) {
            this.submitted = true
            this.id = id
            const formData = new FormData()
            formData.set("PostId", this.id.toString())
            formData.set("UserId", this.userId.toString())
            formData.set("message", this.message.toString())
            axios.post("http://localhost:3000/api/posts/:id/comments", formData, { headers: { "Authorization": localStorage.getItem("token")}})
            .then(()=> {
                this.userId = ""
                this.id = ""
                this.message = ""
                Swal.fire({
                    text: "Commentaire ajouté !",
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
                switch (codeError){
                    case "400": messageError = "Le commentaire n'a pas été ajouté !"; break
                    case "401": messageError = "Requête non-authentifiée !"; break
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
    },
    created: function() {
        this.is_admin = localStorage.getItem("is_admin")
        this.userId = localStorage.getItem("userId")
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