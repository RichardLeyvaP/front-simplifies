<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-snackbar class="mt-12" location="right top" :timeout="sb_timeout" :color="sb_type" elevation="24"
        :multi-line="true" vertical v-model="snackbar">
        <v-row>
            <v-col md="2">
                <v-avatar :icon="sb_icon" color="sb_type" size="40"></v-avatar>
            </v-col>
            <v-col md="10">
                <h4>{{ sb_title }}</h4>
                {{ sb_message }}

            </v-col>
        </v-row>
    </v-snackbar>
    <v-container>
        <v-card elevation="6" class="mx-5" width='auto'>
            <v-toolbar color="#F18254">
                <v-row align="center">
                    <v-col cols="12" md="6" class="grow ml-2">
                        <span class="text-subtitle-1"> <strong>Detalles de operaciones de
                                {{ this.editedItem.type }}</strong></span>
                    </v-col>
                    <v-col cols="12" md="5" class="text-right">

                        <v-dialog v-model="dialog" max-width="800px">
                            <template v-slot:activator="{ props }">
                                <v-btn class="text-subtitle-1  ml-1" color="#E7E9E9" variant="flat" elevation="2"
                                    prepend-icon="mdi-file-excel" @click="exportToExcel">
                                    Exportar a Excel
                                </v-btn>
                                <v-btn v-bind="props" class="text-subtitle-1  ml-1" color="#E7E9E9" variant="flat"
                                    elevation="2" prepend-icon="mdi-plus-circle">
                                    Agregar operación
                                </v-btn>

                            </template>
                            <v-card>
                                <v-toolbar color="#F18254">
                                    <span class="text-subtitle-2 ml-2"> {{ formTitle }}</span>
                                </v-toolbar>
                                <v-card-text>
                                    <v-radio-group v-model="selectedOption" inline v-if="mostrarFila">
                                        <v-radio v-model="selectedOption" :label="options[0]" :value="options[0]"
                                            color="orange-darken-3" class="mr-10" />
                                        <v-radio v-model="selectedOption" :label="options[1]" :value="options[1]"
                                            color="orange-darken-3" class="mr-10" />
                                        <v-radio v-model="selectedOption" :label="options[2]" :value="options[2]"
                                            color="orange-darken-3" class="mr-10" />
                                    </v-radio-group>

                                    <v-row v-if="selectedOption === 'Sucursal' && mostrarFila">
                                        <v-col>
                                            <v-autocomplete :no-data-text="'No hay datos disponibles'"
                                                v-model="editedItem.branch_id" :items="branches" clearable
                                                label="Sucursales" prepend-icon="mdi-office-building" item-title="name"
                                                item-value="id" variant="underlined" :rules="selectRules"
                                                @update:model-value="selectBranches"></v-autocomplete><!--@update:model-value="selectBranches"-->
                                        </v-col>
                                    </v-row>

                                    <v-row v-if="selectedOption === 'Academia' && mostrarFila">
                                        <v-col>
                                            <v-autocomplete :no-data-text="'No hay datos disponibles'"
                                                v-model="editedItem.enrollment_id" :items="enrollments" clearable
                                                label="Academias" prepend-icon="mdi-school" item-title="name"
                                                item-value="id" variant="underlined" :rules="selectRules"
                                                @update:model-value="selectEnrollments"></v-autocomplete><!--@update:model-value="selectEnrollments"-->
                                        </v-col>
                                    </v-row>
                                    <v-form v-model="valid" enctype="multipart/form-data">

                                        <v-row>
                                            <v-col cols="12" md="6">
                                                <v-select label="Tipo de operación" v-model="editedItem.operation"
                                                    :items="['Ingreso', 'Gasto']" item-value="['Ingreso', 'Gasto']"
                                                    variant="underlined" density="compact" :rules="selectRules"
                                                    prepend-icon="mdi-cash-multiple"></v-select>
                                            </v-col>
                                            <v-col cols="12" md="6" v-if="editedItem.operation === 'Ingreso'">
                                                <v-autocomplete :no-data-text="'No hay datos disponibles'"
                                                    v-model="editedItem.revenue_id" :items="revenues" clearable
                                                    label="Ingresos" prepend-icon="mdi-cash-plus" item-title="name"
                                                    item-value="id" variant="underlined" density="compact"
                                                    :rules="selectRules"></v-autocomplete>
                                            </v-col>
                                            <v-col cols="12" md="6" v-if="editedItem.operation === 'Gasto'">
                                                <v-autocomplete :no-data-text="'No hay datos disponibles'"
                                                    v-model="editedItem.expense_id" :items="expenses" clearable
                                                    label="Gastos" prepend-icon="mdi-cash-plus" item-title="name"
                                                    item-value="id" variant="underlined" density="compact"
                                                    :rules="selectRules"></v-autocomplete>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="12" md="6">
                                                <v-text-field v-model="editedItem.amount" clearable label="Monto"
                                                    prepend-icon="mdi-currency-usd" variant="underlined" :rules="pago">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-text-field v-model="editedItem.control" clearable label="No.Control"
                                                    prepend-icon="mdi-security" variant="underlined" :disabled="true">
                                                </v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="12" md="12">
                                                <v-text-field v-model="editedItem.comment" clearable label="Comentario"
                                                    prepend-icon="mdi-information" variant="underlined"
                                                    :rules="nameRules">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="12">
                                                <v-file-input clearable v-model="file" ref="fileInput"
                                                    label="Comprobante" variant="underlined" density="compact"
                                                    name="file" accept=".docx, .doc, .pdf" @change="onFileSelected">
                                                </v-file-input>
                                            </v-col>
                                        </v-row>
                                        <v-divider></v-divider>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>

                                            <v-btn color="#E7E9E9" variant="flat" @click="close">
                                                Cancelar
                                            </v-btn>
                                            <v-btn color="#F18254" variant="flat" @click="save" :disabled="!valid">
                                                Aceptar
                                            </v-btn>
                                        </v-card-actions>
                                    </v-form>
                                </v-card-text>
                            </v-card>
                        </v-dialog>

                        <v-dialog v-model="dialogDelete" max-width="500px">
                            <v-card>
                                <v-toolbar color="red">
                                    <span class="text-subtitle-2 ml-4"> Eliminar operación</span>
                                </v-toolbar>

                                <v-card-text class="mt-2 mb-2"> ¿Desea deshacer la operación?</v-card-text>
                                <v-divider></v-divider>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="#E7E9E9" variant="flat" @click="closeDelete">
                                        Cancelar
                                    </v-btn>
                                    <v-btn color="warning" variant="flat" @click="deleteItemConfirm">
                                        Aceptar
                                    </v-btn>


                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-col>

                </v-row>

            </v-toolbar>

            <v-row>
                <v-container>
                    <v-row>
                        <v-col cols="12" md="3">
                            <!--<v-radio-group v-model="selectedOption" inline v-if="mostrarFila">
                        <v-radio v-model="selectedOption" :label="options[0]" :value="options[0]"
                            color="orange-darken-3" class="mr-10" />
                        <v-radio v-model="selectedOption" :label="options[1]" :value="options[1]"
                            color="orange-darken-3" class="mr-10" />
                        <v-radio v-model="selectedOption" :label="options[2]" :value="options[2]"
                            color="orange-darken-3" class="mr-10" />
                        <v-radio v-model="selectedOption" :label="options[3]" :value="options[3]"
                            color="orange-darken-3" class="mr-10" />
                    </v-radio-group>-->
                            <v-select v-model="selectedOption" :items="options" class="ma-2" label="Tipo"
                                variant="outlined" density="compact" hide-details></v-select>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-select v-model="selectedYear" :items="years" label="Selecciona un año" variant="outlined"
                                prepend-inner-icon="mdi-calendar" @update:model-value="initialize()" density="compact"
                                class="ma-2"></v-select><!--@update:model-value="initialize()"-->
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-select v-model="selectedMounth" :items="months" label="Selecciona un mes"
                                variant="outlined" prepend-inner-icon="mdi-calendar" density="compact" class="ma-2"
                                @update:model-value="initialize()"></v-select><!--@update:model-value="operationDetails()"-->
                        </v-col>
                        <!--<v-col cols="12" md="5">
                                            <v-btn class="text-subtitle-1  ml-12" color="#E7E9E9" variant="flat" elevation="2"
                                            prepend-inner-icon="mdi-file-excel" @click="exportToExcel">
                                                Exportar a Excel
                                            </v-btn>
                                    </v-col>-->
                    </v-row>


                    <v-row v-if="selectedOption === 'Sucursal' && mostrarFila">
                        <v-col cols="12" md="4">
                            <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.branch_id"
                                :items="branches" clearable label="Sucursales" prepend-icon="mdi-office-building"
                                item-title="name" item-value="id" variant="underlined" :rules="selectRules"
                                @update:model-value="selectBranches"></v-autocomplete>
                        </v-col>
                    </v-row>

                    <v-row v-if="selectedOption === 'Academia' && mostrarFila">
                        <v-col cols="12" md="4">
                            <v-autocomplete :no-data-text="'No hay datos disponibles'"
                                v-model="editedItem.enrollment_id" :items="enrollments" clearable label="Academias"
                                prepend-icon="mdi-school" item-title="name" item-value="id" variant="underlined"
                                :rules="selectRules" @update:model-value="selectEnrollments"></v-autocomplete>
                        </v-col>
                    </v-row>
                </v-container>
            </v-row>
            <v-col cols="12">
                <v-row class="d-flex flex-wrap">
                    <v-col cols="2" class="pa-1">
                        <v-card class="pa-2" elevation="2"
                            v-if="selectedOption === 'Sucursal' || selectedOption === 'Negocio'"
                            @click="filterResults('IP')">
                            <v-list-item :subtitle="formatNumber(ingresoProducts)" title="Ingreso Productos">
                                <template v-slot:prepend>
                                    <v-avatar color="green">
                                        <v-icon color="white">{{ 'mdi-plus-circle' }}</v-icon>
                                    </v-avatar>
                                </template>
                            </v-list-item>
                        </v-card>
                    </v-col>
                    <v-col cols="2" class="pa-1">
                        <v-card class="pa-2" elevation="2"
                            v-if="selectedOption === 'Sucursal' || selectedOption === 'Negocio'"
                            @click="filterResults('GP')">
                            <v-list-item :subtitle="formatNumber(gastoProducts)" title="Gasto Productos">
                                <template v-slot:prepend>
                                    <v-avatar color="red">
                                        <v-icon color="white">{{ 'mdi-minus-circle' }}</v-icon>
                                    </v-avatar>
                                </template>
                            </v-list-item>
                        </v-card>
                    </v-col>
                    <v-col cols="2" class="pa-1">
                        <v-card class="pa-2" elevation="2"
                            v-if="selectedOption === 'Sucursal' || selectedOption === 'Negocio'"
                            @click="filterResults('IS')">
                            <v-list-item :subtitle="formatNumber(ingresoServices)" title="Ingreso Servicio">
                                <template v-slot:prepend>
                                    <v-avatar color="green">
                                        <v-icon color="white">{{ 'mdi-plus-circle' }}</v-icon>
                                    </v-avatar>
                                </template>
                            </v-list-item>
                        </v-card>
                    </v-col>
                    <v-col cols="2" class="pa-1">
                        <v-card class="pa-2" elevation="2"
                            v-if="selectedOption === 'Sucursal' || selectedOption === 'Negocio'"
                            @click="filterResults('GS')">
                            <v-list-item :subtitle="formatNumber(gastoServices)" title="Gasto Servicio">
                                <template v-slot:prepend>
                                    <v-avatar color="red">
                                        <v-icon color="white">{{ 'mdi-minus-circle' }}</v-icon>
                                    </v-avatar>
                                </template>
                            </v-list-item>
                        </v-card>
                    </v-col>
                    <v-col cols="2" class="pa-1">
                        <v-card class="pa-2" elevation="2">
                            <v-list-item :subtitle="formatNumber(utilidades)" title="Utilidades">
                                <template v-slot:prepend>
                                    <v-avatar color="green">
                                        <v-icon color="white">{{ 'mdi-plus-circle' }}</v-icon>
                                    </v-avatar>
                                </template>

                            </v-list-item>
                        </v-card>
                    </v-col>
                    <v-col cols="2" class="pa-1">
                        <v-card class="pa-2" elevation="2">
                            <v-list-item :subtitle="formatNumber(totalGastos)" title="Gastos">
                                <template v-slot:prepend>
                                    <v-avatar color="red">
                                        <v-icon color="white">{{ 'mdi-minus-circle' }}</v-icon>
                                    </v-avatar>
                                </template>

                            </v-list-item>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
            <!--<v-col cols="12" md="2">
                <v-card class="pa-2 pl-0 mb-2" elevation="2">
                    <v-list-item :subtitle="formatNumber(utilidades)" title="Utilidades">
                        <template v-slot:prepend>
                            <v-avatar color="green">
                                <v-icon color="white">{{ 'mdi-plus-circle' }}</v-icon>
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
                                <v-icon color="white">{{ 'mdi-minus-circle' }}</v-icon>
                            </v-avatar>
                        </template>

                    </v-list-item>
                </v-card>
            </v-col>-->
            <v-row>
                <v-col cols="12" md="12">
                    <v-container>
                        <v-card>
                        <v-card-text>
                            <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar"
                                single-line hide-details>
                            </v-text-field>
                            <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'"
                                :items="results" :search="search" class="elevation-1"
                                no-data-text="No hay datos disponibles" no-results-text="No hay datos disponibles" :loading="loading" loading-text="Cargando datos...">
                                <template v-slot:item.file="{ item }">
                                    <v-icon v-if="item.file" @click="openDoc(item)"
                                        color="green">mdi-file-document-outline</v-icon>
                                    <!--<v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                        <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_product" alt="image"></v-img>
                    </v-avatar>-->
                                </template>
                                <template v-slot:item.comment="{ item }">
                                    {{ getString(item.comment) }}
                                </template>
                                <template v-slot:item.revenue="{ item }">
                                    {{ formatNumber(item.revenue) }}
                                </template>
                                <template v-slot:item.expense="{ item }">
                                    {{ formatNumber(item.expense) }}
                                </template>
                                <template v-slot:top>

                                    <v-divider class="mx-4" inset vertical></v-divider>
                                    <v-spacer></v-spacer>
                                </template>

                                <template v-slot:item.actions="{ item }">
                                    <!--<v-icon size="25" color="blue" class="me-2" @click="editItem(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon size="25" color="red" @click="deleteItem(item)">
                        mdi-delete
                    </v-icon>-->
                                    <v-btn density="comfortable" icon="mdi-pencil" @click="editItem(item)"
                                        color="primary" variant="tonal" elevation="1" class="mr-1 mt-1 mb-1"
                                        title="Editar operación"></v-btn>
                                    <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)"
                                        color="red-darken-4" variant="tonal" elevation="1"
                                        title="Eliminar operación"></v-btn>
                                </template>
                            </v-data-table>
                        </v-card-text>
                        </v-card>
                    </v-container>
                </v-col>
            </v-row>


        </v-card>
    </v-container>
