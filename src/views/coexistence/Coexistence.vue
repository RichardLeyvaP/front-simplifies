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
        <v-col cols="12" md="10" class="grow t">
          <span class="text-subtitle-1 ml-2"> <strong>Convivencias por trabajador</strong></span>
        </v-col>
        <v-col cols="12" md="2">
          <div v-if="hasChanges" class="justify-end">
            <!--<v-btn @click="cancelChanges" color="black" prepend-icon="mdi-close" class=" ml-2"
              :disabled="changes.length === 0" title="Cancelar Cambios" style="background-color: #E7E9E9;">
              <span class="btn-text">Cancelar</span>
            </v-btn>-->
            <v-btn @click="save" color="black" prepend-icon="mdi-check" :disabled="changes.length === 0"
              title="Actualizar convivencias" style="background-color: #E7E9E9;">
              <span class="btn-text">Aceptar</span>
            </v-btn>

          </div>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-card-text>
      <!--<v-row>
        <v-col cols="12" sm="12" md="4">
          <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches"
            v-if="this.mostrarFila" clearable label="Seleccione una Sucursal" prepend-icon="mdi-store" item-title="name"
            item-value="id" variant="underlined" @update:model-value="initialize()"></v-autocomplete>
        </v-col>
      </v-row>-->
      <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
        hide-details></v-text-field>
      <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :search="search" :items="results"
        class="elevation-1" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles"
        :loading="loadingWorkPlace" loading-text="Cargando datos..." :group-by="groupBy" show-expand="false">
        <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
          <tr>
            <td :colspan="columns.length">
              <div class="d-flex align-center flex-wrap" style="gap: 8px 16px;">
                <v-btn size="small" variant="text" :icon="isGroupOpen(item) ? '$expand' : '$next'"
                  @click="toggleGroup(item)" class="mr-1"></v-btn>

                <span class="font-weight-bold mr-2">{{ item.value }}</span>

                <span class="text-success text-caption">Cumplidas: {{ getProfessionalStats(item.value).fulfilled
                }}</span>
                <span class="text-error text-caption">Incumplidas: {{ getProfessionalStats(item.value).not_fulfilled
                }}</span>
                <span class="text-black text-caption">Sin Actualizar: {{ getProfessionalStats(item.value).not_updated
                }}</span>
              </div>
            </td>
          </tr>
        </template>
        <template v-slot:item.estado="{ item }">
          <div class="d-flex align-center" style="height: 100%; width: 48%;">
            <!-- Select de estados -->
            <v-select :model-value="item.estado" :items="states" item-title="name" item-value="id" density="compact"
              variant="outlined" hide-details @update:modelValue="(newValue) => handleEstadoChange(item, newValue)"
              style="min-width: 48%;">
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <v-icon :color="item.raw.color" size="small" class="mr-2">
                    {{ item.raw.icon }}
                  </v-icon>
                  <span>{{ item.title }}</span>
                </div>
              </template>

              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-icon :color="item.raw.color">{{ item.raw.icon }}</v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </div>
        </template>
        <!--<template v-slot:item.estado="{ item }">
          <div class="d-flex align-center" style="height: 100%;">

            <v-switch v-model="item.estado" :true-value="1" :false-value="0" :color="getEstadoInfo(item.estado).color"
              @change="save(item)" class="mr-2" style="margin-top: 20px;"></v-switch>


            <div class="d-flex align-center">
              <v-icon :color="getEstadoInfo(item.estado).color" class="mr-2">
                {{ getEstadoInfo(item.estado).icon }}
              </v-icon>
              <span>{{ getEstadoInfo(item.estado).name }}</span>
            </div>
          </div>
        </template>-->
        <!-- Eliminar flecha en las filas normales -->
        <template v-slot:item.data-table-expand="{ item, isExpanded, toggleExpand }">
          <!-- Template vacío para ocultar el expand en filas normales -->
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
                <v-select v-model="editedItem.estado" :items="states" item-value="id" item-title="name"
                  label="Estado de la convivencia" outlined>
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
            <v-btn color="#E7E9E9" variant="flat" @click="close">
              Cancelar
            </v-btn>
            <v-btn color="#F18254" variant="flat" @click="save" :disabled="!valid" :loading="loadingWorkPlace">
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
import _ from 'lodash';

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
    dialogDelete: false,
    states: [
      { id: 3, name: 'Sin Actualizar', icon: 'mdi-help-circle', color: 'grey' },
      { id: 0, name: 'Incumplió', icon: 'mdi-close-circle', color: 'red' },
      { id: 1, name: 'Cumplió', icon: 'mdi-check-circle', color: 'green' },
    ],
    groupBy: [
      {
        key: 'professionalName'
      },
    ],
    headers: [
      {
        title: "",  // Personaliza el texto aquí
        key: "data-table-group",  // Clave especial para grupos
      },
      //title: 'Nombre del profesional', value: 'professionalName' },
      { title: 'Regla de Convivencia', value: 'ruleName' },
      { title: 'Estado Convivencia', value: 'estado' },
      { title: 'Actualizado', value: 'last_edited_at' },
      //title: 'Acciones', value: 'actions' },
    ],
    results: [],
    changes: [],
    resultsOriginal: [],
    professionals: [],

    editedIndex: -1,

    editedItem: {
      id: '',
      estado: '',
    },
    data: {},

    defaultItem: {
      id: '',
      estado: '',
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
    hasChanges() {
    return !_.isEqual(this.results, this.resultsOriginal);
  }
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    /*results(newVal) {
      const hasStateThree = newVal.some(item => item.estado === 3);
      this.$emit('update:has-invalid-state', hasStateThree);
    }*/
    results(newVal) {
    const hasStateThree = newVal.some(item => item.estado === 3);
    const arraysAreEqual = _.isEqual(newVal, this.resultsOriginal); // Usamos lodash para comparación profunda
    
    // Emitimos false si:
    // 1. No hay estado 3 Y los arrays son iguales
    // O emitimos true si:
    // 1. Hay estado 3 O los arrays son diferentes
    this.$emit('update:has-invalid-state', hasStateThree || !arraysAreEqual);
  }
  },

  async mounted() {
    this.business_id = LocalStorageService.getItem('business_id');
    //this.branch_id = LocalStorageService.getItem('branch_id');
    //this.branch_id = this.branch.id;
    this.charge_id = LocalStorageService.getItem('charge_id');
    this.charge = JSON.parse(LocalStorageService.getItem("charge"));
    LocalStorageService.setIsLocked(true);
    // Crear un objeto para los parámetros
    /*const requestParams = {
      business_id: this.business_id,
    };

    /*try {
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
    checkInvalidState() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        const hasStateThree = this.results.some(item => item.estado === 3);
        const hasPendingChanges = this.changes.length > 0;

        this.$emit('update:has-invalid-state', {
          hasInvalidState: hasStateThree,
          hasPendingChanges: hasPendingChanges
        });
      }, 100); // Ajusta este tiempo según necesites
    },
    getProfessionalStats(professionalName) {
      const professional = this.results.find(item =>
        item.professionalName === professionalName
      );

      return professional?.professionalStats || {
        fulfilled: 0,
        not_fulfilled: 0,
        not_updated: 0,
        total: 0
      };
    },
    getEstadoInfo(estado) {
      const estadoInfo = this.states.find((state) => state.id === estado);
      return estadoInfo || { id: -1, name: 'Desconocido', icon: 'mdi-alert', color: 'black' };
    },
    async initialize() {
      this.loadingWorkPlace = true;
      LocalStorageService.setIsLocked(true);
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0]; // Formato: YYYY-MM-DD

      const requestParams = {
        branch_id: this.branch_id,
        date: formattedDate,
      };

      try {
        const result = await handleRequest({
          endpoint: 'branchruleprofessional-data',
          method: 'GET',
          params: requestParams // Aquí pasas los parámetros
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.results = result.data.convivencias || []; // Si no hay roles, asigna un arreglo vacío
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
        this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
      } finally {
        LocalStorageService.setIsLocked(false);
        this.loadingWorkPlace = false;
      }
    },
    handleEstadoChange(item, newValue) {
      // Guardar el estado original antes de cualquier cambio
      const originalEstado = item.estado;

      // Actualizar el estado en el item (esto es lo que haría v-model)
      item.estado = newValue;

      // Llamar a saveChange con ambos estados
      this.saveChange(item, originalEstado, newValue);
    },

    saveChange(item, previousState, newState) {
      // Si el estado no cambió, no hacemos nada
      if (previousState === newState) return;

      // Buscar el ítem original en results (por ID para seguridad)
      const originalItem = this.results.find(r => r.id === item.id);
      if (!originalItem) return;

      // Actualizar el array de cambios
      const existingChangeIndex = this.changes.findIndex(change => change.id === item.id);

      if (existingChangeIndex >= 0) {
        // Actualizar cambio existente
        this.changes[existingChangeIndex] = {
          id: item.id,
          estado: newState
        };
      } else {
        // Agregar nuevo cambio
        this.changes.push({
          id: item.id,
          estado: newState
        });
      }

      // Actualizar los contadores para todos los items del mismo profesional
      this.updateProfessionalStats(originalItem.professionalName, previousState, newState);
    },

    updateProfessionalStats(professionalName, previousState, newState) {
      // Encontrar todos los items del profesional
      const professionalItems = this.results.filter(r => r.professionalName === professionalName);
      if (professionalItems.length === 0) return;

      // Obtener las stats del primer item (todos comparten la misma referencia)
      const stats = professionalItems[0].professionalStats;

      // Disminuir el contador del estado anterior
      switch (previousState) {
        case 1: stats.fulfilled--; break;
        case 0: stats.not_fulfilled--; break;
        case 3: stats.not_updated--; break;
      }

      // Aumentar el contador del nuevo estado
      switch (newState) {
        case 1: stats.fulfilled++; break;
        case 0: stats.not_fulfilled++; break;
        case 3: stats.not_updated++; break;
      }

      // Actualizar la referencia en todos los items del profesional
      professionalItems.forEach(item => {
        item.professionalStats = { ...stats };
      });

      // Forzar actualización de la UI
      this.$nextTick(() => {
        this.results = [...this.results];
      });
    },
    editItem(item) {
      this.editedIndex = 1;
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem(item) {
      this.editedIndex = 1;
      this.editedItem.id = item.id;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      LocalStorageService.setIsLocked(true);
      //this.results.splice(this.editedIndex, 1)
      let request = {
        id: this.editedItem.id
      };
      /*axios
        .post('https://testapi.simplifies.cl/api/workplace-destroy', request)
        .then(() => {
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.showAlert("success", "Puesto de trabajo eliminado correctamente", 3000);
          this.initialize();
        });
      this.closeDelete()*/
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    async save(item) {
      LocalStorageService.setIsLocked(true);
      /*if (this.editedIndex > -1) {
        this.valid = false;
        this.data.id = this.editedItem.id;
        this.data.name = this.editedItem.name;
        /*axios
          .put('https://testapi.simplifies.cl/api/workplace', this.data)
          .then(() => {
          }).finally(() => {
            LocalStorageService.setIsLocked(false);
            this.showAlert("success", "Puesto de trabajo editado correctamente", 3000);
            this.initialize();
          });*/
      /*} else {*/
      this.valid = false;
      this.editedIndex = 1;
      this.editedItem = Object.assign({}, item);
      this.loadingWorkPlace = true;

      //this.data = {};
      //this.data.id = this.editedItem.id;
      //this.data.estado = this.editedItem.estado;
      try {
        const result = await handleRequest({
          endpoint: 'branchruleprofessional-state',
          method: 'POST',
          data: { changes: this.changes }// Aquí pasas los parámetros
        });

        if (result.success) {
          this.dialog = false;
          this.showAlert("success", "Estado de la convivencia actualizado correctamente", 3000);
          this.changes = [];
        }
      } catch (error) {
        this.dialog = false;
        LocalStorageService.setIsLocked(false);
        this.changes = [];
        // Captura de errores no controlados
        this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
      } finally {
        this.dialog = false;
        LocalStorageService.setIsLocked(false);
        this.loadingWorkPlace = false;
        this.changes = [];
        await this.initialize();
      }

      /*axios
        .post('https://testapi.simplifies.cl/api/workplace', this.data)
        .then(() => {
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.showAlert("success", "Puesto de trabajo creado correctamente", 3000);
          this.initialize();
        });*/
      //}
      this.close()
    },
    // Método para cancelar cambios
    cancelChanges() {
      // Restaurar los datos originales desde la copia de seguridad
      this.results = _.cloneDeep(this.resultsOriginal);
      // Limpiar los cambios pendientes
      this.changes = [];
    },
  },
}
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