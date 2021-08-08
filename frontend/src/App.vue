<template>
  <div id="app">
    <router-view></router-view>
    <AppFooter></AppFooter>
  </div>
</template>

<script>
import '../public/style.scss';
import AppFooter from './components/AppFooter.vue'

export default {
  name: 'App',
  components: {
    AppFooter
  }
}
</script>

<style lang="scss">
</style>
