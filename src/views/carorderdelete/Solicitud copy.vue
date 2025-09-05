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
  <v-container fluid class="pa-1">
    <v-card flat>
      <v-toolbar color="#F18254">
        <span class="text-subtitle-2 ml-2">Listado de Solicitudes</span>
      </v-toolbar>

      <v-card-text class="flex-grow-1 overflow-y-auto px-0" style="max-height: 70vh">
        <template v-if="results.length > 0">
        <div v-for="(item, index) in results" :key="index" class="mb-2 mx-0">
          <!-- Request Card -->
          <v-card class="d-flex" style="overflow: hidden;">
            <!-- Columna izquierda - Botón DENEGAR -->
            <div
              class="d-flex align-center justify-center px-2  flex-shrink-0"
              style="min-height: fit-content; background-color: red; cursor: pointer"
              @click.stop="editItem(item)"
            >
              <v-icon color="white" size="large">mdi-thumb-down-outline</v-icon>
            </div>

            <!-- Columna central - Contenido -->
            <div class="flex-grow-1 pa-2" style="min-width: 0; overflow: hidden;">
            <div class="d-flex align-center mb-2">
                <span class="text-body-1 font-weight-bold">
                {{ item.active == 2 ? 'Solicitud de edición de carro' : 'Solicitud de eliminación de carro' }}
                </span>
            </div>
            
            <!-- Primera fila con dos columnas (Profesional y Cliente) -->
            <div class="d-flex flex-wrap">
                <!-- Columna 1: Profesional -->
                <div class="d-flex align-center mr-4">
                <v-avatar class="mr-2" elevation="3" color="grey-lighten-4">
                    <v-img
                    :src="`${this.$axios.defaults.baseURL}images/${item.image_url}`"
                    alt="image"
                    ></v-img>
                </v-avatar>
                <div>
                    <span class="text-body-2 font-weight-bold d-block">{{ item.professionalName }}</span>
                    <span class="text-caption text-grey">Profesional</span>
                </div>
                </div>
                
                <!-- Columna 2: Cliente -->
                <div class="d-flex align-center">
                <v-avatar class="mr-2" elevation="3" color="grey-lighten-4">
                    <v-img
                    :src="`${this.$axios.defaults.baseURL}images/${item.client_image}`"
                    alt="image"
                    ></v-img>
                </v-avatar>
                <div>
                    <span class="d-block">{{ item.clientName }}</span>
                    <span class="text-caption text-grey">Cliente</span>
                </div>
                </div>
            </div>

            <v-divider class="my-2"></v-divider>

            <!-- Segunda fila con dos columnas (Sucursal y Datos numéricos) -->
            <div class="d-flex flex-wrap">
                <!-- Columna 1: Sucursal -->
                <div class="mr-4 mb-2">
                <div class="text-caption text-grey">Sucursal</div>
                <div>{{ item.nameBranch }}</div>
                </div>
                
                <!-- Columna 2: Datos numéricos en grid -->
                <div class="flex-grow-1">
                <div class="d-flex flex-wrap">
                    <div class="mr-4 mb-2">
                    <div class="text-caption text-grey">Técnico</div>
                    <div>{{ formatNumber(item.technical_assistance) }}</div>
                    </div>
                    <div class="mr-4 mb-2">
                    <div class="text-caption text-grey">Productos</div>
                    <div>{{ formatNumber(item.product) }}</div>
                    </div>
                    <div class="mr-4 mb-2">
                    <div class="text-caption text-grey">Servicios</div>
                    <div>{{ formatNumber(item.service) }}</div>
                    </div>
                    <div class="mr-4 mb-2">
                    <div class="text-caption text-grey">Propina</div>
                    <div>{{ formatNumber(item.tip) }}</div>
                    </div>
                    <div class="mr-4 mb-2">
                    <div class="text-caption text-grey">Monto Total</div>
                    <div>{{ formatNumber(item.amount) }}</div>
                    </div>
                </div>
                </div>
            </div>

            <!-- Tercera fila (botones) -->
            <div class="d-flex flex-wrap mt-2">
                <v-chip
                @click="
                    dialogActions = true;
                    currentActions = item.action_descriptions;
                "
                color="indigo-darken-2"
                small
                class="px-2 mr-2"
                :disabled="!item.action_descriptions?.length"
                >
                <v-icon
                    left
                    color="indigo-darken-2"
                    icon="mdi-clipboard-text-outline"
                />
                {{ item.action_descriptions.length }} Solicitudes
                </v-chip>

                <v-chip
                @click="
                    dialogChages = true;
                    cambiosProcesados = procesarChangeLog(item.change_log);
                "
                color="teal-darken-3"
                small
                class="px-2"
                :disabled="!item.change_log?.length"
                >
                <v-icon left color="teal-darken-3" icon="mdi-history" />
                {{ item.change_log.length }} Cambios
                </v-chip>
            </div>
            </div>

            <!-- Columna derecha - Botón ACEPTAR -->
            <div
              class="d-flex align-center justify-center px-2  flex-shrink-0"
              style="min-height: fit-content; background-color: green; cursor: pointer"
              @click.stop="deleteItem(item)"
            >
              <v-icon color="white" size="large">mdi-thumb-up-outline</v-icon>
            </div>
          </v-card>
        </div>
        </template>
        <template v-if="results1.length > 0">
        <div v-for="(item, index) in results1" :key="index" class="mb-2 mx-0">
            <!-- Request Card -->
            <v-card class="d-flex" style="overflow: hidden;">
            <!-- Columna izquierda - Botón DENEGAR -->
            <div
              class="d-flex align-center justify-center px-2  flex-shrink-0"
              style="min-height: fit-content; background-color: red; cursor: pointer"
              @click.stop="editItemOrder(item)"
            >
              <v-icon color="white" size="large">mdi-thumb-down-outline</v-icon>
            </div>

           <!-- Columna central - Contenido -->
            <div class="flex-grow-1 pa-2"  style="min-width: 0; overflow: hidden;">
            <!-- Fila 1: Título -->
            <div class="d-flex align-center mb-2">
                <span class="text-body-1 font-weight-bold">
                Solicitud de eliminación de orden
                </span>
            </div>

            <!-- Fila 2: Dos columnas (Profesional y Cliente) -->
            <div class="d-flex flex-wrap">
                <!-- Columna 1: Profesional -->
                <div class="d-flex align-center mr-4 mb-2">
                <v-avatar class="mr-2" size="40" elevation="3" color="grey-lighten-4">
                    <v-img
                    :src="`${$axios.defaults.baseURL}images/${item.image_url}`"
                    alt="Profesional"
                    ></v-img>
                </v-avatar>
                <div>
                    <span class="text-body-2 font-weight-bold d-block">{{ item.professionalName }}</span>
                    <span class="text-caption text-grey">Profesional</span>
                </div>
                </div>

                <!-- Columna 2: Cliente -->
                <div class="d-flex align-center mb-2">
                <v-avatar class="mr-2" size="40" elevation="3" color="grey-lighten-4">
                    <v-img
                    :src="`${$axios.defaults.baseURL}images/${item.client_image}`"
                    alt="Cliente"
                    ></v-img>
                </v-avatar>
                <div>
                    <span class="text-body-2 d-block">{{ item.clientName }}</span>
                    <span class="text-caption text-grey">Cliente</span>
                </div>
                </div>
            </div>

            <!-- Fila 3: Dos columnas (Producto/Servicio y Datos adicionales) -->
            <div class="d-flex flex-wrap">
                <!-- Columna 1: Producto/Servicio -->
                <div class="d-flex align-center mr-4 mb-2">
                <v-avatar class="mr-2" size="40" elevation="3" color="grey-lighten-4">
                    <v-img
                    :src="`${$axios.defaults.baseURL}images/${item.image}`"
                    alt="Producto"
                    ></v-img>
                </v-avatar>
                <div>
                    <span class="text-body-2 font-weight-bold d-block">{{ item.name }}</span>
                    <span class="text-body-2 text-primary">{{ formatNumber(item.price) }}</span>
                </div>
                </div>

                <!-- Columna 2: Datos adicionales -->
                <div class="d-flex flex-wrap align-center">
                <div class="mr-4 mb-2">
                    <div class="text-caption text-grey">Sucursal</div>
                    <div class="text-body-2">{{ item.nameBranch }}</div>
                </div>
                <div class="mr-4 mb-2">
                    <div class="text-caption text-grey">Carro</div>
                    <div class="text-body-2">{{ item.car_id }}</div>
                </div>
                <div class="mr-4 mb-2">
                    <div class="text-caption text-grey">Categoría</div>
                    <div class="text-body-2">{{ item.category }}</div>
                </div>
                </div>
            </div>
            </div>

            <!-- Columna derecha - Botón ACEPTAR -->
             <div
              class="d-flex align-center justify-center px-2  flex-shrink-0"
              style="min-height: fit-content; background-color: green; cursor: pointer"
              @click.stop="deleteItemOrder(item)"
            >
              <v-icon color="white" size="large">mdi-thumb-up-outline</v-icon>
            </div>
            </v-card>
        </div>
        </template>
        <template v-if="results2.length > 0">
        <div v-for="(item, index) in results2" :key="index" class="mb-2 mx-0">
            <!-- Product Request Card -->
            <v-card class="d-flex" style="overflow: hidden;">
            <!-- Columna izquierda - Botón DENEGAR -->
            <div
              class="d-flex align-center justify-center px-2 flex-shrink-0"
              style="min-height: fit-content; background-color: red; cursor: pointer"
              @click.stop="editItemProduct(item)"
            >
              <v-icon color="white" size="large">mdi-thumb-down-outline</v-icon>
            </div>

            <!-- Columna central - Contenido -->
            <div class="flex-grow-1 pa-2" style="min-width: 0; overflow: hidden;">
            <!-- Fila 1: Título -->
            <div class="d-flex align-center mb-2">
                <span class="text-body-1 font-weight-bold">
                Solicitud de eliminación de producto
                </span>
            </div>

            <!-- Fila 2: Dos columnas (Profesional y Producto) -->
            <div class="d-flex flex-wrap">
                <!-- Columna 1: Profesional -->
                <div class="d-flex align-center mr-4 mb-2">
                <v-avatar class="mr-2" size="40" elevation="3" color="grey-lighten-4">
                    <v-img
                    :src="`${$axios.defaults.baseURL}images/${item.image_url}`"
                    alt="Profesional"
                    ></v-img>
                </v-avatar>
                <div>
                    <span class="text-body-2 font-weight-bold d-block">{{ item.professionalName }}</span>
                    <span class="text-caption text-grey">Profesional</span>
                </div>
                </div>

                <!-- Columna 2: Producto -->
                <div class="d-flex align-center mb-2">
                <v-avatar class="mr-2" size="40" elevation="3" color="grey-lighten-4">
                    <v-img
                    :src="`${$axios.defaults.baseURL}images/${item.image_product}`"
                    alt="Producto"
                    ></v-img>
                </v-avatar>
                <div>
                    <span class="text-body-2 font-weight-bold d-block">{{ item.productName }}</span>
                    <span class="text-body-2 text-primary">{{ formatNumber(item.price) }}</span>
                    <span class="text-caption text-grey">Precio unitario</span>
                </div>
                </div>
            </div>

            <v-divider class="my-2"></v-divider>

            <!-- Fila 3: Datos adicionales en formato compacto -->
            <div class="d-flex flex-wrap">
                <div class="mr-4 mb-2">
                <div class="text-caption text-grey">No.</div>
                <div class="text-body-2">#{{ item.id }}</div>
                </div>
                <div class="mr-4 mb-2">
                <div class="text-caption text-grey">Sucursal</div>
                <div class="text-body-2">{{ item.nameBranch }}</div>
                </div>
                <div class="mr-4 mb-2">
                <div class="text-caption text-grey">Cantidad</div>
                <div class="text-body-2">{{ item.cant }}</div>
                </div>
            </div>
            </div>

            <!-- Columna derecha - Botón ACEPTAR -->
            <div
              class="d-flex align-center justify-center px-2 flex-shrink-0"
              style="min-height: fit-content; background-color: green; cursor: pointer"
              @click.stop="deleteItemProduct(item)"
            >
              <v-icon color="white" size="large">mdi-thumb-up-outline</v-icon>
            </div>
            </v-card>
        </div>
        </template>
        <template v-if="results.length === 0 && results1.length === 0 && results2.length === 0">
        <v-card
            class="mt-4 pa-6 text-center"
            variant="flat"
            color="grey-lighten-4"
            rounded="lg"
        >
            <v-icon size="60" color="grey-darken-2">mdi-inbox-remove-outline</v-icon>
            <v-card-title class="text-h6 text-grey-darken-3 justify-center">
            No hay solicitudes
            </v-card-title>
            <v-card-subtitle class="text-grey-darken-1">
            No se encontraron registros para mostrar.
            </v-card-subtitle>
        </v-card>
        </template>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialogActions" max-width="540px">
      <v-card>
        <v-toolbar color="#F18254">
          <v-row align="center">
            <v-col cols="12" md="5" class="grow ml-4">
              <span class="text-subtitle-1"
                ><strong>Detalles de Solicitudes</strong></span
              >
            </v-col>
            <v-col cols="12" md="5"></v-col>
            <v-col cols="12" md="1"></v-col>
          </v-row>
        </v-toolbar>

        <v-card-text>
          <v-card v-for="(action, index) in currentActions" :key="index" class="mb-6">
            <v-card-title>
              <v-list-item
                :subtitle="formatDateTime(action.timestamp)"
                :title="action.nameProfessional || 'Usuario'"
              >
                <template v-slot:prepend>
                  <v-avatar>
                    <v-img
                      :src="`${this.$axios.defaults.baseURL}images/${action.image}`"
                      alt="image"
                    ></v-img>
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
              <v-list-item
                :subtitle="action.description"
                :title="getActionTitle(action.action_type)"
              >
                <template v-slot:prepend>
                  <v-avatar color="white">
                    <v-icon :color="getActionColor(action.action_type)" size="30">{{
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
          <v-btn color="#E7E9E9" variant="flat" @click="dialogActions = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
          <v-card
            v-for="(registro, index) in cambiosProcesados"
            :key="index"
            class="mb-6"
          >
            <v-card-title>
              <v-list-item
                :subtitle="formatFecha(registro.timestamp)"
                :title="registro.nameProfessional"
              >
                <template v-slot:prepend>
                  <v-avatar color="primary">
                    <v-img
                      :src="`${this.$axios.defaults.baseURL}images/${registro.image}`"
                      alt="image"
                    ></v-img>
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
  </v-container>
</template>

<script>
import axios from "axios";
import LocalStorageService from "@/LocalStorageService";
import { result } from "lodash";
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
    sb_type: "",
    sb_message: "",
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    branch_id: "",
    charge: "",
    business_id: "",
    professional_id: "",
    branches: [],
    search: "",
    search2: "",
    search3: "",
    mostrarFila: false,
    headers: [
      { title: "No", value: "id" },
      { title: "Sucursal", value: "nameBranch" },
      { title: "Profesional", value: "professionalName" },
      { title: "Cliente", value: "clientName" },
      { title: "Técnico", value: "technical_assistance" },
      { title: "Productos", value: "product" },
      { title: "Servicios", value: "service" },
      { title: "Propina", value: "tip" },
      { title: "Monto Total", value: "amount" },
      { title: "Solicitudes", value: "action_descriptions" },
      { title: "Cambios", value: "change_log" },
      { title: "Solicitud", value: "active" },
      { title: "Acciones", key: "actions", sortable: false, width: "15%" },
    ],
    headers1: [
      { title: "Sucursal", value: "nameBranch" },
      { title: "Carro", value: "car_id" },
      { title: "Profesional", value: "professionalName" },
      { title: "Cliente", value: "clientName" },
      { title: "Nombre", value: "name" },
      { title: "Categoría", value: "category" },
      { title: "Importe", value: "price" },
      { title: "Acciones", key: "actions", sortable: false },
    ],
    headers2: [
      { title: "No", value: "id" },
      { title: "Sucursal", value: "nameBranch" },
      { title: "Profesional", value: "professionalName" },
      { title: "Producto", value: "productName" },
      { title: "Precio", value: "price" },
      { title: "Cantidad", value: "cant" },
      { title: "Acciones", key: "actions", sortable: false },
    ],
    results: [],
    results1: [],
    results2: [],
  }),

  computed: {},

  watch: {},

  mounted() {
    this.business_id = LocalStorageService.getItem("business_id");
    this.branch_id = LocalStorageService.getItem("branch_id");
    this.charge_id = LocalStorageService.getItem("charge_id");
    this.charge = JSON.parse(LocalStorageService.getItem("charge"));
    this.professional_id = LocalStorageService.getItem("professional_id");
    this.initialize();
  },

  methods: {
    getStatusColor(status) {
      switch (status) {
        case "approved":
          return "success";
        case "rejected":
          return "error";
        default:
          return "primary";
      }
    },

    getStatusIcon(status) {
      switch (status) {
        case "approved":
          return "mdi-thumb-up";
        case "rejected":
          return "mdi-thumb-down";
        default:
          return "mdi-help-circle";
      }
    },

    approveRequest(index) {
      this.requests.value[index].status = "approved";
    },

    rejectRequest(index) {
      this.requests.value[index].status = "rejected";
    },
    isResolution(actionType) {
      return ["approved", "denied"].includes(actionType);
    },

    // Obtener color según tipo de acción
    getActionColor(actionType) {
      const colors = {
        approved: "green",
        denied: "red",
        delete: "red",
        add: "green",
        edit: "blue",
        payment: "indigo", // Color azul oscuro para pagos
        default: "grey",
      };
      return colors[actionType] || colors.default;
    },

    // Obtener icono según tipo de acción
    getActionIcon(actionType) {
      const icons = {
        approved: "mdi-check-circle",
        denied: "mdi-close-circle",
        delete: "mdi-delete",
        add: "mdi-plus",
        edit: "mdi-pencil",
        payment: "mdi-cash-multiple", // Icono adecuado para pagos
        default: "mdi-alert",
      };
      return icons[actionType] || icons.default;
    },

    procesarChangeLog(changeLog) {
      if (!changeLog || !Array.isArray(changeLog)) return [];

      return changeLog.map((registro) => ({
        ...registro,
        listaCambios: this.extraerCambios(registro.changes),
        timestamp: registro.timestamp || new Date().toISOString(),
        nameProfessional: registro.nameProfessional || "Usuario desconocido",
      }));
    },

    extraerCambios(changesString) {
      if (!changesString) return [];
      return changesString
        .split("*")
        .map((c) => c.trim())
        .filter((c) => c !== "");
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
      if (texto.includes("aumentó")) {
        return { icon: "mdi-arrow-up", color: "green" };
      }
      if (texto.includes("disminuyó")) {
        return { icon: "mdi-arrow-down", color: "red" };
      }
      if (texto.includes("cambió")) {
        return { icon: "mdi-swap-horizontal", color: "blue" };
      }
      return { icon: "mdi-dots-horizontal", color: "grey" };
    },
    getActionTitle(actionType) {
      const titles = {
        approved: "Solicitud Aprobada",
        denied: "Solicitud Denegada",
        delete: "Solicitud de Eliminación",
        add: "Adición",
        edit: "Solicitud de Edición",
        payment: "Actualización de Pago", // Título descriptivo para pagos
        default: "Acción",
      };
      return titles[actionType] || titles.default;
    },

    // Obtener color para chips/resolución
    getResolutionColor(actionType) {
      return this.isResolution(actionType)
        ? actionType === "approved"
          ? "green"
          : "red"
        : "grey";
    },

    // Obtener texto para chips/resolución
    getResolutionText(actionType) {
      return this.isResolution(actionType)
        ? actionType === "approved"
          ? "Aprobado"
          : "Denegado"
        : "Pendiente";
    },

    // Obtener detalles de quién realizó la acción
    getActionDetails(item) {
      const actor = item.nameProfessional || "Sistema";
      return this.isResolution(item.action_type)
        ? `Resuelto por: ${actor}`
        : `Acción por: ${actor}`;
    },

    // Obtener icono global según estado general
    getGlobalIcon(items) {
      const hasDenied = items.some(
        (i) => i.action_type === "denied" || i.action_type === "delete"
      );
      const hasPending = items.some((i) => !this.isResolution(i.action_type));

      if (hasDenied) return "mdi-alert-octagon";
      if (hasPending) return "mdi-alert-circle";
      return "mdi-check-circle";
    },
    formatDateTime(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
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

    initialize() {
      this.loadingCar = true;
      this.loadingOrder = true;
      this.loadingProduct = true;
      LocalStorageService.setIsLocked(true);
      axios
        .get("https://api2.simplifies.cl/api/branch-cars-delete", {
          params: {
            branch_id: this.branch_id,
          },
        })
        .then((response) => {
          this.results = response.data.cars;
          this.results1 = response.data.orders;
          this.results2 = response.data.cashier;
          console.log("this.results2 productos");
          console.log(this.results2);
        })
        .finally(() => {
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
        professional_id: this.professional_id,
      };
      axios
        .post("https://api2.simplifies.cl/api/car-destroy", request)
        .then(() => {})
        .finally(() => {
          LocalStorageService.setIsLocked(false);
          this.initialize();
          this.showAlert("success", "Solicitud Aceptada correctamente", 3000);
        });
    },

    editItem(item) {
      LocalStorageService.setIsLocked(true);
      let request = {
        id: item.id,
        professional_id: this.professional_id,
      };
      axios
        .post("https://api2.simplifies.cl/api/car-denegada", request)
        .then(() => {})
        .finally(() => {
          LocalStorageService.setIsLocked(false);
          this.initialize();
          this.showAlert("success", "Solicitud denegada correctamente", 3000);
        });
    },

    //eliminar orden
    deleteItemOrder(item) {
      LocalStorageService.setIsLocked(true);
      let request = {
        id: item.id,
        professional_id: this.professional_id,
      };
      axios
        .post("https://api2.simplifies.cl/api/order-destroy-web", request)
        .then(() => {
          //this.initialize();
        })
        .finally(() => {
          LocalStorageService.setIsLocked(false);
          this.initialize();
          this.showAlert("success", "Orden eliminada correctamente", 3000);
        });
    },

    editItemOrder(item) {
      LocalStorageService.setIsLocked(true);
      let request = {
        id: item.id,
        professional_id: this.professional_id,
      };
      axios
        .post("https://api2.simplifies.cl/api/order-denegar", request)
        .then(() => {})
        .finally(() => {
          LocalStorageService.setIsLocked(false);
          this.initialize();
          this.showAlert("success", "Solicitud denegada correctamente", 3000);
        });
    },

    //eliminar orden
    deleteItemProduct(item) {
      LocalStorageService.setIsLocked(true);
      let request = {
        id: item.id,
        professional_id: this.professional_id,
      };
      axios
        .post("https://api2.simplifies.cl/api/cashiersale-destroy", request)
        .then(() => {
          //this.initialize();
        })
        .finally(() => {
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
        professional_id: this.professional_id,
      };
      axios
        .post("https://api2.simplifies.cl/api/cashiersale-denegar", request)
        .then(() => {})
        .finally(() => {
          LocalStorageService.setIsLocked(false);
          this.initialize();
          this.showAlert("success", "Solicitud denegada correctamente", 3000);
        });
    },
  },
};
</script>

<style scoped>
.concave-card {
  border-radius: 8px;
  border-left: 2px solid transparent;
  transition: all 0.3s ease;
}

.concave-avatar {
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.2),
    inset -2px -2px 4px rgba(255, 255, 255, 0.5);
}

.border-left-success {
  border-left-color: #4caf50 !important;
}

.border-left-error {
  border-left-color: #f44336 !important;
}

.v-list-item {
  padding: 8px;
}
.v-card {
  border-radius: 8px;
  overflow: hidden;
}
</style>
