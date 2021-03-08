<template>  
  <q-form class="q-gutter-md">

  <div class="q-pa-md"> 
    <div class="row q-col-gutter-x-md">
      <div class="col">
        <div class="row justify-between">

          <div class="col-8" >
            <q-select standout="bg-teal text-white" v-model="model" :options="ddl_tenant_options" label="Recent Gamma Submissions"/>
          </div>

          <div class="col-3 self-center">
            <q-btn push color="primary" label="Get Tenants" @click="load_tenant_data" :loading="loading_tenants"> 
              <template v-slot:loading>
                <q-spinner-gears class="on-left" />
              </template>
            </q-btn>
          </div>

        </div> 

        <q-separator class="q-my-md" />

        <div class="row justify-end">
          <!-- <q-circular-progress indeterminate size="20px" :thickness="0.4" font-size="50px" color="lime" track-color="grey-3"
            center-color="grey-8" class="q-ma-md" /> -->
          <q-btn push color="primary" label="Load Details" v-bind:disabled="btn_load_disable"/> 
        </div>

        <div class="row">
          <q-card dark bordered class="bg-grey-9 details_card">
            <q-card-section>
              <div class="text-h6">Gamma Signup Details</div>
            </q-card-section>

            <q-separator dark inset />

            <q-card-section>
              <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                <div v-show="showGammaData">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vel magna eu risus laoreet tristique. Nulla ut fermentum elit, nec consequat augue. Morbi et dolor nec metus tincidunt pellentesque. Nullam non semper ante. Fusce pellentesque sagittis felis quis porta. Aenean condimentum neque sed erat suscipit malesuada. Nulla eget rhoncus enim. Duis dictum interdum eros.
                </div>
              </transition>
            </q-card-section>

            <q-inner-loading :showing="visible">
              <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>
          </q-card>
        </div>

        <q-separator class="q-my-md" />

        <div class="row justify-end">
          <q-btn push color="primary" label="Generate RSA Key" v-bind:disabled="btn_rsa_disable"/> 
        </div>
        
        <div class="row">
          <q-card dark bordered class="bg-grey-9 rsa_card">
            <q-card-section>
              <div class="text-h6">RSA Public Key</div>          
            </q-card-section>

            <q-separator dark inset />

            <q-card-section>
              {{ rsa_key }}
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
                      Email Address: mtadminbot@[user-domain].com<br/>
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

        <div class="row justify-end">
          <q-btn push color="primary" label="Finalize" v-bind:disabled="btn_finalize_disable"/> 
        </div>

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
  <q-dialog v-model="error.show" persistent>
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
  </q-dialog>

  </q-form>
</template>

<script>
export default {
  name: 'PageIndex',
  data() {
    return {
      model: null,
      ddl_tenant_options: [],
      showGammaData: true,
      rsa_key: "",
      visible: false,
      loading_tenants: false,
      btn_load_disable: true,
      btn_finalize_disable: true,
      btn_rsa_disable: true,
      error: {
        message: '',
        show: false
      }
    }
  },
  mounted() {    
    
    //this.load_tenant_data()
  },
  methods: {
    async load_tenant_data() {
      this.loading_tenants = true

      this.addLogItem(`Connecting to Gamma Onboarding backend at ${this.$store.getters.apiBaseUrl}...`)
      this.addLogItem('Loading recent completed tenant notifications...')
      let resp = await this.$store.dispatch('getTenantBuildNotifications')

      this.loading_tenants = false

      console.log(resp)

      if (!resp.success) {
        //this.error.show = true
        //this.error.message = 'Error loading data from Symphony: ' + resp.message
        this.addErrorItem('ERROR!!! Problem loading tenant data from Symphony. Talk to Kevin or Miguel')
      }
      else {
        
        Object.keys(this.$store.state.tenants).forEach(function(key, index) {          
          this.ddl_tenant_options.push(key)
        }.bind(this))
      }
    },
    load_gamma_details() {
      this.visible = true
      this.showGammaData = true
    },
    toggle_rsa_button(isDisabled) {
      this.btn_rsa_disable = isDisabled
    },
    toggle_finalize_button(isDisabled) {
      this.btn_finalize_disable = isDisabled
    },
    addLogItem(msg) {
      this.$store.dispatch('addLogItem', {message: msg, isError: false})
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
  height: 200px

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
