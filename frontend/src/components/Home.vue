<template>
  <main class="hello">
    <img src="../assets/icon-above-font.svg" height="500" alt="logo couleur Groupomania">
    <h1>Bienvenue sur le réseau social interne de Groupomania</h1>
    <h2>
      Quelques informations : 
    </h2>
    <p>
      L'accès à ce réseau est réservé aux employés de Groupomania <br>
      Vous pouvez publier des messages seuls ou accompagnés au choix d'un gif ou d'une image <br>
      Vous pourrez ajouter/modifier votre photo de profil et renseigner votre bio une fois connecté
    </p>
    <p>
      Il s'agit d'un réseau professionnel, nous vous demandons de respecter le règlement intérieur de l'entreprise <br>
      Tout manquement au respect du règlement pourra entraîner la supression d'un post, d'un commentaire ou même d'un compte utilisateur
    </p>
    <p>
      Si vous rencontrez un problème ou avez des questions, vous pouvez contacter l'admin de ce réseau
    </p>
    <h2>Pour y accéder, deux possibilités : </h2>
    <p>
      <router-link to='/login'><i class="fas fa-sign-in-alt"></i> Connexion</router-link>
    </p>
    <p>
      <router-link to='/signup'><i class="fas fa-user-plus"></i> Inscription</router-link>
    </p>
    <h2>Bonne visite ! </h2>
  </main>
</template>

<script>
export default {
  name: 'Home',
}
</script>


<style lang="scss">
</style>
