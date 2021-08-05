<template>
  <v-app>
    <header :user='user'>
      <Header/>
    </header>

    <v-main>
      <router-view></router-view>
    </v-main>

    <footer :user='user'>
      <Footer/>
    </footer>
  </v-app>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import '../public/style.scss';

export default {
  name: 'app',
  components: {
    Header,
    Footer 
  },
  data: () => {
    return {};
  },
  computed:{
    user(){
      return this.$store.getters.user
    }
  },
  mounted(){
    this.$store.dispatch('getAllUsers');
    this.$store.dispatch('getOneAccount', this.user.id);
  }
}

</script>

<style lang="scss">
</style>
