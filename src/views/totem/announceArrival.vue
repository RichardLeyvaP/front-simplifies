<!-- eslint-disable vue/valid-v-slot -->

<!-- este es el archivo wue se presentó al cliente -->
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
  <div>
    <v-container>
      <v-stepper hide-actions bg-color="" v-model="step" :items="items">

        <!-- CORREO PARA SABER SI ES TECNICO O BARBERO O OTRO PROFESIONAL-->
        <template v-slot:item.1>
          <v-sheet border>
            <v-row>

              <!--<v-col cols="12" md="4" class="mt-2">
                <v-text-field :disabled="verificate" v-model="codeReserva"
                  label="Código" outlined :rules="nameRules"></v-text-field>
              </v-col>-->
              <v-col cols="12" md="4">
                <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="reservation_id" :items="clients"
                  label="Clientes" prepend-icon="mdi-account-tie-outline" item-title="name" item-value="id"
                  variant="underlined" :rules="selectRules" @update:model-value="handleClientSelection">
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props"
                      :prepend-avatar="'https://api2.simplifies.cl/api/images/' + item.raw.client_image"
                      :title="item.raw.name">
                      <v-list-item-subtitle class="d-flex flex-column">
                      <div>Email: {{ item.raw.email }}</div>
                      <div>Hora de inicio: {{ item.raw.start_time }}</div>
                    </v-list-item-subtitle>
                      </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>

            </v-row>
            <v-row v-if="showDetails">
              <v-col cols="12" md="3">
                <v-text-field readonly v-model="professionalName"
                  label="Profesional" outlined></v-text-field>  
                  </v-col>                
              <v-col cols="12" md="3">
                <v-text-field readonly v-model="start_time"
                  label="Hora de inicio" outlined></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3">
                  <v-text-field readonly v-model="final_hour"
                  label="Hora de finalización" outlined></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                  <v-text-field readonly v-model="services"
                  label="Servicios seleccionados" outlined></v-text-field>
              </v-col>

            </v-row>
            <h3 class="text-h6 red--text">{{ verificate_menssj }}</h3>


          </v-sheet>
          <!-- BOTONES -->

          <v-container>
            <!-- BOTONES -->
            <v-row class="mt-1">
              <v-spacer></v-spacer>
              <v-btn size="x-large" :disabled="!this.reservation_id" @click="confirmReservation">Siguiente</v-btn> <!---->
            </v-row>

          </v-container>


        </template>





      </v-stepper>
    </v-container>
    <br>
    <br>
    <v-row>
      <v-spacer></v-spacer>
      <v-btn size="x-large" @click="handleClick">Volver a inicio</v-btn>
      <v-spacer></v-spacer>
    </v-row>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
  </div>
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
    mostrarSheet: true,
    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
    // variables referente al codigo Qr
    array_Places: [],
    getProfesional: {},
    activated: 1,
    formIn: 0,
    email: "",
    loading: false,
    qrCode: '',
    qrCodeBase64: '',
    showQR: false,
    // variables referente al codigo Qr
    tipoProfessional: '',
    barberAleatorie: false,
    verificate: false,
    verificate_menssj: '',
    codeConfirmation: 0,
    radios: 'ClientNo',
    message: "Los datos para realizar la reserva están completos. Se enviará correo electrónico con los datos de la reserva",
    checkbox: false,
    name_professional: "",
    email_client: "",
    codeReserva: "",
    type_professional: "",
    selected_interval: "",
    surname_professional: "",
    second_surname: "",
    dayOK: "",
    selected_professional: "",
    date: "",
    focus: '',
    start_time1: '',
    array_puestoTs: [],
    branch_id: '',

    nameRules: [
      v => !!v || 'El código es requerido',
      v => (v && v.length <= 10) || 'El código es de 1 a 10 caracteres',
    ],


    timeDurationAwait: 3000,//3 segundos despues que le da respuesta
    redirectToAnotherPage: false,
    disabledIntervals: [],
    intervals: [],
    countInterval: 0,
    reservedTime: [],
    calendars_branches: [],
    arrayEvents: null,
    selected_puestoTs: [],
    reservation_id: '',
    final_hour: '',
    start_time: '',
    services: '',
    professionalName: '',
    showDetails: false,
    puestoTs: [],
    clients: [],
    hourSelect: [],
    selected: [],
    professional: [],
    //
    //
    //
    //
    dayOfWeek: [],
    shipping: 0,
    step: 1,
    items: [
      'Seleccione su reservación',
    ],
    products: [
      {
        name: 'Product 1',
        price: 10,
        quantity: 2,
      },
      {
        name: 'Product 2',
        price: 15,
        quantity: 10,
      },
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
  }),

  mounted() {
    //this.business_id = LocalStorageService.getItem('business_id');
    //this.charge_id = LocalStorageService.getItem('charge_id');
    this.branch_id = LocalStorageService.getItem('branch_id');
    axios
      .get('https://api2.simplifies.cl/api/client-reservation', {
        params: {
          branch_id: this.branch_id
        }
      })
      .then((response) => {
        this.clients = response.data.clients;
      });

  },
  computed: {

    advanceReserva1() {
      console.log()
      return !this.selected.length > 0; // Verdadero si hay elementos, falso si está vacío
    },
    advanceReserva2() {
      console.log('this.array_Places.length');
      console.log(this.selected.length);
      return this.selected.length === 0; // Verdadero si hay elementos, falso si está vacío
    },

  },

  methods:
  {
    handleClientSelection(selectedItem) {
      // Buscar los detalles del cliente seleccionado en la lista de usuarios
      if (selectedItem) {
        const selectedClient = this.clients.find(client => client.id === selectedItem);
        this.professionalName = selectedClient.professionalName;
        this.start_time = selectedClient.start_time;
        this.final_hour = selectedClient.final_hour;
        this.services = selectedClient.services;
        this.showDetails = true;
      }
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
    startTimer() {
      this.timer = setTimeout(() => {
        // Redirigir a otra página después de 20 segundos si estás en el último paso

        this.$router.push('/totem');

      }, this.timeDurationAwait);
    },

    handleClick() {
      clearTimeout(this.timer);
      this.$router.push('/totem');
    },
    stopTimer() {
      clearTimeout(this.timer);
    },
    validateCodigo() {
      // Comprueba si todas las reglas de validación se cumplen
      return this.nameRules.every(rule => rule(this.codeReserva || '') === true);
    },
    nextStep() {

      if (this.step < this.items.length) {
        this.step++;
      }
      console.log('Aqui se muestran los Step');
      console.log(this.step);
      this.verificateStep(this.step);

    },

    verificateStep(newValue) {
      if (newValue === 1) {

        this.sendData();
      }

    },

    changeStep(index) {
      // Cambiar el valor de step al índice especificado
      this.step = index;
    },
    clearTextClient() {
      this.codeReserva = '';
      this.professionalName = '';
        this.start_time = '';
        this.final_hour = '';
        this.services = '';
        this.reservation_id = '';

    },
    send() {


      const newArrayPlaces = this.array_Places.map(item => parseInt(item));
      console.log(newArrayPlaces[0]);
      if (this.tipoProfessional === 'Tecnico')//es tecnico
      {

        this.getProfesional = {
          professional_id: this.professionalId,
          workplace_id: newArrayPlaces[0],
          places: newArrayPlaces,
        }
      }
      else//es barbero
      {
        this.getProfesional = {
          professional_id: this.professionalId,
          workplace_id: newArrayPlaces[0],
          places: 0,
        }
      }


    },
    confirmReservation(){
      axios.get(`https://api2.simplifies.cl/api/update-confirmation-client?reservation_id=${this.reservation_id}`)
        .then(response => {
          // Maneja la respuesta de la solicitud aquí
          this.codeConfirmation = response.data;
          
          const code = this.codeConfirmation;

          //ASIGNO A LOS CAMPOS DEL FORMULARIO TDS LOS DATOS
          if (code === 4) {
            this.showAlert("success", "Se ha confirmado su llegada.Espere ser atendido", 3000);
            //console.log("LA RESERVA FUE CONFIRMADA");
            this.startTimer();
            //MADAR MENSAJE Y EN 5 SEGUNDOS IR AL INICIO

          }
          else if (code === 5) {
            this.showAlert("warning", "No puede anunciar su llegada, por favor acérquese al coordinador más cercano disponible", 3000);
            this.clearTextClient();
            //console.log("LA RESERVA NO ES VALIDA, NO COINCIDE");
            this.changeStep(1);
          }
          /*else {
            this.changeStep(1);
            console.log("NO COINCIDE EL CÓDIGO Y NO MANDO NINGUNO DE LOS VALORES ESPERADOS");
          }*/

          this.clearTextClient();
        })
        .catch(error => {
          this.showAlert("warning", "Error de conexión, vuelva a intentarlo", 3000);
          this.startTimer();
          this.clearTextClient();
          console.log('******error******');
          console.log(error);
          //simulando que diera un tecnico
          //  this.togglepuestoT2(1);
          // Maneja cualquier error que pueda ocurrir durante la solicitud
          // console.error('Error al hacer la solicitud:', error);
        });
    },
    sendData() {
      console.log('-------------------this.branch_id-----------------');
      console.log(this.branch_id);
      console.log('-------------------this.codeReserva-----------------');
      console.log(this.codeReserva);

      // Realiza la solicitud POST Y BUSCO LOS DATOS DEL CLIENTE 
      axios.get(`https://api2.simplifies.cl/api/update-confirmation-code?code=${this.codeReserva}&branch_id=${this.branch_id}`)
        .then(response => {
          // Maneja la respuesta de la solicitud aquí
          this.codeConfirmation = response.data;
          console.log('-------------------------------Respuesta del codigo----------------------------------------');
          console.log(this.codeConfirmation);



          const code = this.codeConfirmation;

          //ASIGNO A LOS CAMPOS DEL FORMULARIO TDS LOS DATOS
          if (code === 4) {
            this.showAlert("success", "Se ha confirmado su llegada.Espere ser atendido", 3000);
            //console.log("LA RESERVA FUE CONFIRMADA");
            this.startTimer();
            //MADAR MENSAJE Y EN 5 SEGUNDOS IR AL INICIO

          }
          else if (code === 3) {
            this.showAlert("warning", "Su reserva se encuantra cancelada por no ser confirmada en tiempo", 3000);
            //console.log("LA RESERVA FUE CANCELADA");
            this.startTimer();
            //MANDA UN MENSAJE QUE CONTACTE CON EL PERSONAL D ELA BARBERIA

          }
          else if (code === 5) {
            this.showAlert("warning", "El código no es válido, digite un código válido", 3000);
            this.clearTextClient();
            //console.log("LA RESERVA NO ES VALIDA, NO COINCIDE");
            this.changeStep(1);
          }
          /*else {
            this.changeStep(1);
            console.log("NO COINCIDE EL CÓDIGO Y NO MANDO NINGUNO DE LOS VALORES ESPERADOS");
          }*/

          this.clearTextClient();
        })
        .catch(error => {
          this.showAlert("warning", "Error de conexión, vuelva a intentarlo", 3000);
          this.startTimer();
          this.clearTextClient();
          console.log('******error******');
          console.log(error);
          //simulando que diera un tecnico
          //  this.togglepuestoT2(1);
          // Maneja cualquier error que pueda ocurrir durante la solicitud
          // console.error('Error al hacer la solicitud:', error);
        });

    },


  }
}
</script>
<style>
.selected-item {
  background-color: orange !important;
}

/* Espacio entre los items */
.list-item-spacing {
  margin-bottom: 8px;
  /* Ajusta según necesites */
}
</style>