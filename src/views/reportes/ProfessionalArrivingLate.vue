<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-card elevation="6" class="mx-5">
    <v-toolbar color="#F18254">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="8" class="grow ml-4">
            <span class="text-h8"> <strong>Llegadas tardes por profesional en un (Día, Mes o Período)</strong></span>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" md="3">
            <v-btn class="text-subtitle-1  ml-12" color="#E7E9E9" variant="flat" elevation="2"
              prepend-icon="mdi-file-excel" @click="exportToExcel">
              Exportar a Excel
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-toolbar>
    <v-container>
      <v-row>
        <!-- Primera columna -->
        <v-col cols="12" sm="6" md="2" v-if="state">
          <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
            offset-y min-width="290px">
            <template v-slot:activator="{ props }">
              <v-text-field v-bind="props" :modelValue="dateFormatted" variant="outlined"
                append-inner-icon="mdi-calendar" label="Fecha inicial"></v-text-field>
            </template>
            <v-locale-provider locale="es">
              <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2" :modelValue=input
                @update:model-value="updateDate" format="yyyy-MM-dd" :max="dateFormatted2"></v-date-picker>
            </v-locale-provider>
          </v-menu>
        </v-col>
        <!-- Segunda columna -->
        <v-col cols="12" sm="6" md="2" v-if="state">
          <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
            offset-y min-width="290px">
            <template v-slot:activator="{ props }">
              <v-text-field v-bind="props" :modelValue="dateFormatted2" variant="outlined"
                append-inner-icon="mdi-calendar" label="Fecha final"></v-text-field>
            </template>
            <v-locale-provider locale="es">
              <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2"
                :modelValue="getDate2" format="yyyy-MM-dd" @update:model-value="updateDate1"
                :min="dateFormatted"></v-date-picker><!-- @update:model-value="updateDate2"-->
            </v-locale-provider>
          </v-menu>
        </v-col>
        <!-- Tercera columna -->
        <!--<v-col cols="12" sm="6" md="2" v-if="state">-->
        <!--<v-date-picker
          v-model="selectedMonth"
          view-mode="months"
          label="Seleccione un mes"
          color="primary"
          scrollable
          no-stepper
        ></v-date-picker>-->
        <!--<v-menu v-model="menu3" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
              min-width="290px">
              <template v-slot:activator="{ props }">
                <v-text-field v-bind="props" :modelValue="dateFormatted3" variant="outlined"
                  append-inner-icon="mdi-calendar" label="Mes"></v-text-field>
              </template>
              <v-locale-provider locale="es">
                <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2" :modelValue="getDate3" @update:model-value="updateDate3"
                  format="yyyy-MM" scrollable></v-date-picker>
              </v-locale-provider>
            </v-menu>
        </v-col>-->

        <v-col cols="12" sm="12" md="3">
          <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="professional_id" :items="professionals"  label="Seleccione un Professional"
            prepend-inner-icon="mdi-account-tie-outline" item-title="name" item-value="id" variant="outlined"
            x></v-autocomplete><!--@update:model-value="initialize()"-->
        </v-col>
        <v-col cols="12" sm="12" md="3">
          <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches"  label="Seleccione una Sucursal"
            prepend-inner-icon="mdi-store" item-title="name" item-value="id"
            variant="outlined"></v-autocomplete><!--@update:model-value="initialize()"-->
        </v-col>
        <v-col cols="12" md="1">
          <v-btn icon @click="updateDate2" color="#F18254" :disabled="!professional_id">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-container>
            <v-alert border type="info" variant="outlined" density="compact">
              <p v-html="formTitle"></p>
                        </v-alert>
          </v-container>
          <v-card-text>
            <v-text-field class="mt-1 mb-1" v-model="search2" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details>
            </v-text-field>
            <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="results"
              :search="search2" class="elevation-2" no-results-text="No hay datos disponibles"
              no-data-text="No hay datos disponibles">
            </v-data-table>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>

