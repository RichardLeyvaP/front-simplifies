<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
  <v-row >
    <v-col cols="12" md="12" class="pr-0">
      <br>
  <br>
  <br>
  <br>
      <v-card elevation="0">
        <v-row>
          <v-col cols="12" md="9" style="text-align: right;">
          </v-col>
          <v-col cols="12" md="3" style="text-align: right;">
            <p class="text-h7 " style="text-align: center;" @click="goToProfessional">
                  Ingreso de Profesionales
                </p>
          </v-col>
        </v-row>
        <v-row class="mt-6">
          <br>

          <v-col cols="12" md="12" style="text-align: center;">
            <v-avatar size="120">
              <v-img src="@/assets/hernandez_big.png" alt="John"></v-img>
            </v-avatar>
          </v-col>
        </v-row>
        <v-row class="mt-6">
          <v-col cols="12" md="12">
            <p class="text-h6 white-text text-uppercase" color="white" style="text-align: center;">
              Bienvenido a Barberías Hernández
            </p>
            <br>
          </v-col>
        </v-row>
        <div v-if="activated == 1">
          <v-row class="mt-6">
            <v-col cols="12" md="4"></v-col>
            <v-col cols="12" md="4" style="text-align: center;">
              <v-btn class="orange-border blink"  block rounded="0" size="x-large" @click="goToReserve"> Cliente</v-btn>
            </v-col>
          </v-row>
          <v-row class="mt-6">
            <v-col cols="12" md="4"></v-col>
            <v-col cols="12" md="4">
              <!--<v-btn block rounded="0" @click="goToProfessional" size="x-large"> Profesional</v-btn>-->
            </v-col>
          </v-row>
        </div>
      
        <div v-if="activated == 3">

          <v-row class="mt-6">
            <v-col cols="12" md="4"></v-col>
            <v-col cols="12" md="4" style="text-align: center;">
              <v-text-field v-model="email" :rules="emailRules" label="Correo electrónico" hide-details required
                variant="solo"></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-6">
            <v-col cols="12" md="4"></v-col>
            <v-col cols="12" md="4" style="text-align: center;">
              <v-btn block rounded="0" :loading="loading" @click="validar()" size="x-large"> Generar QR de Entrada</v-btn>
            </v-col>
          </v-row>
          <v-row class="mt-6" v-if="showAlert">
            <v-col cols="12" md="4"></v-col>
            <v-col cols="12" md="4">
              <v-alert closable title="Error" text="Correo Inválido" type="error"></v-alert>
            </v-col>
          </v-row>
          <v-row class="mt-2" v-if="showQR">
            <v-col cols="12" md="4"></v-col>
            <v-col cols="12" md="4">
              <v-img class="mx-auto" height="300" :src="qrCodeBase64" max-width="500">
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                  </div>
                </template>
              </v-img>
            </v-col>
          </v-row>
        </div>
        <!-- seleccionar barbero o tecnico -->
        <div v-if="activated == 4">
          <v-row class="mt-6">
            <v-col cols="12" md="4"></v-col>
            <v-col cols="12" md="4" style="text-align: center;">
              <v-btn block rounded="0" @click="show(5)" size="x-large"> TÉCNICO</v-btn>
              <br>
              <v-btn block rounded="0" @click="show(6)" size="x-large"> BARBERO</v-btn>
            </v-col>
          </v-row>
        </div>
        <!-- puesto del tecnico -->
        <div v-if="activated == 5">
          <v-row class="mt-6">
            <v-col cols="12" md="4"></v-col>
            <v-col cols="12" md="4" style="text-align: center;">
  <v-btn
    v-for="index in 3"
    :key="index"
    block
    rounded="5"
    @click="show(3)"
    size="x-large"
  >
    Puesto{{ index }}
  </v-btn>
</v-col>
          </v-row>
        </div>
        <!-- puesto del Barbero -->
        <div v-if="activated == 6">
          <v-row class="mt-6">
            <v-col cols="12" md="4"></v-col>
            <v-col cols="12" md="4" style="text-align: center;">
              <v-btn block rounded="0" @click="show(3)" size="x-large"> PuestoB-1</v-btn>
              <br>
              <v-btn block rounded="0" @click="show(3)" size="x-large"> PuestoB-2</v-btn>
              <br>
              <v-btn block rounded="0" @click="show(3)" size="x-large"> PuestoB-3</v-btn>
              <br>
              <v-btn block rounded="0" @click="show(3)" size="x-large"> PuestoB-4</v-btn>
            </v-col>
          </v-row>
        </div>
        
        <v-row class="mt-10">
          <v-col cols="12" md="12">
            <br><br><br>
            <v-row class="mt-6">
              <v-col cols="12" md="12">
                <p class="text-h7 " style="text-align: center;">
                  Simplifies v1.0
                </p>
              </v-col>
            </v-row><br><br><br>
          </v-col>
        </v-row>

      </v-card>
      <br>
  <br>
  <br>
  <br>
  <br>
  <br>
    </v-col>


  <br>
  <br>
  <br>
  <br>
  </v-row>
</div>
</template>
<script>


import axios from "axios";
import router from '@/router/index';
import LocalStorageService from "@/LocalStorageService";
export default {

  data: () => ({
    activated: 1,
    formIn: 0,
    email: "",
    loading: false,
    showAlert: false,
    qrCode: '',
    qrCodeBase64: '',
    showQR: false,
    branch_id: '',
  }),

  mounted() {
    //this.business_id = LocalStorageService.getItem('business_id');
    //this.charge_id = LocalStorageService.getItem('charge_id');
  this.branch_id = LocalStorageService.getItem('branch_id');
  console.log(this.branch_id);
    // Establecer un intervalo para mostrar duplas cada 5 segundos
    setInterval(this.mostrarDupla, 5000);
  },



  created() {

  },

  methods: {

    goToReserve() {
      router.push({ name: "Reservar" });
    },
    goToProfessional() {
      router.push({ name: "toProfessional" });
    },

    show(value) {
      this.activated = value
    },

    formShow(value) {
      this.formIn = value
    },


    reset() {
      this.loading = false
      this.showAlert = false
      this.showQR = false
    },

    validar() {
      this.loading = true
      axios
        .get('https://api2.simplifies.cl/api/qrCode', {
          params: {
            branch_id: this.branch_id,
            email: this.email
          }
        })
        .then((response) => {
          this.qrCode = response.data;
          let svgData = atob(this.qrCode);
          this.qrCodeBase64 = 'data:image/svg+xml;base64,' + btoa(svgData);
          console.log(this.qrCodeBase64);
        });
      if (this.qrCode) {
        this.showAlert = true;
        setTimeout(() => {
          this.loading = false;
          this.showAlert = false;
        }, 5000);
      }
      else {
        setTimeout(() => {
          this.loading = false;
          this.showQR = true
        }, 2000);

        setTimeout(() => {
          this.activated = 1
        }, 8000);
      }


    }

  },
}
</script>
<style>
.orange-border {
  border-color: orange !important;
  color: orange !important; /* Cambiar el color del texto si lo deseas */
  border-width: 2px !important; /* Ajusta el ancho del borde según tus preferencias */
  border-style: solid !important;
  animation: blink-animation 1s infinite; /* Define la animación */
}

@keyframes blink-animation {
  0%, 49% {
    border-color: orange;
  }
  50%, 100% {
    border-color: transparent;
  }
}
</style>




