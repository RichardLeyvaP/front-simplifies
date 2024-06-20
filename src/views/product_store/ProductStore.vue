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
  <v-card elevation="6" class="mx-5" width='auto'>
    <v-toolbar color="#F18254">
      <v-row align="center">
        <v-col cols="12" md="5" class="grow ml-4">
          <span class="text-subtitle-1"> <strong>Listado de Productos por Almacenes</strong></span>
        </v-col>
        <v-col cols="12" md="6" class="text-right">
        <v-btn class="text-subtitle-1" color="#E7E9E9" variant="flat" elevation="2"
                        prepend-icon="mdi-shuffle" @click="showReposition">
                        Reposición
                    </v-btn>
                    <v-btn class="text-subtitle-1 ml-1" color="#E7E9E9" variant="flat" elevation="2"
                        prepend-icon="mdi-trending-up" @click="showMove">
                        Movimiento
                    </v-btn>
          <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ props }">

              <v-btn v-bind="props" class="text-subtitle-1 ml-1" color="#E7E9E9" variant="flat" elevation="2"
                prepend-icon="mdi-plus-circle">
                Asignar Productos
              </v-btn>

            </template>
            <v-card>
              <v-toolbar color="#F18254">
                <span class="text-subtitle-2 ml-4"> {{ formTitle }}</span>
              </v-toolbar>
              <v-card-text>
                <v-form v-model="valid" enctype="multipart/form-data">
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.store_id" :items="stores" clearable label="Almacenes"
                        prepend-inner-icon="mdi-store" item-title="address" item-value="id" variant="underlined"
                        :rules="selectRules" :disabled="!mover">
                        <template v-slot:item="{ props, item }">
                        <v-list-item
                          v-bind="props"
                          :subtitle="'Referencia: '+item.raw.reference"
                          :title="item.raw.address"
                        ></v-list-item>
                        </template>
                        </v-autocomplete>
                      <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.product_id" :items="products" clearable label="Productos"
                        prepend-inner-icon="mdi-tag" item-title="name" item-value="id" variant="underlined"
                        :rules="selectRules" :disabled="!mover">
                        <template v-slot:item="{ props, item }">
                        <v-list-item
                          v-bind="props"
                          :prepend-avatar="'https://api2.simplifies.cl/api/images/'+item.raw.image_product"
                          :title="item.raw.name"
                        ></v-list-item>
                      </template>
                      </v-autocomplete>
                      <v-text-field v-model="editedItem.stock_depletion" clearable label="Límite de existencia para alerta"
                        prepend-inner-icon="mdi-package-variant-closed" variant="underlined" :rules="pago" :disabled="moverEdit">
                      </v-text-field>
                        <v-text-field v-model="editedItem.product_quantity" clearable :label="this.texttitle"
                        prepend-inner-icon="mdi-tag-plus" variant="underlined" :disabled="moverEdit">
                      </v-text-field>
                    </v-col>
                    <v-col v-if="mostrarCampos">
                      <!--<v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.branch_idM" :items="branches" clearable
                        label="Seleccione una Sucursal" prepend-icon="mdi-store" item-title="name" item-value="id"
                        variant="underlined" @update:model-value="updatedstores()"></v-autocomplete>-->
                      <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.store_idM" :items="stores1" clearable label="Almacenes"
                        prepend-inner-icon="mdi-store" item-title="address" item-value="id" variant="underlined"
                        :rules=selectRules>
                        <template v-slot:item="{ props, item }">
                        <v-list-item
                          v-bind="props"
                          :subtitle="'Referencia: '+item.raw.reference"
                          :title="item.raw.address"
                        ></v-list-item>
                        </template>
                        </v-autocomplete>
                      <v-text-field v-model="editedItem.product_quantityM" clearable label="Cantidad a mover"
                        prepend-inner-icon="mdi-tag-arrow-right" variant="underlined" :rules=[validateCantidad]>
                      </v-text-field>
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
        <v-col cols="12" md="12">
          <v-card-text>
      <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details>
      </v-text-field>
      <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="results" :group-by="groupBy"
        :search="search" class="elevation-1" no-data-text="No hay datos disponibles"
        no-results-text="No hay datos disponibles" show-expand>
        <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
          <tr>
            <td :colspan="columns.length">
              <VBtn size="small" variant="text" :icon="isGroupOpen(item) ? '$expand' : '$next'"
                @click="toggleGroup(item)"></VBtn>
              {{ item.value }}
            </td>
          </tr>
        </template>
        <template v-slot:top>

          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
        </template>
        <template v-slot:item.name="{ item }">

          <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
            <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_product" alt="image"></v-img>
          </v-avatar>
          {{ item.name }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn density="comfortable" icon="mdi-pencil"  @click="editItem(item)" color="primary" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Editar existencia"></v-btn>
            <v-btn density="comfortable" icon="mdi-folder-move"  @click="moverItem(item)" color="green" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Mover producto"></v-btn>
          <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar existencia"></v-btn>
        </template>
      </v-data-table>
    </v-card-text>
        </v-col>

      </v-container>
    </v-row>
    <!--Reposicion de productos-->
    <v-dialog v-model="dialogReposition" fullscreen transition="dialog-bottom-transition">
                <v-card elevation="6">
        <v-toolbar color="#F18254">
            <v-container>
                <v-row align="center">
                    <v-col cols="12" md="9" class="grow">
                        <span class="text-h8"> <strong>Reposición de productos</strong></span>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="12" md="3">
                        <v-btn class="text-subtitle-1" color="#E7E9E9" variant="flat" elevation="2"
                            prepend-icon="mdi-file-excel" @click="exportToExcel3">
                            Exportar a Excel
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-toolbar>
        <v-card-text class="mt-1 mb-1">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-container>
                        <v-alert border type="info" variant="outlined" density="compact">
                            <p><strong>Productos Próximos a agotarse</strong></p>
                        </v-alert>
                    </v-container>
                    <v-card-text>
                        <v-text-field class="mt-1 mb-1" v-model="search2" append-icon="mdi-magnify" label="Buscar"
                            single-line hide-details>
                        </v-text-field>
                        <v-data-table :headers="headers2" :items-per-page-text="'Elementos por páginas'" :items="results2"
                            :search="search2" class="elevation-2" no-results-text="No hay datos disponibles"
                            no-data-text="No hay datos disponibles">
                            <template v-slot:item.name="{ item }">

                                <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                                    <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_product"
                                        alt="image"></v-img>
                                </v-avatar>
                                {{ item.name }}
                            </template>
                        </v-data-table>

                    </v-card-text>
                </v-col>
            </v-row>
        </v-container>
        </v-card-text>
        <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="#E7E9E9" variant="flat" @click="closeDialogReposition">
                            Volver
                        </v-btn>
                    </v-card-actions>
    </v-card>
            </v-dialog>

            <!--Movimiento de productos-->
    <v-dialog v-model="dialogMove" fullscreen transition="dialog-bottom-transition">
                <v-card elevation="6">
        <v-toolbar color="#F18254">
            <v-container>
                <v-row align="center">
                    <v-col cols="12" md="9" class="grow">
                        <span class="text-h8"> <strong>Movimiento de Productos</strong></span>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="12" md="3">
                        <v-btn class="text-subtitle-1" color="#E7E9E9" variant="flat" elevation="2"
                            prepend-icon="mdi-file-excel" @click="exportToExcel4">
                            Exportar a Excel
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-toolbar>
        <v-card-text class="mt-1 mb-1">
        <v-container>
          <v-row>
                <v-col cols="12" md="4">
                    <v-select v-model="selectedYear" :items="years" label="Selecciona un año" variant="outlined"
                        prepend-inner-icon="mdi-calendar"></v-select><!-- @update:model-value="initialize()"-->
                </v-col>
                <v-col cols="12" md="4">
                    <v-select v-model="selectedMounth" :items="months" label="Selecciona un mes" variant="outlined"
                        prepend-inner-icon="mdi-calendar" ></v-select><!--@update:model-value="moveProductsMounth()"-->
                </v-col>
                <v-col cols="12" md="1">
                    <v-btn icon @click="moveProductsMounth()" color="#F18254">
                        <v-icon>mdi-magnify</v-icon></v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="12">
                    <v-alert border type="info" variant="outlined" density="compact">
                        <p v-html="formTitle1"></p>
                    </v-alert>
                </v-col>
                <v-col cols="12" md="12">
                    <v-card class="mx-auto  overflow-visible">
                        <v-card-text>
                            <v-text-field class="mt-1 mb-1" v-model="search3" append-icon="mdi-magnify" label="Buscar"
                                single-line hide-details>
                            </v-text-field>
                            <v-data-table :headers="headers3" :items-per-page-text="'Elementos por páginas'"
                                :items="results3" :search="search3" no-results-text="No hay datos disponibles"
                                no-data-text="No hay datos disponibles">

                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        </v-card-text>
        <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="#E7E9E9" variant="flat" @click="closeDialogMove">
                            Volver
                        </v-btn>
                    </v-card-actions>
    </v-card>
            </v-dialog>
            
  </v-card></v-container>



  <br>
</template>
<script>

import axios from "axios";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import LocalStorageService from "@/LocalStorageService";

// Interceptor para agregar el token a cada solicitud
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
    texttitle: 'Cantidad',
    valid: true,
    mover: true,
    moverEdit : false,
    mostrarFila: false,
    mostrarCampos: false,
    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
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
      { title: 'Límite Existencia Alerta', align: 'start', value: 'stock_depletion' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    results: [],
    stores: [],
    stores1: [],
    products: [],
    branches: [],
    editedIndex: -1,
    editedItem: {
      store_id: '',
      store_idM: '',
      product_id: '',
      product_quantity: '',
      product_quantityM: '',
      product_exit: '',
      address: '',
      stock_depletion: '',
      id: ''
    },

    //reposicion
    dialogReposition: false,
    results2: [],  
    headers2: [
            { title: 'Producto', key: 'name', sortable: false },
            { title: 'Referencia', key: 'reference', sortable: false },
            { title: 'Existencia', key: 'stock', sortable: false },
            //{ title: 'Sucursal', key: 'nameBranch', sortable: true },
            { title: 'Almacén', key: 'store', sortable: true },
        ],
        search2: '',
    

        //MOvimiento de productos
        selectedYear: null,
        selectedMounth: '',
        years: [],
        months: [
            { value: '', title: '' },
            { value: '01', title: 'Enero' },
            { value: '02', title: 'Febrero' },
            { value: '03', title: 'Marzo' },
            { value: '04', title: 'Abril' },
            { value: '05', title: 'Mayo' },
            { value: '06', title: 'Junio' },
            { value: '07', title: 'Julio' },
            { value: '08', title: 'Agosto' },
            { value: '09', title: 'Septiembre' },
            { value: '10', title: 'Octubre' },
            { value: '11', title: 'Noviembre' },
            { value: '12', title: 'Diciembre' }
        ],
        dialogMove: false,
        results3: []
,        headers3: [
            { title: 'Fecha Movimiento', key: 'data', sortable: false },
            { title: 'Producto', key: 'nameProduct', sortable: false },
            { title: 'Cantidad Trasladada', key: 'cant', sortable: false },
            { title: 'Almacén Saliente', key: 'storeOut', sortable: false },
            { title: 'Almacén Entrante', key: 'storeInt', sortable: false },
        ],
        editedIndexMov: -1,
        search3: '',
    data: {},

    defaultItem: {
      store_id: '',
      store_idM: '',
      branch_idM: '',
      product_id: '',
      product_quantity: '',
      product_quantityM: '',
      address: '',
      stock_depletion: '',
      product_exit: '',
    },
    requiredRules: [
      (v) => v === null || (!isNaN(v) && isFinite(v)) || 'Ingresa un número válido',
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    pago: [
      (value) => !!value || 'Campo requerido',
      (value) => !value || !isNaN(parseFloat(value)) || 'Debe ser un número'],
  }),

  computed: {
    formTitle() {
      if (this.editedIndex === -1) {
        return 'Agregar Producto a Almacén';
      }
      if (this.editedIndex === 3) {
        return 'Editar Asignación de producto al almacén';
      }
      else {
        return 'Trasladar producto de un almacén a otro'
      }
    },
    formTitle1() {
            if (this.editedIndexMov === 2) {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                //return 'Reporte de Movimiento de Productos en el mes ' + this.selectedMounth + '-' + this.selectedYear;

                // Formatear la fecha en el formato deseado y traducir los nombres de los meses al español
                //console.log(format(this.selectedMounth, "MMMM", { locale: es }));
                return `Reporte de Movimiento de Productos en el mes de [<strong>${format(this.selectedMounth, "MMMM", { locale: es })}</strong> de <strong>${this.selectedYear}</strong>]`;
            }
            else {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.fecha = format(new Date(), "yyyy-MM-dd");
                return `Reporte de Movimiento de Productos  <strong>${this.selectedYear}</strong>`;
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
    this.branch_id = LocalStorageService.getItem('branch_id');
    this.charge = JSON.parse(LocalStorageService.getItem("charge"));
    LocalStorageService.setIsLocked(true);
          axios
        .get('https://api2.simplifies.cl/api/show-stores-products')
        .then((response) => {
          this.products = response.data.products;
          this.stores = response.data.stores;
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
                this.initialize();
          });
    ///console.log(this.charge_id);
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
        .get('https://api2.simplifies.cl/api/productstore-show')
        .then((response) => {
          this.results = response.data.products;
        }).finally(() => {
            LocalStorageService.setIsLocked(false);
        });

    },
    editItem(item) {
      this.mover = false;
      this.moverEdit = false;
      this.editedIndex = 3;
      this.editedItem = Object.assign({}, item);
      this.editedItem.product_quantity = item.product_exit;
      this.dialog = true;
      this.editando = true;
    },
    moverItem(item) {
      LocalStorageService.setIsLocked(true);
      this.mover = false;
      this.moverEdit = true;
      this.editedIndex = 2;
      this.editedItem = Object.assign({}, item);
      this.editedItem.product_quantity = item.product_exit;
      this.dialog = true;
      this.mostrarCampos = true;
      this.texttitle = 'Existencia';
      axios
        .get('https://api2.simplifies.cl/api/store-show-notin', {
          params: {
            store_id: this.editedItem.store_id
          }
        })
        .then((response) => {
          this.stores1 = response.data.stores;
        }).finally(() => {
            LocalStorageService.setIsLocked(false);
        });
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
      LocalStorageService.setIsLocked(true);
      this.data.product_id = this.editedItem.product_id;
      this.data.store_id = this.editedItem.store_id;
      //this.data.branch_id = this.branch_id;
      axios
        .post('https://api2.simplifies.cl/api/productstore-destroy', this.data)
        .then(() => {
          LocalStorageService.setIsLocked(false);
          this.message_delete = true;
          this.showAlert("success", "Asignación eliminada correctamente", 3000);       
          this.initialize();
        })
      this.closeDelete()
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.mostrarCampos = false;
        this.mover = true;
        this.moverEdit = false;
        this.texttitle = 'Cantidad';
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
      if (this.editedIndex === 3) {
        this.valid = false;
        this.data.product_id = this.editedItem.product_id;
        this.data.store_id = this.editedItem.store_id;
        this.data.product_quantity = this.editedItem.product_quantity;
        this.data.stock_depletion = this.editedItem.stock_depletion;
        //this.data.branch_id = this.branch_id;
        console.log(this.data);
        console.log('editar');
        axios
          .put('https://api2.simplifies.cl/api/productstore', this.data)
          .then(() => {
            LocalStorageService.setIsLocked(false);
            this.initialize();
            this.showAlert("success", "Asignacion editada correctamente", 3000)
          });
          this.mover = true;
          this.moverEdit = true;
      }
      if (this.editedIndex === 2) {
        console.log('mover Producto');
        this.valid = false;
        this.data.product_id = this.editedItem.product_id;
        this.data.store_id = this.editedItem.store_id;
        this.data.store_idM = this.editedItem.store_idM;
        //this.data.branch_idM = this.editedItem.branch_idM;
        this.data.product_quantity = this.editedItem.product_quantityM;
        //this.data.branch_id = this.branch_id;
        axios
          .post('https://api2.simplifies.cl/api/move-product-store', this.data)
          .then(() => {
            LocalStorageService.setIsLocked(false);
            this.showAlert("success", "Producto asignado correctamente", 3000)
            this.mover = true;
            this.moverEdit = true;
            this.texttitle = 'Cantidad';
            this.initialize();
          });
      }
      if (this.editedIndex === -1) {
        console.log('insertar');
        this.valid = false;
        this.data.product_id = this.editedItem.product_id;
        this.data.store_id = this.editedItem.store_id;
        this.data.product_quantity = this.editedItem.product_quantity;
        this.data.stock_depletion = this.editedItem.stock_depletion;
        //this.data.branch_id = this.branch_id;
        axios
          .post('https://api2.simplifies.cl/api/productstore', this.data)
          .then(() => {
            LocalStorageService.setIsLocked(false);
            this.showAlert("success", "Producto asignado correctamente", 3000);
            this.initialize();
          });
          this.mover = true;
            this.moverEdit = true;
      }
      this.close()
    },
    //reposicion
    showReposition() {
      LocalStorageService.setIsLocked(true);
            console.log('Entra aqui a reposicion');
            axios
                .get('https://api2.simplifies.cl/api/product-stock'/*, {
                    params: {
                        branch_id: this.branch_id,
                        business_id: this.business_id
                    }
                }*/)
                .then((response) => {
                    this.results2 = response.data;
                }).finally(() => {
            LocalStorageService.setIsLocked(false);
        });
            this.dialogReposition = true;
        },
    closeDialogReposition() {
            this.dialogReposition = false;
            this.results2 = [];
        },
        exportToExcel3() {
            // Primero, prepara una matriz que contendrá todas las filas de datos, incluidos los encabezados
            let rows = [];

            // Construye un objeto para los encabezados basado en la estructura de 'headers'
            let headerRow = {};
            this.headers2.forEach(header2 => {
                headerRow[header2.key] = header2.title; // Usa 'key' para el mapeo y 'title' para el texto del encabezado
            });
            rows.push(headerRow);

            // Ahora, mapea los datos de los items para que coincidan con los encabezados
            this.results2.forEach(item => {
                let rowData = {};
                this.headers2.forEach(header1 => {
                    rowData[header1.key] = item[header1.key] || ''; // Asegura que cada celda se mapee correctamente; usa '' para datos faltantes
                });
                rows.push(rowData);
            });

            let nameReport = {
                // eslint-disable-next-line vue/no-use-computed-property-like-method
                name: 'Reposición de productos', // Asume que 'name' es una de tus claves; ajusta según sea necesario
                reference: '',
                orders_count: ''
            };
            rows.push(nameReport);

            // Convierte la matriz de filas en una hoja de trabajo Excel
            const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true }); // 'skipHeader: true' porque ya agregamos manualmente los encabezados

            // Crea un nuevo libro de trabajo y añade la hoja de trabajo con los datos
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Report" + new Date().toLocaleDateString().replace(/\//g, '-'));

            // Escribe el libro de trabajo a un archivo y desencadena la descarga
            //XLSX.writeFile(wb, "report.xlsx");
            XLSX.writeFile(wb, `report_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
        }, 

        //movimiento de productos
    showMove() {
      LocalStorageService.setIsLocked(true);
           // Obtener el año actual
        const currentYear = new Date().getFullYear();
        // Llenar el arreglo years con los años, desde 2010 hasta el año actual
        for (let year = 2000; year <= currentYear; year++) {
            this.years.push(year);
        }
        // Establecer el año actual como el seleccionado por defecto
        this.selectedYear = currentYear;
        this.editedIndexMov = 1;
            axios
                .get('https://api2.simplifies.cl/api/move-products', {
                    params: {
                        //branch_id: this.branch_id,
                        year: this.selectedYear,
                        mounth: this.selectedMounth
                    }
                })
                .then((response) => {
                    this.results3 = response.data.movimientos;
                }).finally(() => {
            LocalStorageService.setIsLocked(false);
        });
            this.dialogMove = true;
        },
    closeDialogMove() {
            this.dialogMove = false;
            this.results3 = [];
        },
        moveProductsMounth() {
          LocalStorageService.setIsLocked(true);
            if (this.selectedMounth) {
              console.log('Mes seleccionado');
                this.editedIndexMov = 2;
                axios
                    .get('https://api2.simplifies.cl/api/move-products', {
                        params: {
                            //branch_id: this.branch_id,
                            year: this.selectedYear,
                            mounth: this.selectedMounth
                        }
                    })
                    .then((response) => {
                        this.results3 = response.data.movimientos;
                    }).finally(() => {
            LocalStorageService.setIsLocked(false);
        });
            } else {
                this.showMove();
            }
          },
          
        exportToExcel4() {
            // Primero, prepara una matriz que contendrá todas las filas de datos, incluidos los encabezados
            let rows = [];
            let titleRow = {};
            titleRow[this.headers[0].key] = this.formTitle1; // Utiliza la primera clave de encabezado para el título
            rows.push(titleRow);

            // Construye un objeto para los encabezados basado en la estructura de 'headers'
            let headerRow = {};
            this.headers3.forEach(header => {
                if (header.children) {
                    header.children.forEach(childHeader => {
                        headerRow[childHeader.key] = childHeader.title;
                    });
                } else {
                    headerRow[header.key] = header.title;
                }
            });
            rows.push(headerRow);

            // Ahora, mapea los datos de los items para que coincidan con los encabezados
            this.results3.forEach(item => {
                let rowData = {};
                this.headers3.forEach(header => {
                    if (header.children) {
                        header.children.forEach(childHeader => {
                            rowData[childHeader.key] = item[childHeader.key] || '';
                        });
                    } else {
                        rowData[header.key] = item[header.key] || '';
                    }
                });
                rows.push(rowData);
            });

            // Convierte la matriz de filas en una hoja de trabajo Excel
            const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true }); // 'skipHeader: true' porque ya agregamos manualmente los encabezados

            // Crea un nuevo libro de trabajo y añade la hoja de trabajo con los datos
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Report");

            // Escribe el libro de trabajo a un archivo y desencadena la descarga
            XLSX.writeFile(wb, `report_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
        },
  },
}
</script>