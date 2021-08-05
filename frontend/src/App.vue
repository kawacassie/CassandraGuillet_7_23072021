<template>
  <div id="app">
    <AppHeader></AppHeader>
<!--
    <v-main>
      <router-view></router-view>
    </v-main>
-->
    <AppFooter></AppFooter>
  </div>
</template>

<script>
import AppHeader from './components/Header.vue';
import AppFooter from './components/Footer.vue';
import '../public/style.scss';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter 
  },
  data: () => {
    return {};
  },
  computed: {
    user() {
      return this.$store.getters.user
    }
  },
  mounted() {
    this.$store.dispatch('getUsers');
    this.$store.dispatch('getUserById', this.user.id);
  }
};
</script>

<style lang="scss">
</style>
