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
      <v-card-text class="flex-grow-1 overflow-y-auto px-0" style="max-height: 70vh">
        <template v-if="results.length > 0">
          <v-container class="pa-4" style="max-width: 500px">
            <div v-for="(item, index) in results" :key="index">
              <v-card class="rounded-xl pa-4" elevation="4">
                <!-- Título y ID -->
                <v-row>
                  <v-col cols="9" class="text-left">
                    <span class="text-subtitle-1 font-weight-bold mb-2">
                      {{ item.active == 2 ? "Edición de Carro" : "Eliminación de Carro" }}
                    </span>
                  </v-col>
                  <v-col cols="3" class="text-right">
                    <span class="text-subtitle-1 text-orange-darken-2 font-weight-bold mb-2">{{
                      item.id
                      }}</span>
                  </v-col>
                </v-row>

                <!-- Profesional y Cliente -->
                <v-row class="my-4" justify="space-between">
                  <!-- Profesional -->
                  <v-col cols="6" class="d-flex align-center">
                    <v-avatar size="40" class="mr-1">
                      <v-img :src="`${$axios.defaults.baseURL}images/${item.image_url}`" alt="Profesional"></v-img>
                    </v-avatar>
                    <div>
                      <div class="font-weight-bold">{{ item.professionalName }}</div>
                      <div class="text-caption">Profesional</div>
                    </div>
                  </v-col>
                  <!-- Cliente -->
                  <v-col cols="6" class="d-flex align-center justify-end">
                    <v-avatar size="40" class="mr-1">
                      <v-img :src="`${$axios.defaults.baseURL}images/${item.client_image}`" alt="Cliente"></v-img>
                    </v-avatar>
                    <div class="text-left">
                      <div class="font-weight-bold">{{ item.clientName }}</div>
                      <div class="text-caption">Cliente</div>
                    </div>
                  </v-col>
                </v-row>

                <!-- Detalles del Carro (Técnico, Productos, Servicios, Propina, Total) -->
                <v-card class="rounded-lg mb-2" variant="tonal" flat>
                  <v-row class="py-2 px-4" align="center">
                    <v-col cols="6" class="text-subtitle-1 font-weight-bold">Técnico</v-col>
                    <v-col cols="6" class="text-right font-weight-bold" style="color: #ff6d00">
                      {{ formatNumber(item.technical_assistance) }}
                    </v-col>
                  </v-row>
                </v-card>

                <v-card class="rounded-lg mb-2" variant="tonal" flat>
                  <v-row class="py-2 px-4" align="center">
                    <v-col cols="6" class="text-subtitle-1 font-weight-bold">Productos</v-col>
                    <v-col cols="6" class="text-right font-weight-bold" style="color: #ff6d00">
                      {{ formatNumber(item.product) }}
                    </v-col>
                  </v-row>
                </v-card>

                <v-card class="rounded-lg mb-2" variant="tonal" flat>
                  <v-row class="py-2 px-4" align="center">
                    <v-col cols="6" class="text-subtitle-1 font-weight-bold">Servicios</v-col>
                    <v-col cols="6" class="text-right font-weight-bold" style="color: #ff6d00">
                      {{ formatNumber(item.service) }}
                    </v-col>
                  </v-row>
                </v-card>

                <v-card class="rounded-lg mb-2" variant="tonal" flat>
                  <v-row class="py-2 px-4" align="center">
                    <v-col cols="6" class="text-subtitle-1 font-weight-bold">Propina</v-col>
                    <v-col cols="6" class="text-right font-weight-bold" style="color: #ff6d00">
                      {{ formatNumber(item.tip) }}
                    </v-col>
                  </v-row>
                </v-card>

                <v-card class="rounded-lg mb-2" variant="tonal" flat>
                  <v-row class="py-2 px-4" align="center">
                    <v-col cols="6" class="text-subtitle-1 font-weight-bold">Monto Total</v-col>
                    <v-col cols="6" class="text-right font-weight-bold" style="color: #ff6d00">
                      {{ formatNumber(item.amount) }}
                    </v-col>
                  </v-row>
                </v-card>

                <!-- Tabs: Solicitudes y Cambios (clickeables) -->
                <v-row class="mt-4 px-2" justify="space-around">
                  <!-- Solicitudes -->
                  <v-col cols="6" class="text-center pa-1">
                    <div class="py-1 px-3 rounded-lg text-caption font-weight-bold text-orange-darken-2"
                      style="background-color: #F7F7F7; cursor: pointer; font-size: 0.75rem;"
                      @click="openActionsDialog(item.action_descriptions)">
                      {{ item.action_descriptions?.length || 0 }} SOLICITUDES
                    </div>
                  </v-col>

                  <!-- Cambios -->
                  <v-col cols="6" class="text-center pa-1">
                    <div class="py-1 px-3 rounded-lg text-caption font-weight-bold text-blue"
                      style="background-color: #F7F7F7; cursor: pointer; font-size: 0.75rem;"
                      @click="openChangesDialog(item.change_log)">
                      {{ item.change_log?.length || 0 }} CAMBIOS
                    </div>
                  </v-col>
                </v-row>

                <!-- Aprobación: Botones y profesional responsable -->
                <v-card class="d-flex align-center justify-space-between pa-3 mt-4 rounded-lg"
                  style="background-color: #e9e9e9">
                  <v-row no-gutters>
                    <!-- Rechazar -->
                    <v-col cols="2" class="text-center">
                      <v-btn color="error" class="rounded-lg" icon @click.stop="editItem(item)">
                        <v-icon>mdi-thumb-down</v-icon>
                      </v-btn>
                    </v-col>

                    <!-- Información del solicitante -->
                    <v-col cols="8" class="pl-2">
                      <div class="d-flex align-center">
                        <v-avatar size="40" class="mr-1">
                          <v-img :src="`${$axios.defaults.baseURL}images/${item.image_url}`" alt="Profesional"></v-img>
                        </v-avatar>
                        <div>
                          <div class="text-subtitle-2 font-weight-bold">
                            {{ item.professionalName }}
                          </div>
                          <div class="text-caption" style="color: #ff6d00">
                            {{ item.nameBranch }}
                          </div>
                          <div class="text-caption text-grey-darken-1">
                            {{ item.professionalRole }}
                          </div>
                        </div>
                      </div>
                    </v-col>

                    <!-- Aprobar -->
                    <v-col cols="2" class="text-center">
                      <v-btn color="success" class="rounded-lg" icon @click.stop="deleteItem(item)">
                        <v-icon>mdi-thumb-up</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-card>
            </div>
          </v-container>
        </template>
        <template v-if="results1.length > 0">
          <v-container class="pa-4" style="max-width: 500px">
            <div v-for="(item, index) in results1" :key="index">
              <v-card class="rounded-xl pa-4 mb-4" elevation="4">
                <!-- Título único -->

                <v-row>
                  <v-col cols="7" class="text-left">
                    <span class="text-subtitle-1 font-weight-bold mb-2">
                      Eliminación de Orden
                    </span>
                  </v-col>
                  <v-col cols="5" class="text-right">
                    <span class="text-subtitle-1 font-weight-bold mb-2">Carro: {{ item.car_id }}</span>
                  </v-col>
                </v-row>

                <!-- Detalle principal: Producto/Servicio + Precio -->
                <v-card class="d-flex align-center rounded-lg pa-3 mb-4" variant="outlined">
                  <v-avatar size="48" class="mr-3">
                    <v-img :src="`${$axios.defaults.baseURL}images/${item.image}`" alt="Producto/Servicio"></v-img>
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-1 font-weight-bold">{{ item.name }}</div>
                    <div class="text-body-2 text-grey-darken-1">Precio</div>
                    <div class="text-body-2" style="color: #ff6d00">
                      {{ formatNumber(item.price) }}
                    </div>
                  </div>
                </v-card>

                <!-- Información de usuarios: Profesional y Cliente -->
                <div class="d-flex justify-space-between align-center mb-4">
                  <!-- Profesional -->
                  <div class="d-flex align-center">
                    <v-avatar size="36" class="mr-2">
                      <v-img :src="`${$axios.defaults.baseURL}images/${item.image_url}`" alt="Profesional"></v-img>
                    </v-avatar>
                    <div>
                      <div class="text-caption font-weight-medium">
                        {{ item.professionalName }}
                      </div>
                      <div class="text-caption text-grey">Profesional</div>
                    </div>
                  </div>

                  <!-- Cliente -->
                  <div class="d-flex align-center">
                    <v-avatar size="36" class="mr-2">
                      <v-img :src="`${$axios.defaults.baseURL}images/${item.client_image}`" alt="Cliente"></v-img>
                    </v-avatar>
                    <div>
                      <div class="text-caption font-weight-medium">
                        {{ item.clientName }}
                      </div>
                      <div class="text-caption text-grey">Cliente</div>
                    </div>
                  </div>
                </div>

                <!-- Aprobación: Botones + Responsable -->
                <v-card class="d-flex align-center justify-space-between pa-3 rounded-lg"
                  style="background-color: #e9e9e9">
                  <v-row no-gutters>
                    <!-- Rechazar -->
                    <v-col cols="2" class="text-center">
                      <v-btn color="error" class="rounded-lg" icon @click.stop="editItemOrder(item)">
                        <v-icon>mdi-thumb-down</v-icon>
                      </v-btn>
                    </v-col>

                    <!-- Profesional que realiza la acción -->
                    <v-col cols="8" class="pl-2">
                      <div class="d-flex align-center">
                        <v-avatar size="40" class="mr-1">
                          <v-img :src="`${$axios.defaults.baseURL}images/${item.image_url}`" alt="Profesional"></v-img>
                        </v-avatar>
                        <div>
                          <div class="text-subtitle-2 font-weight-bold">
                            {{ item.professionalName }}
                          </div>
                          <div class="text-caption" style="color: #ff6d00">
                            {{ item.nameBranch }}
                          </div>
                          <div class="text-caption text-grey-darken-1">
                            {{ item.professionalRole }}
                          </div>
                        </div>
                      </div>
                    </v-col>

                    <!-- Aprobar -->
                    <v-col cols="2" class="text-center">
                      <v-btn color="success" class="rounded-lg" icon @click.stop="deleteItemOrder(item)">
                        <v-icon>mdi-thumb-up</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-card>
            </div>
          </v-container>
        </template>
        <template v-if="results2.length > 0">
          <v-container class="pa-4" style="max-width: 500px">
            <div v-for="(item, index) in results2" :key="index">
              <v-card class="rounded-xl pa-4 mb-4" elevation="4">
                <!-- Título -->
                <h2 class="text-subtitle-1 font-weight-bold mb-2">Eliminación de Productos</h2>

                <!-- Producto -->
                <v-card class="d-flex align-center rounded-lg pa-3 mb-4" variant="outlined">
                  <v-avatar size="48" class="mr-3">
                    <v-img :src="`${$axios.defaults.baseURL}images/${item.image_product}`" alt="Producto"></v-img>
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-1 font-weight-bold">
                      {{ item.productName }}
                    </div>
                    <div class="text-body-2 text-grey-darken-1">Precio unitario</div>
                    <div class="text-body-2" style="color: #ff6d00">
                      {{ formatNumber(item.price) }}
                    </div>
                  </div>
                  <div class="ml-auto text-center">
                    <div class="text-h5 font-weight-bold">{{ item.cant }}</div>
                    <div class="text-caption text-grey">Cantidad</div>
                  </div>
                </v-card>

                <!-- Aprobación -->
                <v-card class="d-flex align-center justify-space-between pa-3 mt-4 rounded-lg"
                  style="background-color: #e9e9e9">
                  <v-row no-gutters>
                    <!-- Botón Rechazar -->
                    <v-col cols="2" class="text-center">
                      <v-btn color="error" class="rounded-lg" icon @click.stop="editItemProduct(item)">
                        <v-icon>mdi-thumb-down</v-icon>
                      </v-btn>
                    </v-col>

                    <!-- Información del Profesional -->
                    <v-col cols="8" class="pl-2">
                      <div class="d-flex align-center">
                        <v-avatar size="40" class="mr-1">
                          <v-img :src="`${$axios.defaults.baseURL}images/${item.image_url}`" alt="Profesional"></v-img>
                        </v-avatar>
                        <div>
                          <div class="text-subtitle-2 font-weight-bold">
                            {{ item.professionalName }}
                          </div>
                          <div class="text-caption" style="color: #ff6d00">
                            {{ item.nameBranch }}
                          </div>
                          <div class="text-caption text-grey-darken-1">
                            {{ item.professionalRole }}
                          </div>
                        </div>
                      </div>
                    </v-col>

                    <!-- Botón Aprobar -->
                    <v-col cols="2" class="text-center">
                      <v-btn color="success" class="rounded-lg" icon @click.stop="deleteItemProduct(item)">
                        <v-icon>mdi-thumb-up</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-card>
            </div>
          </v-container>
        </template>
        <template v-if="results.length === 0 && results1.length === 0 && results2.length === 0">
          <v-card class="mt-4 pa-6 text-center" variant="flat" color="grey-lighten-4" rounded="lg" elevation="4">
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
            <v-col cols="12" md="5" class="grow ml-1">
              <span class="text-subtitle-1"><strong>Detalles de Solicitudes</strong></span>
            </v-col>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialogActions = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-row>
        </v-toolbar>
        <v-card-text class="pt-4">
          <v-card v-for="(action, idx) in currentActions" :key="idx" class="mb-4">
            <v-card-title>
              <v-list-item :title="action.nameProfessional || 'Usuario'" :subtitle="formatDateTime(action.timestamp)">
                <template v-slot:prepend>
                  <v-avatar>
                    <v-img :src="`${$axios.defaults.baseURL}images/${action.image}`"></v-img>
                  </v-avatar>
                </template>
                <template v-slot:append>
                  <v-avatar color="grey-lighten-1" size="small">{{ idx + 1 }}</v-avatar>
                </template>
              </v-list-item>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-list-item :title="getActionTitle(action.action_type)" :subtitle="action.description">
                <template v-slot:prepend>
                  <v-avatar color="white">
                    <v-icon :color="getActionColor(action.action_type)" size="30">
                      {{ getActionIcon(action.action_type) }}
                    </v-icon>
                  </v-avatar>
                </template>
              </v-list-item>
            </v-card-text>
          </v-card>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-lighten-1" variant="text" @click="dialogActions = false">Cerrar</v-btn>
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
          <v-card v-for="(registro, index) in cambiosProcesados" :key="index" class="mb-6">
            <v-card-title>
              <v-list-item :subtitle="formatFecha(registro.timestamp)" :title="registro.nameProfessional">
                <template v-slot:prepend>
                  <v-avatar color="primary">
                    <v-img :src="`${this.$axios.defaults.baseURL}images/${registro.image}`" alt="image"></v-img>
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
                <v-list-item v-for="(cambio, i) in registro.listaCambios" :key="i" :title="cambio"
                  :class="iconoCambio(cambio).color + '--text'">
                  <template v-slot:prepend>
                    <v-icon :color="iconoCambio(cambio).color" size="small" class="mr-2">
                      {{ iconoCambio(cambio).icon }}
                    </v-icon>
                  </template>
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
    // Abre el diálogo de solicitudes
    openActionsDialog(actions) {
      if (!actions || actions.length === 0) return;
      this.currentActions = actions;
      this.dialogActions = true;
    },

    // Abre el diálogo de cambios (correctamente)
    openChangesDialog(changeLog) {
      if (!changeLog || !Array.isArray(changeLog) || changeLog.length === 0) return;
      this.cambiosProcesados = this.procesarChangeLog(changeLog);
      this.dialogChages = true;
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
