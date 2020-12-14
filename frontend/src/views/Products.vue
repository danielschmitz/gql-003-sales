<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">Products</p>
    </header>
    <div class="card-content">
      <table class="table is-striped is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Quantity Per Unit</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.quantityPerUnit }}</td>
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
            Product
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

          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">Quantity Per Unit</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="item.quantityPerUnit"
                    placeholder="Name"
                  />
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Units In Stock</label>
                <div class="control">
                  <input
                    class="input"
                    type="number"
                    v-model="item.unitsInStock"
                    placeholder="Name"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">Unit Price</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="item.unitPrice"
                    placeholder="Name"
                  />
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <div class="control">
                  <input
                    type="checkbox"
                    id="discontinued"
                    name="discontinued"
                    v-model="item.discontinued"
                  />
                  Discontinued
                </div>
              </div>
            </div>
          </div>

          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">Category</label>
                <div class="control">
                  <div class="select  is-fullwidth">
                    <select v-model="item.category_id">
                      <option 
                        v-for="category in categories" 
                        :key="category.id"
                        :value="category.id"
                        >
                          {{category.name}}
                        </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Supplier</label>
                <div class="control">
                   <div class="select is-fullwidth">
                    <select v-model="item.supplier_id">
                      <option 
                        v-for="supplier in suppliers" 
                        :key="supplier.id"
                        :value="supplier.id"
                        >
                          {{supplier.companyName}}
                        </option>
                    </select>
                  </div>
                </div>
              </div>
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
          Delete Product <b>{{ item.name }}</b
          >?
        </section>
        <footer class="modal-card-foot buttons is-right">
          <div class="full-width">
            <button class="button is-danger" @click="confirmDel()">
              Yes, delete!
            </button>
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
  name: "Products",
  data() {
    return {
      products: [],
      suppliers: [],
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
          `{ 
            products {
              id,
              name,
              quantityPerUnit,
              unitsInStock,
              discontinued,
              unitPrice,
              supplier_id,
              category_id
              },
            suppliers {
              id,
              companyName
            },
            categories {
              id,
              name
            }
          }`
        );
        this.products = result.data.data.products;
        this.suppliers = result.data.data.suppliers;
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
        quantityPerUnit: "",
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
                createProduct(
                    product:{
                        name:"${this.item.name}",
                        quantityPerUnit: "${this.item.quantityPerUnit}",
                        unitPrice: ${this.item.unitPrice},
                        unitsInStock: ${this.item.unitsInStock},
                        discontinued: ${this.item.discontinued},
                        supplier_id: ${this.item.supplier_id},
                        category_id: ${this.item.category_id}
                      })
                    {id}
            }`
          : `mutation { 
                editProduct(
                    id: "${this.item.id}",
                    product:{
                        name:"${this.item.name}",
                        quantityPerUnit: "${this.item.quantityPerUnit}",
                        unitPrice: ${this.item.unitPrice},
                        unitsInStock: ${this.item.unitsInStock},
                        discontinued: ${this.item.discontinued},
                        supplier_id: ${this.item.supplier_id},
                        category_id: ${this.item.category_id}
                        })
                    {id}
            }`;
      console.log("save", query);

      const {
        data: { errors, data },
      } = await graphql.api(query);

      console.log(errors);

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
                deleteProduct(id:"${this.item.id}")
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