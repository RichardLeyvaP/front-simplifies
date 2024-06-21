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
    <v-card elevation="6" class="mx-5">
        <v-toolbar color="#F18254">
            <v-row align="center">
                <v-col cols="12" md="6" class="grow ml-2">
                    <span class="text-subtitle-1"> <strong>Pago a Cajero (a)</strong></span>
                </v-col>
                <v-col cols="12" md="5" class="text-right">

                    <v-btn class="text-subtitle-1  ml-1" color="#E7E9E9" variant="flat" elevation="2"
                        prepend-icon="mdi-account-cash" @click="showPay">
                        Pagos realizados
                    </v-btn>
                    <v-btn class="text-subtitle-1  ml-1 " color="#E7E9E9" variant="flat" elevation="2"
                        prepend-icon="mdi-plus-circle" @click="showAddOperationTip()">
                        Nuevo Pago
                    </v-btn>
                    <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
                        <v-card>
                            <v-toolbar color="#F18254">
                                <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
                            </v-toolbar>
                            <v-card-text>
                                <v-form ref="form" v-model="valid" enctype="multipart/form-data">
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-autocomplete :no-data-text="'No hay datos disponibles'"
                                                    v-model="branch_id" :items="branches" v-if="this.mostrarFila"
                                                    clearable label="Seleccione una Sucursal" prepend-icon="mdi-store"
                                                    item-title="name" item-value="id" variant="underlined"
                                                    @update:model-value="showAddOperationTip()"></v-autocomplete>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-autocomplete :no-data-text="'No hay datos disponibles'"
                                                    v-model="professional_id" :items="professionals" clearable
                                                    label="Seleccione un cajero (a)"
                                                    prepend-icon="mdi-account-tie-outline" item-title="name"
                                                    item-value="id" variant="underlined"
                                                    :rules="selectRules"></v-autocomplete><!--@update:model-value="carsEarrings()"-->
                                            </v-col>
                                            <v-col cols="12" md="3">
                                                <v-select label="Tipo de pago" v-model="editedItem.type"
                                                    :items="['Adelanto', 'Quincena', 'Mes']"
                                                    :item-value="['Adelanto', 'Quincena', 'Mes']" variant="underlined"
                                                    :rules="selectRules"
                                                    prepend-icon="mdi-check-circle"></v-select><!--:disabled="!this.mostrarType"-->
                                            </v-col>
                                            <v-col cols="12" md="3">
                                                <v-card class="mx-auto" max-width="344" title="Monto a Pagar"
                                                    :subtitle="totalMount()" append-icon="mdi-check">

                                                    <template v-slot:prepend>
                                                        <v-avatar color="blue-darken-2">
                                                            <v-icon icon="mdi-currency-usd"></v-icon>
                                                        </v-avatar>
                                                    </template>
                                                </v-card>
                                                <v-text-field v-model="editedItem.amount" clearable label="Monto"
                                                    v-show="false" prepend-icon="mdi-cash" variant="underlined"
                                                    :rules="pago">
                                                </v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>

                                            <v-col cols="12" md="12">
                                                <v-text-field class="mt-1 mb-1" v-model="search2"
                                                    append-icon="mdi-magnify" label="Buscar" single-line
                                                    hide-details></v-text-field>
                                                <v-data-table v-model="selected2" :headers="headers2"
                                                    :items-per-page-text="'Elementos por páginas'" :search="search2"
                                                    :items="cars" class="elevation-1"
                                                    no-results-text="No hay datos disponibles"
                                                    no-data-text="No hay datos disponibles" show-select :loading="loadingCashier" loading-text="Cargando datos...">
                                                    <template v-slot:item.clientName="{ item }">

                                                        <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                                                            <v-img
                                                                :src="'https://api2.simplifies.cl/api/images/' + item.client_image"
                                                                alt="image"></v-img>
                                                        </v-avatar>
                                                        {{ item.clientName }}
                                                    </template>
                                                </v-data-table>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                    <v-divider></v-divider>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="#E7E9E9" variant="flat" @click="close">
                                            Cancelar
                                        </v-btn>
                                        <v-btn color="#F18254" variant="flat" @click="save" :disabled="!valid">
                                            Pagar
                                        </v-btn>
                                    </v-card-actions>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>

                            <v-toolbar color="red">
                                <span class="text-subtitle-2 ml-4"> Eliminar Pago a Profesional</span>
                            </v-toolbar>

                            <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el pago al profesional?</v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="#E7E9E9" variant="flat" @click="closeDelete">
                                    Cancelar
                                </v-btn>
                                <v-btn color="#F18254" variant="flat" @click="deleteItemConfirm">
                                    Aceptar
                                </v-btn>

                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-col>
            </v-row>
        </v-toolbar>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="12" md="4">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches"
                        v-if="this.mostrarFila" clearable label="Seleccione una Sucursal" prepend-icon="mdi-store"
                        item-title="name" item-value="id" variant="underlined"
                        @update:model-value="initialize()"></v-autocomplete>
                </v-col>
            </v-row>
            <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                hide-details></v-text-field>
            <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :search="search"
                :items="results" class="elevation-1" no-results-text="No hay datos disponibles"
                no-data-text="No hay datos disponibles" :loading="loadingPCashier" loading-text="Cargando datos...">
                <template v-slot:item.amount="{ item }"> {{
                    formatNumber(item.amount)}}
                </template>
                <template v-slot:item.nameClient="{ item }">

                    <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                        <v-img :src="'https://api2.simplifies.cl/api/images/' + item.client_image" alt="image"></v-img>
                    </v-avatar>
                    {{ item.nameClient }}
                </template>
                <template v-slot:item.nameProfessional="{ item }">

                    <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                        <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_url" alt="image"></v-img>
                    </v-avatar>
                    {{ item.nameProfessional }}
                </template>
                <template v-slot:item.actions="{ item }">
                    <!--<v-btn density="comfortable" icon="mdi-pencil" @click="editItem(item)" color="primary"
                        variant="tonal" elevation="1" class="mr-1 mt-1 mb-1" title="Editar Pago a profesional"></v-btn>-->
                    <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="red-darken-4"
                        variant="tonal" elevation="1" title="Eliminar Pago a profesional"></v-btn>
                    <!--<v-icon size="25" color="blue" class="me-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon size="25" color="red" @click="deleteItem(item)">
              mdi-delete
            </v-icon>-->
                </template>
            </v-data-table>

            <!--Pagos realizados-->
            <v-dialog v-model="dialogPay" fullscreen transition="dialog-bottom-transition">
                <v-card>
                    <v-toolbar color="#F18254">
                        <v-container>
                            <v-row align="center">
                                <v-col cols="12" md="8" class="grow ml-4">
                                    <span class="text-h8"> <strong>Pagos realizados a cajero (a)</strong></span>
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
                    <v-card-text class="mt-2 mb-2">
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
                                                color="orange lighten-2" :modelValue="getDate"
                                                @update:model-value="updateDate" format="yyyy-MM-dd"
                                                :max="dateFormatted2"></v-date-picker>
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
                                                color="orange lighten-2" :modelValue="getDate2"
                                                @update:model-value="updateDate2" format="yyyy-MM-dd"
                                                :min="dateFormatted"></v-date-picker>
                                        </v-locale-provider>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" sm="12" md="3">
                                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id"
                                        :items="branches" label="Seleccione una Sucursal" prepend-inner-icon="mdi-store"
                                        item-title="name" item-value="id"
                                        variant="outlined"></v-autocomplete><!--@update:model-value="initialize()"-->
                                </v-col>
                                <v-col cols="12" md="1">
                                    <v-btn icon @click="showPay()" color="#F18254">
                                        <v-icon>mdi-magnify</v-icon></v-btn>
                                </v-col>
                                <v-col cols="12">
                                    <v-container>
                                        <v-alert border type="info" variant="outlined" density="compact">
                                            <p>Pagos Realizados a cajero(a)s</p>
                                        </v-alert>
                                    </v-container>
                                    <v-card-text>
                                        <v-text-field class="mt-1 mb-1" v-model="search2" append-icon="mdi-magnify"
                                            label="Buscar" single-line hide-details>
                                        </v-text-field>
                                        <v-data-table :headers="headers1" :items-per-page-text="'Elementos por páginas'"
                                            :items="results1" :search="search2" class="elevation-2"
                                            no-results-text="No hay datos disponibles"
                                            no-data-text="No hay datos disponibles" :loading="loadingPay" loading-text="Cargando datos...">
                                            <template v-slot:item.nameProfessional="{ item }">
                                                <span :class="{ 'bold-row': item.nameProfessional == 'Total' }">
                                                    {{ item.nameProfessional }}
                                                </span>
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
                        <v-btn color="#E7E9E9" variant="flat" @click="closeDialogPay">
                            Volver
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card-text>
    </v-card>
