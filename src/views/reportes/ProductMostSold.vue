<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-card elevation="6" class="mx-5">
        <v-toolbar color="#F18254">
            <v-container>
                <v-row align="center">
                    <v-col cols="12" md="8" class="grow ml-4">
                        <span class="text-h8"> <strong>Productos mas vendidos y menos vendidos</strong></span>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="12" md="3">
                        <v-btn class="text-subtitle-1" color="#E7E9E9" variant="flat" elevation="2"
                            prepend-icon="mdi-file-excel" @click="exportToExcel">
                            Exportar a Excel
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-toolbar>
        <v-container>
            <v-row>
                <v-col cols="12" sm="12" md="4">
                    <v-autocomplete v-model="branch_id" :items="branches" v-if="this.mostrarFila" clearable
                        label="Seleccione una Sucursal" prepend-icon="mdi-store" item-title="name" item-value="id"
                        variant="underlined" @update:model-value="initialize()"></v-autocomplete>
                </v-col>
            </v-row>
            <v-row>
                    <v-col cols="12">
                    <v-container>
                        <v-alert border type="warning" variant="outlined" prominent>
                            <span class="text-h6">{{ formTitle }}</span>
                        </v-alert>
                    </v-container>
                    <v-card-text>
                        <v-text-field class="mt-1 mb-1" v-model="search2" append-icon="mdi-magnify" label="Buscar"
                            single-line hide-details>
                        </v-text-field>
                        <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="results" :search="search2" class="elevation-2"  no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">
                            <template v-slot:item.name="{ item }">

                                <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                                    <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_product" alt="image"></v-img>
                                </v-avatar>
                                {{ item.name }}
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
        menu: false,
        menu2: false,
        menu3: false,
        input: null,
        input2: null,
        input3: null,
        search2: '',
        editedIndex: 1,
        mostrarFila: false,
        branch_id: '',
        results: [],
        branches: [],
        business_id: '',
        headers: [
            { title: 'Producto', key: 'name', sortable: false },
            { title: 'Referencia', key: 'reference', sortable: false },
            { title: 'Cantidad', key: 'orders_count', sortable: true },
        ],
        data: {},
    }),
    computed: {
        formTitle() {
            return 'Productos mas vendidos y menos vendidos';
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
        //this.branch_id = 1;
        this.branch_id = LocalStorageService.getItem("branch_id") ? 1 : LocalStorageService.getItem("branch_id");
        this.business_id = LocalStorageService.getItem("business_id");
        this.charge_id = LocalStorageService.getItem('charge_id');
        if (this.charge_id === '4') {
            // Mostrar la fila con Autocomplete
            this.mostrarFila = true;
        }
        console.log(this.branch_id);

        axios
            .get('https://api2.simplifies.cl/api/show-business', {
                params: {
                    business_id: this.business_id
                }
            })
            .then((response) => {
                this.branches = response.data.branches;
            });
        this.initialize();
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
        initialize() {
            this.editedIndex = 1;
            axios
                .get('https://api2.simplifies.cl/api/product-mostSold', {
                    params: {
                        branch_id: this.branch_id,
                        business_id: this.business_id
                    }
                })
                .then((response) => {
                    this.results = response.data;
                });
        },

    },
}
</script>