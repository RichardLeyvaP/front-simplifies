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
                    <v-col cols="12" md="5" class="grow ml-4">
                        <span class="text-subtitle-1"> <strong>Cirres de Cajas</strong></span>
                    </v-col>
                    <v-col cols="12" md="4"></v-col>
                    <v-col cols="12" md="2">
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
                    <v-btn icon @click="boxCloseDiary()" color="#F18254">
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
                            :loading="loadingrules" loading-text="Cargando datos..." show-expand hide-default-footer>
                            <template v-slot:item.actions="{ item, internalItem, isExpanded, toggleExpand }">
                                <!-- Botón de expansión (ícono verde) -->
                                <v-btn density="comfortable"
                                    :icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                    @click="toggleExpand(internalItem)" color="green" variant="tonal" elevation="1"
                                    title="Más Información" class="mr-1"></v-btn>

                            </template>
                            <template v-slot:expanded-row="{ columns, item }">
                                <tr>
                                    <td :colspan="columns.length" class="py-2">
                                        <div style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                                            <v-card style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                                                <v-card-text>
                                                    <v-row class="mb-4 mt-2" dense no-gutters>
                                                        <v-col cols="12" md="1" class="text-center"></v-col>
                                                        <v-col cols="12" md="5">
                                                            <v-card class="mx-auto"
                                                                subtitle="Resumen de datos arrojados por el sistema"
                                                                style="background-color: #F18254; color: white;"
                                                                elevation="4">
                                                                <template v-slot:prepend>
                                                                    <v-avatar color="white">
                                                                        <v-icon icon="mdi-cog" color="#F18254"
                                                                            size="large"></v-icon>
                                                                    </v-avatar>
                                                                </template>
                                                                <template v-slot:title>
                                                                    <span class="font-weight-black">Datos del
                                                                        Sistema</span>
                                                                </template>
                                                                <v-card-text class="bg-surface-light pt-4">
                                                                    <v-text-field
                                                                        :model-value="formatNumber(item.totalCreditCard)"
                                                                        label="Tarjeta Crédito" readonly
                                                                        prepend-icon="mdi-credit-card"
                                                                        variant="underlined"
                                                                        density="compact"></v-text-field>
                                                                    <v-text-field
                                                                        :model-value="formatNumber(item.totalDebit)"
                                                                        label="Débito" readonly
                                                                        prepend-icon="mdi-credit-card-outline"
                                                                        variant="underlined"
                                                                        density="compact"></v-text-field>
                                                                    <v-text-field
                                                                        :model-value="formatNumber(item.totalTransfer)"
                                                                        label="Transferencia" readonly
                                                                        prepend-icon="mdi-bank-transfer"
                                                                        variant="underlined"
                                                                        density="compact"></v-text-field>
                                                                    <v-text-field
                                                                        :model-value="formatNumber(item.cashFound)"
                                                                        label="Fondo de Caja" readonly
                                                                        prepend-icon="mdi-cash-register" variant="underlined"
                                                                        density="compact"></v-text-field>
                                                                    <v-text-field
                                                                        :model-value="formatNumber(item.existence)"
                                                                        label="Efectivo" readonly
                                                                        prepend-icon="mdi-cash" variant="underlined"
                                                                        density="compact"></v-text-field>
                                                                    <v-text-field
                                                                        :model-value="formatNumber(item.totalOther)"
                                                                        label="Otros" readonly
                                                                        prepend-icon="mdi-currency-usd"
                                                                        variant="underlined"
                                                                        density="compact"></v-text-field>
                                                                    <v-text-field
                                                                        :model-value="formatNumber(item.totalCardGif)"
                                                                        label="Tarjeta Regalo" readonly
                                                                        prepend-icon="mdi-gift" variant="underlined"
                                                                        density="compact"></v-text-field>
                                                                    <v-text-field
                                                                        :model-value="formatNumber(item.extraction)"
                                                                        label="Extracción en caja" readonly
                                                                        prepend-icon="mdi-cash-refund"
                                                                        variant="underlined"
                                                                        density="compact"></v-text-field>
                                                                    <v-text-field v-if="item.type === 'Diario'"
                                                                        :model-value="formatNumber(item.totalBonus)"
                                                                        label="Bonos" prepend-icon="mdi-cash-refund"
                                                                        variant="underlined"
                                                                        density="compact"></v-text-field>
                                                                    <v-text-field
                                                                        :model-value="formatNumber(item.advancement)"
                                                                        label="Adelanto" readonly
                                                                        prepend-icon="mdi-cash" variant="underlined"
                                                                        density="compact"></v-text-field>
                                                                </v-card-text>
                                                            </v-card>
                                                        </v-col>
                                                        <v-col cols="12" md="5" class="ml-6">
                                                            <v-card class="mx-auto"
                                                                subtitle="Resumen datos del cierre de caja"
                                                                style="background-color: #F18254; color: white;"
                                                                elevation="4">
                                                                <template v-slot:prepend>
                                                                    <v-avatar color="white">
                                                                        <v-icon icon="mdi-cash-register" color="#F18254"
                                                                            size="large"></v-icon>
                                                                    </v-avatar>
                                                                </template>
                                                                <template v-slot:title>
                                                                    <span class="font-weight-black">Datos de la
                                                                        Cajera</span>
                                                                </template>
                                                                <v-card-text class="bg-white pt-4">
                                                                    <v-text-field
                                                                        :model-value="formatNumber(item.cashier_totalService)"
                                                                        label="Tarjeta Servicio" readonly
                                                                        prepend-icon="mdi-list-box-outline"
                                                                        variant="underlined"
                                                                        density="compact"></v-text-field>
                                                                    <v-text-field
                                                                        :model-value="formatNumber(item.cashier_totalProduct)"
                                                                        label="Tarjeta Producto" readonly
                                                                        prepend-icon="mdi-package-variant"
                                                                        variant="underlined"
                                                                        density="compact"></v-text-field>
                                                                    <v-text-field
                                                                        :model-value="formatNumber(item.cashier_totalTransfer)"
                                                                        label="Transferencia" readonly
                                                                        prepend-icon="mdi-bank-transfer"
                                                                        variant="underlined"
                                                                        density="compact"></v-text-field>
                                                                    <v-text-field
                                                                        :model-value="formatNumber(item.cashier_cashFound)"
                                                                        label="Fondo de Caja" readonly
                                                                        prepend-icon="mdi-cash-register" variant="underlined"
                                                                        density="compact"></v-text-field>
                                                                    <v-text-field
                                                                        :model-value="formatNumber(item.cashier_existence)"
                                                                        label="Efectivo" readonly
                                                                        prepend-icon="mdi-cash" variant="underlined"
                                                                        density="compact"></v-text-field>
                                                                    <v-text-field
                                                                        :model-value="formatNumber(item.cashier_totalOther)"
                                                                        label="Otros" readonly
                                                                        prepend-icon="mdi-currency-usd"
                                                                        variant="underlined"
                                                                        density="compact"></v-text-field>
                                                                    <v-text-field
                                                                        :model-value="formatNumber(item.cashier_totalCardGif)"
                                                                        label="Tarjeta Regalo" readonly
                                                                        prepend-icon="mdi-gift" variant="underlined"
                                                                        density="compact"></v-text-field>
                                                                    <v-text-field
                                                                        :model-value="formatNumber(item.cashier_extraction)"
                                                                        label="Extracción en caja" readonly
                                                                        prepend-icon="mdi-cash-refund"
                                                                        variant="underlined"
                                                                        density="compact"></v-text-field>
                                                                    <v-text-field v-if="item.type === 'Diario'"
                                                                        :model-value="formatNumber(item.cashier_totalBonus)"
                                                                        label="Bonos" prepend-icon="mdi-cash-refund"
                                                                        variant="underlined"
                                                                        density="compact"></v-text-field>
                                                                    <v-text-field
                                                                        :model-value="formatNumber(item.cashier_advancement)"
                                                                        label="Adelanto" readonly
                                                                        prepend-icon="mdi-cash" variant="underlined"
                                                                        density="compact"></v-text-field>
                                                                </v-card-text>
                                                            </v-card>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row v-if="item.cashier_difference !== 0">
                                                        <v-col cols="12" md="1"></v-col>
                                                        <v-col cols="12" md="10">
                                                            <v-row class="mb-4 mt-2 text-right" dense no-gutters>
                                                                <v-col cols="12" md="12">
                                                                    <span class="text-h6" :class="{
                                                                        'text-red': item.cashier_difference < 0,
                                                                        'text-green': item.cashier_difference >= 0
                                                                    }">Existe una diferencia total de: {{ formatNumber(item.cashier_difference) }}</span>
                                                                </v-col>
                                                            </v-row>
                                                            <v-row class="mb-4 mt-1" dense no-gutters>
                                                                <v-col cols="12" md="6"
                                                                    class="text-h6">Comentario:</v-col>
                                                                <v-col cols="12" md="12" class="text-center">
                                                                    <v-textarea v-model="item.description"
                                                                        variant="underlined" density="compact"
                                                                        class="mb-2"
                                                                        :rules="descriptionRules"></v-textarea>
                                                                </v-col>
                                                            </v-row>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>
                                            </v-card>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <template v-slot:item.data-table-expand="{ item, isExpanded, toggleExpand }">
                                <!-- Template vacío para ocultar el expand en filas normales -->
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-col>
            </v-row>
        </v-card>
    </v-container>



    <br>
