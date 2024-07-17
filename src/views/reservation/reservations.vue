<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-card elevation="6" class="mx-5">
<v-toolbar color="#F18254">
  <v-row align="center">
    <v-col cols="12" md="8" class="grow ml-4">
      <span class="text-h8">
        <strong>Reservas por profesional</strong></span>
    </v-col>
  </v-row>
</v-toolbar>
<v-container>
  <v-card-text>
        <v-sheet>

          <v-row>
            <v-col cols="12" sm="12" md="3">
              <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches"
                v-if="this.mostrarFila" label="Seleccione una Sucursal" prepend-inner-icon="mdi-store"
                item-title="name" item-value="id" density="compact" class="ma-2" variant="outlined"
                @update:model-value="initialize()"></v-autocomplete><!--@update:model-value="initialize()"-->
            </v-col>
            <v-col cols="12" md="3">
              <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="professional_id"
                :items="professionals" label="Profesional" prepend-inner-icon="mdi-account-tie-outline"
                item-title="name" item-value="id" variant="outlined" density="compact" class="ma-2"
                :rules="selectRules"><!--@update:model-value="showReservationsProfessional()"-->
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props"
                    :prepend-avatar="'https://api2.simplifies.cl/api/images/' + item.raw.image_url"
                    :subtitle="'Cargo: ' + item.raw.charge" :title="item.raw.name"></v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="3">
              <v-select v-model="type" :items="types" class="ma-2" label="Modo de vista" variant="outlined"
                density="compact" hide-details></v-select>
            </v-col>
            <v-col cols="12" md="1">
              <v-btn :disabled="!this.professional_id" icon @click="showReservationsProfessional()"
                color="#F18254">
                <v-icon>mdi-magnify</v-icon></v-btn>
            </v-col>
          </v-row>
          <div class="calendar-container">
            <v-calendar ref="calendar" v-model="value" :events="events" :view-mode="type"
              :event-color="getEventColor" class="fixed-size-calendar" hide-day-header="false">
            </v-calendar>
          </div>
        </v-sheet>
  </v-card-text>
    </v-container>
</v-card>
</template>

<script>

import axios from "axios";
import LocalStorageService from "@/LocalStorageService";
import { VCalendar } from 'vuetify/labs/VCalendar'

axios.interceptors.request.use(config => {
const token = LocalStorageService.getItem('token'); // Suponiendo que guardaste el token en localStorage
if (token) {
  config.headers.Authorization = `Bearer ${token.replace(/['"]+/g, '')}`;
}
return config;
}, error => {
return Promise.reject(error);
});

export default {
  components: {
    VCalendar,
  },
  data: () => ({
    branch_id:'',
    professional_id:'',
    charge: '',
    business_id: '',
    branches: '',
    mostrarFila: false,
    type: 'month',
    types: [
      { title: 'Mes', value: 'month' },
      //{ title: 'Semana', value: 'week' },
      //{ title: 'Día', value: 'day' }
    ],
    dayLabels: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    monthLabels: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    today: new Date(),
    focus: '',
    value: [new Date()],
    weekday: [0, 1, 2, 3, 4, 5, 6],
    weekdays: [
      { title: 'Dom - Sáb', value: [0, 1, 2, 3, 4, 5, 6] },
      { title: 'Lun - Dom', value: [1, 2, 3, 4, 5, 6, 0] },
      { title: 'Lun - Vie', value: [1, 2, 3, 4, 5] },
      { title: 'Lun, Mié, Vie', value: [1, 3, 5] },
    ],
    events: [],
    professionals: [],
    colors: [
      'blue',
      'green',
      'orange',
      'grey darken-1',
      'indigo',
      'deep-purple',
      'cyan',

    ],
    dialogfreeday: false,
    freedays: [],

    reservations: [],
  }),
  mounted() {        
      this.business_id = LocalStorageService.getItem('business_id');
      this.branch_id = LocalStorageService.getItem('branch_id');        
      this.charge_id = LocalStorageService.getItem('charge_id');
      this.charge = JSON.parse(LocalStorageService.getItem("charge"));
      LocalStorageService.setIsLocked(true);
      axios
          .get('https://api2.simplifies.cl/api/show-business', {
              params: {
                  business_id: this.business_id
              }
          })
          .then((response) => {
              this.branches = response.data.branches;
          }).finally(() => {
            LocalStorageService.setIsLocked(false);
          if (this.charge === 'Administrador') {
                  this.branch_id = this.branches[0].id;
                  this.mostrarFila = true;
              }
              this.initialize()
        });
  },

  methods: {
    getMonthDateRange(date) {
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      return { start, end };
    },
    // aqui lo del calendario
    getEventColor(event) {
      return event.color
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    closeCalendar() {
      this.reservations = [];
      this.events = [];
    },
    initialize() {
      this.professional_id = '';
      this.type = 'month';
      this.events = [];
      console.log('this.today');
      console.log(this.today);
      const today = new Date(this.today);
      const range = this.getMonthDateRange(today);
      const startDate = range.start.toISOString().split('T')[0];
      const endDate = range.end.toISOString().split('T')[0];
      /*const startDate = this.input
        ? format(this.input, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd");
      const endDate = this.input2
        ? format(this.input2, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd");*/
        LocalStorageService.setIsLocked(true);
      axios
        .get("https://api2.simplifies.cl/api/branch-reservations-periodo", {
          params: {
            branch_id: this.branch_id,
            startDate: startDate,
            endDate: endDate
          },
        })
        .then((response) => {
          //this.reservations = response.data.reservaciones;
          this.professionals = response.data.professionals;
        }).finally(() => {
            LocalStorageService.setIsLocked(false);
        });
    },
    showReservationsProfessional() {//aqui cargo el componente del calendar  
      LocalStorageService.setIsLocked(true);      
      this.events = [];
      console.log('this.today');
      console.log(this.today);
      const today = new Date(this.today);
      const range = this.getMonthDateRange(today);
      const startDate = range.start.toISOString().split('T')[0];
      const endDate = range.end.toISOString().split('T')[0];
      axios
        .get("https://api2.simplifies.cl/api/professional-reservations-periodo", {
          params: {
            branch_id: this.branch_id,
            professional_id: this.professional_id,
            startDate: startDate,
            endDate: endDate
          },
        })
        .then((response) => {
          this.reservations = response.data.reservaciones;
          console.log('Reservaciones');
          console.log(this.reservations);
          let tempEvents = [];


          this.reservations.forEach(reservacion => {
            tempEvents.push({
              title: reservacion.clientName,
              start: new Date(reservacion.startDate),
              end: new Date(reservacion.endDate),
              color: 'red',
              allDay: false
            });
          });
          this.events = tempEvents;
        }).finally(() => {
            LocalStorageService.setIsLocked(false);
        });
    },
}
}
</script>

<style>
.fixed-size-calendar {
  min-height: 100%;
  min-width: 100%;
  width: 100%;
}
.calendar-container {
  overflow-y: auto;
}
</style>