<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-slot -->
<template >

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
      <v-container>
      <v-card elevation="6" class="mx-5" width = 'auto'>
  <v-toolbar color="#F18254">
   <v-row>
     <v-col cols="12" md="4" class="grow ml-4">
       <span class="text-subtitle-1"> <strong>Listado de Productos</strong></span>
     </v-col>
     <v-col cols="12" md="5" class="mr-12"></v-col>
          <v-col cols="12" md="2">
  
      <v-spacer></v-spacer>
       <v-dialog v-model="dialog" max-width="1000px">
         <template v-slot:activator="{ props }">
  
           <v-btn v-bind="props" class="text-subtitle-1" color="#E7E9E9" variant="flat" elevation="2"
             prepend-icon="mdi-plus-circle">
             Agregar Producto
           </v-btn>
  
         </template>
         <v-card >
           <v-toolbar color="#F18254">
             <span class="text-subtitle-2 ml-4"> Producto</span>
           </v-toolbar>
           <v-card-text>
           <v-form v-model="valid" enctype="multipart/form-data">
             <v-row>
               <v-col cols="12" md="4">
                 <v-text-field v-model="editedItem.name" clearable label="Nombre"
                   prepend-icon="mdi-form-textbox" variant="underlined" :rules="nameRules">
                 </v-text-field>
               </v-col>
               <v-col cols="12" md="4">
                 <v-text-field v-model="editedItem.reference" clearable label="Referencia"
                   prepend-icon="mdi-shopping" variant="underlined" :rules="nameRules">
                 </v-text-field>
               </v-col>
               <v-col cols="12" md="4">
                 <v-text-field v-model="editedItem.code" clearable label="Codigo"
                   prepend-icon="mdi-barcode" variant="underlined" :rules="requiredRules">
                 </v-text-field>
               </v-col>
             </v-row>
             <v-row>
               <v-col cols="12" md="4">
                <v-select label="Estado" v-model="editedItem.status_product" :items="['En venta','No en venta']" :item-value="['En venta','No en venta']" variant="underlined" density="compact" :rules="selectRules" prepend-icon="mdi-check-circle" @update:model-value="showPrice"></v-select>
               </v-col>
               <v-col cols="12" md="4">
                 <v-text-field v-model="editedItem.purchase_price" clearable label="Precio de Compra" prepend-icon="mdi-cash"
                   variant="underlined" :rules="requiredRules">
                 </v-text-field>
               </v-col>
               <v-col cols="12" md="4">
                 <v-text-field v-if="mostrarFila" v-model="editedItem.sale_price" clearable label="Precio de Venta" prepend-icon="mdi-currency-usd"
                   variant="underlined" :rules="requiredRules">
                 </v-text-field>
               </v-col>
                  <v-col cols="12" md="4">
                 <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.product_category_id" :items="productCategories" clearable label="Categoría" prepend-icon="mdi-tag" item-title="name" item-value="id" variant="underlined" :rules="selectRules"></v-autocomplete>
               </v-col>
               <v-col cols="12" md="8">
                <v-text-field v-model="editedItem.description" clearable label="Descripción" prepend-icon="mdi-information" variant="underlined" :rules="dirRules">
                </v-text-field>
                </v-col>
              </v-row>
             <v-row>
            
               </v-row>
               <v-row>
               
                <v-col cols="12" md="6">
                 <v-file-input clearable v-model="file" ref="fileInput" label="Imagen del Productos" variant="underlined" density="compact" name="file" accept=".png, .jpg, .jpeg" @change="onFileSelected">
                 </v-file-input>
               </v-col>
               <v-col cols="12" md="6" align="center">
                <v-card elevation="6" class="mx-auto" max-width="120" max-height="120">
                          <img v-if="imagenDisponible()" :src="imgedit" height="120" width="120">
                        </v-card>
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
  
  
  <v-card-text>
    <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                hide-details>
              </v-text-field>      
   <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'"  :search="search " :items="results" class="elevation-1" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">
     <template v-slot:top>
  
       <v-divider class="mx-4" inset vertical></v-divider>
       <v-spacer></v-spacer>
     </template>
     <template v-slot:item.name="{ item }">
  
     <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
       <v-img :src="'http://127.0.0.1:8000/api/images/'+item.image_product+'?$'+Date.now()" alt="image"></v-img>
     </v-avatar>
     {{ item.name }}
     </template>
     <template v-slot:item.actions="{ item }">
       <!--<v-icon size="25" color="blue" class="me-2" @click="editItem(item)">
         mdi-pencil
       </v-icon>
       <v-icon size="25" color="red" @click="deleteItem(item)">
         mdi-delete
       </v-icon>-->
       <v-btn density="comfortable" icon="mdi-pencil"  @click="editItem(item)" color="primary" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Editar Producto"></v-btn>
          <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar Producto"></v-btn>
     </template>
   </v-data-table>
  
  </v-card-text>
  </v-card>
