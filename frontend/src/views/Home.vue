<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">Login</p>
    </header>
    <div class="card-content">
      <div class="notification is-warning" v-if="errorMessage != ''">
        {{ errorMessage }}
      </div>

      <div class="content">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Email"
              v-model="user.email"
            />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="password"
              placeholder="Password"
              v-model="user.password"
            />
          </div>
        </div>
        <div class="columns">
          <div class="column is-3">
            <label class="checkbox">
              <input type="checkbox" v-model="signup" />
              Signup
            </label>
          </div>
          <div class="column">
            <input
              class="input"
              type="text"
              placeholder="Your name"
              v-if="signup"
              v-model="user.name"
            />
          </div>
        </div>
        <a class="button is-light is-large" @click="onButtonGoClick()"> Go </a>
        &nbsp;
        <div class="card-content" v-if="store.token!==''">
          Welcome! Your token is:
          <br>
          <textarea rows="5" cols="100" v-model="store.token"></textarea>
          <a class="button is-light is-large" @click="onButtonLogoutClick()">Logout...</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import graphql from '../graphql'
import store from '../store'

export default {
  name: "home",
  data() {
    return {
      signup: false,
      errorMessage: '',
      store,
      user: {
        email: "",
        password: "",
        name: "",
      },
    };
  },
  methods: {
    async onButtonGoClick() {
      const query = this.signup
        ? `mutation { signup(
            email:"${this.user.email}",
            password:"${this.user.password}",
            name:"${this.user.name}")
            }`
                    : `{ login(
            email:"${this.user.email}",
            password:"${this.user.password}")
            }`;

      const { data: { errors, data } } = await graphql.auth(query)

      if (errors !== undefined) {
        this.errorMessage = errors[0].message
        return
      }

      this.store.token = this.signup ? data.signup : data.login

    },
    onButtonLogoutClick () {
      this.store.token = ''
    }
  },
};
</script>