import axios from "axios";
import { format } from "date-fns";
import * as XLSX from 'xlsx';
/*import { UserTokenStore } from "@/store/UserTokenStore";

const userTokenStore = UserTokenStore();*/
import LocalStorageService from "@/LocalStorageService";
export default {
  props: {
    value: {
      type: String
    },
  },
  data: () => ({
    fecha: '',
    menu: false,
    menu2: false,
    menu3: false,
    input: null,
    input2: null,
    input3: null,
    search2: '',
    charge: '',
    editedIndex: 1,
    branch_id: '',
    professional_id: '',
    state: false,
    results: [],
    branches: [],
    business_id: '',
    professionals: '',
    headers: [
      /*{ title: 'Profesional', key: 'name', sortable: false },
      { title: 'Monto', key: 'amount', sortable: false },*/
      { title: 'Hora de entrada', key: 'start_time', sortable: false },
      { title: 'Hora de salida', key: 'end_time', sortable: false }
    ],
    data: {},
  }),
  computed: {
    formTitle() {
      if (this.editedIndex === 2) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        //this.fecha = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd") + '-' + this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
        //return 'Llegadas tardes en el período ' + this.fecha;
        const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        //this.fecha = (this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")) + '-' + (this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
        return `Llegadas tardes en el período [<strong>${startDate}</strong> - <strong>${endDate}</strong>]`;		
	
      }
      /*else if (this.editedIndex === 3) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fecha = format(this.input3, "yyyy-MM");
        return 'Llegadas tardes en el mes ' + format(this.input3, "yyyy-MM");
      }*/
      else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fecha = format(new Date(), "yyyy-MM-dd");
        //return 'Legada tarde en el día ' + format(new Date(), "yyyy-MM-dd");
        return `Legada tarde en el día  <strong>${this.fecha}</strong>`;
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

  watch: {
    value: {
      handler(val) {
        this.input = val;
      },
      immediate: true,
    },
  },

  mounted() {
    this.branch_id = parseInt(LocalStorageService.getItem("branch_id"));
    this.business_id = parseInt(LocalStorageService.getItem("business_id"));
    this.charge = JSON.parse(LocalStorageService.getItem("charge"));
    axios
      .get('https://api2.simplifies.cl/api/show-business', {
        params: {
          business_id: this.business_id
        }
      })
      .then((response) => {
        this.branches = response.data.branches;
   
      }).finally(() => {
        if (this.charge === 'Administrador') {
          this.branch_id = this.branches[0].id;
        }
        this.initialize()
              });
  },

  methods: {

    exportToExcel() {
      // Primero, prepara una matriz que contendrá todas las filas de datos, incluidos los encabezados
      let rows = [];

      // Construye un objeto para los encabezados basado en la estructura de 'headers'
      let headerRow = {};
      this.headers.forEach(header => {
        headerRow[header.key] = header.title; // Usa 'key' para el mapeo y 'title' para el texto del encabezado
      });
      rows.push(headerRow);

      // Ahora, mapea los datos de los items para que coincidan con los encabezados
      this.results.forEach(item => {
        let rowData = {};
        this.headers.forEach(header => {
          rowData[header.key] = item[header.key] || ''; // Asegura que cada celda se mapee correctamente; usa '' para datos faltantes
        });
        rows.push(rowData);
      });

      let nameReport = {
        // eslint-disable-next-line vue/no-use-computed-property-like-method
        name: this.formTitle, // Asume que 'name' es una de tus claves; ajusta según sea necesario
        amount: '',
        tip: '', // Deja vacíos los demás campos para esta fila especial
        total: '' // Usa 'total' para mostrar la fecha; ajusta las claves según corresponda a tu estructura
      };
      rows.push(nameReport);

      // Convierte la matriz de filas en una hoja de trabajo Excel
      const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true }); // 'skipHeader: true' porque ya agregamos manualmente los encabezados

      // Crea un nuevo libro de trabajo y añade la hoja de trabajo con los datos
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report" + this.fecha);

      // Escribe el libro de trabajo a un archivo y desencadena la descarga
      //XLSX.writeFile(wb, "report.xlsx");
      XLSX.writeFile(wb, `report_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
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
      //this.input2 = val;
      this.editedIndex = 2;
      const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      console.log('');
      console.log(this.branch_id);
      console.log(this.professional_id);
      console.log(startDate);
      console.log(endDate);
      axios
        .get('https://api2.simplifies.cl/api/arriving-late-professional-periodo', {
          params: {
            branch_id: this.branch_id,
            professional_id: this.professional_id,
            startDate: startDate,
            endDate: endDate
          }
        })
        .then((response) => {
          this.results = response.data;
          //this.input2 = new Date();
          //this.input = new Date()
        })
      this.menu2 = false;
    },
    /*updateDate3(val) {
      this.editedIndex = 3;
      this.input3 = val;
      const month = (val.getMonth() + 1).toString().padStart(2, '0');
      const year = val.getFullYear();
      const mes = `${month}`;
      const ano = `${year}`;
      console.log('mes y año');
      console.log(mes);
      console.log(ano);
      axios
        .get('https://api2.simplifies.cl/api/arriving-late-professional-month', {
          params: {
            branch_id: this.branch_id,
            professional_id: this.professional_id,
            mes: mes,
            year: ano
          }
        })
        .then((response) => {
          this.results = response.data;
          console.log('this.results');
          console.log(this.results);
          //this.input3 = new Date();
        })
      this.menu3 = false;
    },*/
    initialize() {
      this.state = true;
      /*this.editedIndex = 1;
      
      this.input2 = new Date();
      this.input3 = new Date();
      axios
        .get('https://api2.simplifies.cl/api/arriving-late-professional-date', {
          params: {
            branch_id: this.branch_id,
            professional_id: this.professional_id
          }
        })
        .then((response) => {
          this.results = response.data;
        });*/
      axios
        .get('https://api2.simplifies.cl/api/professional-show-autocomplete')
        .then((response) => {
          this.professionals = response.data.professionals;
        });
    },

  },
}
</script>