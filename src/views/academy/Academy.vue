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
          <v-col cols="12" md="4" class="grow ml-4 t">
            <span class="text-subtitle-1"> <strong>Academias</strong></span>
          </v-col>
          <v-col cols="12" md="4" class="mr-12"></v-col>
          <v-col cols="12" md="3" class="pl-12 ">
  
            <v-dialog v-model="dialog" max-width="700px">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" class="text-subtitle-1  ml-12 " color="#E7E9E9" variant="flat" elevation="2"
                  prepend-icon="mdi-plus-circle">
                  Nueva Academia
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
                          <v-text-field v-model="editedItem.name" clearable label="Nombre de la Academia"
                            prepend-icon="mdi-ruler" variant="underlined" :rules="nameRules">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="12">
                          <v-text-field v-model="editedItem.description" clearable label="Descripción"
                            prepend-icon="mdi-form-textarea" variant="underlined" :rules="descripRules">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="12">
                          <v-autocomplete v-model="editedItem.business_id" :items="business" clearable label="Negocio" prepend-icon="mdi-domain" item-title="name" item-value="id" variant="underlined" :rules="selectRules"></v-autocomplete>
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
                  <span class="text-subtitle-2 ml-4"> Eliminar Academia</span>
                </v-toolbar>
  
                <v-card-text class="mt-2 mb-2"> ¿Desea eliminar la Academia?</v-card-text>
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
        <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="results" class="elevation-1" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">
          <template v-slot:item.actions="{ item }">
            <v-icon size="25" color="blue" class="me-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon size="25" color="red" @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  
  import axios from "axios";
  import LocalStorageService from "@/LocalStorageService";
  //import { UserTokenStore } from "@/store/UserTokenStore";

//const userTokenStore = UserTokenStore();
  export default {
    data: () => ({
      valid: true,
      snackbar: false,
      sb_type: '',
      sb_message: '',
      sb_timeout: 2000,
      sb_title:'',
      sb_icon:'',
      business_id: '',
  
      dialog: false,
      dialogDelete: false,
      headers: [
  
        { title: 'Academia', value: 'name' },
        { title: 'Descripción', value: 'description' },
        { title: 'Negocio', value: 'business.name' },
        { title: 'Acciones', key: 'actions', sortable: false },
      ],
      results: [],
  
      business: [],
  
      editedIndex: -1,
  
      editedItem: {
        id: '',
        name: '',
        description: '',
        business_id: '',
      },
      data: {},
  
      defaultItem: {
        name: '',
        description: '',
        business_id: '',
      },
      nameRules: [
       (v) => !!v || "El campo es requerido",
       (v) => (v && v.length <= 100) ||
         "El campo debe tener menos de 101 caracteres",
         (v) => (v && v.length >= 3) ||
         "El campo debe tener al menos de 3 caracteres",
     ],
      descripRules: [
        (v) => !!v || "El campo es requerido",
        (v) => (v && v.length <= 250) ||
          "El campo debe tener menos de 251 caracteres",
          (v) => (v && v.length >= 3) ||
          "El campo debe tener al menos 3 caracteres",
        ],
     selectRules: [(v) => !!v || "Seleccionar al menos un elemeto"],
    }),
  
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Nueva Academia' : 'Editar Academia'
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
  
    created() {
      this.business_id = LocalStorageService.getItem('business_id');
      //this.business_id = userTokenStore.business_id;
      this.initialize();
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
          .get('http://127.0.0.1:8000/api/enrollment-show', {
            params: {
                business_id: this.business_id
            }
          })
          .then((response) => {
            this.results = response.data.enrollments;
            console.log('academias');
            console.log(this.results);
          });
  
        axios
          .get('http://127.0.0.1:8000/api/business')
          .then((response) => {
            console.log(response.data);
            this.business = response.data.business;
            if (this.business.length > 0) {
      this.editedItem.business_id = this.business[0].id; // Establecer el primer negocio como valor predeterminado
    }        
    console.log('this.editedItem.business_id');
      console.log(this.editedItem.business_id);
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
        //this.results.splice(this.editedIndex, 1)
        let request = {
          id: this.editedItem.id
        };
        axios
          .post('http://127.0.0.1:8000/api/enrollment-destroy', request)
          .then(() => {
            this.initialize();
            this.showAlert("success","Academia eliminada correctamente", 3000)
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
      save() {
        if (this.editedIndex > -1) {
          this.valid = false;
          this.data.id = this.editedItem.id;
          this.data.name = this.editedItem.name;
          this.data.description = this.editedItem.description;
          this.data.business_id = this.editedItem.business_id;
          axios
            .put('http://127.0.0.1:8000/api/enrollment', this.data)
            .then(() => {
              this.initialize();
              this.showAlert("success","Academia actualizada correctamente", 3000)
            })
        } else {
          this.valid = false;
          this.data.name = this.editedItem.name;
          this.data.description = this.editedItem.description;
          this.data.business_id = this.editedItem.business_id;
  
          axios
            .post('http://127.0.0.1:8000/api/enrollment', this.data)
            .then(() => {
              this.initialize();
              this.showAlert("success","Academia creada correctamente", 3000)
            })
        }
        this.close()
      },
    },
  }
  </script>