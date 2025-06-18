
<template>
    <v-layout class="rounded rounded-md" style="height: 100%; display: flex;  flex-direction: row;">
       
      <AppBarView app style="flex-shrink: 0;" @toggle-drawer="drawer = !drawer" 
      :drawer-visible="drawer"></AppBarView>
      <v-navigation-drawer class="pt-4" color="#2B3141" theme="dark"
      v-model="drawer"
      :permanent="$vuetify.display.mdAndUp"
      :temporary="!$vuetify.display.mdAndUp"
    >
      <!-- Contenido de tu menú -->
      <NavigationDrawerView />
    </v-navigation-drawer>

    <v-main class="mt-6">
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
  data() {
    return {
      drawer: null
    }
  },
  mounted() {
    this.drawer = this.$vuetify.display.mdAndUp
  },
  watch: {
    '$vuetify.display.mdAndUp'(newVal) {
      this.drawer = newVal
    }
  }
}
</script>