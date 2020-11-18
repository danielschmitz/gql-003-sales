<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">Shippers</p>
    </header>
    <div class="card-content">
      <table class="table is-striped is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>Id</th>
            <th>Company Name</th>
            <th>Contact Name</th>
            <th>Contact</th>
            <th>Address</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in shippers" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.companyName }}</td>
            <td>{{ item.contactName }}</td>
            <td>
              {{ item.contactEmail }} <br/>
              {{ item.address.phone }}
              
            </td>
            <td>
              {{ item.address.street }}, {{ item.address.city }} <br/>
              {{ item.address.region }} - {{ item.address.postalCode }}
              
            </td>
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
            Shipper
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
            <label class="label">Company Name</label>
            <div class="control">
              <input
                class="input"
                type="text"
                v-model="item.companyName"
                placeholder="Company Name"
              />
            </div>
          </div>

          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">Contact Name</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="item.contactName"
                    placeholder="Contact Name"
                  />
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Contact Email</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="item.contactEmail"
                    placeholder="Contact Email"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">Street</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="item.address.street"
                    placeholder="Street"
                  />
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Phone</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="item.address.phone"
                    placeholder="Phone"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">City</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="item.address.city"
                    placeholder="City"
                  />
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Region</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="item.address.region"
                    placeholder="Region"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">Postal Code</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="item.address.postalCode"
                    placeholder="Postal Code"
                  />
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Country</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="item.address.country"
                    placeholder="Country"
                  />
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
          Delete Shipper <b>{{ item.companyName }} - {{ item.contactName }}</b
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
  name: "Shippers",
  data() {
    return {
      shippers: [],
      item: {
        address: {},
      },
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
            shippers{
              id, 
              companyName, 
              contactName,
              contactEmail,
              address { 
                id, 
                street, 
                city,
                region,
                postalCode,
                country,
                phone
              }
            }
      }`
        );
        this.shippers = result.data.data.shippers;
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
        companyName: "",
        contactName: "",
        contactEmail: "",
        address: {
          street: "", 
          city: "",
          region: "",
          postalCode: "",
          country: "",
          phone: ""
        }
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
                createShipper(
                    shipper:{
                        companyName:"${this.item.companyName}",
                        contactName: "${this.item.contactName}",
                        contactEmail: "${this.item.contactEmail}",
                        address: {
                            street: "${this.item.address.street}",
                            city: "${this.item.address.city}",
                            region: "${this.item.address.region}",
                            postalCode: "${this.item.address.postalCode}",
                            country: "${this.item.address.country}",
                            phone: "${this.item.address.phone}"
                          }
                        })
                    {id}
            }`
          : `mutation { 
                editShipper(
                    id: "${this.item.id}",
                    shipper:{
                        companyName:"${this.item.companyName}",
                        contactName: "${this.item.contactName}",
                        contactEmail: "${this.item.contactEmail}",
                        address: {
                            street: "${this.item.address.street}",
                            city: "${this.item.address.city}",
                            region: "${this.item.address.region}",
                            postalCode: "${this.item.address.postalCode}",
                            country: "${this.item.address.country}",
                            phone: "${this.item.address.phone}"
                          }
                        })
                    {id}
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
                deleteShipper(id:"${this.item.id}")
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
<style scoped>
td {
    vertical-align : middle;
}
</style>