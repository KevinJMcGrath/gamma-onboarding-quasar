<template>  
  <q-form class="q-gutter-md">
    <q-banner v-bind:class="[banner_bgcolor, banner_textcolor, banner_show]">
      You are currently viewing this app in {{appModeText}} mode.
    </q-banner>

  <div class="q-pa-md"> 

    <div class="row justify-left q-gutter-sm">
      <!-- Get Tenants Button Row -->
      <div class="col-auto self-center">
        <q-btn push color="primary" label="Get Tenants" @click="load_tenant_data" :loading="loading_tenants" v-bind:disabled="btn_get_tenants_disable"> 
          <template v-slot:loading>
            <q-spinner-gears class="on-left" />
          </template>
        </q-btn>
      </div>

      <!-- Tenant Dropdown List -->  
      <div class="col-5" >
        <q-select standout="bg-teal text-white" label="Recent Gamma Submissions" v-model="tenant_selected" 
          :options="$store.state.tenant_list" 
          option-value="id"
          option-label="company"
          @input="load_tenant_details">
          <!-- don't use v-bind or : syntax on option-value or option-label unless using a function -->

          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
          
        </q-select>
        
      </div>
    </div> 
    
    <!-- Button Row -->
    <div class="row justify-left q-gutter-sm q-mt-md"> 
      <div class="col-auto">
        <q-btn push color="primary" label="Generate RSA Key" v-bind:disabled="btn_rsa_disable" @click="get_rsa_token" :loading="loading_rsa"/> 
      </div>
      <div class="col-auto">
        <q-btn push color="primary" label="Finalize" @click="finalize" :loading="loading_finalize" v-bind:disabled="btn_finalize_disable"/> 
      </div>
    </div>

    <!-- Accordian -->
    <div class="row q-mt-sm">
      <div class="col-8">
        <q-list bordered class="rounded-borders">
          <q-expansion-item group="onboarding" label="Tenant Details" icon="cloud" v-model="expand_tenants">
            <q-card dark bordered class="bg-grey-9">
              <q-card-section>
                <div class="row text-right q-gutter-sm">
                  <div class="col-2"><b>Company Name:</b></div>
                  <div class="col-3 text-left">{{ $store.state.user.company_name }}</div>
                  <div class="col-2"><b>Tenant Id:</b></div>
                  <div class="col-3 text-left">{{ $store.state.tenant.tenant_id }}</div>
                </div>

                <div class="row text-right q-gutter-sm">
                  <div class="col-2"><b>Admin Name:</b></div>
                  <div class="col-3 text-left">{{ $store.state.user.firstname }} {{ $store.state.user.lastname}}</div>
                  <div class="col-2"><b>Admin Email:</b></div>
                  <div class="col-3 text-left">
                    {{ $store.state.user.email }}
                    <q-btn flat padding="none" icon="content_copy" color="primary" @click="copy_value($store.state.user.email)"/>
                  </div>
                </div>
                
                <div class="row text-right q-gutter-sm">
                  <div class="col-2"><b>Password:</b></div>
                  <div class="col-auto">
                    {{ $store.state.user.initial_password }}
                    <q-btn flat padding="none" icon="content_copy" color="primary" @click="copy_value($store.state.user.initial_password)"/>
                  </div>
                </div>
                  
                <div class="row text-right q-gutter-sm">
                  <div class="col-2"><b>AC Portal:</b></div>
                  <div class="col-auto">
                    <a v-bind:href="$store.state.tenant.tenant_admin_url" 
                      style="color: white"
                      target=_blank>{{ $store.state.tenant.tenant_admin_url }}
                    </a>
                    </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-separator />

          <q-expansion-item group="onboarding" label="RSA Public Key" icon="shield" v-model="expand_rsa">
            <q-card dark bordered class="bg-grey-9 rsa_card">
              <q-card-section>
                Copy RSA Public Key ->
                <q-btn flat padding="none" icon="content_copy" color="primary" @click="copy_value($store.state.tenant.rsa_key)"/>
              </q-card-section>
              <q-card-section>
                <!-- vue.js template syntax renders as plaintext. This is how you get html. BE CAREFUL -->
                <span v-html="$store.state.tenant.rsa_key_html"></span>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-separator />

          <q-expansion-item group="onboarding" label="Intermission" icon="sticky_note_2" v-model="expand_finalize">
            <q-card dark bordered class="bg-grey-9">
              <q-card-section>
                Ensure you have completed the following steps before continuing:
                <q-list>

                  <q-item>
                    <q-item-section avatar>
                      <q-icon color="teal" name="check" />
                    </q-item-section>
                    <q-item-section>Set all entitlements to "Yes" for intial user</q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section avatar>
                      <q-icon color="teal" name="check" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Create mtadminbot service account</q-item-label>
                      <q-item-label caption lines=4 class="white_label">
                        Username: mtadminbot <br/>
                        Display name: Edwin<br/>
                        Email Address: {{$store.state.tenant.bot_email}} 
                        <q-btn flat padding="none" icon="content_copy" color="primary" @click="copy_value($store.state.tenant.bot_email)"/>
                        <br/>
                        User Provisioning Flag: True
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section avatar>
                      <q-icon color="teal" name="check" />
                    </q-item-section>
                    <q-item-section>Copy RSA public key to RSA box</q-item-section>
                  </q-item>

                </q-list>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
      <div class="col-auto">
        <q-btn push color="primary" label="Test Connection" @click="verify_backend" /><br/>
        <q-btn push color="primary" label="Load SSE" @click="load_sse_data" /><br/>
        <q-btn push color="primary" label="Deploy Edwin" @click="deploy_edwin" /><br/>
        <q-btn push color="primary" label="Create JIRA Records" @click="create_jira_records" /><br/>
        <q-btn push color="primary" label="Create Zendesk Records" @click="create_zendesk_records" /><br/>
        <q-btn push color="primary" label="Update Salesforce" @click="update_salesforce" /><br/>
        <q-btn push color="primary" label="Submit Subscription" @click="bill_client" /><br/>
        <q-btn push color="primary" label="Notify Client" @click="notify_client" />
        <div class="row">
          <div class="col-auto">
            <q-btn push color="primary" label="Clear Log" @click="clear_log" />
          </div>
          <div class="col-auto">
            <q-btn push color="primary" label="Add log item" @click="test_log_item" />
          </div>
        </div>
      </div>
    </div>

    <!-- Debug Log -->
    <div class="row q-mt-sm">
      <div class="col">
        <q-card dark bordered class="bg-grey-9">
            <q-card-section>
              <div class="text-h6">Onboarding Status</div>          
            </q-card-section>

            <q-separator dark inset />

            <q-card-section>
              <q-scroll-area class="c64_terminal" ref="debug_log" @scroll="activate_scroll">              
                <ul>
                  <li v-for="log_item in $store.state.log">
                    <span v-bind:class="log_item.classname">{{log_item.text}}</span>
                  </li>
                </ul>              
              </q-scroll-area>
            </q-card-section>
          </q-card>
      </div>
    </div>

  </div>

  </q-form>
