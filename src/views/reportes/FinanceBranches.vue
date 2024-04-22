<!-- eslint-disable vue/no-use-computed-property-like-method -->
<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/return-in-computed-property -->
<template>
    <v-card elevation="6" class="mx-5">
        <v-toolbar color="#F18254">
            <v-row align="center">
                <v-col cols="12" md="8" class="grow ml-4">
                    <span class="text-subtitle-1"> <strong>Reporte de análisis de Ingresos y Gastos</strong></span>
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
                    <v-select v-model="selectedYear" :items="years" label="Selecciona un año" variant="underlined"
                        prepend-inner-icon="mdi-calendar"></v-select><!--@update:model-value="initialize()"-->
                </v-col>
                <v-col cols="12" md="3">
                    <v-text-field v-model="saldoInicial"  label="Saldo Anterior" prepend-icon="mdi-arrow-left"
                        variant="underlined" :style="{ color: saldoInicial < 0 ? '#FF7043' : '' }" disabled="true">
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="3">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches" v-if="this.mostrarFila" 
                        label="Seleccione una Sucursal" prepend-inner-icon="mdi-store" item-title="name" item-value="id"
                        variant="underlined"></v-autocomplete><!--@update:model-value="initialize()"-->
                </v-col>
                <v-col cols="12" md="1">
                    <v-btn icon @click="initialize" color="#F18254">
                        <v-icon>mdi-magnify</v-icon></v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="12">
                    <v-alert border type="info" variant="outlined" density="compact">
                        <p v-html="formTitle"></p>
                    </v-alert>
                </v-col>
            </v-row>
            <v-card elevation="4">
                <v-tabs v-model="tabBar" color="rgb(241, 130, 84)" elevation="6">
                    <v-tab value="one">Listado de Ingresos y Gastos</v-tab>
                    <v-tab value="two">Gráfico de Ingresos y Gastos</v-tab>
                </v-tabs>
                <v-divider></v-divider>
                <v-card-text>
                    <v-window v-model="tabBar">
                        <v-window-item value="one">
                            <v-card class="mx-auto  overflow-visible">
                                <v-card-text>
                                    <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'"
                                        :items-per-page="13" :items="results" :search="search2" class="elevation-2"
                                        no-results-text="No hay datos disponibles"
                                        no-data-text="No hay datos disponibles">
                                        <template v-slot:item.difference="{ item }">
                                            <td>
                                                <div class="d-flex justify-center">
                                                    <v-chip :color="item.difference > 0 ? 'green' : '#FF7043'"
                                                        class="text-uppercase font-weight-bold" size="small"
                                                        label>{{ formatNumber(item.difference) }}</v-chip>
                                                </div>
                                            </td>
                                        </template>
                                        <template v-slot:item.total_revenues="{ item }">
                                            <v-chip class="text-uppercase font-weight-bold" size="small" label>{{
                            formatNumber(item.total_revenues) }}</v-chip>
                                        </template>
                                        <template v-slot:item.total_expenses="{ item }">
                                            <v-chip class="text-uppercase font-weight-bold" size="small" label> {{
                            formatNumber(item.total_expenses) }}</v-chip>
                                        </template>
                                    </v-data-table>
                                </v-card-text>
                            </v-card>
                        </v-window-item>
                    </v-window>
                    <v-window v-model="tabBar">
                        <v-window-item value="two">
                            <v-card class="mx-auto  overflow-visible">
                                <Bar class="pa-6 elevation=2" id="my-chart-id" :options="chartOptions"
                                    :data="chartData3" padding="16" />

                                <v-card-text class="pt-0">

                                    <div class="subheading font-weight-light text-grey">
                                        Reporte de análisis de Ingresos y Gastos
                                    </div>
                                    <v-divider class="my-2"></v-divider>
                                    <v-icon class="me-2" size="small">
                                        mdi-clock
                                    </v-icon>
                                    <span class="text-caption text-grey font-weight-light">Actualizado
                                        Recientemente</span>
                                </v-card-text>
                            </v-card>
                        </v-window-item>
                    </v-window>
                </v-card-text>
            </v-card>
        </v-container>
    </v-card>
</template>
<script>

import axios from "axios";
import { Bar } from 'vue-chartjs';

