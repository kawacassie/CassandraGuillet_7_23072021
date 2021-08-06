<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12 col-md-10 col-lg-8">
                <div class="card bg-light">
                    <p class="h5 my-3 text-center">Bienvenue sur le réseau social interne de Groupomania</p>
                    <div class="card-header bg-light d-flex flex-column justify-content-center">
                        <img src="../assets/icon-above-font.svg" class="m-0 p-0" height="60" alt="logo groupomania">
                        <h5 class="h6 text-center" style="color:#091F43;">Voici quelques informations :</h5>
                    </div>
                    <div class="card-body">
                        <p>Cette application est strictement réservée aux employés de Groupomania</p>
                        <p>Pour y accéder, merci de vous <router-link to="/login">connecter</router-link> ou de vous <router-link to="/signup">inscrire</router-link> si vous ne l'avez pas encore fait.</p>
                        <p>Si vous rencontrez un problème ou si vous avez une question, contactez-nous via la rubrique <a href="email:groupomania@mail.fr">contact</a></p>
                    </div>
                    <div class="card-footer bg-light d-flex justify-content-between">
                        <span class="text-dark">Bonne navigation !</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    Name: "Home"
}
</script>

<style></style>