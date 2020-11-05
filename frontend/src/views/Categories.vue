<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">Categories</p>
    </header>
    <div class="card-content">
      <table class="table is-striped is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in categories" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.description }}</td>
            <td>
              <span class="icon has-text-info pointer" @click="edit(item)">
                <i class="fas fa-edit"></i>
              </span>
              <span class="icon has-text-danger pointer" @click="del(item)">
                <i class="fas fa-trash is-danger"></i>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <footer class="card-footer">
      <a href="#" class="card-footer-item" @click="add()">New</a>
    </footer>
    <!-- Form modal -->
    <div class="modal" :class="{ 'is-active': showFormModal }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">
            {{ item.id === null ? "New " : "Edit " }}
            Category
          </p>
          <button
            class="delete"
            aria-label="close"
            @click="showFormModal = false"
          ></button>
        </header>
        <section class="modal-card-body">
          <div class="notification is-danger" v-if="errorMessage != ''">
            {{ errorMessage }}
          </div>
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input
                class="input"
                type="text"
                v-model="item.name"
                placeholder="Name"
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Description</label>
            <div class="control">
              <input
                class="input"
                type="text"
                v-model="item.description"
                placeholder="Name"
              />
            </div>
          </div>
        </section>
        <footer class="modal-card-foot buttons is-right">
          <div class="full-width">
            <button class="button is-success" @click="save()">
              Save changes
            </button>
            <button class="button" @click="showFormModal = false">
              Cancel
            </button>
          </div>
        </footer>
      </div>
    </div>

    <!-- Delete modal -->
    <div class="modal" :class="{ 'is-active': showDeleteModal }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Are you sure?</p>
          <button
            class="delete"
            aria-label="close"
            @click="showDeleteModal = false"
          ></button>
        </header>
        <section class="modal-card-body">
          Delete Category <b>{{ item.name }}</b
          >?
        </section>
        <footer class="modal-card-foot buttons is-right">
          <div class="full-width">
            <button class="button is-danger" @click="confirmDel()">Yes, delete!</button>
            <button class="button" @click="showDeleteModal = false">
              Cancel
            </button>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import graphql from "../graphql";

export default {
  name: "Categories",
  data() {
    return {
      categories: [],
      item: {},
      showFormModal: false,
      showDeleteModal: false,
      errorMessage: "",
    };
  },
  async mounted() {
    this.load();
  },
  methods: {
    async load() {
      try {
        const result = await graphql.api(
          "{ categories {id,name,description} }"
        );
        this.categories = result.data.data.categories;
        this.showFormModal = false;
        this.showDeleteModal = false;
      } catch (error) {
        alert("Error: " + error.response.data.errors[0].message);
      }
    },
    add() {
      console.log("add");
      this.item = {
        id: null,
        name: "",
        description: "",
      };
      this.errorMessage = "";
      this.showFormModal = true;
    },
    edit(item) {
      console.log("edit", item);
      this.item = Object.assign({}, item);
      this.errorMessage = "";
      this.showFormModal = true;
    },
    del(item) {
      console.log("del", item);
      this.item = Object.assign({}, item);
      this.showDeleteModal = true;
    },
    async save() {
      this.errorMessage = "";
      const query =
        this.item.id === null
          ? `mutation { 
                createCategory(
                    category:{
                        name:"${this.item.name}",
                        description: "${this.item.description}"
                        })
                    {id,name,description}
            }`
          : `mutation { 
                editCategory(
                    id: "${this.item.id}",
                    category:{
                        name:"${this.item.name}",
                        description: "${this.item.description}"
                        })
                    {id,name,description}
            }`;
      console.log("save", query);

      const {
        data: { errors, data },
      } = await graphql.api(query);

      if (errors !== undefined) {
        this.errorMessage = errors[0].message;
        return;
      }

      console.log("saved", data);
      this.load();
    },
    async confirmDel() {
      this.errorMessage = "";
      const query = `mutation {
                deleteCategory(id:"${this.item.id}")
            }`;
      const {
        data: { errors, data },
      } = await graphql.api(query);
      if (errors !== undefined) {
        this.errorMessage = errors[0].message;
        return;
      }

      console.log("deleted", data);
      this.load();
    },
  },
};
</script>

<style>
</style>
