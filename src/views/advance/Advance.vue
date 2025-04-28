<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-snackbar
    class="mt-12"
    location="right top"
    :timeout="sb_timeout"
    :color="sb_type"
    elevation="24"
    :multi-line="true"
    vertical
    v-model="snackbar"
  >
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
        <v-col cols="12" md="10" class="grow t">
          <span class="text-subtitle-1 ml-2">
            <strong>Solicitudes de Adelanto</strong></span
          >
        </v-col>
        <v-col cols="12" md="2"> </v-col>
      </v-row>
    </v-toolbar>
    <v-card-text>
      <v-text-field
        class="mt-1 mb-1"
        v-model="search"
        append-icon="mdi-magnify"
        label="Buscar"
        single-line
        hide-details
      ></v-text-field>
      <v-data-table
        :headers="headers"
        :items-per-page-text="'Elementos por páginas'"
        :search="search"
        :items="results"
        class="elevation-1"
        no-results-text="No hay datos disponibles"
        no-data-text="No hay datos disponibles"
        :loading="loadingWorkPlace"
        loading-text="Cargando datos..."
      >
        <template v-slot:item.professionalName="{ item }">
          <v-avatar class="mr-1" elevation="3" color="grey-lighten-4" size="small">
            <v-img
              :src="`${this.$axios.defaults.baseURL}images/${item.image}?t=${Date.now()}`"
              alt="image"
            ></v-img> </v-avatar
          ><!--+'?$'+Date.now()-->
          {{ item.professionalName }}
        </template>
        <template v-slot:item.amount="{ item }">
          {{ formatNumber(item.amount) }}
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip
            small
            variant="flat"
            :color="getStatusColor(item.status).color"
            class="font-weight-bold text-black"
            :prepend-icon="getStatusColor(item.status).icon"
          >
            {{ item.status }}
          </v-chip>
        </template>
        <!--<template v-slot:item.actions="{ item }">
          <v-btn
            density="comfortable"
            icon="mdi-cash-check"
            @click="item.status === 'Pendiente' && save(item)"
            :color="item.status === 'Pendiente' ? 'green' : 'grey'"
            variant="tonal"
            elevation="1"
            class="mr-1 mt-1 mb-1"
            :title="
              item.status === 'Pendiente'
                ? 'Realizar pago'
                : 'Solo disponible para solicitudes pendientes'
            "
          ></v-btn> </template>-->
          <template v-slot:item.actions="{ item }">
          <v-btn
            density="comfortable"
            icon="mdi-cash-check"
            @click="save(item)"
            :color="getPayButtonColor(item)"
            variant="tonal"
            elevation="1"
            class="mr-1 mt-1 mb-1"
            :disabled="!isPayable(item)"
            :title="getPayButtonTitle(item)"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

  <v-dialog v-model="dialog" max-width="500px">
    <!-- <template v-slot:activator="{ props }">
                <v-btn v-bind="props" class="text-subtitle-1  ml-12 " color="#E7E9E9" variant="flat" elevation="2"
                  prepend-icon="mdi-plus-circle">
                  Nuevo Puesto
                </v-btn>
              </template>-->
    <v-card>
      <v-toolbar color="#F18254">
        <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
      </v-toolbar>
      <v-card-text>
        <v-form ref="form" v-model="valid" enctype="multipart/form-data">
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <v-select
                  v-model="editedItem.estado"
                  :items="states"
                  item-value="id"
                  item-title="name"
                  label="Estado de la convivencia"
                  outlined
                >
                  <!-- Personalizar el ítem seleccionado -->
                  <template v-slot:selection="{ item }">
                    <v-icon :color="getEstadoInfo(item.raw.id).color" class="mr-2">
                      {{ getEstadoInfo(item.raw.id).icon }}
                    </v-icon>
                    {{ getEstadoInfo(item.raw.id).name }}
                  </template>

                  <!-- Personalizar cada ítem en la lista desplegable 
                          <template v-slot:item="{ item }">
                            <v-list-item>
                              <template v-slot:prepend>
                                <v-icon :color="getEstadoInfo(item.raw.id).color" class="mr-2">
                                  {{ getEstadoInfo(item.raw.id).icon }}
                                </v-icon>
                              </template>
                              <v-list-item-title>{{ getEstadoInfo(item.raw.id).name }}</v-list-item-title>
                            </v-list-item>
                          </template>-->
                </v-select>
              </v-col>
            </v-row>
          </v-container>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="close"> Cancelar </v-btn>
            <v-btn
              color="#F18254"
              variant="flat"
              @click="save"
              :disabled="!valid"
              :loading="loadingWorkPlace"
            >
              Aceptar
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import LocalStorageService from "@/LocalStorageService";
import _ from "lodash";

