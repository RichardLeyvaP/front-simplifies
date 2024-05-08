<!-- eslint-disable vue/no-use-computed-property-like-method -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-card elevation="6" class="mx-5">
        <v-toolbar color="#F18254">
            <v-row align="center">
                <v-col cols="12" md="8" class="grow ml-4">
                    <span class="text-subtitle-1"> <strong>Reporte de Ingresos y Gastos detallados</strong></span>
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
                <v-col cols="12" md="3">
                    <v-select v-model="selectedYear" :items="years" label="Selecciona un año" variant="outlined"
                    prepend-inner-icon="mdi-calendar" @update:model-value="initialize()"></v-select><!--@update:model-value="initialize()"-->
                </v-col>
                <v-col cols="12" md="3">
                    <v-select v-model="selectedMounth" :items="months" label="Selecciona un mes" variant="outlined"
                    prepend-inner-icon="mdi-calendar"></v-select><!--@update:model-value="operationDetails()"-->
                </v-col>
                <v-col cols="12" md="3">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches" v-if="this.mostrarFila" 
                        label="Seleccione una Sucursal" prepend-inner-icon="mdi-store" item-title="name" item-value="id"
                        variant="outlined"></v-autocomplete><!--@update:model-value="initialize()"-->
                </v-col>
                <v-col cols="12" md="1">
                        <v-btn icon @click="operationDetails()" color="#F18254">
                    <v-icon>mdi-magnify</v-icon></v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="12">
                        <v-alert border type="info" variant="outlined" density="compact">
                            <p v-html="formTitle"></p>
                        </v-alert>
                </v-col>
                <v-col cols="12" md="12">
                        <v-row>
                            <v-col cols="12" md="8"></v-col>
                            <v-col cols="12" md="2">
                                <v-card class="pa-2 pl-0 mb-2" elevation="2">
                                    <v-list-item :subtitle=" formatNumber(totalIngresos)" title="Ingresos">
                                        <template v-slot:prepend>
                                            <v-avatar color="green">
                                                <v-icon color="white">{{'mdi-plus-circle'}}</v-icon>
                                            </v-avatar>
                                        </template>

                                    </v-list-item>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-card class="pa-2 pl-0 mb-2" elevation="2">
                                    <v-list-item :subtitle="formatNumber(totalGastos)" title="Gastos">
                                        <template v-slot:prepend>
                                            <v-avatar color="red">
                                                <v-icon color="white">{{'mdi-minus-circle'}}</v-icon>
                                            </v-avatar>
                                        </template>

                                    </v-list-item>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-container>
                            <v-card class="mx-auto  overflow-visible">
                            <v-card-text>
                                <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify"
                                    label="Buscar" single-line hide-details>
                                </v-text-field>
                                <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'"
                                    :items="results" :search="search" no-results-text="No hay datos disponibles"
                                    no-data-text="No hay datos disponibles">
                                    <template v-slot:item.ingreso="{ item }">
                                        <v-chip v-if="item.ingreso > 0" :color="'green'"
                                            class="text-uppercase font-weight-bold" size="small" label>{{
                            formatNumber(item.ingreso) }}</v-chip>
                                    </template>
                                    <template v-slot:item.gasto="{ item }">
                                        <v-chip v-if="item.gasto > 0" :color="'red'"
                                            class="text-uppercase font-weight-bold" size="small" label> {{
                            formatNumber(item.gasto)}}</v-chip>
                                    </template>
                                </v-data-table>
                            </v-card-text>
                        </v-card>
                        </v-container>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>
<script>

