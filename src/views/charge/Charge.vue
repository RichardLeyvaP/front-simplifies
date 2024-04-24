<!-- eslint-disable vue/multi-word-component-names -->
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
          <span class="text-subtitle-1"> <strong>Listados de Cargos</strong></span>
        </v-col>
        <v-col cols="12" md="5" class="mr-12"></v-col>
        <v-col cols="12" md="2" class=" ">

          <v-dialog v-model="dialog" max-width="1000px">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" class="text-subtitle-1  ml-12 " color="#E7E9E9" variant="flat" elevation="2"
                prepend-icon="mdi-plus-circle">
                Nuevo Cargo
              </v-btn>
            </template>
            <v-card>
              <v-toolbar color="#F18254">
                <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
              </v-toolbar>
              <v-card-text>
                <v-form v-model="valid" enctype="multipart/form-data">
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.name" clearable label="Nombre del Cargo"
                          prepend-icon="mdi-family-tree" variant="underlined" :rules="nameRules" :disabled="(editedItem.name === 'Barbero' || editedItem.name === 'Encargado' || editedItem.name === 'Tecnico' || editedItem.name === 'Coordinador' || editedItem.name === 'Administrador' || editedItem.name === 'Cajero (a)')">
                        </v-text-field>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.description" clearable label="Descripción"
                          prepend-icon="mdi-form-textarea" variant="underlined" :rules="dirRules">
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
                <span class="text-subtitle-2 ml-4"> Eliminar cargo</span>
              </v-toolbar>

              <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el cargo?</v-card-text>
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
          <!--Permisos-->
          <v-dialog v-model="dialogPermissions" fullscreen transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-h6 ml-4"> Permisos del cargo</span>
            <v-spacer></v-spacer>
            <v-btn class="text-subtitle-1  ml-12" color="#E7E9E9" variant="flat" @click="showAddPermission()">
              Asignar Permiso
            </v-btn>
          </v-toolbar>
          <v-card-text class="mt-2 mb-2">
            <v-text-field class="mt-1 mb-1" v-model="search2" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details></v-text-field>
            <v-data-table :headers="headers2" :items="chargePermissions" :search="search2" class="elevation-1" :items-per-page-text="'Elementos por páginas'"  no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">
              <template v-slot:item.actions="{ item }">
                <!--<v-icon size="25" color="red" @click="closePermissosRequest(item)">
                  mdi-delete
                </v-icon>-->
                <v-btn density="comfortable" icon="mdi-delete" @click="closePermissosRequest(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar asignación"></v-btn>
              </template>

            </v-data-table>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="closeDelete">
              Volver
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogAddPermission" width="500">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-2 ml-4">Asignar Permiso</span>
          </v-toolbar>
          <v-card-text class="mt-2 mb-2">
            <v-form ref="form" v-model="valid" enctype="multipart/form-data">
              <v-container>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="permission_id" :items="permissions" label="Permisos"
                      prepend-icon="mdi-lock" item-title="name" item-value="id" variant="underlined"
                      :rules="selectRules"></v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="closePermission">
                  Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" @click="savePermission" :disabled="!valid">
                  Aceptar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDeletePermission" width="500">
        <v-card>

          <v-toolbar color="red">
            <span class="text-subtitle-2 ml-4"> Eliminar permiso a cargo</span>
          </v-toolbar>

          <v-card-text class="mt-2 mb-2"> ¿Desea eliminar este permiso a este cargo?</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="closerequestPermission">
              Cancelar
            </v-btn>
            <v-btn color="#F18254" variant="flat" @click="permissionDelete">
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
      <v-data-table :headers="headers" :search="search" :items-per-page-text="'Elementos por páginas'" :items="results" class="elevation-1" no-data-text="No hay datos disponibles"
        no-results-text="No hay datos disponibles">
        <template v-slot:item.actions="{ item }">
          <!--<v-icon size="25" color="blue" class="me-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>          
          <v-icon size="25" color="green" @click="showPermission(item)">
            mdi-lock
          </v-icon>
          <v-icon size="25" :color="(item.name === 'Barbero' || item.name === 'Encargado' || item.name === 'Tecnico' || item.name === 'Coordinador' || item.name === 'Administrador') ? 'grey' : 'red'"
        @click="!(item.name === 'Barbero' || item.name === 'Encargado' || item.name === 'Tecnico' || item.name === 'Coordinador'  || item.name === 'Administrador') && deleteItem(item)">
  mdi-delete
</v-icon>-->
          <!--<v-icon size="25" color="red" @click="deleteItem(item)">
            mdi-delete
          </v-icon>-->
          <v-btn density="comfortable" icon="mdi-pencil"  @click="editItem(item)" color="primary" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Editar cargo"></v-btn>
          <v-btn density="comfortable" icon="mdi-lock" @click="showPermission(item)" color="green" variant="tonal"
            elevation="1" title="Mostrar permisos asignados"></v-btn>
            <v-btn density="comfortable" icon="mdi-delete" @click="(item.name === 'Barbero' || item.name === 'Encargado' || item.name === 'Tecnico' || item.name === 'Coordinador' || item.name === 'Administrador' || item.name === 'Barbero y Encargado' || item.name === 'Cajero (a)') ? '': deleteItem(item)" :color="(item.name === 'Barbero' || item.name === 'Encargado' || item.name === 'Tecnico' || item.name === 'Coordinador' || item.name === 'Administrador' || item.name === 'Barbero y Encargado' || item.name === 'Cajero (a)') ? 'grey' : 'red'" variant="tonal"
            elevation="1" title="Eliminar cargo"></v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script>

