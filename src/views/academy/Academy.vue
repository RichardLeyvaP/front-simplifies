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
                    <v-form ref="form" v-model="valid"  enctype="multipart/form-data">
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
                        <v-col cols="12" md="6">
                          <v-text-field v-model="editedItem.location" clearable label="Localización"
                          prepend-icon="mdi-map-marker" variant="underlined">
                        </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-autocomplete v-model="editedItem.business_id" :items="business" clearable label="Negocio" prepend-icon="mdi-domain" item-title="name" item-value="id" variant="underlined" :rules="selectRules"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="6">
                        <v-file-input clearable v-model="file" ref="fileInput" label="Imagen Academia" variant="underlined"
                          density="compact" name="file" accept=".png, .jpg, .jpeg" @change="onFileSelected">
                        </v-file-input>
                        </v-col>
                        <v-col cols="12" md="6">
                        <!--<v-avatar elevation="3" color="grey-lighten-4" size="large">
                          <img v-if="imgedit" :src="imgedit" height="70" width="70">
                        </v-avatar>-->
                        <img v-if="imagenDisponible()" :src="imgedit" height="90" width="90">
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
        <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar"
                                single-line hide-details>
                            </v-text-field>
        <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="results" :search="search" class="elevation-1" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">
          <template v-slot:item.name="{ item }">

<v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
  <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image_data" alt="image"></v-img>
