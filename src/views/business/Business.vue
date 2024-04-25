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
          <span class="text-subtitle-1"> <strong>Negocios</strong></span>
        </v-col>
         <v-col cols="12" md="5" class="mr-6"></v-col>
        <v-col cols="12" md="2">
              <v-btn class="text-subtitle-1  ml-12 " color="#E7E9E9" variant="flat" elevation="2"
                prepend-icon="mdi-plus-circle" :disabled="mostrar" @click="showAddProfessional()">
                Nuevo Negocio
              </v-btn>
          <v-dialog v-model="dialog" max-width="800px">
            <v-card>
                <v-toolbar color="#F18254">
                  <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
                </v-toolbar>
                <v-card-text>
                  <v-form ref="form" v-model="valid" enctype="multipart/form-data">
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="12">
                        <v-text-field v-model="editedItem.name" clearable label="Nombre del Negocio"
                          prepend-icon="mdi-ruler" variant="underlined" :rules="nameRules">
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="12">
                        <v-text-field v-model="editedItem.address" clearable label="Dirección"
                          prepend-icon="mdi-form-textarea" variant="underlined" :rules="dirRules">
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="12">
                        <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.professional_id" :items="professionals" clearable label="Propietario" prepend-icon="mdi-account-tie-outline" item-title="name" item-value="id" variant="underlined" :rules="selectRules"></v-autocomplete>
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
                <span class="text-subtitle-2 ml-4"> Eliminar Negocio</span>
              </v-toolbar>

              <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el negocio?</v-card-text>
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
      <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="results" class="elevation-1" :locale="locale" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">
        <template v-slot:item.actions="{ item }">
          <!--<v-icon size="small" color="blue" class="me-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon size="small" color="red" @click="deleteItem(item)">
            mdi-delete
          </v-icon>-->
          <v-btn density="comfortable" icon="mdi-pencil"  @click="editItem(item)" color="primary" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Editar Negocio"></v-btn>
          <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar Negocio"></v-btn>
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
    sb_title:'',
    sb_icon:'',
    mostrar: false,

    dialog: false,
    dialogDelete: false,
    headers: [

      { title: 'Negocio', value: 'name' },
      { title: 'Dirección', value: 'address' },
      { title: 'Propietario', value: 'professional_name' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    locale: {
        itemsPerPageText: 'Elementos por página:',
        pageText: '{0}-{1} de {2}',
        noDataText: 'No hay datos disponibles',
      },
    results: [],

    professionals: [],

    editedIndex: -1,

    editedItem: {
      id: '',
      name: '',
      address: '',
      professional_id: '',
    },
    data: {},

    defaultItem: {
      name: '',
      address: '',
      professional_id: '',
    },
    nameRules: [
     (v) => !!v || "El campo es requerido",
     (v) => (v && v.length <= 50) ||
       "El campo debe tener menos de 51 caracteres",
       (v) => (v && v.length >= 3) ||
       "El campo debe tener al menos de 3 caracteres",
   ],
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
      return this.editedIndex === -1 ? 'Nuevo Negocio' : 'Editar Negocio'
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
    this.initialize();
    if (!this.result) {
      this.mostrar = true;
    }
  },

  methods: {

    initialize() {

      axios
        .get('http://127.0.0.1:8000/api/business')
        .then((response) => {
          this.results = response.data.business;
        });

    },
    showAddProfessional(){
      axios
        .get('http://127.0.0.1:8000/api/professional-show-autocomplete')
        .then((response) => {
          this.professionals = response.data.professionals;
        });
        this.dialog = true;
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
        .post('http://127.0.0.1:8000/api/business-destroy', request)
        .then(() => {
        }).finally(() => {
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
      if (this.editedIndex > -1) {
        this.valid = false;
        this.data.id = this.editedItem.id;
        this.data.name = this.editedItem.name;
        this.data.address = this.editedItem.address;
        this.data.professional_id = this.editedItem.professional_id;
        axios
          .put('http://127.0.0.1:8000/api/business', this.data)
          .then(() => {
          }).finally(() => {
            this.initialize();
          });
      } else {
        this.valid = false;
        this.data.name = this.editedItem.name;
        this.data.address = this.editedItem.address;
        this.data.professional_id = this.editedItem.professional_id;

        axios
          .post('http://127.0.0.1:8000/api/business', this.data)
          .then(() => {
          }).finally(() => {
            this.initialize();
          });
      }
      this.close()
    },
  },
}
</script>