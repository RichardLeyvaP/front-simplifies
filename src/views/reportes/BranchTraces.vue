<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/return-in-computed-property -->
<template>
  <v-card elevation="6" class="mx-5">
    <v-toolbar color="#F18254">
      <v-row align="center">
        <v-col cols="12" md="8" class="grow ml-4">
          <span class="text-subtitle-1"> <strong>Operaciones realizadas en la caja</strong></span>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" md="3">
          <v-btn class="text-subtitle-1  ml-12" color="#E7E9E9" variant="flat" elevation="2"
            prepend-icon="mdi-file-excel" @click="exportToExcel">
            Exportar a Excel
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-container>
      <v-row>
        <!-- Primera columna -->
        <v-col cols="12" sm="6" md="3">
          <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
            offset-y min-width="290px" multiple>
            <template v-slot:activator="{ props }">
              <v-text-field v-bind="props" :modelValue="dateFormatted" variant="outlined"
                append-inner-icon="mdi-calendar" label="Fecha inicial" multiple></v-text-field>
            </template>
            <v-locale-provider locale="es">
              <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2" :modelValue=input
                @update:modelValue="updateDate" format="yyyy-MM-dd" :max="dateFormatted2"></v-date-picker>
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
                :modelValue="getDate2" @update:modelValue="updateDate1" format="yyyy-MM-dd"
                :min="dateFormatted"></v-date-picker>
            </v-locale-provider>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches"
            v-if="this.mostrarFila" label="Seleccione una Sucursal" prepend-inner-icon="mdi-store" item-title="name"
            item-value="id" variant="outlined" @update:modelValue="nameBranchSelect"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="1">
          <v-btn icon @click="updateDate2" color="#F18254">
            <v-icon>mdi-magnify</v-icon></v-btn>
        </v-col>

      </v-row>
      <v-row>
        <v-col cols="12" md="12">
          <v-container>
            <v-alert border type="info" variant="outlined" density="compact">
              <p v-html="formTitle"></p>
            </v-alert>
          </v-container>
        </v-col>
      </v-row>
      <v-card-text>
        <v-text-field v-model="search2" append-icon="mdi-magnify" label="Buscar" single-line
          hide-details></v-text-field>

        <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="results"
          :search="search2" class="elevation-2" no-results-text="No hay datos disponibles"
          no-data-text="No hay datos disponibles">
          <template v-slot:item.amount="{ item }">
            {{ formatNumber(parseInt(item.amount)) }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-container>
  </v-card>
</template>
<script>

import axios from "axios";
import LocalStorageService from "@/LocalStorageService";
import { format } from "date-fns";
import * as XLSX from 'xlsx';
export default {
  props: {
    value: {
      type: String
    },
  },
  data: () => ({
    menu: false,
    menu2: false,
    menu3: false,
    input: '',
    input2: null,
    input3: null,
    mostrarFila: false,
    years: [],
    branches: '',
    branch_id: '',
    nameBranch: '',
    branchName: '',
    fecha: '',
    search2: '',
    editedIndex: -1,
    results: [],
    headers: [
      { title: 'Cajera(o)', key: 'cashier', sortable: false },
      { title: 'Cliente', key: 'client', sortable: false },
      { title: 'Profesional', key: 'description', sortable: false },
      { title: 'Fecha', key: 'data', sortable: false },
      { title: 'Operación', key: 'operation', sortable: false },
      { title: 'Detalles', key: 'details', sortable: false },
      { title: 'Monto', key: 'amount', sortable: false }
    ],
    data: {},
  }),
  computed: {
    formTitle() {
      if (this.editedIndex === 2) {
        const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
        const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        //this.fecha = (this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")) + '-' + (this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
        return `Operaciones realizadas en la caja en el período [<strong>${startDate}</strong> - <strong>${endDate}</strong>] ` + this.branchName;
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        //this.fecha = (this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")) + '-' + (this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
        //return 'Operaciones realizadas en la caja en el período  ' + this.fecha;
      }
      /*else if (this.editedIndex === 3){
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fecha = format(this.input3, "yyyy-MM");
        return 'Operaciones realizadas en la caja en el mes ' + this.fecha;
      }*/
      else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fecha = format(new Date(), "yyyy-MM-dd");
        return `Operaciones realizadas en la caja en el día  <strong>${this.fecha}</strong> ` + this.branchName;
        //return 'Operaciones realizadas en la caja en el día ' + this.fecha;
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
    this.business_id = parseInt(LocalStorageService.getItem('business_id'));
    this.charge_id = parseInt(LocalStorageService.getItem('charge_id'));
    this.branch_id = parseInt(LocalStorageService.getItem('branch_id'));
    this.nameBranch = JSON.parse(LocalStorageService.getItem("nameBranch"));
    this.nameProfessional = JSON.parse(LocalStorageService.getItem("name"));
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
          this.branchName = this.branches[0].name;
          this.mostrarFila = true;
        }
        this.initialize();
      });
  },

  methods: {
    nameBranchSelect() {
      let exist = this.branches.filter(item => item.id == this.branch_id);
      this.branchName = exist[0].name;

      console.log(this.branchName);
    },
    formatNumber(value) {
      // Si el valor es menor que 1000, devuelve el valor original con dos decimales
      if (value < 1000) {
        return (Math.round((value + Number.EPSILON) * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      // Primero, redondea el valor a dos decimales
      value = Math.round((value + Number.EPSILON) * 100) / 100;

      // Convierte el valor a cadena con formato de número local (en-US)
      let formattedValue = value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      return formattedValue;
    },
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
        tip: '', // Deja vacíos los demás campos para esta fila especial
        earnings: '',
        technical_assistance: '',
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
      this.editedIndex = 2;
      //this.input2 = val;
      const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      console.log('endDate');
      console.log(startDate);
      axios
        .get('https://api2.simplifies.cl/api/traces-branch-periodo', {
          params: {
            branch_id: this.branch_id,
            startDate: startDate,
            endDate: endDate
          }
        })
        .then((response) => {
          this.results = response.data.traces;
        })
    },
    /*updateDate3(val) {
      this.editedIndex = 3;
      this.input3 = val;
      const month = (val.getMonth() + 1).toString().padStart(2, '0');
      const year = val.getFullYear();
      const mes = `${month}`;
      const ano = `${year}`;
      axios
        .get('https://api2.simplifies.cl/api/traces-branch-month', {
          params: {
              branch_id: this.branch_id,
              month: mes,
            year: ano
          }
        })
        .then((response) => {
          this.results = response.data.traces;
        })
      this.menu3 = false;
    },*/
    initialize() {
      this.editedIndex = 1;
      console.log('this.nameBranch');
      console.log(this.input);
      axios
        .get('https://api2.simplifies.cl/api/traces-branch-day', {
          params: {
            branch_id: this.branch_id,
            day: format(new Date(), "yyyy-MM-dd")
          }
        })
        .then((response) => {
          this.results = response.data.traces;
        })
    }
  },
}
</script>