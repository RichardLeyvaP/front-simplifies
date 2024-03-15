<template>
  <v-row>
    <v-col cols="12" md="5" class="pr-0">
      <v-card color="#F18254">
        <v-row class="mt-6">
          <v-col cols="12" md="5"></v-col>
          <v-col cols="12" md="1">
            <v-avatar size="80">
              <v-img src="@/assets/hernandez_big.png" alt="John"></v-img>
            </v-avatar>
          </v-col>
          <v-col cols="12" md="6"></v-col>
        </v-row>

        <v-row class="mt-6">
          <v-col cols="12" md="12">
            <p class="text-h5 font-weight-black" style="text-align: center;">
              ÚLTIMO LLAMADO
            </p>
          </v-col>
        </v-row>
        <v-row class="mt-10">
          <v-col cols="12" md="12">
            <p class="text-h6 font-weight-black mb-2 " style="text-align: center;">
              TURNO
            </p>
            <p class="text-h4 font-weight-black " :class="{ 'parpadea': parpadeando }"  style="text-align: center;">
              {{ numero }}
            </p>
          </v-col>
        </v-row>
    

        <v-row class="mt-8">
          <v-col cols="12" md="12">
            <p class="text-h6 font-weight-black mb-2 " style="text-align: center;">
              CLIENTE
            </p>
            <p class="text-h4 font-weight-black " :class="{ 'parpadea': parpadeando }" style="text-align: center;">
              {{ client }}
            </p>
          </v-col>
        </v-row>

        <v-row class="mt-10">
          <v-col cols="12" md="12">
            <p class="text-h6 font-weight-black mb-2 " style="text-align: center;">
              PROFESIONAL
            </p>
            <p class="text-h4 font-weight-black " :class="{ 'parpadea': parpadeando }"  style="text-align: center;">
              {{ professional }}
            </p>
          </v-col>
        </v-row>

        
        <v-row class="mt-10">
          <v-col cols="12" md="12">
            <p class="text-h6 font-weight-black mb-2 " style="text-align: center;">
              MÓDULO
            </p>
            <p class="text-h4 font-weight-black " :class="{ 'parpadea': parpadeando }"  style="text-align: center;">
              {{ module }}
            </p>
          </v-col>
        </v-row>

        <v-row class="mt-10">
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
      <v-card color="#E7E9E9">
        <v-row class="mt-8">
          <v-col cols="12" md="3">
            <p class="text-h5 font-weight-black mb-12 " style="text-align: center;">
              TURNO
            </p>           
            
          </v-col>

          <v-col cols="12" md="3">
            <p class="text-h5 font-weight-black mb-12 " style="text-align: center;">
              CLIENTE
            </p>           
            
          </v-col>

          <v-col cols="12" md="3">
            <p class="text-h5 font-weight-black mb-12 " style="text-align: center;">
              PROFESIONAL
            </p>           
         
          </v-col>

          <v-col cols="12" md="3">
            <p class="text-h5 font-weight-black mb-12 " style="text-align: center;">
              MÓDULO
            </p>           
         
          </v-col>

        </v-row>

        <v-row v-for="(dupla, index) in duplas" :key="index" class="mt-8">
       
          <v-col cols="12" md="3">
           <p class="text-h5 font-weight-black mb-12 " style="text-align: center;">
             {{ dupla.number }} 
           </p>           
           
         </v-col>
       <v-col cols="12" md="3">
           <p class="text-h5 font-weight-black mb-12 " style="text-align: center;">
             {{ dupla.cliente }} 
           </p>           
           
         </v-col>

         <v-col cols="12" md="3">
           <p class="text-h5 font-weight-black mb-12 " style="text-align: center;">
             {{ dupla.trabajador }} 
           </p>           
           
         </v-col>
         <v-col cols="12" md="3">
           <p class="text-h5 font-weight-black mb-12 " style="text-align: center;">
             {{ dupla.module }} 
           </p>           
           
         </v-col>
     </v-row>

        
        
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

    client:"",
    professional:"",
    number:"",
    modules:"",
    parpadeando: false,
    module: 0,
    numero :0,
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
    // Establecer un intervalo para mostrar duplas cada 5 segundos
    
    console.log('ESTOY ENTRANDO AL mounted()')
    setInterval(this.callForTime, 5000);    
    // setInterval(this.mostrarDupla, 5000);
  },



  created(){
    
  },

  methods: {
    compararYAgregar() {

     
      const missingReservations = this.reservations.filter(reservation =>
        !this.reservationsAux.some(aux => aux.reservation_id === reservation.reservation_id)
      );

      this.reservationsAux = [...this.reservationsAux, ...missingReservations];
      if(missingReservations.length > 0)
      {
        console.log('ENTRE A MOSTRAR AL NUEVO');
        this.mostrarDupla(missingReservations);
      }
    
     console.log('missingReservations');
     console.log(missingReservations);
     console.log(this.reservationsAux);
    },
    
 
  
    callForTime()
    {
     console.log('AQUI SI ESTOY ENTRANDO -callForTime()');
    this.branch_id = LocalStorageService.getItem("branch_id") ? 1 : LocalStorageService.getItem("branch_id");
    axios
          .get('http://127.0.0.1:8000/api/tail_branch_attended', {
           params: {
                 branch_id: this.branch_id
               }
          })
          .then((response) => {
            this.reservations = response.data.tail;
            console.log("Estoy entrando siiii");
            this.compararYAgregar();
           /* if(this.reservationsAux != this.reservations)
            {
              
              console.log("Estoy entrando al if() siiii");
              this.reservationsAux = this.reservations;
              this.mostrarDupla();

            }*/
          })
    },
    iniciarParpadeo() {
          
      this.parpadeando = true;
      setTimeout(() => {
        this.parpadeando = false;
      }, 3000); // Detener el parpadeo después de 3 segundos
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
          this.numero++,
          this.client = reservation.client_name,
          this.professional = reservation.professional_name
          this.iniciarParpadeo();
        // Insertar la nueva dupla en la primera posición
        this.duplas.unshift({
          cliente: reservation.client_name,
          trabajador: reservation.professional_name,
          module: reservation.puesto, // Cambiar a 'puesto' en lugar de 'module'
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
  }}


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