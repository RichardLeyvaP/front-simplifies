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
            <v-row dense>
                <v-col cols="12" md="4" class="ml-5 mt-5" v-if="this.mostrarFila">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches"
                        label="Seleccione una Sucursal" prepend-icon="mdi-store" item-title="name" item-value="id"
                        variant="underlined"></v-autocomplete>
                </v-col>
                <v-col cols="12" md="2" class="ml-5 mt-5">
                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                        transition="scale-transition" offset-y min-width="290px">
                        <template v-slot:activator="{ props }">
                            <v-text-field v-bind="props" :modelValue="dateFormatted" variant="underlined"
                                prepend-inner-icon="mdi-calendar" label="Fecha"></v-text-field>
                        </template>
                        <v-locale-provider locale="es">
                            <v-date-picker header="Calendario" title="Seleccione la fecha" color="#F18254"
                                :modelValue="input" @update:model-value="updateDate"
                                format="yyyy-MM-dd"></v-date-picker>
                        </v-locale-provider>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="1" class="ml-5 mt-5">
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
                            :loading="loadingrules" loading-text="Cargando datos..." show-expand>
                            <template v-slot:item.cashFound="{ item }">
                                {{ formatNumber(item.cashFound) }}
                            </template>
                            <template v-slot:item.existence="{ item }">
                                {{ formatNumber(item.existence) }}
                            </template>
                            <template v-slot:item.extraction="{ item }">
                                {{ formatNumber(item.extraction) }}
                            </template>
                            <template v-slot:item.totalMount="{ item }">
                                <span class="font-weight-bold">{{ formatNumber(item.totalMount) }}</span>
                            </template>
                            <template v-slot:item.totalService="{ item }">
                                {{ formatNumber(item.totalService) }}
                            </template>
                            <template v-slot:item.totalProduct="{ item }">
                                {{ formatNumber(item.totalProduct) }}
                            </template>
                            <template v-slot:item.totalTip="{ item }">
                                {{ formatNumber(item.totalTip) }}
                            </template>
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
                                        <!-- Primera tabla: Métodos de pago -->
                                        <v-sheet rounded="lg" border class="mb-4">
                                            <v-table density="compact">
                                                <tbody class="bg-surface-light">
                                                    <tr class="bg-grey-lighten-3">
                                                        <th>Efectivo</th>
                                                        <th>Débito</th>
                                                        <th>Crédito</th>
                                                        <th>Transferencia</th>
                                                        <th>Otros</th>
                                                        <th>Tarjeta Regalo</th>
                                                        <th>Propinas</th>
                                                    </tr>
                                                </tbody>
                                                <tbody>
                                                    <tr>
                                                        <td>{{ formatNumber(item.totalCash) }}</td>
                                                        <td>{{ formatNumber(item.totalDebit) }}</td>
                                                        <td>{{ formatNumber(item.totalCreditCard) }}</td>
                                                        <td>{{ formatNumber(item.totalTransfer) }}</td>
                                                        <td>{{ formatNumber(item.totalOther) }}</td>
                                                        <td>{{ formatNumber(item.totalCardGif) }}</td>
                                                        <td>{{ formatNumber(item.totalTip) }}</td>
                                                    </tr>
                                                </tbody>
                                            </v-table>
                                        </v-sheet>

                                        <!-- Segunda tabla: Detalles de bonos -->
                                        <v-sheet rounded="lg" border
                                            v-if="item.bonus_details && item.bonus_details.length > 0">
                                            <v-table density="compact">
                                                <thead class="bg-surface-light">
                                                    <tr class="bg-grey-lighten-3">
                                                        <th>Profesional</th>
                                                        <th>Tipo</th>
                                                        <th>Monto</th>
                                                        <th>Fecha</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(bonus, index) in item.bonus_details" :key="index">
                                                        <td>
                                                            <div class="d-flex align-center">
                                                                <v-avatar class="mr-2" elevation="3"
                                                                    color="grey-lighten-4" size="small">
                                                                    <v-img :src="'http://127.0.0.1:8000/api/images/' + bonus.professional_image" :alt="bonus.professional_name"></v-img>
                                                                </v-avatar>
                                                                <span>{{ bonus.professional_name || 'N/A' }}</span>
                                                            </div>
                                                        </td>
                                                        <td>{{ bonus.type }}</td>
                                                        <td>{{ formatNumber(bonus.amount) }}</td>
                                                        <td>{{ bonus.date }}</td>
                                                    </tr>
                                                </tbody>
                                                <tfoot v-if="item.bonus_details.length > 1">
                                                    <tr class="bg-grey-lighten-3">
                                                        <td colspan="2" class="text-right font-weight-bold">Total Bonos:
                                                        </td>
                                                        <td class="font-weight-bold">
                                                            {{formatNumber(item.bonus_details.reduce((sum, b) => sum +
                                                            parseFloat(b.amount), 0)) }}
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                </tfoot>
                                            </v-table>
                                        </v-sheet>

                                        <!-- Mensaje cuando no hay bonos -->
                                        <v-alert v-else type="info" variant="tonal" density="compact" class="mt-2">
                                            No hay registros de bonos para este día
                                        </v-alert>
                                    </td>
                                </tr>
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
import { format } from 'date-fns';
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
        business_id: '',
        search: '',
        search2: '',
        message_delete: true,
        dialogDelete: false,
        headers: [
            { title: 'Fecha', key: 'data', sortable: true },
            { title: 'Fondo Inicio', key: 'cashFound', sortable: true },
            { title: 'Existencia', key: 'existence', sortable: true },
            { title: 'Extracción', key: 'extraction', sortable: true },
            { title: 'Servicio', key: 'totalService', sortable: true },
            { title: 'Producto', key: 'totalProduct', sortable: true },
            { title: 'Propina', key: 'totalTip', sortable: true },
            { title: 'Total', key: 'totalMount', sortable: true },
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
        input: null,
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
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        },
        getDate() {
            return this.input ? new Date(this.input) : new Date();
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
                data: this.date ? format(new Date(this.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
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
                .get('http://127.0.0.1:8000/api/branch-rules-noIn', {
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
                .post('http://127.0.0.1:8000/api/branchrule-destroy', this.data)
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
                    .post('http://127.0.0.1:8000/api/branchrule', this.data)
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