<template>
  <v-app>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" md="6">
          <v-card class="mx-auto my-12" elevation="12" rounded="lg">
            <v-toolbar color="#F18254" class="justify-center">
              <v-img
                class="mx-auto my-6"
                max-width="228"
                src="@/assets/logo_negro.png"
              ></v-img>
            </v-toolbar>
            <v-card-text class="text-center py-10">
              <v-icon size="48" color="green">mdi-check-circle</v-icon>
              <h2 class="mt-3 mb-4">Reserva Confirmada</h2>
              <p class="subtitle-1">
                "¡Se ha confirmado correctamente su reserva en la barbería Hernández!😊"
              </p>
              <v-divider class="my-4"></v-divider>
              <v-btn color="blue darken-1" @click="handleBackToHome" block>
                Aceptar
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';
export default {
  name: "ConfirmationPage",
  mounted() {
    // Configurar Axios para incluir el referer en todas las solicitudes
    axios.defaults.headers.common['referer'] = 'http://localhost:3000/reserv';

    // Realizar una solicitud de ejemplo
    axios.get('http://http://localhost:3000/api/reserv/confirmation')
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error:', error.response.data);
      });
  },
  methods: {
    handleBackToHome() {
        window.location.href = 'https://landingbh.simplifies.cl/';
    },
  },
};
</script>

<style scoped>
.fill-height {
  height: 100vh;
  display: flex;
  align-items: center;
}

v-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>