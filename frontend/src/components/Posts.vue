<template>
    <main>
        <h2>Ajouter un nouveau post</h2>
        <NoPost v-if="NoPost === true"></NoPost>
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
            isAdmin: false, 
            title: "",
            content: "",
            image_url: "",
            currentUserId: "",
            file: null,
            posts: [],

        }
    },
    methods: {
        onFileChange() {
            this.file = this.$refs.file.files[0];
            this.image_url = URL.createObjectURL(this.file)
        },
        addNewPost(){
            const formData = new FormData()
            formData.set("image_url", this.file)
            formData.set("user_id", this.currentUserId.toString())
            formData.set("title", this.title.toString())
            formData.set("content", this.content.toString())
            axios.post("http://localhost:3000/api/posts/add", formData, { headers: { "Authorization":"Bearer " + localStorage.getItem("token")} })
            .then(() => {
                this.user_id = ""
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
        }
    },
    created: function() {
        this.isAdmin = localStorage.getItem("is_admin")
        this.currentUserId = localStorage.getItem("id")
        if (localStorage.getItem("refresh") === null) {
            localStorage.setItem("refresh", 0)
            location.reload()
        }
        axios.get("http://localhost:3000/api/posts", { headers: {"Authorization": "Bearer " + localStorage.getItem("token")} })
        .then(res => {
            const rep = res.data.posts
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