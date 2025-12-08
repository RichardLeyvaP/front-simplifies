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
    <v-card elevation="6" class="mx-5" width="auto">
        <v-toolbar color="#F18254">
            <v-row align="center">
                <v-col cols="12" md="5" class="grow ml-4 t">
                    <span class="text-subtitle-1"> <strong>Solicitudes de eliminación de Órdenes, Productos y
                            Carros</strong></span>
                </v-col>
            </v-row>
        </v-toolbar>
        <!--<v-container class="fill-height" fluid>-->
        <v-row>
            <v-col cols="12" sm="12" md="4">
                <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches"
                    v-if="this.mostrarFila" clearable label="Seleccione una Sucursal" prepend-icon="mdi-store"
                    item-title="name" item-value="id" variant="underlined"
                    @update:model-value="initialize()"></v-autocomplete>
            </v-col>
        </v-row>
        <v-row>
            <v-container style="min-width: 100%; max-height: 100%;">
                <v-col cols="12" md="12">
                    <v-card elevation="2">
                        <v-tabs v-model="tabBar" color="rgb(241, 130, 84)"
                            elevation="6"><!-- @click="handleTabChange"-->
                            <v-tab value="one">Solicitud de carros</v-tab>
                            <v-tab value="two">Solicitud ordenes</v-tab>
                            <v-tab value="tree">Solicitud Productos</v-tab>
                        </v-tabs>
                        <v-card-text>
                            <v-window v-model="tabBar">
                                <v-window-item value="one">
                                    <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify"
                                        label="Buscar" single-line hide-details></v-text-field>


                                    <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'"
                                        :items="results" :search="search" class="elevation-1"
                                        no-results-text="No hay datos disponibles"
                                        no-data-text="No hay datos disponibles" :loading="loadingCar"
                                        loading-text="Cargando datos...">

                                        <template v-slot:item.professionalName="{ item }">

                                            <v-avatar class="mr-2" elevation="3" color="grey-lighten-4">
                                                <v-img :src="`${this.$axios.defaults.baseURL}images/${item.image_url}`"
                                                    alt="image"></v-img>
                                            </v-avatar>
                                            {{ item.professionalName }}
                                        </template>

                                        <template v-slot:item.clientName="{ item }">

                                            <v-avatar class="mr-2" elevation="3" color="grey-lighten-4">
                                                <v-img :src="`${this.$axios.defaults.baseURL}images/${item.client_image}`"
                                                    alt="image"></v-img>
                                            </v-avatar>
                                            {{ item.clientName }}
                                        </template>
                                        <template v-slot:item.amount="{ item }">
                                            {{ formatNumber(item.amount) }}
                                        </template>

                                        <template v-slot:item.technical_assistance="{ item }">
                                            {{ formatNumber(item.technical_assistance) }}
                                        </template>
                                        <template v-slot:item.tip="{ item }">
                                            {{ formatNumber(item.tip) }}
                                        </template>
                                        <template v-slot:item.product="{ item }">
                                            {{ formatNumber(item.product) }}
                                        </template>
                                        <template v-slot:item.service="{ item }">
                                            {{ formatNumber(item.service) }}
                                        </template>

                                        <template v-slot:item.active="{ item }">
                                            <v-chip :color="item.active === 2 ? 'warning' : 'error'" small>
                                                {{ item.active === 2 ? 'Editar' : 'Eliminar' }}
                                            </v-chip>
                                        </template>
                                        <template v-slot:top>

                                            <v-divider class="mx-4" inset vertical></v-divider>
                                            <v-spacer></v-spacer>
                                        </template>

                                        <template v-slot:item.actions="{ item }">
                                            <v-btn density="comfortable" icon="mdi-close" @click="editItem(item)"
                                                color="red-darken-4" variant="tonal" elevation="1"
                                                class="mr-1 mt-1 mb-1" title="Denegar Solicitud"></v-btn>
                                            <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-check"
                                                @click="deleteItem(item)" color="primary" variant="tonal" elevation="1"
                                                :title="item.active === 2 ? 'Aceptar solicitud y editar el carro' : 'Aceptar solicitud y eliminar el carro'"></v-btn>
                                        </template>
                                        <template v-slot:item.action_descriptions="{ item }">
                                            <div>
                                                <v-chip
                                                    @click="dialogActions = true; currentActions = item.action_descriptions"
                                                    color="indigo-darken-2" small class="px-2" :disabled="!item.action_descriptions?.length">
                                                    <v-icon left color="indigo-darken-2"
                                                        icon="mdi-clipboard-text-outline" />
                                                    {{ item.action_descriptions.length }}
                                                </v-chip>

                                                <v-dialog v-model="dialogActions" max-width="540px">
                                                    <v-card>
                                                        <v-toolbar color="#F18254">
                                                            <v-row align="center">
                                                                <v-col cols="12" md="5" class="grow ml-4">
                                                                    <span class="text-subtitle-1"><strong>Detalles de
                                                                            Solicitudes</strong></span>
                                                                </v-col>
                                                                <v-col cols="12" md="5"></v-col>
                                                                <v-col cols="12" md="1"></v-col>
                                                            </v-row>
                                                        </v-toolbar>

                                                        <v-card-text>
                                                            <v-card v-for="(action, index) in currentActions"
                                                                :key="index" class="mb-6">
                                                                <v-card-title>
                                                                    <v-list-item
                                                                        :subtitle="formatDateTime(action.timestamp)"
                                                                        :title="action.nameProfessional || 'Usuario'">
                                                                        <template v-slot:prepend>
                                                                            <v-avatar>
                                                                                <v-img :src="`${this.$axios.defaults.baseURL}images/${action.image}`"
                                                                                alt="image"></v-img>
                                                                            </v-avatar>
                                                                        </template>
                                                                        <template v-slot:append>
                                                                            <v-avatar color="grey-lighten-1"
                                                                                size="small">
                                                                                {{ index + 1 }}
                                                                            </v-avatar>
                                                                        </template>
                                                                    </v-list-item>
                                                                </v-card-title>
                                                                <v-divider></v-divider>

                                                                <v-card-text>
                                                                    <v-list-item :subtitle="action.description"
                                                                        :title="getActionTitle(action.action_type)">
                                                                        <template v-slot:prepend>
                                                                            <v-avatar color="white">
                                                                                <v-icon
                                                                                    :color="getActionColor(action.action_type)" size="30">{{
                                                                                    getActionIcon(action.action_type)
                                                                                    }}</v-icon>
                                                                            </v-avatar>
                                                                        </template>
                                                                    </v-list-item>
                                                                </v-card-text>
                                                            </v-card>
                                                        </v-card-text>

                                                        <v-divider></v-divider>

                                                        <v-card-actions>
                                                            <v-spacer></v-spacer>
                                                            <v-btn color="#E7E9E9" variant="flat"
                                                                @click="dialogActions = false">
                                                                Cerrar
                                                            </v-btn>
                                                        </v-card-actions>
                                                    </v-card>
                                                </v-dialog>
                                            </div>
                                        </template>
                                        <template v-slot:item.change_log="{ item }">
                                            <div>
                                                <v-chip
                                                    @click="dialogChages = true; cambiosProcesados = procesarChangeLog(item.change_log)"
                                                    color="teal-darken-3" small class="px-2" :disabled="!item.change_log?.length">
                                                    <v-icon left color="teal-darken-3" icon="mdi-history" />
                                                    {{ item.change_log.length }}
                                                </v-chip>

                                                <v-dialog v-model="dialogChages" max-width="700px">
                                                    <v-card>
                                                        <v-toolbar color="#F18254">
                                                            <v-row align="center">
                                                                <v-col cols="12" md="5" class="grow ml-4">
                                                                    <span class="text-subtitle-1"><strong>Historial de
                                                                            Cambios</strong></span>
                                                                </v-col>
                                                            </v-row>
                                                        </v-toolbar>

                                                        <v-card-text>
                                                            <v-card v-for="(registro, index) in cambiosProcesados"
                                                                :key="index" class="mb-6">
                                                                <v-card-title>
                                                                    <v-list-item
                                                                        :subtitle="formatFecha(registro.timestamp)"
                                                                        :title="registro.nameProfessional">
                                                                        <template v-slot:prepend>
                                                                            <v-avatar color="primary">
                                                                                <v-img :src="`${this.$axios.defaults.baseURL}images/${registro.image}`" alt="image"></v-img>
                                                                            </v-avatar>
                                                                        </template>
                                                                        <template v-slot:append>
                                                                            <v-avatar color="grey-lighten-1"
                                                                                size="small">
                                                                                {{ index + 1 }}
                                                                            </v-avatar>
                                                                        </template>
                                                                    </v-list-item>
                                                                </v-card-title>

                                                                <v-divider></v-divider>

                                                                <v-card-text>
                                                                    <v-list density="compact">
                                                                        <v-list-item
                                                                            v-for="(cambio, i) in registro.listaCambios"
                                                                            :key="i">
                                                                            <v-list-item-content>
                                                                                <v-list-item-title
                                                                                    :class="iconoCambio(cambio).color + '--text'">
                                                                                    <v-list-item-icon>
                                                                                        <v-icon
                                                                                            :color="iconoCambio(cambio).color">
                                                                                            {{ iconoCambio(cambio).icon
                                                                                            }}
                                                                                        </v-icon>
                                                                                    </v-list-item-icon>
                                                                                    {{ cambio }}
                                                                                </v-list-item-title>
                                                                            </v-list-item-content>
                                                                        </v-list-item>
                                                                    </v-list>
                                                                </v-card-text>
                                                            </v-card>
                                                        </v-card-text>

                                                        <v-divider></v-divider>

                                                        <v-card-actions>
                                                            <v-spacer></v-spacer>
                                                            <v-btn color="#E7E9E9" variant="flat"
                                                                @click="dialogChages = false">
                                                                Cerrar
                                                            </v-btn>
                                                        </v-card-actions>
                                                    </v-card>
                                                </v-dialog>
                                            </div>
                                        </template>
                                    </v-data-table>
                                </v-window-item>

                                <v-window-item value="two">
                                    <v-text-field class="mt-1 mb-1" v-model="search2" append-icon="mdi-magnify"
                                        label="Buscar" single-line hide-details></v-text-field>


                                    <v-data-table :headers="headers1" :items-per-page-text="'Elementos por páginas'"
                                        :items="results1" :search="search2" class="elevation-1"
                                        no-results-text="No hay datos disponibles"
                                        no-data-text="No hay datos disponibles" :loading="loadingOrder"
                                        loading-text="Cargando datos...">

                                        <template v-slot:item.professionalName="{ item }">

                                            <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                                                <v-img :src="`${this.$axios.defaults.baseURL}images/${item.image_url}`"
                                                    alt="image"></v-img>
                                            </v-avatar>
                                            {{ item.professionalName }}
                                        </template>

                                        <template v-slot:item.clientName="{ item }">

                                            <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                                                <v-img :src="`${this.$axios.defaults.baseURL}images/${item.client_image}`"
                                                    alt="image"></v-img>
                                            </v-avatar>
                                            {{ item.clientName }}
                                        </template>
                                        <template v-slot:item.name="{ item }">

                                            <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                                                <v-img :src="`${this.$axios.defaults.baseURL}images/${item.image}`"
                                                    alt="image"></v-img>
                                            </v-avatar>
                                            {{ item.name }}
                                        </template>
                                        <template v-slot:item.price="{ item }">
                                            {{ formatNumber(item.price) }}
                                        </template>
                                        <template v-slot:top>
                                            <v-divider class="mx-4" inset vertical></v-divider>
                                            <v-spacer></v-spacer>
                                        </template>

                                        <template v-slot:item.actions="{ item }">
                                            <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-close"
                                                @click="editItemOrder(item)" color="red-darken-4" variant="tonal"
                                                elevation="1" title="Denegar Solicitud"></v-btn>
                                            <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-check"
                                                @click="deleteItemOrder(item)" color="primary" variant="tonal"
                                                elevation="1" title="Aceptar la solicitud y eliminar la orden"></v-btn>
                                        </template>

                                    </v-data-table>
                                </v-window-item>
                                <v-window-item value="tree">
                                    <v-text-field class="mt-1 mb-1" v-model="search3" append-icon="mdi-magnify"
                                        label="Buscar" single-line hide-details></v-text-field>


                                    <v-data-table :headers="headers2" :items-per-page-text="'Elementos por páginas'"
                                        :items="results2" :search="search3" class="elevation-1"
                                        no-results-text="No hay datos disponibles"
                                        no-data-text="No hay datos disponibles" :loading="loadingProduct"
                                        loading-text="Cargando datos...">

                                        <template v-slot:item.professionalName="{ item }">

                                            <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                                                <v-img :src="`${this.$axios.defaults.baseURL}images/${item.image_url}`"
                                                    alt="image"></v-img>
                                            </v-avatar>
                                            {{ item.professionalName }}
                                        </template>
                                        <template v-slot:item.productName="{ item }">

                                            <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                                                <v-img :src="`${this.$axios.defaults.baseURL}images/${item.image_product}`"
                                                    alt="image"></v-img>
                                            </v-avatar>
                                            {{ item.productName }}
                                        </template>
                                        <template v-slot:item.price="{ item }">
                                            {{ formatNumber(item.price) }}
                                        </template>
                                        <template v-slot:top>
                                            <v-divider class="mx-4" inset vertical></v-divider>
                                            <v-spacer></v-spacer>
                                        </template>

                                        <template v-slot:item.actions="{ item }">
                                            <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-close"
                                                @click="editItemProduct(item)" color="red-darken-4" variant="tonal"
                                                elevation="1" title="Denegar Solicitud"></v-btn>
                                            <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-check"
                                                @click="deleteItemProduct(item)" color="primary" variant="tonal"
                                                elevation="1"
                                                title="Aceptar la solicitud y eliminar la producto"></v-btn>
                                        </template>
                                    </v-data-table>
                                </v-window-item>
                            </v-window>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-container>
        </v-row>
        <!---->
    </v-card>
