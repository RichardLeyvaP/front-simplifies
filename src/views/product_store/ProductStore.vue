<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-slot -->
<template >
    <v-snackbar class="mt-12" location="right top" :timeout="sb_timeout" :color="sb_type"
     elevation="24"  :multi-line="true"  vertical v-model="snackbar">
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
  <v-card elevation="6" class="mx-5" width = 'auto'>
  <v-toolbar color="#F18254">
   <v-row align="center">
     <v-col cols="12" md="4" class="grow ml-4">
       <span class="text-subtitle-1"> <strong>Listado de Productos por Almacenes</strong></span>
     </v-col>
     <v-col cols="12" md="4"></v-col>
     <v-col cols="12" md="3">
       
       <v-dialog v-model="dialog" max-width="500px">
         <template v-slot:activator="{ props }">
  
           <v-btn v-bind="props" class="text-subtitle-1  ml-12  " color="#E7E9E9" variant="flat" elevation="2"
             prepend-icon="mdi-plus-circle">
             Agregar Productos a Almacenes
           </v-btn>
  
         </template>
         <v-card >
           <v-toolbar color="#F18254">
             <span class="text-subtitle-2 ml-4"> {{ formTitle }}</span>
           </v-toolbar>
           <v-card-text>
           <v-form v-model="valid" enctype="multipart/form-data">
             <v-row>
               <v-col cols="12" md="12">
                 <v-autocomplete v-model="editedItem.store_id" :items="stores" clearable label="Almacenes" prepend-inner-icon="mdi-store" item-title="address" item-value="id" variant="underlined" :rules="selectRules" :disabled="!mover"></v-autocomplete>
                 <v-autocomplete v-model="editedItem.product_id" :items="products" clearable label="Productos" prepend-inner-icon="mdi-tag" item-title="name" item-value="id" variant="underlined" :rules="selectRules" :disabled="!mover"></v-autocomplete> 
                 <v-text-field v-model="editedItem.product_quantity" clearable label="Cantidad" prepend-inner-icon="mdi-tag-plus"
                   variant="underlined" :disabled="!mover">
                 </v-text-field>                
                <v-col v-if="mostrarCampos">
                    <v-autocomplete v-model="editedItem.branch_idM" :items="branches" clearable label="Seleccione una Sucursal" prepend-icon="mdi-store" item-title="name" item-value="id" variant="underlined" @update:model-value="updatedstores()"></v-autocomplete>
                    <v-autocomplete v-model="editedItem.store_idM" :items="stores" clearable label="Almacenes" prepend-inner-icon="mdi-store" item-title="address" item-value="id" variant="underlined" :rules=selectRules></v-autocomplete>
                    <v-text-field v-model="editedItem.product_quantityM" clearable label="Cantidad a mover" prepend-inner-icon="mdi-tag-arrow-right"
                   variant="underlined" :rules=[validateCantidad]>
                 </v-text-field>
                </v-col>
                 
               </v-col>
             </v-row>
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
             <span class="text-subtitle-2 ml-4"> Eliminar Producto</span>
           </v-toolbar>
  
           <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el Producto seleccionado?</v-card-text>
           <v-divider></v-divider>
           <v-card-actions>
             <v-spacer></v-spacer>
             <v-btn color="#E7E9E9" variant="flat" @click="closeDelete">
               Cancelar
             </v-btn>
             <v-btn color="warning" variant="flat" @click="deleteItemConfirm">
               Aceptar
             </v-btn>
  
  
           </v-card-actions>
         </v-card>
       </v-dialog>
     </v-col>
  
   </v-row>
  
  </v-toolbar>
  
  <v-row>
    <v-container>
          <v-col cols="12" sm="12" md="6">
            <v-autocomplete v-model="branch_id" :items="branches" v-if="this.mostrarFila" clearable label="Seleccione una Sucursal"
              prepend-icon="mdi-store" item-title="name" item-value="id" variant="underlined"
              @update:model-value="initialize()"></v-autocomplete>
          </v-col>
          
    </v-container>
      </v-row>
  <v-card-text>
    <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details>
            </v-text-field>
   <v-data-table :headers="headers" :items="results" :group-by="groupBy" :search="search" class="elevation-1" no-data-text="No hay datos disponibles">
     <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
      <tr>
        <td :colspan="columns.length">
          <VBtn
            size="small"
            variant="text"
            :icon="isGroupOpen(item) ? '$expand' : '$next'"
            @click="toggleGroup(item)"
          ></VBtn>
          {{ item.value}}
        </td>
      </tr>
    </template>
    <template v-slot:top>
  
       <v-divider class="mx-4" inset vertical></v-divider>
       <v-spacer></v-spacer>
     </template>
     <template v-slot:item.name="{ item }">
  
     <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
       <v-img :src="'http://127.0.0.1:8000/api/images/'+item.image_product" alt="image"></v-img>
     </v-avatar>
     {{ item.name }}
     </template>
     <template v-slot:item.actions="{ item }">
        <v-icon size="25" color="blue" class="me-2" @click="editItem(item)">
         mdi-pencil
       </v-icon>
       <v-icon size="25" color="green" class="me-2" @click="moverItem(item)">
          mdi-folder-move
       </v-icon>       
       <v-icon size="25" color="red" @click="deleteItem(item)">
         mdi-delete
       </v-icon>
     </template>
   </v-data-table>
  </v-card-text>
  </v-card>
  
  
  
  
  <br>
  </template>
  <script>
  
  import axios from "axios";
  import LocalStorageService from "@/LocalStorageService";
  
  export default {
  data: () => ({
  valid: true,
  mover: true,
  mostrarFila: false,
  mostrarCampos: false,
  snackbar: false,
  sb_type: '',
  sb_message: '',
  sb_timeout: 2000,
  sb_title:'',
  sb_icon:'',
  dialog: false,
  branch_id: '',
  charge_id: '',
  business_id: '',
  search: '',
  message_delete: true,
  dialogDelete: false,
  groupBy: [
          {
            key: 'direccionStore',
          },
        ],
  headers: [    
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
  results: [],
  stores: [],
  products: [],
  branches: [],
  editedIndex: -1,
  editedItem: {
   store_id : '',
   store_idM : '',
   product_id: '',
   product_quantity: '',
   product_quantityM: '',
   product_exit: '',
   id: ''
  },
  data: {},
  
  defaultItem: {
    store_id : '',
   store_idM : '',
   branch_idM: '',
   product_id: '',
   product_quantity: '',
   product_quantityM: '',
   product_exit: '',
  }, 
   requiredRules: [
   (v) => v === null || (!isNaN(v) && isFinite(v)) || 'Ingresa un número válido',
   ],
   selectRules: [(v) => !!v || "Seleccionar al menos un elemeto"],
  }),
  
  computed: {
  formTitle() {
    if (this.editedIndex === -1) {
        return 'Agregar Producto a Almacén';
    }
    if (this.editedIndex === 3) {
        return 'Editar Asignación de producto al almacén';
    }
    else{
   return 'Trasladar producto de un almacén a otro'
}
  }
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
    this.charge_id = LocalStorageService.getItem('charge_id');
  this.branch_id = LocalStorageService.getItem('branch_id') ? 1 : LocalStorageService.getItem('branch_id');
  if (this.charge_id === '4') {
      // Mostrar la fila con Autocomplete
      this.mostrarFila = true;
    }
  console.log(this.charge_id);
  this.initialize()
  },
  
  methods: {
  
  showAlert(sb_type,sb_message, sb_timeout)
  {    
   this.sb_type= sb_type
  
   if(sb_type=="success")
   {
     this.sb_title='Éxito'
     this.sb_icon='mdi-check-circle'
   }
   
   if(sb_type=="error")
   {
     this.sb_title='Error'
     this.sb_icon='mdi-check-circle'
   }
  
   if(sb_type=="warning")
   {
     this.sb_title='Advertencia'
     this.sb_icon='mdi-alert-circle'
   }
   this.sb_message= sb_message
   this.sb_timeout= sb_timeout
   this.snackbar= true
  },
  updatedstores(){
    axios
     .get('http://127.0.0.1:8000/api/store-show', {
      params: {
        branch_id: this.editedItem.branch_idM
      }
     })
     .then((response) => {
       this.stores = response.data.stores;
     });
  },
  initialize() {
   axios
     .get('http://127.0.0.1:8000/api/productstore-show', {
      params: {
        branch_id: this.branch_id
      }
     })
     .then((response) => {
       this.results = response.data.products;
     });
     axios
     .get('http://127.0.0.1:8000/api/store-show', {
      params: {
        branch_id: this.branch_id
      }
     })
     .then((response) => {
       this.stores = response.data.stores;
     });
     axios
     .get('http://127.0.0.1:8000/api/product')
     .then((response) => {
       this.products = response.data.products;
     });
     axios
      .get('http://127.0.0.1:8000/api/show-business', {
          params: {
            business_id: this.business_id
          }
        })
      .then((response) => {
        this.branches = response.data.branches;
      });
     
  },
  editItem(item) {
    this.mover = true;
   this.editedIndex = 3;
   this.editedItem = Object.assign({}, item);
   this.dialog = true;
   this.editando = true;
  },
  moverItem(item) {
    this.mover = false;
   this.editedIndex = 2;
   this.editedItem = Object.assign({}, item);
   this.dialog = true;
   this.mostrarCampos = true;
  },
  deleteItem(item) {
   this.editedItem = Object.assign({}, item);
   this.dialogDelete = true;
  },
  validateCantidad(value) {
      return value <= this.editedItem.product_exit || "La cantidad debe ser menor o igual que la existencia (" + this.editedItem.product_exit + ")";
    },
    validateStore(value) {
      return value != this.editedItem.store_id || "Debe seleccionar un almacen distinto al actual";
    },
  deleteItemConfirm() {
    this.data.product_id = this.editedItem.product_id;
    this.data.store_id = this.editedItem.store_id;
   axios
     .post('http://127.0.0.1:8000/api/productstore-destroy', this.data)
     .then(() => {
       this.initialize();
       this.message_delete = true
       this.showAlert("success","Asignación eliminada correctamente", 3000)
     })
   this.closeDelete()
  },
  close() {
   this.dialog = false
   this.$nextTick(() => {
     this.editedItem = Object.assign({}, this.defaultItem)
     this.editedIndex = -1
     this.mostrarCampos = false
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
   if (this.editedIndex === 3) {
    this.valid = false;
    this.data.product_id = this.editedItem.product_id;
    this.data.store_id = this.editedItem.store_id;
    this.data.product_quantity = this.editedItem.product_quantity;  
    this.data.branch_id = this.branch_id;
    console.log(this.data);
    console.log('editar');
     axios
       .put('http://127.0.0.1:8000/api/productstore', this.data)
       .then(() => {
         this.initialize();
        this.showAlert("success","Asignacion editada correctamente", 3000)
       })
   } 
   if (this.editedIndex === 2) {
    console.log('mover Producto');
    this.valid = false;
    this.data.product_id = this.editedItem.product_id;
     this.data.store_id = this.editedItem.store_id;
     this.data.store_idM = this.editedItem.store_idM;
     this.data.branch_idM = this.editedItem.branch_idM;
     this.data.product_quantity = this.editedItem.product_quantityM;
     this.data.branch_id = this.branch_id;
     axios
       .post('http://127.0.0.1:8000/api/move-product-store', this.data)
       .then(() => {
         this.initialize();
         this.showAlert("success","Producto asignado correctamente", 3000)
       });
   }
   if (this.editedIndex === -1) {
    console.log('insertar');
     this.valid = false;
     this.data.product_id = this.editedItem.product_id;
     this.data.store_id = this.editedItem.store_id;
     this.data.product_quantity = this.editedItem.product_quantity;
     this.data.branch_id = this.branch_id;
     axios
       .post('http://127.0.0.1:8000/api/productstore', this.data)
       .then(() => {
         this.initialize();
         this.showAlert("success","Producto asignado correctamente", 3000)
       });
   }
   this.close()
  },
  },
  }
  </script>