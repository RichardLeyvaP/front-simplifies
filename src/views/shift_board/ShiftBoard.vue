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

        <v-row class="mt-6">
          <v-col cols="12" md="12">
            <p class="text-h10 font-weight-black" style="text-align: center;">
              ÚLTIMO LLAMADO
            </p>
          </v-col>
        </v-row>
        <br>
<br>
        <v-row class="mt-8">
          <v-col cols="12" md="12">
            <p class="text-h4 font-weight-black mb-2 " style="text-align: center;">
              CLIENTE
            </p>
            <p class="text-h3 font-weight-black" :class="{ 'parpadea': parpadeando }" style="text-align: center; font-size: 40px; font-family: 'Poppins', sans-serif; font-weight: bold; color: #AD0101;">
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
            <p class="text-h3 font-weight-black" :class="{ 'parpadea': parpadeando }" style="text-align: center; font-size: 40px; font-family: 'Poppins', sans-serif; font-weight: bold; color: #AD0101;">
            <!-- RT03 -->
              {{ numero }}
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
            <p class="text-h3 font-weight-black" :class="{ 'parpadea': parpadeando }" style="text-align: center; font-size: 40px; font-family: 'Poppins', sans-serif; font-weight: bold; color: #AD0101;">
           <!-- MODULO 1 -->
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
      <v-card color="#292C33">
        <v-row class="mt-8">
          <v-col cols="12" md="3">
            <p class="text-h5 font-weight-black mb-12 " style="text-align: center;">
              CÓDIGO
            </p>

          </v-col>

          <v-col cols="12" md="4">
            <p class="text-h5 font-weight-black mb-12 " style="text-align: center;">
              NOMBRE
            </p>

          </v-col>

        

         

        </v-row>

        <!-- <v-row v-for="(dupla, index) in duplas" :key="index" >

          <v-col cols="12" md="3">
            <p class="text-h5 font-weight-black  " style="text-align: center;">
              {{ dupla.number }}
            </p>

          </v-col>
          <v-col cols="12" md="4">
            <p class="text-h5 font-weight-black  " style="text-align: center;">
              {{ dupla.cliente }}
            </p>

          </v-col>

          
        </v-row> -->
        <!-- <div class="custom-scroll-container">
    <v-virtual-scroll :items="items"    height="600" ref="virtualScroll">
      <template v-slot:default="{ item }">
        <v-row>
          <v-col md="3">
            <p class="text-h5 font-weight-black" style="text-align: center;">
              {{ item.code }}
            </p>
          </v-col>
          <v-col md="4">
            <p class="text-h5 font-weight-black" style="text-align: center;">
              {{ item.name }}
            </p>
          </v-col>
        </v-row>
      </template>
    </v-virtual-scroll>
  </div> -->

  <v-carousel 
  height="700"
    show-arrows="hover"
    cycle="true"
    direction="vertical"
    interval="3000"
    hide-delimiters="true"
  >
 
  <v-carousel-item v-for="(itemGroup, index2) in items" :key="index2">
    <v-col md="9" v-for="(item, index) in itemGroup" :key="index">
      <v-row>
        <v-col md="4">
          <p class="text-h5 font-weight-black" style="text-align: center;">
            {{ item.code }}
          </p>
        </v-col>
        <v-col md="6">
          <p class="text-h5 font-weight-black" style="text-align: center;">
            {{ item.name }}
          </p>
        </v-col>
      </v-row>
    </v-col>
  </v-carousel-item>



  <!-- <v-carousel-item
    
  >
  <v-col md="9" v-for="(item2, index) in items2" :key="index">
    <v-row>
          <v-col md="4">
            <p class="text-h5 font-weight-black" style="text-align: center;">
              {{ item2.code }}
            </p>
          </v-col>
          <v-col md="6">
            <p class="text-h5 font-weight-black" style="text-align: center;">
              {{ item2.name }}
            </p>
          </v-col>
        </v-row>
            </v-col> 
            
      
