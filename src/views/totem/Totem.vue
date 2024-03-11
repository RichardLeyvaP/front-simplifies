<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-row>
    <v-col cols="12" md="2" class="pr-0"></v-col>
    <v-col cols="12" md="8" class="pr-0">
      <v-card color="#F18254">
        <v-row class="mt-6">

          <v-col cols="12" md="12" style="text-align: center;">
            <v-avatar size="80">
              <v-img src="@/assets/hernandez_big.png" alt="John"></v-img>
            </v-avatar>
          </v-col>
        </v-row>
        <v-row class="mt-6">
          <v-col cols="12" md="12">
            <p class="text-h6 white-text text-uppercase" color="white" style="text-align: center;">
              Bienvenido a Barberías Hernández
            </p>
          </v-col>
        </v-row>
        <div v-if="activated == 1">
          <v-row class="mt-6">
            <v-col cols="12" md="4"></v-col>
            <v-col cols="12" md="4" style="text-align: center;">
              <v-btn block rounded="0" size="x-large"> Cliente</v-btn>
            </v-col>
          </v-row>
          <v-row class="mt-6">
            <v-col cols="12" md="4"></v-col>
            <v-col cols="12" md="4">
              <v-btn block rounded="0" @click="show(2)" size="x-large"> Profesional</v-btn>
            </v-col>
          </v-row>
        </div>
        <div v-if="activated == 2">
          <v-row class="mt-6">
            <v-col cols="12" md="4"></v-col>
            <v-col cols="12" md="4" style="text-align: center;">
              <v-btn block rounded="0" @click="show(3)" size="x-large"> Registrar Entrada</v-btn>
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
    </v-col>


  </v-row>
</template>
<script>


import axios from "axios";
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
  }),

  mounted() {
    // Establecer un intervalo para mostrar duplas cada 5 segundos
    setInterval(this.mostrarDupla, 5000);
  },



  created() {

  },

  methods: {

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
        .get('http://127.0.0.1:8000/api/qrCode', {
          params: {
            branch_id: 1,
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




