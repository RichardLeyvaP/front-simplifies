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
              <v-card-text class="py-10">
                <div class="d-flex justify-center">
                  <v-icon size="48" color="red">mdi-check-circle</v-icon>
                </div>
                <h2 class="mt-3 mb-4 text-center">Solicitud Denegada</h2>
                <p class="subtitle-1 justify-text">
                  😔 Lamentamos informarle que su no pudo realizarse.<br>
                  Esto se debe a que el plazo de confirmación ha expirado.<br>
                  Esperamos poder atenderle en el futuro y que considere volver a visitarnos. Si tiene alguna pregunta o necesita más información, no dude en ponerse en contacto con nosotros.
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
  export default {
    name: "ConfirmationPage",
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
  
  .justify-text {
    text-align: justify;
  }
  
  .text-center {
    text-align: center;
  }
  </style>
  