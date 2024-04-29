<!-- eslint-disable vue/valid-v-slot -->
<template >
   <v-snackbar class="mt-12" location="right top" :timeout="sb_timeout" :color="sb_type" elevation="24" :multi-line="true"
        vertical v-model="snackbar">
        <v-row>
          <v-col md="2">
            <v-avatar :icon="sb_icon" color="sb_type" size="40"></v-avatar>
          </v-col>
          <v-col md="10">
            <h4>{{ sb_title }}</h4>
            {{ sb_message }}
    
          </v-col>
    
        </v-row>
      </v-snackbar>
  <div>
  <v-container>
      <v-stepper elevation="6"   bg-color="" v-model="step" :items="items" hide-actions @update:model-value="handleStepChange">
       
        <!-- SERVICIOS -->
          <template v-slot:item.1>
           <v-container>
            <v-row class="d-flex align-center justify-space-between">
<h3 class="text-h6">Servicios </h3>
<h3 class="text-h6">Total: ${{ sumSelectedPrices() }} </h3> 
</v-row>

           </v-container>
       


              <v-sheet border>
                 
                
                <v-list>
<v-list-item-group v-model="selected" multiple active-class="deep-purple--text text--accent-4">
  <v-list-item :prepend-avatar="'http://127.0.0.1:8000/api/images/' + service.image_service"
    v-for="service in services" :key="service.id" @click="toggleService(service.id)"
    :class="{ 'selected-item': isSelected(service.id) }" class="pt-4 pb-4">

    <v-list-item-content class="d-flex align-center justify-space-between">
      <div class="text-h6">{{ service.name }}</div>
      <v-btn :color="!isSelected(service.id) ? 'amber-darken-1' : ''" :dark="isSelected(service.id)">
        ${{ service.price_service }}
      </v-btn>
    </v-list-item-content>

  </v-list-item>
</v-list-item-group>
</v-list>



              </v-sheet>
              <v-container>
                <!-- BOTONES -->
            <v-row class="mt-1">
              <v-spacer></v-spacer>
              <v-btn size="x-large" :disabled="advanceReserva1" @click="nextStep">Siguiente</v-btn>             
            </v-row>
            
          </v-container>

          </template>
          
          <!-- BARBEROS -->
          <template v-slot:item.2>
           <v-container>
            <v-row class="d-flex align-center justify-space-between">
  <h3 class="text-h6">Barberos Disponibles</h3>
  <v-list-item elevation="4" 
               @click="toggleService2(-99)"
               :class="{ 'selected-item': this.barberAleatorie }"
               class="pt-4 pb-4">
    <v-list-item-content>
      <v-list-item-title  class="text-h6">Aleatorio </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</v-row>

           </v-container>
           


              <br>

              <v-sheet border>
                  <v-list>
                   
                      <v-list-item-group v-model="professional" active-class="deep-purple--text text--accent-4">
                         
                          <v-list-item :prepend-avatar="'http://127.0.0.1:8000/api/images/' + professional.image_url"
                              v-for="professional in professionals" :key="professional.id"
                              @click="toggleService2(professional)"
                              :class="{ 'selected-item': isProfessional(professional.id) }" class="pt-4 pb-4">

                             
                              <v-list-item-content class="d-flex align-center justify-space-between">
      <div class="text-h6">{{ professional.name + ' ' + professional.surname + '  '+professional.second_surname}}</div>
      <v-btn :color="!isProfessional(professional.id) ? 'amber-darken-1' : ''" :dark="isProfessional(professional.id)">
        {{ 'Disponible aprox: '+ professional.start_time }}
      </v-btn>
    </v-list-item-content>
                          </v-list-item>
                          
                          
                          
                      </v-list-item-group>
                  </v-list>
              </v-sheet>
              <v-container>
            <v-row class="mt-1">
             
              <v-btn size="x-large" @click="prevStep">Volver</v-btn>
              <v-spacer></v-spacer>
              <v-btn size="x-large" :disabled="advanceReserva2" @click="nextStep">Siguiente</v-btn>
           
            </v-row>
          </v-container>
          </template>

       

          <template v-slot:item.3>
