<!-- eslint-disable vue/no-use-computed-property-like-method -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-card elevation="6" class="mx-5">
        <v-toolbar color="#F18254">
            <v-row align="center">
                <v-col cols="12" md="6" class="grow ml-4">
                    <span class="text-subtitle-1"> <strong>Movimiento de Productos</strong></span>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="12" md="5">
                    <v-btn class="text-subtitle-1  ml-1" color="#E7E9E9" variant="flat" elevation="2"
                        prepend-icon="mdi-trending-up" @click="showMostSold">
                        Más y menos vendidos
                    </v-btn>
                    <v-btn class="text-subtitle-1  ml-1" color="#E7E9E9" variant="flat" elevation="2"
                        prepend-icon="mdi-shuffle" @click="showReposition">
                        Reposición
                    </v-btn>
                    <v-btn class="text-subtitle-1  ml-1" color="#E7E9E9" variant="flat" elevation="2"
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
                        prepend-inner-icon="mdi-calendar"></v-select><!-- @update:model-value="initialize()"-->
                </v-col>
                <v-col cols="12" md="4">
                    <v-select v-model="selectedMounth" :items="months" label="Selecciona un mes" variant="outlined"
                        prepend-inner-icon="mdi-calendar" ></v-select><!--@update:model-value="moveProductsMounth()"-->
                </v-col>
                <v-col cols="12" md="1">
                    <v-btn icon @click="moveProductsMounth()" color="#F18254">
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
                    <v-card class="mx-auto  overflow-visible">
                        <v-card-text>
                            <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar"
                                single-line hide-details>
                            </v-text-field>
                            <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'"
                                :items="results" :search="search" no-results-text="No hay datos disponibles"
                                no-data-text="No hay datos disponibles">

                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <!--Productos mas vendidos-->
            <v-dialog v-model="dialogMostSold" fullscreen transition="dialog-bottom-transition">
                <v-card elevation="6">
                    <v-toolbar color="#F18254">
                        <v-container>
                            <v-row align="center">
                                <v-col cols="12" md="8" class="grow ml-4">
                                    <span class="text-h8"> <strong>Productos más vendidos y menos
                                            vendidos</strong></span>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="12" md="3">
                                    <v-btn class="text-subtitle-1" color="#E7E9E9" variant="flat" elevation="2"
                                        prepend-icon="mdi-file-excel" @click="exportToExcel1">
                                        Exportar a Excel
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-toolbar>
                    <v-card-text class="mt-1 mb-1">
                    <v-container>
                        <v-row>
                            <!-- Primera columna -->
                            <v-col cols="12" sm="6" md="3">
                                <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                                    transition="scale-transition" offset-y min-width="290px">
                                    <template v-slot:activator="{ props }">
                                        <v-text-field v-bind="props" :modelValue="dateFormatted" variant="outlined"
                                            append-inner-icon="mdi-calendar" label="Fecha inicial"></v-text-field>
                                    </template>
                                    <v-locale-provider locale="es">
                                        <v-date-picker header="Calendario" title="Seleccione la fecha"
                                            color="orange lighten-2" :modelValue=input @update:model-value="updateDate"
                                            format="yyyy-MM-dd" :max="dateFormatted2"></v-date-picker>
                                    </v-locale-provider>
                                </v-menu>
                            </v-col>
                            <!-- Segunda columna -->
                            <v-col cols="12" sm="6" md="3">
                                <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                                    transition="scale-transition" offset-y min-width="290px">
                                    <template v-slot:activator="{ props }">
                                        <v-text-field v-bind="props" :modelValue="dateFormatted2" variant="outlined"
                                            append-inner-icon="mdi-calendar" label="Fecha final"></v-text-field>
                                    </template>
                                    <v-locale-provider locale="es">
                                        <v-date-picker header="Calendario" title="Seleccione la fecha"
                                            color="orange lighten-2" :modelValue="getDate2" format="yyyy-MM-dd"
                                            :min="dateFormatted"
                                            @update:model-value="updateDate1"></v-date-picker><!--@update:model-value="updateDate2"-->
                                    </v-locale-provider>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" md="1">
                                <v-btn icon @click="updateDate2" color="#F18254">
                                    <v-icon>mdi-magnify</v-icon></v-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-container>
                                    <v-alert border type="info" variant="outlined" density="compact">
                                        <p v-html="formTitle1"></p>
                                    </v-alert>
                                </v-container>
                                <v-card-text>
                                    <v-text-field class="mt-1 mb-1" v-model="search2" append-icon="mdi-magnify"
                                        label="Buscar" single-line hide-details>
                                    </v-text-field>
                                    <v-data-table :headers="headers1" :items-per-page-text="'Elementos por páginas'"
                                        :items="results1" :search="search2" class="elevation-2"
                                        no-results-text="No hay datos disponibles"
                                        no-data-text="No hay datos disponibles">
                                        <template v-slot:item.name="{ item }">

                                            <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                                                <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image_product"
                                                    alt="image"></v-img>
                                            </v-avatar>
                                            {{ item.name }}
                                        </template>
                                    </v-data-table>

                                </v-card-text>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="#E7E9E9" variant="flat" @click="closeDialogMostSold">
                            Volver
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!--endMas vendidos-->

            <!--Reposicion de productos-->
            <v-dialog v-model="dialogReposition" fullscreen transition="dialog-bottom-transition">
                <v-card elevation="6">
        <v-toolbar color="#F18254">
            <v-container>
                <v-row align="center">
                    <v-col cols="12" md="9" class="grow">
                        <span class="text-h8"> <strong>Reposición de productos</strong></span>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="12" md="3">
                        <v-btn class="text-subtitle-1" color="#E7E9E9" variant="flat" elevation="2"
                            prepend-icon="mdi-file-excel" @click="exportToExcel3">
                            Exportar a Excel
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-toolbar>
        <v-card-text class="mt-1 mb-1">
        <v-container>
            <!--<v-row>
                <v-col cols="12" sm="12" md="4">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches" v-if="this.mostrarFila" 
                        label="Seleccione una Sucursal" prepend-inner-icon="mdi-store" item-title="name" item-value="id"
                        variant="outlined" @update:model-value="initialize()"></v-autocomplete>
                </v-col>
            </v-row>-->
            <v-row>
                <v-col cols="12">
                    <v-container>
                        <v-alert border type="info" variant="outlined" density="compact">
                            <p><strong>Productos Próximos a agotarse</strong></p>
                        </v-alert>
                    </v-container>
                    <v-card-text>
                        <v-text-field class="mt-1 mb-1" v-model="search3" append-icon="mdi-magnify" label="Buscar"
                            single-line hide-details>
                        </v-text-field>
                        <v-data-table :headers="headers2" :items-per-page-text="'Elementos por páginas'" :items="results2"
                            :search="search3" class="elevation-2" no-results-text="No hay datos disponibles"
                            no-data-text="No hay datos disponibles">
                            <template v-slot:item.name="{ item }">

                                <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                                    <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image_product"
                                        alt="image"></v-img>
                                </v-avatar>
                                {{ item.name }}
                            </template>
                        </v-data-table>

                    </v-card-text>
                </v-col>
            </v-row>
        </v-container>
        </v-card-text>
        <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="#E7E9E9" variant="flat" @click="closeDialogReposition">
                            Volver
                        </v-btn>
                    </v-card-actions>
    </v-card>
            </v-dialog>
            <!--endReposicion de productos-->
        </v-container>
    </v-card>
