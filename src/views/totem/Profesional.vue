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

        <v-row class="mt-6">
          <v-col cols="12" md="4"></v-col>
          <v-col cols="12" md="4" style="text-align: center;">
            <v-btn block rounded="0" size="x-large"> ok</v-btn>
          </v-col>        
        </v-row>

        <v-row class="mt-6">
             
          <v-col cols="12" md="4"></v-col>
          <v-col cols="12" md="4">
           
          </v-col>        
        </v-row>
        <v-row class="mt-10">
          <v-col cols="12" md="12">
           <br><br><br><br><br><br><br>
           <v-row class="mt-6">
          <v-col cols="12" md="12">
            <p class="text-h7 " style="text-align: center;">
              Simplifies v1.0
            </p>
          </v-col>
        </v-row><br><br><br><br><br><br><br><br><br>
          </v-col>
        </v-row>





      </v-card>
    </v-col>
    

  </v-row>
</template>
<script>



export default {

  data: () => ({

  
  }),

  mounted() {
    // Establecer un intervalo para mostrar duplas cada 5 segundos
    setInterval(this.mostrarDupla, 5000);
  },



  created() {
   
  },

  methods: {

 

  },
}
</script>




