<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-snackbar class="mt-12" location="right top" :timeout="sb_timeout" :color="sb_type" elevation="24"
        :multi-line="true" vertical v-model="snackbar">
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
                <v-col cols="12" md="5" class="grow ml-4 t">
                    <span class="text-subtitle-1"> <strong>Solicitudes de eliminación de Órdenes, Productos y
                            Carros</strong></span>
                </v-col>
            </v-row>
        </v-toolbar>
        <v-container>
            <v-row>
                <v-col cols="12" sm="12" md="4">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches"
                        v-if="this.mostrarFila" clearable label="Seleccione una Sucursal" prepend-icon="mdi-store"
                        item-title="name" item-value="id" variant="underlined"
                        @update:model-value="initialize()"></v-autocomplete>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="12">
                    <v-card elevation="2">
                        <v-tabs v-model="tabBar" color="rgb(241, 130, 84)"
                            elevation="6"><!-- @click="handleTabChange"-->
                            <v-tab value="one">Solicitud de carros</v-tab>
                            <v-tab value="two">Solicitud ordenes</v-tab>
                            <v-tab value="tree">Solicitud Productos</v-tab>
                        </v-tabs>
                        <v-card-text>
                            <v-window v-model="tabBar">
                                <v-window-item value="one">
                                    <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify"
                                        label="Buscar" single-line hide-details></v-text-field>


                                    <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'"
                                        :items="results" :search="search" class="elevation-1"
                                        no-results-text="No hay datos disponibles"
                                        no-data-text="No hay datos disponibles">

                                        <template v-slot:item.professionalName="{ item }">

                                            <v-avatar class="mr-2" elevation="3" color="grey-lighten-4">
                                                <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_url"
                                                    alt="image"></v-img>
                                            </v-avatar>
                                            {{ item.professionalName }}
                                        </template>

                                        <template v-slot:item.clientName="{ item }">

                                            <v-avatar class="mr-2" elevation="3" color="grey-lighten-4">
                                                <v-img :src="'https://api2.simplifies.cl/api/images/' + item.client_image"
                                                    alt="image"></v-img>
                                            </v-avatar>
                                            {{ item.clientName }}
                                        </template>
                                        <template v-slot:item.amount="{ item }">
                {{ formatNumber(item.amount)}}                                  
                                          </template>
                                          
                                        <template v-slot:item.technical_assistance="{ item }">
                {{ formatNumber(item.technical_assistance)}}                                  
                                          </template>
                                          <template v-slot:item.tip="{ item }">
                {{ formatNumber(item.tip)}}                                  
                                          </template>
                                          <template v-slot:item.product="{ item }">
                {{ formatNumber(item.product)}}                                  
                                          </template>
                                          <template v-slot:item.service="{ item }">
                {{ formatNumber(item.service)}}                                  
                                          </template>
                                        <template v-slot:top>

                                            <v-divider class="mx-4" inset vertical></v-divider>
                                            <v-spacer></v-spacer>
                                        </template>

                                        <template v-slot:item.actions="{ item }">
                                            <v-btn density="comfortable" icon="mdi-close" @click="editItem(item)"
                                                color="red-darken-4" variant="tonal" elevation="1" class="mr-1 mt-1 mb-1"
                                                title="Denegar Solicitud"></v-btn>
                                            <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-check" @click="deleteItem(item)"
                                                color="primary" variant="tonal" elevation="1"
                                                title="Aceptar solicitud y eliminar el carro"></v-btn>
                                        </template>
                                    </v-data-table>
                                </v-window-item>

                                <v-window-item value="two">
                                    <v-text-field class="mt-1 mb-1" v-model="search2" append-icon="mdi-magnify"
                                        label="Buscar" single-line hide-details></v-text-field>


                                    <v-data-table :headers="headers1" :items-per-page-text="'Elementos por páginas'"
                                        :items="results1" :search="search2" class="elevation-1"
                                        no-results-text="No hay datos disponibles"
                                        no-data-text="No hay datos disponibles">

                                        <template v-slot:item.professionalName="{ item }">

                                            <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                                                <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_url"
                                                    alt="image"></v-img>
                                            </v-avatar>
                                            {{ item.professionalName }}
                                        </template>

                                        <template v-slot:item.clientName="{ item }">

                                            <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                                                <v-img :src="'https://api2.simplifies.cl/api/images/' + item.client_image"
                                                    alt="image"></v-img>
                                            </v-avatar>
                                            {{ item.clientName }}
                                        </template>
                                        <template v-slot:item.name="{ item }">

                                            <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                                                <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image"
                                                    alt="image"></v-img>
                                            </v-avatar>
                                            {{ item.name }}
                                        </template>
                                        <template v-slot:item.price="{ item }">
                {{ formatNumber(item.price)}}                                  
                                          </template>
                                        <template v-slot:top>
                                            <v-divider class="mx-4" inset vertical></v-divider>
                                            <v-spacer></v-spacer>
                                        </template>

                                        <template v-slot:item.actions="{ item }">
                                            <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-close" @click="editItemOrder(item)"
                                                color="red-darken-4" variant="tonal" elevation="1" title="Denegar Solicitud"></v-btn>
                                            <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-check" @click="deleteItemOrder(item)"
                                                color="primary" variant="tonal" elevation="1" title="Aceptar la solicitud y eliminar la orden"></v-btn>
                                        </template>
                                    </v-data-table>
                                </v-window-item>
                                <v-window-item value="tree">
                                    <v-text-field class="mt-1 mb-1" v-model="search3" append-icon="mdi-magnify"
                                        label="Buscar" single-line hide-details></v-text-field>


                                    <v-data-table :headers="headers2" :items-per-page-text="'Elementos por páginas'"
                                        :items="results2" :search="search3" class="elevation-1"
                                        no-results-text="No hay datos disponibles"
                                        no-data-text="No hay datos disponibles">

                                        <template v-slot:item.professionalName="{ item }">

                                            <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                                                <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_url"
                                                    alt="image"></v-img>
                                            </v-avatar>
                                            {{ item.professionalName }}
                                        </template>
                                        <template v-slot:item.productName="{ item }">

                                            <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                                                <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_product"
                                                    alt="image"></v-img>
                                            </v-avatar>
                                            {{ item.productName }}
                                        </template>
                                        <template v-slot:item.price="{ item }">
                {{ formatNumber(item.price)}}                                  
                                          </template>
                                        <template v-slot:top>
                                            <v-divider class="mx-4" inset vertical></v-divider>
                                            <v-spacer></v-spacer>
                                        </template>

                                        <template v-slot:item.actions="{ item }">
                                            <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-close" @click="editItemProduct(item)"
                                                color="red-darken-4" variant="tonal" elevation="1" title="Denegar Solicitud"></v-btn>
                                            <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-check" @click="deleteItemProduct(item)"
                                                color="primary" variant="tonal" elevation="1" title="Aceptar la solicitud y eliminar la producto"></v-btn>
                                        </template>
                                    </v-data-table>
                                </v-window-item>
                            </v-window>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>