</template>
<script>

import axios from "axios";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
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
        search2: '',
        selectedYear: null,
        selectedMounth: '',
        dialogMostSold: false,
        dialogReposition: false,
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
        search3: '',
        editedIndex: -1,
        editedIndex1: 1,
        results: [],
        results1: [],
        results2: [],
        headers: [
            { title: 'Fecha Movimiento', key: 'data', sortable: false },
            { title: 'Producto', key: 'nameProduct', sortable: false },
            { title: 'Cantidad Trasladada', key: 'cant', sortable: false },
            { title: 'Almacén Saliente', key: 'storeOut', sortable: false },
            { title: 'Almacén Entrante', key: 'storeInt', sortable: false },
        ],
        headers1: [
            { title: 'Producto', key: 'name', sortable: false },
            { title: 'Referencia', key: 'reference', sortable: false },
            { title: 'Cantidad', key: 'orders_count', sortable: true },
        ],
        headers2: [
            { title: 'Producto', key: 'name', sortable: false },
            { title: 'Referencia', key: 'reference', sortable: false },
            { title: 'Existencia', key: 'stock', sortable: false },
            //{ title: 'Sucursal', key: 'nameBranch', sortable: true },
            { title: 'Almacén', key: 'store', sortable: true },
        ],
        tableData: [],
        data: {},
        /*chartOptions: {
            responsive: true
        },*/
    }),
    computed: {
        formTitle() {
            if (this.editedIndex === 2) {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                //return 'Reporte de Movimiento de Productos en el mes ' + this.selectedMounth + '-' + this.selectedYear;

                // Formatear la fecha en el formato deseado y traducir los nombres de los meses al español
                //console.log(format(this.selectedMounth, "MMMM", { locale: es }));
                return `Reporte de Movimiento de Productos en el mes de [<strong>${format(this.selectedMounth, "MMMM", { locale: es })}</strong> de <strong>${this.selectedYear}</strong>]`;
            }
            else {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.fecha = format(new Date(), "yyyy-MM-dd");
                return `Reporte de Movimiento de Productos  <strong>${this.selectedYear}</strong>`;
            }
        },
        formTitle1() {
            if (this.editedIndex1 === 2) {
                const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
                const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
                return `Productos más vendidos y menos vendidos en el período [<strong>${startDate}</strong> - <strong>${endDate}</strong>]`;
            }
            else {
                return `Productos más vendidos y menos vendidos en el día <strong>${format(new Date(), "yyyy-MM-dd")}</strong>`;
            }
            //return 'Productos más vendidos y menos vendidos';
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
        getDate() {
            return this.input ? new Date(this.input) : new Date();
        },
        getDate2() {
            return this.input2 ? new Date(this.input2) : new Date();
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
        updateDate(val) {
            this.input = val;
            this.menu = false;
        },
        updateDate1(val) {
            this.input2 = val;
            this.menu2 = false;
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
            if (this.selectedMounth) {
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
            } else {
                this.initialize();
            }

        },
        initialize() {
            this.editedIndex = 1;
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

        //Productos mas vendidos
        showMostSold() {
            console.log('Entra aqui a mejores aisitencias');
            this.editedIndex1 = 1;
            axios
                .get('http://127.0.0.1:8000/api/product-mostSold', {
                    params: {
                        branch_id: this.branch_id
                    }
                })
                .then((response) => {
                    this.results1 = response.data;
                });
            this.dialogMostSold = true;
        },
        closeDialogMostSold() {
            this.dialogMostSold = false;
            this.results1 = [];
            this.input = null;
            this.input2  = null;
        },
        updateDate2() {
            this.editedIndex1 = 2;
            const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
            const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
            axios
                .get('http://127.0.0.1:8000/api/product-mostSold-periodo', {
                    params: {
                        branch_id: this.branch_id,
                        startDate: startDate,
                        endDate: endDate
                    }
                })
                .then((response) => {
                    this.results1 = response.data;
                });
        },
        exportToExcel1() {
            // Primero, prepara una matriz que contendrá todas las filas de datos, incluidos los encabezados
            let rows = [];

            // Construye un objeto para los encabezados basado en la estructura de 'headers'
            let headerRow = {};
            this.headers1.forEach(header1 => {
                headerRow[header1.key] = header1.title; // Usa 'key' para el mapeo y 'title' para el texto del encabezado
            });
            rows.push(headerRow);

            // Ahora, mapea los datos de los items para que coincidan con los encabezados
            this.results1.forEach(item => {
                let rowData = {};
                this.headers1.forEach(header1 => {
                    rowData[header1.key] = item[header1.key] || ''; // Asegura que cada celda se mapee correctamente; usa '' para datos faltantes
                });
                rows.push(rowData);
            });

            let nameReport = {
                // eslint-disable-next-line vue/no-use-computed-property-like-method
                name: this.formTitle1, // Asume que 'name' es una de tus claves; ajusta según sea necesario
                reference: '',
                orders_count: ''
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
        //endProductos mas vendidos
        //Reposicion de productos
        showReposition() {
            console.log('Entra aqui a reposicion');
            axios
                .get('http://127.0.0.1:8000/api/product-stock'/*, {
                    params: {
                        branch_id: this.branch_id,
                        business_id: this.business_id
                    }
                }*/)
                .then((response) => {
                    this.results2 = response.data;
                });
            this.dialogReposition = true;
        },
        closeDialogReposition() {
            this.dialogReposition = false;
            this.results2 = [];
        },
        exportToExcel3() {
            // Primero, prepara una matriz que contendrá todas las filas de datos, incluidos los encabezados
            let rows = [];

            // Construye un objeto para los encabezados basado en la estructura de 'headers'
            let headerRow = {};
            this.headers2.forEach(header2 => {
                headerRow[header2.key] = header2.title; // Usa 'key' para el mapeo y 'title' para el texto del encabezado
            });
            rows.push(headerRow);

            // Ahora, mapea los datos de los items para que coincidan con los encabezados
            this.results2.forEach(item => {
                let rowData = {};
                this.headers1.forEach(header1 => {
                    rowData[header1.key] = item[header1.key] || ''; // Asegura que cada celda se mapee correctamente; usa '' para datos faltantes
                });
                rows.push(rowData);
            });

            let nameReport = {
                // eslint-disable-next-line vue/no-use-computed-property-like-method
                name: 'Reposición de productos', // Asume que 'name' es una de tus claves; ajusta según sea necesario
                reference: '',
                orders_count: ''
            };
            rows.push(nameReport);

            // Convierte la matriz de filas en una hoja de trabajo Excel
            const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true }); // 'skipHeader: true' porque ya agregamos manualmente los encabezados

            // Crea un nuevo libro de trabajo y añade la hoja de trabajo con los datos
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Report" + new Date().toLocaleDateString().replace(/\//g, '-'));

            // Escribe el libro de trabajo a un archivo y desencadena la descarga
            //XLSX.writeFile(wb, "report.xlsx");
            XLSX.writeFile(wb, `report_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
        }, 
        //endReposicion
    },
}
</script>