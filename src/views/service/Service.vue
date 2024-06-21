<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-slot -->

<template>
  <v-snackbar class="mt-12" location="right top" :timeout="sb_timeout" :color="sb_type" elevation="24"
    :multi-line="true" vertical v-model="snackbar">
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
          <v-col cols="12" md="4" class="grow ml-4">
            <span class="text-subtitle-1"> <strong>Listado de Servicios</strong></span>
          </v-col>
          <v-col cols="12" md="5"></v-col>
          <v-col cols="12" md="2">

            <v-dialog v-model="dialog" max-width="1000px">
              <template v-slot:activator="{ props }">

                <v-btn v-bind="props" class="text-subtitle-1  ml-12  " color="#E7E9E9" variant="flat" elevation="2"
                  prepend-icon="mdi-plus-circle">
                  Agregar Servicio
                </v-btn>

              </template>
              <v-card>
                <v-toolbar color="#F18254">
                  <span class="text-subtitle-2 ml-4"> Servicio</span>
                </v-toolbar>
                <v-card-text>
                  <v-form v-model="valid" enctype="multipart/form-data">
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-text-field v-model="editedItem.name" clearable label="Nombre" prepend-icon="mdi-form-textbox"
                          variant="underlined" :rules="nameRules">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.simultaneou"
                          :items="options" clearable label="Simultaneo" prepend-icon="mdi-format-list-bulleted-square"
                          item-title="name" item-value="id" variant="underlined"></v-autocomplete>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field v-model="editedItem.price_service" clearable label="Precio"
                          prepend-icon="mdi-currency-usd" variant="underlined" :rules="requiredRules">
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <!--<v-col cols="12" md="4">
                      <v-select clearable label="Tipo" v-model="editedItem.type_service"
                        :items="['Especial', 'Regular']" variant="underlined" prepend-icon="mdi-view-grid"
                        :rules="selectRules"></v-select>
                    </v-col>-->
                      <v-col cols="12" md="4">
                        <v-text-field v-model="editedItem.duration_service" clearable label="Duración"
                          prepend-icon="mdi-clock-time-eight" variant="underlined" :rules="requiredRules">
                        </v-text-field>
                      </v-col>
                      <!--<v-col cols="12" md="4">
                      <v-text-field v-model="editedItem.ponderation" clearable label="Ponderación"
                        prepend-icon="mdi-arrow-collapse-vertical" variant="underlined" :rules="pago">
                      </v-text-field>
                    </v-col>-->
                      <v-col cols="12" md="4">
                        <v-text-field v-model="editedItem.profit_percentaje" clearable label="% Ganancia"
                          prepend-icon="mdi-percent" variant="underlined" :rules="requiredRules">
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="12">
                        <v-text-field v-model="editedItem.service_comment" clearable label="Descripción"
                          prepend-icon="mdi-book-open" variant="underlined" :rules="requiredRules">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-file-input clearable v-model="file" ref="fileInput" label="Imagen del Servicio"
                          variant="underlined" name="file" accept=".png, .jpg, .jpeg" @change="onFileSelected">
                        </v-file-input>
                      </v-col>
                      <v-col cols="12" md="6">
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
                      <v-btn color="warning" variant="flat" @click="save" :disabled="!valid">
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
                  <span class="text-subtitle-2 ml-4"> Eliminar Servicio</span>
                </v-toolbar>

                <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el Servicio seleccionado?</v-card-text>
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
          hide-details></v-text-field>

        <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :search="search"
          :items="results" class="elevation-1 responsive-table" no-results-text="No hay datos disponibles"
          no-data-text="No hay datos disponibles" :loading="loading" loading-text="Cargando datos...">
          <template v-slot:item.price_service="{ item }">
            {{ formatNumber(item.price_service) }}
          </template>
          <template v-slot:item.duration_service="{ item }">
            {{ convertirMinutosAHorasYMinutos(item.duration_service) }}
          </template>
          <template v-slot:top>

            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
          </template>

          <template v-slot:item.simultaneou="{ item }">
            <div class="text-center">
              <v-chip :color="item.simultaneou ? 'green' : 'red'" :text="item.simultaneou ? 'Si ' : 'No'"
                class="text-uppercase" size="small" label></v-chip>
            </div>
          </template>
          <template v-slot:item.name="{ item }">
            <!--this.items = data.map(item => ({
  ...item,
  imageUrl: ${item.imageUrl}?${Date.now()}
}));-->
            <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
              <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_service" alt="image"></v-img>
            </v-avatar><!--+'?$'+Date.now()-->
            {{ item.name }}
          </template>

          <template v-slot:item.actions="{ item }">
            <!--<v-icon size="25" color="blue" class="me-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon size="25" color="red" @click="deleteItem(item)">
            mdi-delete
          </v-icon>-->
            <v-btn density="comfortable" icon="mdi-pencil" @click="editItem(item)" color="primary" variant="tonal"
              elevation="1" class="mr-1 mt-1 mb-1" title="Editar servicio"></v-btn>
            <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="red-darken-4"
              variant="tonal" elevation="1" title="Eliminar servicio"></v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>



  <br>
</template>

<script>