</v-carousel-item>
  <v-carousel-item
    
  >
  <v-col md="9" v-for="(item3, index) in items3" :key="index">
    <v-row>
          <v-col md="4">
            <p class="text-h5 font-weight-black" style="text-align: center;">
              {{ item3.code }}
            </p>
          </v-col>
          <v-col md="6">
            <p class="text-h5 font-weight-black" style="text-align: center;">
              {{ item3.name }}
            </p>
          </v-col>
        </v-row>
            </v-col> 
            
      
</v-carousel-item>
  <v-carousel-item
    
  >
  <v-col md="9" v-for="(item4, index) in items4" :key="index">
    <v-row>
          <v-col md="4">
            <p class="text-h5 font-weight-black" style="text-align: center;">
              {{ item4.code }}
            </p>
          </v-col>
          <v-col md="6">
            <p class="text-h5 font-weight-black" style="text-align: center;">
              {{ item4.name }}
            </p>
          </v-col>
        </v-row>
            </v-col> 
            
      
</v-carousel-item> -->

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
     clientes : [
  { code: '001', name: 'John Doe' },
  { code: '002', name: 'Jane Smith' },
  { code: '003', name: 'Michael Johnson' },
  { code: '004', name: 'Emily Wilson' },
  { code: '005', name: 'Robert Anderson' },
  { code: '006', name: 'Sarah Martinez' },
  { code: '007', name: 'David Lee' },
  { code: '008', name: 'Jennifer Taylor' },
  { code: '009', name: 'Christopher Moore' },
  { code: '010', name: 'Jessica Clark' },
  { code: '011', name: 'Daniel Harris' },
  { code: '012', name: 'Melissa Walker' },
  { code: '013', name: 'Matthew Turner' },
  { code: '014', name: 'Lauren White' },
  { code: '015', name: 'Joshua Rodriguez' },
  { code: '016', name: 'Amanda Scott' },
  { code: '017', name: 'Kevin Hall' },
  { code: '018', name: 'Victoria King' },
  { code: '019', name: 'Stephanie Hill' },
  { code: '020', name: 'Jason Allen' }
],
      items:[],
      

    client: "",
    professional: "",
    number: "",
    modules: "",
    branch_id: '',
    parpadeando: false,
    module: 0,
    numero: 0,
   
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
       // Iniciar el ciclo automático de la animación
       setInterval(() => {
  // Aumenta el índice para avanzar al siguiente elemento
  this.currentIndex++;

  // Verifica si se alcanzó el final del arreglo
  if (this.currentIndex >= this.items.length-16) {
    // Reinicia el índice al principio del arreglo
    this.currentIndex = 0;
  }

  // Espera a que el componente virtual-scroll esté completamente renderizado
  this.$nextTick(() => {
    // Obtén el componente virtual-scroll mediante su referencia
    const virtualScroll = this.$refs.virtualScroll;

    // Mueve la vista a la posición correspondiente al ítem en la posición del índice actual
    virtualScroll.scrollToIndex(this.currentIndex);
  });
}, 1500); // Intervalo de 1.5 segundos (ajusta según sea necesario)


        // Simulación de carga de datos (reemplazar con tu lógica real)
        this.fetchItems();


  
    // Establecer un intervalo para mostrar duplas cada 5 segundos    
    this.branch_id = LocalStorageService.getItem("branch_id");
    console.log('ESTOY ENTRANDO AL mounted()')
    setInterval(this.callForTime, 5000);
    // setInterval(this.mostrarDupla, 5000);
  },



  created() {

  },

  methods: {
     

    fetchItems() {
      this.items = this.createArrayOfArrays(this.clientes, 13);

   
    },
    createArrayOfArrays(originalArray, subsetSize) {
  const arrayOfArrays = [];
  const originalLength = originalArray.length;

  for (let i = 0; i < originalLength; i++) {
    const startIndex = i % originalLength; // Circular index

    const subset = [];
    for (let j = 0; j < subsetSize; j++) {
      const index = (startIndex + j) % originalLength;
      subset.push(originalArray[index]);
    }

    arrayOfArrays.push(subset);
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
  }
}


</script>
<style scoped>
.carousel-item {
  animation: slide-up 2s infinite linear;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.custom-scroll-container {
  overflow: hidden !important; /* Oculta el desbordamiento */
}

.custom-scroll-container::-webkit-scrollbar {
  display: none !important; /* Oculta las barras de desplazamiento en WebKit */
}
</style>