<h3 class="text-h6">Opciones disponibles</h3>
<v-sheet border>
  <v-list>
    <v-list-item-group v-model="selectedItem" active-class="deep-purple--text text--accent-4">
      <v-list-item :class="{ 'selected-item': selectedItem === 'option1' }"  @click="() => { SelectionRadio('ClientSi'); selectedItem = 'option1' }">
        <v-list-item-content>
          <v-list-item-title class="text-h6">Soy Cliente</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item :class="{ 'selected-item': selectedItem === 'option2' }" @click="selectedItem = 'option2'">
        <v-list-item-content>
          <v-list-item-title class="text-h6">Es mi primera vez</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
  <v-dialog v-model="showDialog" max-width="400px">
    <v-card title="Datos de Cliente">
<v-sheet class="mx-auto" width="300">
  <v-form @submit.prevent>
    <v-text-field v-model="email_client2" label="Teléfono ó Correo Electrónico" outlined required></v-text-field>
    <v-btn size="x-large" color="orange lighten-2" class="mt-2" type="submit"   @click="() => { sendData(); isActive.value = false;  }" block>Aceptar</v-btn>
    
  </v-form>
</v-sheet>

<v-card-actions>
  <v-spacer></v-spacer>
  <!-- Establece isActive como false al hacer clic en Cancelar -->
  <v-btn size="x-large"
        text="Cancelar"
        @click="() => {this.selectedItem = 'option2'; this.radios = 'ClientNo'; showDialog = false; }"
      ></v-btn>

</v-card-actions>
</v-card>
  </v-dialog>
</v-sheet>



<v-container>
  <v-row class="mt-1">
    <v-btn size="x-large" @click="prevStep">Volver</v-btn>
    <v-spacer></v-spacer>
    <v-btn size="x-large" :disabled="advanceReserva2" @click="nextStep">Siguiente</v-btn>
  </v-row>
</v-container>


</template>

          
          
          <template v-slot:item.4>
               <v-sheet border>       
   <v-form ref="form" lazy-validation>
     <v-row>
     <v-col cols="12" md="4" class="mt-2">
     <v-text-field :disabled="verificate" v-model="name_client" :counter="50" :rules="nameRules" label="Nombre" outlined
       required></v-text-field>
     </v-col>

     <v-col cols="12" md="4" class="mt-2">
     <v-text-field :disabled="verificate" v-model="surname_client" :counter="50" :rules="surname_client_Rules" label="Apellido Paterno" outlined
       required></v-text-field>
     </v-col>

     <v-col cols="12" md="4" class="mt-2">
     <v-text-field :disabled="verificate" v-model="second_surname" :counter="50" :rules="second_surname_Rules" label="Apellido Materno" outlined
       required></v-text-field>
     </v-col>

     <v-col cols="12" md="6" class="mt-2">
     <v-text-field :disabled="verificate" v-model="phone_client" :rules="phoneRules" label="Teléfono" outlined required></v-text-field>
   </v-col>

   <v-col cols="12" md="6" class="mt-2">
     <v-text-field :disabled="verificate" v-model="email_client" :rules="emailRules" label="Correo Electrónico" outlined
       required></v-text-field>
     </v-col>
     <!-- <v-col cols="12" md="6" >
     <v-checkbox v-model="checkbox" color="orange lighten-2"
       :rules="[v => !!v || 'You must agree to continue!']" label="Términos y condiciones"
       required></v-checkbox>
     </v-col> -->
     </v-row>

   </v-form>




<v-divider class="pt-4 mt-4"></v-divider>


</v-sheet>
<v-container>
            <v-row class="mt-1">
             
              <v-btn size="x-large" @click="prevStep">Volver</v-btn>
              <v-spacer></v-spacer>
              <v-dialog
transition="dialog-bottom-transition"
max-width="600"
>
<template v-slot:activator="{ on, attrs }">
<v-btn
color="orange lighten-2"
v-bind="attrs"
v-on="on"
@click="send()"
:loading="loading"
size="x-large"
>Reservar</v-btn>
</template>