import axios from "axios";
import { format } from "date-fns";
import * as XLSX from 'xlsx';
import LocalStorageService from "@/LocalStorageService";
export default {
    //name: 'LoginPage',
    //components: { Bar},
    props: {
        value: {
            type: String
        },
    },
    data: () => ({
        menu: false,
        menu2: false,
        menu3: false,
        input: null,
        input2: null,
        input3: null,
        selectedYear: null,
        selectedMounth: '',
        years: [],
        branch_id: '',
        business_id: '',
        charge_id: '',
        charge: '',
        branches: [],
        totalIngresos: 0,
        totalGastos: 0,
        mostrarFila: false,
        fecha: '',
        search: '',
        editedIndex: -1,
        results: [],
        months: [
            { value: '', title: '' },
            { value: 1, title: 'Enero' },
            { value: 2, title: 'Febrero' },
            { value: 3, title: 'Marzo' },
            { value: 4, title: 'Abril' },
            { value: 5, title: 'Mayo' },
            { value: 6, title: 'Junio' },
            { value: 7, title: 'Julio' },
            { value: 8, title: 'Agosto' },
            { value: 9, title: 'Septiembre' },
            { value: 10, title: 'Octubre' },
            { value: 11, title: 'Noviembre' },
            { value: 12, title: 'Diciembre' }
        ],
        headers: [
            { title: 'Tipo de operación', key: 'operation', sortable: false },
            { title: 'Fecha Registro', key: 'data', sortable: false },
            { title: 'Detalle de operación', key: 'detailOperation', sortable: false },
            { title: 'Ingreso', key: 'ingreso', sortable: false },
            { title: 'Gasto', key: 'gasto', sortable: false },
        ],
        tableData: [],
        data: {},
        /*chartOptions: {
            responsive: true
        },*/
    }),
    computed: {
        /*chartData3() {
            return this.generateChartData();
        },*/
        formTitle() {
            if (this.selectedMounth) {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                //return 'Reporte de Ingresos y Gastos detallados en el mes ' + this.selectedMounth + '-' + this.selectedYear;
                //const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      //const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        //this.fecha = (this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")) + '-' + (this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
        return `Reporte de Ingresos y Gastos detallados en el mes [<strong>${this.selectedYear}</strong> - <strong>${this.selectedMounth}</strong>]`;		
            }
            /*else if (this.editedIndex === 3) {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.fecha = format(this.input3, "yyyy-MM");
                return 'Monto generado por Negocios en el mes ' + format(this.input3, "yyyy-MM");
            }*/
            else {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.fecha = format(new Date(), "yyyy-MM-dd");
                //return 'Reporte de Ingresos y Gastos detallados en el año ' + this.selectedYear;
                return `Reporte de Ingresos y Gastos detallados en el año  <strong>${this.selectedYear}</strong>`;
            }
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

    mounted() {
        this.branch_id = parseInt(LocalStorageService.getItem("branch_id"));
        this.business_id = parseInt(LocalStorageService.getItem("business_id"));
        this.charge_id = parseInt(LocalStorageService.getItem('charge_id'));
        this.charge = JSON.parse(LocalStorageService.getItem("charge"));
        
        axios
      .get('http://127.0.0.1:8000/api/show-business', {
        params: {
          business_id: this.business_id
        }
      })
      .then((response) => {
        this.branches = response.data.branches;

      }).finally(() => {
        if (this.charge === 'Administrador') {
          this.branch_id = this.branches[0].id;
            this.mostrarFila = true;
        } 
    // Obtener el año actual
    const currentYear = new Date().getFullYear();
        // Llenar el arreglo years con los años, desde 2010 hasta el año actual
        for (let year = 2000; year <= currentYear; year++) {
            this.years.push(year);
        }
        // Establecer el año actual como el seleccionado por defecto
        this.selectedYear = currentYear;
        this.initialize();
          });
    },

    methods: {
        formatNumber(value) {
            return value.toLocaleString('es-ES');
        },
        exportToExcel() {
            // Primero, prepara una matriz que contendrá todas las filas de datos, incluidos los encabezados
            let rows = [];
            let titleRow = {};
            titleRow[this.headers[0].key] = this.formTitle; // Utiliza la primera clave de encabezado para el título
            rows.push(titleRow);
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
            console.log('this.branch_id')
        console.log(this.branch_id)
            axios
                .get('http://127.0.0.1:8000/api/revenue-expense-details', {
                    params: {
                        branch_id: this.branch_id,
                        year: this.selectedYear,
                        mounth: this.selectedMounth
                    }
                })
                .then((response) => {
                    this.results = response.data.finances;
                    this.totalIngresos = response.data.totalIngresos;
                    this.totalGastos = response.data.totalGastos;
                    //this.saldoInicial = response.data.last_year_difference;
                    console.log('this.results');
                    console.log(this.results);
                })
        },
        operationDetails() {
            this.editedIndex = 2;
            axios
                .get('http://127.0.0.1:8000/api/revenue-expense-details', {
                    params: {
                        branch_id: this.branch_id,
                        year: this.selectedYear,
                        mounth: this.selectedMounth
                    }
                })
                .then((response) => {
                    this.results = response.data.finances;
                    this.totalIngresos = response.data.totalIngresos;
                    this.totalGastos = response.data.totalGastos;
                    //this.saldoInicial = response.data.last_year_difference;
                    console.log('this.results');
                    console.log(this.results);
                })
        },

    },
}
</script>