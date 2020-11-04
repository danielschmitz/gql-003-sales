<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">Users</p>
    </header>
    <div class="card-content">
      <div class="content">
        <table class="table is-striped is-fullwidth">
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
          </tr>
          <tr v-for="item in users" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.email }}</td>
          </tr>
        </table>
      </div>
    </div>
    <footer class="card-footer">
      <a href="#" class="card-footer-item">Buttons</a>
    </footer>
  </div>
</template>
<script>
import graphql from "../graphql";

export default {
  name: "users",
  data() {
    return {
      users: [],
    };
  },
  async mounted() {
    try {
      const result = await graphql.api("{ users {id,name,email} }");
      this.users = result.data.data.users;
    } catch (error) {
      alert("Error: " + error.response.data.errors[0].message);
    }
  }
};
</script>