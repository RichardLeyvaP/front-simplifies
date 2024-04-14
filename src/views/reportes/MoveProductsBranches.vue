<!-- eslint-disable vue/no-use-computed-property-like-method -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-card elevation="6" class="mx-5">
        <v-toolbar color="#F18254">
            <v-row align="center">
                <v-col cols="12" md="8" class="grow ml-4">
                    <span class="text-subtitle-1"> <strong>Reporte de Movimiento de Productos</strong></span>
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
                <v-col cols="12" md="4">
                    <v-select v-model="selectedYear" :items="years" label="Selecciona un año" variant="outlined"
                        prepend-inner-icon="mdi-calendar" @update:model-value="initialize()"></v-select>
                </v-col>
                <v-col cols="12" md="4">
                    <v-select v-model="selectedMounth" :items="months" label="Selecciona un mes" variant="outlined"
                        prepend-inner-icon="mdi-calendar" @update:model-value="moveProductsMounth()"></v-select>
                </v-col>
                <!--<v-col cols="12" sm="12" md="4">
                    <v-autocomplete v-model="branch_id" :items="branches" v-if="this.mostrarFila" clearable
                        label="Seleccione una Sucursal" prepend-inner-icon="mdi-store" item-title="name" item-value="id"
                        variant="outlined" @update:model-value="initialize()"></v-autocomplete>
                </v-col>-->
            </v-row>
            <v-row>
                <v-col cols="12" md="12">
                        <v-alert border type="info" variant="outlined" density="compact">
                            <span>{{ formTitle }}</span>
                        </v-alert>
                </v-col>
                <v-col cols="12" md="12">
                    <v-card class="mx-auto  overflow-visible">
                        <v-card-text>
                            <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar"
                                single-line hide-details>
                            </v-text-field>
                            <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="results"
                                :search="search" no-results-text="No hay datos disponibles"
                                no-data-text="No hay datos disponibles">

                            </v-data-table>
                        </v-card-text>
                    </v-card>
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
        months: [
            { value: '', title: '' },
            { value: '01', title: 'Enero' },
            { value: '02', title: 'Febrero' },
            { value: '03', title: 'Marzo' },
            { value: '04', title: 'Abril' },
            { value: '05', title: 'Mayo' },
            { value: '06', title: 'Junio' },
            { value: '07', title: 'Julio' },
            { value: '08', title: 'Agosto' },
            { value: '09', title: 'Septiembre' },
            { value: '10', title: 'Octubre' },
            { value: '11', title: 'Noviembre' },
            { value: '12', title: 'Diciembre' }
        ],
        branch_id: '',
        business_id: '',
        charge_id: '',
        charge: '',
        mostrarFila: false,
        fecha: '',
        search: '',
        editedIndex: -1,
        results: [],
        headers: [
            { title: 'Fecha Movimiento', key: 'data', sortable: false },
            { title: 'Producto', key: 'nameProduct', sortable: false },
            { title: 'Cantidad Trasladada', key: 'cant', sortable: false },
            {
                title: 'Almacén Saliente',
                align: 'center',
                children: [
                    //{ title: 'Sucursal', key: 'branchOut', sortable: false },
                    { title: 'Almacén', key: 'storeOut', sortable: false },
                ],
            },
            {
                title: 'Almacén Entrante',
                align: 'center',
                children: [
                    //{ title: 'Sucursal', key: 'branchInt', sortable: false },
                    { title: 'Almacén', key: 'storeInt', sortable: false },
                ],
            },
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
            if (this.editedIndex === 2) {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                return 'Reporte de Movimiento de Productos en el mes ' + this.selectedMounth + '-' + this.selectedYear;
            }
            else if (this.editedIndex === 3) {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.fecha = format(this.input3, "yyyy-MM");
                return 'Reporte de Movimiento de Productos en el mes ' + format(this.input3, "yyyy-MM");
            }
            else {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.fecha = format(new Date(), "yyyy-MM-dd");
                return 'Reporte de Movimiento de Productos ' + this.selectedYear;
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
                if (this.charge === 'Administrador') {
                    this.branch_id = this.branches[0].id;
                }
                //this.branch_id = !this.branch_id ? this.branch_id : this.branches[0].id;
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
        
        exportToExcel() {
            // Primero, prepara una matriz que contendrá todas las filas de datos, incluidos los encabezados
            let rows = [];
            let titleRow = {};
            titleRow[this.headers[0].key] = this.formTitle; // Utiliza la primera clave de encabezado para el título
            rows.push(titleRow);

            // Construye un objeto para los encabezados basado en la estructura de 'headers'
            let headerRow = {};
            this.headers.forEach(header => {
                if (header.children) {
                    header.children.forEach(childHeader => {
                        headerRow[childHeader.key] = childHeader.title;
                    });
                } else {
                    headerRow[header.key] = header.title;
                }
            });
            rows.push(headerRow);

            // Ahora, mapea los datos de los items para que coincidan con los encabezados
            this.results.forEach(item => {
                let rowData = {};
                this.headers.forEach(header => {
                    if (header.children) {
                        header.children.forEach(childHeader => {
                            rowData[childHeader.key] = item[childHeader.key] || '';
                        });
                    } else {
                        rowData[header.key] = item[header.key] || '';
                    }
                });
                rows.push(rowData);
            });

            // Convierte la matriz de filas en una hoja de trabajo Excel
            const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true }); // 'skipHeader: true' porque ya agregamos manualmente los encabezados

            // Crea un nuevo libro de trabajo y añade la hoja de trabajo con los datos
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Report");

            // Escribe el libro de trabajo a un archivo y desencadena la descarga
            XLSX.writeFile(wb, `report_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
        },
        
        moveProductsMounth() {
            this.editedIndex = 2;
            axios
                .get('http://127.0.0.1:8000/api/move-products', {
                    params: {
                        //branch_id: this.branch_id,
                        year: this.selectedYear,
                        mounth: this.selectedMounth
                    }
                })
                .then((response) => {
                    this.results = response.data.movimientos;
                    //this.saldoInicial = response.data.last_year_difference;
                    console.log('this.results');
                    console.log(this.results);
                })
        },
        initialize() {
            this.editedIndex = 1;
            this.selectedMounth = '';
            axios
                .get('http://127.0.0.1:8000/api/move-products', {
                    params: {
                        //branch_id: this.branch_id,
                        year: this.selectedYear,
                        mounth: this.selectedMounth
                    }
                })
                .then((response) => {
                    this.results = response.data.movimientos;
                    //this.saldoInicial = response.data.last_year_difference;
                    console.log('this.results');
                    console.log(this.results);
                })
        },

    },
}
</script>