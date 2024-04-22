<!-- eslint-disable no-mixed-spaces-and-tabs -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
  <v-card elevation="6" class="mx-5">
    <v-toolbar color="#F18254">
      <v-row align="center">
        <v-col cols="12" md="4" class="grow ml-4">
          <span class="text-subtitle-1"> <strong>Ganancias de la Sucursal (Día, Período)</strong></span>
        </v-col>
        <v-col cols="12" md="4" class="mr-12"></v-col>
      </v-row>
    </v-toolbar>
      <v-container>
    <v-row>
           <!-- Primera columna -->
           <v-col cols="12" md="3">
            <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
              offset-y min-width="290px">
              <template v-slot:activator="{ props }">
                <v-text-field v-bind="props" :modelValue="dateFormatted" variant="outlined"
                  append-inner-icon="mdi-calendar" label="Fecha inicial"></v-text-field>
              </template>
              <v-locale-provider locale="es">
                <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2" :modelValue=input
                  @update:modelValue="updateDate" format="yyyy-MM-dd" scrollable :max="dateFormatted2"></v-date-picker>
              </v-locale-provider>
            </v-menu>
          </v-col>
          <!-- Segunda columna -->
          <v-col cols="12" md="3">
            <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
              offset-y min-width="290px">
              <template v-slot:activator="{ props }">
                <v-text-field v-bind="props" :modelValue="dateFormatted2" variant="outlined"
                  append-inner-icon="mdi-calendar" label="Fecha final"></v-text-field>
              </template>
              <v-locale-provider locale="es">
                <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2"
                  :modelValue="getDate2" @update:modelValue="updateDate1" format="yyyy-MM-dd" scrollable :min="dateFormatted"></v-date-picker>
              </v-locale-provider>
            </v-menu>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete v-model="branch_id" :items="branches"  label="Seleccione una Sucursal"
              prepend-inner-icon="mdi-store" item-title="name" item-value="id" variant="outlined"
              ></v-autocomplete><!--@update:model-value="initialize()"-->
          </v-col>  
          <v-col cols="12" md="1">
                        <v-btn icon @click="updateDate2" color="#F18254" >
                    <v-icon>mdi-magnify</v-icon></v-btn>
                </v-col>  
    </v-row>
    <v-row>
      <v-container>
      <v-alert border type="info" variant="outlined" density="compact">
              <p v-html="formTitle"></p>
                        </v-alert>
                      </v-container>
    </v-row> 
    <v-row>
              <v-col cols="12" md="4" v-for="(item, key) in results" :key="key">
                    <v-card class="mx-auto pa-4 ml-0" :subtitle="key=='Monto Generado' || key=='Monto Servicios Especiales' ? formatNumber(item.value) : item.value" :title="key">                  
                    <template v-slot:prepend>
                      <v-avatar :color="item.color">
                        <v-icon color="white">{{ item.icon }}</v-icon>
                      </v-avatar>
                    </template>                
                </v-card>
              </v-col>
            </v-row>
      </v-container>
  </v-card>
</v-container>
</template>
<script>

import axios from "axios";
import { format } from "date-fns";
import LocalStorageService from "@/LocalStorageService";
/*import { UserTokenStore } from "@/store/UserTokenStore";

const userTokenStore = UserTokenStore();*/
export default {
  props: {
    value: {
      type: String
    },
  },
  watch: {
    value: {
      handler(val) {
        this.input = val;
      },
      immediate: true,
    },
  },

  data: () => ({
    menu: false,
    menu2: false,
    menu3: false,
    input: null,
    input2: null,
    input3: null,
    charge: '',
    fecha: '',
    editedIndex: 1,
    branch_id: '',
    business_id: '',
    results: [],
    branches: [],
    editedItem: {
      name: '',
      id: ''
    },
    data: {},

    defaultItem: {
      name: '',
    },
  }),
  computed: {
    formTitle() {
      if (this.editedIndex === 2) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        //this.fecha = (this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")) + '-' + (this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
        //return 'Ganancias de la Sucursal en el período ' + this.fecha;
        const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        //this.fecha = (this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")) + '-' + (this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
        return `Ganancias de la Sucursal en el período [<strong>${startDate}</strong> - <strong>${endDate}</strong>]`;
		
      }
      /*else if (this.editedIndex === 3) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        //this.fecha = format(this.input3, "yyyy-MM");
        return 'Ganancias de la Sucursal en el mes ' + this.selectedYear+'-'+this.selectedMounth;
      }*/
      else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fecha = format(new Date(), "yyyy-MM-dd");
        return `Ganancias de la Sucursal en el día  <strong>${this.fecha}</strong>`;
        //return 'Ganancias de la Sucursal en el día ' + format(new Date(), "yyyy-MM-dd");
      }
    },
    dateFormatted() {
      const date = this.input ? new Date(this.input) : new Date();
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    dateFormatted2() {
      const date = this.input2 ? new Date(this.input2) : new Date();
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    /*dateFormatted3() {
      const date = this.input3 ? new Date(this.input3) : new Date();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}`;
    },*/
    getDate() {
      return this.input ? new Date(this.input) : new Date();
    },
    getDate2() {
      return this.input2 ? new Date(this.input2) : new Date();
    },
    /*getDate3() {
      return this.input3 ? new Date(this.input3) : new Date();
    },*/
  },
  mounted() {
    this.business_id = parseInt(LocalStorageService.getItem("business_id"));
    this.branch_id = parseInt(LocalStorageService.getItem("branch_id"));
    this.charge = JSON.parse(LocalStorageService.getItem("charge"));
    axios
      .get('http://127.0.0.1:8000/api/show-business', {
        params: {
          business_id: this.business_id
        }
      })
      .then((response) => {
        this.branches = response.data.branches;
        //this.branch_id = !this.branch_id ? this.branch_id : this.branches[0].id;
        if (this.charge === 'Administrador') {
          this.branch_id = this.branches[0].id;
        }
        this.initialize();
      });

    console.log(this.business_id);
  },

  methods: {
    formatNumber(value) {
            return value.toLocaleString('es-ES');
        },
    updateDate(val) {
      this.input = val;
      this.menu = false;
    },
    updateDate1(val) {
      this.input2 = val;
      this.menu2 = false;
    },
    updateDate2() {
      this.editedIndex = 2;
      //this.input2 = val;
      this.input = this.input ? new Date(this.input) : new Date();
      const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      axios
        .get('http://127.0.0.1:8000/api/branch_winner_icon', {
          params: {
            branch_id: this.branch_id,
            startDate: startDate,
            endDate: endDate
          }
        })
        .then((response) => {
          this.results = response.data;
          //this.input2 = null;
          //this.input = null
        })
      //this.menu2 = false;
    },
    initialize() {
      this.editedIndex = 1;
      axios
        .get('http://127.0.0.1:8000/api/branch_winner_icon', {
          params: {
            branch_id: this.branch_id
          }
        })
        .then((response) => {
          this.results = response.data;
          console.log(this.results);
        });

    },

  },
}
</script>
<style>
.title-size {
  font-size: 1em; /* Cambia este valor según el tamaño deseado */
}
.subtitle-size {
  font-size: 0.9em; /* Cambia este valor según el tamaño deseado */
}
</style>