</v-container>
  
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
  
  dialog: false,
  editando: false,
  message_delete: true,
  dialogDelete: false,
  headers: [
  { title: 'Referencia', key: 'reference' },
   { title: 'Nombre', key: 'name' },
   { title: 'Código', key: 'code' },
   { title: 'Descripción', key: 'description', width: '100px'},
   { title: 'Estado', key: 'status_product' },
   { title: 'Precio compra', align: 'start', value: 'purchase_price' },
   { title: 'Precio venta', align: 'start', value: 'sale_price' },
   { title: 'Categoría', align: 'start', value: 'productcategory.name' },
   { title: 'Acciones', key: 'actions', sortable: false },
  ],
  results: [],
  productCategories: [],
  editedIndex: -1,
  file: '',
  mostrarFila: false,
  imgMiniatura: '',
  search: '',
  sale_priceTemp:'',
  editedItem: {
   name: '',
   reference: '',
   code: '',
   description: '',
   status_product: '',
   purchase_price: '',
   sale_price: '',
   product_category_id : '',
   image_product: '',
   id: ''
  },
  data: {},
  
  defaultItem: {
    name: '',
    reference: '',
    code: '',
    description: '',
    status_product: '',
    purchase_price: '',
    sale_price: '',
    product_category_id : '',
    image_product: '',
  },    
  nameRules: [
     (v) => !!v || "El campo es requerido",
     (v) => (v && v.length <= 50) ||
       "El campo debe tener menos de 51 caracteres",
       (v) => (v && v.length >= 3) ||
       "El campo debe tener al menos de 3 caracteres",
   ],
   requiredRules: [
     (v) => !!v || "El campo es requerido",
   ],
   selectRules: [(v) => !!v || "Seleccionar al menos un elemeto"],
  }),
  
  computed: {
  imgedit() {
     return this.imgMiniatura;
   },
  formTitle() {
   return this.editedIndex === -1 ? 'Nuevo Producto' : 'Editar Producto'
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
    axios
     .get('http://127.0.0.1:8000/api/product-category')
     .then((response) => {
       this.productCategories = response.data.productcategories;
     }).finally(() => {
                this.initialize()
          });
  },
  
  methods: {
    showPrice(){
      console.log('this.editedItem.status_product');
      console.log(this.editedItem.status_product);
      if (this.editedItem.status_product === "En venta") {
        this.editedItem.sale_price = this.sale_priceTemp;
        this.mostrarFila = true;
        console.log('this.mostrarFila---true');
        console.log(this.mostrarFila);
      }else{
        this.mostrarFila = false;
        this.editedItem.sale_price = '',
        console.log(this.mostrarFila);
      }
    },
    imagenDisponible() {
        if (this.imgedit !== undefined && this.imgedit !== '') {
            // Intenta cargar la imagen en un elemento oculto para verificar si está disponible
            let img = new Image();
            img.src = this.imgedit;
            return true; // Devuelve true si la imagen está disponible
        }
        return false; // Si la URL de la imagen no está definida o está vacía, devuelve false
    },
  
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
  initialize() {
   axios
     .get('http://127.0.0.1:8000/api/product')
     .then((response) => {
       this.results = response.data.products;
     });     
  },
  onFileSelected(event) {
     let file = event.target.files[0];
   this.editedItem.image_product = file;
   console.log(this.editedItem.image_product);
   this.cargarImage(file);
   },
   cargarImage(file){
     let reader = new FileReader();
     reader.onload = (e) => {
       this.imgMiniatura = e.target.result;
     }
     reader.readAsDataURL(file);
   },
  editItem(item) {
    this.sale_priceTemp = item.sale_price;
    if (item.status_product === 'En venta') {
        this.mostrarFila = true;
      }else{
        this.mostrarFila = false;
      }
   this.file = null;
   var img = new Image();
      img.src = 'http://127.0.0.1:8000/api/images/'+item.image_product;
      img.onload = () => {
        this.imgMiniatura = 'http://127.0.0.1:8000/api/images/'+item.image_product;
      };
      img.onerror = () => {
        this.imgMiniatura = '';
      };
   this.editedIndex = 1;
   this.editedItem = Object.assign({}, item);
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
     .post('http://127.0.0.1:8000/api/product-destroy', request)
     .then(() => {
       this.initialize();
       this.message_delete = true
       this.showAlert("success","Producto eliminado correctamente", 3000)
       this.imgMiniatura = '';
          this.file = null;
     })
   this.closeDelete()
  },
  close() {
   this.$nextTick(() => {
     this.editedItem = Object.assign({}, this.defaultItem)
     this.editedIndex = -1;
     this.imgMiniatura = '';
          this.file = null;
          this.sale_priceTemp = '';
   this.dialog = false;
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
     this.editedItem.sale_price = this.editedItem.sale_price ? this.editedItem.sale_price : '';
     const formData = new FormData();
       for (let key in this.editedItem) {
         formData.append(key, this.editedItem[key]);
       }   
     axios
       .post('http://127.0.0.1:8000/api/product-update', formData)
       .then(() => {
         this.initialize();
        this.showAlert("success","Producto editado correctamente", 3000);
        this.imgMiniatura = '';
          this.file = null;
          this.sale_priceTemp = '';
       })
   } else {
     this.valid = false;
     const formData = new FormData();
       for (let key in this.editedItem) {
         formData.append(key, this.editedItem[key]);
       } 
     axios
       .post('http://127.0.0.1:8000/api/product', formData)
       .then(() => {
         this.initialize();
         this.showAlert("success","Producto registrado correctamente", 3000);
         this.imgMiniatura = '';
          this.file = null;
          this.sale_priceTemp = '';
       })
   }
   this.close()
  },
  },
  
  }
  </script>