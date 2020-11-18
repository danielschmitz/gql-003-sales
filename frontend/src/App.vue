<template>
  <div id="app">
    <nav class="navbar is-light">
      <div class="navbar-brand">
        <router-link class="navbar-item" to="/">Home</router-link>
        <router-link v-if="logged" class="navbar-item" to="/categories">Categories</router-link>
        <router-link v-if="logged" class="navbar-item" to="/suppliers">Suppliers</router-link>
        <router-link v-if="logged" class="navbar-item" to="/customers">Customers</router-link>
      </div>
    </nav>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>
<script>
import store from "./store";
export default {
  data() {
    return {
      store,
    };
  },
  computed: {
    logged() {
      return store.token;
    },
  },
};
</script>
<style>
.container {
  padding: 20px;
}
.pointer {
  cursor: pointer;
}
</style>