import axios from "axios";
import LocalStorageService from "@/LocalStorageService";

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
    data: () => ({
        tabBar: null,
        valid: true,
        snackbar: false,
        sb_type: '',
        sb_message: '',
        sb_timeout: 2000,
        sb_title: '',
        sb_icon: '',
        branch_id: '',
        charge: '',
        business_id: '',
        professional_id: '',
        branches: [],
        search: '',
        search2: '',
        search3: '',
        mostrarFila: false,
        headers: [
            { title: 'No', value: 'id' },
            { title: 'Sucursal', value: 'nameBranch' },
            { title: 'Profesional', value: 'professionalName' },
            { title: 'Cliente', value: 'clientName' },
            { title: 'Técnico', value: 'technical_assistance' },
            { title: 'Productos', value: 'product' },
            { title: 'Servicios', value: 'service' },
            { title: 'Propina', value: 'tip' },
            { title: 'Monto Total', value: 'amount' },
            { title: 'Acciones', key: 'actions', sortable: false },
        ],
        headers1: [
            { title: 'Sucursal', value: 'nameBranch' },
            { title: 'Carro', value: 'car_id' },
            { title: 'Profesional', value: 'professionalName' },
            { title: 'Cliente', value: 'clientName' },
            { title: 'Nombre', value: 'name' },
            { title: 'Categoría', value: 'category' },
            { title: 'Importe', value: 'price' },
            { title: 'Acciones', key: 'actions', sortable: false },
        ],
        headers2: [
            { title: 'No', value: 'id' },
            { title: 'Sucursal', value: 'nameBranch' },
            { title: 'Profesional', value: 'professionalName' },
            { title: 'Producto', value: 'productName' },
            { title: 'Precio', value: 'price' },
            { title: 'Cantidad', value: 'cant' },
            { title: 'Acciones', key: 'actions', sortable: false },
        ],
        results: [],
        results1: [],
        results2: [],
    }),

    computed: {

    },

    watch: {

    },

    mounted() {
        this.business_id = LocalStorageService.getItem('business_id');
        this.branch_id = LocalStorageService.getItem('branch_id');
        this.charge_id = LocalStorageService.getItem('charge_id');
        this.charge = JSON.parse(LocalStorageService.getItem("charge"));
        this.professional_id = LocalStorageService.getItem('professional_id');
       this.initialize();
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

        initialize() {
            LocalStorageService.setIsLocked(true);
            axios
                .get('https://api2.simplifies.cl/api/branch-cars-delete', {
                    params: {
                        branch_id: this.branch_id
                    }
                })
                .then((response) => {
                    this.results = response.data.cars;
                    this.results1 = response.data.orders;
                    this.results2 = response.data.cashier;
                    console.log('this.results2 productos');
                    console.log(this.results2);
                }).finally(() => {
            LocalStorageService.setIsLocked(false);
        });
        },

        deleteItem(item) {
            LocalStorageService.setIsLocked(true);
            let request = {
                id: item.id,
                professional_id: this.professional_id
            };
            axios
                .post('https://api2.simplifies.cl/api/car-destroy', request)
                .then(() => {
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.initialize();
                    this.showAlert("success", "Carro eliminado correctamente", 3000)
                });
        },

        editItem(item) {
            LocalStorageService.setIsLocked(true);
            let request = {
                id: item.id,
                professional_id: this.professional_id
            };
            axios
                .post('https://api2.simplifies.cl/api/car-denegada', request)
                .then(() => {
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.initialize();
                    this.showAlert("success", "Solicitud denegada correctamente", 3000)
                });
        },



        //eliminar orden
        deleteItemOrder(item) {
            LocalStorageService.setIsLocked(true);
            let request = {
                id: item.id,
                professional_id: this.professional_id
            };
            axios
                .post('https://api2.simplifies.cl/api/order-destroy-web', request)
                .then(() => {
                    //this.initialize();
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.initialize();
                    this.showAlert("success", "Orden eliminada correctamente", 3000);
                });
        },

        editItemOrder(item) {
            LocalStorageService.setIsLocked(true);
            let request = {
                id: item.id,
                professional_id: this.professional_id
            };
            axios
                .post('https://api2.simplifies.cl/api/order-denegar', request)
                .then(() => {
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.initialize();
                    this.showAlert("success", "Solicitud denegada correctamente", 3000)
                });
        },

         //eliminar orden
         deleteItemProduct(item) {
            LocalStorageService.setIsLocked(true);
            let request = {
                id: item.id,
                professional_id: this.professional_id
            };
            axios
                .post('https://api2.simplifies.cl/api/cashiersale-destroy', request)
                .then(() => {
                    //this.initialize();
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.initialize();
                    this.showAlert("success", "Productos eliminados correctamente", 3000);
                });
        },
        //eliminar productos
        editItemProduct(item) {
            LocalStorageService.setIsLocked(true);
            let request = {
                id: item.id,
                professional_id: this.professional_id
            };
            axios
                .post('https://api2.simplifies.cl/api/cashiersale-denegar', request)
                .then(() => {
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.initialize();
                    this.showAlert("success", "Solicitud denegada correctamente", 3000)
                });
        },

    },
}
</script>