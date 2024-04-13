<template>
  <v-app>
    <v-main>
      <v-card elevation="6" class="mx-5">
        <v-toolbar color="#F18254">
          <v-row align="center">
            <v-col cols="12" md="4" class="grow ml-4">
              <span class="text-subtitle-1"> <strong>Ganancias del Professional por (Día, Período o Mes)</strong></span>
            </v-col>
            <v-col cols="12" md="4" class="mr-12">
            </v-col>
          </v-row>
        </v-toolbar>
        <v-container>
          <v-row>
            <!-- Primera columna -->
            <v-col cols="12" sm="6" md="4">
              <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                offset-y min-width="290px">
                <template v-slot:activator="{ props }">
                  <v-text-field v-bind="props" :modelValue="dateFormatted" variant="outlined"
                    append-inner-icon="mdi-calendar" label="Fecha inicial"></v-text-field>
                </template>
                <v-locale-provider locale="es">
                  <v-date-picker header="Calendario" title="Seleccione la fecha" color="primary" :modelValue=input @update:modelValue="updateDate"
                    format="yyyy-MM-dd"></v-date-picker>
                </v-locale-provider>
              </v-menu>
            </v-col>
            <!-- Segunda columna -->
            <v-col cols="12" sm="6" md="4">
              <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                offset-y min-width="290px">
                <template v-slot:activator="{ props }">
                  <v-text-field v-bind="props" :modelValue="dateFormatted2" variant="outlined"
                    append-inner-icon="mdi-calendar" label="Fecha final"></v-text-field>
                </template>
                <v-locale-provider locale="es">
                  <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2" :modelValue="getDate2" @update:modelValue="updateDate2"
                    format="yyyy-MM-dd" :min="dateFormatted"></v-date-picker>
                </v-locale-provider>
              </v-menu>
            </v-col>
            <!-- Tercera columna -->
            <v-col cols="12" sm="6" md="4">
              <v-menu v-model="menu3" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                offset-y min-width="290px">
                <template v-slot:activator="{ props }">
                  <v-text-field v-bind="props" :modelValue="dateFormatted3" variant="outlined"
                    append-inner-icon="mdi-calendar" label="Mes"></v-text-field>
                </template>
                <v-locale-provider locale="es">
                  <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2" :modelValue="getDate3" @update:modelValue="updateDate3"
                    format="yyyy-MM" scrollable></v-date-picker>
                </v-locale-provider>
              </v-menu>
            </v-col>
            
            <v-col cols="12">
              <span class="text-subtitle-12 ml-4">{{ formTitle }}</span>
              <v-card>
                <v-card-text>
                  <v-list>
                    <v-list-item-group>
                      <v-list-item v-for="(value, key) in results" :key="key">
                        <v-list-item-content>
                          <v-list-item-title>{{ key }}: {{ value }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-main>
  </v-app>
</template>
  
<script>
  import LocalStorageService from "@/LocalStorageService";
//import { UserTokenStore } from "@/store/UserTokenStore";

//const userTokenStore = UserTokenStore();
import axios from "axios";
import { format } from "date-fns";
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
  data() {
    return {
      menu: false,
      menu2: false,
      menu3: false,
      input: null,
      input2: null,
      input3: null,
      fecha: '',
      charge: '',
      editedIndex: '',
      branch_id: '',
      professional_id: '',
      results: [],
      professionals: [],
    };
  },
  computed: {
    formTitle() {
      if (this.editedIndex === 2) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fecha = format(this.input, "yyyy-MM-dd") + '-' + format(this.input2, "yyyy-MM-dd");
        return 'Monto generado por Profesional en el período ' + format(this.input, "yyyy-MM-dd") + '-' + format(this.input2, "yyyy-MM-dd");
      }
      else if (this.editedIndex === 3) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fecha = format(this.input3, "yyyy-MM");
        return 'Monto generado por Profesional en el mes ' + format(this.input3, "yyyy-MM");
      }
      else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fecha = format(new Date(), "yyyy-MM-dd");
        return 'Monto generado por Profesional en el día' + format(new Date(), "yyyy-MM-dd");
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
    // Recuperar datos del localStorage al cargar la aplicación
    this.branch_id = LocalStorageService.getItem('branch_id');
    this.professional_id = LocalStorageService.getItem('professional_id');
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
                if (this.charge === 'Administrador'){
          this.branch_id = this.branches[0].id;
        }
                this.initialize()
            });
  },
  methods: {
    updateDate(val) {
      this.input = val;
      this.menu = false;
    },
    updateDate2(val) {
      this.editedIndex = 2;
      this.input2 = val;
      const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      const endDate = format(val, "yyyy-MM-dd");
      axios
        .get('http://127.0.0.1:8000/api/professionals_ganancias_branch', {
          params: {
            branch_id: this.branch_id,
            professional_id: this.professional_id,
            startDate: startDate,
            endDate: endDate
          }
        })
        .then((response) => {
          this.results = response.data.earningPeriodo;
          this.input2 = new Date();
          this.input = new Date()
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
        .get('http://127.0.0.1:8000/api/professionals_ganancias_branch', {
          params: {
            branch_id: this.branch_id,
            professional_id: this.professional_id,
            mes: mes,
            year: ano
          }
        })
        .then((response) => {
          this.results = response.data.earningPeriodo;
          this.input3 = new Date();
        })
      this.menu3 = false;
    },
    initialize() {
      this.editedIndex = 1;
      axios
        .get('http://127.0.0.1:8000/api/professionals_ganancias_branch', {
          params: {
            branch_id: this.branch_id,
            professional_id: this.professional_id
          }
        })
        .then((response) => {
          this.results = response.data.earningPeriodo;
        });
      axios
        .get('http://127.0.0.1:8000/api/professional-show-autocomplete')
        .then((response) => {
          this.professionals = response.data.professionals;
        });
    },
  },
};
</script>
  