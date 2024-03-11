<template>
 
    <v-container>
    <v-row>
     
      <v-col cols="12" md="6" lg="3">
        <v-flex>
          <v-card elevation="6">
            <v-toolbar elevation="6" id="bar-login" style="height: 45px;" dark color="amber-darken-1">
            </v-toolbar>
            <v-card elevation="5" style="z-index:2; margin-top: -20px; border:0px">
              <v-card-text>
                <div>
                  <v-row>
                    <v-col cols="12" md="9">
                      <v-row>
                        <v-col cols="12">
                          <spam class="text-overline"> Reservas Diarias
                            <div class="text-h4 font-weight-bold text-amber-darken-1">
                              {{  reservDay  }}
                            </div>
                          </spam>
                          <p>Fecha: {{ formattedDate }} </p>
                        </v-col>

                      </v-row>
                    </v-col>

                    <v-col cols="12" md="3">
                      <v-avatar icon="mdi-calendar" class=" text-h6 text-amber-darken-1"></v-avatar>
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
            </v-card>
            <v-toolbar elevation="6" dark color="amber-darken-1" style="margin-top: -40px; height: 70px;">
            </v-toolbar>
          </v-card>
        </v-flex>
      </v-col>
      <v-col cols="12" md="6" lg="3">
        <v-flex>
          <v-card elevation="6">
            <v-toolbar elevation="6" id="bar-login" style="height: 45px;" dark color="deep-orange-lighten-1">
            </v-toolbar>
            <v-card elevation="5" style="z-index:2; margin-top: -20px; border:0px">
              <v-card-text>
                <div>
                  <v-row>
                    <v-col cols="12" md="9">
                      <v-row>
                        <v-col cols="12">
                          <spam class="text-overline"> Clientes Frecuentes
                            <div class="text-h4 font-weight-bold text-deep-orange-lighten-1">
                              {{ clientFrecuente }}
                            </div>
                          </spam>
                          <p>Fecha: {{ formattedDate }} </p>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="12" md="3">
                      <v-avatar icon="mdi-account-star" class=" text-h6 text-deep-orange-lighten-1"></v-avatar>
                    </v-col>

                  </v-row>
                </div>
              </v-card-text>
            </v-card>
            <v-toolbar elevation="6" dark color="deep-orange-lighten-1" style="margin-top: -40px; height: 70px;">
            </v-toolbar>
          </v-card>
        </v-flex>
      </v-col>

      <v-col cols="12" md="6" lg="3">
        <v-flex>
          <v-card elevation="6">
            <v-toolbar elevation="6" id="bar-login" style="height: 45px;" dark color="teal-darken-2">
            </v-toolbar>
            <v-card elevation="5" style="z-index:2; margin-top: -20px; border:0px">
              <v-card-text>
                <div>
                  <v-row>
                    <v-col cols="12" md="9">
                      <v-row>
                        <v-col cols="12">
                          <spam class="text-overline"> Ingreso Mensual
                            <div class="text-h4 font-weight-bold text-teal-darken-2">
                             {{ amountMounth }}
                            </div>
                          </spam>
                          <p>Mes: {{ formattedDateMonth }} </p>
                        </v-col>

                      </v-row>
                    </v-col>

                    <v-col cols="12" md="3">
                      <v-avatar icon="mdi-cash-multiple" class=" text-h6 text-teal-darken-2"></v-avatar>
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
            </v-card>
            <v-toolbar elevation="6" dark color="teal-darken-2" style="margin-top: -40px; height: 70px;">
            </v-toolbar>
          </v-card>
        </v-flex>
      </v-col>


      <v-col cols="12" md="6" lg="3">
        <v-flex>
          <v-card elevation="6">
            <v-toolbar elevation="6" id="bar-login" style="height: 45px;" dark color="brown-lighten-1">
            </v-toolbar>
            <v-card elevation="5" style="z-index:2; margin-top: -20px; border:0px">
              <v-card-text>
                <div>
                  <v-row>
                    <v-col cols="12" md="9">
                      <v-row>
                        <v-col cols="12">
                          <spam class="text-overline"> Ingreso Diario
                            <div class="text-h4 font-weight-bold text-brown-lighten-1">
                              {{amountDay}}
                            </div>
                          </spam>
                          <p>Fecha: {{ formattedDate }} </p>
                        </v-col>

                      </v-row>
                    </v-col>

                    <v-col cols="12" md="3">
                      <v-avatar icon="mdi-cash" class=" text-h6 text-brown-lighten-1"></v-avatar>
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
            </v-card>
            <v-toolbar elevation="6" dark color="brown-lighten-1" style="margin-top: -40px; height: 70px;">
            </v-toolbar>
          </v-card>
        </v-flex>
      </v-col>


