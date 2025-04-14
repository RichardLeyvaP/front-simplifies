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
                        <span class="text-subtitle-1"> <strong>Solicitudes de Adelanto</strong></span>
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
                    <v-btn icon @click="advances()" color="#F18254">
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
                                    <v-img :src="`${this.$axios.defaults.baseURL}images/${item.image}?t=${Date.now()}`"
                                        alt="image"></v-img>
                                </v-avatar><!--+'?$'+Date.now()-->
                                {{ item.professionalName }}
                            </template>
                            <template v-slot:item.amount="{ item }">
                                {{ formatNumber(item.amount) }}
                            </template>
                            <template v-slot:item.status="{ item }">
                                <v-chip small variant="flat" :color="getStatusColor(item.status).color"
                                    class="font-weight-bold text-black"
                                    :prepend-icon="getStatusColor(item.status).icon">
                                    {{ item.status }}
                                </v-chip>
                            </template>
                            <template v-slot:item.receipt="{ item }">
                                <v-btn density="comfortable" icon="mdi-file-document-outline"
                                    :color="(item.receipt && item.receipt !== 'advances/default.jpg') ? 'green' : 'grey'"
                                    :disabled="!(item.receipt && item.receipt !== 'advances/default.jpg')"
                                    @click="(item.receipt && item.receipt !== 'advances/default.jpg') && openModal(item.receipt)"
                                    variant="tonal" elevation="1" class="mr-1 mt-1 mb-1"
                                    :title="(item.receipt && item.receipt !== 'advances/default.jpg') ? 'Ver comprobante' : 'No hay comprobante disponible'"></v-btn>
                            </template>
                            <template v-slot:item.actions="{ item }">
                                <v-btn density="comfortable" icon="mdi-cash-check"
                                    @click="(item.status === 'Aprobado') && advancePay(item)"
                                    :color="(item.status === 'Aprobado') ? 'green' : 'grey'" variant="tonal"
                                    elevation="1" class="mr-1 mt-1 mb-1"
                                    :title="(item.status === 'Aprobado') ? 'Realizar pago' : 'Solo disponible para solicitudes aprobadas'"></v-btn>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
    <v-dialog v-model="dialogPhoto" max-width="600px">
        <v-card>
            <v-toolbar color="#F18254">
                <span class="text-subtitle-2 ml-4">Comprobante</span> <v-spacer></v-spacer>
                <v-btn 
                @click="dialogPhoto = false" 
                icon 
                color="#E7E9E9" variant="flat"
                aria-label="Cerrar diálogo"
                >
                <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text>
                <template v-if="loadingImage">
                    <!-- Centro el cargador dentro de su contenedor y aumento su tamaño -->
                    <div class="d-flex justify-center align-center" style="min-height: 200px;">
                        <v-progress-circular indeterminate color="#F18254"
                            style="width: 100px; height: 100px;"></v-progress-circular>
                    </div>
                </template>
                <template v-else>
                    <v-img :src="selectedImageUrl" aspect-ratio="1.5" contain fill-height></v-img>
                </template>
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" max-width="600px">
        <v-form ref="form" v-model="valid" enctype="multipart/form-data">
            <v-card>
                <v-toolbar color="#F18254">
                    <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-menu v-model="menu3" :close-on-content-click="false" :nudge-right="40"
                                    transition="scale-transition" offset-y min-width="290px">
                                    <template v-slot:activator="{ props }">
                                        <v-text-field v-bind="props" :modelValue="dateFormatted3" variant="underlined"
                                            prepend-icon="mdi-calendar" label="Fecha" density="compact"></v-text-field>
                                    </template>
                                    <v-locale-provider locale="es">
                                        <v-date-picker header="Calendario" title="Seleccione la fecha" color="#F18254"
                                            :modelValue="input3" @update:model-value="updateDate3" format="yyyy-MM-dd"
                                            :min="new Date().toISOString().split('T')[0]"></v-date-picker>
                                    </v-locale-provider>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select v-model="editedItem.status" :items="statusOptions" item-value="value"
                                    item-title="text" label="Estado" :prepend-icon="getStatusIcon(editedItem.status)"
                                    variant="underlined" density="compact" :rules="[v => v === 'Pagado']">
                                    <template v-slot:item="{ props }">
                                        <v-list-item v-bind="props">
                                            <template v-slot:prepend>
                                                <v-icon :color="getStatusColor(props.value).color">
                                                    {{ getStatusIcon(props.value) }}
                                                </v-icon>
                                            </template>
                                        </v-list-item>
                                    </template>
                                </v-select>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-file-input clearable v-model="file" ref="fileInput" label="Comprobante"
                                    variant="underlined" density="compact" name="file" accept=".png, .jpg, .jpeg"
                                    @change="onFileSelected">
                                </v-file-input>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                                    <img v-if="imagenDisponible()" :src="imgedit" height="120" width="210">
                                </v-card>


                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#E7E9E9" variant="flat" @click="close">Cancelar</v-btn>
                    <v-btn color="#F18254" variant="flat" @click="save" :disabled="!valid"
                        :loading="loading">Aceptar</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
</template>
<script>