import axios from "axios";
export default {

  data: () => ({

    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
    chargeSelect: '',
    dialog: false,
    search:'',
    dialogDelete: false,

    headers: [

      { title: 'Cargo', key: 'name' },
      { title: 'Descripción', key: 'description' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    headers2: [
    { title: 'Módulo', key: 'module' },
      { title: 'Descrpción', key: 'description' },
      { title: 'Nombre Permiso', key: 'name' },
   
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    results: [],
    chargePermissions: [],
    permissions: [],
    charge_id: '',
    dialogPermissions: false,
    dialogAddPermission: false,
    dialogDeletePermission: false,
    editedIndex: -1,
    search2: '',
    valid: true,
    editedItem: {
      name: '',
      description: '',
      id: ''
    },
    data: {},

    defaultItem: {
      description: '',
      name: '',
    },
      permission_id: '',
    nameRules: [
      (v) => !!v || "El Nombre es requerido",
      (v) =>
        (v && v.length <= 40) ||
        "El Nombre debe tener menos de 41 caracteres",
      (v) => /^[a-zA-ZáÁéÉíÍóÓúÚñÑ\s()']+$/.test(v) || "El Nombre no es válido",],
    dirRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 250) ||
        "El campo debe tener menos de 251 caracteres",
      (v) => (v && v.length >= 3) ||
        "El campo debe tener al menos de 3 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemeto"],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Cargo' : 'Editar Cargo'
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
        .get('http://127.0.0.1:8000/api/charge')
        .then((response) => {
          console.log("entra a Buscar cargos")
          this.results = response.data.charges;
        })
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
      //this.results.splice(this.editedIndex, 1)
      let request = {
        id: this.editedItem.id
      };
      axios
        .post('http://127.0.0.1:8000/api/charge-destroy', request)
        .then(() => {
          this.initialize();
          this.showAlert("success", "Cargo eliminado correctamente", 3000)
        }).catch(() => {
          this.showAlert("error", "No se puede Eliminar el Cargo", 3000)
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
      this.dialogDelete = false;
      this.dialogPermissions = false;
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

        axios
          .put('http://127.0.0.1:8000/api/charge', this.data)
          .then(() => {
          }).finally(() => {
            this.showAlert("success", "Cargo editado correctamente", 3000);
            this.initialize();
          });
      } else {
        this.valid = false;
        this.data.name = this.editedItem.name;
        this.data.description = this.editedItem.description;
        axios
          .post('http://127.0.0.1:8000/api/charge', this.data)
          .then(() => {
          }).finally(() => {
            this.showAlert("success", "Cargo registrado correctamente", 3000);
            this.initialize();
          });
      }
      this.close()
    },
    closePermission() {
      this.dialogAddPermission = false;
      this.permission_id = '';
      this.showPermission(this.chargeSelect);
    },
    showPermission(item) {
      this.chargeSelect = item;
      console.log(this.chargeSelect);
      this.charge_id = item.id;
      console.log(item.id);
      axios
        .get('http://127.0.0.1:8000/api/charge-permission-show', {
          params: {
            charge_id: item.id
          }
        })
        .then((response) => {
          this.chargePermissions = response.data.permissions;
        });
        
      this.dialogPermissions = true;
    },
    showAddPermission(){
    axios
            .get('http://127.0.0.1:8000/api/charge-permission-NOTIN', {
              params: {
                charge_id: this.chargeSelect.id
              }
            })
            .then((response) => {
              this.permissions = response.data.permissions;
            });
            this.dialogAddPermission = true;
    },
    savePermission() {
      this.valid = false,
        this.data.charge_id = this.charge_id;
      this.data.permission_id = this.permission_id;
      axios
        .post('http://127.0.0.1:8000/api/charge-permission', this.data)
        .then(() => {
         this.charge_id = '',
         this.permission_id = '',
          this.dialogAddPermission = false;
        }).finally(() => {
          this.showAlert("success", "Permiso asignado correctamente", 3000);
          this.showPermission(this.chargeSelect);
          });
    },
    closePermissosRequest(item) {
      console.log(item);
      this.dialogDeletePermission = true
      //this.editedItem.branch_id=item.id
      this.permission_id = item.permission_id;
      this.charge_id = item.charge_id;
    },
    permissionDelete() {
      let request = {
        charge_id: this.charge_id,
        permission_id: this.permission_id
      };
      axios
        .post('http://127.0.0.1:8000/api/charge-permission-destroy', request)
        .then(() => {
          this.dialogDeletePermission = false
          this.charge_id = '',
         this.permission_id = '',
          console.log(this.chargeSelect);
          this.showPermission(this.chargeSelect)
          this.showAlert("success", "Permiso eliminado a este cargo correctamente", 3000)
        })
    },
    closerequestPermission() {
      this.dialogDeletePermission = false;
      this.charge_id = '',
         this.permission_id = '',
      this.showPermission(this.chargeSelect)
    },
  },
}
</script>