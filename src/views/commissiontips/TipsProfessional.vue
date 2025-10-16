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
                    <v-select v-model="selectedYear" :items="years" label="Selecciona un año" variant="underlined"
                        prepend-icon="mdi-calendar"></v-select><!--@update:model-value="initialize()"-->
                </v-col>
                <v-col cols="12" md="2">
                   <v-select v-model="selectedMounth" :items="months.map(month => ({
                    value: month.value,
                    title: `${month.title}`,
                    //icon: month.icon
                    }))" label="Mes" density="compact" variant="underlined" prepend-icon="mdi-calendar-month">
                    <!-- Slot para personalizar cómo se muestran los ítems en la lista -->
                    <template v-slot:item="{ props, item }">
                        <v-list-item
                            v-bind="props"
                            :prepend-icon="item.raw.icon"
                        ></v-list-item>
                    </template>
                    
                    <!-- Slot para personalizar cómo se muestra el ítem seleccionado -->
                    <template v-slot:selection="{ item }">
                        <v-list-item
                            :prepend-icon="item.raw.icon"
                            :title="item.title"
                        ></v-list-item>
                    </template>
                    </v-select>
                </v-col>
                <v-col cols="12" md="1">
                    <v-btn icon @click="tips()" color="#F18254">
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
                                </v-avatar>
                                {{ item.professionalName }}
                            </template>
                            <template v-slot:item.clientName="{ item }">
                                <v-avatar class="mr-1" elevation="3" color="grey-lighten-4" size="small">
                                    <v-img :src="`${this.$axios.defaults.baseURL}images/${item.client_image}`"
                                        alt="image"></v-img>
                                </v-avatar>
                                {{ item.clientName }}
                            </template>
                            <template v-slot:item.tip="{ item }">
                                {{ formatNumber(item.tip) }}
                            </template>
                            <template v-slot:item.tipCashier="{ item }">
                                {{ formatNumber(item.tipCashier) }}
                            </template>
                            <template v-slot:item.tipCoffe="{ item }">
                                {{ formatNumber(item.tipCoffe) }}
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
    data: () => {
        const currentDate = new Date();
        const currentDay = currentDate.getDate(); // Día actual del mes
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        // Cálculo del mes anterior con ajuste de año
        const previousDate = new Date(currentDate);
        previousDate.setMonth(previousDate.getMonth() - 1);
        const previousMonth = previousDate.getMonth() + 1;
        const previousYear = previousDate.getFullYear();
        const years = [];
        for (let year = 2023; year <= currentYear; year++) {
            years.push(year);
        }
        years.reverse();
        // Array completo de nombres de meses
        const monthNames = {
            1: { name: 'Enero', icon: 'mdi-snowflake' },
            2: { name: 'Febrero', icon: 'mdi-heart' },
            3: { name: 'Marzo', icon: 'mdi-clover' },
            4: { name: 'Abril', icon: 'mdi-weather-rainy' },
            5: { name: 'Mayo', icon: 'mdi-flower' },
            6: { name: 'Junio', icon: 'mdi-sun-wireless' },
            7: { name: 'Julio', icon: 'mdi-umbrella-beach' },
            8: { name: 'Agosto', icon: 'mdi-sunglasses' },
            9: { name: 'Septiembre', icon: 'mdi-leaf' },
            10: { name: 'Octubre', icon: 'mdi-ghost' },
            11: { name: 'Noviembre', icon: 'mdi-weather-windy' },
            12: { name: 'Diciembre', icon: 'mdi-gift' }
        };
        // Determinar qué meses mostrar según el día actual
        const availableMonths = Object.keys(monthNames).map(monthNumber => ({
        value: ('0' + monthNumber).slice(-2), // Formato '01', '02', etc.
        title: monthNames[monthNumber].name,        // Nombre completo del mes
        icon: monthNames[monthNumber].icon
        }));
        return {
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
        years,
            months: availableMonths, // Usamos el array calculado
            selectedYear: previousMonth === 12 ? previousYear : currentYear, // Ajuste de año
            selectedMounth: currentDay <= 10 ? ('0' + previousMonth).slice(-2) : ('0' + currentMonth).slice(-2),
        headers: [
            { title: 'ID', align: 'start', key: 'id' },
            { title: 'Nombre Cliente', key: 'clientName', sortable: true },
            { title: 'Nombre Profesional', key: 'professionalName', sortable: true },
            { title: 'Fecha',  key: 'data', sortable: true },
            { title: 'Propina', key: 'tip', sortable: true },
            { title: 'Propina 10% Cajero (a)', key: 'tipCashier', sortable: true },
            { title: 'Propina 10% Café', key: 'tipCoffe', sortable: true },
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
    }},

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
            this.professional_id = LocalStorageService.getItem('professional_id');
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
                charge: this.charge,
                year: Number(this.selectedYear),
                month: Number(this.selectedMounth),
                //data: this.date ? format(new Date(this.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
            };
            try {
                const result = await handleRequest({
                    endpoint: 'professional-branch-tips',
                    method: 'GET',
                    params: requestParams // Aquí pasas los parámetros
                });

                if (result.success) {
                    // Si la solicitud es exitosa, asignamos las sucursales
                    this.results = result.data.tips.cars;
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
        async tips() {
            this.loadingrules = true;
            LocalStorageService.setIsLocked(true);
            const requestParams = {
                branch_id: this.branch_id,
                year: Number(this.selectedYear),
                month: Number(this.selectedMounth),
                professional_id: this.professional_id,
                charge: this.charge,
            };
            try {
                const result = await handleRequest({
                    endpoint: 'professional-branch-tips',
                    method: 'GET',
                    params: requestParams // Aquí pasas los parámetros
                });

                if (result.success) {
                    // Si la solicitud es exitosa, asignamos las sucursales
                    this.results = result.data.tips.cars;
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