export default {
  props: {
    branch_id: {
      type: Number,
      required: true,
    },
    isExtractionEnabled: {
      // Nueva prop
      type: Boolean,
      default: false, // Por defecto deshabilitado
    },
  },
  data: () => ({
    loadingWorkPlace: true,
    valid: true,
    snackbar: false,
    sb_type: "",
    sb_message: "",
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    charge: "",
    business_id: "",
    branches: "",
    search: "",
    mostrarFila: false,
    dialog: false,
    dialogDelete: false,
    status: [
      { id: "Pendiente", name: "Pendiente", icon: "mdi-help-circle", color: "grey" },
      { id: "Pagado", name: "Pagado", icon: "mdi-check-circle", color: "green" },
    ],
    headers: [
      { title: "Nombre del profesional", value: "professionalName" },
      { title: "Estado", value: "status" },
      { title: "Monto solicitado", value: "amount" },
      { title: "Acciones", key: "actions", sortable: false },
    ],
    results: [],
    changes: [],
    resultsOriginal: [],
    professionals: [],

    editedIndex: -1,

    editedItem: {
      id: "",
      status: "",
    },
    data: {},

    defaultItem: {
      id: "",
      status: "",
    },
    nameRules: [(v) => !!v || "El campo es requerido"],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Nuevo Adelanto"
        : "Editar Estado del adelanto";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    results: {
      deep: true,
      handler(newVal) {
        this.checkPendingStatus();
      },
    },
    /*results(newVal) {
    const hasStateThree = newVal.some(item => item.estado === 3);
    //const arraysAreEqual = _.isEqual(newVal, this.resultsOriginal); // Usamos lodash para comparación profunda
    
    // Emitimos false si:
    // 1. No hay estado 3 Y los arrays son iguales
    // O emitimos true si:
    // 1. Hay estado 3 O los arrays son diferentes
    this.$emit('update:has-invalid-state', hasStateThree);
  }*/
  },

  async mounted() {
    this.business_id = LocalStorageService.getItem("business_id");
    //this.branch_id = LocalStorageService.getItem('branch_id');
    //this.branch_id = this.branch.id;
    this.charge_id = LocalStorageService.getItem("charge_id");
    this.charge = JSON.parse(LocalStorageService.getItem("charge"));
    LocalStorageService.setIsLocked(true);
    await this.initialize();
  },

  methods: {
    showAlert(sb_type, sb_message, sb_timeout) {
      this.sb_type = sb_type;

      if (sb_type == "success") {
        this.sb_title = "Éxito";
        this.sb_icon = "mdi-check-circle";
      }

      if (sb_type == "error") {
        this.sb_title = "Error";
        this.sb_icon = "mdi-check-circle";
      }

      if (sb_type == "warning") {
        this.sb_title = "Advertencia";
        this.sb_icon = "mdi-alert-circle";
      }
      this.sb_message = sb_message;
      this.sb_timeout = sb_timeout;
      this.snackbar = true;
    },
    /*checkPendingStatus() {
      const hasPending = this.results.some((item) => item.status === "Pendiente");

      if (!hasPending) {
        // Calcular suma de amount con status "Pagado"
        const totalPagado = this.results
          .filter(item => item.status === 'Pagado')
          .reduce((sum, item) => sum + (item.amount || 0), 0);
        console.log('totalPagado:', totalPagado);
        // Emitir evento al padre con el total
        this.$emit('total-pagado-calculated', totalPagado);
      }
      // Emitir evento al padre con el estado actual
      this.$emit("update:has-invalid-state", hasPending);
    },*/
    checkPendingStatus() {
  const hasPending = this.results.some(item => item.status === "Pendiente");

  if (!hasPending) {
    const totalPagado = this.results
          .filter(item => item.status === 'Pagado')
          .reduce((sum, item) => sum + (item.amount || 0), 0);
    
    console.log('[Hijo] Emitiendo totalPagado:', totalPagado, 'Tipo:', typeof totalPagado);
    
    // Emitir de dos formas diferentes para asegurar
    this.$emit('total-pagado-calculated', totalPagado);
  }
  
  this.$emit("update:has-invalid-state", hasPending);
},
    formatNumber(value) {
      // Verificar si el valor es 0, null, undefined o no es un número
      if (value === 0 || value === null || value === undefined || isNaN(value)) {
        return "0.0";
      }
      // Si el valor es menor que 1000, devuelve el valor original con dos decimales
      if (value < 1000) {
        return (Math.round((value + Number.EPSILON) * 100) / 100).toLocaleString(
          "en-US",
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        );
      }

      // Primero, redondea el valor a dos decimales
      value = Math.round((value + Number.EPSILON) * 100) / 100;

      // Convierte el valor a cadena con formato de número local (en-US)
      let formattedValue = value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return formattedValue;
    },
    getStatusColor(status) {
      const statusMap = {
        Pendiente: { color: "amber-lighten-3", icon: "mdi-clock-alert-outline" },
        Aprobado: { color: "blue-lighten-3", icon: "mdi-check-decagram-outline" },
        Pagado: { color: "green-lighten-3", icon: "mdi-cash-check" },
        default: { color: "grey-lighten-2", icon: "mdi-help-circle-outline" },
      };

      return statusMap[status] || statusMap.default;
    },
    getStatusIcon(status) {
      return this.getStatusColor(status).icon;
    },
    /*async initialize() {
      this.loadingWorkPlace = true;
      LocalStorageService.setIsLocked(true);
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0]; // Formato: YYYY-MM-DD

      const requestParams = {
        branch_id: this.branch_id,
        date: formattedDate,
      };

      try {
        const result = await handleRequest({
          endpoint: "advance-branch-pendents",
          method: "GET",
          params: requestParams, // Aquí pasas los parámetros
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.results = result.data.advances || []; // Si no hay roles, asigna un arreglo vacío
          this.resultsOriginal = _.cloneDeep(this.results);
        } else {
          LocalStorageService.setIsLocked(false);
          this.loadingWorkPlace = false;
          // Si no hay datos, asignamos un array vacío
          this.results = [];
          this.resultsOriginal = [];
        }
      } catch (error) {
        this.loadingWorkPlace = false;
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al procesar la solicitud.",
          3000
        );
      } finally {
        LocalStorageService.setIsLocked(false);
        this.loadingWorkPlace = false;
      }
    },
    async save(item) {
      LocalStorageService.setIsLocked(true);
      this.data = {};
      this.valid = false;
      this.editedIndex = 1;
      this.editedItem = Object.assign({}, item);
      this.loadingWorkPlace = true;

      //this.data = {};
      this.data.id = this.editedItem.id;
      this.data.status = 'Pagado';
      try {
        const result = await handleRequest({
          endpoint: "advance-update",
          method: "POST",
          data: this.data, // Aquí pasas los parámetros
        });

        if (result.success) {
          this.dialog = false;
          this.showAlert(
            "success",
            "Estado de la convivencia actualizado correctamente",
            3000
          );
          this.$emit("save-success");
          this.editedItem = Object.assign({}, this.defaultItem);
          return true; // Indicamos éxito
        }
      } catch (error) {
        this.dialog = false;
        LocalStorageService.setIsLocked(false);
        this.editedItem = Object.assign({}, this.defaultItem);
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al procesar la solicitud.",
          3000
        );
        return false; // Indicamos fallo
      } finally {
        this.dialog = false;
        LocalStorageService.setIsLocked(false);
        this.loadingWorkPlace = false;
        this.editedItem = Object.assign({}, this.defaultItem);
        await this.initialize();
      }
      this.close();
    },*/
    async initialize() {
    this.loadingWorkPlace = true;
    handleRequest({
      endpoint: "advance-branch-pendents",
      method: "GET",
      params: { branch_id: this.branch_id }
    })
    .then(response => {
      this.results = response.data.advances
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      this.resultsOriginal = JSON.parse(JSON.stringify(this.results));
    })
    .finally(() => {
      this.loadingWorkPlace = false;
    });
  },

  // Determinar si un item es pagable (el primer pendiente)
  isPayable(item) {
    if (item.status !== 'Pendiente') return false;
    
    // Encontrar el índice del item actual
    const currentIndex = this.results.findIndex(i => i.id === item.id);
    
    // Verificar si hay algún pendiente antes de este
    for (let i = 0; i < currentIndex; i++) {
      if (this.results[i].status === 'Pendiente') {
        return false;
      }
    }
    
    return true;
  },

  getPayButtonColor(item) {
    if (!this.isPayable(item)) return 'grey';
    return item.status === 'Pendiente' ? 'green' : 'grey';
  },

  getPayButtonTitle(item) {
    if (item.status !== 'Pendiente') {
      return 'Solo disponible para solicitudes pendientes';
    }
    if (!this.isPayable(item)) {
      return 'Debe pagar las solicitudes anteriores primero';
    }
    return 'Realizar pago';
  },

  async save(item) {
    if (!this.isPayable(item)) {
      this.showAlert('warning', 'Debe pagar las solicitudes anteriores primero', 3000);
      return;
    }
    
    LocalStorageService.setIsLocked(true);
    this.loadingWorkPlace = true;
    
    try {
      const result = await handleRequest({
        endpoint: "advance-update",
        method: "POST",
        data: {
          id: item.id,
          status: 'Pagado'
        }
      });

      if (result.success) {
        this.showAlert("success", result.message, 3000);
        this.$emit("save-success");
        await this.initialize(); // Recargar datos ordenados
      }
    } catch (error) {
      this.showAlert("error", "Error al procesar el pago", 3000);
    } finally {
      LocalStorageService.setIsLocked(false);
      this.loadingWorkPlace = false;
    }
  }
  },
};
</script>

<style>
/* Estilo para la fila de grupo */
.v-data-table__group-header-row {
  background-color: #f8f9fa !important;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

/* Estilo para el texto de las estadísticas */
.text-caption {
  font-size: 1rem !important;
  line-height: 1.25;
}

/* Colores para los estados */
.text-success {
  color: #4caf50 !important;
}

.text-error {
  color: #f44336 !important;
}

.text-warning {
  color: #ff9800 !important;
}

.text-info {
  color: #2196f3 !important;
}
</style>
