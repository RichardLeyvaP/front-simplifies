<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/return-in-computed-property -->
<template>
    <v-card elevation="4" class="mx-5">
      <v-toolbar color="#F18254">
        <v-container>
          <v-row align="center">
            <v-col cols="12" md="8" class="grow ml-4">
              <span class="text-subtitle-1"> <strong>Ganancias generadas por cursos</strong></span>
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
      <v-container class="mt-4">
        <v-container>
        <v-row>            
          <v-col cols="12" sm="12" md="3">
            <v-autocomplete v-model="enrollment_id" :items="enrollments" clearable label="Seleccione una academía"
              prepend-inner-icon-icon="mdi-school-outline" item-title="name" item-value="id" variant="outlined"
              @update:model-value="onEnrollmetChange"></v-autocomplete>
          </v-col>
        </v-row>
    </v-container>
        <v-row>
          <v-col cols="12">
            <v-container>
              <v-alert border type="info" variant="outlined" density="compact">
                              Ganancias generadas por cursos
                          </v-alert>
            </v-container>
            <v-card-text>
              <v-text-field class="mt-1 mb-1" v-model="search2" append-icon="mdi-magnify" label="Buscar" single-line
                hide-details></v-text-field>
              <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="results" :search="search2" class="elevation-2"  no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">
                                      <template v-slot:item.total_payment="{ item }">
                                          <v-chip
                                              class="text-uppercase font-weight-bold" size="small" label> {{
                              formatNumber(item.total_payment)}}</v-chip>
                                      </template>
                                      <template v-slot:item.price="{ item }">
                                          <v-chip
                                              class="text-uppercase font-weight-bold" size="small" label> {{
                              formatNumber(item.price)}}</v-chip>
                                      </template>
                                      <template v-slot:item.total="{ item }">
                                          <v-chip
                                              class="text-uppercase font-weight-bold" size="small" label> {{
                              formatNumber(item.total)}}</v-chip>
                                      </template>
              </v-data-table>
            </v-card-text>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </template>
  <script>
  
  import axios from "axios";
  import * as XLSX from 'xlsx';
  import LocalStorageService from "@/LocalStorageService";
  /*import { UserTokenStore } from "@/store/UserTokenStore";
  
  const userTokenStore = UserTokenStore();*/
  export default {
    props: {
      value: {
        type: String
      },
    },
    data: () => ({
      fecha: '',
      search2: '',
      editedIndex: -1,
      results: [],
      enrollment_id: '',
      enrollments: [],
      business_id: '',
      headers: [
        { title: 'Curso', key: 'curso', sortable: false },
        { title: 'Pago por matrículas', key: 'total_payment', sortable: false },
        { title: 'Venta de Productos', key: 'price', sortable: false },
        { title: 'Total', key: 'total', sortable: false },
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
      axios
      .get('http://127.0.0.1:8000/api/enrollment-show', {
          params: {
            business_id: this.business_id
          }
        })
      .then((response) => {
        this.enrollments = response.data.enrollments;
      });
      this.initialize();
    },
  
    methods: {
      formatNumber(value) {
              return value.toLocaleString('es-ES');
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
      
      initialize() {
        this.editedIndex = 1;
        axios
          .get('http://127.0.0.1:8000/api/calculate-course-earnings', {
            params: {
              business_id: this.business_id,
            }
          })
          .then((response) => {
            this.results = response.data;
          })
      },

      onEnrollmetChange() {
        this.editedIndex = 1;
        axios
          .get('http://127.0.0.1:8000/api/calculate-course-earnings-enrollment', {
            params: {
              enrollment_id: this.enrollment_id,
            }
          })
          .then((response) => {
            this.results = response.data;
          })
      },
  
    },
  }
  </script>