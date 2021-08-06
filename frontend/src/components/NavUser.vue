<template>
    <div id="navbarContent" class="m-0 p-0 justify-content-end align-self-center">
        <div class="nav-item dropdown m-0 p-0">
            <a class="nav-item nav-link m-0 p-0" href="#" data-toggle="dropdown" id="my_account" aria-haspopup="true" aria-expanded="false">
                <img :src="avatar" alt="Image de profile" height="37" class="my-0 rounded-circle"/>
            </a>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="my_account">
                <p class="h5 dropdown-item-text">{{ first_name + last_name }}</p>
                <div class="dropdown-divider"></div>
                <div class="d-flex"><i class="fas fa-user-circle pl-4"></i><router-link to="/accounts/:id" class="dropdown-item pl-2">Mon compte</router-link></div>
                <div class="d-flex"><i class="fas fa-users pl-4"></i><router-link to="/accounts" class="dropdown-item pl-2">Tous les utilisateurs</router-link></div>
                <div class="dropdown-divider"></div>
                <div class="d-flex"><i class="fas fa-sign-out-alt pl-4"></i><a class ="dropdown-item pl-2 text-danger" @click="deconnexion" href="#">Déconnexion</a></div>
            </div>
        </div>            
    </div>
</template>

<script>
export default {
    name: "NavUserMenu",
    data() {
        return {
            first_name: "", 
            last_name: "",
            avatar: "./assets/default-avatar.png"
        }
    },
    created: function() {
            this.first_name = localStorage.getItem("first_name") 
            this.last_name = localStorage.getItem("last_name") 
            this.avatar = localStorage.getItem("avatar") 
    },
    methods: {
        deconnexion: function() {
            localStorage.clear()
        }
    }
}
</script>