</v-dialog>

           
            </v-row>
          </v-container>

          </template>
         
      </v-stepper>
      <br>
      <br>
      <v-row>  
        <v-spacer></v-spacer>        
      <v-btn size="x-large" to="totem" >Volver a inicio</v-btn>
      <v-spacer></v-spacer>  
      </v-row>
  </v-container>
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
    snackbar: false,
  sb_type: '',
  sb_message: '',
  sb_timeout: 2000,
  sb_title:'',
  sb_icon:'',
    loading : false,
    horarioDisponibleActual:'',
    idProfesionalListo:'',
    showDialog: false,
    selectedItem: null,
    redirectToAnotherPage: false,
    timerId1 : null,
    timerId2 : null,
    timerId3 : null,
    timerId4 : null,
    timer: null,

    professionalHorario:'',
    
      barberAleatorie:false,
      verificate : false,
      clientRegister:[],
      radios: 'ClientNo',
      message:"Los datos para realizar la reserva están completos. Se enviará correo electrónico con los datos de la reserva",
  checkbox:false,
  name_client:"",
  email_client:"",
  email_client2:"",
  phone_client:"",
  selected_interval:"",
  surname_client:"",
  second_surname:"",    
  dayOK: "",
  selected_professional: "",
  date: "",
  focus: '',
  start_time1: '',
  array_services:[],

  nameRules: [
      v => !!v || 'El nombre es requerido',
      v => (v && v.length <= 50) || 'El nombre no debe exceder de 50 caracteres',
    ],

    surname_client_Rules: [
      v => !!v || 'El Apellido Paterno es requerido',
      v => (v && v.length <= 50) || 'El Apellido Paterno no debe exceder de 50 caracteres',
    ],

    second_surname_Rules: [
      v => !!v || 'El Apellido Materno es requerido',
      v => (v && v.length <= 50) || 'El Apellido Materno no debe exceder de 50 caracteres',
    ],
  
    emailRules: [
      v => !!v || 'El Correo es requerido',
      v => /.+@.+\..+/.test(v) || 'Correo electrónico no válido',
    ],

    phoneRules: [
      v => !!v || 'El Teléfono es requerido',
   
    ],

















      disabledIntervals: [],
      intervals: [],
      countInterval: 0,
      reservedTime: [],
      calendars_branches: [],
      //arrayEvents: null,
      selected_services: [],
      services: [],
      professionals: [],
      hourSelect: [],
      selected: [],
      professional: [],
      branch_id: '',
      //
      //
      //
      //
      dayOfWeek: [],
      shipping: 0,
      step: 1,
      items: [
          'Servicios',
          'Profesionales',
          'Seleccione si es Cliente',
          'Datos Personales',
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
  watch: {
  showDialog(newValue, oldValue) {
    // Ejecutar código en respuesta al cambio en showDialog
    if (!newValue && oldValue) {
      // El modal se ha cerrado
      console.log('El modal se ha cerrado');
      this.selectedItem = 'option2';
      // Realizar cualquier otra acción necesaria
    }
  }}
,

  computed: {
    advanceReserva1() {
    console.log()
    return !this.selected.length > 0; // Verdadero si hay elementos, falso si está vacío
  },
    advanceReserva2() {
    console.log()
    return this.professional.length === 0 && !this.barberAleatorie; // Verdadero si hay elementos, falso si está vacío
  },

      subtotal() {
          return this.products.reduce((acc, product) => acc + product.quantity * product.price, 0)
      },
      total() {
          return this.subtotal + Number(this.shipping ?? 0)
      },
  },
  mounted() {
   
    //this.business_id = LocalStorageService.getItem('business_id');
  //this.charge_id = LocalStorageService.getItem('charge_id');
this.branch_id = LocalStorageService.getItem('branch_id');
console.log(this.branch_id);
      this.chargeServices();
      //this.chargeCalendarsBranches();
      // this. chargeProfessionals();

      /*this.arrayEvents = [...Array(1)].map(() => {
          const day = Math.floor(Math.random() * 30)
          const d = new Date()
          d.setDate(day)


          return "2023-11-24"
      })*/
  },


  methods:
  {
    showAlert(sb_type,sb_message, sb_timeout)
  {    
   this.sb_type= sb_type
  
   if(sb_type=="success")
   {
     this.sb_title='Éxito'
     this.sb_icon='mdi-check-circle'
   }
   
   if(sb_type=="error")
   {
     this.sb_title='Error'
     this.sb_icon='mdi-check-circle'
   }
  
   if(sb_type=="warning")
   {
     this.sb_title='Advertencia'
     this.sb_icon='mdi-alert-circle'
   }
   this.sb_message= sb_message
   this.sb_timeout= sb_timeout
   this.snackbar= true
  },
    sumSelectedPrices() {
  let total = 0;
  for (const service of this.services) {
    if (this.isSelected(service.id)) {
      total += parseFloat(service.price_service);
    }
  }
  return total;
},

// handleStepChange(step) {
//   this.step = step;
 
// },
//     changeStep(index) {
 
//   this.step = index;
// },



      changeStep(index) {
    // Cambiar el valor de step al índice especificado
    this.step = index;
  },
      SelectionRadio(value)
      {
       this.radios = value;
       console.log(this.radios);
       if( value === 'ClientSi')
       {
        this.showDialog = true; 
       }
       
      },
      clearTextClient()
      {
          this.name_client = '';
       this.phone_client = '';
       this.surname_client = '';
       this.second_surname = '';
       this.email_client = '';

      },
      sendData()
  {
    console.log('-------------------------------sendData()----------------------------------------');
    console.log(this.email_client2);
    

    // Realiza la solicitud POST Y BUSCO LOS DATOS DEL CLIENTE 
    axios.get(`http://127.0.0.1:8000/api/client-email-phone?email=${this.email_client2}`)
      .then(response => {
        // Maneja la respuesta de la solicitud aquí
      this.clientRegister = response.data.client;
      console.log('-------------------------------clientRegister----------------------------------------');
      console.log('this.clientRegister.length');
      console.log(this.clientRegister.length);
      if(this.clientRegister.length > 0)
      {
        const client = this.clientRegister[0];
      console.log(this.clientRegister[0]);
      //ASIGNO A LOS CAMPOS DEL FORMULARIO TDS LOS DATOS
       this.name_client = client.name;
       this.phone_client = client.phone;
       this.surname_client = client.surname;
       this.second_surname = client.second_surname;
       this.email_client = client.email;
       this.showDialog = false;
              this.verificate = true;
       this.changeStep(4);

      }
      else
      {
        this.selectedItem = 'option2';
        this.showDialog = false;
        this.radios = 'ClientNo';
        this.verificate = false;
       this.changeStep(3);
      }
      
      


      
       
     
            })
      .catch(error => {
        // Maneja cualquier error que pueda ocurrir durante la solicitud
        console.error('Error al hacer la solicitud:', error);
      });

  },
      send()
  {
    this.loading = true;
 
  console.log('***************console.log(this.professionalHorario[0]);*******************');
  console.log(this.horarioDisponibleActual);
  console.log('***************console.log(this.idProfesionalListo);*******************');
  console.log(this.idProfesionalListo);
  const newArrayService = this.array_services.map(item => parseInt(item)); 

  //FECHA DE HOY-------------
  let today = new Date();

// Obtener el año, mes y día por separado
let year = today.getFullYear();
let month = String(today.getMonth() + 1).padStart(2, '0'); // El mes se cuenta desde 0, así que agregamos 1
let day = String(today.getDate()).padStart(2, '0');
let formattedDate = `${year}-${month}-${day}`;

let request = {};



  //FECHA DE HOY-------------
  if(this.barberAleatorie === true)
  {
  
     request = {
      start_time:this.horarioDisponibleActual,//aqui va el menor horario
      data: formattedDate,
      branch_id: this.branch_id,
      professional_id: this.idProfesionalListo,//id del que tiene el menor horario
      email_client: this.email_client,
      phone_client: this.phone_client,
      name_client: this.name_client,
      surname_client:this.surname_client,
      second_surname:this.second_surname,
      select_professional: 0,
      services: newArrayService,      
    }

  }
  else{
     // let hourString = this.hourSelect.toString();
      request = {
      start_time:this.professionalHorario[0],
      data: formattedDate,
      branch_id: this.branch_id,
      professional_id: this.professional[0],
      email_client: this.email_client,
      phone_client: this.phone_client,
      name_client: this.name_client,
      surname_client:this.surname_client,
      second_surname:this.second_surname,
      services: newArrayService,      
    }

  }

    console.log('**********************************---------------------');

    // Realiza la solicitud GET con Axios y pasa los parámetros
    axios.post('http://127.0.0.1:8000/api/reservation_store',  request )
      .then(response => {
        // Maneja la respuesta de la solicitud aquí
      this.message=response.data.msg
      this.loading = false;
      // setTimeout(() => {
      // Redirige a la URL externa deseada
    //   window.location.href = 'https://barberiahernandez.com/barber_backend/web/app_dev.php/reservation';
    // }, 3000);
    
    this.showAlert("success","Reserva realizada correctamente", 3000);  
    setTimeout(() => {
      // Redirige a la URL externa deseada
      this.$router.push('/totem');
    }, 2000); 
            })
      .catch(error => {
        this.loading = false;
        // Maneja cualquier error que pueda ocurrir durante la solicitud
        this.$router.push('/totem');
      });



  },

      isIntervalDisabled(time) {
  // Aquí puedes agregar la lógica para desactivar ciertos horarios.
  // Por ejemplo, si deseas desactivar los horarios '10:00' y '11:00':
  return this.disabledIntervals.includes(time);
},
     
     
      
  /*timeReservated() {
      
console.log('****************************this.professional[0]*************');
console.log(this.professional[0]);

let currentDate = new Date();
let formattedDate = currentDate.toISOString().split('T')[0];

let request = {
professional_id: this.professional[0],
branch_id: this.branch_id,
data: formattedDate

}


axios
.get('http://127.0.0.1:8000/api/professional-reservations-time' , {
          params: request
      })
      .then((response) => {
  this.reservedTime = response.data.reservations;
  this.disabledIntervals = response.data.reservations;
  console.log('---------------response.data.reservations-------------------');
  console.log(response.data.reservations);
  console.log('---------------response.data.reservations-------------------');

})
.catch((err) => {
  console.log(err, "error");
  /*  this.displayNotification(
      "error",
      "Error",
      "Error al obtener el calendario de la Sucursal"
    );*/
/*});
},*/
      /*getDayOfWeekOK() {
var Xmas95 = new Date();
console.log('Este es new Date '+Xmas95);
var weekday = Xmas95.getDay();
var day = this.dayOfWeek.find((item) => item.id == weekday);
console.log("esto devuelve el metodo");
console.log(day ? day.day.toString().trim() : "");
return day ? day.day.toString().trim() : "";
},*/
      /*chargeCalendarsBranches() {
          axios
              .get(`http://127.0.0.1:8000/api/schedule-show?branch_id=${this.branch_id}`)
              .then((response) => {
                  this.calendars_branches = response.data.Schedules;
                  this.dayOfWeek = response.data.Schedules;
              })
              .catch((err) => {
                  console.log(err, "error");
                  /*  this.displayNotification(
                      "error",
                      "Error",
                      "Error al obtener el calendario de la Sucursal"
                    );*/
             /*});
      },*/

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
if(this.step === 3)
{
  this.selectedItem = 'option2';
  this.clearTextClient();
  this.verificate = false;
}
},
   
      verificateStep(newValue) {
    // Cancelar el temporizador si el usuario cambia de pestaña antes de que se ejecute
    
  
    if (newValue === 2) {
      //cancelo los demas timer
     
      console.log("--------------Se ha pasado del paso 1 al paso 2");
      console.log('---------' + this.selected);
      this.chargeProfessionals(this.selected);
    }

    if (newValue === 3) {
      this.selectedItem = 'option2';
      console.log("--------------Se ha pasado del paso 3 al paso 4 -RECIVIENDO LA HORA");
      if(this.radios === 'ClientNo') {
        this.clearTextClient();
        this.verificate = false;
      }
      console.log(this.hourSelect);
    }

    if (newValue === 4) {
//          //cancelo los demas timer
//          clearTimeout(this.timerId1);
//         clearTimeout(this.timerId2);
//         clearTimeout(this.timerId3);

//         this.timerId4 = setTimeout(() => {
//     this.$router.push('/totem');
// }, 20000);
      console.log("--------------Se ha pasado del paso 4 al paso 4 -RECIVIENDO LA SELECCION DEL RADIO");
      console.log(this.radios);
      if(this.radios === 'ClientSi') {
        // le muestro un dialogo para que ponga correo y teefono
        //hago la busqueda en la dd si esta le llevo tds los datos al formulario y le enavilito los campos que no pueda editarlos
        //solo le quedaria reservar
      } else {
        // normal que pase a llenar todos los datos
        this.clearTextClient();
        this.verificate = false;
      }
    }

   
   
    },


      //servicios
      toggleService(serviceId) {
          const index = this.selected.indexOf(serviceId);
          console.log(this.selected);
          if (index > -1) {
              this.selected.splice(index, 1);
          } else {
              this.selected.push(serviceId);
          }
      },
      isSelected(serviceId) {
          return this.selected.includes(serviceId);
      },

      //profesionales
      isProfessional(serviceId2) {
  // Si barberAleatorie es true, devolver false
  if (this.barberAleatorie) {
      return false;
  }
  // Si no, realizar la lógica normal
  return this.professional.length === 1 && this.professional[0] === serviceId2;
},

toggleService2(serviceId2) {
//console.log(this.serviceId2.id);

  if (serviceId2 === -99) {
      this.barberAleatorie = true;
      // Limpiar la selección cuando barberAleatorie es true
      this.professional = [];
  } else {
      this.barberAleatorie = false;
      const index = this.professional.indexOf(serviceId2.id);
      console.log(this.professional);
      if (index > -1) {
          // Si el servicio ya está seleccionado, no hagas nada
          return;
      }

      // Limpiar la selección anterior y agregar el nuevo servicio seleccionado
      this.professional = [serviceId2.id];
      this.professionalHorario = [serviceId2.start_time];
  }
  console.log(this.barberAleatorie);
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
    /*  isProfessional(serviceId2) {
          return this.professional.length === 1 && this.professional[0] === serviceId2;
      },*/
      isTimer(hour) {
          return this.hourSelect.length === 1 && this.hourSelect[0] === hour;
      },

      chargeServices() {
          axios
              .get(`http://127.0.0.1:8000/api/branchservice-show?branch_id=${this.branch_id}`)
              .then((response) => {
                  console.log(response.data)
                  this.services = response.data.services;


              })
              .catch((err) => {
                  console.log(err, "error");

              });
      },

      chargeProfessionals(valueServices) {
          
const newArrayService = valueServices.map(item => parseInt(item)); // Convertir a enteros si es necesario
console.log(newArrayService);
    const data = {
      
              services: newArrayService,
               branch_id: this.branch_id
              // branch_id: this.selected_branch.id
          };

          this.array_services = newArrayService;
          axios
      .get(`http://127.0.0.1:8000/api/branch-professionals-service`, {
          params: data
      })
      .then((response) => {
                  this.professionals = response.data.professionals;
                  console.log('this.professionals------');
                  console.log(this.professionals);
                  // Obtener la menor hora disponible
//  this.horarioDisponibleActual = this.professionals
       // Filtrar profesionales con horarios disponibles y obtener la menor hora
  const horariosDisponibles = this.professionals
    .filter(professional => professional.start_time !== "No tiene horario disponible")
    .map(professional => professional.start_time);

  // Verificar si hay algún horario disponible
  if (horariosDisponibles.length > 0) {
    // Obtener la menor hora disponible
    this.horarioDisponibleActual = horariosDisponibles.reduce((minHora, hora) => (hora < minHora ? hora : minHora));
  } else {
    // No hay horarios disponibles, establecer horarioDisponibleActual como null u otro valor predeterminado según tus necesidades
    this.horarioDisponibleActual = null; // o cualquier otro valor predeterminado
  }

  const professionalListo = this.professionals
.filter(professional => professional.start_time === this.horarioDisponibleActual)
.map(professional => professional.id);

// Verificar si se encontró algún profesional con la hora disponible actual
if (professionalListo.length > 0) {
// Obtener el primer ID encontrado
 this.idProfesionalListo = professionalListo[0];
// Hacer lo que necesites con el ID del profesional listo
} else {
this.idProfesionalListo = '';
// No se encontró ningún profesional con la hora disponible actual
// Aquí puedes manejar este caso según tus necesidades
}
if(this.horarioDisponibleActual === null && this.idProfesionalListo === '')
{
console.log('NO HAY DISPONIBILIDAD');
this.showAlert("warning","No hay profesional con horario disponible", 3000);
this.changeStep(1);
}
                    
                  console.log(response.data);
                  console.log('this.horarioDisponibleActual');
                  console.log(this.horarioDisponibleActual);

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

</style>