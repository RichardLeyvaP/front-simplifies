<template>
  <v-row>
    <v-col cols="12" md="5" class="pr-0">
      <v-card color="#FFFFFF">
        <v-row class="mt-6">
          <v-col cols="12" md="5"></v-col>
          <v-col cols="12" md="1">
            <v-avatar size="80">
              <v-img src="@/assets/hernandez_big.png" alt="John"></v-img>
            </v-avatar>
          </v-col>
          <v-col cols="12" md="6"></v-col>
        </v-row>
 <!-- Botón para reproducir sonido -->
<!--
  <v-row class="mt-6">
      <v-col cols="12" md="12" class="text-center">
        <v-btn color="primary" @click="run_sound">Reproducir Sonido</v-btn>
      </v-col>
    </v-row>
-->
        <v-row class="mt-6">
          <v-col cols="12" md="12">
            <p class="text-h4 font-weight-black mb-2 " style="text-align: center;">
              ÚLTIMO LLAMADO
            </p>
          </v-col>
        </v-row>
        <br>
        
        <v-row class="mt-8">
          <v-col cols="12" md="12">
            <p class="text-h4 font-weight-black mb-2 " style="text-align: center;">
              CLIENTE
            </p>
            <p class="text-h3 font-weight-black" :class="{ 'parpadea': parpadeando }"
              style="text-align: center; font-size: 40px; font-family: 'Poppins', sans-serif; font-weight: bold; color: #AD0101;">
              <!-- Richard Leyva -->
              {{ client }}
            </p>
          </v-col>
        </v-row>
        <br>
        <br>
        <v-row class="mt-10">
          <v-col cols="12" md="12">
            <p class="text-h4 font-weight-black mb-2 " style="text-align: center;">
              CÓDIGO DE RESERVA
            </p>
            <p class="text-h3 font-weight-black" :class="{ 'parpadea': parpadeando }"
              style="text-align: center; font-size: 40px; font-family: 'Poppins', sans-serif; font-weight: bold; color: #AD0101;">
              <!-- RT03 -->
              {{ getString(code) }}
            </p>
          </v-col>
        </v-row>

        <br>
        <br>

        <v-row class="mt-10">
          <v-col cols="12" md="12">
            <p class="text-h4 font-weight-black mb-2 " style="text-align: center;">
              MÓDULO
            </p>
            <p class="text-h3 font-weight-black" :class="{ 'parpadea': parpadeando }"
              style="text-align: center; font-size: 40px; font-family: 'Poppins', sans-serif; font-weight: bold; color: #AD0101;">
              <!-- MODULO 1 -->
              {{ module }}
            </p>
          </v-col>
        </v-row> <v-row class="mt-10">
          <v-col cols="12" md="12">
            <br><br><br><br><br><br><br>
            <v-row class="mt-6">
              <v-col cols="12" md="12">




              </v-col>
            </v-row><br><br><br><br><br><br><br><br><br>
          </v-col>
        </v-row>





      </v-card>
    </v-col>

    <v-col cols="12" md="7" class="pl-0">
      <v-card color="#292C33">
        <v-row class="mt-8">
          <v-col cols="12" md="4">
            <p class="font-weight-black" 
              style="text-align: center; font-size: 40px; font-family: 'Poppins', sans-serif; font-weight: bold; color: #ffffff;">
              CÓDIGO
            </p>

          </v-col>

          <v-col cols="12" md="5">
            <p class="font-weight-black" 
              style="text-align: center; font-size: 40px; font-family: 'Poppins', sans-serif; font-weight: bold; color: #ffffff;">
              NOMBRE
            </p>

          </v-col>





        </v-row>



        
  <v-carousel height="800" show-arrows="hover" cycle="false" direction="vertical" interval="6000" hide-delimiters="true">
    <v-carousel-item transition="tab-transition" v-for="(itemGroup, index2) in items" :key="index2">
      <v-col md="10" v-for="(item, index) in itemGroup" :key="index">
        <transition name="fade" mode="out-in">
          <v-row class="credit-scroll">
            <v-col md="4" class="offset-md-1">
              <p class="font-weight-black" 
                style="text-align: justify; font-size: 40px; font-family: 'Poppins', sans-serif; font-weight: bold; color: #ffffff;">
                {{ getString(item.code) }}
              </p>
            </v-col>
            <v-col md="6" class="offset-md-1">
              <p class="font-weight-black" 
                style="text-align: justify; font-size: 40px; font-family: 'Poppins', sans-serif; font-weight: bold; color: #ffffff;">
                {{ item.client_name }}
              </p>
            </v-col>
          </v-row>
        </transition>
      </v-col>
    </v-carousel-item>
  </v-carousel>




        <v-row class="mt-10">
          <v-col cols="12" md="12">
            <br><br><br><br><br><br><br><br><br>
            <br><br><br><br><br><br><br><br><br>
            <br><br><br><br><br><br><br><br><br>
            <br><br><br><br><br><br><br><br><br>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

  </v-row>