</template>

<script>


import LocalStorageService from "@/LocalStorageService";


export default {
    data: () => ({
        dialogActions: false,
        currentActions: [],
        dialogChages: false,
        cambiosProcesados: [], // Aquí se almacenarán los cambios procesados
        loadingCar: true,
        loadingOrder: true,
        loadingProduct: true,
        tabBar: null,
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
        professional_id: '',
        branches: [],
        search: '',
        search2: '',
        search3: '',
        mostrarFila: false,
        headers: [
            { title: 'No', value: 'id' },
            { title: 'Sucursal', value: 'nameBranch' },
            { title: 'Profesional', value: 'professionalName' },
            { title: 'Cliente', value: 'clientName' },
            { title: 'Técnico', value: 'technical_assistance' },
            { title: 'Productos', value: 'product' },
            { title: 'Servicios', value: 'service' },
            { title: 'Propina', value: 'tip' },
            { title: 'Monto Total', value: 'amount' },
            { title: 'Solicitudes', value: 'action_descriptions' },
            { title: 'Cambios', value: 'change_log' },
            { title: 'Solicitud', value: 'active' },
            { title: 'Acciones', key: 'actions', sortable: false, width: '15%' },
        ],
        headers1: [
            { title: 'Sucursal', value: 'nameBranch' },
            { title: 'Carro', value: 'car_id' },
            { title: 'Profesional', value: 'professionalName' },
            { title: 'Cliente', value: 'clientName' },
            { title: 'Nombre', value: 'name' },
            { title: 'Categoría', value: 'category' },
            { title: 'Importe', value: 'price' },
            { title: 'Acciones', key: 'actions', sortable: false },
        ],
        headers2: [
            { title: 'No', value: 'id' },
            { title: 'Sucursal', value: 'nameBranch' },
            { title: 'Profesional', value: 'professionalName' },
            { title: 'Producto', value: 'productName' },
            { title: 'Precio', value: 'price' },
            { title: 'Cantidad', value: 'cant' },
            { title: 'Acciones', key: 'actions', sortable: false },
        ],
        results: [],
        results1: [],
        results2: [],
    }),

    computed: {

    },

    watch: {

    },

    mounted() {
        this.business_id = LocalStorageService.getItem('business_id');
        this.branch_id = LocalStorageService.getItem('branch_id');
        this.charge_id = LocalStorageService.getItem('charge_id');
        this.charge = JSON.parse(LocalStorageService.getItem("charge"));
        this.professional_id = LocalStorageService.getItem('professional_id');
        this.initialize();
    },

    methods: {
        isResolution(actionType) {
            return ['approved', 'denied'].includes(actionType);
        },

        // Obtener color según tipo de acción
        getActionColor(actionType) {
            const colors = {
                approved: 'green',
                denied: 'red',
                delete: 'red',
                add: 'green',
                edit: 'blue',
                payment: 'indigo', // Color azul oscuro para pagos
                default: 'grey'
            };
            return colors[actionType] || colors.default;
        },

        // Obtener icono según tipo de acción
        getActionIcon(actionType) {
            const icons = {
                approved: 'mdi-check-circle',
                denied: 'mdi-close-circle',
                delete: 'mdi-delete',
                add: 'mdi-plus',
                edit: 'mdi-pencil',
                payment: 'mdi-cash-multiple', // Icono adecuado para pagos
                default: 'mdi-alert'
            };
            return icons[actionType] || icons.default;
        },

        procesarChangeLog(changeLog) {
            if (!changeLog || !Array.isArray(changeLog)) return [];

            return changeLog.map(registro => ({
                ...registro,
                listaCambios: this.extraerCambios(registro.changes),
                timestamp: registro.timestamp || new Date().toISOString(),
                nameProfessional: registro.nameProfessional || 'Usuario desconocido'
            }));
        },

        extraerCambios(changesString) {
            if (!changesString) return [];
            return changesString
                .split('*')
                .map(c => c.trim())
                .filter(c => c !== '');
        },
        openActionsDialog(actions) {
            this.currentActions = actions;
            this.actionsDialog = true;
        },
        formatFecha(fechaStr) {
            const fecha = new Date(fechaStr);
            return fecha.toLocaleString();
        },
        iconoCambio(texto) {
            if (texto.includes('aumentó')) {
                return { icon: 'mdi-arrow-up', color: 'green' };
            }
            if (texto.includes('disminuyó')) {
                return { icon: 'mdi-arrow-down', color: 'red' };
            }
            if (texto.includes('cambió')) {
                return { icon: 'mdi-swap-horizontal', color: 'blue' };
            }
            return { icon: 'mdi-dots-horizontal', color: 'grey' };
        },
        getActionTitle(actionType) {
            const titles = {
                approved: 'Solicitud Aprobada',
                denied: 'Solicitud Denegada',
                delete: 'Solicitud de Eliminación',
                add: 'Adición',
                edit: 'Solicitud de Edición',
                payment: 'Actualización de Pago', // Título descriptivo para pagos
                default: 'Acción'
            };
            return titles[actionType] || titles.default;
        },

        // Obtener color para chips/resolución
        getResolutionColor(actionType) {
            return this.isResolution(actionType) ?
                (actionType === 'approved' ? 'green' : 'red') : 'grey';
        },

        // Obtener texto para chips/resolución
        getResolutionText(actionType) {
            return this.isResolution(actionType) ?
                (actionType === 'approved' ? 'Aprobado' : 'Denegado') : 'Pendiente';
        },

        // Obtener detalles de quién realizó la acción
        getActionDetails(item) {
            const actor = item.nameProfessional || 'Sistema';
            return this.isResolution(item.action_type) ?
                `Resuelto por: ${actor}` : `Acción por: ${actor}`;
        },

        // Obtener icono global según estado general
        getGlobalIcon(items) {
            const hasDenied = items.some(i => i.action_type === 'denied' || i.action_type === 'delete');
            const hasPending = items.some(i => !this.isResolution(i.action_type));

            if (hasDenied) return 'mdi-alert-octagon';
            if (hasPending) return 'mdi-alert-circle';
            return 'mdi-check-circle';
        },
        formatDateTime(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        formatNumber(value) {
            // Si el valor es menor que 1000, devuelve el valor original sin formato
            if (value < 1000) {
                return value;
            }

            // Primero, redondea el valor a dos decimales
            value = Math.round((value + Number.EPSILON) * 100) / 100;

            // Separa la parte entera de la parte decimal
            let parts = value.toString().split(".");
            let integerPart = parts[0];
            let decimalPart = parts.length > 1 ? "." + parts[1] : "";

            // Agrega los separadores de miles
            integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

            // Combina la parte entera y la parte decimal
            return integerPart + decimalPart;
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
            this.loadingCar = true;
            this.loadingOrder = true;
            this.loadingProduct = true;
            LocalStorageService.setIsLocked(true);
            this.$axios.get('branch-cars-delete', {
                    params: {
                        branch_id: this.branch_id
                    }
                })
                .then((response) => {
                    this.results = response.data.cars;
                    this.results1 = response.data.orders;
                    this.results2 = response.data.cashier;
                    console.log('this.results2 productos');
                    console.log(this.results2);
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.loadingCar = false;
                    this.loadingOrder = false;
                    this.loadingProduct = false;
                });
        },

        deleteItem(item) {
            LocalStorageService.setIsLocked(true);
            let request = {
                id: item.id,
                professional_id: this.professional_id
            };
            this.$axios.post('car-destroy', request)
                .then(() => {
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.initialize();
                    this.showAlert("success", "Solicitud Aceptada correctamente", 3000)
                });
        },

        editItem(item) {
            LocalStorageService.setIsLocked(true);
            let request = {
                id: item.id,
                professional_id: this.professional_id
            };
            this.$axios.post('car-denegada', request)
                .then(() => {
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.initialize();
                    this.showAlert("success", "Solicitud denegada correctamente", 3000)
                });
        },



        //eliminar orden
        deleteItemOrder(item) {
            LocalStorageService.setIsLocked(true);
            let request = {
                id: item.id,
                professional_id: this.professional_id
            };
            this.$axios.post('order-destroy-web', request)
                .then(() => {
                    //this.initialize();
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.initialize();
                    this.showAlert("success", "Orden eliminada correctamente", 3000);
                });
        },

        editItemOrder(item) {
            LocalStorageService.setIsLocked(true);
            let request = {
                id: item.id,
                professional_id: this.professional_id
            };
            this.$axios.post('order-denegar', request)
                .then(() => {
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.initialize();
                    this.showAlert("success", "Solicitud denegada correctamente", 3000)
                });
        },

        //eliminar orden
        deleteItemProduct(item) {
            LocalStorageService.setIsLocked(true);
            let request = {
                id: item.id,
                professional_id: this.professional_id
            };
            this.$axios.post('cashiersale-destroy', request)
                .then(() => {
                    //this.initialize();
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.initialize();
                    this.showAlert("success", "Productos eliminados correctamente", 3000);
                });
        },
        //eliminar productos
        editItemProduct(item) {
            LocalStorageService.setIsLocked(true);
            let request = {
                id: item.id,
                professional_id: this.professional_id
            };
            this.$axios.post('cashiersale-denegar', request)
                .then(() => {
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.initialize();
                    this.showAlert("success", "Solicitud denegada correctamente", 3000)
                });
        },

    },
}
</script>

<style>
.fill-height {
    height: 100%;
}
</style>