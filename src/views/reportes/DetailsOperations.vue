<!-- eslint-disable vue/no-use-computed-property-like-method -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-card elevation="6" class="mx-5">
        <v-toolbar color="#F18254">
            <v-row align="center">
                <v-col cols="12" md="8" class="grow ml-4">
                    <span class="text-subtitle-1"> <strong>Reporte de Ingresos y Gastos detallados por
                            operaciones</strong></span>
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
                        prepend-inner-icon="mdi-calendar" ></v-select><!--@update:model-value="initialize()"-->
                </v-col>
                <v-col cols="12" md="3">
                    <v-select v-model="selectedMounth" :items="months" label="Selecciona un mes" variant="outlined"
                        prepend-inner-icon="mdi-calendar"></v-select><!--@update:model-value="operationDetailsMonth()"-->
                </v-col>
                <v-col cols="12" sm="12" md="3">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches" v-if="this.mostrarFila" 
                        label="Seleccione una Sucursal" prepend-inner-icon="mdi-store" item-title="name" item-value="id"
                        variant="outlined"></v-autocomplete><!--@update:model-value="initialize()"-->
                </v-col>
                <v-col cols="12" md="1">
                        <v-btn icon @click="operationDetailsMonth()" color="#F18254" >
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
            <v-row>
                <v-col cols="12" md="12">
                    
                    <v-card class="overflow-visible">
                        <v-card-text>
                            <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar"
                                single-line hide-details>
                            </v-text-field>
                            <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="results"
                                :group-by="groupBy" :search="search" no-results-text="No hay datos disponibles"
                                no-data-text="No hay datos disponibles" :hide-default-footer="true">
                                <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
                                    <tr>
                                        <td>
                                            <v-btn size="small" variant="text"
                                                :icon="isGroupOpen(item) ? 'mdi-minus' : 'mdi-plus'"
                                                @click="toggleGroup(item)"></v-btn>
                                            {{ item.value }}
                                        </td>
                                        <!-- Mostrar los totales para el grupo actual -->
                                        <td v-for="(header, index) in columns.slice(1)" :key="index" class="text-uppercase font-weight-bold">
                                            {{ formatNumber(calculateGroupTotal(item.value, header.value)) }}
                                        </td>
                                    </tr>
                                </template>
                                <template v-slot:item.Enero ="{ item }">
                                        <v-chip
                                            class="text-uppercase" size="small" label> {{
                            formatNumber(item.Enero)}}</v-chip>
                                    </template>
                                    <template v-slot:item.Febrero ="{ item }">
                                        <v-chip
                                            class="text-uppercase" size="small" label> {{
                            formatNumber(item.Febrero)}}</v-chip>
                                    </template>
                                    <template v-slot:item.Marzo ="{ item }">
                                        <v-chip
                                            class="text-uppercase" size="small" label> {{
                            formatNumber(item.Marzo)}}</v-chip>
                                    </template>
                                    <template v-slot:item.Abril ="{ item }">
                                        <v-chip
                                            class="text-uppercase" size="small" label> {{
                            formatNumber(item.Abril)}}</v-chip>
                                    </template>
                                    <template v-slot:item.Mayo ="{ item }">
                                        <v-chip
                                            class="text-uppercase" size="small" label> {{
                            formatNumber(item.Mayo)}}</v-chip>
                                    </template>
                                    <template v-slot:item.Junio ="{ item }">
                                        <v-chip
                                            class="text-uppercase" size="small" label> {{
                            formatNumber(item.Junio)}}</v-chip>
                                    </template>
                                    <template v-slot:item.Julio ="{ item }">
                                        <v-chip
                                            class="text-uppercase" size="small" label> {{
                            formatNumber(item.Julio)}}</v-chip>
                                    </template>
                                    <template v-slot:item.Agosto ="{ item }">
                                        <v-chip
                                            class="text-uppercase" size="small" label> {{
                            formatNumber(item.Agosto)}}</v-chip>
                                    </template>
                                    <template v-slot:item.Septiembre ="{ item }">
                                        <v-chip
                                            class="text-uppercase" size="small" label> {{
                            formatNumber(item.Septiembre)}}</v-chip>
                                    </template>
                                    <template v-slot:item.Octubre ="{ item }">
                                        <v-chip
                                            class="text-uppercase" size="small" label> {{
                            formatNumber(item.Octubre)}}</v-chip>
                                    </template>
                                    <template v-slot:item.Noviembre ="{ item }">
                                        <v-chip
                                            class="text-uppercase" size="small" label> {{
                            formatNumber(item.Noviembre)}}</v-chip>
                                    </template>
                                    <template v-slot:item.Diciembre ="{ item }">
                                        <v-chip
                                            class="text-uppercase" size="small" label> {{
                            formatNumber(item.Diciembre)}}</v-chip>
                                    </template>
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
//import { format } from "date-fns";
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
        groupBy: [
            {
                key: 'tipo',
            },
        ],
        headers: [
            { title: 'Detalle de Operación', align: 'start', value: 'operacion' },
            { title: 'Enero', value: 'Enero' },
            { title: 'Febrero', value: 'Febrero' },
            { title: 'Marzo', value: 'Marzo' },
            { title: 'Abril', value: 'Abril' },
            { title: 'Mayo', value: 'Mayo' },
            { title: 'Junio', value: 'Junio' },
            { title: 'Julio', value: 'Julio' },
            { title: 'Agosto', value: 'Agosto' },
            { title: 'Septiembre', value: 'Septiembre' },
            { title: 'Octubre', value: 'Octubre' },
            { title: 'Noviembre', value: 'Noviembre' },
            { title: 'Diciembre', value: 'Diciembre' },
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
            /*if (this.editedIndex === 2) {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.fecha = format(this.input, "yyyy-MM-dd") + '-' + format(this.input2, "yyyy-MM-dd");
                return 'Monto generado por Negocios en el período  ' + format(this.input, "yyyy-MM-dd") + '-' + format(this.input2, "yyyy-MM-dd");
            }
            else */if (this.editedIndex == 3) {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                //this.fecha = format(this.input3, "yyyy-MM");
                //return 'Reporte de Ingresos y Gastos detallados por operaciones en el mes ' + this.selectedYear+'-'+this.selectedMounth;
                //const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      //const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        //this.fecha = (this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")) + '-' + (this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
        return `Reporte de Ingresos y Gastos detallados por operaciones en el mes [<strong>${this.selectedYear}</strong> - <strong>${this.selectedMounth}</strong>]`;		
            }
            else {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                //this.fecha = format(new Date(), "yyyy-MM-dd");
                //return 'Reporte de Ingresos y Gastos detallados por operaciones ' + this.selectedYear;
                return `Reporte de Ingresos y Gastos detallados por operaciones del año <strong>${this.selectedYear}</strong>`;
            }
        },
        dateFormatted3() {
            const date = this.input3 ? new Date(this.input3) : new Date();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${year}-${month}`;
        },
        getDate3() {
            return this.input3 ? new Date(this.input3) : new Date();
        },
        /*getDate() {
          return this.input ? new Date(this.input) : new Date();
        },
        getDate2() {
          return this.input2 ? new Date(this.input2) : new Date();
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
        this.charge_id = parseInt(LocalStorageService.getItem('charge_id'));
        this.charge = JSON.parse(LocalStorageService.getItem("charge"));
        console.log('this.charge')
        console.log(this.charge)
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
      this.mostrarFila = true;
    } 
    const currentYear = new Date().getFullYear();
        // Llenar el arreglo years con los años, desde 2010 hasta el año actual
        for (let year = 2000; year <= currentYear; year++) {
            this.years.push(year);
        }
        // Establecer el año actual como el seleccionado por defecto
        this.selectedYear = currentYear;
        this.initialize();
          });
        // Obtener el año actual
        
    },

    methods: {
        formatNumber(value) {
            return value.toLocaleString('es-ES');
        },
        getTotalRowForGroup(groupKey) {
            // Filtrar los resultados para incluir solo los elementos del grupo actual con operación "Total"
            const groupResults = this.results.filter(item => item.tipo === groupKey && item.operacion === "Total");

            // Retornar la primera fila encontrada que cumpla con los criterios
            return groupResults.length > 0 ? groupResults[0] : null;
        },
        calculateGroupTotal(groupKey, columnKey) {
            // Obtener los totales para el grupo actual
            const totalRow = this.getTotalRowForGroup(groupKey);

            // Retornar el valor correspondiente a la columna
            return totalRow ? totalRow[columnKey] : 0;
        },
       
        exportToExcel() {
            // Primero, prepara una matriz que contendrá todas las filas de datos, incluidos los encabezados
            let rows = [];

            // Construye un objeto para los encabezados basado en la estructura de 'headers'
            let headerRow = {};
            this.headers.forEach(header => {
                headerRow[header.key] = header.value; // Usa 'key' para el mapeo y 'title' para el texto del encabezado
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
                tipo: this.formTitle, // Asume que 'name' es una de tus claves; ajusta según sea necesario
                operation: '', // Deja vacíos los demás campos para esta fila especial
                Enero: '',
                Febrero: '',
                Marzo: '' // Usa 'total' para mostrar la fecha; ajusta las claves según corresponda a tu estructura
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
                .get('https://api2.simplifies.cl/api/details-operations', {
                    params: {
                        branch_id: this.branch_id,
                        year: this.selectedYear
                    }
                })
                .then((response) => {
                    this.results = response.data;
                    //this.saldoInicial = response.data.last_year_difference;
                    console.log('this.results');
                    console.log(this.results);
                })
        },
        operationDetailsMonth(){
            this.editedIndex = 3;
            if(this.selectedMounth){
                axios
                .get('https://api2.simplifies.cl/api/details-operations-month', {
                    params: {
                        branch_id: this.branch_id,
                        year: this.selectedYear,
                        month: this.selectedMounth
                    }
                })
                .then((response) => {
                    this.results = response.data;
                    //this.saldoInicial = response.data.last_year_difference;
                    console.log('this.results');
                    console.log(this.results);
                })
            }else{
                this.initialize();
            }
        },

    },
}
</script>