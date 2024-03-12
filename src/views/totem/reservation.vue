<template>
    <v-container>
        <v-stepper bg-color="" v-model="step" :items="items" show-actions @update:model-value="handleStepChange">
            <template v-slot:item.1>
                <h3 class="text-h6">Servicios</h3>

                <v-sheet border>
                    <v-list>
                        <v-list-item-group v-model="selected" multiple active-class="deep-purple--text text--accent-4">
                            <v-list-item :prepend-avatar="'http://127.0.0.1:8000/api/images/' + service.image_service"
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

            <template v-slot:item.2>
                <h3 class="text-h6">Barberos Disponibles</h3>

                <br>

                <v-sheet border>
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
                </v-sheet>
            </template>

            <template v-slot:item.3>
                <v-sheet border>
                <v-row>

                    <v-col cols="12" sm="8" v-if="intervals.length > 0">
                  <v-card elevation="4">


                    <h5 class="mt-5 pt-2 pl-3"> A continuación se muestran los horarios disponibles para la fecha
                      {{ date }}</h5>


                    <v-card-text>
                      <v-chip-group v-model="selected_interval" active-class="orange lighten-2 white--text" column>
        <v-chip label v-for="inter in intervals" :key="inter.id" :disabled="isIntervalDisabled(inter.time_star)">
          {{ inter.time_star }}
        </v-chip>
      </v-chip-group>
                    </v-card-text>

                  </v-card>
                </v-col>

                </v-row>

                
                   
                </v-sheet>
            </template>
        </v-stepper>
    </v-container>
</template>

<script>
import axios from "axios";

export default {
    data: () => ({
        calendars_branches: [],
        arrayEvents: null,
        selected_services: [],
        services: [],
        professionals: [],
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
            'Servicios',
            'Profesionales',
            'Horario Disponible',
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

     /*       // Bucle para generar intervals de media hora
            let actual = new Date(inicio);
            while (actual < fin) {
                // Obtener la hora y minutos actuales
                const horaActual = actual.getHours();
                const minutosActual = actual.getMinutes();

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

            console.log('sssssssssssssss' + this.intervals);*/
        },
        
    timeReservated() {
        
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
        toggleService2(serviceId2) {
            const index = this.professional.indexOf(serviceId2);
            console.log(this.professional);
            if (index > -1) {
                // Si el servicio ya está seleccionado, no hagas nada
                return;
            }


            // Limpiar la selección anterior y agregar el nuevo servicio seleccionado
            this.professional = [serviceId2];
        },
        isProfessional(serviceId2) {
            return this.professional.length === 1 && this.professional[0] === serviceId2;
        },

        chargeServices() {
            axios
                .get(`http://127.0.0.1:8000/api/branchservice-show?branch_id=1`)
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
                 branch_id: 1
                // branch_id: this.selected_branch.id
            };
            axios
        .get(`http://127.0.0.1:8000/api/branch-professionals-service`, {
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
</style>