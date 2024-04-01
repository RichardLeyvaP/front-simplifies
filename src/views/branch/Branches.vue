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
      <v-row >
        <v-col cols="12" md="9" class="mt-4">
          <span class="ml-3"> <strong>Listado de Sucursales</strong></span>
        </v-col>
        
        <v-col cols="12" md="3">
          <v-dialog v-model="dialog" max-width="1000px">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" class="text-subtitle-1  ml-12  " color="#E7E9E9" variant="flat" elevation="2"
                prepend-icon="mdi-plus-circle">
                Agregar Sucursal
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
                        <v-text-field v-model="editedItem.name" clearable label="Nombre"
                          prepend-icon="mdi-storefront-outline" variant="underlined" :rules="nameRules">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.phone" clearable label="Teléfono"
                          prepend-icon="mdi-phone-outline" variant="underlined" :rules="mobileRules">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.address" clearable label="Dirección"
                          prepend-icon="mdi-map-marker-outline" variant="underlined" :rules="dirRules">
                        </v-text-field>
                      </v-col>

                      <v-col cols="12" md="6">

                        <v-autocomplete clearable label="Negocio" variant="underlined" prepend-icon="mdi-domain"
                          v-model="editedItem.business_id" :items="business" item-title="name" item-value="id"
                          :rules="selectRules">
                        </v-autocomplete>
                      </v-col>


                      <v-col cols="12" md="6">

                        <v-autocomplete clearable label="Tipo de Negocio" variant="underlined" prepend-icon="mdi-domain"
                          v-model="editedItem.business_type_id" :items="businessTypes" item-title="name" item-value="id"
                          :rules="selectRules">
                        </v-autocomplete>
                        <v-autocomplete v-model="editedItem.useTechnical" :items="options" clearable label="Técnico"
                        prepend-inner-icon="mdi-hair-salon" item-title="name" item-value="id" variant="underlined"
                        ></v-autocomplete>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-file-input clearable v-model="file" ref="fileInput" label="Avatar Clients" variant="underlined"
                          density="compact" name="file" accept=".png, .jpg, .jpeg" @change="onFileSelected">
                        </v-file-input>
                        <v-avatar elevation="3" color="grey-lighten-4" size="large">
                          <img v-if="imgedit" :src="imgedit" height="70" width="70">
                        </v-avatar>
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
        </v-col>

      </v-row>

    </v-toolbar>

    <v-card-text>
      <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                hide-details>
            </v-text-field>
      <v-data-table :headers="headers" :search="search" :items="results" class="elevation-1" :items-per-page-text="'Elementos por páginas'" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">
        <template v-slot:top>

          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          
          <v-dialog v-model="dialogDelete" max-width="600px">
            <v-card>
              <v-toolbar color="red">
                <span class="text-subtitle-2 ml-4"> Eliminar Sucursal</span>
              </v-toolbar>

              <v-card-text class="mt-2 mb-2"> ¿Desea eliminar la Sucursal seleccionada?</v-card-text>
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

        </template>

        <template v-slot:item.name="{ item }">

          <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
            <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image_data" alt="image"></v-img>
          </v-avatar>
          {{ item.name }}
        </template>
        
        <template v-slot:item.useTechnical="{ item }">
          <div class="text-end">
            <v-chip :color="item.useTechnical ? 'green' : 'red'" :text="item.useTechnical ? 'Si ' : 'No'"
              class="text-uppercase" size="small" label style="text-align: center;"></v-chip>
          </div>
        </template>
        <template v-slot:item.actions="{ item }">
          <!--<v-icon size="25" color="blue" class="me-2" @click="editItem(item)" title="Editar Sucursal">
            mdi-pencil
          </v-icon>-->
          <v-btn density="comfortable" icon="mdi-pencil" @click="editItem(item)" color="primary" variant="tonal"
            elevation="1" title="Editar Sucursal"></v-btn>
          <!--<v-icon size="25" color="green" @click="showProfessionals(item)" title="Asignar Professional">
            mdi-account-tie
          </v-icon>-->
          <v-btn density="comfortable" icon="mdi-account-tie" @click="showProfessionals(item)" color="primary" variant="tonal"
            elevation="1" title="Agergar Trabajdor"></v-btn> 
          <!--<v-icon size="25" color="primary" @click="showStores(item)" title="Asignar Almacén">
            mdi-store-outline
          </v-icon> -->      
          <v-btn density="comfortable" icon="mdi-store-outline" @click="showStores(item)" color="green" variant="tonal"
            elevation="1" title="Agergar Almacèn"></v-btn>  
          <!--<v-icon size="25" color="red" @click="deleteItem(item)" title="Eliminar Sucursal">
            mdi-delete
          </v-icon>-->
          <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar Sucursal"></v-btn>
        </template>
      </v-data-table>

      <!--Professionals-->
      <v-dialog v-model="dialogProfessionals" fullscreen transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-2 ml-4"> Trabajadores de la Sucursal</span>
            <v-spacer></v-spacer>
            <v-btn class="text-subtitle-1  ml-12" color="#E7E9E9" variant="flat" @click="this.dialogAddProf = true">
              Agregar Trabajador
            </v-btn>
          </v-toolbar>

          <v-card-text class="mt-2 mb-2">
            <v-text-field class="mt-1 mb-1" v-model="search2" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details></v-text-field>

            <v-data-table :headers="headers2" :items="branchProfessionals" :search="search2" class="elevation-1" :items-per-page-text="'Elementos por páginas'" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">

              <template v-slot:item.name="{ item }">

                <v-avatar elevation="3" color="grey-lighten-4" size="large">
                  <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image_url" alt="image"></v-img>
                </v-avatar>
                {{ item.name + ' ' + item.surname + ' ' + item.second_surname }}
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn density="comfortable" icon="mdi-delete" @click="deleteP(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar afiliaciòn del trabajador"></v-btn>
                <!--<v-icon size="small" color="red" @click="deleteP(item)">
                  mdi-delete
                </v-icon>-->
              </template>

            </v-data-table>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#F18254" variant="flat" @click="closeDelete">
              Volver
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogAddProf" width="500">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-2 ml-4">Agregar Trabajador</span>
          </v-toolbar>
          <v-card-text class="mt-2 mb-2">
            <v-form ref="form" v-model="valid" enctype="multipart/form-data">
              <v-container>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-autocomplete v-model="editedItem.professional_id" :items="professionals" label="Trabajador"
                      prepend-icon="mdi-account-tie-outline" item-title="name" item-value="id" variant="underlined"
                      :rules="selectRules"></v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="closeP">
                  Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" @click="saveP" :disabled="!valid">
                  Aceptar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogRequest" width="500">
        <v-card>

          <v-toolbar color="red">
            <span class="text-subtitle-2 ml-4"> Eliminar afiliación del professional de esta sucursal</span>
          </v-toolbar>

          <v-card-text class="mt-2 mb-2"> ¿Desea eliminar esta afiliación del trabajador con la sucursal?</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="closerequest">
              Cancelar
            </v-btn>
            <v-btn color="#F18254" variant="flat" @click="requestDelete">
              Aceptar
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--Store-->
      <v-dialog v-model="dialogStores" fullscreen transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-1 ml-4"> Almacenes de la Sucursal</span>
            <v-spacer></v-spacer>
            <v-btn class="text-subtitle-1  ml-12" color="#E7E9E9" variant="flat" @click="this.dialogAddStore = true">
              Agregar Almacén
            </v-btn>
          </v-toolbar>
          <v-card-text class="mt-2 mb-2">
            <v-text-field class="mt-1 mb-1" v-model="search3" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details></v-text-field>
            <v-data-table :headers="headers3" :items="branchStores" :search="search3" class="elevation-1" :items-per-page-text="'Elementos por páginas'" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">

              <!--<template v-slot:item.name="{ item }">

                    <v-avatar elevation="3" color="grey-lighten-4" size="large">
                      <v-img :src="'http://127.0.0.1:8000/api/images/'+item.image_url" alt="image"></v-img>
                    </v-avatar>
                    {{ item.name+' '+item.surname+' '+item.second_surname}}
                  </template>-->

              <template v-slot:item.actions="{ item }">
          <v-btn density="comfortable" icon="mdi-delete" @click="closestoreRequest(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar afiliaciòn almacèn"></v-btn>
                <!--<v-icon size="small" color="red" @click="closestoreRequest(item)">
                  mdi-delete
                </v-icon>-->
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
      <v-dialog v-model="dialogAddStore" width="500">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-2 ml-4">Agregar Almacén</span>
          </v-toolbar>
          <v-card-text class="mt-2 mb-2">
            <v-form ref="form" v-model="valid" enctype="multipart/form-data">
              <v-container>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-autocomplete v-model="editedItem.store_id" :items="stores" label="Almacén"
                      prepend-icon="mdi-store-outline" item-title="address" item-value="id" variant="underlined"
                      :rules="selectRules"></v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="closestore">
                  Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" @click="saveStore" :disabled="!valid">
                  Aceptar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogRequestStore" width="500">
        <v-card>

          <v-toolbar color="red">
            <span class="text-subtitle-2 ml-4"> Eliminar afiliación del almacén de esta sucursal</span>
          </v-toolbar>

          <v-card-text class="mt-2 mb-2"> ¿Desea eliminar esta afiliación del almacén con la sucursal?</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="closerequestStore">
              Cancelar
            </v-btn>
            <v-btn color="#F18254" variant="flat" @click="storeDelete">
              Aceptar
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script>