import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement,)
import { format } from "date-fns";
import * as XLSX from 'xlsx';
import LocalStorageService from "@/LocalStorageService";
export default {
    name: 'LoginPage',
    components: { Bar },
    props: {
        value: {
            type: String
        },
    },
    data: () => ({
        tabBar: null,
        menu: false,
        menu2: false,
        menu3: false,
        input: null,
        input2: null,
        input3: null,
        selectedYear: null,
        years: [],
        branches: [],
        branch_id: '',
        saldoInicial: '',
        business_id: '',
        charge_id: '',
        charge: '',
        mostrarFila: false,
        fecha: '',
        search2: '',
        editedIndex: -1,
        results: [],
        headers: [
            { title: 'Mes', key: 'month', sortable: false },
            { title: 'Ingresos', key: 'total_revenues', sortable: false },
            { title: 'Gastos', key: 'total_expenses', sortable: false },
            { title: 'Diferencia', key: 'difference', sortable: false },
        ],
        tableData: [],
        data: {},
        chartOptions: {
            responsive: true
        },
    }),
    computed: {
        chartData3() {
            return this.generateChartData();
        },
        formTitle() {
            if (this.editedIndex === 2) {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                //this.fecha = format(this.input, "yyyy-MM-dd") + '-' + format(this.input2, "yyyy-MM-dd");
                //return 'Monto generado por Negocios en el período  ' + format(this.input, "yyyy-MM-dd") + '-' + format(this.input2, "yyyy-MM-dd");
                const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        //this.fecha = (this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")) + '-' + (this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
        return `Monto generado por Negocios en el período [<strong>${startDate}</strong> - <strong>${endDate}</strong>]`;		
            }
            /*else if (this.editedIndex === 3) {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.fecha = format(this.input3, "yyyy-MM");
                return 'Monto generado por Negocios en el mes ' + format(this.input3, "yyyy-MM");
            }*/
            else {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.fecha = format(new Date(), "yyyy-MM-dd");
                return `Reporte de análisis de Ingresos y Gastos  <strong>${this.selectedYear}</strong>`;
                //return 'Reporte de análisis de Ingresos y Gastos ' + this.selectedYear;
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
        console.log('this.charge')
        console.log(this.charge)
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
                //this.initialize()
            });
        if (this.charge === 'Administrador') {
            // Mostrar la fila con Autocomplete
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
    },

    methods: {
        formatNumber(value) {
            return value.toLocaleString('es-ES');
        },
        generateChartData() {
            const labels = this.results.map(item => item.month);
            const expensesData = this.results.map(item => parseFloat(item.total_expenses));
            const revenuesData = this.results.map(item => parseFloat(item.total_revenues));
            return {
                labels: labels,
                datasets: [
                    {
                        label: 'Total Gastos',
                        backgroundColor: "#FF7043",
                        data: expensesData
                    },
                    {
                        label: 'Total Ingresos',
                        backgroundColor: "#FFB300",
                        data: revenuesData
                    }
                ]
                /*labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
                datasets: [
                  {
                    label: 'Reservas',
                    backgroundColor: ["#FFB300", "#FF7043", "#00796B", "#B0BEC5", "#C0CA33", "#8D6E63", "#616161"],
                    data: this.reservationWeek
                  }
                ]*/
            };
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
                month: this.formTitle, // Asume que 'name' es una de tus claves; ajusta según sea necesario
                total_revenues: '',
                total_expenses: '',
                difference: '' // Usa 'total' para mostrar la fecha; ajusta las claves según corresponda a tu estructura
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
        /*updateDate(val) {
          this.input = val;
          this.menu = false;
        },
        updateDate2(val) {
          this.editedIndex = 2;
          this.input2 = val;
          const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
          const endDate = format(val, "yyyy-MM-dd");
          axios
            .get('http://127.0.0.1:8000/api/business-winner', {
              params: {
                startDate: startDate,
                endDate: endDate
              }
            })
            .then((response) => {
              this.results = response.data;
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
            .get('http://127.0.0.1:8000/api/business-winner', {
              params: {
                mes: mes,
                year: ano
              }
            })
            .then((response) => {
              this.results = response.data;
              this.input3 = new Date();
            })
          this.menu3 = false;
        },*/
        initialize() {
            this.editedIndex = 1;
            console.log('this.branch_id');
            console.log(this.branch_id);
            axios
                .get('http://127.0.0.1:8000/api/revenue-expense-analysis', {
                    params: {
                        branch_id: this.branch_id,
                        year: this.selectedYear
                    }
                })
                .then((response) => {
                    this.results = response.data.finances;
                    this.saldoInicial = response.data.last_year_difference;
                    console.log('this.results');
                    console.log(this.results);
                })
        },

    },
}
</script>