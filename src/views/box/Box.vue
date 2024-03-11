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
        <v-col cols="12" md="8" class="mt-4">
          <span class="ml-4"> <strong>Caja <!--- {{ this.nameBranch }}--></strong></span>
        </v-col>
        <v-col cols="12" md="4">
          <v-dialog v-model="dialog" max-width="1000px">
            <template v-slot:activator="{ props }">
              <v-col>
                <v-btn :disabled="closed_box || ejecutado" v-bind="props" color="#E7E9E9" variant="flat" elevation="2"
                  prepend-icon="mdi-plus-circle" class="ml-4 mr-2">
                  Cierre de Caja
                </v-btn>
                <v-btn @click="openDialogBox" color="#E7E9E9" variant="flat" elevation="2"
                  prepend-icon="mdi-cash-register">
                  Caja
                </v-btn>
              </v-col>
            </template>

            <v-card>
              <v-toolbar color="#F18254">
                <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
              </v-toolbar>
              <v-card-text>
                <v-container>
                  <v-row class="mb-4 mt-1">
                    <v-col cols="4">
                      <v-card class="mx-auto" max-width="344" title="Total" :subtitle="totalMount()"
                        append-icon="mdi-check">

                        <template v-slot:prepend>
                          <v-avatar color="blue-darken-2">
                            <v-icon icon="mdi-currency-usd"></v-icon>
                          </v-avatar>
                        </template>
                      </v-card>
                    </v-col>

                    <v-col cols="4">
                      <v-card class="mx-auto" max-width="344" title="Servicios" :subtitle="totalMountServices()"
                        append-icon="mdi-check">

                        <template v-slot:prepend>
                          <v-avatar color="light-blue">
                            <v-icon icon="mdi-list-box-outline"></v-icon>
                          </v-avatar>
                        </template>
                      </v-card>
                    </v-col>

                    <v-col cols="4">
                      <v-card class="mx-auto" max-width="344" title="Productos" :subtitle="totalMountProducts()"
                        append-icon="mdi-check">

                        <template v-slot:prepend>
                          <v-avatar color="lime">
                            <v-icon icon="mdi-tag-outline"></v-icon>
                          </v-avatar>
                        </template>
                      </v-card>
                    </v-col>

                    <v-col cols="4">
                      <v-card class="mx-auto" max-width="344" title="Propinas" :subtitle="totalMountTips()"
                        append-icon="mdi-check">

                        <template v-slot:prepend>
                          <v-avatar color="purple">
                            <v-icon icon="mdi-cash-100"></v-icon>
                          </v-avatar>
                        </template>
                      </v-card>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="4">
                      <v-card class="mx-auto" max-width="344" title="Efectivo" :subtitle="totalMountCashs()"
                        append-icon="mdi-check">

                        <template v-slot:prepend>
                          <v-avatar color="amber ">
                            <v-icon icon="mdi-cash"></v-icon>
                          </v-avatar>
                        </template>
                      </v-card>
                    </v-col>

                    <v-col cols="4">
                      <v-card class="mx-auto" max-width="344" title="Débito" :subtitle="totalMountDebits()"
                        append-icon="mdi-check">

                        <template v-slot:prepend>
                          <v-avatar color="cyan">
                            <v-icon icon="mdi-credit-card-outline"></v-icon>
                          </v-avatar>
                        </template>
                      </v-card>
                    </v-col>

                    <v-col cols="4">
                      <v-card class="mx-auto" max-width="344" title="Tarjeta Crédito"
                        :subtitle="totalMountCreditCards()" append-icon="mdi-check">

                        <template v-slot:prepend>
                          <v-avatar color="teal">
                            <v-icon icon="mdi-credit-card"></v-icon>
                          </v-avatar>
                        </template>
                      </v-card>
                    </v-col>

                    <v-col cols="4">
                      <v-card class="mx-auto" max-width="344" title="Transferencia" :subtitle="totalMountTransfers()"
                        append-icon="mdi-check">

                        <template v-slot:prepend>
                          <v-avatar color="red-darken-2">
                            <v-icon icon="mdi-bank-transfer"></v-icon>
                          </v-avatar>
                        </template>
                      </v-card>
                    </v-col>
                    <v-col cols="4">
                      <v-card class="mx-auto" max-width="344" title="Otros" :subtitle="totalMountOthers()"
                        append-icon="mdi-check">

                        <template v-slot:prepend>
                          <v-avatar color="green-darken-2">
                            <v-icon icon="mdi-currency-usd"></v-icon>
                          </v-avatar>
                        </template>
                      </v-card>
                    </v-col>
                    <v-col cols="4">
                      <v-card class="mx-auto" max-width="344" title="Tarjeta Regalo" :subtitle="totalMountCardGif()"
                        append-icon="mdi-check">

                        <template v-slot:prepend>
                          <v-avatar color="green-darken-2">
                            <v-icon icon="mdi-gift"></v-icon>
                          </v-avatar>
                        </template>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="#F18254" :disabled="ejecutado" variant="flat" @click="saveCloseBox">
                  Cerrar Caja
                </v-btn>
              </v-card-actions>
            </v-card>

          </v-dialog>
        </v-col>
      </v-row>

    </v-toolbar>

    <v-card-text>
      <v-row class="mb-4 mt-1">
        <v-col cols="12" md="3">
          <v-card title="Total" :subtitle="totalMount()" append-icon="mdi-check">

            <template v-slot:prepend>
              <v-avatar color="blue-darken-2">
                <v-icon icon="mdi-currency-usd"></v-icon>
              </v-avatar>
            </template>
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <v-card title="Cobrado" :subtitle="totalMountPagado()" prepend-icon="mdi mdi-currency-usd"
            append-icon="mdi-check">

            <template v-slot:prepend>
              <v-avatar color="green-darken-2">
                <v-icon icon="mdi-currency-usd"></v-icon>
              </v-avatar>
            </template>
          </v-card>
        </v-col>


        <v-col cols="12" md="3">
          <v-card title="Pendiente" :subtitle="totalMountPendientes()" append-icon="mdi-check">

            <template v-slot:prepend>
              <v-avatar color="red-darken-2">
                <v-icon icon="mdi-currency-usd"></v-icon>
              </v-avatar>
            </template>
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <v-card title="Efectivo en Caja" :subtitle="existence()" append-icon="mdi-check">

            <template v-slot:prepend>
              <v-avatar color="blue-darken-2">
                <v-icon icon="mdi-check-circle"></v-icon>
              </v-avatar>
            </template>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="12" md="4">
          <v-autocomplete v-model="branch_id" :items="branches" v-if="this.mostrarFila" clearable
            label="Seleccione una Sucursal" prepend-icon="mdi-store" item-title="name" item-value="id"
            variant="underlined" @update:model-value="initialize()"></v-autocomplete>
        </v-col>
      </v-row>
      <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
        hide-details></v-text-field>


      <v-data-table :headers="headers" :items="results" :search="search" class="elevation-1">

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

        <template v-slot:item.pay="{ item }">
          <v-chip :color="item.pay != 0 ? 'green' : 'red'" :text="item.pay" class="text-uppercase" label size="small">
            {{ item.pay === 0 ? 'Pendiente' : 'Pagado' }}
          </v-chip>
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
                <span class="text-subtitle-2 ml-4"> Eliminar Carro</span>
              </v-toolbar>

              <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el carro seleccionado?</v-card-text>
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
                          prepend-icon="mdi-credit-card" variant="underlined" :rules="pago">
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.debit" clearable label="Debito"
                          prepend-icon="mdi-credit-card-outline" variant="underlined" :rules="pago">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.transfer" clearable label="Transferencia"
                          prepend-icon="mdi-bank-transfer" variant="underlined" :rules="pago">
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.other" clearable label="Otro Método" prepend-icon="mdi-check"
                          variant="underlined" :rules="pago">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.tip" clearable label="Propina" prepend-icon="mdi-currency-usd"
                          variant="underlined" :rules="pago">
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-text-field v-model="editedItem.cardGif" clearable label="Tarjeta de Regalo"
                          prepend-icon="mdi-gift" variant="underlined" :rules="pago">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field v-if="mostrarCode" clearable v-model="editedCard.cardGiftUser_id" label="Código"
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
                <span class="text-subtitle-2 ml-4"> Detalles del Carro</span>
              </v-toolbar>

              <v-card-text class="mt-2 mb-2">
                <v-text-field class="mt-1 mb-1" v-model="search2" append-icon="mdi-magnify" label="Buscar" single-line
                  hide-details></v-text-field>

                <v-data-table :headers="headers2" :items="orders" :search="search2" class="elevation-1">

                  <template v-slot:item.image="{ item }">

                    <v-avatar elevation="3" color="grey-lighten-4" size="large">
                      <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image" alt="image"></v-img>
                    </v-avatar>

                  </template>

                  <template v-slot:item.actions="{ item }">
                    <v-icon v-if="(item.request_delete)" :disabled="!(item.pay)" size="25" color="blue"
                      @click="deleteOrder(item)">
                      mdi-check
                    </v-icon>
                    <v-icon v-if="(item.request_delete)" :disabled="item.request_delete" size="25" color="red"
                      @click="requestCancel(item)">
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

                <v-btn color="#F18254" variant="flat" :disabled="this.car_ref.pay" @click="payItem(this.car_ref)">
                  Marcar como Pagado
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
          <v-icon :disabled="item.pay === 1" title="Pagar Carro" size="25" color="green" @click="payItem(item)">
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
    valid: true,
    mostrarFila: false,
    car_ref: "",
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
    orders: [],
    box: [],
    branches: '',
    cardGifts: [],
    mostrarCode: false,
    mostrarOtroCampo: false,
    ejecutado: false,
    closed_box: true,

    headers: [
      { title: 'No', value: 'id' },
      { title: 'Profesional', value: 'professionalName' },
      { title: 'Cliente', value: 'clientName' },
      { title: 'Técnico', value: 'technical_assistance' },
      { title: 'Productos', value: 'product' },
      { title: 'Servicios', value: 'service' },
      { title: 'Propina', value: 'tip' },
      { title: 'Monto Total', value: 'amount' },
      { title: 'Estado', value: 'pay' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],

    headers2: [
      { title: 'Referencia', value: 'id' },
      { title: 'Imagen', value: 'image' },
      { title: 'Nombre', value: 'name' },
      { title: 'Categoría', value: 'category' },
      { title: 'Precio', value: 'price' },
      // { title: 'Solicitud de Eliminar', key: 'actions', sortable: false },
    ],
    editedIndex: -1,

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
      cardGiftUser_id: '',
      value: '',
    },
    defaultCard: {
      cardGiftUser_id: '',
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
      //(value) => !!value || 'Campo requerido',
      (value) => !value || !isNaN(parseFloat(value)) || 'Debe ser un número'],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemeto"],
  }),

  computed: {
    formTitle() {
      return 'Cierre de Caja'
    },
    rulesCampo1() {

      if (this.editedCard.value) {
        return [
          (value) => (value <= this.editedCard.value) || 'El monto a pagar con tarjeta de regalo debe ser menor o igual que el Valor de la misma',
          (value) => value === null || (!isNaN(value) && isFinite(value)) || 'Ingresa un número válido',
        ];
      }
      else {
        return true;
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
        .get('http://127.0.0.1:8000/api/card-gift-user-show-value', {
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

    todosPagados() {
      return this.results.every(item => item.pay === '1');
    },
    marcarComoPagado(item) {
      let request = {
        id: item.id
      };
      axios
        .put('http://127.0.0.1:8000/api/car', request)
        .then(() => {
          this.initialize();
          this.showAlert("success", "Carro pagado correctamente", 3000)
        })
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
          this.showDetails(this.car_ref)
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
          this.showDetails(this.car_ref)
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
      this.editedBox.id = this.box.id;
      this.editedBox.cashFound = '';
      this.editedBox.existence = this.box.reduce((total, item) => total + item.existence, 0);
      this.editedBox.extraction = '';
    },
    closeDialogBox() {
      this.dialogBox = false;
      this.$nextTick(() => {
        this.editedBox = Object.assign({}, this.defaultBox)
      })
    },
    totalMount() {
      console.log("boxxxxxx");
      console.log(this.results.id);
      this.editedCloseBox.totalMount = this.results.reduce((total, item) => total + item.amount, 0);
      return this.results.reduce((total, item) => total + item.amount, 0) + " CLP";
    },

    totalMountPendientes() {

      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.results
        .filter(item => item.pay === 0)
        .reduce((total, item) => total + item.amount, 0);
      if (!montosPendientes) {
        this.closed_box = false;
        this.ejecutado = false;
        console.log(this.closed_box)
      }
      else {
        this.closed_box = true;
        this.ejecutado = false;
      }
      return montosPendientes + " CLP";
    },

    totalMountServices() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.results
        .filter(item => item.pay === 1)
        .reduce((total, item) => total + item.service, 0);
      this.editedCloseBox.totalService = montosPendientes;
      return montosPendientes + " CLP";
    },

    totalMountProducts() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.results
        .filter(item => item.pay === 1)
        .reduce((total, item) => total + item.product, 0);
      this.editedCloseBox.totalProduct = montosPendientes;
      return montosPendientes + " CLP";
    },

    totalMountTips() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.results
        .filter(item => item.pay === 1)
        .reduce((total, item) => total + item.tip, 0);
      this.editedCloseBox.totalTip = montosPendientes;
      return montosPendientes + " CLP";
    },

    totalMountCashs() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.results
        .filter(item => item.pay === 1)
        .reduce((total, item) => total + item.payment.cash, 0);
      this.editedCloseBox.totalCash = montosPendientes;
      return montosPendientes + " CLP";
    },

    totalMountDebits() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.results
        .filter(item => item.pay === 1)
        .reduce((total, item) => total + item.payment.debit, 0);
      this.editedCloseBox.totalDebit = montosPendientes;
      return montosPendientes + " CLP";
    },

    totalMountCreditCards() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.results
        .filter(item => item.pay === 1)
        .reduce((total, item) => total + item.payment.creditCard, 0);
      this.editedCloseBox.totalCreditCard = montosPendientes;
      return montosPendientes + " CLP";
    },

    totalMountTransfers() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.results
        .filter(item => item.pay === 1)
        .reduce((total, item) => total + item.payment.transfer, 0);
      this.editedCloseBox.totalTransfer = montosPendientes;
      return montosPendientes + " CLP";
    },

    totalMountOthers() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.results
        .filter(item => item.pay === 1)
        .reduce((total, item) => total + item.payment.other, 0);
      this.editedCloseBox.totalOther = montosPendientes;
      return montosPendientes + " CLP";
    },

    totalMountCardGif() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.results
        .filter(item => item.pay === 1)
        .reduce((total, item) => total + item.payment.cardGif, 0);
      this.editedCloseBox.totalCardGif = montosPendientes;
      return montosPendientes + " CLP";
    },

    existence() {
      console.log('imprime existence');

      const temp = this.box.reduce((total, item) => total + item.existence, 0);
      console.log(temp);
      return temp ? temp + "CPL" : " CPL";
      //return this.results.amount + " CLP";
    },

    totalMountPagado() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPagados = this.results
        .filter(item => item.pay === 1)
        .reduce((total, item) => total + item.amount, 0);

      return montosPagados ? montosPagados + " CLP" : " CPL";
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
        .get('http://127.0.0.1:8000/api/branch-cars', {
          params: {
            branch_id: this.branch_id
          }
        })
        .then((response) => {
          this.results = response.data.cars;
          console.log('imprime sucursales');
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
      console.log(item);
      this.car_ref = item;
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
      console.log(this.editedItem.cardGif);
      if (item.pay === 1) {
        this.dialogPay = false;
      }
      else {
        this.dialogPay = true;
      }

      axios
        .get('http://127.0.0.1:8000/api/card-gift-show', {
          params: {
            business_id: this.business_id
          }
        })
        .then((response) => {
          this.cardGifts = response.data.cardGifts;
          this.value = this.cardGifts.value;
        });
    },
    showDetails(item) {
      this.car_ref = item
      this.editedItem.id = item.id;
      axios
        .get('http://127.0.0.1:8000/api/order-show', {
          params: {
            car_id: item.id
          }
        })
        .then((response) => {
          this.orders = response.data.orders;
          console.log('imprime oreders');
          console.log(this.orders);
        });
      this.dialogDetallesCar = true;
    },
    deleteItemConfirm() {
      let request = {
        id: this.editedItem.id
      };
      axios
        .post('http://127.0.0.1:8000/api/car-destroy', request)
        .then(() => {
          this.initialize();
          this.showAlert("success", "Carro eliminado correctamente", 3000)
        })
      this.dialogDelete = false;
    },
    savePay() {
      {
        this.data.car_id = this.editedItem.car_id;
        this.data.cash = parseFloat(this.editedItem.cash) || 0;
        this.data.creditCard = parseFloat(this.editedItem.creditCard) || 0;
        this.data.debit = parseFloat(this.editedItem.debit) || 0;
        this.data.transfer = parseFloat(this.editedItem.transfer) || 0;
        this.data.other = parseFloat(this.editedItem.other) || 0;
        this.data.cardGift = parseFloat(this.editedItem.cardGif) || 0;  // Fix typo here
        this.data.tip = parseFloat(this.editedItem.tip) || 0;
        this.data.code = this.editedCard.cardGiftUser_id || 0;  // Fix typo here

        const suma = this.data.cash + this.data.creditCard + this.data.debit + this.data.transfer + this.data.other + this.data.cardGift + this.data.tip;

        console.log(suma);
        console.log(this.editedItem.amount + this.data.tip);
        if (suma === this.editedItem.amount + this.data.tip) {
          this.valid = true;
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
        else {
          this.showAlert("warning", "Monto debe coincidir con el monto total" + suma, 3000);
        }
        if (this.editedItem.cash || this.editedItem.creditCard || this.editedItem.debit || this.editedItem.transfer || this.editedItem.other || this.editedItem.cardGif || this.editedItem.tip) {
          this.valid = true;
        }

      }
    },
    saveCloseBox() {
      this.data.box_id = this.box.reduce((total, item) => total + item.id, 0);
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

          this.ejecutado = true;
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
            this.initialize();
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
    markPagado() {
      this.dialogDetallesCar = false
      this.marcarComoPagado(this.car_ref)
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
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