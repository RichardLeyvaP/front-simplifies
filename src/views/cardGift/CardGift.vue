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
        <v-col cols="12" md="4" class="grow ml-4">
          <span class="text-subtitle-1"> <strong>Listado de Tarjeta Regalos</strong></span>
        </v-col>
        <v-col cols="12" md="5" class="mr-8"></v-col>
        <v-col cols="12" md="2" class=" ">
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="700px">
            <template v-slot:activator="{ props }">

              <v-btn v-bind="props" class="text-subtitle-1  ml-12  " color="#E7E9E9" variant="flat" elevation="2"
                prepend-icon="mdi-plus-circle">
                Crear Tarjeta
              </v-btn>

            </template>
            <v-card>
              <v-toolbar color="#F18254">
                <span class="text-subtitle-1 ml-4">Crear Tarjeta de Regalo</span>
              </v-toolbar>
              <v-card-text>
                <v-form v-model="valid" enctype="multipart/form-data">
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-autocomplete clearable v-model="editedItem.business_id" :items="business" label="Negocio"
                        prepend-icon="mdi-domain" item-title="name" item-value="id" variant="underlined"
                        :rules="selectRules"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="editedItem.name" clearable label="Nombre" prepend-icon="mdi-card"
                        variant="underlined" :rules="nameRules">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="editedItem.value" clearable label="Valor" prepend-icon="mdi-currency-usd"
                        variant="underlined" :rules="pago">
                      </v-text-field>
                    </v-col>

                  </v-row>
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-file-input clearable v-model="file" ref="fileInput" label="Imagen de Tarjeta Regalo"
                        variant="underlined" density="compact" name="file" accept=".png, .jpg, .jpeg"
                        @change="onFileSelected">
                      </v-file-input>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                        <img v-if="imgedit" :src="imgedit" height="120" width="210">
                      </v-card>


                    </v-col>
                  </v-row><br>
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
                <span class="text-subtitle-2 ml-4"> Eliminar Terjeta de Regalo</span>
              </v-toolbar>

              <v-card-text class="mt-2 mb-2"> ¿Desea eliminar la Trjeta de Regalo?</v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="closeDeletecardgiftUser">
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
      <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="results" class="elevation-1" no-data-text="No hay datos disponibles"
        no-results-text="No hay datos disponibles">
        <template v-slot:top>

          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
        </template>
        <template v-slot:item.image_cardgift="{ item }">

          <v-card class="my-2" rounded elevation="10" width="100">
            <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image_cardgift" alt="image" cover></v-img>
          </v-card>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon size="25" color="blue" class="me-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon size="25" color="green" class="me-2" @click="showCardGifts(item)">
            mdi-gift
          </v-icon>
          <v-icon size="25" color="red" @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>

      <!--cardgifts-->
      <v-dialog v-model="dialogCardGitfUser" fullscreen transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-h6 ml-6"> Asignar Tarjeta de Regalo</span>
            <v-spacer></v-spacer>
            <v-btn class="ml-4" color="#E7E9E9" variant="flat" @click="this.dialogAddCardGift = true">
              Asignar a Cliente
            </v-btn>
          </v-toolbar>

          <v-card-text class="mt-2 mb-2">

            <v-text-field class="mt-1 mb-1" v-model="search2" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details></v-text-field>

            <v-data-table :headers="headers2" :items="cardgiftUser" :search="search2" class="elevation-1" :items-per-page-text="'Elementos por páginas'" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">

              <template v-slot:item.name="{ item }">

                <v-avatar elevation="3" color="grey-lighten-4" size="large">
                  <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image_cardgift" alt="image"></v-img>
                </v-avatar>
                {{ item.name }}
              </template>

              <template v-slot:item.userName="{ item }">

                <v-avatar elevation="3" color="grey-lighten-4" size="large">
                  <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image_url" alt="image"></v-img>
                </v-avatar>
                {{ item.userName }}
              </template>

              <template v-slot:item.actions="{ item }">
                <v-icon size="25" color="red" @click="deleteS(item)">
                  mdi-delete
                </v-icon>
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

      <v-dialog v-model="dialogAddCardGift" width="700">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-2 ml-4">Asignar a Cliente</span>
          </v-toolbar>
          <v-card-text class="mt-2 mb-2">
            <v-form ref="form" v-model="valid" enctype="multipart/form-data">
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-autocomplete v-model="editedCardGiftUser.user_id" :items="users" label="Cliente"
                      prepend-icon="mdi-store-outline" item-title="name" item-value="user_id" variant="underlined"
                      :rules="selectRules"></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                      offset-y min-width="290px">
                      <template v-slot:activator="{ props }">
                        <v-text-field v-bind="props" :model-value="dateFormatted" variant="underlined"
                          append-inner-icon="mdi-calendar" label="Fecha de Expiración"></v-text-field>
                      </template>
                      <v-locale-provider locale="es">
                        <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2" :model-value=input @update:model-value="updateDate"
                          format="yyyy-MM-dd"></v-date-picker>
                      </v-locale-provider>
                    </v-menu>
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
            <span class="text-subtitle-2 ml-4"> Eliminar Tarjeta asignada al cliente</span>
          </v-toolbar>

          <v-card-text class="mt-2 mb-2"> ¿Desea eliminar esta asignación?</v-card-text>
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
    </v-card-text>
  </v-card>




  <br>
