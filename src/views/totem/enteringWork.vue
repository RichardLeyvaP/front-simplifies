<!-- eslint-disable vue/valid-v-slot -->

<!-- este es el archivo wue se presentó al cliente -->
<template>
  <div class="app-container">
    <v-container>
      <v-stepper hide-actions  bg-color="" v-model="step" :items="items" 
        @update:model-value="handleStepChange">

        <!-- CORREO PARA SABER SI ES TECNICO O BARBERO O OTRO PROFESIONAL-->
        <template v-slot:item.1>
          <v-sheet border>
            <v-row>

              <v-col cols="12" md="6" class="mt-2">
                <v-text-field :disabled="verificate" v-model="email_client2" :rules="emailRules"
                  label="Correo Electrónico" outlined required></v-text-field>
              </v-col>


            </v-row>
            <h3 class="text-h6 red--text">{{ verificate_menssj }}</h3>

          </v-sheet>
              <!-- BOTONES -->
              <v-row class="mt-1">
                <v-spacer></v-spacer>
                <v-btn :disabled="!validarEmail()" @click="nextStep">Siguiente</v-btn>             
              </v-row>
        </template>


        <!-- Seleccione Puesto de trabajo SI ES BARBERO O TECNICO -->
        <template v-slot:item.2>
          <h3 class="text-h6">Seleccione Puesto de trabajo</h3>
          
  <v-sheet border v-if="mostrarSheet">
    <v-list>
      <v-list-item-group v-model="array_Places" multiple active-class="deep-purple--text text--accent-4">
        <v-list-item :prepend-avatar="'http://127.0.0.1:8000/api/images/' + puestoT.image_puestoT"
          v-for="puestoT in puestoTs" :key="puestoT.id" @click="togglepuestoT(puestoT.id)"
          :class="{ 'selected-item': isSelected(puestoT.id) }" class="pt-4 pb-4">

          <v-list-item-content>
            <v-list-item-title class="text-h6">{{ puestoT.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-sheet>




          <!-- <v-sheet border>
            <v-list>
              <v-list-item-group v-model="array_Places" multiple active-class="deep-purple--text text--accent-4">
                <v-list-item :prepend-avatar="'http://127.0.0.1:8000/api/images/' + puestoT.image_puestoT"
                  v-for="puestoT in puestoTs" :key="puestoT.id" @click="togglepuestoT(puestoT.id)"
                  :class="{ 'selected-item': isSelected(puestoT.id) }" class="pt-4 pb-4">

                  <v-list-item-content>
                    <v-list-item-title class="text-h6">{{ puestoT.name }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-sheet> -->



          <v-sheet border>
            <v-list>
  <template v-for="puestoT in puestoTs">
    <v-list-item :key="puestoT.id" v-if="mostrarPuestoT(this.type_professional)"
      @click="togglepuestoBarber(puestoT.id)" :class="{ 'selected-item': isSelected(puestoT.id) }" class="pt-4 pb-4">

      <template v-slot:default="{ toggle }">
        <v-list-item-avatar :src="'http://127.0.0.1:8000/api/images/' + puestoT.image_puestoT"></v-list-item-avatar>

        <v-list-item-content @click="toggle">
          <v-list-item-title class="text-h6">{{ puestoT.name }}</v-list-item-title>
        </v-list-item-content>
      </template>

    </v-list-item>
  </template>
</v-list>

</v-sheet>
          <v-row class="mt-1">
               
               <v-btn @click="prevStep">Volver</v-btn>
               <v-spacer></v-spacer>
               <v-btn :disabled="advanceReserva2" @click="nextStep">Generar código</v-btn>
            
             </v-row>
        </template>

        <!-- Generar codigo Qr -->
        <template v-slot:item.3>
          <h3 class="text-h6">Generando código Qr de entrada</h3>

          <v-sheet border>


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
                  <template v-slot:placeholder v-if="true">
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                    </div>
                  </template>
                </v-img>
              </v-col>
            </v-row>
          </v-sheet>
          <v-row class="mt-1">
               
               <v-btn @click="prevStep">Volver</v-btn>
               <v-spacer></v-spacer>
            
             </v-row>
        </template>



      </v-stepper>
    </v-container>
    <br>
    <br>
    <v-row>  
          <v-spacer></v-spacer>        
        <v-btn to="totem" >Volver a inicio</v-btn>
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
    clientRegister: [],
    radios: 'ClientNo',
    message: "Los datos para realizar la reserva están completos. Se enviará correo electrónico con los datos de la reserva",
    checkbox: false,
    name_professional: "",
    email_client: "",
    email_client2: "",
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
    timeDurationAwait : 25000,//20 segundos despues que genera el Qr
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
      'Correo electrónico',
      'Puestos de trabajo',
      'Generar código Qr de entrada',
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
    this.branch_id = LocalStorageService.getItem('branch_id') ? 1 : LocalStorageService.getItem('branch_id');

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
      // Redirigir a otra página después de 5 segundos si estás en el último paso
      if (this.redirectToAnotherPage) {       
        this.$router.push('/totem');
      }
    }, this.timeDurationAwait);
  },
  stopTimer() {
    clearTimeout(this.timer);
  },
    validarEmail() {
      // Comprueba si todas las reglas de validación se cumplen
      return this.emailRules.every(rule => rule(this.email_client2 || '') === true);
    },
    nextStep() {
    
    if(this.step < this.items.length) { 
      this.step++;
    }
    console.log('Aqui se muestran los Step');
    console.log(this.step );
   this.verificateStep(this.step);
 
},
prevStep() {
  if(this.step > 1) {
    this.step--;
  }
  if(this.step === 1)
  {
    this.selected = [];
  }
  if(this.step === 2)
  { 
    //SI NO ES TYPE 1 NI 2
    console.log(this.type_professional);
    if(this.type_professional === 0)
    {
      //lo mando para el inicio, para el correo
      this.changeStep(1);
      this.selected = [];

    }
    
  }
 
},
     
        verificateStep(newValue) {
      // Cancelar el temporizador si el usuario cambia de pestaña antes de que se ejecute
      // Verifica si se está pasando del paso 1 al paso 2
      if (newValue === 2) {
        // Llama a tu método aquí
        console.log("--------------Se ha pasado del paso 1 al paso 2");
        this.sendData();
        this.stopTimer();
      } // Verifica si se está pasando del paso 2 al paso 3
      if (newValue === 3) {
        // Llama a tu método aquí
        console.log("--------------Se ha pasado del paso 2 al paso 3 -divideInterval----------------------------");
        console.log(this.array_Places);
        //llamar a insertar los puestos seleccionado
        this.send();
        // :loading="loading" @click="GenerateQr()"
        this.GenerateQr();
        

      }
     
      },


    GenerateQr() {
      //simulando un correo valido
      //this.email_client2 = 'deylert89@gmail.com';
      
      this.loading = true
      axios
        .get('http://127.0.0.1:8000/api/qrCode', {
          params: {
            branch_id: this.branch_id,
            email: this.email_client2,
            professional:this.getProfesional
          }
        })
        .then((response) => {
          const statusCode = response.status;
          
          if(statusCode == 400)
          {
            this.changeStep(1);
            console.log("NO ES DE LA BRANCH SELECCIONADA");

          }



          else if(statusCode == 200)
          {


          this.qrCode = response.data;
          let svgData = atob(this.qrCode);
          this.qrCodeBase64 = 'data:image/svg+xml;base64,' + btoa(svgData);
          console.log(this.qrCodeBase64);
          this.redirectToAnotherPage = true;
          this.startTimer();
          }

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


    },
    changeStep(index) {
      // Cambiar el valor de step al índice especificado
      this.step = index;
    },
    SelectionRadio(value) {
      this.radios = value;
      console.log(this.radios);
    },
    clearTextClient() {
      this.verificate_menssj = '';
      this.name_professional = '';
      this.type_professional = '';
      this.surname_professional = '';
      this.second_surname = '';
      this.email_client = '';

    },
    send() {


      const newArrayPlaces = this.array_Places.map(item => parseInt(item));
      console.log(newArrayPlaces[0]);
      if (this.tipoProfessional === 'tecnico')//es tecnico
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


     /* // Realiza la solicitud GET con Axios y pasa los parámetros
      axios.post('http://127.0.0.1:8000/api/professionalworkplace', request)
        .then(response => {
          // Maneja la respuesta de la solicitud aquí
          this.message = response.data.msg

        })
        .catch(error => {
          // Maneja cualquier error que pueda ocurrir durante la solicitud
          console.error('Error al hacer la solicitud:', error);
        });
        */

    },
    sendData() {

      // Realiza la solicitud POST Y BUSCO LOS DATOS DEL CLIENTE 
      axios.get(`http://127.0.0.1:8000/api/verify-tec-prof?email=${this.email_client2}`)
        .then(response => {
          // Maneja la respuesta de la solicitud aquí
          this.clientRegister = response.data.professionals;
          console.log('-------------------------------clientRegister----------------------------------------');
          console.log(this.clientRegister);



          const client = this.clientRegister;

          //ASIGNO A LOS CAMPOS DEL FORMULARIO TDS LOS DATOS
          if (client.professional_id != 0) {
          console.log('-------client.type-----');
          
          this.type_professional = client.type;
          console.log(client.type);
            if (client.type != 0) {//es BARBERO O TECNICO

            this.name_professional = client.name;
            this.professionalId = client.professional_id;
            //llamo a la funcio a ver si es tecnico / profesional o /ninguno de los dos
            this.togglepuestoT2(this.type_professional);
            }

          else if (client.type == 0) {//es otro professional                   
            this.professionalId = client.professional_id;
            //ESTE ES PARA LOS QUE NO SON NI BARBERO NI TECNICOS
            this.changeStep(3);
            this.GenerateQrOtro(this.branch_id,this.email_client2,this.professionalId);
            

          }
        }

          else {
            this.changeStep(1);
            console.log("NO COINCIDE EL CORREO");
          }


        })
        .catch(error => {
          //simulando que diera un tecnico
          //  this.togglepuestoT2(1);
          // Maneja cualquier error que pueda ocurrir durante la solicitud
          console.error('Error al hacer la solicitud:', error);
        });

    },

    GenerateQrOtro(branch_id,email_client2,idProfesional) {
    
      //simulando un correo valido
      //this.email_client2 = 'deylert89@gmail.com';
      this.loading = true
      axios
        .get('http://127.0.0.1:8000/api/qrCode-otros', {
          params: {
            branch_id: branch_id,
            email: email_client2,
            professional:idProfesional
          }
        })
        .then((response) => {
          this.qrCode = response.data;
          // verifico si coincide la branch
          const statusCode = response.status;
          
          if(statusCode == 400)
          {
            this.changeStep(1);
            console.log("NO ES DE LA BRANCH SELECCIONADA");

          }
          else if(statusCode == 200)
          {
            let svgData = atob(this.qrCode);
          this.qrCodeBase64 = 'data:image/svg+xml;base64,' + btoa(svgData);
          console.log(this.qrCodeBase64);
          this.redirectToAnotherPage = true;
          this.startTimer();

          }
         
         
        });
      
        if(this.qrCode != 400 && this.qrCode != 500 && this.qrCode != '')
        {
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
        else
        {
          this.changeStep(1);
            console.log("NO ES DE LA BRANCH SELECCIONADA");

        }
     


    },




    handleStepChange(newValue) {

      // Verifica si se está pasando del paso 1 al paso 2
      if (newValue === 2) {
        // Llama a tu método aquí
        console.log("--------------Se ha pasado del paso 1 al paso 2");
        this.sendData();
      } // Verifica si se está pasando del paso 2 al paso 3
      if (newValue === 3) {
        // Llama a tu método aquí
        console.log("--------------Se ha pasado del paso 2 al paso 3 -divideInterval----------------------------");
        console.log(this.array_Places);
        //llamar a insertar los puestos seleccionado
        this.send();
        // :loading="loading" @click="GenerateQr()"
        this.GenerateQr();

      }


    },


    //servicios
    togglepuestoT(puestoTId) {
      this.array_Places.push(puestoTId);
      const index = this.selected.indexOf(puestoTId);
      console.log(this.selected);
      if (index > -1) {
        this.selected.splice(index, 1);
      } else {
        this.selected.push(puestoTId);
      }
    },
    mostrarPuestoT(value)//mando si es barbero o tecnico
    {
      if(value === 2)//barbero, muestro el seleccionar 1 solo
      {
        this.mostrarSheet = false;
        return true;
      }
      else if(value === 1)//tecnico, muestro el seleccionar 1 solo
      {
        false
        this.mostrarSheet = true;
      }

    },
    togglepuestoBarber(puestoTId) {
  // Limpiar la matriz de lugares seleccionados
  this.array_Places = [];

  // Agregar el puestoTId seleccionado
  this.array_Places.push(puestoTId);

  // Limpiar la matriz de elementos seleccionados
  this.selected = [];

  // Agregar el puestoTId seleccionado a la matriz de elementos seleccionados
  this.selected.push(puestoTId);
},
    isSelected(puestoTId) {
      return this.selected.includes(puestoTId);
    },

    //profesionales
    isProfessional(puestoTId2) {
      // Si barberAleatorie es true, devolver false
      if (this.barberAleatorie) {
        return false;
      }
      // Si no, realizar la lógica normal
      return this.professional.length === 1 && this.professional[0] === puestoTId2;
    },

    togglepuestoT2(puestoTId2) {
      //simulando q devuelve un tecnico puestoTId2= 1

      if (puestoTId2 === 1) {//es tecnico
        this.tipoProfessional = 'tecnico';
        this.chargepuestoTs();
      } else if (puestoTId2 === 2) {//es barbero
        this.tipoProfessional = 'barbero';
        this.chargepuestoTs();
      }
      else {
        //no es ninguno de los dos
        this.verificate = false;
        this.verificate_menssj = 'El correo no coincide con ningún profesional';
        this.clearTextClient();
        this.changeStep(1);
      }
    }


    ,
    //profesionales
    toggleTimer(hour) {
      const index = this.hourSelect.indexOf(hour);
      console.log(this.hourSelect);
      if (index > -1) {
        // Si el servicio ya está seleccionado, no hagas nada
        return;
      }


      // Limpiar la selección anterior y agregar el nuevo servicio seleccionado
      this.hourSelect = [hour];
      this.start_time1 = this.hourSelect;
    },
    /*  isProfessional(puestoTId2) {
          return this.professional.length === 1 && this.professional[0] === puestoTId2;
      },*/
    isTimer(hour) {
      return this.hourSelect.length === 1 && this.hourSelect[0] === hour;
    },

    chargepuestoTs() {

      let url = ``;
      if (this.tipoProfessional == 'tecnico') {
        url = `http://127.0.0.1:8000/api/branch_workplaces_select?branch_id=${this.branch_id}`;
      }
      else if (this.tipoProfessional == 'barbero') {
        url = `http://127.0.0.1:8000/api/branch_workplaces_busy?branch_id=${this.branch_id}`;
      }



      axios
        .get(url)
        .then((response) => {
          console.log(response.data)
          this.puestoTs = response.data.workplaces;


        })
        .catch((err) => {
          console.log(err, "error");

        });
    },

    chargeProfessionals(valuepuestoTs) {

      const newArraypuestoT = valuepuestoTs.map(item => parseInt(item)); // Convertir a enteros si es necesario
      console.log(newArraypuestoT);
      const data = {

        puestoTs: newArraypuestoT,
        branch_id: this.branch_id
        // branch_id: this.selected_branch.id
      };

      this.array_puestoTs = newArraypuestoT;
      axios
        .get(`http://127.0.0.1:8000/api/branch-professionals-puestoT`, {
          params: data
        })
        .then((response) => {
          this.professionals = response.data.professionals;
          console.log(response.data);

        })
        .catch((err) => {
          console.log(err, "error");
          /*  this.displayNotification(
              "error",
              "Error",
              "Error al obtener el calendario de la Sucursal"
            );*/
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

.app-container {
  background-color: rgb(241, 130, 84)
    /* Color de fondo deseado */
    /* Otros estilos si es necesario */
}
</style>