<template>
    <q-layout view="hHh lpR fFf">
        <q-header elevated class="bg-primary text-white">
            <q-toolbar>
                <q-toolbar-title>
                    <q-avatar>
                        <img src='~assets/images/symlogo_128x128.png'>                        
                    </q-avatar>
                    Gamma Client Onboarding Tool
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1" >
            <q-list>
                <q-item-label header class="text-grey-8 text-h5">
                    Instructions
                </q-item-label>

                <q-item>
                    <q-item-section avatar>
                        <q-avatar color="accent" text-color="white">
                            1
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>
                        Click the "Get Tenants" button
                    </q-item-section>
                </q-item>

                <q-item>
                    <q-item-section avatar>
                        <q-avatar color="accent" text-color="white">
                            2
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>
                        Select the tenant from the dropdown
                    </q-item-section>
                </q-item>

                <q-item>
                    <q-item-section avatar>
                        <q-avatar color="accent" text-color="white">
                            3
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>
                        Click "Generate RSA Key"
                    </q-item-section>
                </q-item>

                <q-item>
                    <q-item-section avatar>
                        <q-avatar color="accent" text-color="white">
                            4
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>
                        Update tenant settings listed in "Intermission"
                    </q-item-section>
                </q-item>

                <q-item>
                    <q-item-section avatar>
                        <q-avatar color="accent" text-color="white">
                            5
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>
                        Click "Finalize"
                    </q-item-section>
                </q-item>

                <q-item>
                    <q-item-section avatar>
                        <q-avatar color="accent" text-color="white">
                            6
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>
                        Transfer Account and Opportunity to correct owner
                    </q-item-section>
                </q-item>

                <q-item>
                    <q-item-section avatar>
                        <q-avatar color="accent" text-color="white">
                            7
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>
                        Merge any duplicate accounts. Mark duplicate opp as "Qualified Out"
                    </q-item-section>
                </q-item>

            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
    
</template>

<script>
export default {
    data () {
        return {
            leftDrawerOpen: true,
        }
    }
}
</script>