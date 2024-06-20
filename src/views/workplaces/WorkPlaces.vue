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
          <v-col cols="12" md="5" class="grow ml-4 t">
            <span class="text-subtitle-1"> <strong>Puesto de Trabajo</strong></span>
          </v-col>
           <v-col cols="12" md="4"></v-col>
          <v-col cols="12" md="2">
  
            <v-dialog v-model="dialog" max-width="800px">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" class="text-subtitle-1  ml-12 " color="#E7E9E9" variant="flat" elevation="2"
                  prepend-icon="mdi-plus-circle">
                  Nuevo Puesto
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
                        <v-col cols="12" md="12">
                          <v-text-field v-model="editedItem.name" clearable label="Nombre del Puesto de trabajo"
                            prepend-icon="mdi-ruler" variant="underlined" :rules="nameRules">
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
                  <span class="text-subtitle-2 ml-4"> Eliminar el puesto de trabajo</span>
                </v-toolbar>
  
                <v-card-text class="mt-2 mb-2"> ¿Desea eliminar la el puesto de trabajo?</v-card-text>
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
        <v-row>
     <v-col cols="12" sm="12" md="4">
       <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches" v-if="this.mostrarFila" clearable
         label="Seleccione una Sucursal" prepend-icon="mdi-store" item-title="name" item-value="id"
         variant="underlined" @update:model-value="initialize()"></v-autocomplete>
     </v-col>
   </v-row>
   <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details></v-text-field>
        <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :search="search" :items="results" class="elevation-1" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">
          <template v-slot:item.actions="{ item }">
            <v-btn density="comfortable" icon="mdi-pencil"  @click="editItem(item)" color="primary" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Editar Puesto de Trabajo"></v-btn>
          <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar Puesto de Trabajo"></v-btn>
            <!--<v-icon size="25" color="blue" class="me-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon size="25" color="red" @click="deleteItem(item)">
              mdi-delete
            </v-icon>-->
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  
  import axios from "axios";
  import LocalStorageService from "@/LocalStorageService";

axios.interceptors.request.use(config => {
  const token = LocalStorageService.getItem('token'); // Suponiendo que guardaste el token en localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token.replace(/['"]+/g, '')}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

  export default {
    data: () => ({
      valid: true,
      snackbar: false,
      sb_type: '',
      sb_message: '',
      sb_timeout: 2000,
      sb_title:'',
      sb_icon:'',
      branch_id:'',
      charge: '',
      business_id: '',
      branches: '',
      search: '',
      mostrarFila: false,
      dialog: false,
      dialogDelete: false,
      headers: [  
        { title: 'Nombre del puesto', value: 'name' },
        { title: 'Acciones', value: 'actions' },
      ],
      results: [],
  
      professionals: [],
  
      editedIndex: -1,
  
      editedItem: {
        id: '',
        name: '',
      },
      data: {},
  
      defaultItem: {
        name: '',
      },
      nameRules: [
       (v) => !!v || "El campo es requerido",
       ],
     selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    }),
  
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Nuevo Puesto de trabajo' : 'Editar Puesto de trabajo'
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
        this.business_id = LocalStorageService.getItem('business_id');
        this.branch_id = LocalStorageService.getItem('branch_id');        
        this.charge_id = LocalStorageService.getItem('charge_id');
        this.charge = JSON.parse(LocalStorageService.getItem("charge"));
        LocalStorageService.setIsLocked(true);
        axios
            .get('https://api2.simplifies.cl/api/show-business', {
                params: {
                    business_id: this.business_id
                }
            })
            .then((response) => {
                this.branches = response.data.branches;
            }).finally(() => {
              LocalStorageService.setIsLocked(false);
            if (this.charge === 'Administrador') {
                    this.branch_id = this.branches[0].id;
                    this.mostrarFila = true;
                }
                this.initialize()
          });
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
        LocalStorageService.setIsLocked(true);
        axios
          .get('https://api2.simplifies.cl/api/branch-show', {
            params:{
                branch_id: this.branch_id
            }
          })
          .then((response) => {
            this.results = response.data.workplaces;
          }).finally(() => {
            LocalStorageService.setIsLocked(false);
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
        axios
          .post('https://api2.simplifies.cl/api/workplace-destroy', request)
          .then(() => {
          }).finally(() => {
            LocalStorageService.setIsLocked(false);
              this.showAlert("success", "Puesto de trabajo eliminado correctamente", 3000);
              this.initialize();
          });
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
      save() {
        LocalStorageService.setIsLocked(true);
        if (this.editedIndex > -1) {
          this.valid = false;
          this.data.id = this.editedItem.id;
          this.data.name = this.editedItem.name;
          axios
            .put('https://api2.simplifies.cl/api/workplace', this.data)
            .then(() => {
            }).finally(() => {
              LocalStorageService.setIsLocked(false);
                    this.showAlert("success", "Puesto de trabajo editado correctamente", 3000);
                    this.initialize();
          });
        } else {
          this.valid = false;
          this.data.name = this.editedItem.name;
          this.data.branch_id = this.branch_id
  
          axios
            .post('https://api2.simplifies.cl/api/workplace', this.data)
            .then(() => {
            }).finally(() => {
              LocalStorageService.setIsLocked(false);
                    this.showAlert("success", "Puesto de trabajo creado correctamente", 3000);
                    this.initialize();
          });
        }
        this.close()
      },
    },
  }
  </script>