</v-avatar>
{{ item.name }}
</template>
          <template v-slot:item.actions="{ item }">
            <v-btn density="comfortable" icon="mdi-pencil"  @click="editItem(item)" color="primary" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Editar Academia"></v-btn>
            <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-store-outline" @click="showStores(item)" color="green" variant="tonal"
            elevation="1" title="Agregar Almacén"></v-btn>
            <!--<v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-storefront" @click="showProducts(item)" color="orange-darken-1" variant="tonal"
            elevation="1" title="Agregar productos a Academia"></v-btn>-->
          <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar Academia"></v-btn>
            <!--<v-icon size="25" color="blue" class="me-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon size="25" color="red" @click="deleteItem(item)">
              mdi-delete
            </v-icon>-->
          </template>
        </v-data-table>
        <!--Sotores-->
        <!--Store-->
      <v-dialog v-model="dialogStores" fullscreen transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-1 ml-4"> Almacenes de la Academia</span>
            <v-spacer></v-spacer>
            <v-btn class="text-subtitle-1  ml-12" color="#E7E9E9" variant="flat" @click="this.dialogAddStore = true">
              Agregar Almacén
            </v-btn>
          </v-toolbar>
          <v-card-text class="mt-2 mb-2">
            <v-text-field class="mt-1 mb-1" v-model="search2" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details></v-text-field>
            <v-data-table :headers="headers2" :items="enrollmentStores" :search="search2" class="elevation-1" :items-per-page-text="'Elementos por páginas'" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">

              <!--<template v-slot:item.name="{ item }">

                    <v-avatar elevation="3" color="grey-lighten-4" size="large">
                      <v-img :src="'http://127.0.0.1:8000/api/images/'+item.image_url" alt="image"></v-img>
                    </v-avatar>
                    {{ item.name+' '+item.surname+' '+item.second_surname}}
                  </template>-->

              <template v-slot:item.actions="{ item }">
          <v-btn density="comfortable" icon="mdi-delete" @click="closestoreRequest(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar afiliación del almacén"></v-btn>
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
                    <v-autocomplete v-model="store_id" :items="stores" label="Almacén"
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
            <span class="text-subtitle-2 ml-4"> Eliminar afiliación del almacén de esta academia</span>
          </v-toolbar>

          <v-card-text class="mt-2 mb-2"> ¿Desea eliminar esta afiliación del almacén con la academia?</v-card-text>
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
      <!--endStores-->
      <!--Products-->
      <v-dialog v-model="dialogStoresProducts" fullscreen transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-1 ml-4"> Productos por almacenes de la Academia</span>
            <v-spacer></v-spacer>
            <v-btn class="text-subtitle-1  ml-12" color="#E7E9E9" variant="flat" @click="this.dialogAddProduct = true">
              Asignar Producto
            </v-btn>
          </v-toolbar>
          <v-card-text class="mt-2 mb-2">
            <v-text-field class="mt-1 mb-1" v-model="search3" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details></v-text-field>
            <v-data-table :headers="headers3" :items="enrollmentStoresProducts" :search="search3" class="elevation-1" :items-per-page-text="'Elementos por páginas'" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles"  :group-by="groupBy">
              <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
              <tr>
                <td :colspan="columns.length">
                  <VBtn size="small" variant="text" :icon="isGroupOpen(item) ? '$expand' : '$next'"
                    @click="toggleGroup(item)"></VBtn>
                  {{ item.value }}
                </td>
              </tr>
            </template>
            <template v-slot:item.name="{ item }">

            <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
              <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image_product" alt="image"></v-img>
            </v-avatar>
            {{ item.name }}
            </template>

              <template v-slot:item.actions="{ item }">
                <v-btn density="comfortable" icon="mdi-pencil"  @click="editItemProduct(item)" color="primary" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Editar existencia"></v-btn>
          <v-btn density="comfortable" icon="mdi-delete" @click="closeproductRequest(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar existencia de producto"></v-btn>
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
      <v-dialog v-model="dialogAddProduct" width="500">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-2 ml-4">{{formTitle}}</span>
          </v-toolbar>
          <v-card-text class="mt-2 mb-2">
            <v-form ref="form" v-model="valid" enctype="multipart/form-data">
              <v-container>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-autocomplete v-model="store_id" :items="storesAcademy" label="Almacén"
                      prepend-icon="mdi-store-outline" item-title="address" item-value="id" variant="underlined"
                      :rules="selectRules"></v-autocomplete>
                  <v-autocomplete v-model="product_id" :items="products" clearable label="Productos"
                        prepend-icon="mdi-tag" item-title="name" item-value="id" variant="underlined"
                        :rules="selectRules"></v-autocomplete>
                      <v-text-field v-model="product_quantity" clearable :label="this.texttitle"
                        prepend-icon="mdi-tag-plus" variant="underlined">
                      </v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="closeproduct">
                  Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" @click="saveProduct" :disabled="!valid">
                  Aceptar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogRequestProduct" width="500">
        <v-card>

          <v-toolbar color="red">
            <span class="text-subtitle-2 ml-4"> Eliminar asignación de producto</span>
          </v-toolbar>

          <v-card-text class="mt-2 mb-2"> ¿Desea eliminar la asignación del producto?</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="closerequestProduct">
              Cancelar
            </v-btn>
            <v-btn color="#F18254" variant="flat" @click="deleteProduct">
              Aceptar
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--endProducts-->
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
      search:'',
      dialog: false,
      dialogDelete: false,
      //stores
      dialogStores: false,
      search2: '',
      dialogAddStore: false,
      stores:[],
      store_id: '',
      dialogRequestStore: false,
      //products
      dialogStoresProducts: false,
      search3: '',
      product_id: '',
      product_quantity: '',
      dialogAddProduct: false,
      editar: false,
      dialogRequestProduct: false,
      groupBy: [
      {
        key: 'direccionStore',
      },
    ],
    headers3: [
      //{ title: 'Almacén', align: 'start', value: 'direccionStore' },
      { title: 'Nombre', key: 'name' },
      { title: 'Referencia', key: 'reference' },
      { title: 'Código', key: 'code' },
      { title: 'Estado', key: 'status_product' },
      { title: 'Precio compra', align: 'start', value: 'purchase_price' },
      { title: 'Precio venta', align: 'start', value: 'sale_price' },
      { title: 'Existencia', align: 'start', value: 'product_exit' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
      headers: [
  
        { title: 'Academia', value: 'name' },
        { title: 'Descripción', value: 'description' },
        { title: 'Localización', value: 'location' },
        { title: 'Negocio', value: 'business.name' },
        { title: 'Acciones', key: 'actions', sortable: false },
      ],
      headers2: [
      { title: 'Referencia', value: 'reference' },
      { title: 'Dirección', value: 'address' },
      { title: 'Descripción', value: 'description' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
      results: [],
  
      business: [],
      enrollmentStores:[],
      enrollmentStoresProducts: [],
      storesAcademy: [],
      products: [],
      editedIndex: 1,
      //stores
      enrollment_id: '',
      enrollmentSelect: '',
      file: null,
      imgMiniatura: '',
      editedItem: {
        id: '',
        name: '',
        description: '',
        image_data: '',
        business_id: '',
        location: ''
      },
      data: {},
  
      defaultItem: {
        id: '',
        name: '',
        description: '',
        business_id: '',
        image_data: '',
        location: ''
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
      imgedit() {
      return this.imgMiniatura;
    },
      formTitle() {
        if(this.editedIndex == 1){
        return 'Nueva Academia';
        }
        if (this.editedIndex == 2) {
          return 'Editar Academia';
        }
        if (this.editedIndex == 3) {
          return 'Asiganar Producto';
        }
        if (this.editedIndex == 4) {
          return 'Editar Existencia';
        }
        else {
          return 'Asignar Almacén';
        }
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
      this.editItem.business_id = this.business_id;
      this.initialize();
    },
  
    methods: {
      imagenDisponible() {
        if (this.imgedit !== undefined && this.imgedit !== '') {
            // Intenta cargar la imagen en un elemento oculto para verificar si está disponible
            let img = new Image();
            img.src = this.imgedit;
            return img.complete; // Devuelve true si la imagen está disponible
        }
        return false; // Si la URL de la imagen no está definida o está vacía, devuelve false
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
        this.file = '';
        //this.editedItem.id = item.id;
      this.imgMiniatura = 'http://127.0.0.1:8000/api/images/' + item.image_data;
        this.editedIndex = 2;
        this.editedItem = Object.assign({}, item);
        this.editedItem.business_id = parseInt(item.business_id);
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
        this.file = '';
      this.imgMiniatura = '';
        this.dialog = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      closeDelete() {
        this.dialogDelete = false;
        this.dialogStores = false;
        this.dialogStoresProducts = false;
        this.editedItem.name = '';        
        this.editedItem.description = '';        
        this.editedItem.business_id = parseInt(this.business_id);        
        this.editedIndex = 1;
        this.enrollmentSelect ='',
        this.enrollment_id = ';'
      },
      save() {
        if (this.editedIndex == 2) {
          this.valid = false;
          /*this.data.id = this.editedItem.id;
          this.data.name = this.editedItem.name;
          this.data.description = this.editedItem.description;
          this.data.business_id = this.editedItem.business_id;*/
          const formData = new FormData();
        for (let key in this.editedItem) {
          formData.append(key, this.editedItem[key]);
        }
        console.log('formData');
        console.log(formData);
          axios
            .post('http://127.0.0.1:8000/api/enrollment-updated', formData)
            .then(() => {
              this.file = '';
            this.imgMiniatura = '';
              this.showAlert("success","Academia actualizada correctamente", 3000);
              this.initialize();
            })
        } if (this.editedIndex == 1) {
          this.valid = false;
          /*this.data.name = this.editedItem.name;
          this.data.description = this.editedItem.description;
          this.data.business_id = this.editedItem.business_id;*/
          const formData = new FormData();
        for (let key in this.editedItem) {
          formData.append(key, this.editedItem[key]);
        }
          axios
            .post('http://127.0.0.1:8000/api/enrollment', formData)
            .then(() => {
              this.file = '';
            this.imgMiniatura = '';
              this.showAlert("success","Academia creada correctamente", 3000);
              this.initialize();
            })
        }
        this.close()
      },
      //Stores logica
    showStores(item){
      this.editedIndex = 5;
        this.enrollmentSelect = item;
        console.log(this.enrollmentSelect);
        this.enrollment_id = item.id;
        console.log(item.id);
        axios
          .get('http://127.0.0.1:8000/api/enrollmentstore-show', {
            params: {
              enrollment_id: item.id
            }
          })
          .then((response) => {
            this.enrollmentStores = response.data.enrollmentStores;
            console.log('imprime stores');
          });
        this.dialogStores = true;

        axios
          .get('http://127.0.0.1:8000/api/store')
          .then((response) => {
            this.stores = response.data.stores;
          });
    },
    closestore() {
      this.dialogAddStore = false;
      this.store_id = '',
      this.showStores(this.enrollmentSelect)
    },
    saveStore() {
      this.valid = false,
        this.data.enrollment_id = this.enrollment_id;
      this.data.store_id = this.store_id;
      console.log('this.data');
      console.log(this.data);
      axios
        .post('http://127.0.0.1:8000/api/enrollmentstore', this.data)
        .then(() => {
          this.dialogAddStore = false;
          this.store_id = '',
          this.showStores(this.enrollmentSelect);
          this.showAlert("success", "Almacén afiliado correctamente a la academia", 3000);
        })
    },
    closestoreRequest(item) {
      this.dialogRequestStore = true
      //this.editedItem.branch_id=item.id
      this.store_id = item.store_id
    },
    closerequestStore() {
      this.dialogRequestStore = false;
      this.store_id = '';
      this.showStores(this.enrollmentSelect)
    },
    storeDelete() {
      let request = {
        enrollment_id: this.enrollment_id,
        store_id: this.store_id
      };
      axios
        .post('http://127.0.0.1:8000/api/enrollmentstore-destroy', request)
        .then(() => {
          this.dialogRequestStore = false
          this.store_id = '',
          //console.log(this.branchSelect);
          this.showStores(this.enrollmentSelect)
          this.showAlert("success", "Afiliación eliminada correctamente", 3000)
        })
    },//endStores
    //Asignar Productos
    showProducts(item){
      this.editedIndex = 3;
        this.enrollmentSelect = item;
        console.log(this.enrollmentSelect);
        this.enrollment_id = item.id;
        console.log(item.id);
        axios
          .get('http://127.0.0.1:8000/api/productstore-academy-show', {
            params: {
              enrollment_id: item.id
            }
          })
          .then((response) => {
            this.enrollmentStoresProducts = response.data.products;
            console.log('imprime products');
          });
        this.dialogStoresProducts = true;

        axios
        .get('http://127.0.0.1:8000/api/store-academy-show', {
          params: {
            enrollment_id: this.enrollment_id
          }
        })
        .then((response) => {
          this.storesAcademy = response.data.stores;
        });
      axios
        .get('http://127.0.0.1:8000/api/product')
        .then((response) => {
          this.products = response.data.products;
        });
    },
    closeproduct() {
      this.dialogAddProduct = false;
      this.store_id = '';
      this.product_id = '';
      this.product_quantity = '';
      this.showProducts(this.enrollmentSelect)
    },
    saveProduct() {
      if (this.editedIndex == 3) {
        this.valid = false,
        this.data.enrollment_id = this.enrollment_id;
      this.data.store_id = this.store_id;
      this.data.product_id = this.product_id;
      this.data.product_quantity = this.product_quantity;
      console.log('this.data');
      console.log(this.data);
      axios
          .post('http://127.0.0.1:8000/api/productstore', this.data)
          .then(() => {
          this.dialogAddProduct = false;
          this.store_id = '',
          this.product_id = '';
          this.product_quantity = '';
          this.showProducts(this.enrollmentSelect);
          this.showAlert("success", "Producto asignado correctamente al almacén", 3000);
        })
      }
      if (this.editedIndex == 4){
        this.valid = false,
        this.data.enrollment_id = this.enrollment_id;
      this.data.store_id = this.store_id;
      this.data.product_id = this.product_id;
      this.data.product_quantity = this.product_quantity;
      console.log('this.data');
      console.log(this.data);
      axios
          .put('http://127.0.0.1:8000/api/productstore', this.data)
          .then(() => {
          this.dialogAddProduct = false;
          this.store_id = '',
          this.product_id = '';
          this.product_quantity = '';
          this.showProducts(this.enrollmentSelect);
          this.showAlert("success", "Asignacion editada correctamente", 3000);
        })
      }
    },
    editItemProduct(item) {
      this.editedIndex = 4;
      this.dialogAddProduct = true;
      this.store_id = item.store_id;
      this.product_id = item.product_id;
      this.product_quantity = item.product_exit;
    },
    closeproductRequest(item) {
      this.dialogRequestProduct = true
      //this.editedItem.branch_id=item.id
      this.store_id = item.store_id;
      this.product_id = item.product_id;

    },
    closerequestProduct() {
      this.dialogRequestProduct = false;
      this.store_id = '';
      this.product_id = '';
      this.showProducts(this.enrollmentSelect)
    },
    deleteProduct() {
      this.data.product_id = this.product_id;
      this.data.store_id = this.store_id;
      this.data.enrollment_id = this.enrollment_id;
      axios
        .post('http://127.0.0.1:8000/api/productstore-destroy', this.data)
        .then(() => {
          this.dialogRequestProduct = false;
          this.store_id = '',
          this.product_id = '';
          console.log('this.enrollmentSelect');
          console.log(this.enrollmentSelect);
          this.showProducts(this.enrollmentSelect);
          this.showAlert("success", "Asignación eliminada correctamente", 3000);    
        })
    },
    },//endMethods
  }
  </script>