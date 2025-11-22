<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-snackbar class="mt-12" location="right top" :timeout="sb_timeout" :color="sb_type" elevation="24" :multi-line="true"
    vertical v-model="snackbar">
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
        <v-col cols="12" md="4" class="grow ml-4">
          <span class="text-subtitle-1"> <strong>Categorías de Productos </strong></span>
        </v-col>
         <v-col cols="12" md="5" ></v-col>
        <v-col cols="12" md="2">

          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" class="text-subtitle-1" color="#E7E9E9" variant="flat" elevation="2"
                prepend-icon="mdi-plus-circle">
                Nueva Categoría
              </v-btn>
            </template>
            <v-card>
              <v-toolbar color="#F18254">
                <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
              </v-toolbar>
              <v-card-text>
                <v-form v-model="valid" enctype="multipart/form-data">
                  <v-container>
                    <!-- Primera fila: Nombre -->
                    <v-row>
                      <v-col cols="12">
                        <v-text-field 
                          v-model="editedItem.name" 
                          clearable 
                          label="Nombre"
                          prepend-icon="mdi-tag-check" 
                          variant="underlined" 
                          :rules="nameRules">
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <!-- Segunda fila: Campos de comisión -->
                    <v-row>
                      <v-col cols="12" md="6">
                        
                        <!--<v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.gives_commission"
                        :items="commissionOptions" label="Da comisión" item-title="name" item-value="id"
                        variant="underlined" :rules="commissionSelectRules" prepend-icon="mdi-cash-multiple">
                        <template v-slot:item="{ props, item }">
                          <v-list-item
                            v-bind="props"
                            :prepend-icon="item.raw.icon"
                            :class="item.raw.id ? 'text-green-darken-3' : 'text-red-darken-3'"
                            :title="item.raw.name"
                          >
                            <template v-slot:prepend>
                              <v-icon 
                                :icon="item.raw.icon" 
                                :color="item.raw.id ? 'green-darken-3' : 'red-darken-3'"
                                size="large"
                              />
                            </template>
                          </v-list-item>
                        </template>
                        
                        <template v-slot:selection="{ item }">
                          <div class="d-flex align-center">
                            <v-icon 
                              :icon="item.raw.icon"
                              :color="item.raw.id ? 'green-darken-3' : 'red-darken-3'"
                              class="mr-2"
                            />
                            <span class="font-weight-medium">
                              {{ item.title }}
                            </span>
                          </div>
                        </template>
                      </v-autocomplete>-->
                      <v-switch
                        v-model="editedItem.gives_commission"
                        :true-value="1"
                        :false-value="0"
                        :label="`Comisión: ${editedItem.gives_commission ? 'Sí' : 'No'}`"
                        color="#F18254"
                        hide-details
                        inset
                        class="custom-switch"
                      >
                        <template v-slot:label>
                          <span class="text-body-1" :style="{ color: editedItem.gives_commission ? '#F18254' : 'grey' }">
                            Comisión: 
                            <span class="text-body-1">
                              {{ editedItem.gives_commission ? 'Sí' : 'No' }}
                            </span>
                          </span>
                        </template>
                      </v-switch>
                      </v-col>
                    </v-row>

                    <!-- Tercera fila: Descripción como textarea -->
                    <v-row>
                      <v-col cols="12">
                        <v-textarea
                          v-model="editedItem.description"
                          label="Descripción"
                          prepend-icon="mdi-form-textarea"
                          variant="underlined"
                          :rules="dirRules"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-container>

                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#E7E9E9" variant="flat" @click="close">
                      Cancelar
                    </v-btn>
                    <v-btn color="#F18254" variant="flat" @click="save" :disabled="!valid">
                      Aceptar
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>

              <v-toolbar color="red">
                <span class="text-subtitle-2 ml-4"> Eliminar Categoría de Producto</span>
              </v-toolbar>

              <v-card-text class="mt-2 mb-2"> ¿Desea eliminar la Categoría de Producto?</v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="closeDelete">
                  Cancelar
                </v-btn>
                <v-btn color="primary" variant="flat" @click="deleteItemConfirm">
                  Aceptar
                </v-btn>

              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-card-text>
      <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details></v-text-field>
      <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :search="search" :items="results" class="elevation-1" no-data-text="No hay datos disponibles"
        no-results-text="No hay datos disponibles" :loading="loadingCategory" loading-text="Cargando datos...">
        <template v-slot:item.actions="{ item }">
          <v-btn density="comfortable" icon="mdi-pencil"  @click="editItem(item)" color="primary" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Editar categoría"></v-btn>
          <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar categoría"></v-btn>
        </template>
        <template v-slot:item.gives_commission="{ item }">
        <v-chip
          :color="item.gives_commission ? 'green-darken-3' : 'red-darken-3'"
          :prepend-icon="item.gives_commission ? 'mdi-check-circle' : 'mdi-close-circle'"
          :text="item.gives_commission ? 'Sí' : 'No'"
          variant="outlined"
        ></v-chip>
      </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script>