</template>
<script>

import axios from "axios";
import * as XLSX from 'xlsx';
import LocalStorageService from "@/LocalStorageService";


axios.interceptors.request.use(config => {
  const token = LocalStorageService.getItem('token'); // Suponiendo que guardaste el token en localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token.replace(/['"]+/g, '')}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default {
    data: () => ({
        valid: true,
        //visibility: true,
        loading: true,
        selectedOption: 'Todas',
        options: ['Negocio', 'Sucursal', 'Academia', 'Todas'],
        file: '',
        selectedYear: null,
        selectedMounth: '',
        years: [],
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
        mostrarFila: false,
        snackbar: false,
        sb_type: '',
        sb_message: '',
        sb_timeout: 2000,
        sb_title: '',
        sb_icon: '',
        dialog: false,
        branch_id: '',
        enrollment_id: '',
        business_id: '',
        search: '',
        charge: '',
        totalIngresos: 0,
        totalGastos: 0,
        utilidades: 0,
        ingresoProducts: 0,
        gastoProducts: 0,
        ingresoServices: 0,
        gastoServices: 0,
        typeDetailFilter: null,
        message_delete: true,
        dialogDelete: false,
        headers: [
            //{ title: 'Almacén', align: 'start', value: 'direccionStore' },
            { title: 'No. Control', key: 'id' },
            { title: 'Fecha Registro', key: 'data' },
            { title: 'Tipo de Operación', key: 'operation' },
            { title: 'Detalle de Operación', key: 'nameDetalle' },
            { title: 'Ingreso', key: 'revenue' },
            { title: 'Gasto', key: 'expense' },
            { title: 'Comentario', key: 'comment' },
            { title: 'Archivo', key: 'file' },
            { title: 'Acciones', key: 'actions', sortable: false },
        ],
        results: [],
        expenses: [],
        revenues: [],
        branches: [],
        business: [],
        enrollments: [],
        editedIndex: -1,
        editedItem: {
            type: '',
            branch_id: '',
            business_id: '',
            enrollment_id: '',
            control: '',
            operation: 'Ingreso',
            amount: '',
            comment: '',
            file: '',
            expense_id: '',
            revenue_id: '',
            id: ''
        },
        data: {},

        defaultItem: {
            type: '',
            branch_id: '',
            business_id: '',
            enrollment_id: '',
            control: '',
            operation: 'Ingreso',
            amount: '',
            comment: '',
            file: '',
            expense_id: '',
            revenue_id: '',
            id: '',
        },
        pago: [
            (value) => /^\d+(\.\d+)?$/.test(value) || "Debe ser un número con punto decimal (10.00)",
            (value) => !isNaN(parseFloat(value)) || 'Debe ser un número'],
        selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
        nameRules: [
            (v) => !!v || "El campo es requerido"],
    }),

    computed: {
        formTitle() {
            if (this.editedIndex === -1) {
                return 'Registrar Operación de ' + this.editedItem.type;
            }
            if (this.editedIndex === 1) {
                return 'Editar Operación de ' + this.editedItem.type;
            }
            else {
                return ''
            }
        }
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
        selectedOption(newOption, oldOption) {
            // Realizar diferentes operaciones en función de la opción seleccionada
            switch (newOption) {
                case this.options[0]:
                    this.editedItem.type = 'Negocio';
                    this.editedItem.business_id = this.business_id;
                    this.editedItem.branch_id = '';
                    this.editedItem.enrollment_id = '';
                    this.selectedOption = 'Negocio';
                    this.results = [];
                    this.initialize();
                    break;
                case this.options[1]:
                    console.log(this.options[1]);
                    // Operaciones para la opción 2
                    this.editedItem.type = 'Sucursal'
                    this.editedItem.business_id = '';
                    this.editedItem.enrollment_id = '';
                    //this.editedItem.branch_id = parseInt(this.branches[0].id);
                    console.log(this.editedItem.branch_id);
                    console.log(this.editedItem.enrollment_id);
                    console.log(this.editedItem.business_id);
                    this.results = [];
                    //this.initialize();
                    break;
                case this.options[2]:
                    // Operaciones para la opción 3
                    this.editedItem.type = 'Academia'
                    this.editedItem.business_id = '';
                    this.editedItem.branch_id = '';
                    //this.editedItem.enrollment_id = parseInt(this.enrollments[0].id);
                    console.log(this.editedItem.branch_id);
                    console.log(this.editedItem.enrollment_id);
                    console.log(this.editedItem.business_id);
                    this.results = [];
                    //this.initialize();
                    break;
                case this.options[3]:
                    this.editedItem.type = 'Todas'
                    this.initialize();
                    break;
                default:
                    break;
            }
        }
    },

    mounted() {
        LocalStorageService.setIsLocked(true);
        this.business_id = parseInt(LocalStorageService.getItem('business_id'));
        this.charge_id = parseInt(LocalStorageService.getItem('charge_id'));
        this.branch_id = parseInt(LocalStorageService.getItem('branch_id'));
        this.charge = JSON.parse(LocalStorageService.getItem("charge"));
        axios
            .get('https://api2.simplifies.cl/api/finance-combined-data', {
                params: {
                    business_id: this.business_id
                }
            })
            .then((response) => {
                this.branches = response.data.branches;
                this.enrollments = response.data.enrollments;
                this.business = response.data.business;
                this.expenses = response.data.expenses;
                this.revenues = response.data.revenues;
                //this.branch_id = !this.branch_id ? this.branch_id : this.branches[0].id;
            }).finally(() => {
            LocalStorageService.setIsLocked(false);
        });
        // Obtener el año actual
        const currentYear = new Date().getFullYear();
        // Llenar el arreglo years con los años, desde 2010 hasta el año actual
        for (let year = 2023; year <= currentYear; year++) {
            this.years.push(year);
        }
        // Establecer el año actual como el seleccionado por defecto
        this.selectedYear = currentYear;
        if (this.charge === 'Administrador') {
            // Mostrar la fila con Autocomplete
            this.editedItem.type = 'Negocio';
            this.editedItem.business_id = parseInt(this.business_id);
            this.editedItem.branch_id = '';
            this.editedItem.enrollment_id = '';
            this.selectedOption = 'Negocio';
            this.mostrarFila = true;
        }
        else {
            this.editedItem.type = 'Sucursal';
            this.editedItem.business_id = '';
            this.editedItem.branch_id = parseInt(this.branch_id);
            this.editedItem.enrollment_id = '';
            this.selectedOption = 'Sucursal';
            this.mostrarFila = false;
            this.initialize();
        }
        console.log(this.charge_id);
    },

    methods: {
        getString(str) {
            // Encuentra la posición del primer espacio en la cadena
            const firstSpaceIndex = str.indexOf(' ');

            // Si se encuentra un espacio, devuelve la subcadena después del espacio
            if (firstSpaceIndex !== -1) {
                return str.substring(firstSpaceIndex + 1);
            }

            // Si no hay espacio, devuelve la cadena original
            return str;
        },
        filterResults(typeDetail) {
            this.search = typeDetail;
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
        selectBusiness() {
            this.editedItem.type = 'Negocio'
            this.editedItem.branch_id = '';
            this.editedItem.enrollment_id = '';
            console.log(this.editedItem.branch_id);
            console.log(this.editedItem.enrollment_id);
            console.log(this.editedItem.business_id);
            this.initialize();
        },
        selectBranches() {
            this.editedItem.type = 'Sucursal'
            this.editedItem.business_id = '';
            this.editedItem.enrollment_id = '';
            console.log(this.editedItem.branch_id);
            console.log(this.editedItem.enrollment_id);
            console.log(this.editedItem.business_id);
            this.initialize();
        },
        selectEnrollments() {
            this.editedItem.type = 'Academia'
            this.editedItem.business_id = '';
            this.editedItem.branch_id = '';
            console.log(this.editedItem.branch_id);
            console.log(this.editedItem.enrollment_id);
            console.log(this.editedItem.business_id);
            this.initialize();
        },
        openDoc(item) {
            const url = 'https://api2.simplifies.cl/api/images/' + item.file;
            window.open(url, '_blanK');
        },
        onFileSelected(event) {
            let file = event.target.files[0];
            this.editedItem.file = file;
            console.log(this.editedItem.file);
            //this.cargarImage(file);
        },
        editItem(item) {
            this.editedIndex = 1;
            this.editedItem = Object.assign({}, item);
            this.editedItem.revenue_id = item.revenue_id ? parseInt(item.revenue_id) : '';
            this.editedItem.expense_id = item.expense_id ? parseInt(item.expense_id) : '';
            this.editedItem.business_id = item.business_id ? parseInt(item.business_id) : '';
            this.editedItem.branch_id = item.branch_id ? parseInt(item.branch_id) : '';
            this.editedItem.enrollment_id = item.enrollment_id ? parseInt(item.enrollment_id) : '';
            this.editedItem.file = this.editedItem.file ? this.editedItem.file : item.file;
            console.log('this.editedItem seleccionado');
            console.log(this.editedItem);
            this.dialog = true
        },
        showAlert(sb_type, sb_message, sb_timeout) {
            this.sb_type = sb_type

            if (sb_type == "success") {
                this.sb_title = 'Éxito'
                this.sb_icon = 'mdi-check-circle'
            }

            if (sb_type == "error") {
                this.sb_title = 'Error'
                this.sb_icon = 'mdi-check-circle'
            }

            if (sb_type == "warning") {
                this.sb_title = 'Advertencia'
                this.sb_icon = 'mdi-alert-circle'
            }
            this.sb_message = sb_message
            this.sb_timeout = sb_timeout
            this.snackbar = true
        },
        initialize() {
            LocalStorageService.setIsLocked(true);
            //const token = LocalStorageService.getItem('token');
            this.totalIngresos = 0;
            this.totalGastos = 0;
            this.loading = true;
            console.log('this.editedItem--------');
            console.log(this.editedItem);
            axios
                .get('https://api2.simplifies.cl/api/finance-show', {
                    /*headers: {
                'Authorization': `Bearer ${token.replace(/['"]+/g, '')}`
            },*/
                    params: {
                        branch_id: this.editedItem.branch_id,
                        business_id: this.editedItem.business_id,
                        enrollment_id: this.editedItem.enrollment_id,
                        type: this.editedItem.type,
                        year: this.selectedYear,
                        mounth: this.selectedMounth
                    }
                })
                .then((response) => {
                    this.results = response.data.finances;

                    this.editedItem.control = this.results.length !== 0 ? this.results[0].control + 1 : 1;
                    
                    //this.visibility = !this.editedItem.control ? false : true;

                    //this.editedItem.control = !this.results ? 0 : this.results[0].control + 1 ;// Obtener el numero de control realizado
                    /*if (!this.editedItem.control) {
                        console.log('es cero');
                        this.visibility = true;
                    }*/
                    //console.log('this.results');
                    //console.log(this.results);
                    /*console.log('this.editedItem.control');
                    console.log(this.editedItem.control);*/
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.loading = false;
                    this.totalIngresos = this.results.reduce((total, item) => {
                        // Verifica si el campo "revenue" tiene un valor numérico
                        if (typeof item.revenue === 'number') {
                            // Suma el valor de "revenue" al total
                            return total + item.revenue;
                        } else {
                            // Si el campo "revenue" no es un número, no suma nada
                            return total;
                        }
                    }, 0);
                    this.totalGastos = this.results.reduce((total, item) => {
                        // Verifica si el campo "revenue" tiene un valor numérico
                        if (typeof item.expense === 'number') {
                            // Suma el valor de "revenue" al total
                            return total + item.expense;
                        } else {
                            // Si el campo "revenue" no es un número, no suma nada
                            return total;
                        }
                    }, 0);

                    //Ingreso Productos
                    this.ingresoProducts = this.results.reduce((total, item) => {
                        // Verifica si el campo "revenue" tiene un valor numérico
                        if (item.typeDetail === 'Ingreso Producto') {
                            // Suma el valor de "revenue" al total
                            return total + item.amount;
                        } else {
                            // Si el campo "revenue" no es un número, no suma nada
                            return total;
                        }
                    }, 0);

                    //GAsto Productos
                    this.gastoProducts = this.results.reduce((total, item) => {
                        // Verifica si el campo "revenue" tiene un valor numérico
                        if (item.typeDetail === 'Gasto Producto') {
                            // Suma el valor de "revenue" al total
                            return total + item.amount;
                        } else {
                            // Si el campo "revenue" no es un número, no suma nada
                            return total;
                        }
                    }, 0);
                    //GAsto Servicio Propina
                    this.gastoServices = this.results.reduce((total, item) => {
                        // Verifica si el campo "revenue" tiene un valor numérico
                        if (item.typeDetail === 'Gasto Servicio' || item.typeDetail === 'Gasto Propina') {
                            // Suma el valor de "revenue" al total
                            return total + item.amount;
                        } else {
                            // Si el campo "revenue" no es un número, no suma nada
                            return total;
                        }
                    }, 0);
                    //Ingreso Servicio Propina
                    this.ingresoServices = this.results.reduce((total, item) => {
                        // Verifica si el campo "revenue" tiene un valor numérico
                        if (item.typeDetail === 'Ingreso Servicio' || item.typeDetail === 'Ingreso Propina') {
                            // Suma el valor de "revenue" al total
                            return total + item.amount;
                        } else {
                            // Si el campo "revenue" no es un número, no suma nada
                            return total;
                        }
                    }, 0);
                    this.utilidades = this.totalIngresos - this.totalGastos;
                });
        },

        deleteItem(item) {
            this.editedItem.id = item.id;
            this.dialogDelete = true;
            console.log('item');
            console.log(this.editedItem);
        },
        deleteItemConfirm() {
            LocalStorageService.setIsLocked(true);
            this.data.id = this.editedItem.id;
            axios
                .post('https://api2.simplifies.cl/api/finance-destroy', this.data)
                .then(() => {
                    this.file = '';
                }).finally(() => {
                    this.showAlert("success", "Operación eliminada correctamente", 3000);
                    //this.initialize();
                    LocalStorageService.setIsLocked(false);
                });
            this.closeDelete()
        },
        close() {

            console.log('this.type');
            console.log(this.selectedOption);
            this.dialog = false;
            this.file = '';
            this.editedItem.amount = '';
            this.editedItem.comment = '';
            this.editedItem.file = '';
            this.editedItem.expense_id = '';
            this.editedItem.revenue_id = '';
            this.editedItem.id = '';
            //this.selectedOption = 'Negocio',
            //this.initialize();
        },
        closeDelete() {
            this.dialogDelete = false;

            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
            });
            this.file = '';
            //this.initialize();
        },
        save() {
            LocalStorageService.setIsLocked(true);
            if (this.editedIndex > -1) {
                this.valid = false;
                //this.editedItem.branch_id = this.branch_id;  
                const formData = new FormData();
                for (let key in this.editedItem) {
                    formData.append(key, this.editedItem[key]);
                }

                console.log('formData');
                console.log(formData);
                axios
                    .post('https://api2.simplifies.cl/api/finance-updated', formData)
                    .then(() => {
                        this.editedIndex = -1
                        this.editedItem.amount = '',
                            this.editedItem.comment = '',
                            this.editedItem.file = '',
                            this.editedItem.expense_id = '',
                            this.editedItem.revenue_id = '',
                            this.editedItem.id = '',
                            this.file = '';
                    }).finally(() => {
                        LocalStorageService.setIsLocked(false);
                        this.showAlert("success", "Operación editada correctamente", 3000);
                        this.initialize();
                    });
            } else {
                this.valid = false;
                //this.editedItem.branch_id = this.branch_id;
                console.log('this.editedItem');
                console.log(this.editedItem);
                const formData = new FormData();
                for (let key in this.editedItem) {
                    formData.append(key, this.editedItem[key]);
                }
                console.log('formData');
                console.log(formData);
                axios
                    .post('https://api2.simplifies.cl/api/finance', formData)
                    .then(() => {
                        this.editedIndex = -1;
                        this.editedItem.amount = '',
                            this.editedItem.comment = '',
                            this.editedItem.file = '',
                            this.editedItem.expense_id = '',
                            this.editedItem.revenue_id = '',
                            this.editedItem.id = '',
                            this.file = '';
                    }).finally(() => {
                        LocalStorageService.setIsLocked(false);
                        this.showAlert("success", "Registro de operación creado correctamente", 3000);
                        this.initialize();
                    });
                //})
            }
            this.close()
        },
    },
}
</script>
