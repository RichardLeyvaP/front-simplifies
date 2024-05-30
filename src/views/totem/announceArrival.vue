<!-- eslint-disable vue/valid-v-slot -->

<!-- este es el archivo wue se presentó al cliente -->
<template>
  <div >
    <v-container>
      <v-stepper hide-actions  bg-color="" v-model="step" :items="items" 
        
      >

        <!-- CORREO PARA SABER SI ES TECNICO O BARBERO O OTRO PROFESIONAL-->
        <template v-slot:item.1>
          <v-sheet border>
            <v-row>

              <v-col cols="12" md="4" class="mt-2">
                <v-text-field :disabled="verificate" v-model="codeReserva"
                  label="Código" outlined :rules="nameRules"></v-text-field> <!---->
              </v-col>


            </v-row>
            <h3 class="text-h6 red--text">{{ verificate_menssj }}</h3>
           

          </v-sheet>
              <!-- BOTONES -->
            
              <v-container>
                <!-- BOTONES -->
            <v-row class="mt-1">
              <v-spacer></v-spacer>
              <v-btn size="x-large" :disabled="!validateCodigo()" @click="nextStep">Siguiente</v-btn>   <!---->         
            </v-row>
            
          </v-container>
              
             
        </template>

  



      </v-stepper>
    </v-container>
    <br>
    <br>
    <v-row>  
          <v-spacer></v-spacer>        
        <v-btn size="x-large" @click="handleClick" >Volver a inicio</v-btn>
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

export default {
  data: () => ({
    mostrarSheet: true,
    // variables referente al codigo Qr
    array_Places: [],
    getProfesional: {},
    activated: 1,
    formIn: 0,
    email: "",
    loading: false,
    showAlert: false,
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
      v => !!v || 'El nombre es requerido',
      v => (v && v.length <= 50) || 'El nombre no debe exceder de 50 caracteres',
    ],

    surname_professional_Rules: [
      v => !!v || 'El Apellido Paterno es requerido',
      v => (v && v.length <= 50) || 'El Apellido Paterno no debe exceder de 50 caracteres',
    ],

    second_surname_Rules: [
      v => !!v || 'El Apellido Materno es requerido',
      v => (v && v.length <= 50) || 'El Apellido Materno no debe exceder de 50 caracteres',
    ],

    emailRules: [
        value => !!value || 'El correo electrónico es requerido',
        value => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'El correo electrónico debe ser válido',
      ],

    phoneRules: [
      v => !!v || 'El Teléfono es requerido',

    ],
    timeDurationAwait : 3000,//3 segundos despues que genera el Qr
    redirectToAnotherPage :false,
    disabledIntervals: [],
    intervals: [],
    countInterval: 0,
    reservedTime: [],
    calendars_branches: [],
    arrayEvents: null,
    selected_puestoTs: [],
    puestoTs: [],
    professionals: [],
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
      'Ingrese el código de su reserva',
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
  }),

  mounted() {
    //this.business_id = LocalStorageService.getItem('business_id');
    //this.charge_id = LocalStorageService.getItem('charge_id');
    this.branch_id = LocalStorageService.getItem('branch_id');

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
    
    if(this.step < this.items.length) { 
      this.step++;
    }
    console.log('Aqui se muestran los Step');
    console.log(this.step );
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
            console.log("LA RESERVA FUE CONFIRMADA");
            this.startTimer();
            //MADAR MENSAJE Y EN 5 SEGUNDOS IR AL INICIO
            
        }
         else if (code === 3) {
            console.log("LA RESERVA FUE CANCELADA");
            this.startTimer();
            //MANDA UN MENSAJE QUE CONTACTE CON EL PERSONAL D ELA BARBERIA
            
        }
        else if (code === 5)
        {
          console.log("LA RESERVA NO ES VALIDA, NO COINCIDE");
          this.changeStep(1);
        }
          else {
            this.changeStep(1);
            console.log("NO COINCIDE EL CÓDIGO Y NO MANDO NINGUNO DE LOS VALORES ESPERADOS");
          }
          
          this.clearTextClient();
        })
        .catch(error => {
          this.startTimer();
          this.clearTextClient();
          //simulando que diera un tecnico
          //  this.togglepuestoT2(1);
          // Maneja cualquier error que pueda ocurrir durante la solicitud
          console.error('Error al hacer la solicitud:', error);
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