<v-col cols="6">
<v-card class="mx-auto  overflow-visible">  
      <Bar class="pa-6"
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
    padding="16"
  />
      
    <v-card-text class="pt-0">
      
      <div class="subheading font-weight-light text-grey">
        Reservas Diarias de la semana actual
      </div>
      <v-divider class="my-2"></v-divider>
      <v-icon
        class="me-2"
        size="small"
      >
        mdi-clock
      </v-icon>
      <span class="text-caption text-grey font-weight-light">Actualizado Recientemente</span>
    </v-card-text>
  </v-card>
</v-col>


<v-col cols="6">
<v-card class="mx-auto  overflow-visible">  
      <LineChart class="pa-6"
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData2"
    padding="16"
  />
      
    <v-card-text class="pt-0">
     
      <div class="subheading font-weight-light text-grey">
        Ingresos Diarios de la semana actual
      </div>
      
      <v-divider class="my-2"></v-divider>
      <v-icon
        class="me-2"
        size="small"
      >
        mdi-clock
      </v-icon>
      <span class="text-caption text-grey font-weight-light">Actualizado Recientemente</span>
    </v-card-text>
  </v-card>
</v-col>
</v-row>
    
    <br><br>

    
  </v-container>

</template>

<script>
import { Bar } from 'vue-chartjs'
import { Line as LineChart} from 'vue-chartjs'

import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement,)
import LocalStorageService from "@/LocalStorageService";
import axios from "axios";
export default {
  name: 'LoginPage',
  components: { Bar, LineChart },
  
  data() {
    return {
      formattedDate: '',
      formattedDateMonth:"",
      amountDay:'',
      branch_id: '',
      business_id:'',
      reservationCount: '',
      amountMounth:'',
      reservationWeek: '',
      clientFrecuente: '',
      winnerWeek: [],
      reservDay: '',
      chartData: {
        labels: [ 'Lunes', 'Martes', 'Miércoles' , 'Jueves' , 'Viernes', 'Sábado', 'Domingo' ],
        datasets: [ { label: 'Reservas',
        backgroundColor:  ["#FFB300", "#FF7043", "#00796B", "#B0BEC5", "#C0CA33", "#8D6E63", "#616161"], data: this.reservationWeek } ]
      },
      chartOptions: {
        responsive: true
      },

      chartData2: {
        labels: [ 'Lunes', 'Martes', 'Miércoles' , 'Jueves' , 'Viernes', 'Sábado', 'Domingo' ],
        datasets: [ { label: 'Ingresos',
        backgroundColor:  ["#00796B","#FFB300", "#FF7043",  "#B0BEC5", "#C0CA33", "#8D6E63", "#616161"], data: this.winnerWeek } ]
      },


    };
  },
  mounted() {
    this.branch_id = LocalStorageService.getItem("branch_id") ? LocalStorageService.getItem("branch_id") : 0;
    this.business_id = LocalStorageService.getItem("business_id");
    const today = new Date();
    this.formattedDate = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.formattedDateMonth = (today.getMonth() + 1) + '-' + today.getFullYear();
    this.initialize();
   // this.renderChart(this.chartData, { responsive: true, maintainAspectRatio: false })
  },
methods: {
  initialize() {
      this.editedIndex = 1;
      axios
        .get('http://127.0.0.1:8000/api/cars-winner-day', {
          params: {
            branch_id: this.branch_id,
            business_id: this.business_id
          }
        })
        .then((response) => {
          this.amountDay = response.data;
          console.log(this.amountDay);
        });
        axios
        .get('http://127.0.0.1:8000/api/cars-winner-mounth', {
          params: {
            branch_id: this.branch_id,
            business_id: this.business_id
          }
        })
        .then((response) => {
          this.amountMounth = response.data;
          console.log(this.amountMounth);
        });
        axios
        .get('http://127.0.0.1:8000/api/reservations-count', {
          params: {
            branch_id: this.branch_id,
            business_id: this.business_id
          }
        })
        .then((response) => {
          this.reservDay = response.data;
          console.log(this.reservDay);
        });
        axios
        .get('http://127.0.0.1:8000/api/client-frecuente', {
          params: {
            branch_id: this.branch_id,
            business_id: this.business_id
          }
        })
        .then((response) => {
          this.clientFrecuente = response.data;
          console.log(this.clientFrecuente);
        });
        axios
        .get('http://127.0.0.1:8000/api/cars-winner-week', {
          params: {
            branch_id: this.branch_id,
            business_id: this.business_id
          }
        })
        .then((response) => {
          this.winnerWeek = response.data.amount;
          console.log(this.winnerWeek);
        });
        axios
        .get('http://127.0.0.1:8000/api/reservations-count-week', {
          params: {
            branch_id: this.branch_id,
            business_id: this.business_id
          }
        })
        .then((response) => {
          this.reservationWeek = response.data;
          this.reservationWeek = this.reservationWeek.split(',').map(Number);
          console.log(this.reservationWeek);
        });
    },
    },
};
</script>


<style>
/* Olive color definition if you have a custom theme */
.olive {
  background-color: #808000;
  color: #fff;
}
</style>
