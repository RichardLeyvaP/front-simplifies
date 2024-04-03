<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-card elevation="6" class="mx-5">
    <v-toolbar color="#F18254">
      <v-row align="center">
        <v-col cols="12" md="4" class="grow ml-4">
          <span class="text-subtitle-1"> <strong>Ganancias de la Sucursal (Día, Período o Mes)</strong></span>
        </v-col>
        <v-col cols="12" md="4" class="mr-12"></v-col>
      </v-row>
    </v-toolbar>
    <v-container>
      <v-container>
        <v-row>
          <!-- Primera columna -->
          <v-col cols="12" sm="6" md="3">
            <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
              offset-y min-width="290px">
              <template v-slot:activator="{ props }">
                <v-text-field v-bind="props" :modelValue="dateFormatted" variant="outlined"
                  append-inner-icon="mdi-calendar" label="Fecha inicial"></v-text-field>
              </template>
              <v-locale-provider locale="es">
                <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2" :modelValue=input
                  @update:modelValue="updateDate" format="yyyy-MM-dd" scrollable></v-date-picker>
              </v-locale-provider>
            </v-menu>
          </v-col>
          <!-- Segunda columna -->
          <v-col cols="12" sm="6" md="3">
            <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
              offset-y min-width="290px">
              <template v-slot:activator="{ props }">
                <v-text-field v-bind="props" :modelValue="dateFormatted2" variant="outlined"
                  append-inner-icon="mdi-calendar" label="Fecha final"></v-text-field>
              </template>
              <v-locale-provider locale="es">
                <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2"
                  :modelValue="getDate2" @update:modelValue="updateDate2" format="yyyy-MM-dd" scrollable></v-date-picker>
              </v-locale-provider>
            </v-menu>
          </v-col>
          <!-- Tercera columna -->
          <v-col cols="12" sm="6" md="3">
            <v-menu v-model="menu3" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
              offset-y min-width="290px">
              <template v-slot:activator="{ props }">
                <v-text-field v-bind="props" :modelValue="dateFormatted3" variant="outlined"
                  append-inner-icon="mdi-calendar" label="Mes"></v-text-field>
              </template>
              <v-locale-provider locale="es">
                <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-1" locale="es-Es"
                  :modelValue="getDate3" @update:modelValue="updateDate3" format="yyyy-MM" scrollable></v-date-picker>
              </v-locale-provider>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="12" md="3">
            <v-autocomplete v-model="branch_id" :items="branches" clearable label="Seleccione una Sucursal"
              prepend-inner-icon="mdi-store" item-title="name" item-value="id" variant="outlined"
              @update:model-value="initialize()"></v-autocomplete>
          </v-col>
          <v-container>
            <v-alert border type="info" variant="outlined">
                            {{ formTitle }}
                        </v-alert>
          </v-container>
          <v-container>
            <v-row>
              <v-col cols="12" md="4" v-for="(item, key) in results" :key="key">
                <v-card class="mx-auto pa-4 pl-0" elevation="4">
                  <v-list-item :subtitle="key=='Monto Generado' || key=='Monto Servicios Especiales' ? formatNumber(item.value) : item.value" :title="key">
                    <template v-slot:prepend>
                      <v-avatar :color="item.color">
                        <v-icon color="white">{{ item.icon }}</v-icon>
                      </v-avatar>
                    </template>

                  </v-list-item>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-row>
      </v-container>
    </v-container>
  </v-card>
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
    branch_id: 1,
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
        this.fecha = format(this.input, "yyyy-MM-dd") + '-' + format(this.input2, "yyyy-MM-dd");
        return 'Ganancias de la Sucursal en el período ' + format(this.input, "yyyy-MM-dd") + '-' + format(this.input2, "yyyy-MM-dd");
      }
      else if (this.editedIndex === 3) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fecha = format(this.input3, "yyyy-MM");
        return 'Ganancias de la Sucursal en el mes ' + format(this.input3, "yyyy-MM");
      }
      else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fecha = format(new Date(), "yyyy-MM-dd");
        return 'Ganancias de la Sucursal en el día ' + format(new Date(), "yyyy-MM-dd");
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
    dateFormatted3() {
      const date = this.input3 ? new Date(this.input3) : new Date();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}`;
    },
    getDate() {
      return this.input ? new Date(this.input) : new Date();
    },
    getDate2() {
      return this.input2 ? new Date(this.input2) : new Date();
    },
    getDate3() {
      return this.input3 ? new Date(this.input3) : new Date();
    },
  },
  mounted() {
    this.business_id = LocalStorageService.getItem("business_id");
    this.branch_id = LocalStorageService.getItem("branch_id");
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
    updateDate2(val) {
      this.editedIndex = 2;
      this.input2 = val;
      const startDate = format(this.input, "yyyy-MM-dd");
      const endDate = format(val, "yyyy-MM-dd");
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
      this.menu2 = false;
    },
    updateDate3(val) {
      this.editedIndex = 3;
      this.input3 = val;
      const month = (val.getMonth() + 1).toString().padStart(2, '0');
      const year = val.getFullYear();
      const mes = `${month}`;
      const ano = `${year}`;
      axios
        .get('http://127.0.0.1:8000/api/branch_winner_icon', {
          params: {
            branch_id: this.branch_id,
            mes: mes,
            year: ano
          }
        })
        .then((response) => {
          this.results = response.data;
          //this.input3 = null;
        })
      this.menu3 = false;
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