</template>
<script>

import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api";
import { format, parseISO } from 'date-fns';
/*axios.interceptors.request.use(config => {
  const token = LocalStorageService.getItem('token'); // Suponiendo que guardaste el token en localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token.replace(/['"]+/g, '')}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});
*/
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
        message_delete: true,
        dialogDelete: false,
        headers: [
            { title: 'Fecha', key: 'data', sortable: true },
            { title: 'Hora', key: 'time', sortable: true },
            { title: 'Responsable', key: 'professional_name', sortable: true },
            { title: 'Tipo de cierre', key: 'type', sortable: true },
            { title: 'Acciones', key: 'actions', sortable: false },
        ],
        results: [],
        rules: [],
        branches: [],
        editedIndex: -1,
        editedItem: {
            id: ''
        },
        data: {},
        defaultItem: {
            id: '',
        },
        menu: false,
        menu2: false,
        input: null,
        input2: null,
        selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    }),

    computed: {
        formTitle() {
            if (this.editedIndex === -1) {
                return 'Asignar regla de convivencia a sucursal';
            }
            if (this.editedIndex === 3) {
                return 'Editar Asignación de regla de convivencia a sucursal';
            }
            else {
                return 'Trasladar producto de un almacén a otro'
            }
        },
        dateFormatted() {
            const date = this.input ? new Date(this.input) : new Date();
            return date.toISOString().split('T')[0]
            //return `${year}-${month}-${day}`;
        },
        dateFormatted1() {
            const date = this.input2 ? new Date(this.input2) : new Date();
            return date.toISOString().split('T')[0];
            /*const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;*/
        },
        getDate() {
            return this.input ? new Date(this.input).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        },
        getDate2() {
            return this.input2 ? new Date(this.input2).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        },
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
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
            await this.initialize();
        }
    },

    methods: {

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
        async initialize() {
            this.loadingrules = true;
            LocalStorageService.setIsLocked(true);
            const requestParams = {
                branch_id: this.branch_id,
                //data: this.date ? format(new Date(this.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
            };
            try {
                const result = await handleRequest({
                    endpoint: 'closebox-diary',
                    method: 'GET',
                    params: requestParams // Aquí pasas los parámetros
                });

                if (result.success) {
                    // Si la solicitud es exitosa, asignamos las sucursales
                    this.results = result.data.boxcloses;
                } else {
                    this.loadingrules = false;
                    LocalStorageService.setIsLocked(false);
                    // Si no hay datos, asignamos un array vacío
                    this.results = [];
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
        async boxCloseDiary() {
            this.loadingrules = true;
            LocalStorageService.setIsLocked(true);
            const requestParams = {
                branch_id: this.branch_id,
                data: this.date ? this.date : new Date().toISOString().split('T')[0],
                endDate: this.endDate ? this.endDate : new Date().toISOString().split('T')[0]
            };
            try {
                const result = await handleRequest({
                    endpoint: 'closebox-diary',
                    method: 'GET',
                    params: requestParams // Aquí pasas los parámetros
                });

                if (result.success) {
                    // Si la solicitud es exitosa, asignamos las sucursales
                    this.results = result.data.boxcloses;
                } else {
                    this.loadingrules = false;
                    LocalStorageService.setIsLocked(false);
                    // Si no hay datos, asignamos un array vacío
                    this.results = [];
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
        /*showAddRules() {
            LocalStorageService.setIsLocked(true);
            axios
                .get('https://testapi.simplifies.cl/api/branch-rules-noIn', {
                    params: {
                        branch_id: this.branch_id
                    }
                })
                .then((response) => {
                    this.rules = response.data.rules;
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                });
            this.dialog = true;
        },*/
        deleteItem(item) {
            this.editedItem.rule_id = item.rule_id;
            this.dialogDelete = true;
            console.log('item');
            console.log(this.editedItem);
        },
        /*deleteItemConfirm() {
            LocalStorageService.setIsLocked(true);
            this.data.branch_id = this.branch_id;
            this.data.rule_id = this.editedItem.rule_id;
            axios
                .post('https://testapi.simplifies.cl/api/branchrule-destroy', this.data)
                .then(() => {
                    this.message_delete = true;
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.showAlert("success", "Asignación eliminada correctamente", 3000);
                    this.initialize();
                });
            this.closeDelete()
        },*/
        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
                this.mostrarCampos = false
            })
        },
        closeDelete() {
            this.dialogDelete = false
            this.dialogProfessionals = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        /*save() {
            LocalStorageService.setIsLocked(true);
            if (this.editedIndex === -1) {
                console.log('insertar');
                this.valid = false;
                this.data.branch_id = this.branch_id;
                this.data.rule_id = this.editedItem.rule_id;
                axios
                    .post('https://testapi.simplifies.cl/api/branchrule', this.data)
                    .then(() => {
                    }).finally(() => {
                        LocalStorageService.setIsLocked(false);
                        this.showAlert("success", "Regla de convivencia asignada correctamente", 3000);
                        this.initialize();
                    });
            }
            this.close();

        },*/
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