</template>

<script>
export default {
  name: 'PageIndex',
  data() {
    return {
      tenant_selected: null,
      btn_get_tenants_disable: true,      
      btn_load_disable: true,
      btn_finalize_disable: true,
      btn_rsa_disable: true,
      loading_tenants: false,
      loading_rsa: false,
      loading_finalize: false,      
      expand_tenants: false,
      expand_rsa: false,
      expand_finalize: false
    }
  },
  async mounted() {    
    await this.verify_backend()
  },
  computed: {
    banner_show() {
      if (this.$store.getters.appMode == 'UAT' || this.$store.getters.appMode == 'DEV') {
        return ''
      }
      else {
        return 'hidden'
      }

    },
    banner_bgcolor() {
      if (this.$store.getters.appMode == 'DEV') {
        return 'bg-orange'
      }
      else {
        return 'bg-red'
      }
    },
    banner_textcolor() {
      return 'text-white'
    },
    appModeText() {
      return this.$store.getters.appMode
    }
  },
  methods: {
    async load_tenant_data() {
      this.loading_tenants = true

      
      this.addLogItem('Loading recent completed tenant notifications...')
      let resp = await this.$store.dispatch('getTenantBuildNotifications')

      this.loading_tenants = false
      

      if (!resp.success) {
        this.addErrorItem('ERROR!!! Problem loading tenant data from Symphony. Talk to Kevin or Miguel')
      }
      else {
        this.appendLogItem('Done!')
               
      }
    },
    load_tenant_details() {
      if (this.tenant_selected) {
        this.expand_tenants = true
        this.btn_rsa_disable = false
        this.$store.dispatch('loadTenantDetails', this.tenant_selected.id)
      }
      
    },
    async verify_backend() {
      this.addLogItem(`Connecting to Gamma Onboarding backend at ${this.$store.getters.apiBaseUrl}...`)
      let resp = await this.$store.dispatch('verifyBackendConnection')

      if (!resp.success) {
        this.addErrorItem(`ERROR!!! Unable to communicate with backend. Cannot proceed.`)
      }
      else {
        this.btn_get_tenants_disable = false
        this.appendLogItem('Done!')
      }
    },
    async get_rsa_token() {
      this.loading_rsa = true

      this.addLogItem('Generating RSA Keypair...')
      let resp = await this.$store.dispatch('getRSAPublicKey')

      this.loading_rsa = false

      if (!resp.success) {
        this.addErrorItem(`ERROR!!! Unable to get RSA keypair. Error: ${resp.message}`)
      }
      else {
        this.btn_finalize_disable = false
        this.appendLogItem('Done!')
        this.expand_rsa = true
      }
    },
    async finalize() {
      this.loading_finalize = true

      await this.load_sse_data()
      await this.deploy_edwin()
      /*await this.create_jira_records()
      await this.create_zendesk_records()
      await this.bill_client()
      await this.update_salesforce()
      await this.notify_client()*/

      this.loading_finalize = false
    },
    async load_sse_data() {
      
      this.addLogItem('Loading Self Service Entry data...')

      let resp = await this.$store.dispatch('getSSE')

      if (!resp.success) {
        this.addErrorItem(`ERROR!! Unable to load SSE info from salesforce. Error: ${resp.message}`)
      }
      else {
        this.appendLogItem('Done!')
      }
    },
    async deploy_edwin() {
      
      this.addLogItem('Deploying Edwin...')

      let resp = await this.$store.dispatch('deployEdwin')

      if (!resp.success) {
        this.addErrorItem(`ERROR!! Unable to complete Edwin deployment. Error: ${resp.message}`)
      }
      else {
        this.appendLogItem('Done!')
      }
    },
    async create_jira_records() {
      
      this.addLogItem('Creating JIRA entries...')

      let resp = await this.$store.dispatch('createJIRAs')

      if (!resp.success) {
        this.addErrorItem(`ERROR!! Unable to add JIRA entries. Error: ${resp.message}`)
      }
      else {
        this.appendLogItem('Done!')
      }
    },
    async create_zendesk_records() {
      
      this.addLogItem('Creating Zendesk entires...')

      let resp = await this.$store.dispatch('createZendesk')

      if (!resp.success) {
        this.addErrorItem(`ERROR!! Unable to add Zendesk entries. Error: ${resp.message}`)
      }
      else {
        this.appendLogItem('Done!')
      }
    },
    async bill_client() {
      
      this.addLogItem('Submitting subscription to Stripe...')

      let resp = await this.$store.dispatch('billClient')

      if (!resp.success) {
        this.addErrorItem(`ERROR!! Unable to bill client through Stripe. Error: ${resp.message}`)
      }
      else {
        this.appendLogItem('Done!')
      }
    },
    async update_salesforce() {
      
      this.addLogItem('Updating Salesforce data...')

      let resp = await this.$store.dispatch('updateSFDC')

      if (!resp.success) {
        this.addErrorItem(`ERROR!! Unable to finish Salesforce updates. Error: ${resp.message}`)
      }
      else {
        this.appendLogItem('Done!')
      }
    },
    async notify_client() {
      
      this.addLogItem('Sending Contact onboarding email...')

      let resp = await this.$store.dispatch('notifyClient')

      if (!resp.success) {
        this.addErrorItem(`ERROR!! Unable to send client notification. Error: ${resp.message}`)
      }
      else {
        this.appendLogItem('Done!')
      }
    },
    copy_value(evt) {
      try {
        navigator.clipboard.writeText(evt)
      } catch(error) {
        console.log(`Error copying data to clipboard: ${error}`)
      }
    },
    addLogItem(msg) {
      this.$store.dispatch('addLogItem', {message: msg, isError: false})
    },
    appendLogItem(msg) {
      this.$store.dispatch('appendLastLogItem', msg)
    },
    addErrorItem(msg) {
      this.$store.dispatch('addLogItem', {message: msg, isError: true})
    },
    clear_log() {
      this.$store.commit('CLEAR_LOG')
    },
    test_log_item() {
      this.addLogItem('Adding a test log item...')
    },
    activate_scroll(info) {
      //console.log(info)

      if (info.verticalSize > info.verticalContainerSize) {
        this.$refs.debug_log.setScrollPosition(this.$refs.debug_log.$el.scrollHeight, 1)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.rsa_card
  margin-top: 10px
  width: 100%
  height: 400px

.c64_terminal
    color: #6f6
    font-family: "Ubuntu"
    width: 100%
    height: 400px
    
.c64_terminal li
    list-style: none  

.white_label
  color: white
  margin-left: 15px

.log_err
  color: firebrick

</style>
