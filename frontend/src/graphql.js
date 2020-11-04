import axios from 'axios'
import router from './router'
import store from './store'

export default {
    api: query => axios.create(
        {
            baseURL: process.env.VUE_APP_API,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + store.token
            },
            timeout: 1000
        }).post('/api', { query })
          .catch(error => {
            if(error.response.status === 401) {
                console.log("UNAUTHORIZED")
                router.push('/')
            }
          }),
    auth: query => axios.create(
        {
            baseURL: process.env.VUE_APP_API,
            headers: { 'Content-Type': 'application/json' },
            timeout: 1000
        }).post('/auth', { query })

}