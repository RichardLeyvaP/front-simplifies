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
    <v-container style="min-width: 100%; max-height: 100%;">
        <v-card elevation="6" class="mx-4" width='auto'>
            <v-toolbar color="#F18254">
                <v-row align="center">
                    <v-col cols="12" md="7" class="ml-4">
                        <span class="text-subtitle-1"> <strong>Comisión de propinas</strong></span>
                    </v-col>
                    <v-col cols="12" md="4" class="text-right ml-12">
                        <!--<v-btn class="text-subtitle-1" variant="flat" elevation="2"
                            prepend-icon="mdi-plus-circle" @click="showAddAdvance" :disabled="this.canAdvanceToday">
                            Solicitar Adelanto
                        </v-btn>-->
                        </v-col>

                </v-row>

            </v-toolbar>
            <v-row dense class="ml-5 mt-5">
                <v-col cols="12" md="3" v-if="this.mostrarFila">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches"
                        label="Seleccione una Sucursal" prepend-icon="mdi-store" item-title="name" item-value="id"
                        variant="underlined"></v-autocomplete>
                </v-col>
                <v-col cols="12" md="2">
                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                        transition="scale-transition" offset-y min-width="290px">
                        <template v-slot:activator="{ props }">
                            <v-text-field v-bind="props" :modelValue="dateFormatted" variant="underlined"
                                prepend-icon="mdi-calendar" label="Fecha de inicio"></v-text-field>
                        </template>
                        <v-locale-provider locale="es">
                            <v-date-picker header="Calendario" title="Seleccione la fecha" color="#F18254"
                                :modelValue="input" @update:model-value="updateDate"
                                format="yyyy-MM-dd"></v-date-picker>
                        </v-locale-provider>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="2">
                    <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                        transition="scale-transition" offset-y min-width="290px">
                        <template v-slot:activator="{ props }">
                            <v-text-field v-bind="props" :modelValue="dateFormatted1" variant="underlined"
                                prepend-icon="mdi-calendar" label="Fecha Terminación"></v-text-field>
                        </template>
                        <v-locale-provider locale="es">
                            <v-date-picker header="Calendario" title="Seleccione la fecha" color="#F18254"
                                :modelValue="input2" format="yyyy-MM-dd" :min="dateFormatted"
                                @update:model-value="updateDate1"></v-date-picker><!--@update:model-value="updateDate2"-->
                        </v-locale-provider>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="1">
                    <v-btn icon @click="products()" color="#F18254">
                        <v-icon>mdi-magnify</v-icon></v-btn>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col cols="12">
                    <v-card-text>
                        <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar"
                            single-line hide-details></v-text-field>
                        <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="results"
                            :search="search" class="elevation-1" style="max-height: 55vh; overflow-y: auto;"
                            no-data-text="No hay datos disponibles" no-results-text="No hay datos disponibles"
                            :loading="loadingrules" loading-text="Cargando datos...">
                            <template v-slot:item.professionalName="{ item }">
                                <v-avatar class="mr-1" elevation="3" color="grey-lighten-4" size="small">
                                    <v-img :src="`${this.$axios.defaults.baseURL}images/${item.image_url}`"
                                        alt="image"></v-img>
                                </v-avatar><!--+'?$'+Date.now()-->
                                {{ item.professionalName }}
                            </template>
                            <template v-slot:item.clientName="{ item }">
                                <v-avatar class="mr-1" elevation="3" color="grey-lighten-4" size="small">
                                    <v-img :src="`${this.$axios.defaults.baseURL}images/${item.client_image}`"
                                        alt="image"></v-img>
                                </v-avatar><!--+'?$'+Date.now()-->
                                {{ item.clientName }}
                            </template>
                            <template v-slot:item.commission_amount="{ item }">
                                {{ formatNumber(item.commission_amount) }}
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-col>
            </v-row>
        </v-card>
    </v-container> 
</template>
<script>

import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api";