</template>
<script>


import axios from "axios";
import LocalStorageService from "@/LocalStorageService";
export default {

  data: () => ({
    currentIndex: 0,
   
    clientes: [],
    items: [],

    client: "",
    professional: "",
    number: "",
    modules: "",
    branch_id: '',
    parpadeando: false,
    module: 0,
    code: 0,
    numero: 0,
    duplas: [],
    reservations: [], // Nuevo arreglo para almacenar las reservas
    reservationsAux: [], // Nuevo arreglo para almacenar las reservas
    currentReservation: {}, // Nuevo objeto para almacenar la reserva actual
    reservationKeys: [ // Nuevas claves para iterar sobre las reservas
      "reservation_id", "car_id", "from_home", "start_time", "final_hour",
      "total_time", "client_name", "professional_name", "client_id",
      "professional_id", "professional_state", "attended", "puesto"
    ],
  }),

  mounted() {
    this.fetchItems(this.clientes);
    // Establecer un intervalo para mostrar duplas cada 5 segundos    
    this.branch_id = LocalStorageService.getItem("branch_id");
    console.log('ESTOY ENTRANDO AL mounted()');
    this.callForTime();
    setInterval(this.callForTime, 9000);
    // setInterval(this.mostrarDupla, 5000);
  },



  created() {

  },

  methods: {

    getString(str) {
      if (typeof str === 'string' && str.startsWith('RE')) {
      return 'RESERVA';
    }
    return str;
    },
    fetchItems(valueClient) {
      console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww ENTRE EN fetchItems');
      this.items = this.createArrayOfArrays(valueClient, 8);
      console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww this.items');
      console.log(this.items);


    },
    createArrayOfArrays(originalArray, subsetSize) {
      const arrayOfArrays = [];
      const originalLength = originalArray.length;
      

      if (originalLength <= subsetSize) {
    // Si la longitud del arreglo original es menor o igual al tamaño del subconjunto
    arrayOfArrays.push(originalArray);
  } else
  {
    for (let i = 0; i < originalLength; i++) {
        const startIndex = i % originalLength; // Circular index
      let page = subsetSize;
        const subset = [];
       /* if(originalLength < 8)
        {
          page = 1; 
        }*/
        for (let j = 0; j < page; j++) {
          const index = (startIndex + j) % originalLength;
          subset.push(originalArray[index]);

        }
        

        arrayOfArrays.push(subset);
      }

  }

     

      return arrayOfArrays;
    },
    compararYAgregar() {


      const missingReservations = this.reservations.filter(reservation =>
        !this.reservationsAux.some(aux => aux.reservation_id === reservation.reservation_id)
      );

      this.reservationsAux = [...this.reservationsAux, ...missingReservations];
      if (missingReservations.length > 0) {
        console.log('ENTRE A MOSTRAR AL NUEVO');
        this.mostrarDupla(missingReservations);
      }

      console.log('missingReservations');
      console.log(missingReservations);
      console.log(this.reservationsAux);
    },



    callForTime() {
      console.log('AQUI SI ESTOY ENTRANDO -callForTime()');
      axios
        .get('https://api2.simplifies.cl/api/tail_branch_attended', {
          params: {
            branch_id: this.branch_id
          }
        })
        .then((response) => {
          this.reservations = response.data.attended;
          this.clientes = response.data.tail;
         

            console.log("Estoy entrando siiii");
            
          this.compararYAgregar();

        }).finally(() => {
          console.log("****************finally***************");
          console.log(this.clientes);
          this.fetchItems(this.clientes);
          console.log("****************fetchItems***************");
          console.log(this.items);
          
        })
    },
    iniciarParpadeo() {

      this.parpadeando = true;
      // Crear una instancia del objeto Audio y reproducir el sonido
  /* const audio = new Audio(require('@/assets/ALERT.mp3')); // Ruta al archivo de sonido
      audio.play();*/
      this.run_sound();
      setTimeout(() => {
        this.parpadeando = false;
      }, 3000); // Detener el parpadeo después de 3 segundos
   
   
    },

    run_sound(){
      console.log('Entrando a playing audio');
       // Crear una instancia del objeto Audio y reproducir el sonido
       const audio = new Audio('/beep.mp3'); // Ruta al archivo de sonido
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });

    },

    mostrarDupla(missingReservations) {
      console.log('AQUI SI ESTOY ENTRANDO -mostrarDupla()');
      if (missingReservations.length > 0) {

        const reservation = missingReservations.shift(); // Seleccionar la primera reserva del arreglo
        console.log(missingReservations.length);
        if (this.duplas.length >= 5) {
          // Si hay al menos 5 duplas, quitar la última dupla antes de insertar la nueva
          this.duplas.pop();
        }

        this.module = reservation.puesto,
          this.code = reservation.code,
          this.numero++,
          this.client = reservation.client_name,
          this.professional = reservation.professional_name
        this.iniciarParpadeo();
        this.fetchItems(this.clientes);
        // Insertar la nueva dupla en la primera posición
        this.duplas.unshift({
          cliente: reservation.client_name,
          trabajador: reservation.professional_name,
          module: reservation.puesto, // Cambiar a 'puesto' en lugar de 'module'
          code: reservation.code, // Cambiar a 'puesto' en lugar de 'module'
          number: this.numero
        });
      }
      //},
      /*if (this.clientes.length > 0 && this.trabajadores.length > 0) {
        // Obtener un cliente y un trabajador al azar
        const clienteIndex = Math.floor(Math.random() * this.clientes.length);
        const trabajadorIndex = Math.floor(Math.random() * this.trabajadores.length);
        const cliente = this.clientes[clienteIndex];
        const trabajador = this.trabajadores[trabajadorIndex];

        this.module++,
        this.numero++,
        this.client=cliente.nombre;
        this.professional=trabajador.nombre;
        
      
 
   this.iniciarParpadeo()
        // Agregar la dupla a la lista de duplas y eliminar cliente y trabajador
        this.duplas.push({ cliente: cliente.nombre, trabajador: trabajador.nombre , module: this.module, number:this.numero });
        this.clientes.splice(clienteIndex, 1);
        this.trabajadores.splice(trabajadorIndex, 1);
      }*/
    },
  }
}


</script>

<style>
.parpadea {
  animation: parpadeo 1s infinite;
}

@keyframes parpadeo {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.v-carousel-item .fade-enter-active,
.v-carousel-item .fade-leave-active {
  transition: opacity 1s ease;
}

.v-carousel-item .fade-enter, 
.v-carousel-item .fade-leave-to {
  opacity: 0;
}

.credit-scroll {
  animation: slide-up 7s ease-out;
}
</style>
<style>
.fade-transition-enter-active, .fade-transition-leave-active {
  transition: opacity 1s ease;
}
.fade-transition-enter, .fade-transition-leave-to {
  opacity: 0;
}
</style>