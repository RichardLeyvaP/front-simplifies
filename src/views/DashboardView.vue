
<template>
    <v-layout class="rounded rounded-md" style="height: 100vh; display: flex;  flex-direction: row;">   
       
      <AppBarView app style="flex-shrink: 0;"></AppBarView>
      <NavigationDrawerView app class="pt-12" style="flex-shrink: 0;"></NavigationDrawerView>
      <!-- Sizes your content based upon application components -->
      <v-main class="mt-6" style="flex-grow: 1; overflow-y: auto;">
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