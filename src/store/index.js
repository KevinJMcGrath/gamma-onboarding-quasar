import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

// const debug = process.env.NODE_ENV !== 'production'

const initial_state = () => ({ 
    tenant: {
        tenant_id: '',
        tenant_url: '',
        tenant_admin_url: ''
    },
    sfdc: {
        account_id: '',
        sse_id: '',
        contact_id: ''
    },
    user: {
        firstname: '',
        lastname: '',
        email: '',
        company_name: '',
        initial_password: ''
    },
    log: ['Initializing system...']
})

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: initial_state(),

    mutations: {
      SET_TENANT_ID(state, tenant_id) {
          state.tenant.tenant_id = tenant_id
          state.tenant.tenant_url = `https://${tenant_id}.p.symphony.com`
          state.tenant.tenant_admin_url = `${state.tenant.tenant_url}/admin-console/`
      },
      SET_ACCOUNT_ID(state, acct_id) {
          state.sfdc.account_id = acct_id
      },
      SET_SSE_ID(state, sse_id) {
          state.sfdc.sse_id = sse_id
      },
      SET_CONTACT_ID(state, cnt_id) {
          state.sfdc.contact_id = cnt_id
      },
      SET_FIRSTNAME(state, firstname) {
          state.user.firstname = firstname
      },
      SET_LASTNAME(state, lastname) {
          state.user.lastname = lastname
      },
      SET_EMAIL(state, email) {
          state.user.email = email
      },
      SET_COMPANY_NAME(state, company_name) {
          state.user.company_name = company_name
      },
      SET_INITIAL_PWD(state, pwd) {
          state.user.initial_password = pwd
      },
      ADD_LOG_ITEM(state, log_item) {
          state.log.push(log_item)
      }
  },
  actions: {
    async getTenantBuildNotifications({state}) {

    }
  },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
