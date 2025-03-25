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
                <v-col cols="12" md="5" class="grow ml-4 t">
                    <span class="text-subtitle-1"> <strong>Actualizar productos</strong></span>
                </v-col>
                <v-col cols="12" md="4"></v-col>
            </v-row>
        </v-toolbar>
        <v-card-text>
            <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                hide-details></v-text-field>
            <!-- Botones globales de Aceptar y Cancelar -->
            <div v-if="changes.length > 0" class="d-flex justify-end my-4">
                <v-btn density="comfortable" class="ml-2" icon="mdi-check" @click="save" color="primary" variant="tonal"
                    elevation="1" title="Aceptar Actualizar existencia" :disabled="changes.length === 0" />
                <v-btn density="comfortable" class="ml-2" icon="mdi-close" @click="cancel" color="red-darken-4"
                    variant="tonal" elevation="1" title="Cancelar actualización" :disabled="changes.length === 0" />
            </div>
            <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :search="search"
                :items="results" class="elevation-1" no-results-text="No hay datos disponibles"
                no-data-text="No hay datos disponibles" :loading="loadingWorkPlace" loading-text="Cargando datos..."
                :group-by="groupBy" show-expand="false">
                <!-- Encabezado de grupo con botones de Aceptar y Cancelar -->
                <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
                    <tr>
                        <td :colspan="columns.length">
                            <div class="d-flex align-center">
                                <!-- Botón de expandir/colapsar grupo -->
                                <v-btn size="small" variant="text" :icon="isGroupOpen(item) ? '$expand' : '$next'"
                                    @click="toggleGroup(item)" />
                                {{ item.value }}
                                <v-spacer></v-spacer>
                            </div>
                        </td>
                    </tr>
                </template>
                <template v-slot:item.product_exit="{ item }">
                    <div class="d-flex align-center">
                        <span class="mx-2">{{ item.product_exit }}</span>
                        <v-icon :color="item.product_exit === 0 ? 'grey' : 'red'" :disabled="item.product_exit === 0"
                            @click="decrementProductExit(item)">
                            mdi-minus-circle
                        </v-icon>
                        <v-btn density="comfortable" icon="mdi-close" @click="cancelItem(item)" color="red-darken-4"
                            variant="tonal" elevation="1" class="mr-1 mt-1 mb-1" title="Cancelar actualización"
                            :disabled="!changes.some(change => change.id === item.id)"></v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script>

import { handleRequest } from "@/utils/api"; // Ruta al archivo
import LocalStorageService from "@/LocalStorageService";