import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api";
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
        file: null,
        imgMiniatura: '',
        showType: true,
        dialogPhoto: false,
        loadingImage: false,
        selectedImageUrl: '',
        message_delete: true,
        dialogDelete: false,
        headers: [
            { title: 'Fecha', key: 'data', sortable: true },
            { title: 'Profesional', key: 'professionalName', sortable: true },
            { title: 'Monto', key: 'amount', sortable: true },
            { title: 'Estado', key: 'status', sortable: true },
            { title: 'Comprobante', key: 'receipt' },
            { title: 'Acciones', key: 'actions', sortable: false },
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
            data: ''
        },
        data: {},
        defaultItem: {
            id: '',
            status: '',
            receipt: '',
            data: ''
        },
        menu: false,
        menu2: false,
        menu3: false,
        input: null,
        input2: null,
        input3: null,
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
        imgedit() {
            return this.imgMiniatura;
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
        dateFormatted3() {
            const date = this.input3 ? new Date(this.input3) : new Date();
            return date.toISOString().split('T')[0];
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
                //data: this.date ? format(new Date(this.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
            };
            try {
                const result = await handleRequest({
                    endpoint: 'advance-period',
                    method: 'GET',
                    params: requestParams // Aquí pasas los parámetros
                });

                if (result.success) {
                    // Si la solicitud es exitosa, asignamos las sucursales
                    this.results = result.data.advances;
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

        getStatusColor(status) {
            const statusMap = {
                'Pendiente': { color: 'amber-lighten-3', icon: 'mdi-clock-alert-outline' },
                'Aprobado': { color: 'blue-lighten-3', icon: 'mdi-check-decagram-outline' },
                'Pagado': { color: 'green-lighten-3', icon: 'mdi-cash-check' },
                'default': { color: 'grey-lighten-2', icon: 'mdi-help-circle-outline' }
            };

            return statusMap[status] || statusMap.default;
        },
        getStatusIcon(status) {
            return this.getStatusColor(status).icon;
        },
        async advances() {
            this.loadingrules = true;
            LocalStorageService.setIsLocked(true);
            const requestParams = {
                branch_id: this.branch_id,
                startDate: this.date ? this.date : new Date().toISOString().split('T')[0],
                endDate: this.endDate ? this.endDate : new Date().toISOString().split('T')[0]
            };
            try {
                const result = await handleRequest({
                    endpoint: 'advance-period',
                    method: 'GET',
                    params: requestParams // Aquí pasas los parámetros
                });

                if (result.success) {
                    // Si la solicitud es exitosa, asignamos las sucursales
                    this.results = result.data.advances;
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
        advancePay(item) {
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },
        close() {
            this.dialog = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
            });
            this.file = null;
            this.imgMiniatura = '';
        },
        async save() {
            this.valid = false;
            const formData = new FormData();
            for (let key in this.editedItem) {
            formData.append(key, this.editedItem[key]);
            }
            try {
                const result = await handleRequest({
                    endpoint: "advance-update-admin",
                    method: "POST",
                    data: formData,
                });

                // Manejo de la respuesta según el resultado
                if (result.success) {
                    this.showAlert("success", result.message, 3000);
                    this.initialize();
                } else {
                    this.showAlert("warning", result.message, 3000);
                }
            } catch (error) {
                // Este bloque captura errores inesperados fuera del manejo estándar
                this.showAlert(
                    "error",
                    "Ocurrió un error inesperado al procesar la solicitud.",
                    3000
                );
            } finally {
                this.initialize();
                this.close();
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
        openModal(imageUrl) {
            this.dialogPhoto = true;
            this.loadingImage = true;
            var img = new Image();
            img.src = `${this.$axios.defaults.baseURL}images/${imageUrl}`;

            img.onload = () => {
                this.selectedImageUrl = `${this.$axios.defaults.baseURL}images/${imageUrl}`;
                this.loadingImage = false;
                //this.dialogPhoto = true; // Abre el modal solo después de que la imagen esté cargada
            };

            img.onerror = () => {
                this.selectedImageUrl = '';
                this.dialogPhoto = false; // Abre el modal incluso si la carga falla, puede mostrar un mensaje de error o una imagen de respaldo
                this.loadingImage = false;
            };
        },
        imagenDisponible() {
            if (this.imgedit !== undefined && this.imgedit !== '') {
                // Intenta cargar la imagen en un elemento oculto para verificar si está disponible
                let img = new Image();
                img.src = this.imgedit;
                return true; // Devuelve true si la imagen está disponible
            }
            return false; // Si la URL de la imagen no está definida o está vacía, devuelve false
        },
        onFileSelected(event) {
            let file = event.target.files[0];
            // Validar el tamaño del archivo (500 KB máximo)
            const maxSize = 500 * 1024; // 500 KB en bytes
            if (file && file.size > maxSize) {
                this.valid = false;
                this.showAlert('warning', 'El archivo de imagen debe ser de máximo 500 KB', 3000);
                return; // Detener el proceso si el archivo es demasiado grande
            }
            this.valid = true;
            this.editedItem.receipt = file;
            //console.log(this.editedItem.image_cardgift);
            this.cargarImage(file);
        },
        cargarImage(file) {
            let reader = new FileReader();
            reader.onload = (e) => {
                this.imgMiniatura = e.target.result;
            }
            reader.readAsDataURL(file);
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