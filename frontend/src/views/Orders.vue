<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">Orders</p>
      <div class="pt-1 pr-1">
        <a href="#" class="button" @click="add()">Add Order</a>
      </div>
    </header>
    <div class="card-content">
      <table class="table is-striped is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>Id</th>
            <th>Order Date</th>
            <th>Customer</th>
            <th>Employee</th>
            <th>Shipper</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in orders" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.localeDate }}</td>
            <td>{{ item.customer.contactName }}</td>
            <td>{{ item.employee.firstName }}</td>
            <td>{{ item.shipper.companyName }}</td>
            <td>
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
      <div class="modal-card is-widescreen">
        <header class="modal-card-head">
          <p class="modal-card-title">New Order</p>
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

          <div class="columns is-multiline">
            <div class="column is-4-tablet is-2-desktop">
              <div class="field">
                <label class="label">Date</label>
                <div class="control">
                  <input
                    class="input"
                    type="date"
                    v-model="order.orderDate"
                    placeholder="Hire Date"
                  />
                </div>
              </div>
            </div>
            <div class="column is-2">
              <div class="field">
                <label class="label">Freight</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="order.freight"
                    placeholder="Street"
                  />
                </div>
              </div>
            </div>
            <div class="column is-6-tablet is-2-desktop">
              <div class="field">
                <label class="label">Customer</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="order.customer_id">
                      <option
                        v-for="customer in customers"
                        :key="customer.id"
                        :value="customer.id"
                      >
                        {{ customer.contactName }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="column is-6-tablet is-3-desktop">
              <div class="field">
                <label class="label">Shipper</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="order.shipper_id">
                      <option
                        v-for="shipper in shippers"
                        :key="shipper.id"
                        :value="shipper.id"
                      >
                        {{ shipper.companyName }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-6-tablet is-3-desktop">
              <div class="field">
                <label class="label">Employee</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="order.employee_id">
                      <option
                        v-for="employee in employees"
                        :key="employee.id"
                        :value="employee.id"
                      >
                        {{ employee.firstName }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="columns is-multiline is-vcentered">
            <div class="column is-8">
              <div class="field">
                <label class="label">Product</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="product_id">
                      <option
                        v-for="product in products"
                        :key="product.id"
                        :value="product.id"
                      >
                       {{ product.name }} ({{ product.unitsInStock }})
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-2">
              <div class="field">
                <label class="label">Quantity</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="quantity"
                    placeholder="Street"
                  />
                </div>
              </div>
            </div>
            <div class="column is-2">
              <button
                class="button"
                @click="addProduct()"
                style="margin-top: 30px"
                :disabled="product_id==0"
              >
                Add
              </button>
            </div>
          </div>
          <div class="columns is-multiline">

            <div class="box is-2 m-2 shadow-0" v-for="item in order.items" :key="item.id">
              {{item.name}} ({{item.quantity}}) 
              <button class="button is-ghost" @click="removeProduct(item)">Remove</button>
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
          Delete Order <b>{{ order.id }}</b
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
import { dateToDateView, dateToInput, inputToDate } from '../utils';

export default {
  name: "Orders",
  data() {
    return {
      orders: [],
      shippers: [],
      products: [],
      employees: [],
      customers: [],
      order: {},
      product_id: 0,
      quantity: 1,
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
          `
          {
            orders{
              id,
              orderDate,
              freight,
              customer {
                contactName                
              },
              employee {
                firstName, lastName
              },
              shipper{
                contactName, companyName
              },
              to {
                city,
                street,
                phone
              },
              items {
                unitPrice,
                quantity,
                product {
                  name, unitPrice
                }
              }
            },
            products(discontinued:false) {
              id,
              name,
              unitPrice,
              unitsInStock
            },
            employees {
              id,firstName,lastName
            },
            shippers {
              id,companyName,contactEmail
            },
            customers {
              id,contactName, contactEmail, 
              address {
                street, city, region, postalCode,
                country, phone
              }
            }
          }`
        );
        this.orders = result.data.data.orders;
        this.products = result.data.data.products;
        this.employees = result.data.data.employees;
        this.shippers = result.data.data.shippers;
        this.customers = result.data.data.customers;
        this.showFormModal = false;
        this.showDeleteModal = false;

        this.orders.forEach( o => o.localeDate = dateToDateView(o.orderDate))

      } catch (error) {
        alert("Error: " + error.response.data.errors[0].message);
      }
    },
    add() {
      console.log("add");
      this.order = {
        id: null,
        orderDate: new Date().toISOString().substring(0, 10),
        freight: 0,
        customer: {},
        employee: {},
         shipper: {},
        to: {},
        items: [],
      };
      this.errorMessage = "";
      this.showFormModal = true;
    },
    edit(item) {
      console.log("edit", item);
      item.orderDate = dateToInput(item.orderDate)
      this.order = Object.assign({}, item);
      this.errorMessage = "";
      this.showFormModal = true;
    },
    del(item) {
      console.log("del", item);
      this.order = Object.assign({}, item);
      this.showDeleteModal = true;
    },
    async save() {
      this.errorMessage = "";
      
      const items = this.order.items.map( product => (`{
                  unitPrice:${product.unitPrice}, 
                  quantity: ${product.quantity}, 
                  product_id: ${product.id}
                }`)).join(',')
      
      const address = this.customers.find(c => c.id == this.order.customer_id).address
      const orderDate = inputToDate(this.order.orderDate)
      console.log({orderDate})
      
      const query = `mutation {
        createOrder(
          order: {
             orderDate: "${orderDate}",
             freight: ${this.order.freight},
             customer_id:  ${this.order.customer_id},
             employee_id: ${this.order.employee_id},
             shipper_id: ${this.order.shipper_id},
             to: {
                street: "${address.street}",
                city: "${address.city}",
                region: "${address.region}",
                postalCode: "${address.postalCode}",
                country: "${address.country}",
                phone: "${address.phone}"         
             },
             items: [${items}]
          }
        )
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
                deleteOrder(id:"${this.order.id}")
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
    addProduct() {
      const product = this.products.find( p => p.id == this.product_id)
      product.quantity = this.quantity
      this.order.items.push(Object.assign({},product))
      this.products = this.products.filter(p => p.id != this.product_id)
      this.product_id = 0
    },
    removeProduct(item){
      this.products.push(item)
      this.order.items = this.order.items.filter(i => i.id != item.id)
    }
  },
};
</script>
<style scoped>
.modal-card,
.modal-content {
  width: calc(100% - 40px);
}
.box {
  border-color: #aaa;
  box-shadow: 0 !important;
}
</style>