import axios from "axios";
import LocalStorageService from "@/LocalStorageService";
export default {
  data: () => ({
    valid: true,
    branchSelect: "",
    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
    search3: '',
    business_id: '',
    search2: '',
    search:'',
    editando: false,
    dialog: false,
    dialogDelete: false,
    dialogProfessionals: false,
    dialogStores: false,
    dialogAddProf: false,
    dialogRequest: false,
    dialogAddStore: false,
    dialogRequestStore: false,

    headers: [
      { title: 'Nombre', value: 'name' },
      { title: 'Negocio', value: 'business.name' },
      { title: 'Teléfono', value: 'phone' },
      { title: 'Dirección', value: 'address' },
      { title: 'Tipo de Negocio', value: 'business_type.name' },
      { title: 'Técnico', value: 'useTechnical' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    headers2: [
      { title: 'Nombre', value: 'name' },
      { title: 'Cargo', value: 'charge.name' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    headers3: [
      { title: 'Referencia', value: 'reference' },
      { title: 'Dirección', value: 'address' },
      { title: 'Descripción', value: 'description' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    results: [],

    business: [],
    businessTypes: [],
    branchProfessionals: [],
    branchStores: [],
    professionals: [],
    stores: [],

    editedIndex: -1,
    file: null,
    imgMiniatura: '',
    editedItem: {
      id: '',
      name: '',
      phone: '',
      address: '',
      business_id: '',
      business_type_id: '',
      image_data: '',
      professional_id: '',
      store_id: '',
      useTechnical: 0,
    },
    data: {},
    options: [
        { name: 'SI', id: 1 },
        { name: 'NO', id: 0 }
      ],
    defaultItem: {
      name: '',
      phone: '',
      address: '',
      business_id: '',
      business_type_: '',
      image_data: '',
      professional_id: '',
      store_id: '',
      useTechnical: '',
    },
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 100) ||
        "El campo debe tener menos de 251 caracteres",
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
    mobileRules: [(v) => !!v || "El Teléfono es requerido"],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemeto"],
  }),

  computed: {
    imgedit() {
      return this.imgMiniatura;
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Nueva Sucursal' : 'Editar Sucursal'
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

      //this.editedItem.business_id = this.business_id; // Establecer el primer negocio como valor predeterminado
      //console.log('this.editedItem.business_id');
      //console.log(this.editedItem.business_id);
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
        .get('http://127.0.0.1:8000/api/branch')
        .then((response) => {
          this.results = response.data.branches;
          console.log('imprime sucursales');
          console.log(this.results);
        })

      axios
        .get('http://127.0.0.1:8000/api/business-type')
        .then((response) => {
          this.businessTypes = response.data.businessTypes;
        })

      axios
        .get('http://127.0.0.1:8000/api/business')
        .then((response) => {
          this.business = response.data.business;
          if (this.business.length > 0) {
      this.editedItem.business_id = this.business[0].id; // Establecer el primer negocio como valor predeterminado
    }        
    console.log('this.editedItem.business_id');
      console.log(this.editedItem.business_id);
        })
      axios
        .get('http://127.0.0.1:8000/api/professional-show-autocomplete')
        .then((response) => {
          this.professionals = response.data.professionals;
        })
      axios
        .get('http://127.0.0.1:8000/api/store')
        .then((response) => {
          this.stores = response.data.stores;
        })
    },
    onFileSelected(event) {
      let file = event.target.files[0];
      this.editedItem.image_data = file;
      console.log(this.editedItem.image_data);
      this.cargarImage(file);
    },
    cargarImage(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imgMiniatura = e.target.result;
      }
      reader.readAsDataURL(file);
    },
    editItem(item) {
      this.file = '';
      this.imgMiniatura = 'http://127.0.0.1:8000/api/images/' + item.image_data;
      this.editedIndex = 1;
      this.editedItem = Object.assign({}, item)
      this.dialog = true;
      this.editando = true;
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
        .post('http://127.0.0.1:8000/api/branch-destroy', request)
        .then(() => {
          this.initialize();
          this.showAlert("success", "Sucursal eliminada correctamente", 3000)
        })
      this.closeDelete()
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    closeP() {
      this.dialogAddProf = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
      this.showProfessionals(this.branchSelect)
    },
    closestore() {
      this.dialogAddStore = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
      this.showStores(this.branchSelect)
    },
    closeDelete() {
      this.dialogDelete = false;
      this.dialogProfessionals = false;
      this.dialogStores = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.branchSelect = '';
      this.branch_id = 0;
    },
    save() {
      if (this.editedIndex > -1) {
        this.valid = false;
        /*this.data.id = this.editedItem.id;
        this.data.name = this.editedItem.name;
        this.data.phone = this.editedItem.phone;
        this.data.address = this.editedItem.address;
        this.data.business_id = this.editedItem.business.id;
        this.data.business_type_id = this.editedItem.businessType;*/
        const formData = new FormData();
        for (let key in this.editedItem) {
          formData.append(key, this.editedItem[key]);
        }
        axios
          .post('http://127.0.0.1:8000/api/branch-update', formData)
          .then(() => {

            this.initialize();
            this.showAlert("success", "Sucursal modificada correctamente", 3000)

          })
      } else {
        this.valid = false;
        /*this.data.name = this.editedItem.name;
        this.data.phone = this.editedItem.phone;
        this.data.address = this.editedItem.address;
        this.data.business_id = this.editedItem.business;
        this.data.business_type_id = this.editedItem.businessType;*/
        const formData = new FormData();
        for (let key in this.editedItem) {
          formData.append(key, this.editedItem[key]);
        }
        axios
          .post('http://127.0.0.1:8000/api/branch', formData)
          .then(() => {
            this.initialize();
            this.showAlert("success", "Sucursal creada correctamente", 3000)
          })
      }
      this.close()
    },
    showProfessionals(item) {
      this.branchSelect = item;
      console.log(this.branchSelect);
      this.branch_id = item.id;
      console.log(item.id);
      axios
        .get('http://127.0.0.1:8000/api/branch-professionals', {
          params: {
            branch_id: item.id
          }
        })
        .then((response) => {
          this.branchProfessionals = response.data.professionals;
          console.log('imprime professionals');
        });
      this.dialogProfessionals = true;
    },

    showStores(item) {
      this.branchSelect = item;
      console.log(this.branchSelect);
      this.branch_id = item.id;
      console.log(item.id);
      axios
        .get('http://127.0.0.1:8000/api/store-show', {
          params: {
            branch_id: item.id
          }
        })
        .then((response) => {
          this.branchStores = response.data.stores;
          console.log('imprime professionals');
        });
      this.dialogStores = true;
    },
    saveP() {
      this.valid = false,
        this.data.branch_id = this.branch_id;
      this.data.professional_id = this.editedItem.professional_id;
      axios
        .post('http://127.0.0.1:8000/api/branchprofessional', this.data)
        .then(() => {
          this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
          })
          this.dialogAddProf = false;
          this.showProfessionals(this.branchSelect);
          this.showAlert("success", "Trabajdor afiliado correctamente a la sucursal", 3000);
        })
    },
    saveStore() {
      this.valid = false,
        this.data.branch_id = this.branch_id;
      this.data.store_id = this.editedItem.store_id;
      axios
        .post('http://127.0.0.1:8000/api/branchstore', this.data)
        .then(() => {
          this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
          })
          this.dialogAddStore = false;
          this.showStores(this.branchSelect);
          this.showAlert("success", "Almacén afiliado correctamente a la sucursal", 3000);
        })
    },
    deleteP(item) {
      this.dialogRequest = true
      //this.editedItem.branch_id=item.id
      this.editedItem.professional_id = item.id
    },
    closestoreRequest(item) {
      this.dialogRequestStore = true
      //this.editedItem.branch_id=item.id
      this.editedItem.store_id = item.id
    },
    requestDelete() {
      let request = {
        branch_id: this.branch_id,
        professional_id: this.editedItem.professional_id
      };
      axios
        .post('http://127.0.0.1:8000/api/branchprofessional-destroy', request)
        .then(() => {
          this.dialogRequest = false
          this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
          })
          console.log(this.branchSelect);
          this.showProfessionals(this.branchSelect)
          this.showAlert("success", "Afiliación eliminada correctamente", 3000)
        })
    },
    storeDelete() {
      let request = {
        branch_id: this.branch_id,
        store_id: this.editedItem.store_id
      };
      axios
        .post('http://127.0.0.1:8000/api/branchstore-destroy', request)
        .then(() => {
          this.dialogRequestStore = false
          this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
          })
          console.log(this.branchSelect);
          this.showStores(this.branchSelect)
          this.showAlert("success", "Afiliación eliminada correctamente", 3000)
        })
    },

    closerequest() {
      this.dialogRequest = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
      this.showProfessionals(this.branchSelect)
    },
    closerequestStore() {
      this.dialogRequestStore = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
      this.showStores(this.branchSelect)
    },
  },
}
</script>