</template>
<script>

import LocalStorageService from "@/LocalStorageService";
import axios from "axios";
import { format } from "date-fns";


export default {
  data: () => ({

    valid: true,
    snackbar: false,
    input: null,
    menu: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
    editando: false,
    dialog: false,
    dialogCardGift: false,
    dialogDelete: false,
    dialogCardGitfUser: false,
    dialogAddCardGift: false,
    message_delete: true,
    dialogRequestStore: false,
    dialogAddStore: false,
    branch_id: '',
    business_id: '',
    headers: [
      { title: 'Nombre', key: 'name' },
      { title: 'Imagen', key: 'image_cardgift' },
      { title: 'Valor', value: 'value' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    headers2: [
      { title: 'Nombre Tarjeta', value: 'name' },
      { title: 'Nombre Usuario', value: 'userName' },
      { title: 'Valor Inicial', value: 'value' },
      { title: 'Estado', value: 'state' },
      { title: 'Valor Actual', value: 'exist' },
      { title: 'Fecha Asignada', value: 'issue_date' },
      { title: 'Fecha Expiración', value: 'expiration_date' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    results: [],
    editedIndex: -1,
    cardgiftUser: [],
    users: [],
    file: null,
    imgMiniatura: '',
    cardSelect: '',
    editedCardGiftUser: {
      user_id: '',
      expiration_date: '',
      card_gift_id: '',
      id: ''
    },
    defaultCardGiftUser: {
      student_id: '',
      card_gift_id: '',
      expiration_date: '',
      id: ''
    },
    editedItem: {
      business_id: '',
      value: '',
      id: '',
      image_cardgift: '',
      user_id: '',
      name: ''
    },
    data: {},

    defaultItem: {
      business_id: '',
      value: '',
      image_cardgift: '',
      user_id: '',
      name: ''
    },
    pago: [(v) => !!v || (!isNaN(v) && isFinite(v)) || 'Ingresa un número válido'],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemeto"],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Crear Gift Card' : 'Editar Gift Card'
    },

    imgedit() {
      return this.imgMiniatura;
    },
    /*dateFormatted() {
      const date = this.input ? new Date(this.input) : new Date();
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;

      getDate() {
      return this.input ? new Date(this.input) : new Date();
    },
    },*/
    dateFormatted() {
      const date = this.input ? new Date(this.input) : new Date();
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    getDate() {
      return this.input ? new Date(this.input) : new Date();
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
    this.initialize()
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
        .get('http://127.0.0.1:8000/api/card-gift')
        .then((response) => {
          this.results = response.data.cardGifts;
        });
      axios
        .get('http://127.0.0.1:8000/api/business')
        .then((response) => {
          this.business = response.data.business;
          if (this.business.length > 0) {
      this.editedItem.business_id = this.business[0].id; // Establecer el primer negocio como valor predeterminado
    }        
    console.log('this.editedItem.business_id');
      console.log(this.editedItem.business_id);
        });
      axios
        .get('http://127.0.0.1:8000/api/client-autocomplete')
        .then((response) => {
          this.users = response.data.clients;
        });
    },
    //Users
    updateDate(val) {
      this.input = val;
      this.editedCardGiftUser.expiration_date = format(val, "yyyy-MM-dd");
      console.log(this.editedCardGiftUser.expiration_date);
      this.menu = false;
    },
    showCardGifts(item) {
      this.cardSelect = item;
      //console.log(this.cardSelect);
      console.log(item.id);
      this.editedCardGiftUser.card_gift_id = item.id
      this.data.card_gift_id = item.id
      axios
        .get('http://127.0.0.1:8000/api/card-gift-user-show', {
          params: {
            card_gift_id: item.id
          }
        })
        .then((response) => {
          this.cardgiftUser = response.data.cardgiftUser;
        });
      this.dialogCardGitfUser = true;
    },
    onFileSelected(event) {
      let file = event.target.files[0];
      this.editedItem.image_cardgift = file;
      //console.log(this.editedItem.image_cardgift);
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
      this.imgMiniatura = 'http://127.0.0.1:8000/api/images/' + item.image_cardgift;
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
        .post('http://127.0.0.1:8000/api/card-gift-destroy', request)
        .then(() => {
          this.initialize();
          this.message_delete = true
          this.showAlert("success", "Tarjeta de regalo eliminada correctamente", 3000);
          
      this.dialogDelete = false;
        })
    },
    close() {
      this.dialog = false,
        this.dialogAddStore = false,
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1;
        this.imgMiniatura = '';
        this.file = '';
        })
    },
    closeDelete() {
      this.dialogCardGitfUser = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closerequest() {
      this.dialogRequestStore = false;
      this.$nextTick(() => {
        this.editedCardGiftUser = Object.assign({}, this.defaultCardGiftUser)
      })
      this.showCardGifts(this.cardSelect)
    },
    closeDeletecardgiftUser() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
      this.initialize();
    },
    requestDelete() {
      let request = {
        id: this.editedCardGiftUser.id
      };
      axios
        .post('http://127.0.0.1:8000/api/card-gift-user-destroy', request)
        .then(() => {
          this.dialogRequest = false
          this.$nextTick(() => {
            this.editedCardGiftUser = Object.assign({}, this.defaultCardGiftUser)
          })
          console.log(this.courseSelect);
          this.showCardGifts(this.cardSelect)
          this.showAlert("success", "Asignacion eliminada correctamente", 3000);
          this.dialogRequestStore = false;
        })
    },
    save() {
      if (this.editedIndex > -1) {
        //console.log(this.editedItem.id);
        this.valid = false;
        const formData = new FormData();
        for (let key in this.editedItem) {
          formData.append(key, this.editedItem[key]);
        }

        axios
          .post('http://127.0.0.1:8000/api/card-gift-update', formData)
          .then(() => {
            this.initialize();
            this.showAlert("success", "Tarjeta de Regalo editada correctamente", 3000);
        this.imgMiniatura = '';
        this.file = '';
            
          })
      } else {
        this.valid = false;
        const formData = new FormData();
        for (let key in this.editedItem) {
          formData.append(key, this.editedItem[key]);
        }
        axios
          .post('http://127.0.0.1:8000/api/card-gift', formData)
          .then(() => {
            this.initialize();
            this.showAlert("success", "Tarjeta de Regalo registrada correctamente", 3000)
          })
      }
      this.close()
    },
    deleteS(item) {
      this.dialogRequestStore = true
      //this.editedItem.branch_id=item.id
      this.editedCardGiftUser.id = item.id
    },
    closestore() {
      this.dialogAddCardGift = false;
      this.$nextTick(() => {
        this.editedCardGiftUser = Object.assign({}, this.defaultCardGiftUser)
      })
      this.showCardGifts(this.cardSelect)
    },
    saveStore() {
      this.valid = false,
        this.data.card_gift_id = this.cardSelect.id;
      this.data.user_id = this.editedCardGiftUser.user_id;
      this.data.expiration_date = this.editedCardGiftUser.expiration_date ? this.editedCardGiftUser.expiration_date :format(new Date(), "yyyy-MM-dd") ;/*this.input ? format(new Date(this.input), "") : new Date();*/
      console.log('this.editedCardGiftUser.expiration_date');
      console.log(this.data.expiration_date);
      axios
        .post('http://127.0.0.1:8000/api/card-gift-user', this.data)
        .then(() => {
          this.$nextTick(() => {
            this.editedCardGiftUser = Object.assign({}, this.defaultCardGiftUser)
          })
          this.dialogAddCardGift = false;
          this.showCardGifts(this.cardSelect);
          this.showAlert("success", "Tarjeta asignada correctamente al usuario", 3000);
        })
    },
  },
}
</script>