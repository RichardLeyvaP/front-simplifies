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
        <v-row>
          <v-col cols="12" md="9" class="mt-4">
            <span class="ml-4"> <strong>Reservaciones <!--- {{ this.nameBranch }}--></strong></span>
          </v-col>
          <v-col cols="12" md="3">
            
          </v-col>
        </v-row>
  
      </v-toolbar>
  
      <v-card-text>
        <v-row>
            <v-col cols="12" sm="12" md="4">
              <v-autocomplete v-model="branch_id" :items="branches" v-if="this.mostrarFila" clearable label="Seleccione una Sucursal"
                prepend-icon="mdi-store" item-title="name" item-value="id" variant="underlined"
                @update:model-value="initialize()"></v-autocomplete>
            </v-col>
        </v-row>
        <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
          hide-details></v-text-field>
  
  
        <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="results" :search="search" class="elevation-1" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">
  
          <template v-slot:item.professionalName="{ item }">
  
            <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
              <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image_url" alt="image"></v-img>
            </v-avatar>
            {{ item.professionalName }}
          </template>
  
          <template v-slot:item.clientName="{ item }">
  
            <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
              <v-img :src="'http://127.0.0.1:8000/api/images/' + item.client_image" alt="image"></v-img>
            </v-avatar>
            {{ item.clientName }}
          </template>
  
          <template v-slot:top>
  
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
  
            <v-dialog v-model="dialogRequest" width="500">
              <v-card>
                <v-toolbar color="#F18254">
                  <span class="text-subtitle-2 ml-4"> Solicitud de Eliminación de producto / servicio</span>
                </v-toolbar>
  
                <v-card-text class="mt-2 mb-2">
                
  
                  <v-alert variant="outlined" type="warning" prominent border="top">
                    Solicitud de eliminación en espera de aprobación
                  </v-alert>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
  
                  <v-btn color="default" @click="closeDeleteP">Cancelar</v-btn>
                  <v-btn color="warning" :loading="loading" @click="requestDelete">Aceptar</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
  
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="600px">
              <v-card>
                <v-toolbar color="red">
                  <span class="text-subtitle-2 ml-4"> Eliminar Reservación</span>
                </v-toolbar>
  
                <v-card-text class="mt-2 mb-2"> ¿Desea eliminar la Reseervación Seleccionada?
                    <v-text-field v-model="cause" clearable label="Motico de la eliminación" prepend-icon="mdi-book-open" variant="underlined" :rules="requiredRules">
                </v-text-field>
                </v-card-text>
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
  
            <v-dialog v-model="dialogPay" max-width="800px">
              <v-card>
                <v-toolbar color="#F18254">
                  <span class="text-subtitle-2 ml-4">Pagar Carro</span>
                </v-toolbar>
  
                <v-card-text>
                  <v-form v-model="valid" enctype="multipart/form-data">
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="editedItem.cash" clearable label="Efectivo" prepend-icon="mdi-cash"
                            variant="underlined" :rules="pago">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="editedItem.creditCard" clearable label="Tarjeta de Crédito"
                            prepend-icon="mdi-credit-card" variant="underlined"  :rules="pago">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="editedItem.debit" clearable label="Debito"
                            prepend-icon="mdi-credit-card-outline" variant="underlined"  :rules="pago">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="editedItem.transfer" clearable label="Transferencia"
                            prepend-icon="mdi-bank-transfer" variant="underlined"  :rules="pago">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="editedItem.other" clearable label="Otro Método" prepend-icon="mdi-check"
                            variant="underlined"  :rules="pago">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="editedItem.tip" clearable label="Propina" prepend-icon="mdi-currency-usd"
                            variant="underlined"  :rules="pago">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-text-field v-model="editedItem.cardGif" clearable label="Tarjeta de Regalo"
                            prepend-icon="mdi-gift" variant="underlined" :rules="[pago, reglaValidacionDobleOpcional]">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field v-if="mostrarCode" clearable v-model="editedCard.cardGift_id" label="Código"
                            prepend-icon="mdi-code" variant="underlined" @input="onCardGiftSelected"></v-text-field>
  
                          <!--<v-autocomplete v-if="mostrarCode" clearable v-model="editedCard.cardGift_id"
                            :items="filteredCardGifts" label="Código" prepend-icon="mdi-code" item-title="code"
                            item-value="id" variant="underlined" :rules="selectRules"
                            @update:model-value="cardGifts"></v-autocomplete>-->
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field v-if="mostrarOtroCampo" v-model="editedCard.value" clearable label="Valor"
                            prepend-icon="mdi-currency-usd" variant="underlined" :disabled="true">
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="#E7E9E9" variant="flat" @click="closeDialogPay">
                        Cancelar
                      </v-btn>
                      <v-btn color="#F18254" variant="flat" @click="savePay" :disabled="!valid">
                        Aceptar
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-dialog>
  
            <v-dialog v-model="dialogDetallesCar" fullscreen transition="dialog-bottom-transition">
              <v-card>
                <v-toolbar color="#F18254">
                  <span class="text-subtitle-2 ml-4"> Detalles de  la Reservaión</span>
                </v-toolbar>
  
                <v-card-text class="mt-2 mb-2">
                  <v-text-field class="mt-1 mb-1" v-model="search2" append-icon="mdi-magnify" label="Buscar" single-line
                    hide-details></v-text-field>
  
                  <v-data-table :headers="headers2" :items="services" :search="search2" class="elevation-1" :items-per-page-text="'Elementos por páginas'" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">
  
                    <template v-slot:item.name="{ item }">
  
                      <v-avatar elevation="3" color="grey-lighten-4" size="large">
                        <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image_service" alt="image"></v-img>
                      </v-avatar>
  
                    </template>
  
                    <template v-slot:item.actions="{ item }">
                        <v-icon v-if="(item.request_delete)" :disabled="!(item.pay)" size="25" color="blue" @click="deleteOrder(item)">
                          mdi-check
                        </v-icon>
                        <v-icon v-if="(item.request_delete)" :disabled="item.request_delete" size="25" color="red" @click="requestCancel(item)">
                          mdi-cancel
                        </v-icon>
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
            <v-dialog v-model="dialogBox" max-width="600px">
              <v-card>
                <v-toolbar color="#F18254">
                  <span class="text-subtitle-2 ml-4">Actualizar Caja</span>
                </v-toolbar>
  
                <v-card-text>
                  <v-form v-model="valid" enctype="multipart/form-data">
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-text-field v-model="editedBox.cashFound" clearable label="Fondo en Caja"
                            prepend-icon="mdi-safe" variant="underlined" :rules="pago">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field v-model="editedBox.existence" clearable label="Existencia"
                            prepend-icon="mdi-check-circle" variant="underlined" :rules="pago" :disabled="true">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field v-model="editedBox.extraction" clearable label="Extracción"
                            prepend-icon="mdi-arrow-down-bold" variant="underlined" :rules="pago">
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="#E7E9E9" variant="flat" @click="closeDialogBox">
                        Cancelar
                      </v-btn>
                      <v-btn color="#F18254" variant="flat" @click="saveBox" :disabled="!valid">
                        Aceptar
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-dialog>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon size="25" title="Mostrar Detalles Carro" color="primary" @click="showDetails(item)">
              mdi-eye
            </v-icon>
            <v-icon title="Pagar Carro" size="25" color="red" @click="payItem(item)">
              mdi-credit-card
            </v-icon>
            <v-icon size="25" title="Eliminar Carro" color="red" @click="deleteItem(item)">
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
  /*import { UserTokenStore } from "@/store/UserTokenStore";
  
  const userTokenStore = UserTokenStore();*/
  export default {
    data: () => ({
      closed_box: true,
      valid: true,
      snackbar: false,
      sb_type: '',
      sb_message: '',
      sb_timeout: 2000,
      sb_title: '',
      sb_icon: '',
      search: '',
      search2: '',
      dialog: false,
      dialogDetallesCar: false,
      dialogRequest: false,
      dialogDelete: false,
      dialogPay: false,
      dialogBox: false,
      loading: false,
      charge_id: '',
      business_id: '',
      nameBranch: '',
      results: [],
      services: [],
      box: [],
      branches: '',
      reservation_resf: [],
      mostrarCode: false,
      mostrarOtroCampo: false,
  
      headers: [
        { title: 'Profesional', value: 'professionalName' },
        { title: 'Cliente', value: 'clientName' },
        { title: 'Fecha', value: 'data' },
        { title: 'Hora de Inicio', value: 'start_time' },
        { title: 'Hora Final', value: 'end_time' },
        { title: 'Tiempo Total', value: 'total_time' },
        { title: 'Acciones', key: 'actions', sortable: false },
      ],
  
      headers2: [
      { title: 'Nombre Servicio', value: 'name' },
      { title: 'Precio', value: 'price_service' },
      { title: 'Tipo', value: 'type_service' },
      { title: 'Duración', value: 'duration_service' },
      { title: 'Simultáneo', value: 'simultaneou' },
      { title: 'Descripción', value: 'service_comment'},
      { title: 'Solicitud de Eliminar', key: 'actions', sortable: false },
    ],
      editedIndex: -1,
        cause: '',
      editedItem: {
        id: '',
        order_id: '',
        car_id: '',
        request_delete: '',
        tip: '',
        cash: '',
        creditCard: '',
        debit: '',
        transfer: '',
        other: '',
        amount: '',
        cardGif: ''
      },
      editedCloseBox: {
        id: '',
        totalCash: '',
        totalService: '',
        totalProduct: '',
        totalTip: '',
        totalCreditCard: '',
        totalMount: '',
        totalDebit: '',
        totalTransfer: '',
        totalOther: '',
        totalCardGif: ''
      },
      editedCard: {
        cardGift_id: '',
        value: '',
      },
      defaultCard: {
        cardGift_id: '',
        value: '',
      },
      defaultCloseBox: {
        id: '',
        totalCash: '',
        totalService: '',
        totalProduct: '',
        totalTip: '',
        totalCreditCard: '',
        totalMount: '',
        totalDebit: '',
        totalTransfer: '',
        totalOther: '',
        totalCardGif: ''
      },
      editedBox: {
        id: '',
        cashFound: '',
        existence: '',
        extraction: ''
      },
      defaultBox: {
        cashFound: '',
        existence: '',
        extraction: ''
      },
      data: {},
  
      defaultItem: {
        id: '',
        order_id: '',
        car_id: '',
        request_delete: '',
        tip: '',
        cash: '',
        creditCard: '',
        debit: '',
        transfer: '',
        other: '',
        amount: '',
        cardGif: ''
      },
  
      pago: [
     // (value) => !!value || 'Campo requerido',
     (value) => (!value || !isNaN(parseFloat(value))) || 'Debe ser un número'],
      selectRules: [(v) => !!v || "Seleccionar al menos un elemeto"],
      requiredRules: [
     (v) => !!v || "El campo es requerido",
   ],
    }),
  
    computed: {
      formTitle() {
        return 'Cierre de Caja'
      },
  
      /*rulesCampo1() {
        if (this.editedCard.value) {
          return [
          (value) => (value <= this.editedCard.value) || 'El monto a pagar con tarjeta de regalo debe ser menor o igual que el Valor de la misma',
          (value) => value === null || (!isNaN(value) && isFinite(value)) || 'Ingresa un número válido',
        ];
        }
        else{
          return true;
        }
        
      },*/
      reglaValidacionDobleOpcional() {
        return (valor) => {
          if (valor === null || valor === '') {
            return true; // Permitir valores vacíos
          }
  
          const regexDoble = /^[0-9]+(\.[0-9]+)?$/;
          if (!regexDoble.test(valor)) {
            return 'Debe ser un número'; // Mensaje de error de validación
          }
  
          return true;
        };
      },
    },
  
    watch: {
  
      dialog(val) {
        val || this.close()
      },
      dialogDelete(val) {
        val || this.closeDelete()
      },
      'editedItem.cardGif': function (newCardGif, oldCardGif) {
        // Verifica si el nuevo valor no está vacío y es diferente al valor anterior
        if (newCardGif && newCardGif !== oldCardGif) {
          // Muestra los dos campos adicionales o realiza cualquier lógica que necesites
          this.mostrarCode = true;
        } else {
          // Oculta los campos adicionales si el valor está vacío
          this.mostrarCode = false;
        }
      },
    },
  
    created() {
      /*this.branch_id = userTokenStore.branch_id;
      this.nameBranch = userTokenStore.nameBranch;*/
      this.business_id = LocalStorageService.getItem('business_id');
      this.charge_id = LocalStorageService.getItem('charge_id');
    this.branch_id = LocalStorageService.getItem('branch_id') ? 1 : LocalStorageService.getItem('branch_id');
    this.nameBranch = LocalStorageService.getItem('nameBranch');
    if (this.charge_id === '4') {
        // Mostrar la fila con Autocomplete
        this.mostrarFila = true;
      }
    console.log(this.charge_id);
      this.initialize()
    },
  
    methods: {
      onCardGiftSelected(value) {
        // Realiza cualquier lógica adicional aquí
        console.log('Elemento seleccionado:', value.data);
        axios
          .get('http://127.0.0.1:8000/api/show-value', {
            params: {
              code: value.data
            }
          })
          .then((response) => {
            this.editedCard.value = response.data
            console.log('Elemento seleccionado:', this.editedCard.value);
          });
        // Muestra otro campo y asigna un valor
        this.mostrarOtroCampo = true;
        //this.otroCampoValor = item.valor;  // Asigna el valor que desees
      },
      deleteOrder(item) {
        this.dialogRequest = true
        this.editedItem.order_id = item.id
      },
  
      requestDelete() {
        this.loading = true
        let request = {
          id: this.editedItem.order_id
        };
        axios
          .post('http://127.0.0.1:8000/api/order-destroy', request)
          .then(() => {
            this.initialize();
            this.showDetails(this.reservation_resf)
            this.showAlert("success", "Orden eliminada correctamente", 3000)
          })
        this.dialogRequest = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
  
      requestCancel(item) {
        this.loading = true
        let request = {
          id: item.id,
          request_delete: 0
        };
        axios
          .put('http://127.0.0.1:8000/api/order', request)
          .then(() => {
            this.initialize();
            this.showDetails(this.reservation_resf)
            this.showAlert("success", "Orden denegada para ser eliminada correctamente", 3000)
          })
        this.dialogRequest = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      openDialogBox() {
        this.dialogBox = true;
        this.editedBox.id = this.box ? this.box.id : 0;
        this.editedBox.cashFound = this.box ? this.box.cashFound : '';
        this.editedBox.existence = this.box ? this.box.existence : '';
        this.editedBox.extraction = this.box ? this.box.extraction : '';
      },
      closeDialogBox() {
        this.dialogBox = false;
        this.$nextTick(() => {
          this.editedBox = Object.assign({}, this.defaultBox)
        })
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
  
      initialize() {
  
        axios
          .get('http://127.0.0.1:8000/api/branch-reservations', {
            params: {
              branch_id: this.branch_id
            }
          })
          .then((response) => {
            console.log('imprime reservaciones');
            
            console.log(response.data.reservations);
            this.results = response.data.reservations;
            console.log(this.results);
          });
  
        axios
          .get('http://127.0.0.1:8000/api/box-show', {
            params: {
              branch_id: this.branch_id
            }
          })
          .then((response) => {
            this.box = response.data.box;
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
        this.editedIndex = 1;
        this.editedItem = Object.assign({}, item)
        this.editedItem.businessType = item.business_type.id;
        this.dialog = true
      },
      deleteItem(item) {
        this.editedIndex = 1;
        this.editedItem.id = item.id;
        this.dialogDelete = true;
      },
      payItem(item) {
        this.reservation_resf = item;
        this.editedIndex = 1;
        this.editedItem.car_id = item.id;
        this.editedItem.tip = item.tip;
        this.editedItem.cash = item.payment ? item.payment.cash : '';
        this.editedItem.creditCard = item.payment ? item.payment.creditCard : '';
        this.editedItem.debit = item.payment ? item.payment.debit : '';
        this.editedItem.transfer = item.payment ? item.payment.transfer : '';
        this.editedItem.other = item.payment ? item.payment.other : '';
        this.editedItem.amount = item.amount;
        this.editedItem.cardGif = item.cardGif;
        this.dialogPay = true;
        axios
          .get('http://127.0.0.1:8000/api/card-gift-show', {
            params: {
              branch_id: this.branch_id
            }
          })
          .then((response) => {
            this.cardGifts = response.data.cardGifts;
            this.value = this.cardGifts.value;
          });
      },
      showDetails(item) {
        this.reservation_resf = item;       
        console.log('cars');
        console.log(this.reservation_resf);
        axios
          .get('http://127.0.0.1:8000/api/car_services', {
            params: {
              car_id: this.reservation_resf.card_id
            }
          })
          .then((response) => {
            this.services = response.data.services;
            console.log('imprime oreders');
            console.log(this.services);
          });
        this.dialogDetallesCar = true;
      },
      deleteItemConfirm() {
        let request = {
          id: this.editedItem.id,
          cause: this.cause
        };
        this.data.id =  this.editedItem.id;
        this.data.cause =  this.cause;
        console.log(request);
        axios
          .post('http://127.0.0.1:8000/api/reservation-destroy', this.data)
          .then(() => {
            this.initialize();
            this.showAlert("success", "Reservación eliminada correctamente", 3000)
          })
        this.dialogDelete = false;
        this.cause = '';
      },
      savePay() {
        {
          this.data.car_id = this.editedItem.car_id;
          this.data.cash = this.editedItem.cash ? this.editedItem.cash : 0;
          this.data.creditCard = this.editedItem.creditCard ? this.editedItem.creditCard : 0;
          this.data.debit = this.editedItem.debit ? this.editedItem.debit : 0;
          this.data.transfer = this.editedItem.transfer ? this.editedItem.transfer : 0;
          this.data.other = this.editedItem.other ? this.editedItem.other : 0;
          this.data.cardGif = this.editedItem.cardGif ? this.editedItem.cardGif : 0;
          this.data.tip = this.editedItem.tip;
          this.data.id = this.editedItem.cardGif ? this.editedCard.cardGift_id : 0;
  
          axios
            .put('http://127.0.0.1:8000/api/payment', this.data)
            .then(() => {
              this.showAlert("success", "Pago efectuado correctamente", 3000);
              this.initialize();
              this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedCard = Object.assign({}, this.defaultCard);
                this.mostrarOtroCampo = false;
              });
            });
          this.dialogPay = false;
          this.dialogDetallesCar = false;
          this.valid = true;
  
        }
      },
      saveCloseBox() {
        this.data.box_id = this.box.id;
        this.data.totalCash = this.editedCloseBox.totalCash;
        this.data.totalCreditCard = this.editedCloseBox.totalCreditCard;
        this.data.totalDebit = this.editedCloseBox.totalDebit;
        this.data.totalTransfer = this.editedCloseBox.totalTransfer;
        this.data.totalOther = this.editedCloseBox.totalOther;
        this.data.totalTip = this.editedCloseBox.totalTip;
        this.data.totalService = this.editedCloseBox.totalService;
        this.data.totalProduct = this.editedCloseBox.totalProduct;
        this.data.totalMount = this.editedCloseBox.totalMount;
        this.data.totalCardGif = this.editedCloseBox.totalCardGif;
        console.log(this.data);
        axios
          .post('http://127.0.0.1:8000/api/closebox', this.data)
          .then(() => {
            this.showAlert("success", "Cierre de caja efectuado correctamente", 3000);
            this.initialize();
          });
        this.$nextTick(() => {
          this.editedCloseBox = Object.assign({}, this.defaultCloseBox)
        });
        this.dialog = false;
      },
      saveBox() {
        {
          this.data.branch_id = this.branch_id;
          this.data.cashFound = this.editedBox.cashFound;
          this.data.existence = this.editedBox.existence;
          this.data.extraction = this.editedBox.extraction;
          axios
            .put('http://127.0.0.1:8000/api/box', this.data)
            .then(() => {
              this.showAlert("success", "Caja Actualizada correctamente", 3000);
            });
          this.$nextTick(() => {
            this.editedBox = Object.assign({}, this.defaultBox)
          });
          this.dialogBox = false;
          this.valid = true;
        }
      },
      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      closeDelete() {
        this.dialogDetallesCar = false;
        this.dialogDelete = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      closeDialogPay() {
        this.dialogPay = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedCard = Object.assign({}, this.defaultCard);
          this.mostrarOtroCampo = false;
          this.editedIndex = -1
        })
      },
      closeDeleteP() {
        this.dialogRequest = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
    },
  }
  </script>