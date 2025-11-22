<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/return-in-computed-property -->
<template>
  <v-card elevation="4" class="mx-5">
    <v-toolbar color="#F18254">
      <v-container fluid>
        <v-row align="center">
          <v-col cols="12" md="8" class="grow ml-4">
            <span class="text-subtitle-1"> <strong>Resumen de las Encuestas</strong></span>
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
    <v-container fluid>
      <!-- <v-container>
        <v-row>
          Primera columna 
          <v-col cols="12" sm="6" md="3">
            <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
              min-width="290px">
              <template v-slot:activator="{ props }">
                <v-text-field v-bind="props" :modelValue="dateFormatted" variant="outlined" append-inner-icon="mdi-calendar"
                  label="Fecha inicial"></v-text-field>
              </template>
<v-locale-provider locale="es">
  <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2" :modelValue=input
    @update:modelValue="updateDate" format="yyyy-MM-dd" :max="dateFormatted2"></v-date-picker>
</v-locale-provider>
</v-menu>
</v-col>-->
      <!-- Segunda columna 
          <v-col cols="12" sm="6" md="3">
            <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
              min-width="290px">
              <template v-slot:activator="{ props }">
                <v-text-field v-bind="props" :modelValue="dateFormatted2" variant="outlined"
                  append-inner-icon="mdi-calendar" label="Fecha final"></v-text-field>
              </template>
              <v-locale-provider locale="es">
                <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2" :modelValue="getDate2" @update:modelValue="updateDate1"
                  format="yyyy-MM-dd" :min="dateFormatted"></v-date-picker>
              </v-locale-provider>
            </v-menu>
          </v-col>
          <v-col cols="12" md="1">
                          <v-btn icon @click="updateDate2" color="#F18254" >
                      <v-icon>mdi-magnify</v-icon></v-btn>
                  </v-col>-->
      <!-- Tercera columna -->
      <!--<v-col cols="12" sm="6" md="4">
            <v-menu v-model="menu3" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
              min-width="290px">
              <template v-slot:activator="{ props }">
                <v-text-field v-bind="props" :modelValue="dateFormatted3" variant="outlined"
                  append-inner-icon="mdi-calendar" label="Mes"></v-text-field>
              </template>
              <v-locale-provider locale="es">
                <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2" :modelValue="getDate3" @update:modelValue="updateDate3"
                  format="yyyy-MM" scrollable no-title></v-date-picker>
              </v-locale-provider>
            </v-menu>
          </v-col>
        </v-row>
        </v-container>-->
      <v-row>
        <v-container fluid>
          <v-col cols="12" sm="12" md="4">
            <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches"
              v-if="this.mostrarFila" label="Seleccione una Sucursal" prepend-inner-icon="mdi-store" item-title="name"
              item-value="id" variant="outlined"
              @update:modelValue="initialize()"></v-autocomplete><!-- @update:modelValue="nameBranchSelect"-->
          </v-col>
        </v-container>

        <v-col cols="12" md="12">
          <v-container fluid>
            <v-alert border type="info" variant="outlined" density="compact">
              <p> Resumen de las Encuestas</p>
            </v-alert>
          </v-container>
          <v-card-text>
            <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details></v-text-field>
            <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="results"
              :search="search" class="elevation-2" no-results-text="No hay datos disponibles"
              no-data-text="No hay datos disponibles" :loading="loadingSurveyMost" loading-text="Cargando datos...">
            </v-data-table>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>

import * as XLSX from 'xlsx';
import LocalStorageService from "@/LocalStorageService";


export default {
  props: {
    value: {
      type: String
    },
  },
  data: () => ({
    loadingSurveyMost: true,
    branches: '',
    branch_id: '',
    charge: '',
    search: '',
    editedIndex: -1,
    results: [],
    business_id: '',
    mostrarFila: false,
    headers: [
      { title: 'Nombre Encuesta', key: 'name', sortable: false },
      { title: 'Cantidad', key: 'client_surveys_count', sortable: true }
    ],
    data: {},
  }),
  computed: {
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
    this.business_id = parseInt(LocalStorageService.getItem("business_id"));
    this.branch_id = parseInt(LocalStorageService.getItem('branch_id'));
    this.charge = JSON.parse(LocalStorageService.getItem("charge"));
    this.$axios.get('show-business', {
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
        client_surveys_count: '', // Deja vacíos los demás campos para esta fila especial
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
    initialize() {
      this.loadingSurveyMost = true;
      this.editedIndex = 1;
      this.$axios.get('surveyCounts', {
          params: {
            branch_id: this.branch_id
          }
        })
        .then((response) => {
          this.results = response.data;
        }).finally(()=>{
          this.loadingSurveyMost = false;
        })
    },

  },
}
</script>