import { handleRequest } from "@/utils/api"; // Ruta al archivo
import LocalStorageService from "@/LocalStorageService";


export default {

  data: () => ({
    loadingCategory: false,
    valid: true,
    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
    search: '',
    dialog: false,
    dialogDelete: false,

    headers: [

      { title: 'Categoría de Producto', key: 'name', sortable: true },
      { title: 'Comisión', key: 'gives_commission', sortable: true },
      { title: 'Descripción', key: 'description' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    results: [],
    editedIndex: -1,

    editedItem: {
      name: '',
      id: '',
      gives_commission: null,
      description: '',
    },

    commissionOptions: [
      { name: 'No', id: 0, icon: 'mdi-close-circle' },
      { name: 'Sí', id: 1, icon: 'mdi-check-circle' }
    ],
    commissionSelectRules: [
      v => v !== null && v !== undefined || 'Debe seleccionar una opción',
      v => [0, 1].includes(v) || 'Seleccione una opción válida'
    ],
    data: {},

    defaultItem: {
      id: '',
      name: '',
      gives_commission: null,
      description: '',
    },

    nameRules: [
      (v) => !!v || "El Nombre es requerido",
      (v) =>
        (v && v.length <= 40) ||
        "El campo debe tener menos de 41 caracteres",
      (v) => /^[a-zA-ZáÁéÉíÍóÓúÚñÑ\s']+$/.test(v) || "El campo no es válido",],
      dirRules: [
        (v) => !!v || "El campo es requerido",
        (v) => (v && v.length <= 250) ||
          "El campo debe tener menos de 251 caracteres",
          (v) => (v && v.length >= 3) ||
          "El campo debe tener al menos de 3 caracteres",
      ]
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nueva Categoría de Producto' : 'Editar Categoría de Producto'
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

  mounted() {
    this.initialize()
  },

  methods: {
    validateCommissionRate(v) {
    if (this.editedItem?.gives_commission !== 1) return true;
    if (v === null || v === '') return 'La tasa es requerida';
    const num = Number(v);
    if (isNaN(num)) return 'Debe ser un número válido';
    if (num < 0 || num > 100) return 'Debe ser entre 0 y 100%';
    return true;
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

    async initialize() {
      this.loadingCategory = true;
      LocalStorageService.setIsLocked(true);
        try {
        const result = await handleRequest({
          endpoint: 'product-category',
          method: 'GET',
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.results = result.data?.productcategories || []; // Si no hay roles, asigna un arreglo vacío
        } else {
          // Si no hay datos, asignamos un array vacío
          this.results = [];
        }
      } catch (error) {
        this.loadingCategory = false;
        // Captura de errores no controlados
        this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
      } finally {
        this.loadingCategory = false;
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
      this.$axios.post('product-category-destroy', request)
        .then(() => {
          LocalStorageService.setIsLocked(false);
          this.initialize();
          this.showAlert("success", "Categoría de Producto eliminada correctamente", 3000)
        }).catch(() => {
          this.showAlert("error", "No se puede Eliminar la Categoría de Producto", 3000)
        })
      this.closeDelete()
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
    async save() {
      LocalStorageService.setIsLocked(true);
      this.data = {};
      if (this.editedIndex > -1) {
          this.valid = false;
          this.data.id = this.editedItem.id;
          this.data.name = this.editedItem.name;
          this.data.description = this.editedItem.description;
          this.data.gives_commission = Number(this.editedItem.gives_commission);
          this.data.commission_rate = Number(this.editedItem.commission_rate);
          try {
            const result = await handleRequest({
              endpoint: 'product-category-update',
              method: 'POST',
              data: this.data
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              LocalStorageService.setIsLocked(false);
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              LocalStorageService.setIsLocked(true);
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            // Este bloque captura errores inesperados fuera del manejo estándar
            this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
          } 
      } else {
        this.valid = false;
        this.data = {};
          this.data.id = this.editedItem.id;
          this.data.name = this.editedItem.name;
          this.data.description = this.editedItem.description;
          this.data.gives_commission = Number(this.editedItem.gives_commission);
          this.data.commission_rate = Number(this.editedItem.commission_rate);
          try {
            const result = await handleRequest({
              endpoint: 'product-category',
              method: 'POST',
              data: this.data
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              LocalStorageService.setIsLocked(false);
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              LocalStorageService.setIsLocked(true);
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            // Este bloque captura errores inesperados fuera del manejo estándar
            this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
          } 
      }
      this.close()


    },
  },
}
</script>

<style scoped>
.custom-switch {
  transform: scale(1);
  margin-left: 8px;
}
</style>