export default {
    props: {
        branch_id: {
            type: Number,
            required: true
        },
    },
    data: () => ({
        loadingWorkPlace: true,
        valid: true,
        snackbar: false,
        sb_type: '',
        sb_message: '',
        sb_timeout: 2000,
        sb_title: '',
        sb_icon: '',
        charge: '',
        business_id: '',
        branches: '',
        search: '',
        mostrarFila: false,
        dialog: false,
        loading: false,
        groupBy: [
            {
                key: 'direccionStore',
            },
        ],
        headers: [
            { title: 'Nombre', key: 'name' },
            { title: 'Referencia', key: 'reference' },
            { title: 'Código', key: 'code' },
            { title: 'Existencia', align: 'start', value: 'product_exit' },
        ],
        results: [],
        changes: [], // Array para almacenar los cambios
        professionals: [],

        editedIndex: -1,

        editedItem: {
            id: '',
            product_exit: '',
            quantity: ''
        },
        data: {},

        defaultItem: {
            id: '',
            product_exit: '',
            quantity: ''
        },
        nameRules: [
            (v) => !!v || "El campo es requerido",
        ],
        selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nueva Convivencia' : 'Editar Estado de convivencia'
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
        //this.branch_id = LocalStorageService.getItem('branch_id');
        //this.charge_id = LocalStorageService.getItem('charge_id');
        this.charge = JSON.parse(LocalStorageService.getItem("charge"));
        LocalStorageService.setIsLocked(true);
        // Crear un objeto para los parámetros
        /*const requestParams = {
            business_id: this.business_id,
        };

        try {
            this.loading = true;
            const result = await handleRequest({
                endpoint: 'show-business',
                method: 'GET',
                params: requestParams // Aquí pasas los parámetros
            });

            if (result.success) {
                // Si la solicitud es exitosa, asignamos las sucursales
                this.branches = result.data.branches || []; // Si no hay roles, asigna un arreglo vacío
            } else {
                // Si no hay datos, asignamos un array vacío
                this.branches = [];
            }
        } catch (error) {
            this.loading = false;
            // Captura de errores no controlados
            this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
        } finally {
            LocalStorageService.setIsLocked(false);
            if (this.charge === 'Administrador') {
                this.branch_id = this.branches[0].id;
                this.mostrarFila = true;
            }
        }*/
        await this.initialize();
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
        /*decrementProductExit(item) {
            if (item.product_exit > 0) {
                item.product_exit -= 1; // Decrementa en 1
                item.quantity += 1; // Actualiza editedItem.quantity
            }
        },*/
        decrementProductExit(item) {
            if (item.product_exit > 0) {
                item.product_exit -= 1; // Decrementa en 1

                // Buscar si el item ya está en el array de cambios
                const existingChange = this.changes.find(change => change.id === item.id);

                if (existingChange) {
                    // Si ya existe, actualizar la cantidad
                    existingChange.quantity += 1;
                } else {
                    // Si no existe, agregar un nuevo cambio
                    this.changes.push({
                        id: item.id,
                        product_exit: item.product_exit,
                        quantity: 1,
                    });
                }
            }
        },
        async initialize() {
            this.loadingWorkPlace = true;
            LocalStorageService.setIsLocked(true);
            this.changes = [];
            const requestParams = {
                branch_id: this.branch_id
            };

            try {
                const result = await handleRequest({
                    endpoint: 'productstore-show-state',
                    method: 'GET',
                    params: requestParams // Aquí pasas los parámetros
                });

                if (result.success) {
                    // Si la solicitud es exitosa, asignamos las sucursales
                    this.results = result.data.products || []; // Si no hay roles, asigna un arreglo vacío
                } else {
                    LocalStorageService.setIsLocked(false);
                    // Si no hay datos, asignamos un array vacío
                    this.results = [];
                }
            } catch (error) {
                this.loadingWorkPlace = false;
                // Captura de errores no controlados
                this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
            } finally {
                LocalStorageService.setIsLocked(false);
                this.loadingWorkPlace = false;
            }
        },
        async save(item) {
            LocalStorageService.setIsLocked(true);
            this.loading = true;
            /*const requestParams = {
                id: item.id,
                quantity: item.quantity,
            };*/
            const requestParams = {
                changes: this.changes,
                branch_id: this.branch_id,
            }
            try {
                const result = await handleRequest({
                    endpoint: 'productstore-exit',
                    method: 'PUT',
                    params: requestParams // Aquí pasas los parámetros
                });

                if (result.success) {
                    this.loading = false;
                    this.showAlert("success", "Productos actualizados correctamente", 3000);
                }
            } catch (error) {
                this.loading = false;
                LocalStorageService.setIsLocked(false);
                // Captura de errores no controlados
                this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
            } finally {
                this.loading = false;
                LocalStorageService.setIsLocked(false);
                await this.initialize();
            }
            //
        },
        /*cancel(item) {
            // Restaurar el valor original de product_exit (si es necesario)
            item.product_exit += item.quantity;
        },*/
        cancel() {
            // Restaurar el valor original de product_exit para cada cambio
            this.changes.forEach(change => {
                const item = this.results.find(result => result.id === change.id);
                if (item) {
                    item.product_exit += change.quantity;
                }
            });

            // Limpiar el array de cambios
            this.changes = [];
        },
        cancelItem(item) {
            // Buscar el cambio correspondiente al ítem seleccionado
            const changeIndex = this.changes.findIndex(change => change.id === item.id);

            // Si se encuentra el cambio
            if (changeIndex !== -1) {
                // Restaurar el valor original de product_exit
                item.product_exit += this.changes[changeIndex].quantity;

                // Eliminar el cambio del array changes
                this.changes.splice(changeIndex, 1);
            }
        },
    },
}
</script>

<style scoped>
.d-flex {
    display: flex;
    align-items: center;
}

.justify-end {
    justify-content: flex-end;
}

.mx-2 {
    margin-left: 8px;
    margin-right: 8px;
}

.mr-1 {
    margin-right: 4px;
}

.mt-1 {
    margin-top: 4px;
}

.mb-1 {
    margin-bottom: 4px;
}
</style>