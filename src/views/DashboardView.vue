<template>
  <v-layout
    class="rounded rounded-md"
    style="height: 100%; display: flex; flex-direction: row"
  >
    <AppBarView
      app
      style="flex-shrink: 0"
      @toggle-drawer="drawer = !drawer"
      :drawer-visible="drawer"
    ></AppBarView>
    <v-navigation-drawer
      v-if="mobile"
      v-model="drawer"
      :permanent="$vuetify.display.mdAndUp"
      :temporary="!$vuetify.display.mdAndUp"
      class="pt-4"
      color="#2B3141"
      theme="dark"
    >
      <!-- Contenido de tu menú -->
      <NavigationDrawerView v-if="mobile" />
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
import NavigationDrawerView from "./NavigationDrawerView.vue";
import AppBarView from "@/layouts/default/AppBar.vue";
import LocalStorageService from "@/LocalStorageService";

export default {
  components: {
    NavigationDrawerView,
    AppBarView,
  },
  data() {
    return {
      drawer: null,
      mobile: 0,
    };
  },
  mounted() {
    this.mobile = Number(LocalStorageService.getItem("mobile"));
    this.drawer = this.$vuetify.display.mdAndUp;
  },
  watch: {
    "$vuetify.display.mdAndUp"(newVal) {
      this.drawer = newVal;
    },
  },
};
</script>