import axios from "axios";
import LocalStorageService from "@/LocalStorageService";

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
    valid: true,
    loading:true,
    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
    search: '',
    dialog: false,
    editando: false,
    message_delete: true,
    dialogDelete: false,
    headers: [
      { title: 'Nombre', key: 'name' },
      { title: 'Simultaneo', align: 'center', key: 'simultaneou' },
      { title: 'Precio', key: 'price_service' },
      //{ title: 'Tipo', key: 'type_service' },
      { title: '% Ganancia', key: 'profit_percentaje' },
      { title: 'Duración', align: 'start', value: 'duration_service' },
      //{ title: 'Ponderación', align: 'start', value: 'ponderation' },
      { title: 'Comentario', align: 'start', value: 'service_comment' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    results: [],
    editedIndex: -1,
    file: null,
    imgMiniatura: '',
    options: [
      {
        "name": "Si",
        "id": 1
      },
      {
        "name": "No",
        "id": 0
      }
    ],
    editedItem: {
      name: '',
      simultaneou: '',
      price_service: '',
      type_service: 'Regular',
      profit_percentaje: '',
      duration_service: '',
      service_comment: '',
      image_service: '',
      id: '',
      //ponderation: 0
    },
    data: {},

    defaultItem: {
      name: '',
      simultaneou: '',
      price_service: '',
      type_service: 'Regular',
      profit_percentaje: '',
      duration_service: '',
      service_comment: '',
      image_service: '',
      //ponderation: 0
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
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    pago: [
      //(value) => !!value || 'Campo requerido',
      (value) => !value || !isNaN(parseFloat(value)) || 'Debe ser un número'],
  }),

  computed: {
    imgedit() {
      return this.imgMiniatura;
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Servicio' : 'Editar Servicio'
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
    this.initialize();

  },

  methods: {
    convertirMinutosAHorasYMinutos(minutos) {

//console.log("estos son los minutos")
//console.log(minutos)
// Calcular las horas
var horas = Math.floor(minutos / 60);
// Calcular los minutos restantes después de convertir a horas
var minutosRestantes = minutos % 60;

// Construir el mensaje de salida
var mensaje = "";
if (horas > 0) {
  mensaje += horas + " hora";
  if (horas !== 1) {
    mensaje += "s"; // plural si hay más de una hora
  }
}
if (minutosRestantes > 0) {
  if (mensaje !== "") {
    mensaje += " y ";
  }
  mensaje += minutosRestantes + " minuto";
  if (minutosRestantes !== 1) {
    mensaje += "s"; // plural si hay más de un minuto
  }
}
return mensaje;
},
    formatNumber(value) {
      // Si el valor es menor que 1000, devuelve el valor original con dos decimales
      if (value < 1000) {
        return (Math.round((value + Number.EPSILON) * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      // Primero, redondea el valor a dos decimales
      value = Math.round((value + Number.EPSILON) * 100) / 100;

      // Convierte el valor a cadena con formato de número local (en-US)
      let formattedValue = value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      return formattedValue;
    },
    imagenDisponible() {
      if (this.imgedit !== undefined && this.imgedit !== '') {

        // Intenta cargar la imagen en un elemento oculto para verificar si está disponible
        let img = new Image();
        img.src = this.imgedit;

        return true; // Devuelve true si la imagen está disponible
      }
      return false; // Si la URL de la imagen no está definida o está vacía, devuelve false*/
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
      this.loading = true;
      LocalStorageService.setIsLocked(true);
      axios
        .get('https://api2.simplifies.cl/api/service')
        .then((response) => {
          this.results = response.data.services;
        }).finally(() => { 
          LocalStorageService.setIsLocked(false);       
        this.loading = false;
      });
    },
    onFileSelected(event) {
      let file = event.target.files[0];
      this.editedItem.image_service = file;
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
      this.file = null;
      var img = new Image();
      img.src = 'https://api2.simplifies.cl/api/images/' + item.image_service;
      img.onload = () => {
        this.imgMiniatura = 'https://api2.simplifies.cl/api/images/' + item.image_service;
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
      LocalStorageService.setIsLocked(true);
      //this.results.splice(this.editedIndex, 1)
      let request = {
        id: this.editedItem.id
      };
      axios
        .post('https://api2.simplifies.cl/api/service-destroy', request)
        .then(() => {
          this.showAlert("success", "Servicio eliminado correctamente", 3000)
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.initialize();
        });
      this.closeDelete()
    },
    close() {
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1;
        this.imgMiniatura = '';
        this.file = null;
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
      LocalStorageService.setIsLocked(true);
      if (this.editedIndex > -1) {
        this.valid = false;
        this.editedItem.profit_percentaje = this.editedItem.profit_percentaje ? this.editedItem.profit_percentaje : '';
        console.log(this.editedItem.profit_percentaje);
        const formData = new FormData();
        for (let key in this.editedItem) {
          formData.append(key, this.editedItem[key]);
        }
        axios
          .post('https://api2.simplifies.cl/api/service-update', formData)
          .then(() => {
            this.showAlert("success", "Servicio editado correctamente", 3000);
            this.imgMiniatura = '';
            this.file = null;

          }).finally(() => {
            LocalStorageService.setIsLocked(false);
            this.initialize();
          });

      } else {
        this.valid = false;
        //this.editedItem.simultaneou = this.editedItem.simultaneou === 'Si' ? 1 : 0;
        const formData = new FormData();
        for (let key in this.editedItem) {
          formData.append(key, this.editedItem[key]);
        }
        console.log('formData');
        console.log(formData);
        axios
          .post('https://api2.simplifies.cl/api/service', formData)
          .then(() => {
            LocalStorageService.setIsLocked(false);
            this.showAlert("success", "Servicio registrado correctamente", 3000);
            this.imgMiniatura = '';
            this.file = null;
            this.initialize();
          })
      }
      this.close()
    },
  },
}
</script>
<style>
.responsive-table {
  width: 100%;
  overflow-x: auto;
}
</style>