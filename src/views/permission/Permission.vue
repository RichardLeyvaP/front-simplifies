<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable no-unused-vars -->
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
          <span class="text-subtitle-1"> <strong>Listados Permisos</strong></span>
        </v-col>
        <v-col cols="12" md="5"></v-col>
        <v-col cols="12" md="2">

          <v-dialog v-model="dialog" max-width="900px">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" class="text-subtitle-1  ml-12 " color="#E7E9E9" variant="flat" elevation="2"
                prepend-icon="mdi-plus-circle">
                Nuevo Permiso
              </v-btn>
            </template>
            <v-card>
                <v-toolbar color="#F18254">
                  <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
                </v-toolbar>
                <v-card-text>                  
              <v-form ref="form" v-model="valid" enctype="multipart/form-data">
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.name" clearable label="Nombre"
                          prepend-icon="mdi-pound-box-outline" variant="underlined" :rules="nameRules" :disabled="editFile">
                        </v-text-field>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.module" clearable label="Módulo"
                          prepend-icon="mdi-map" variant="underlined" :rules="nameRules">
                        </v-text-field>
                      </v-col>

                      <v-col cols="12" md="12">
                        <v-text-field v-model="editedItem.description" clearable label="Descripción"
                          prepend-icon="mdi-form-textarea" variant="underlined" :rules="nameRules">
                        </v-text-field>
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
                <span class="text-subtitle-2 ml-4"> Eliminar Permiso</span>
              </v-toolbar>

              <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el Permiso?</v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="closeDelete">
                  Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" @click="deleteItemConfirm">
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
            hide-details>
          </v-text-field>
      <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="results" class="elevation-1" :search="search" no-data-text="No hay datos disponibles"
        no-results-text="No hay datos disponibles">
        <template v-slot:item.actions="{ item }">
          <!--<v-icon size="25" color="blue" class="me-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon size="25" color="red" @click="deleteItem(item)">
            mdi-delete
          </v-icon>-->
          <v-btn density="comfortable" icon="mdi-pencil"  @click="editItem(item)" color="primary" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Editar Permiso"></v-btn>
          <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar Permiso"></v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script>

import axios from "axios";
export default {

  data: () => ({
    valid: true,
    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
    cardSelect: '',
    dialog: false,
    dialogDelete: false,
    editFile: false,
    search: '',
    headers: [
      { title: 'Módulo', key: 'module' },
      { title: 'Nombre', key: 'name' },
      { title: 'Descripción', key: 'description' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    results: [],
    editedIndex: -1,

    editedItemaddper: {
      name: '',
      module: '',
      description: ''

    },
    editedItem: {
      id: '',
      name: '',
      module: '',
      description: ''

    },
    data: {},

    defaultItem: {
      name: '',
      module: '',
      description: ''
    },
    dirRules: [
        (v) => !!v || "El campo es requerido",
        (v) => (v && v.length <= 250) ||
          "El campo debe tener menos de 251 caracteres",
          (v) => (v && v.length >= 3) ||
          "El campo debe tener al menos de 3 caracteres",
      ],
    nameRules: [
      (v) => !!v || "El Nombre es requerido",
      (v) =>
        (v && v.length <= 251) ||
        "El Nombre debe tener menos de 251 caracteres",
      (v) => /^[a-zA-ZáÁéÉíÍóÓúÚñÑ_\s()']+$/.test(v) || "El Nombre no es válido",],
      requiredRules: [(v) => !!v || "Seleccionar al menos un elemeto"],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Permiso' : 'Editar Permiso'
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

    initialize() {
      axios
        .get('http://127.0.0.1:8000/api/permission')
        .then((response) => {
          console.log("entra a Buscar permisos")
          this.results = response.data;
        })
    },
    editItem(item) {
      this.editedIndex = 1;
      this.editedItem = Object.assign({}, item)
      this.dialog = true;
      this.editFile = true;
    },
    deleteItem(item) {
      this.editedIndex = 1;
      this.editedItem.id = item.id;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      //this.results.splice(this.editedIndex, 1)
      let request = {
        id: this.editedItem.id
      };
      axios
        .post('http://127.0.0.1:8000/api/permission-destroy', request)
        .then(() => {
          this.initialize();
          this.showAlert("success", "Permiso eliminado correctamente", 3000)
        }).catch(() => {
          this.showAlert("error", "No se puede Eliminar el permiso", 3000)
        })
      this.closeDelete()
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1;
        this.editFile = false;
      })
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save() {
      if (this.editedIndex > -1) {
        this.valid = false;
        this.data.id = this.editedItem.id;
        this.data.name = this.editedItem.name;
        this.data.description = this.editedItem.description;
        this.data.module = this.editedItem.module;
        axios
          .put('http://127.0.0.1:8000/api/permission', this.data)
          .then(() => {
            this.initialize();
            this.showAlert("success", "Permiso editado correctamente", 3000)
          })
      } else {
        this.valid = false;
        this.data.name = this.editedItem.name;
        this.data.description = this.editedItem.description;
        this.data.module = this.editedItem.module;
        axios
          .post('http://127.0.0.1:8000/api/permission', this.data)
          .then(() => {
            this.initialize();
            this.showAlert("success", "Permiso registrado correctamente", 3000);
            this.editFile = true;
          })
      }
      this.close()


    },
  },
}
</script>