</template>

<script>

import axios from "axios";
import { format } from "date-fns";
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
        loadingCashier: true,
        loadingPCashier: true,
        loadingPay: true,
        valid: true,
        snackbar: false,
        sb_type: '',
        sb_message: '',
        sb_timeout: 2000,
        sb_title: '',
        sb_icon: '',
        branch_id: '',
        charge: '',
        business_id: '',
        branches: [],
        cars: [],
        results1: [],
        search: '',
        search2: '',
        mostrarFila: false,
        dialog: false,
        mostrarCars: false,
        dialogDelete: false,
        dialogPay: false,
        menu: false,
        menu2: false,
        menu3: false,
        input: null,
        input2: null,
        //mostrarType: true,
        headers: [
            { title: 'Nombre del profesional', key: 'nameProfessional' },
            { title: 'Fecha del pago', key: 'date' },
            { title: 'Tipo de Pago', key: 'type' },
            { title: 'Monto pagado', key: 'amount' },
            { title: 'Acciones', key: 'actions' },
        ],
        headers1: [
            { title: 'Nombre del profesional', key: 'nameProfessional' },
            { title: 'Fecha del pago', key: 'date' },
            { title: 'Tipo de Pago', key: 'type' },
            { title: 'Monto pagado', key: 'amount' },
            { title: 'Monto café', key: 'coffe_percent' }
        ],
        results: [],
        //selectedOption: '',
        //options: ['Adelanto', 'Quincena', 'Mes'],
        professionals: [],
        professional_id: '',
        selected: [],
        editedIndex: -1,

        editedItem: {
            id: '',
            nameProfessional: '',
            type: '',
            amount: '',
            coffe_percent: ''
        },
        data: {},

        defaultItem: {
            id: '',
            nameProfessional: '',
            type: '',
            amount: '',
            coffe_percent: ''
        },
        nameRules: [
            (v) => !!v || "El campo es requerido",
        ],
        pago: [
            (value) => /^\d+(\.\d+)?$/.test(value) || "Debe ser un número con punto decimal (10.00)",
            (value) => !!value || 'Campo requerido',
            (value) => !value || !isNaN(parseFloat(value)) || 'Debe ser un número'],
        selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
        selected2: [],
        headers2: [
            { title: 'ID', align: 'start', key: 'id' },
            { title: 'Nombre Cliente', align: 'end', key: 'clientName' },
            { title: 'Nombre Profesional', align: 'end', key: 'professionalName' },
            { title: 'Fecha', align: 'end', key: 'data' },
            { title: 'Propina', align: 'end', key: 'tip' },
            { title: 'Propina 10% Cajero (a)', align: 'end', key: 'tipCashier' },
            { title: 'Propina 10% Café', align: 'end', key: 'tipCoffe' },
        ],
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo Pago a cajero (a)' : 'Editar Pago a cajero (a)'
        },
        ironValues() {
            return this.selected2.map(selection => selection.id);
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
        /*dialog(val) {
            val || this.close();
        },*/
        dialogDelete(val) {
            val || this.closeDelete()
        },
        selected2(newVal) {
            if (newVal.length == 0) {
                // Si selected2 cambia a null, establecer editedItem.amount en cero
                this.editedItem.amount = '';
            }
        }
    },

    mounted() {
        this.business_id = LocalStorageService.getItem('business_id');
        this.branch_id = LocalStorageService.getItem('branch_id');
        this.charge_id = LocalStorageService.getItem('charge_id');
        this.charge = JSON.parse(LocalStorageService.getItem("charge"));
        LocalStorageService.setIsLocked(true);
        axios
            .get('https://api2.simplifies.cl/api/show-business', {
                params: {
                    business_id: this.business_id
                }
            })
            .then((response) => {
                this.branches = response.data.branches;
                //this.branch_id = !this.branch_id ? this.branch_id : this.branches[0].id;

            }).finally(() => {
                LocalStorageService.setIsLocked(false);
                if (this.charge === 'Administrador') {
                    this.branch_id = this.branches[0].id;
                    this.mostrarFila = true;
                }
                this.initialize()
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
        updateDate(val) {
            this.input = val;
            this.menu = false;
        },
        updateDate2(val) {
            this.input2 = val;
            this.menu2 = false;
        },
        totalMount() {
            let selectedItems;
            if (this.selected2.length == 0) {
                return this.cars.reduce((total, item) => {
                    // Asegúrate de que item.totalServices y item.tip sean números
                    //const totalServices = Number(item.totalServices) || 0;
                    const tip = Number(item.tipCashier) || 0;
                    //this.editedItem.amount = total + totalServices + tip;
                    return total + tip;
                }, 0);
            } else {
                // Mapea los IDs de selected2 a los objetos correspondientes en cars
                selectedItems = this.selected2.map(selectedId => this.cars.find(car => car.id === selectedId));
                // Calcula el total sumando totalServices y tip de los elementos seleccionados
                return selectedItems.reduce((total, item) => {
                    // Asegúrate de que item.totalServices y item.tip sean números
                    //const totalServices = Number(item.totalServices) || 0;
                    const tip = Number(item.tipCashier) || 0;
                    this.editedItem.amount = total + tip;
                    this.editedItem.coffe_percent = total + tip;
                    return total + tip;
                }, 0);
            }

        },

        /*professionalChange(){
            this.chargeProfessional = this.professionals.find(professional => professional.id == this.professional_id);
            console.log('this.chargeProfessional');
            console.log(this.chargeProfessional);
        },*/
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
            this.loadingPCashier = true;
            LocalStorageService.setIsLocked(true);
            this.professionals = [];
            this.professional_id = '';

            axios
                .get('https://api2.simplifies.cl/api/operation-tip-show', {
                    params: {
                        branch_id: this.branch_id
                    }
                })
                .then((response) => {
                    this.results = response.data;
                }).finally(() => {
            LocalStorageService.setIsLocked(false);
            this.loadingPCashier = false;
        });
            /*axios
                .get('https://api2.simplifies.cl/api/cashier-car-notpay', {
                    params: {
                        branch_id: this.branch_id
                    }
                })
                .then((response) => {
                    this.cars = response.data;
                    console.log('this.cars');
                    console.log(this.cars);
                });*/

        },
        showAddOperationTip() {
            this.loadingCashier = true;
            LocalStorageService.setIsLocked(true);
            axios
                .get('https://api2.simplifies.cl/api/cashier-car-notpay', {
                    params: {
                        branch_id: this.branch_id
                    }
                })
                .then((response) => {
                    this.cars = response.data.cars;
                    this.professionals = response.data.professionals
                    this.loadingCashier = false;
                }).finally(() => {
            LocalStorageService.setIsLocked(false);
        });

            /*axios
            .get('https://api2.simplifies.cl/api/branch_professionals_cashier', {
                params: {
                    branch_id: this.branch_id
                }
            })
            .then((response) => {
                this.professionals = response.data.professionals;
            });*/
            this.dialog = true;
        },
        /*editItem(item) {
            axios
                .get('https://api2.simplifies.cl/api/cashier-car-notpay', {
                    params: {
                        branch_id: this.branch_id
                    }
                })
                .then((response) => {
                    this.cars = response.data;
                });
            this.editedIndex = 1;
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },*/
        deleteItem(item) {
            this.editedIndex = -1;
            this.editedItem.id = item.id;
            this.dialogDelete = true;
        },
        deleteItemConfirm() {
            LocalStorageService.setIsLocked(true);
            //this.results.splice(this.editedIndex, 1)
            let request = {
                id: this.editedItem.id
            };
            axios
                .post('https://api2.simplifies.cl/api/operation-tip-destroy', request)
                .then(() => {
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.showAlert("success", "Pago eliminado correctamente", 3000);
                    this.initialize();
                });
            this.closeDelete()
        },
        close() {
            this.dialog = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            });
            this.editedIndex = -1;
            //this.selectedOption = null;
            this.cars = [];
            this.selected2 = [];
            this.professional_id = '';
            this.mostrarCars = false;
            this.initialize();
        },
        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1;
                this.cars = [];
                this.selected = [];
                this.professional_id = '';
                this.mostrarCars = false;
            });

        },
        save() {
            LocalStorageService.setIsLocked(true);
            this.valid = false;
            /* if (this.editedIndex > -1) {
                 this.data.id = this.editedItem.id;
                 this.data.name = this.editedItem.name;
                 axios
                     .put('https://api2.simplifies.cl/api/workplace', this.data)
                     .then(() => {
                         this.initialize();
                         this.showAlert("success", "Pago editado correctamente", 3000);
                     })
             } else {*/
            console.log('this.ironValues');
            console.log(this.selected2);
            //console.log(this.selectedOption);
            console.log(this.selected);
            //const newArrayCar = this.selected.map(item => parseInt(item)); // Convertir a enteros si es necesario
            //console.log('newArrayCar');
            //console.log(newArrayCar);
            this.data.professional_id = this.professional_id;
            this.data.branch_id = this.branch_id;
            this.data.car_ids = this.selected2;
            this.data.amount = this.editedItem.amount;
            this.data.coffe_percent = this.editedItem.coffe_percent;
            this.data.type = this.editedItem.type;
            console.log('this.data');
            console.log(this.data);
            axios
                .post('https://api2.simplifies.cl/api/operation-tip', this.data)
                .then(() => {
                    this.$nextTick(() => {
                        this.editedItem = Object.assign({}, this.defaultItem);
                    });
                    this.editedIndex = -1;
                    this.type = null;
                    this.cars = [];
                    this.selected2 = [];
                    this.professional_id = '';
                    this.mostrarCars = false;
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.showAlert("success", "Pago realizado correctamente", 3000);
                    this.updatedBranch();
                });
            //}
            /*this.valid = false;
            this.data.name = this.editedItem.name;
            this.data.branch_id = this.branch_id

            axios
                .post('https://api2.simplifies.cl/api/workplace', this.data)
                .then(() => {
                    this.initialize();
                    this.showAlert("success", "Puesto de trabajo editado correctamente", 3000);
                })*/
            this.close();
        },
        //reporte
        showPay() {
            this.loadingPay = true;
            LocalStorageService.setIsLocked(true);
            console.log('Entra aqui a pagos realizados');
            //this.editedIndex1 = 1;
            //this.state=true;
            //this.input2 = new Date();
            //this.input3 = new Date()
            const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
            const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
            axios
                .get('https://api2.simplifies.cl/api/operation-tip-periodo', {
                    params: {
                        branch_id: this.branch_id,
                        startDate: startDate,
                        endDate: endDate
                    }
                })
                .then((response) => {
                    this.results1 = response.data;
                }).finally(() => {
            LocalStorageService.setIsLocked(false);
            this.loadingPay = false;
        });
            this.dialogPay = true;
        },
        closeDialogPay() {
            this.dialogPay = false;
            //this.initialize();
        },
        /*updateDate3() {
            console.log('Entra aqui a pagos realizados');
            //this.editedIndex1 = 1;
            //this.state=true;
            //this.input2 = new Date();
            //this.input3 = new Date()
            const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
            const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
            axios
                .get('https://api2.simplifies.cl/api/operation-tip-periodo', {
                    params: {
                        branch_id: this.branch_id,
                        startDate: startDate,
                        endDate: endDate
                    }
                })
                .then((response) => {
                    this.results1 = response.data;
                });
            this.dialogPay = true;
        },*/
        exportToExcel() {
            console.log('Entra aqui a exportar');
            // Primero, prepara una matriz que contendrá todas las filas de datos, incluidos los encabezados
            let rows = [];

            // Construye un objeto para los encabezados basado en la estructura de 'headers'
            let headerRow = {};
            this.headers1.forEach(header => {
                headerRow[header.key] = header.title; // Usa 'key' para el mapeo y 'title' para el texto del encabezado
            });
            rows.push(headerRow);

            // Ahora, mapea los datos de los items para que coincidan con los encabezados
            this.results1.forEach(item => {
                let rowData = {};
                this.headers1.forEach(header => {
                    rowData[header.key] = item[header.key] || ''; // Asegura que cada celda se mapee correctamente; usa '' para datos faltantes
                });
                rows.push(rowData);
            });

            let nameReport = {
                // eslint-disable-next-line vue/no-use-computed-property-like-method
                nameProfessional: 'Pagos realizados a cajero(a)s', // Asume que 'name' es una de tus claves; ajusta según sea necesario
                date: '',
                type: '',
                amount: ''
            };
            rows.push(nameReport);

            // Convierte la matriz de filas en una hoja de trabajo Excel
            const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true }); // 'skipHeader: true' porque ya agregamos manualmente los encabezados

            // Crea un nuevo libro de trabajo y añade la hoja de trabajo con los datos
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Report" + format(new Date(), "yyyy-MM-dd"));

            // Escribe el libro de trabajo a un archivo y desencadena la descarga
            //XLSX.writeFile(wb, "report.xlsx");
            XLSX.writeFile(wb, `report_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
        },
    },

}
</script>
<style>
.selected-item {
    background-color: orange !important;
}

/* Espacio entre los items */
.list-item-spacing {
    margin-bottom: 8px;
    /* Ajusta según necesites */
}

.bold-row {
    font-weight: bold;
}
</style>