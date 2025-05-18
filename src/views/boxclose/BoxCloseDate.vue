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
            <span class="text-subtitle-1"> <strong>Clientes Atendidos por días</strong></span>
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
                  <v-img :src="`${this.$axios.defaults.baseURL}images/${item.image_url}?t=${Date.now()}`" alt="image"></v-img>
                </v-avatar>
                {{ item.professionalName }}
              </template>

              <template v-slot:item.clientName="{ item }">

                <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                  <v-img :src="`${this.$axios.defaults.baseURL}images/${item.client_image}?t=${Date.now()}`" alt="image"></v-img>
                </v-avatar>
                {{ item.clientName }}
              </template>
              <template v-slot:item.technical_assistance="{ item }">
                {{ formatNumber(item.technical_assistance) }}
              </template>
              <template v-slot:item.product="{ item }">
                {{ formatNumber(item.product) }}
              </template>
              <template v-slot:item.service="{ item }">
                {{ formatNumber(item.service) }}
              </template>
              <template v-slot:item.tip="{ item }">
                {{ formatNumber(item.tip) }}
              </template>
              <template v-slot:item.amount="{ item }">
                {{ formatNumber(item.amount) }}
              </template>
              <template v-slot:item.action_descriptions="{ item }">
                <div>
                  <v-chip @click="dialogActions = true; currentActions = item.action_descriptions"
                    color="indigo-darken-2" small class="px-2" :disabled="!item.action_descriptions?.length">
                    <v-icon left color="indigo-darken-2" icon="mdi-clipboard-text-outline" />
                    {{ item.action_descriptions.length }}
                  </v-chip>

                  <v-dialog v-model="dialogActions" max-width="540px">
                    <v-card>
                      <v-toolbar color="#F18254">
                        <v-row align="center">
                          <v-col cols="12" md="5" class="grow ml-4">
                            <span class="text-subtitle-1"><strong>Detalles de Solicitudes</strong></span>
                          </v-col>
                          <v-col cols="12" md="5"></v-col>
                          <v-col cols="12" md="1"></v-col>
                        </v-row>
                      </v-toolbar>

                      <v-card-text>
                        <v-card v-for="(action, index) in currentActions" :key="index" class="mb-6">
                          <v-card-title>
                            <v-list-item :subtitle="formatDateTime(action.timestamp)"
                              :title="action.nameProfessional || 'Usuario'">
                              <template v-slot:prepend>
                                <v-avatar>
                                  <v-img :src="'https://testapi.simplifies.cl/api/images/' + action.image" alt="image"></v-img>
                                </v-avatar>
                              </template>
                              <template v-slot:append>
                                <v-avatar color="grey-lighten-1" size="small">
                                  {{ index + 1 }}
                                </v-avatar>
                              </template>
                            </v-list-item>
                          </v-card-title>
                          <v-divider></v-divider>

                          <v-card-text>
                            <v-list-item :subtitle="action.description" :title="getActionTitle(action.action_type)">
                              <template v-slot:prepend>
                                <v-avatar color="white">
                                  <v-icon :color="getActionColor(action.action_type)" size="30">{{
                                    getActionIcon(action.action_type) }}</v-icon>
                                </v-avatar>
                              </template>
                            </v-list-item>
                          </v-card-text>
                        </v-card>
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="#E7E9E9" variant="flat" @click="dialogActions = false">
                          Cerrar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
              </template>
              <template v-slot:item.change_log="{ item }">
                <div>
                  <v-chip @click="dialogChages = true; cambiosProcesados = procesarChangeLog(item.change_log)"
                    color="teal-darken-3" small class="px-2" :disabled="!item.change_log?.length">
                    <v-icon left color="teal-darken-3" icon="mdi-history" />
                    {{ item.change_log.length }}
                  </v-chip>

                  <v-dialog v-model="dialogChages" max-width="700px">
                    <v-card>
                      <v-toolbar color="#F18254">
                        <v-row align="center">
                          <v-col cols="12" md="5" class="grow ml-4">
                            <span class="text-subtitle-1"><strong>Historial de Cambios</strong></span>
                          </v-col>
                        </v-row>
                      </v-toolbar>

                      <v-card-text>
                        <v-card v-for="(registro, index) in cambiosProcesados" :key="index" class="mb-6">
                          <v-card-title>
                            <v-list-item :subtitle="formatFecha(registro.timestamp)" :title="registro.nameProfessional">
                              <template v-slot:prepend>
                                <v-avatar>
                                  <v-img :src="'https://testapi.simplifies.cl/api/images/' + registro.image" alt="image"></v-img>
                                </v-avatar>
                              </template>
                              <template v-slot:append>
                                <v-avatar color="grey-lighten-1" size="small">
                                  {{ index + 1 }}
                                </v-avatar>
                              </template>
                            </v-list-item>
                          </v-card-title>

                          <v-divider></v-divider>

                          <v-card-text>
                            <v-list density="compact">
                              <v-list-item v-for="(cambio, i) in registro.listaCambios" :key="i">
                                <v-list-item-content>
                                  <v-list-item-title :class="iconoCambio(cambio).color + '--text'">
                                    <v-list-item-icon>
                                      <v-icon :color="iconoCambio(cambio).color">
                                        {{ iconoCambio(cambio).icon }}
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
                        <v-btn color="#E7E9E9" variant="flat" @click="dialogChages = false">
                          Cerrar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
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
    loadingrules: false,
    dialogActions: false,
    currentActions: [],
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
    message_delete: true,
    dialogDelete: false,
    headers: [
      { title: 'Profesional', value: 'professionalName', sortable: true },
      { title: 'Cliente', value: 'clientName', sortable: true },
      { title: 'Teléfono', key: 'phone', sortable: false },
      { title: 'Técnico', value: 'technical_assistance', sortable: true },
      { title: 'Productos', value: 'product', sortable: true },
      { title: 'Servicios', value: 'service', sortable: true },
      { title: 'Propina', value: 'tip', sortable: true },
      { title: 'Monto Total', value: 'amount', sortable: true },
      { title: 'Solicitudes', value: 'action_descriptions' },
      { title: 'Cambios', value: 'change_log' },
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
      const formattedDate = today.toLocaleDateString('es-CL', {
          timeZone: 'America/Santiago',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
      }).split('-').reverse().join('-'); // Convierte "DD-MM-YYYY" a "YYYY-MM-DD"

      const requestParams = {
        branch_id: this.branch_id,
        data: formattedDate,
      };

      try {
        const result = await handleRequest({
          endpoint: 'branch-cars-date',
          method: 'GET',
          params: requestParams // Aquí pasas los parámetros
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.results = result.data.cars || []; // Si no hay roles, asigna un arreglo vacío
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