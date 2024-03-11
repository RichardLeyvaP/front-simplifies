
<template>
    <v-layout class="rounded rounded-md">   
       
      <AppBarView app></AppBarView>
      <NavigationDrawerView app class="pt-12"></NavigationDrawerView>
      <!-- Sizes your content based upon application components -->
      <v-main class="mt-6" style="min-height: 300px;">
        <router-view />
      </v-main>
    
      <v-footer app>
        <!-- -->
      </v-footer>
    </v-layout>
    </template>

<script>

import NavigationDrawerView from './NavigationDrawerView.vue'
import AppBarView from '@/layouts/default/AppBar.vue'


export default {
  components: {
    NavigationDrawerView,
    AppBarView,
    
  },

}
</script>