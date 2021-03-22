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
        tenant_admin_url: '',
        rsa_key: '',
        rsa_key_html: '',
        bot_email: ''
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
        initial_password: '',
        domain: ''
    },
    log: ['Initializing system...'],    
    tenant_list: []
})

function tenantCompare(t1, t2) {
    if (t1.timestamp < t2.timestamp) {
        return -1
    }
    else if (t1.timestamp > t2.timestamp) {
        return 1
    }
    else {
        return 0
    }
}

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: initial_state(),

    mutations: {
        SET_TENANT_ID(state, tenant_id) {
            state.tenant.tenant_id = tenant_id
            state.tenant.tenant_url = `https://${tenant_id}.p.symphony.com`
            state.tenant.tenant_admin_url = `${state.tenant.tenant_url}/admin-console/`
        },
        SET_RSA_PUBLIC_KEY(state, rsa_key) {
            state.tenant.rsa_key_html = rsa_key
            state.tenant.rsa_key = rsa_key.replaceAll('<br/>', '\n')
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
            state.user.domain = email.split('@')[1]
            state.tenant.bot_email = `mtadminbot@${state.user.domain}`
        },
        SET_COMPANY_NAME(state, company_name) {
            state.user.company_name = company_name
        },
        SET_INITIAL_PWD(state, pwd) {
            state.user.initial_password = pwd
        },
        ADD_LOG_ITEM(state, log_item) {
            state.log.push(log_item)
        },
        APPEND_LAST_LOG_ITEM(state, msg) {
            state.log[state.log.length - 1].text += msg
        },
        CLEAR_LOG(state) {
            state.log = []
        },
        SET_TENANT_LIST(state, tenant_list) {
            state.tenant_list = tenant_list
        }
  },
    getters: {
        apiBaseUrl: (state) => {
            return `${process.env.API_BASE_URL}:${process.env.API_PORT}`
        }
  },
  actions: {
    loadTenantDetails({state, commit}, tenant_id)
    {
        for (const tenant of state.tenant_list)
        {
            if (tenant.id === tenant_id) {
                commit('SET_TENANT_ID', tenant.id)
                commit('SET_FIRSTNAME', tenant.firstname)
                commit('SET_LASTNAME', tenant.lastname)
                commit('SET_EMAIL', tenant.email)
                commit('SET_COMPANY_NAME', tenant.company)
                commit('SET_INITIAL_PWD', tenant.password)
            }
        }
    },
    addLogItem({state, commit}, item) {
        const log_item = {
            text: item.message,
            classname: item.isError ? 'log_err' : 'log_std'
        }

        commit("ADD_LOG_ITEM", log_item)
    },
    appendLastLogItem({state, commit}, msg) {
        commit("APPEND_LAST_LOG_ITEM", msg)
    },
    async verifyBackendConnection({state, getters}) {
        const retval = {
            success: true,
            message: 'Default Message'
        }

        try {
            await axios.get(`${getters.apiBaseUrl}/api`)
        }
        catch (error) {
            console.error(error)
            retval.success = false
            retval.message = `Unable to connect to onboarding backend. ${error}`
        }
        finally {
            return retval
        }
    },
    async getRSAPublicKey({state, getters, commit}) {
        const retval = {
            success: true,
            message: 'Default Message'
        }

        try {
            let resp = await axios.get(`${getters.apiBaseUrl}/api/rsa?tenant_id=${state.tenant.tenant_id}`)
            commit('SET_RSA_PUBLIC_KEY', resp.data.public_key)            
        }
        catch (error) {
            console.error(error)
            retval.success = false
            retval.message = `Unable to get RSA Public Key. ${error}`
        }
        finally {
            return retval
        }
    },
    async getSSE({state, getters, commit}) {
        const retval = {
            success: true,
            message: 'Default Message'
        }

        try {
            let resp = await axios.get(`${getters.apiBaseUrl}/api/sse?email=${state.user.email}`)
            commit('SET_SSE_ID', resp.data.sse_id)
            commit('SET_ACCOUNT_ID', resp.data.account_id)
        }
        catch (error) {
            console.error(error)
            retval.success = false
            retval.message = `Unable to get SSE Id. ${error}`
        }
        finally {
            return retval
        }
    },
    async getTenantBuildNotifications({state, getters, commit}) {
        const retval = {
            success: true,
            message: 'Default Message'
        }

        try {            
            if (state.tenant_list.length === 0) {
                
                let resp = await axios.get(`${getters.apiBaseUrl}/api/tenants`)

                const tenant_data = resp.data.tenants                
                tenant_data.sort(tenantCompare)

                commit('SET_TENANT_LIST', tenant_data)
            }
            
        }
        catch (error) {
            console.error(error)
            retval.success = false
            retval.message = `Unable to get tenant notifications. ${error}`
        }
        finally {
            return retval
        }
    },
    async deployEdwin({state, getters}) {
        const retval = {
            success: true,
            message: 'Default Message'
        }

        try {            
            const payload = { tenant_id: state.tenant.tenant_id}                
            let resp = await axios.post(`${getters.apiBaseUrl}/api/finalize/edwin`, payload)
            
        }
        catch (error) {
            console.error(error)
            retval.success = false
            retval.message = `Unable to get deploy Edwin. ${error}`
        }
        finally {
            return retval
        } 
    },
    async createJIRAs({state, getters}) {
        const retval = {
            success: true,
            message: 'Default Message'
        }

        try {
            const payload = {
                tenant_id: state.tenant.tenant_id,
                company: state.user.company_name,
                account_id: state.sfdc.account_id
            }
                
            let resp = await axios.post(`${getters.apiBaseUrl}/api/finalize/jira`, payload)
        }
        catch (error) {
            console.error(error)
            retval.success = false
            retval.message = `Unable to create JIRA tickets. ${error}`
        }
        finally {
            return retval
        } 
    },
    async createZendesk({state, getters}) {
        const retval = {
            success: true,
            message: 'Default Message'
        }

        try {
            const payload = {
                tenant_id: state.tenant.tenant_id,
                company: state.user.company_name,
                firstname: state.user.firstname,
                lastname: state.user.lastname,
                email: state.user.email
            }                
            let resp = await axios.post(`${getters.apiBaseUrl}/api/finalize/zendesk`, payload)
        }
        catch (error) {
            console.error(error)
            retval.success = false
            retval.message = `Unable to create Zendesk objects. ${error}`
        }
        finally {
            return retval
        } 
    },
    async billClient({state, getters}) {
        const retval = {
            success: true,
            message: 'Default Message'
        }

        try {
            const payload = {
                email: state.user.email
            }
                
            let resp = await axios.post(`${getters.apiBaseUrl}/api/finalize/stripe`, payload)
        }
        catch (error) {
            console.error(error)
            retval.success = false
            retval.message = `Unable to submit subscription to Stripe. ${error}`
        }
        finally {
            return retval
        } 
    },
    async updateSFDC({state, getters}) {
        const retval = {
            success: true,
            message: 'Default Message'
        }

        try {
            const payload = {
                tenant_id: state.tenant.tenant_id,
                email: state.user.email
            }
                
            let resp = await axios.post(`${getters.apiBaseUrl}/api/finalize/salesforce`, payload)
        }
        catch (error) {
            console.error(error)
            retval.success = false
            retval.message = `Unable to get tenant notifications. ${error}`
        }
        finally {
            return retval
        } 
    },
    async notifyClient({state, getters}) {
        const retval = {
            success: true,
            message: 'Default Message'
        }

        try {
            const payload = {                
                email: state.user.email
            }
                
            let resp = await axios.post(`${getters.apiBaseUrl}/api/notification/client`, payload)
        }
        catch (error) {
            console.error(error)
            retval.success = false
            retval.message = `Unable to get tenant notifications. ${error}`
        }
        finally {
            return retval
        } 
    }
  },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
