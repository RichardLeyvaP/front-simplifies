<template>
  <v-container>
    <v-row v-if="mostrarFila">
      <v-col cols="12" md="4" lg="4">
        <v-flex>
          <v-card elevation="6" @click="detailWinner">
            <v-toolbar elevation="6" id="bar-login" style="height: 45px;" dark color="teal-darken-2">
            </v-toolbar>
            <v-card elevation="5" style="z-index:2; margin-top: -20px; border:0px">
              <v-card-text>
                <div>                
                    <v-row>
                    <v-col cols="12" md="12"></v-col>
                    </v-row>
                  <v-row>
                    <v-col cols="12" md="5">
                      <v-row>
                        <v-col cols="12">
                          <spam class="text-overline"> Ingreso Mensual
                            <div class="text-h6 font-weight-bold text-teal-darken-2">
                              {{ this.formatNumber(amountMounth) }}
                              <div class="text-h6 font-weight-bold text-teal-darken-2">
                            </div>
                            CLP
                            </div>
                          </spam>
                          <p>{{ formattedDateMonth }} </p>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="12" md="5">
                      <v-row>
                        <v-col cols="12">
                          <spam class="text-overline"><br>
                            <div class="text-h6 font-weight-bold text-teal-darken-2">
                              {{ this.formatNumber(amountMounthAnt) }}
                              <div class="text-h6 font-weight-bold text-teal-darken-2">
                            </div>
                            CLP
                            </div>
                          </spam>
                          <p>{{ formattedDateMonthAnt }} </p>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="2">
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

      <v-col cols="12" md="4" lg="4">
        <v-flex>
          <v-card elevation="6" @click="detailProduct">
            <v-toolbar elevation="6" id="bar-login" style="height: 45px;" dark color="amber-darken-1">
            </v-toolbar>
            <v-card elevation="5" style="z-index:2; margin-top: -20px; border:0px">
              <v-card-text>
                <div>
                  <v-row>
                    <v-col cols="12" md="5">
                      <v-row>
                        <v-col cols="12">
                          <spam class="text-overline"> Productos Vendidos
                            <div class="text-h6 font-weight-bold text-amber-darken-1">
                              {{ formatNumber(productCant) }}
                            </div>
                            <div class="text-h6 font-weight-bold text-amber-darken-1">
                              CLP
                            </div>
                          </spam>
                          <p>{{ formattedDate }} </p>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="12" md="5">
                      <v-row>
                        <v-col cols="12">
                          <spam class="text-overline"><br>
                            <div class="text-h6 font-weight-bold text-amber-darken-1">
                              {{ formatNumber(productCantAnt) }}
                            </div>
                            <div class="text-h6 font-weight-bold text-amber-darken-1">
                              CLP
                            </div>
                          </spam>
                          <p>{{ formattedDateAnt }} </p>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-avatar icon="mdi-star-circle" class=" text-h6 text-amber-darken-1"></v-avatar>
                    </v-col>

                  </v-row>
                  <!--<div class="text-right">
                    <a herf="#" @click="detailProduct">Ver detalles</a>
                  </div>-->
                </div>
              </v-card-text>
            </v-card>
            <v-toolbar elevation="6" dark color="amber-darken-1" style="margin-top: -40px; height: 70px;">
            </v-toolbar>
          </v-card>
        </v-flex>
      </v-col>

      <v-col cols="12" md="4" lg="4">
        <v-flex>
          <v-card elevation="6" @click="detailService">
            <v-toolbar elevation="6" id="bar-login" style="height: 45px;" dark color="brown-lighten-1">
            </v-toolbar>
            <v-card elevation="5" style="z-index:2; margin-top: -20px; border:0px">
              <v-card-text>
                <div>
                  <v-row>
                    <v-col cols="12" md="5">
                      <v-row>
                        <v-col cols="12">
                          <spam class="text-overline"> Servicios brindados
                            <div class="text-h6 font-weight-bold text-brown-lighten-1">
                              {{ formatNumber(serviceCant) }}
                            </div>
                            <div class="text-h6 font-weight-bold text-brown-lighten-1">
                              CLP
                            </div>
                          </spam>
                          <p>{{ formattedDate }} </p>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="12" md="5">
                      <v-row>
                        <v-col cols="12">
                          <spam class="text-overline"><br>
                            <div class="text-h6 font-weight-bold text-brown-lighten-1">
                              {{ formatNumber(serviceCantAnt) }}
                            </div>
                            <div class="text-h6 font-weight-bold text-brown-lighten-1">
                              CLP
                            </div>
                          </spam>
                          <p>{{ formattedDateAnt }} </p>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-avatar icon="mdi-star-circle" class=" text-h6 text-brown-lighten-1"></v-avatar>

                    </v-col>

                  </v-row>
                  <!--<div class="text-right">
                    <a herf="#" @click="detailService">Ver detalles</a>
                  </div>-->
                </div>
              </v-card-text>
            </v-card>
            <v-toolbar elevation="6" dark color="brown-lighten-1" style="margin-top: -40px; height: 70px;">
            </v-toolbar>
          </v-card>
        </v-flex>
      </v-col>
      <!--<v-col cols="12" md="6" lg="3">
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
      </v-col>-->

      <!--<v-col cols="12" md="4" lg="4">
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
                          <spam class="text-overline"> Servicio más brindado
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
      </v-col>-->
    </v-row>
    <v-row v-if="mostrarFila">
      <v-col cols="6">
        <v-card class="mx-auto  overflow-visible" @click="showReservas">
          <Bar class="pa-6" id="my-chart-id" :options="chartOptions" :data="chartData3" padding="16" />

          <v-card-text class="pt-0">

            <div class="subheading font-weight-light text-grey">
              Reservas Diarias de la web en la semana actual
            </div>
            <v-divider class="my-2"></v-divider>
            <v-icon class="me-2" size="small">
              mdi-clock
            </v-icon>
            <span class="text-caption text-grey font-weight-light">Actualizado Recientemente</span>
          </v-card-text>
        </v-card>
      </v-col>


      <v-col cols="6">
        <v-card class="mx-auto  overflow-visible">
          <!--<Bar class="pa-6"
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData4"
    padding="16"
  />-->
          <LineChart class="pa-6" id="my-chart-id" :options="chartOptions" :data="chartData4" padding="16" />

          <v-card-text class="pt-0">

            <div class="subheading font-weight-light text-grey">
              Ingresos Diarios de la semana actual
            </div>

            <v-divider class="my-2"></v-divider>
            <v-icon class="me-2" size="small">
              mdi-clock
            </v-icon>
            <span class="text-caption text-grey font-weight-light">Actualizado Recientemente</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!--Ganancias mounth-->
    <v-dialog v-model="dialogWinners" max-width="400px" transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar color="#F18254">
          <v-col cols="12" md="9" class="grow ml-4">
            <span class="text-h8"> <strong>Ganancias del mes</strong></span>
          </v-col>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-tabs v-model="tabBarWinner" color="rgb(241, 130, 84)" elevation="6"><!-- @click="handleTabChange"-->
          <v-tab value="one">Mes Actual</v-tab>
          <v-tab value="two">Mes Anterior</v-tab>
        </v-tabs>
        <v-card-text>
          <v-window v-model="tabBarWinner">
            <v-window-item value="one">
              <v-card>
                <v-list-item-group>
                  <v-list-item v-for="(carDetail, index) in winners" :key="index">
                    <v-list-item-content>
                      <v-list-item-title> <v-icon>mdi-tag</v-icon>Productos: {{ carDetail.productsAmount
                        }}</v-list-item-title>
                      <v-list-item-title><v-icon>mdi-hair-dryer</v-icon>Servicios: {{ carDetail.servicesAmount
                        }}</v-list-item-title>
                      <v-list-item-title><v-icon>mdi-chair-rolling</v-icon>Ganancias: {{ carDetail.earnings
                        }}</v-list-item-title>
                      <v-list-item-title><v-icon>mdi-cog</v-icon>Asistencia Técnica: {{ carDetail.technical_assistance
                        }}</v-list-item-title>
                      <v-list-item-title><v-icon>mdi-cash</v-icon>Propina: {{ carDetail.tip }}</v-list-item-title>
                      <v-list-item-title><v-icon>mdi-briefcase</v-icon>Total: {{ carDetail.total }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-card>
            </v-window-item>

            <v-window-item value="two">
              <v-card>
                <v-list-item-group>
                  <v-list-item v-for="(carDetail, index) in winnersAnt" :key="index">
                    <v-list-item-content>
                      <v-list-item-title> <v-icon>mdi-tag</v-icon>Productos: {{ carDetail.productsAmount
                        }}</v-list-item-title>
                      <v-list-item-title><v-icon>mdi-hair-dryer</v-icon>Servicios: {{ carDetail.servicesAmount
                        }}</v-list-item-title>
                      <v-list-item-title><v-icon>mdi-chair-rolling</v-icon>Ganancias: {{ carDetail.earnings
                        }}</v-list-item-title>
                      <v-list-item-title><v-icon>mdi-cog</v-icon>Asistencia Técnica: {{ carDetail.technical_assistance
                        }}</v-list-item-title>
                      <v-list-item-title><v-icon>mdi-cash</v-icon>Propina: {{ carDetail.tip }}</v-list-item-title>
                      <v-list-item-title><v-icon>mdi-briefcase</v-icon>Total: {{ carDetail.total }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-card>
            </v-window-item>

          </v-window>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#E7E9E9" variant="flat" @click="closeWinner"> Volver </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--Servicios-->
    <v-dialog v-model="dialogServices" max-width="800px" transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar color="#F18254">
          <v-col cols="12" md="9" class="grow ml-4">
            <span class="text-h8"> <strong>Servicios más brindados</strong></span>
          </v-col>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card elevation="2">
          <v-tabs v-model="tabBarService" color="rgb(241, 130, 84)" elevation="6"><!-- @click="handleTabChange"-->
            <v-tab value="one">Día mes Actual</v-tab>
            <v-tab value="two">Día mes Anterior</v-tab>
          </v-tabs>
          <v-card-text>
            <v-window v-model="tabBarService">
              <v-window-item value="one">
                <!--<v-text-field class="mt-1 mb-1" v-model="search5" append-icon="mdi-magnify" label="Buscar" single-line:search="search5"
                                hide-details>
                              </v-text-field>-->
                <v-data-table :headers="headers1" :items-per-page-text="'Elementos por páginas'" :items="servicesData"
                  class="elevation-2" no-results-text="No hay datos disponibles"
                  no-data-text="No hay datos disponibles">
                  <template v-slot:item.name="{ item }">
                    <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                      <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image_service
                        " alt="image"></v-img>
                    </v-avatar>
                    {{ item.name }}
                  </template>
                </v-data-table>
              </v-window-item>

              <v-window-item value="two">
                <!--<v-text-field class="mt-1 mb-1" v-model="search6" append-icon="mdi-magnify" label="Buscar" single-line:search="search6" 
                hide-details>
              </v-text-field>-->
                <v-data-table :headers="headers1" :items-per-page-text="'Elementos por páginas'"
                  :items="servicesDataAnt" class="elevation-2" no-results-text="No hay datos disponibles"
                  no-data-text="No hay datos disponibles">
                  <template v-slot:item.name="{ item }">
                    <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                      <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image_service
                        " alt="image"></v-img>
                    </v-avatar>
                    {{ item.name }}
                  </template>
                </v-data-table>
              </v-window-item>

            </v-window>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#E7E9E9" variant="flat" @click="closeService"> Volver </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--products-->
    <v-dialog v-model="dialogProducts" max-width="800px" transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar color="#F18254">
          <v-col cols="12" md="9" class="grow ml-4">
            <span class="text-h8"> <strong>Productos mas vendidos</strong></span>
          </v-col>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card elevation="2">
          <v-tabs v-model="tabBarProduct" color="rgb(241, 130, 84)" elevation="6"><!-- @click="handleTabChange"-->
            <v-tab value="one">Día mes Actual</v-tab>
            <v-tab value="two">Día mes Anterior</v-tab>
          </v-tabs>
          <v-card-text>
            <v-window v-model="tabBarProduct">
              <v-window-item value="one">
                <!--<v-text-field class="mt-1 mb-1" v-model="search5" append-icon="mdi-magnify" label="Buscar" single-line:search="search5"
                                hide-details>
                              </v-text-field>-->
                <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="productsData"
                  class="elevation-2" no-results-text="No hay datos disponibles"
                  no-data-text="No hay datos disponibles">
                  <template v-slot:[`item.orders`]="{ item }">
                    {{ item.orders[0].total_cant }}
                  </template>
                  <template v-slot:item.name="{ item }">
                    <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                      <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image_product
                        " alt="image"></v-img>
                    </v-avatar>
                    {{ item.name }}
                  </template>
                </v-data-table>
              </v-window-item>

              <v-window-item value="two">
                <!--<v-text-field class="mt-1 mb-1" v-model="search6" append-icon="mdi-magnify" label="Buscar" single-line:search="search6" 
                hide-details>
              </v-text-field>-->
                <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="productsDataAnt"
                  class="elevation-2" no-results-text="No hay datos disponibles"
                  no-data-text="No hay datos disponibles">
                  <template v-slot:[`item.orders`]="{ item }">
                    {{ item.orders[0].total_cant }}
                  </template>
                  <template v-slot:item.name="{ item }">
                    <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                      <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image_product
                        " alt="image"></v-img>
                    </v-avatar>
                    {{ item.name }}
                  </template>
                </v-data-table>
              </v-window-item>

            </v-window>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#E7E9E9" variant="flat" @click="closeProduct"> Volver </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogReservas" max-width="900px" transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar color="#F18254">
          <v-col cols="12" md="9" class="grow ml-4">
            <span class="text-h8"> <strong>Reservas de la semana</strong></span>
          </v-col>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card elevation="2">
          <v-card-text>
            <v-text-field class="mt-1 mb-1" v-model="search3" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details>
            </v-text-field>
            <v-data-table :headers="headers3" :items-per-page-text="'Elementos por páginas'"
              :items="reservationWeekData" :search="search3" class="elevation-2"
              no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">
              <template v-slot:item.professionalName="{ item }">

                <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                  <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image_data" alt="image"></v-img>
                </v-avatar>
                {{ item.professionalName }}
              </template>
              <template v-slot:item.clientName="{ item }">
                <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                  <v-img :src="'http://127.0.0.1:8000/api/images/' + item.client_image
                    " alt="image"></v-img>
                </v-avatar>
                {{ item.clientName }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#E7E9E9" variant="flat" @click="closeReservas"> Volver </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Line as LineChart } from 'vue-chartjs'

import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement,)
import LocalStorageService from "@/LocalStorageService";
import axios from "axios";
export default {
  name: 'LoginPage',
  components: { Bar, LineChart },
  props: {
      value: {
        type: String
      },
    },
  data() {
    return {
      formattedDate: '',
      formattedDateAnt: '',
      formattedDateMonth: "",
      formattedDateMonthAnt: "",
      amountDay: '',
      branch_id: '',
      business_id: '',
      mostrarFila: false,
      charge: '',
      reservationCount: '',
      amountMounth: '',
      amountMounthAnt: '',
      reservationWeek: [],
      reservationWeekData: [],
      clientFrecuente: '',
      winnerWeek: [],
      products: [],
      reservDay: '',
      productName: '',
      productNameAnt: '',
      productCant: '',
      productCantAnt: '',
      services: [],
      servicesData: [],
      servicesDataAnt: [],
      productsData: [],
      productsDataAnt: [],
      winners: [],
      winnersAnt: [],
      serviceName: '',
      serviceNameAnt: '',
      serviceCant: '',
      serviceCantAnt: '',
      dialogServices: false,
      dialogProducts: false,
      dialogWinners: false,
      tabBarService: null,
      tabBarWinner: null,
      tabBarProduct: null,
      dialogReservas: false,
      search3: '',
      headers: [
        { title: "Nombre Producto", key: "name", sortable: false },
        { title: "Cantidad", key: "orders", sortable: true }
      ],
      headers1: [
        { title: "Nombre Servicio", key: "name", sortable: false },
        { title: "Cantidad", key: "orders_count", sortable: true }
      ],
      headers3: [
        { title: "Fecha", key: "data", sortable: true },
        { title: "Nombre Profesional", key: "professionalName", sortable: true },
        { title: "Nombre Cliente", key: "clientName", sortable: true },
        { title: "Inicia", key: "start_time", sortable: true },
        { title: "Finaliza", key: "end_time", sortable: true },
        { title: "Duración", key: "total_time", sortable: true },
      ],
      chartData: {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [{
          label: 'Reservas Web',
          backgroundColor: ["#FFB300", "#FF7043", "#00796B", "#B0BEC5", "#C0CA33", "#8D6E63", "#616161"], data: this.reservationWeek
        }]
      },/*
      chartData: {
        labels: [ 'Lunes', 'Martes', 'Miércoles' , 'Jueves' , 'Viernes', 'Sábado', 'Domingo' ],
        datasets: [ { label: 'Reservas',
        backgroundColor:  ["#FFB300", "#FF7043", "#00796B", "#B0BEC5", "#C0CA33", "#8D6E63", "#616161"], data: [40, 20, 12, 10, 35, 22, 0]}]
      },*/
      chartOptions: {
        responsive: true
      },

      chartData2: {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [{
          label: 'Ingresos',
          backgroundColor: ["#00796B", "#FFB300", "#FF7043", "#B0BEC5", "#C0CA33", "#8D6E63", "#616161"], data: this.winnerWeek
        }]
      },


    };
  },
  computed: {
    // Usando computed para asegurar reactividad
    chartData3() {
      return this.generateChartData();
    },
    chartData4() {
      return this.generateChartData1();
    }
  },
  mounted() {
    this.branch_id = LocalStorageService.getItem("branch_id");
    this.business_id = LocalStorageService.getItem("business_id");
    this.charge = JSON.parse(LocalStorageService.getItem("charge"));
    if (this.charge === 'Administrador' || this.charge === 'Administrador de Sucursal') {
      this.mostrarFila = true;
    }
    console.log(this.business_id);
    const today = new Date();
    this.formattedDate = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.formattedDateAnt = today.getDate() + '-' + (today.getMonth()) + '-' + today.getFullYear();
    this.formattedDateMonth = (today.getMonth() + 1) + '-' + today.getFullYear();
    this.formattedDateMonthAnt = (today.getMonth()) + '-' + today.getFullYear();
    this.initialize();
    // this.renderChart(this.chartData, { responsive: true, maintainAspectRatio: false })
  },
  methods: {
    formatNumber(value) {
      // Si el valor es menor que 1000, devuelve el valor original sin formato
  if (value < 1000) {
    return value;
  }

  // Primero, redondea el valor a dos decimales
  value = Math.round((value + Number.EPSILON) * 100) / 100;

  // Separa la parte entera de la parte decimal
  let parts = value.toString().split(".");
  let integerPart = parts[0];
  let decimalPart = parts.length > 1 ? "." + parts[1] : "";

  // Agrega los separadores de miles
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Combina la parte entera y la parte decimal
  return integerPart + decimalPart;
        },
    //ganancias en la semana
    generateChartData1() {
      return {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [
          {
            label: 'Ingresos',
            backgroundColor: ["#FFB300", "#FF7043", "#00796B", "#B0BEC5", "#C0CA33", "#8D6E63", "#616161"],
            data: this.winnerWeek
          }
        ]
      };
    },
    //reservas en la semana
    generateChartData() {
      return {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [
          {
            label: 'Reservas Web',
            backgroundColor: ["#FFB300", "#FF7043", "#00796B", "#B0BEC5", "#C0CA33", "#8D6E63", "#616161"],
            data: this.reservationWeek
          }
        ]
      };
    },
    datacollection: {
      // Data to be passed to the chart
      labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      datasets: [
        {
          label: 'Reservas',
          backgroundColor: '#f87979',
          data: [40, 20, 12, 39, 10, 40, 39] // Ejemplo de datos de reservas
        }
      ]
    },
    initialize() {

      //this.reservationWeek = [40, 20, 12, 10, 35, 22, 0];
      this.editedIndex = 1;
      /*axios
        .get('http://127.0.0.1:8000/api/cars-winner-day', {
          params: {
            branch_id: this.branch_id,
            business_id: this.business_id
          }
        })
        .then((response) => {
          this.amountDay = response.data;
          console.log(this.amountDay);
        });*/
      axios
        .get('http://127.0.0.1:8000/api/car-products-services', {
          params: {
            branch_id: this.branch_id,
            business_id: this.business_id
          }
        })
        .then((response) => {
          this.products = response.data.product;
          //this.productsData = this.products[0].products;
          //this.productsDataAnt = this.products[0].productsAnt;
          //this.productName = this.products[0].name;
          //this.productNameAnt = this.products[0].nameAnt;
          this.productCant = this.products[0].cant;
          this.productCantAnt = this.products[0].cantAnt;
          this.services = response.data.service;
          //this.servicesData = this.services[0].services;
          //this.servicesDataAnt = this.services[0].servicesAnt;
          //this.serviceName = this.services[0].name;
          //this.serviceNameAnt = this.services[0].nameAnt;
          this.serviceCant = this.services[0].cant;
          this.serviceCantAnt = this.services[0].cantAnt;
          //this.servicesData = this.services[0].services;
          //console.log(this.services[0].services);
        });
      axios
        .get('http://127.0.0.1:8000/api/cars-winner-mounth', {
          params: {
            branch_id: this.branch_id,
            business_id: this.business_id
          }
        })
        .then((response) => {
          this.amountMounth = response.data.cars;
          this.amountMounthAnt = response.data.carsAnt;
          this.winners = response.data.carsDetail;
          this.winnersAnt = response.data.carsDetailAnt;
          console.log(this.amountMounth);
        });
      /*axios
        .get('http://127.0.0.1:8000/api/reservations-count', {
          params: {
            branch_id: this.branch_id,
            business_id: this.business_id
          }
        })
        .then((response) => {
          this.reservDay = response.data;
          console.log(this.reservDay);
        });*/
      /*axios
        .get('http://127.0.0.1:8000/api/client-frecuente', {
          params: {
            branch_id: this.branch_id,
            business_id: this.business_id
          }
        })
        .then((response) => {
          this.clientFrecuente = response.data;
          console.log(this.clientFrecuente);
        });*/
      axios
        .get('http://127.0.0.1:8000/api/cars-winner-week', {
          params: {
            branch_id: this.branch_id,
            business_id: this.business_id
          }
        })
        .then((response) => {
          this.winnerWeek = response.data;
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
          this.reservationWeek = response.data.cantReservations;
          this.reservationWeekData = response.data.reservations;
          //console.log(this.reservationWeek);
        });
    },
    showReservas() {
      this.dialogReservas = true;
    },
    closeReservas() {
      this.dialogReservas = false;
    },
    detailWinner() {
      this.dialogWinners = true;
    },
    closeWinner() {
      this.dialogWinners = false;
    },
    detailService() {
      this.dialogServices = true;
    },
    closeService() {
      this.dialogServices = false;
    },
    detailProduct() {
      this.dialogProducts = true;
    },
    closeProduct() {
      this.dialogProducts = false;
    }
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
