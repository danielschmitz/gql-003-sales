<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">Employees</p>
    </header>
    <div class="card-content">
      <table class="table is-striped is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Reports To</th>
            <th>Contact</th>
            <th>Address</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in employees" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.firstName }} {{ item.lastName }}</td>
            <td v-if="item.reportsTo">{{ item.reportsTo.firstName}}</td>
            <td v-else></td>
            <td>
              {{ item.contactEmail }} <br />
              <span v-if="item.address">{{ item.address.phone }}</span>
            </td>
            <td>
              <div v-if="item.address">
              {{ item.address.street }}, {{ item.address.city }} <br />
              {{ item.address.region }} - {{ item.address.postalCode }}
              </div>
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
            Employee
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

          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">First Name</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="item.firstName"
                    placeholder="First Name"
                  />
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Last Name</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="item.lastName"
                    placeholder="Last Name"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">Birth Date</label>
                <div class="control">
                  <input
                    class="input"
                    type="date"
                    v-model="item.birthDate"
                    placeholder="Birth Date"
                  />
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Hire Date</label>
                <div class="control">
                  <input
                    class="input"
                    type="date"
                    v-model="item.hireDate"
                    placeholder="Hire Date"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">Reports to</label>
                <div class="control">
                  <div class="columns">
                    <div class="column">
                      <input
                          v-if="item.reportsTo"
                            class="input"
                            disabled
                            type="text"
                            v-model="item.reportsTo.firstName"
                            placeholder="Reports To"
                          />
                      </div>
                    <div class="column is-2">
                         <button class="button" @click="openReportsToModal()">
                          <span class="icon">
                            <i class="fas fa-search"></i>
                          </span>
                        </button>
                      </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Title</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="item.title"
                    placeholder="Title"
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
          Delete Employee <b>{{ item.companyName }} - {{ item.contactName }}</b
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


     <!-- Reports To modal -->
    <div class="modal" :class="{ 'is-active': showReportsToModal }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Select Reports to</p>
          <button
            class="delete"
            aria-label="close"
            @click="showReportsToModal = false"
          ></button>
        </header>
        <section class="modal-card-body">
         
          <div class="field">
              <div class="columns">
                <div class="column"> 
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      v-model="searchReportsTo"
                      placeholder="Search Employee"
                    />
                  </div>
                </div>
                <div class="column is-1">
                  <button class="button" @click="refreshReportsToEmployees()">
                        <span class="icon">
                          <i class="fas fa-search"></i>
                        </span>
                      </button>
                </div>
              </div>
            </div>

            <div>
              <table class="table is-striped is-fullwidth is-hoverable">
              <tbody>
                <tr v-for="item in reportsToEmployees" :key="item.id">
                  <td><a @click="confirmReportsTo(item)">{{ item.firstName }} {{ item.lastName }}</a></td>
                </tr>
              </tbody>
            </table>
              </div>


        </section>
        <footer class="modal-card-foot buttons is-right">
          <div class="full-width">
            <button class="button" @click="showReportsToModal = false">
              Cancel
            </button>
          </div>
        </footer>
      </div>
    </div>

  </div>
</template>

<script>
import graphql from "../graphql"
import { dateToInput } from '../utils'

export default {
  name: "Employees",
  data() {
    return {
      employees: [],
      reportsToEmployees: [],
      item: {
        reportsTo: {},
        address: {},
      },
      showFormModal: false,
      showDeleteModal: false,
      showReportsToModal: false,
      searchReportsTo: '',
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
            employees{
              id, 
              firstName, 
              lastName,
              title,
              birthDate,
              hireDate,
              address { 
                id, 
                street, 
                city,
                region,
                postalCode,
                country,
                phone
              },
              reports_to,
              reportsTo {
                firstName,
                lastName
              }
            }
      }`
        );
        this.employees = result.data.data.employees;
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
        reportsTo: {
          firstName: ""
        },
        address: {
          street: "",
          city: "",
          region: "",
          postalCode: "",
          country: "",
          phone: "",
        },
      };
      this.errorMessage = "";
      this.showFormModal = true;
    },
    edit(item) {
      console.log("edit", item);
      this.item = Object.assign({}, item);
      this.item.birthDate = dateToInput(this.item.birthDate)
      this.item.hireDate = dateToInput(this.item.hireDate)
      if (this.item.address === null) {
        this.item.address = {}
      }
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
                createEmployee(
                    employee: {
                      firstName: "${this.item.firstName}",
                      lastName: "${this.item.lastName}",
                      title: "${this.item.title}",
                      birthDate: "${this.item.birthDate}",
                      hireDate: "${this.item.hireDate}",
                      reports_to: "${this.item.reports_to}",
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
                editEmployee(
                    id: "${this.item.id}",
                     employee:{
                      firstName: "${this.item.firstName}",
                      lastName: "${this.item.lastName}",
                      title: "${this.item.title}",
                      birthDate: "${this.item.birthDate}",
                      hireDate: "${this.item.hireDate}",
                      address: { 
                        street: "${this.item.address.street}",
                        city: "${this.item.address.city}",
                        region: "${this.item.address.region}",
                        postalCode: "${this.item.address.postalCode}",
                        country: "${this.item.address.country}",
                        phone: "${this.item.address.phone}"
                      },
                      reports_to: "${this.item.reports_to}",
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
                deleteEmployee(id:"${this.item.id}")
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
    async refreshReportsToEmployees() {
      const filter = this.searchReportsTo ? `(name:"${this.searchReportsTo}")` : ''
      const result = await graphql.api(
          `{
            employees${filter}{
              id, 
              firstName, 
              lastName,
            }
      }`);
      this.reportsToEmployees = result.data.data.employees.filter(
        employee => employee.id != this.item.id
      );
      
    },
    openReportsToModal() {
        this.refreshReportsToEmployees();
        this.showReportsToModal=true;
    },
    async confirmReportsTo(reportsTo) {
      this.item.reportsTo.firstName = reportsTo.firstName
      this.item.reports_to = reportsTo.id
      this.showReportsToModal=false;
    }
  },
};
</script>
<style scoped>
td {
  vertical-align: middle;
}
</style>