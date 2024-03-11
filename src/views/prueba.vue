<template>
  <br><br>
  <div class="text-center">
    <v-row>
      <v-col cols="12" md="3">
        <v-menu
  v-model="menu"
  :close-on-content-click="false"
  transition="scale-transition"
>
  <template v-slot:activator="{ on }">
    <v-text-field
      color="indigo"
      v-bind="on"
      v-model="formattedDate"
      append-inner-icon="mdi-calendar"
      @click="menu = !menu"
    ></v-text-field>
  </template>

  <v-card min-width="auto">
    <v-locale-provider locale="es">
      <v-date-picker v-model="date" color="orange lighten-2" format="yyyy-MM-dd"></v-date-picker>
    </v-locale-provider>

    <v-card-actions>
      <v-btn variant="text" @click="menu = false">Cancel</v-btn>
      <v-btn color="primary" variant="text" @click="menu = false">OK</v-btn>
    </v-card-actions>
  </v-card>
</v-menu>
      </v-col>
    </v-row>
   
  </div>
</template>

<script>

import { format } from 'date-fns';
  export default {
    data: () => ({
      fecha: "2024-03-04",
      fav: true,
      menu: false,
      message: false,
      hints: true,
      date: new Date(),  
  }),
  computed: {
    formattedDate() {
      return format(this.date, 'yyyy-MM-dd');
    },
  },
  }
</script>