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
            <span class="text-subtitle-1"> <strong>Solicitudes de compra de productos</strong></span>
          </v-col>
          <v-col cols="12" md="4"></v-col>
          <v-col cols="12" md="2">
          </v-col>

        </v-row>

      </v-toolbar>
      <v-row dense class="ml-5 mt-5" v-if="this.mostrarFila">
        <v-col cols="12" md="3" >
          <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches"
            label="Seleccione una Sucursal" prepend-icon="mdi-store" item-title="name" item-value="id"
            variant="underlined"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="2">
          <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
            offset-y min-width="290px">
            <template v-slot:activator="{ props }">
              <v-text-field v-bind="props" :modelValue="dateFormatted" variant="underlined" prepend-icon="mdi-calendar"
                label="Fecha"></v-text-field>
            </template>
            <v-locale-provider locale="es">
              <v-date-picker header="Calendario" title="Seleccione la fecha" color="#F18254" :modelValue="input"
                @update:model-value="updateDate" format="yyyy-MM-dd"></v-date-picker>
            </v-locale-provider>
          </v-menu>
        </v-col>
        <v-col cols="12" md="1">
          <v-btn icon @click="initialize()" color="#F18254">
            <v-icon>mdi-magnify</v-icon></v-btn>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <v-card-text>
            <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details></v-text-field>
            <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="results"
              :search="search" class="elevation-1" style="max-height: 55vh; overflow-y: auto;"
              no-data-text="No hay datos disponibles" no-results-text="No hay datos disponibles" :loading="loadingrules"
              loading-text="Cargando datos...">
              <template v-slot:item.professionalName="{ item }">
                <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                  <v-img :src="`${this.$axios.defaults.baseURL}images/${item.professionalImage}?t=${Date.now()}`"
                    alt="image"></v-img>
                </v-avatar>
                {{ item.professionalName }}
              </template>

              <template v-slot:item.productName="{ item }">

                <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                  <v-img :src="`${this.$axios.defaults.baseURL}images/${item.productImage}?t=${Date.now()}`"
                    alt="image"></v-img>
                </v-avatar>
                {{ item.productName }}
              </template>
              <template v-slot:item.total="{ item }">
                {{ formatNumber(item.total) }}
              </template>
              <template v-slot:item.status="{ item }">
                <div class="d-flex align-center">
                  <!-- Chip de estado -->
                  <v-chip :color="getStatusColor(item.status)" text-color="black" density="comfortable"
                    class="font-weight-bold mr-2">
                    <v-icon :icon="getStatusIcon(item.status)" start size="small"></v-icon>
                    {{ getStatusText(item.status) }}
                  </v-chip>

                  <!-- Contenedor para botones/menú -->
                  <template v-if="item.status === 0">
                    <v-menu v-model="statusMenu[item.id]" offset-y>
                      <template v-slot:activator="{ props }">
                        <v-btn density="comfortable" icon="mdi-pencil" v-bind="props" color="primary" variant="tonal"
                          elevation="1" class="mr-1 mt-1 mb-1" title="Cambiar estado" :disabled="item.data !== this.today"></v-btn>
                      </template>
                      <v-list density="compact">
                        <v-list-item @click="updateStatus(item, 1)">
                          <template v-slot:prepend>
                            <v-btn density="comfortable" icon="mdi-check" color="success" variant="tonal"
                              elevation="1" class="mr-3" title="Aprobar"></v-btn>
                          </template>
                          <v-list-item-title>Aprobar</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="updateStatus(item, 2)">
                          <template v-slot:prepend>
                            <v-btn density="comfortable" icon="mdi-close" color="error" variant="tonal"
                              elevation="1" class="mr-3" title="Denegar"></v-btn>
                          </template>
                          <v-list-item-title>Denegar</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </template>

                  <template v-else>
                    <v-btn density="comfortable" icon="mdi-lock" color="grey" variant="tonal"
                              elevation="1" title="Estado no editable"></v-btn>
                  </template>
                </div>
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

export default {
  data: () => ({
    loadingrules: false,
    dialogActions: false,
    currentActions: [],
    statusMenu: {},
    dialogChages: false,
    cambiosProcesados: [], // Aquí se almacenarán los cambios procesados
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
    today: null,
    message_delete: true,
    dialogDelete: false,
    headers: [
      { title: 'Profesional', value: 'professionalName', sortable: true },
      { title: 'Producto', value: 'productName', sortable: true },
      { title: 'Cantidad', key: 'cant', sortable: false },
      { title: 'Total', value: 'total', sortable: true },
      { title: 'Estado', value: 'status', sortable: true },
      { title: 'Acciones', value: 'actions' },
    ],
    results: [],
    rules: [],
    branches: [],
    editedIndex: -1,
    editedItem: {
      id: '',
      data: null,
      status: ""
    },
    data: {},
    defaultItem: {
      id: '',
      data: null,
      status: ""
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
    getDate() {
      return this.input ? new Date(this.input).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
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
    this.today = new Date().toISOString().split('T')[0];
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
      const today = new Date();
      const formattedDate = this.date ? this.date : today.toISOString().split('T')[0]; // Formato: YYYY-MM-DD

      const requestParams = {
        branch_id: this.branch_id,
        data: formattedDate,
      };

      try {
        const result = await handleRequest({
          endpoint: 'worker-purchase',
          method: 'GET',
          params: requestParams // Aquí pasas los parámetros
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.results = result.data.data || []; // Si no hay roles, asigna un arreglo vacío
        } else {
          this.loadingrules = false;
          // Si no hay datos, asignamos un array vacío
          this.results = [];
        }
      } catch (error) {
        this.loadingrules = false;
        // Captura de errores no controlados
        this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
      } finally {
        this.loadingrules = false;
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

    openStatusMenu(item) {
    this.$set(this.statusMenu, item.id, true);
  },
  
  async updateStatus(item, newStatus) {
    this.loadingrules = true;
            this.data = {};
            this.data.id = item.id;
            this.data.status = newStatus;
            try {
                const result = await handleRequest({
                    endpoint: "worker-purchase-update",
                    method: "POST",
                    data: this.data,
                });

                // Manejo de la respuesta según el resultado
                if (result.success) {
                    this.showAlert("success", result.message, 3000);
                } else {
                    this.showAlert("warning", result.message, 3000);
                  this.loadingrules = false;
                }
            } catch (error) {
                // Este bloque captura errores inesperados fuera del manejo estándar
                this.showAlert(
                    "error",
                    "Ocurrió un error inesperado al procesar la solicitud.",
                    3000
                );
              this.loadingrules = false;
            } finally {
              this.loadingrules = false;
                this.initialize();
            }
  },
  
  getStatusColor(status) {
    return {
      0: 'orange',
      1: 'green', 
      2: 'red'
    }[status];
  },
  
  getTextColor(status) {
    return 'black'; // Texto siempre negro como en tu estándar
  },
  
  getStatusIcon(status) {
    return {
      0: 'mdi-clock-outline',
      1: 'mdi-check-circle',
      2: 'mdi-close-circle'
    }[status];
  },
  
  getStatusText(status) {
    return {
      0: 'Pendiente',
      1: 'Aprobado',
      2: 'Denegado'
    }[status];
  }
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