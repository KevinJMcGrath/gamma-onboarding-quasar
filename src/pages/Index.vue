<template>  
  <q-form class="q-gutter-md">

  <div class="q-pa-md"> 
    <div class="row q-col-gutter-x-md">
      <div class="col">
        <div class="row justify-between">

          <div class="col-3 self-center">
            <q-btn push color="primary" label="Get Tenants" @click="load_tenant_data" :loading="loading_tenants"> 
              <template v-slot:loading>
                <q-spinner-gears class="on-left" />
              </template>
            </q-btn>
          </div>

          <div class="col-8" >
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

        <q-space />

        <div class="row q-mt-sm"> 
          <div class="col-3">
            <q-btn push color="primary" label="Generate RSA Key" v-bind:disabled="btn_rsa_disable" @click="get_rsa_token" :loading="loading_rsa"/> 
          </div>
          <div class="col">
            <q-btn push color="primary" label="Finalize" @click="finalize" :loading="loading_finalize" v-bind:disabled="btn_finalize_disable"/> 
          </div>
        </div>

        <div class="row q-mt-sm">
        <div class="col">
          <q-list bordered class="rounded-borders">
            <q-expansion-item group="onboarding" label="Tenant Details" icon="cloud">
              <q-card dark bordered class="bg-grey-9">
                <q-card-section>
                  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                    <div v-show="show_tenant_details">
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
                        <div class="col-3 text-left">{{ $store.state.user.email }}</div>
                      </div>
                      
                      <div class="row text-right q-gutter-sm">
                        <div class="col-2"><b>Password:</b></div>
                        <div class="col-auto">{{ $store.state.user.initial_password }}</div>
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
                      
                    </div>
                  </transition>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-separator />

            <q-expansion-item group="onboarding" label="RSA Public Key" icon="shield">
              <q-card dark bordered class="bg-grey-9 rsa_card">
                <q-card-section>
                  <!-- vue.js template syntax renders as plaintext. This is how you get html. BE CAREFUL -->
                  <span v-html="$store.state.tenant.rsa_key"></span>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-separator />

            <q-expansion-item group="onboarding" label="Intermission" icon="sticky_note_2">
              <q-card dark bordered class="bg-grey-9 intermission_card">
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
                          Email Address: mtadminbot@{{$store.state.user.domain}}<br/>
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
        </div>

        <div class="row">
          <q-card dark bordered class="bg-grey-9 details_card">
            <q-card-section>
              <div class="text-h6">Gamma Signup Details</div>
            </q-card-section>

            <q-separator dark inset />

            <q-card-section>
              <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                <div v-show="show_tenant_details">
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
                    <div class="col-3 text-left">{{ $store.state.user.email }}</div>
                  </div>
                  
                  <div class="row text-right q-gutter-sm">
                    <div class="col-2"><b>Password:</b></div>
                    <div class="col-auto">{{ $store.state.user.initial_password }}</div>
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
                  
                </div>
              </transition>
            </q-card-section>

            <q-inner-loading :showing="spinner_visible">
              <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>
          </q-card>
        </div>

        <q-separator class="q-my-md" />

        <!-- <div class="row justify-end">
          <q-btn push color="primary" label="Generate RSA Key" v-bind:disabled="btn_rsa_disable" @click="get_rsa_token" :loading="loading_rsa"/> 
        </div> -->
        
        <div class="row">
          <q-card dark bordered class="bg-grey-9 rsa_card">
            <q-card-section>
              <div class="text-h6">RSA Public Key</div>          
            </q-card-section>

            <q-separator dark inset />

            <q-card-section>
              <!-- vue.js template syntax renders as plaintext. This is how you get html. BE CAREFUL -->
              <span v-html="$store.state.tenant.rsa_key"></span>
            </q-card-section>
          </q-card>
        </div>

        <q-separator class="q-my-md" />

        <div class="row">
          <q-card dark bordered class="bg-grey-9 intermission_card">
            <q-card-section>
              <div class="text-h6">Intermission</div>          
            </q-card-section>

            <q-separator dark inset />

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
                      Email Address: mtadminbot@{{$store.state.user.domain}}<br/>
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
        </div>

        <q-separator class="q-my-md" />

        <!-- <div class="row justify-end">
          <q-btn push color="primary" label="Finalize" @click="finalize" :loading="loading_finalize" v-bind:disabled="btn_finalize_disable"/> 
        </div> -->

      </div>
      <div class="col-6" >
        <div class="row">
          <q-card dark bordered class="bg-grey-9 onboarding_status_card">
            <q-card-section>
              <div class="text-h6">Onboarding Status</div>          
            </q-card-section>

            <q-separator dark inset />

            <q-card-section>
              <div class="c64_terminal">
                <ul>
                  <li v-for="log_item in $store.state.log">
                    <span v-bind:class="log_item.classname">{{log_item.text}}</span>
                  </li>
                </ul>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>    
  </div>

  <!-- Error Dialog Box -->
  <!-- <q-dialog v-model="error.show" persistent>
    <q-card dark>
      <q-card-section>
        <div class="text-h6">Error</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div>
          {{error.message}}
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn push color="amber" label="OK" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog> -->

  </q-form>
</template>

<script>
export default {
  name: 'PageIndex',
  data() {
    return {
      tenant_selected: null,      
      show_tenant_details: true,      
      spinner_visible: false,
      loading_tenants: false,
      loading_rsa: false,
      loading_finalize: false,
      btn_load_disable: true,
      btn_finalize_disable: true,
      btn_rsa_disable: true,
      // error: {
      //   message: '',
      //   show: false
      // }
    }
  },
  mounted() {    

  },
  methods: {
    async load_tenant_data() {
      this.loading_tenants = true

      this.addLogItem(`Connecting to Gamma Onboarding backend at ${this.$store.getters.apiBaseUrl}...`)
      this.addLogItem('Loading recent completed tenant notifications...')
      let resp = await this.$store.dispatch('getTenantBuildNotifications')

      this.loading_tenants = false

      if (!resp.success) {
        this.addErrorItem('ERROR!!! Problem loading tenant data from Symphony. Talk to Kevin or Miguel')
      }
      else {
        this.appendLogItem('Done!')
        this.btn_rsa_disable = false
      }
    },
    load_tenant_details() {
      this.show_tenant_details = true
      this.$store.dispatch('loadTenantDetails', this.tenant_selected.id)
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
    addLogItem(msg) {
      this.$store.dispatch('addLogItem', {message: msg, isError: false})
    },
    appendLogItem(msg) {
      this.$store.dispatch('appendLastLogItem', msg)
    },
    addErrorItem(msg) {
      this.$store.dispatch('addLogItem', {message: msg, isError: true})
    }
  }
}
</script>

<style lang="sass" scoped>
.details_card
  margin-top: 10px
  width: 100%
  height: 200px

.rsa_card
  margin-top: 10px
  width: 100%
  height: 400px

.intermission_card
  margin-top: 10px
  width: 100%
  height: 300px

.onboarding_status_card
  margin-top: 10px
  width: 100%
  height: 700px  

.white_label
  color: white
  margin-left: 15px

.log_err
  color: firebrick

</style>
