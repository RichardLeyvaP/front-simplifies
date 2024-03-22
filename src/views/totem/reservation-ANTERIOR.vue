<template >
    <div class="app-container">
    <v-container>
        <v-stepper prev-text="Anterior"  next-text="Siguiente"   bg-color="" v-model="step" :items="items" show-actions @update:model-value="handleStepChange">
           <!-- SERVICIOS -->
            <template v-slot:item.1>
                <h3 class="text-h6">Servicios</h3>

                <v-sheet border>
                    <v-list>
                        <v-list-item-group v-model="selected" multiple active-class="deep-purple--text text--accent-4">
                            <v-list-item :prepend-avatar="'https://api2.simplifies.cl/api/images/' + service.image_service"
                                v-for="service in services" :key="service.id" @click="toggleService(service.id)"
                                :class="{ 'selected-item': isSelected(service.id) }" class="pt-4 pb-4">

                                <v-list-item-content>
                                    <v-list-item-title class="text-h6">{{ service.name }}</v-list-item-title>
                                    <v-list-item-subtitle>Precio: ${{ service.price_service }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-sheet>
            </template>
            
            <!-- BARBEROS -->
            <template v-slot:item.2>
                <h3 class="text-h6">Barberos Disponibles</h3>

                <br>

                <v-sheet border>
                    <v-list>
                        <v-list-item-group v-model="professional" active-class="deep-purple--text text--accent-4">
                            <v-list-item  :prepend-avatar="'https://api2.simplifies.cl/api/images/professionals/barber-aleatore.png' "
                               
                                @click="toggleService2(-99)"
                                :class="{ 'selected-item': barberAleatorie }" class="pt-4 pb-4">
                                <v-list-item-content>
                                    <v-list-item-title class="text-h6">Barbero Aleatoriamente (Servicio inmediato)</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item :prepend-avatar="'https://api2.simplifies.cl/api/images/' + professional.image_url"
                                v-for="professional in professionals" :key="professional.id"
                                @click="toggleService2(professional.id)"
                                :class="{ 'selected-item': isProfessional(professional.id) }" class="pt-4 pb-4">

                                <v-list-item-content>
                                    <v-list-item-title class="text-h6">{{ professional.name + ' ' + professional.surname + '  '+professional.second_surname+ ' (Horario apróximado disponible '+ professional.start_time+')'}}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            
                            
                        </v-list-item-group>
                    </v-list>
                </v-sheet>
            </template>

           <!-- HORARIOS DISPONIBLES -->
            <template v-slot:item.3>
                <v-sheet border>
                <v-row>

                    <v-col cols="12" sm="8" v-if="intervals.length > 0">
                  <v-card elevation="4">


                    <h5 class="mt-5 pt-2 pl-3"> A continuación se muestran los horarios disponibles para hoy
                      {{ date }}</h5>


                    <v-card-text>
                      <v-chip-group v-model="selected_interval" active-class="orange lighten-2 white--text" column>
        <v-chip label v-for="inter in intervals" 
        @click="toggleTimer(inter.time_star)"
                                :class="{ 'selected-item': isTimer(inter.time_star) }"
        :key="inter.id" 
        :disabled="isIntervalDisabled(inter.time_star)">
          {{ inter.time_star }}
        </v-chip>
      </v-chip-group>
                    </v-card-text>

                  </v-card>
                </v-col>

                </v-row>

                
                   
                </v-sheet>
            </template>
 <!-- SELECCIONAR SI ES USUARIO O NO  -->
 <template v-slot:item.4>
                <h3 class="text-h6">Selecciones si es cliente de Simplifies</h3>

                <br>

                <v-sheet border>
                    <v-container fluid>
    <v-radio-group v-model="radios">
        





      <v-radio value="ClientSi">
        <template v-slot:label>
            <v-dialog max-width="500">
  <template  v-slot:activator="{ props: activatorProps }">
    <v-btn
      v-bind="activatorProps"
      color="#F18254"
      text="Si, soy cliente"
      variant="flat"
      @click="() => { SelectionRadio('ClientSi');isActive.value = false;  }"
    ></v-btn>
  </template>

  <template v-slot:default="{ isActive }">
    <v-card title="Datos de Cliente">
        <v-sheet class="mx-auto" width="300">
    <v-form @submit.prevent>
      <v-text-field v-model="email_client2"  label="Teléfono ó Correo Electrónico" outlined
         required></v-text-field>
      <v-btn class="mt-2" type="submit"   @click="() => { sendData(); isActive.value = false;  }" block>Aceptar</v-btn>
    </v-form>
  </v-sheet>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          text="Cancelar"
          @click="() => { this.radios = 'ClientNo'; isActive.value = false; }"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </template>
</v-dialog>
        </template>
      </v-radio>


      <br>

      
      <v-radio value="ClientNo">
        <template v-slot:label>
            <v-btn
      v-bind="activatorProps"
      color="#F18254"
      text="NO, es mi primera vez"
      variant="flat"
      @click="() => { SelectionRadio('ClientNo')  }"
    ></v-btn>
        </template>
      </v-radio>
    </v-radio-group>
  </v-container>
                </v-sheet>
            </template>

            
            
            
            <template v-slot:item.5>
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
>Reservar</v-btn>
</template>


</v-dialog>

</v-sheet>

            </template>
           
        </v-stepper>
        <br>
        <br>
        <v-row>  
          <v-spacer></v-spacer>        
        <v-btn to="totem" >Volver a inicio</v-btn>
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
        arrayEvents: null,
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
            'Horario Disponible',
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

    computed: {

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
        this.chargeCalendarsBranches();
        // this. chargeProfessionals();

        this.arrayEvents = [...Array(1)].map(() => {
            const day = Math.floor(Math.random() * 30)
            const d = new Date()
            d.setDate(day)


            return "2023-11-24"
        })
    },

    methods:
    {
        changeStep(index) {
      // Cambiar el valor de step al índice especificado
      this.step = index;
    },
        SelectionRadio(value)
        {
         this.radios = value;
         console.log(this.radios);
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
   
      // Realiza la solicitud POST Y BUSCO LOS DATOS DEL CLIENTE 
      axios.get(`https://api2.simplifies.cl/api/client-email-phone?email=${this.email_client2}`)
        .then(response => {
          // Maneja la respuesta de la solicitud aquí
        this.clientRegister = response.data.client;
        console.log('-------------------------------clientRegister----------------------------------------');
        console.log(this.clientRegister);
        

        const client = this.clientRegister[0];
        //ASIGNO A LOS CAMPOS DEL FORMULARIO TDS LOS DATOS
         this.name_client = client.name;
         this.phone_client = client.phone;
         this.surname_client = client.surname;
         this.second_surname = client.second_surname;
         this.email_client = client.email;
         
                this.verificate = true;
         this.changeStep(5);
         
       
              })
        .catch(error => {
          // Maneja cualquier error que pueda ocurrir durante la solicitud
          console.error('Error al hacer la solicitud:', error);
        });

    },
        send()
    {
      //this.totalTimeServices()
    console.log('**********************************--------------------');
    const newArrayService = this.array_services.map(item => parseInt(item)); 

    //FECHA DE HOY-------------
    let today = new Date();

// Obtener el año, mes y día por separado
let year = today.getFullYear();
let month = String(today.getMonth() + 1).padStart(2, '0'); // El mes se cuenta desde 0, así que agregamos 1
let day = String(today.getDate()).padStart(2, '0');
let formattedDate = `${year}-${month}-${day}`;
    //FECHA DE HOY-------------
   
    let hourString = this.hourSelect.toString();
      let request = {
        start_time:hourString,
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

      console.log('**********************************---------------------');

      // Realiza la solicitud GET con Axios y pasa los parámetros
      axios.post('https://api2.simplifies.cl/api/reservation_store',  request )
        .then(response => {
          // Maneja la respuesta de la solicitud aquí
        this.message=response.data.msg

        setTimeout(() => {
        // Redirige a la URL externa deseada
        window.location.href = 'https://barberiahernandez.com/barber_backend/web/app_dev.php/reservation';
      }, 3000); 
              })
        .catch(error => {
          // Maneja cualquier error que pueda ocurrir durante la solicitud
          console.error('Error al hacer la solicitud:', error);
        });



    },

        isIntervalDisabled(time) {
    // Aquí puedes agregar la lógica para desactivar ciertos horarios.
    // Por ejemplo, si deseas desactivar los horarios '10:00' y '11:00':
    return this.disabledIntervals.includes(time);
  },
        divideInterval() {
            this.countInterval = 0
            this.intervals = []
            this.getDayOfWeekOK()

          let cb = this.calendars_branches.find((c) => c.day == this.getDayOfWeekOK());


                 
         let day = (new Date().toISOString().substr(0, 10))  ; 

 
            // Convertir las horas a objetos Date para facilitar los cálculos
            const inicio = new Date(`${day}T${cb.start_time}`);
            const fin = new Date(`${day}T${cb.closing_time}`);

            console.log('este es  inicio')   ;  

            console.log( inicio)   ;      
            console.log( fin)   ;

 
            // Array para almacenar los intervals de tiempo

            this.timeReservated();
            console.log(this.reservedTime);

            // Bucle para generar intervals de media hora
            let actual = new Date(inicio);
            
            

           

            while (actual < fin) {
                // Obtener la hora y minutos actuales
                const horaActual = actual.getHours();
                const minutosActual = actual.getMinutes();
                console.log('****************actual*******************');
            console.log(horaActual);
            console.log(minutosActual);

                
                // Calcular el próximo intervalo de media hora
                const proximo = new Date(actual);
                proximo.setMinutes(minutosActual + 15);

                // Formatear las horas y minutos en formato HH:MM
                const horaInicioFormato = `${String(horaActual).padStart(2, '0')}:${String(
                    minutosActual
                ).padStart(2, '0')}`;

                const horaFinFormato = `${String(proximo.getHours()).padStart(2, '0')}:${String(
                    proximo.getMinutes()
                ).padStart(2, '0')}`;
                //optener los horarios reservados
                const isIntervalReserved = this.reservedTime.some((reservation) => {
                    const reservationStart = new Date(`${this.date}T${reservation.start_time}`);
                    const reservationEnd = new Date(`${this.date}T${reservation.end_time}`);
                    return actual >= reservationStart && actual < reservationEnd;
                });


                console.log(actual);
                // Almacenar el intervalo en el array
                this.countInterval++
                this.intervals.push({
                    time_star: horaInicioFormato,
                    time_final: horaFinFormato,
                    disable: isIntervalReserved,
                    id: this.countInterval
                });

                // Establecer el siguiente intervalo
                actual = proximo;
                
            }
            

            console.log('sssssssssssssss' + this.intervals);
        },
        
    timeReservated() {
        
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
  .get('https://api2.simplifies.cl/api/professional-reservations-time' , {
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
  });
},
        getDayOfWeekOK() {
  var Xmas95 = new Date();
  console.log('Este es new Date '+Xmas95);
  var weekday = Xmas95.getDay();
  var day = this.dayOfWeek.find((item) => item.id == weekday);
  console.log("esto devuelve el metodo");
  console.log(day ? day.day.toString().trim() : "");
  return day ? day.day.toString().trim() : "";
},
        chargeCalendarsBranches() {
            axios
                .get(`https://api2.simplifies.cl/api/schedule-show?branch_id=${this.branch_id}`)
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
                });
        },
        handleStepChange(newValue) {

            // Verifica si se está pasando del paso 1 al paso 2
            if (newValue === 2) {
                // Llama a tu método aquí
                console.log("--------------Se ha pasado del paso 1 al paso 2");
                console.log('---------' + this.selected);
                this.chargeProfessionals(this.selected);
            } // Verifica si se está pasando del paso 1 al paso 2
            if (newValue === 3) {
                // Llama a tu método aquí
                console.log("--------------Se ha pasado del paso 2 al paso 3 -divideInterval");

                this.divideInterval();
            }
            if (newValue === 4) {
                // Llama a tu método aquí
                console.log("--------------Se ha pasado del paso 3 al paso 4 -RECIVIENDO LA HORA");

                  //aqui verificar si dijo que no es cliente
                  if(this.radios === 'ClientNo')
                {
                    this.clearTextClient();
                    this.verificate = false;
                }

                
                
                console.log(this.hourSelect);
            }
            
            if (newValue === 5) {
                // Llama a tu método aquí
                console.log("--------------Se ha pasado del paso 4 al paso 4 -RECIVIENDO LA SELECCION DEL RADIO");

                console.log(this.radios);
                if(this.radios === 'ClientSi')
                {
                    // le muestro un dialogo para que ponga correo y teefono
                    //hago la busqueda en la dd si esta le llevo tds los datos al formulario y le enavilito los campos que no pueda editarlos
                    //solo le quedaria reservar
                }
                else{
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
    if (serviceId2 === -99) {
        this.barberAleatorie = true;
        // Limpiar la selección cuando barberAleatorie es true
        this.professional = [];
    } else {
        this.barberAleatorie = false;
        const index = this.professional.indexOf(serviceId2);
        console.log(this.professional);
        if (index > -1) {
            // Si el servicio ya está seleccionado, no hagas nada
            return;
        }

        // Limpiar la selección anterior y agregar el nuevo servicio seleccionado
        this.professional = [serviceId2];
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
      /*  isProfessional(serviceId2) {
            return this.professional.length === 1 && this.professional[0] === serviceId2;
        },*/
        isTimer(hour) {
            return this.hourSelect.length === 1 && this.hourSelect[0] === hour;
        },

        chargeServices() {
            axios
                .get(`https://api2.simplifies.cl/api/branchservice-show?branch_id=${this.branch_id}`)
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
        .get(`https://api2.simplifies.cl/api/branch-professionals-service`, {
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
    background-color: rgb(241, 130, 84)/* Color de fondo deseado */
  /* Otros estilos si es necesario */
}
</style>