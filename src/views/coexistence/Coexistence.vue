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
          <span class="text-subtitle-1"> <strong>Convivencias por trabajador</strong></span>
        </v-col>
        <v-col cols="12" md="4"></v-col>
        <v-col cols="12" md="2">

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
              <!-- Botón de expandir solo para el encabezado del grupo -->
              <v-btn size="small" variant="text" :icon="isGroupOpen(item) ? '$expand' : '$next'"
                @click="toggleGroup(item)"></v-btn>
              {{ item.value }}
            </td>
          </tr>
        </template>
        <!-- Columna del estado con v-switch -->
        <template v-slot:item.estado="{ item }">
          <div class="d-flex align-center" style="height: 100%;">
            <!-- Switch -->
            <v-switch v-model="item.estado" :true-value="1" :false-value="0" :color="getEstadoInfo(item.estado).color"
              @change="save(item)" class="mr-2" style="margin-top: 20px;"></v-switch>

            <!-- Icono y nombre del estado -->
            <div class="d-flex align-center">
              <v-icon :color="getEstadoInfo(item.estado).color" class="mr-2">
                {{ getEstadoInfo(item.estado).icon }}
              </v-icon>
              <span>{{ getEstadoInfo(item.estado).name }}</span>
            </div>
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
    dialogDelete: false,
    states: [
      { id: 3, name: 'No se ha actualizado', icon: 'mdi-help-circle', color: 'grey' },
      { id: 0, name: 'Incumplió', icon: 'mdi-close-circle', color: 'red' },
      { id: 1, name: 'Cumplió', icon: 'mdi-check-circle', color: 'green' },
    ],
    groupBy: [
      {
        key: 'professionalName',
      },
    ],
    headers: [
      //title: 'Nombre del profesional', value: 'professionalName' },
      { title: 'Regla de Convivencia', value: 'ruleName' },
      { title: 'Estado Convivencia', value: 'estado' },
      { title: 'Actualizado', value: 'last_edited_at' },
      //title: 'Acciones', value: 'actions' },
    ],
    results: [],

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
        date: "2025-03-11",
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
        } else {
          LocalStorageService.setIsLocked(false);
          this.loadingWorkPlace = false;
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
        .post('http://127.0.0.1:8000/api/workplace-destroy', request)
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
          .put('http://127.0.0.1:8000/api/workplace', this.data)
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
      const requestParams = {
        id: this.editedItem.id,
        estado: this.editedItem.estado,
      };
      try {
        const result = await handleRequest({
          endpoint: 'branchruleprofessional-state',
          method: 'PUT',
          params: requestParams // Aquí pasas los parámetros
        });

        if (result.success) {
          this.dialog = false;
          this.showAlert("success", "Estado de la convivencia actualizado correctamente", 3000);
        }
      } catch (error) {
        this.dialog = false;
        LocalStorageService.setIsLocked(false);
        // Captura de errores no controlados
        this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
      } finally {
        this.dialog = false;
        LocalStorageService.setIsLocked(false);
        this.loadingWorkPlace = false;
        await this.initialize();
      }

      /*axios
        .post('http://127.0.0.1:8000/api/workplace', this.data)
        .then(() => {
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.showAlert("success", "Puesto de trabajo creado correctamente", 3000);
          this.initialize();
        });*/
      //}
      this.close()
    },
  },
}
</script>