export default {
    data: () => ({
        loadingrules: true,
        valid: true,
        mover: true,
        mostrarFila: false,
        snackbar: false,
        sb_type: '',
        sb_message: '',
        sb_timeout: 2000,
        sb_title: '',
        sb_icon: '',
        dialog: false,
        branch_id: '',
        charge: '',
        date: null,
        endDate: null,
        business_id: '',
        search: '',
        search2: '',
        file: null,
        imgMiniatura: '',
        showType: true,
        dialogPhoto: false,
        loadingImage: false,
        loadingSave: false,
        selectedImageUrl: '',
        message_delete: true,
        dialogDelete: false,
        canAdvanceToday: false,
        dialogSolicitud: false,
        totalSales: null,
        totalOrders: null,
        totalAdvance: null,
        totalService: null,
        salesIds: [],
        totalTip: null,
        totalPurchase: null,
        carIds: [],
        tipIds: [],
        advanceIds: [],
        orderIds: [],
        purchaseIds: [],
        salary: null,
        totalMount: null,
        headers: [
        { title: 'Fecha', value: 'data', sortable: true },
        { title: 'Producto', value: 'name', sortable: true },
        { title: 'Cantidad', value: 'cant', sortable: true },
        //{ title: 'Tipo de Venta', value: 'type', sortable: true },
        //{ title: 'Importe', value: 'price', sortable: true },
        { title: 'Comisión Generada', value: 'commission_amount', sortable: true },
        ],
        results: [],
        rules: [],
        statusOptions: [
            { text: 'Pendiente', value: 'Pendiente' },
            { text: 'Aprobado', value: 'Aprobado' },
            { text: 'Pagado', value: 'Pagado' }
        ],
        branches: [],
        editedIndex: -1,
        editedItem: {
            id: '',
            status: '',
            receipt: '',
            amount: '',
            data: ''
        },
        data: {},
        defaultItem: {
            id: '',
            status: '',
            receipt: '',
            amount: '',
            data: ''
        },
        originalItem: {
            id: '',
            status: '',
            receipt: '',
            amount: '',
            data: ''
        },
        menu: false,
        menu2: false,
        menu3: false,
        input: null,
        input2: null,
        input3: null,
        professional_id: null,
        selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    }),

    computed: {
        amountFormatted: {
        get() {
        return this.formatNumberInput(this.editedItem.amount)
        },
        set(value) {
        this.editedItem.amount = this.parseNumberInput(value)
        }
        },
        dateFormatted() {
            const date = this.input ? new Date(this.input) : new Date();
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        },
        dateFormatted1() {
            const date = this.input2 ? new Date(this.input2) : new Date();
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        },
        dateFormatted3() {
            const date = this.input3 ? new Date(this.input3) : new Date();
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        },
        getDate() {
            return this.input ? new Date(this.input).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        },
        getDate2() {
            return this.input2 ? new Date(this.input2).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        },
        getDate3() {
            return this.input3 ? new Date(this.input3).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        },
        shouldShowAdvanceButton() {
            return !this.mostrarFila && this.cantAdvanceToday;
        },
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
    },

    async mounted() {
        this.business_id = LocalStorageService.getItem('business_id');
        this.charge_id = LocalStorageService.getItem('charge_id');
        this.charge = JSON.parse(LocalStorageService.getItem("charge"));
        this.branch_id = LocalStorageService.getItem('branch_id');
        this.charge = JSON.parse(LocalStorageService.getItem("charge"));
        LocalStorageService.setIsLocked(true);
        const requestParams = {
            business_id: this.business_id
        };
        try {
            const result = await handleRequest({
                endpoint: 'show-business',
                method: 'GET',
                params: requestParams // Aquí pasas los parámetros
            });

            if (result.success) {
                // Si la solicitud es exitosa, asignamos las sucursales
                this.branches = result.data.branches;
            } else {
                // Si no hay datos, asignamos un array vacío
                this.branches = [];
            }
        } catch (error) {
            this.branches = [];
            // Captura de errores no controlados
            this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
        } finally {
            if (this.charge === 'Administrador') {
                this.branch_id = this.branches[0].id;
                this.mostrarFila = true;
            }
            /*if (this.charge === "Administrador") {          
            this.professional_id = null;
            }else{      */
            this.professional_id = LocalStorageService.getItem('professional_id');
            //}
            await this.initialize();
        }
    },

    methods: {
        formatNumberInput(value) {
            if (!value) return ''
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
        
        // Parsea el número para guardarlo sin formato
        parseNumberInput(formattedValue) {
            if (!formattedValue) return null
            return Number(formattedValue.toString().replace(/\./g, ''))
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
        updateDate(val) {
            this.input = val;
            this.date = this.dateFormatted;
            this.menu = false;
        },
        updateDate1(val) {
            this.input2 = val;
            this.endDate = this.dateFormatted1;
            this.menu2 = false;
        },
        updateDate3(val) {
            this.input3 = val;
            this.editedItem.data = this.dateFormatted3;
            this.menu3 = false;
        },
        async initialize() {
            this.loadingrules = true;
            LocalStorageService.setIsLocked(true);
            const requestParams = {
                branch_id: this.branch_id,
                professional_id: this.professional_id,
                charge: this.charge
                //data: this.date ? format(new Date(this.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
            };
            try {
                const result = await handleRequest({
                    endpoint: 'professional-branch-products',
                    method: 'GET',
                    params: requestParams // Aquí pasas los parámetros
                });

                if (result.success) {
                    // Si la solicitud es exitosa, asignamos las sucursales
                    this.results = result.data.products.products_sold;
                    //}
                } else {
                    this.loadingrules = false;
                    LocalStorageService.setIsLocked(false);
                    // Si no hay datos, asignamos un array vacío
                    this.results = [];
                    this.showAlert("warning", result.message, 3000);
                }
            } catch (error) {
                this.results = [];
                this.loadingrules = false;
                LocalStorageService.setIsLocked(false);
                // Captura de errores no controlados
                this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
            } finally {
                this.loadingrules = false;
                LocalStorageService.setIsLocked(false);
            }
        },
        async products() {
            this.loadingrules = true;
            LocalStorageService.setIsLocked(true);
            const requestParams = {
                branch_id: this.branch_id,
                startDate: this.date ? this.date : new Date().toISOString().split('T')[0],
                endDate: this.endDate ? this.endDate : new Date().toISOString().split('T')[0],
                professional_id: this.professional_id,
                charge: this.charge,
            };
            try {
                const result = await handleRequest({
                    endpoint: 'professional-branch-products',
                    method: 'GET',
                    params: requestParams // Aquí pasas los parámetros
                });

                if (result.success) {
                    // Si la solicitud es exitosa, asignamos las sucursales
                    this.results = result.data.products.products_sold;
                } else {
                    this.loadingrules = false;
                    LocalStorageService.setIsLocked(false);
                    // Si no hay datos, asignamos un array vacío
                    this.results = [];                    
                    this.showAlert("warning", result.message, 3000);
                }
            } catch (error) {
                this.results = [];
                this.loadingrules = false;
                LocalStorageService.setIsLocked(false);
                // Captura de errores no controlados
                this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
            } finally {
                this.loadingrules = false;
                LocalStorageService.setIsLocked(false);
            }
        },
        close() {
            this.dialog = false;
            this.dialogSolicitud = false;
            this.editedIndex = -1;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
            });
            this.file = null;
            this.imgMiniatura = '';
        },
        formatNumber(value) {
            // Verificar si el valor es 0, null, undefined o no es un número
            if (value === 0 || value === null || value === undefined || isNaN(value)) {
                return '0.0';
            }
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
   
    },
}
</script>
<style>
.description-cell {
    max-width: 400px;
    /* Define el ancho máximo del campo de descripción */
    overflow: hidden;
    /* Oculta el texto que se desborda del campo de descripción */
    text-overflow: ellipsis;
    /* Muestra puntos suspensivos (...) cuando el texto se recorta */
}
</style>