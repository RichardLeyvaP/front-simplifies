<template>
     <v-snackbar class="mt-12" location="right top" :timeout="sb_timeout" :color="sb_type"
     elevation="24"  :multi-line="true"  vertical v-model="snackbar">
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
    <v-container>
    <v-snackbar class="mt-12" location="right top" :timeout="sb_timeout" :color="sb_type"
     elevation="24"  :multi-line="true"  vertical v-model="snackbar">
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
<v-card elevation="6" class="mx-5">
 <v-toolbar color="#F18254">
   <v-row align="center">
     <v-col cols="12" md="4" class="grow ml-4">
       <span class="text-subtitle-1"> <strong>Asignar Servicios a Profesionales</strong></span>
     </v-col>
      <v-col cols="12" md="5" class="mr-12"></v-col>
     <v-col cols="12" md="2">
       

     </v-col>

   </v-row>

 </v-toolbar>


 <v-card-text>  
    <v-row>
    <v-container>
          <v-col cols="12" sm="12" md="6">
            <v-autocomplete v-model="branch_id" :items="branches" v-if="this.mostrarFila" clearable label="Seleccione una Sucursal"
              prepend-icon="mdi-store" item-title="name" item-value="id" variant="underlined"
              @update:model-value="initialize()"></v-autocomplete>
          </v-col>
          
    </v-container>
      </v-row>
      <v-container>
    <v-row>
        <v-col cols="12" md="5">

            <v-card>
              <v-toolbar color="#F18254">
      
      <v-toolbar-title>Lista de Trabajadores</v-toolbar-title>

      <v-spacer></v-spacer>

    </v-toolbar>
                    <v-list>
                        <v-list-item-group v-model="professional" active-class="deep-purple--text text--accent-4">

                            <v-list-item :prepend-avatar="'http://127.0.0.1:8000/api/images/' + professional.image_url"
                                v-for="professional in professionals" :key="professional.id"
                                @click="toggleService2(professional.id)"
                                :class="{ 'selected-item': isProfessional(professional.id) }" class="pt-4 pb-4">

                                <v-list-item-content>
                                    <v-list-item-title class="text-h6">{{ professional.name + ' ' + professional.surname + '  '+professional.second_surname }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            
                            
                        </v-list-item-group>
                    </v-list>
                </v-card>
        </v-col>

        <v-col cols="12" md="7">
  <v-card >
    <v-tabs
      v-model="tabBar"
      bg-color="rgb(241, 130, 84)"
    >
      <v-tab  value="one">Lista de Servicios</v-tab>
      <v-tab value="two">Servicios Asignados</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tabBar">
        <v-window-item value="one">
           
           
            <!-- SERVICIOS DISPONIBLES -->
           
                    <v-list lines="three"
      item-props>
                        <v-list-item-group v-model="selectedA" active-class="deep-purple--text text--accent-4">
                            <v-list-item :prepend-avatar="'http://127.0.0.1:8000/api/images/' + service.image_service"
                                v-for="service in services" :key="service.id" @click="toggleService3(service)"
                                :class="{ 'selected-item': isSelected(service.id) }" class="pt-4 pb-4">

                                <v-list-item-content>
                                    <v-list-item-title class="text-h6">{{ service.name }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                    <v-col cols="12" md="6">
        </v-col>
        <v-col cols="12" md="6">            
            <v-text-field v-model="profitPercen" :disabled="showPercent" clearable label="% Ganancia"
                        prepend-icon="mdi-percent" variant="underlined" :rules="requiredRules">
                      </v-text-field>
        </v-col>
        <v-divider></v-divider>
                    
                    <v-card-actions>   
                      <v-spacer></v-spacer> 
                      <v-btn color="#F18254"  variant="flat"  @click="asignService" >
             Asignar
           </v-btn>
  </v-card-actions>
        

                
        
        </v-window-item>

<!--          
        SERVICIOS ASIGNADOS -->
        <v-window-item value="two">
          <v-list lines="three"
      item-props>
                        <v-list-item-group v-model="selected" active-class="deep-purple--text text--accent-4">
                            <v-list-item :prepend-avatar="'http://127.0.0.1:8000/api/images/' + serviceA.image_service"
                                v-for="serviceA in servicesAsig" :key="serviceA.id" @click="toggleService3(serviceA)"
                                :class="{ 'selected-item': isSelected(serviceA.id) }" class="pt-4 pb-4">

                                <v-list-item-content>
                                    <v-list-item-title class="text-h6">{{ serviceA.name }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-divider></v-divider>
                        </v-list-item-group>
                    </v-list>
                    <v-divider></v-divider>
                    
                    <v-card-actions>   
                      <v-spacer></v-spacer> 
                      <v-btn color="#F18254"  variant="flat"  @click="desasignService" >
             Eliminar
           </v-btn>
  </v-card-actions>
        </v-window-item>

      </v-window>
    </v-card-text>
  </v-card>
</v-col>

        
      
    </v-row>  
</v-container>               
                
                
 </v-card-text>
</v-card>

    </v-container>
    
</template>

<script>
import axios from "axios";
import LocalStorageService from "@/LocalStorageService";

export default {
    data: () => ({
      tabBar: null,
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
    selectedServiceType:[],
    profitPercentaje:[],
    showPercent:false,
    profitPercen:'',
    mostrarFila: false,
    branch_id: '',
    charge_id: '',
    business_id: '',
    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title:'',
    sb_icon:'',


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
      requiredRules: [
      (v) => !!v || "El campo es requerido",
    ],
        disabledIntervals: [],
        intervals: [],
        countInterval: 0,
        reservedTime: [],
        calendars_branches: [],
        arrayEvents: null,
        selected_services: [],
        services: [],
        servicesAsig: [],
        professionals: [],
        hourSelect: [],
        selected: [],
        selectedA: [],
        professional: [],
        branches: [],
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
            /*'Horario Disponible',
            'Seleccione si es Cliente',
            'Datos Personales',*/
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
        this.business_id = LocalStorageService.getItem('business_id');
    this.charge_id = LocalStorageService.getItem('charge_id');
  this.branch_id = LocalStorageService.getItem('branch_id') ? 1 : LocalStorageService.getItem('branch_id');
  if (this.charge_id === '4') {
      // Mostrar la fila con Autocomplete
      this.mostrarFila = true;
    }
        this.initialize();

        this.arrayEvents = [...Array(1)].map(() => {
            const day = Math.floor(Math.random() * 30)
            const d = new Date()
            d.setDate(day)


            return "2023-11-24"
        })
    },

    methods:
    {
      showAlert(sb_type, sb_message, sb_timeout) {
      this.sb_type = sb_type

      if (sb_type == "success") {
        this.sb_title = 'Éxito'
        this.sb_icon = 'mdi-check-circle'
      }

      if (sb_type == "error") {
        this.sb_title = 'Error'
        this.sb_icon = 'mdi-check-circle'
      }

      if (sb_type == "warning") {
        this.sb_title = 'Advertencia'
        this.sb_icon = 'mdi-alert-circle'
      }
      this.sb_message = sb_message
      this.sb_timeout = sb_timeout
      this.snackbar = true
    },
        initialize(){
            axios
      .get('http://127.0.0.1:8000/api/show-business', {
          params: {
            business_id: this.business_id
          }
        })
      .then((response) => {
        this.branches = response.data.branches;
      });
      //this.chargeServices();
        this.chargeCalendarsBranches();
        this. chargeProfessionals();
        },
       /* validBooton(){
           if( this.profitPercen != null && this.professional[0] != null &&  this.selected[0]) 
           {
            return true;
           }
           else{
            return false
           }

        },*/
        desasignService()
        {

          console.log('*********DATOS POARA ENVIAR PARA LA API***************');
            console.log('this.professional');
            console.log(this.professional[0]);
            console.log('this.selected');
            console.log(this.selected[0]); 
            let request = {
        professional_id: this.professional[0],
        branch_service_id: this.selected[0]
      }
            //CAMBIAR ESTA RUTA POR LA RUTA CORRECTA DE DESASIGNAR SERVICIO AL PROFESIONAL
            axios
        .post('http://127.0.0.1:8000/api/professionalservice-destroy', request)
        .then(() => {
          this.showAlert("success", "Desasignado correctamente", 3000);
          this.profitPercen = '';
          this.professional = '';
          this.selected = '';
          this.initialize();
        }).catch(error => {
          // Maneja cualquier error que pueda ocurrir durante la solicitud
          console.log(error);
          this.showAlert("warning", "Error al hacer la asignación".error, 3000);

        });

        },
        asignService()//todooo
        {
            console.log('*********DATOS POARA ENVIAR PARA LA API***************');
            console.log('this.profitPercen');
            console.log(this.profitPercen);
            console.log('this.professional');
            console.log(this.professional[0]);
            console.log('this.selected');
            console.log(this.selected[0]); 
            
            let request = {
        professional_id: this.professional[0],
        branch_service_id: this.selected[0],
        percent: this.profitPercen,
      }

      axios
        .post('http://127.0.0.1:8000/api/professionalservice', request)
        .then(() => {
          this.showAlert("success", "Servicio asignado correctamente", 3000);
          this.profitPercen = '';
          this.professional = '';
          this.selected = '';
          this.initialize();
        }).catch(error => {
          // Maneja cualquier error que pueda ocurrir durante la solicitud
          this.showAlert("warning", "Error al hacer la asignación".error, 3000);

        });
      
      console.log('request');
            console.log(request); 

        },
      typeService(type,porc)
      {
       
        if(type === 'Especial')
        {
    //         showPercent:false,
    // profitPercen:'',
    this.profitPercen = porc;
    this.showPercent = true;
    
            //desabilitar el campo de texto y mostrar el porciento
        }
        else if(type === 'Regular')
        {
            this.profitPercen = '';
            this.showPercent = false;
            //habilitar y limpiamos el campo
        }

      },

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
        /*sendData()
    {
   
      // Realiza la solicitud POST Y BUSCO LOS DATOS DEL CLIENTE 
      axios.get(`http://127.0.0.1:8000/api/client-email-phone?email=${this.email_client2}`)
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

    },*/
        /*send()
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
        branch_id: 1,
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
      axios.post('http://127.0.0.1:8000/api/reservation_store',  request )
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



    },*/

        isIntervalDisabled(time) {
    // Aquí puedes agregar la lógica para desactivar ciertos horarios.
    // Por ejemplo, si deseas desactivar los horarios '10:00' y '11:00':
    return this.disabledIntervals.includes(time);
  },
        /*divideInterval() {
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
        },*/
        
                /*timeReservated() {
                    
                  console.log('****************************this.professional[0]*************');
                  console.log(this.professional[0]);

                  let currentDate = new Date();
                  let formattedDate = currentDate.toISOString().split('T')[0];

                  let request = {
                    professional_id: this.professional[0],
                    branch_id: 1,
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
                
                  });
  },*/
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
                .get(`http://127.0.0.1:8000/api/schedule-show?branch_id=1`)
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
        handleStepChange(newValue) 
        {

            // Verifica si se está pasando del paso 1 al paso 2
            if (newValue === 2) {
                // Llama a tu método aquí
                console.log("--------------Se ha pasado del paso 1 al paso 2");
                console.log('---------' + this.selected);
                //this.chargeProfessionals(this.selected);
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
    
        this.barberAleatorie = false;
        const index = this.professional.indexOf(serviceId2);
        
        if (index > -1) {
            // Si el servicio ya está seleccionado, no hagas nada
            return;
        }

        // Limpiar la selección anterior y agregar el nuevo servicio seleccionado
        this.professional = [serviceId2];
        console.log(this.professional);
        //HACER LLAMADA A BUSCAR LOS SERVICIOS DISPONIBLES Y SERVICIOS ASIGNADOS
        this.getServicesProfessional();
        this.getServicesProfessionalSelect();
    
},

getServicesProfessional()
{
  //LLAMAR AL METODO
  //DADO EL ID DEL PROFESSIONAL Y LA BRANCH

  const idProfessional = this.professional[0];
  const idBranch = this.branch_id;

  //AXIOS
  axios
                .get(`http://127.0.0.1:8000/api/services-professional-branch-free`, {
                    params: {
                        branch_id: idBranch,
                        professional_id: idProfessional,
                    }
                })
                .then((response) => {
                    console.log(response.data)
                    this.services = response.data.branchServices;
                })
                .catch((err) => {
                    console.log(err, "error");

                });

},
getServicesProfessionalSelect()
{
    //LLAMAR AL METODO
    //DADO EL ID DEL PROFESSIONAL Y LA BRANCH

    const idProfessional = this.professional[0];
    const idBranch = this.branch_id;

    //AXIOS
    axios
                .get(`http://127.0.0.1:8000/api/services-professional-branch`, {
                    params: {
                        branch_id: idBranch,
                        professional_id: idProfessional,
                    }
                })
                .then((response) => {
                    console.log(response.data)
                    this.servicesAsig = response.data.branchServices;
                })
                .catch((err) => {
                    console.log(err, "error");

                });

},
toggleService3(service) 
{   
        const index = this.selected.indexOf(service.id);
        
        if (index > -1) {
            // Si el servicio ya está seleccionado, no hagas nada
            return;
        }

        // Limpiar la selección anterior y agregar el nuevo servicio seleccionado
        this.selected = [service.id];
        this.selectedServiceType = [service.type_service];
        this.profitPercentaje = [service.profit_percentaje];
        //
        //
        console.log(this.selected);
        console.log(this.selectedServiceType);
        console.log(this.profitPercentaje);

        this.typeService(this.selectedServiceType[0],this.profitPercentaje[0]);
        
    
},
         //profesionales
         /*toggleTimer(hour) {
            const index = this.hourSelect.indexOf(hour);
            console.log(this.hourSelect);
            if (index > -1) {
                // Si el servicio ya está seleccionado, no hagas nada
                return;
            }


            // Limpiar la selección anterior y agregar el nuevo servicio seleccionado
            this.hourSelect = [hour];
            this.start_time1 = this.hourSelect;
        },*/
      /*  isProfessional(serviceId2) {
            return this.professional.length === 1 && this.professional[0] === serviceId2;
        },*/
        /*isTimer(hour) {
            return this.hourSelect.length === 1 && this.hourSelect[0] === hour;
        },*/

        chargeServices() {
                axios
                .get(`http://127.0.0.1:8000/api/professionalservice-show`, {
                    params: {
                        branch_id: this.branch_id
                    }
                })
                .then((response) => {
                    console.log(response.data)
                    this.services = response.data.branchServices;
                })
                .catch((err) => {
                    console.log(err, "error");

                });
         },

        chargeProfessionals() {
            
//const newArrayService = valueServices.map(item => parseInt(item)); // Convertir a enteros si es necesario
//console.log(newArrayService);
      const data = {
        
                //services: newArrayService,
                 branch_id: this.branch_id
                // branch_id: this.selected_branch.id
            };

            //this.array_services = newArrayService;
            axios
        .get(`http://127.0.0.1:8000/api/branch-professionals-barber`, {
            params: data
        })
        .then((response) => {
                    this.professionals = response.data.professionals;
                    console.log('estos son los profesionales');
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
    background-color: #F18254 !important;
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