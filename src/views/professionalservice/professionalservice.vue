<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container fluid>
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
          <v-container fluid>
            <v-col cols="12" sm="12" md="6">
              <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches"
                v-if="this.mostrarFila" clearable label="Seleccione una Sucursal" prepend-icon="mdi-store"
                item-title="name" item-value="id" variant="underlined"
                @update:model-value="initialize()"></v-autocomplete>
            </v-col>

          </v-container>
        </v-row>
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="5">
              <v-card elevation="2">
                <v-tabs v-model="tabBarprof" color="rgb(241, 130, 84)" elevation="6">
                  <v-tab value="oneProf">Lista de Trabajadores</v-tab>
                </v-tabs>
                <v-window v-model="tabBarprof">
                  <v-window-item value="oneProf">
                    <v-card elevation="2">
                      <v-list>
                        <v-list-item-group v-model="professional" active-class="deep-purple--text text--accent-4">

                          <v-list-item :prepend-avatar="'https://api2.simplifies.cl/api/images/' + professional.image_url"
                            v-for="professional in professionals" :key="professional.id"
                            @click="toggleService2(professional.id)"
                            :class="{ 'selected-item': isProfessional(professional.id) }">

                            <v-list-item-content>
                              <v-list-item-title>{{ professional.name}}</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>


                        </v-list-item-group>
                      </v-list>
                    </v-card>

                  </v-window-item>
                </v-window>

              </v-card>
            </v-col>
            <v-col cols="12" md="7">
              <v-card elevation="2">
                <v-tabs v-model="tabBar" color="rgb(241, 130, 84)" elevation="6"><!-- @click="handleTabChange"-->
                  <v-tab value="one">Lista de Servicios</v-tab>
                  <v-tab value="two">Servicios Asignados</v-tab>
                  <v-tab value="tre">Servicio Meta</v-tab>
                </v-tabs>
                <v-card-text>
                  <v-window v-model="tabBar">
                    <v-window-item value="one">


                      <!-- SERVICIOS DISPONIBLES -->

                      <v-list item-props v-if="services.length > 0">
                        <v-list-item-group v-model="selectedA" active-class="deep-purple--text text--accent-4">
                          <v-list-item :prepend-avatar="'https://api2.simplifies.cl/api/images/' + service.image_service"
                            v-for="service in services" :key="service.id" @click="toggleService3(service)"
                            :class="{ 'selected-item': isSelected(service.id) }">

                            <v-list-item-content class="d-flex align-center justify-space-between">
                              {{ service.name }}
                              <v-btn :color="!isSelected(service.id) ? 'amber-darken-1' : ''"
                                :dark="isSelected(service.id)">
                                {{ service.profit_percentaje }}%
                              </v-btn>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                      <v-list item-props v-else>
                        <v-list-item>
                        No hay servicios por asignar
                        </v-list-item>
                      </v-list>
                      <v-col cols="12" md="4">
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-row v-if="services.length > 0">
                          <v-switch v-if="mostrarSwitch" color="orange-darken-3" v-model="especial" label="Especial"
                            hide-details inset></v-switch>
                          <v-text-field v-model="this.profitPercen" clearable label="% Ganancia"
                            prepend-icon="mdi-percent" variant="underlined" :disabled="!especial"
                            :rules="requiredRules">
                          </v-text-field>
                        </v-row>

                      </v-col>
                      <v-divider></v-divider>

                      <v-card-actions v-if="services.length > 0">
                        <v-spacer></v-spacer>
                        <v-btn color="#F18254" variant="flat" :disabled="!selected.length" @click="asignService">
                          Asignar
                        </v-btn>
                      </v-card-actions>




                    </v-window-item>

                    <!--          
        SERVICIOS ASIGNADOS -->
                    <v-window-item value="two">
                      <v-list item-props v-if="servicesAsig.length > 0">
                        <v-list-item-group v-model="selected" active-class="deep-purple--text text--accent-4">
                          <v-list-item :prepend-avatar="'https://api2.simplifies.cl/api/images/' + serviceA.image_service"
                            v-for="serviceA in servicesAsig" :key="serviceA.id" @click="toggleService3(serviceA)"
                            :class="{ 'selected-item': isSelected(serviceA.id) }">

                            <v-list-item-content class="d-flex align-center justify-space-between">
                              {{ serviceA.name }}
                              <v-btn :color="!isSelected(serviceA.id) ? 'amber-darken-1' : ''"
                                :dark="isSelected(serviceA.id)">
                                {{ serviceA.profit_percentaje }}% {{ serviceA.type_service }}
                              </v-btn>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider></v-divider>
                        </v-list-item-group>

                      </v-list>
                      <v-list item-props v-else>
                        <v-list-item>
                        No hay servicios asignados
                        </v-list-item>
                      </v-list>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="#F18254" variant="flat" :disabled="!selected.length" @click="desasignService">
                          Eliminar
                        </v-btn>
                      </v-card-actions>
                    </v-window-item>

                    <!--          
        SERVICIOS META -->
        <v-window-item value="tre">
                      <v-list item-props>
                        <v-list-item-group v-model="selectedM" active-class="deep-purple--text text--accent-4"  v-if="serviceMeta.length > 0">
                          <v-list-item :prepend-avatar="'https://api2.simplifies.cl/api/images/' + serviceM.image_service"
                            v-for="serviceM in serviceMeta" :key="serviceM.id" @click="toggleService3(serviceM)"
                            :class="{ 'selected-item': isSelected(serviceM.id) }">

                            <v-list-item-content class="d-flex align-center justify-space-between">
                              {{ serviceM.name }}
                              <v-btn :color="!isSelected(serviceM.id) ? 'amber-darken-1' : ''"
                                :dark="isSelected(serviceM.id)">
                                {{ serviceM.type_service }}
                              </v-btn>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider></v-divider>
                        </v-list-item-group>
                        <v-list-item-group v-model="selected" active-class="deep-purple--text text--accent-4" v-else>
                          <v-list-item :prepend-avatar="'https://api2.simplifies.cl/api/images/' + serviceA.image_service"
                            v-for="serviceA in servicesAsig" :key="serviceA.id" @click="toggleService3(serviceA)"
                            :class="{ 'selected-item': isSelected(serviceA.id) }">

                            <v-list-item-content class="d-flex align-center justify-space-between">
                              {{ serviceA.name }}
                              <v-btn :color="!isSelected(serviceA.id) ? 'amber-darken-1' : ''"
                                :dark="isSelected(serviceA.id)">
                                {{ serviceA.type_service }}
                              </v-btn>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider></v-divider>
                        </v-list-item-group>
                      </v-list>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="#F18254" variant="flat" v-if="!serviceMeta.length" :disabled="!selected.length" @click="metaService">
                          Seleccionar Servicio Meta
                        </v-btn>
                        <v-btn color="#F18254" variant="flat" v-if="serviceMeta.length" :disabled="!selected.length" @click="metaServiceDelete">
                          Eliminar Servicio Meta
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
    barberAleatorie: false,
    verificate: false,
    mostrarSwitch: false,
    clientRegister: [],
    radios: 'ClientNo',
    message: "Los datos para realizar la reserva están completos. Se enviará correo electrónico con los datos de la reserva",
    checkbox: false,
    name_client: "",
    email_client: "",
    email_client2: "",
    phone_client: "",
    selected_interval: "",
    surname_client: "",
    second_surname: "",
    dayOK: "",
    selected_professional: "",
    date: "",
    focus: '',
    start_time1: '',
    array_services: [],
    selectedServiceType: [],
    profitPercentaje: [],
    showPercent: false,
    profitPercen: '',
    type_service: '',
    especial: false,
    mostrarFila: false,
    branch_id: '',
    charge_id: '',
    business_id: '',
    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
    tabBarprof: null,

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
    selectedM: [],
    serviceMeta: [],
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
  watch: {
    especial: function (val) {
      if (val) {
        this.profitPercen = '';
      }
      else {
        this.profitPercen = this.profitPercentaje;
      }
    },
  },
  mounted() {
    this.business_id = LocalStorageService.getItem('business_id');
    this.charge_id = LocalStorageService.getItem('charge_id');
    this.branch_id = LocalStorageService.getItem('branch_id');
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
        this.initialize();
      });

    this.arrayEvents = [...Array(1)].map(() => {
      const day = Math.floor(Math.random() * 30)
      const d = new Date()
      d.setDate(day)


      return "2023-11-24"
    })
  },

  methods:
  {
    handleTabChange() {
      //if (this.professional.length !== 0) {
      if (this.tabBar === 'one') {
        this.selected = [];
        this.selectedA = [];
        this.selectedM = [];
        //this.getServicesProfessional();
      } else if (this.tabBar === 'two') {
        this.selected = [];
        this.selectedA = [];
        this.selectedM = [];
        //this.getServicesProfessional();
      }else if (this.tabBar === 'tre') {
        this.selected = [];
        this.selectedA = [];
        this.selectedM = [];
        //this.getServicesProfessional();
      }
      //}
    },
    /*isSelected(serviceId) {
      console.log('entra a seleccionado');
      console.log(this.selected.id == serviceId);
      return this.selected.id == serviceId;
    },*/
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
      //this.chargeServices();
      //this.chargeCalendarsBranches();
      this.chargeProfessionals();
    },

    desasignService() {
      LocalStorageService.setIsLocked(true);
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
        .post('https://api2.simplifies.cl/api/professionalservice-destroy', request)
        .then(() => {
          LocalStorageService.setIsLocked(false);
          this.showAlert("success", "Desasignado correctamente", 3000);
          this.profitPercen = '';
          this.getServicesProfessional();
          //this.handleTabChange('two');
          //this.professional = '';
          this.selected = '';
        }).catch(error => {
          // Maneja cualquier error que pueda ocurrir durante la solicitud
          console.log(error);
          this.showAlert("warning", "Error al hacer la asignación".error, 3000);

        });

    },
    asignService()//todooo
    {
      LocalStorageService.setIsLocked(true);
      console.log('*********DATOS POARA ENVIAR PARA LA API***************');
      console.log('this.profitPercen');
      console.log(this.profitPercen);
      console.log('this.professional');
      console.log(this.professional[0]);
      console.log('this.selected');
      console.log(this.selected[0]);
      console.log('type_service');
      console.log(this.type_service);
      console.log('this.especial');
      console.log(this.especial);
      if (this.especial === true) {
        this.type_service = 'Especial';
      }
      else {
        this.type_service = 'Regular';
      }
      let request = {
        professional_id: this.professional[0],
        branch_service_id: this.selected[0],
        percent: this.profitPercen,
        type_service: this.type_service

      }

      console.log('request');
      console.log(request);

      axios.post('https://api2.simplifies.cl/api/professionalservice', request)
        .then(() => {
          LocalStorageService.setIsLocked(false);
          this.showAlert("success", "Servicio asignado correctamente", 3000);
          this.profitPercen = '';
          //this.professional = '';
          //this.handleTabChange('one');
          this.getServicesProfessional();
          this.selected = '';
          this.especial = false;
          this.type_service = '';
        }).catch(error => {
          // Maneja cualquier error que pueda ocurrir durante la solicitud
          this.showAlert("warning", "Error al hacer la asignación", 3000);
          this.profitPercen = '';
          this.especial = false;
        });
    },
    metaService() {
      LocalStorageService.setIsLocked(true);
        console.log('*********DATOS POARA ENVIAR PARA LA API***************');
        console.log('this.professional');
        console.log(this.professional[0]);
        console.log('this.selected');
        console.log(this.selected[0]);
        let request = {
          professional_id: this.professional[0],
          branch_service_id: this.selected[0],
          meta: 1
        }
        //CAMBIAR ESTA RUTA POR LA RUTA CORRECTA DE DESASIGNAR SERVICIO AL PROFESIONAL
        axios
          .post('https://api2.simplifies.cl/api/professionalservice-meta', request)
          .then(() => {
            LocalStorageService.setIsLocked(false);
            this.showAlert("success", "Servicio Asignado como meta", 3000);
            this.profitPercen = '';
            this.getServicesProfessional();
            //this.handleTabChange('two');
            //this.professional = '';
            this.selected = '';
          }).catch(error => {
            // Maneja cualquier error que pueda ocurrir durante la solicitud
            console.log(error);
            this.showAlert("warning", "Error al hacer la asignación".error, 3000);

      });

    },

    metaServiceDelete() {
      LocalStorageService.setIsLocked(true);
console.log('*********DATOS POARA ENVIAR PARA LA API***************');
console.log('this.professional');
console.log(this.professional[0]);
console.log('this.selected');
console.log(this.selected[0]);
let request = {
  professional_id: this.professional[0],
  branch_service_id: this.selected[0],
  meta: 0
}
//CAMBIAR ESTA RUTA POR LA RUTA CORRECTA DE DESASIGNAR SERVICIO AL PROFESIONAL
axios
  .post('https://api2.simplifies.cl/api/professionalservice-meta', request)
  .then(() => {
    LocalStorageService.setIsLocked(false);
    this.showAlert("success", "Servicio Asignado como meta", 3000);
    this.profitPercen = '';
    this.getServicesProfessional();
    //this.handleTabChange('two');
    //this.professional = '';
    this.selected = '';
  }).catch(error => {
    // Maneja cualquier error que pueda ocurrir durante la solicitud
    console.log(error);
    this.showAlert("warning", "Error al hacer la asignación".error, 3000);

});

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
      this.name_client = '';
      this.phone_client = '';
      this.surname_client = '';
      this.second_surname = '';
      this.email_client = '';

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
      //this.getServicesProfessional();

    },

    getServicesProfessional() {
      LocalStorageService.setIsLocked(true);
      //LLAMAR AL METODO
      //DADO EL ID DEL PROFESSIONAL Y LA BRANCH
      const idProfessional = this.professional[0];
      const idBranch = this.branch_id;
      this.servicesAsig = [];
      this.services = [];
      console.log('this.servicesAsig');
      console.log(this.servicesAsig);
      console.log('this.services');
      console.log(this.services);
      //AXIOS
      axios
        .get(`https://api2.simplifies.cl/api/services-professional-branch`, {
          params: {
            branch_id: idBranch,
            professional_id: idProfessional,
          }
        })
        .then((response) => {
          LocalStorageService.setIsLocked(false);
          console.log(response.data.metaData)
          //this.services = response.data.branchServices;
          this.servicesAsig = response.data.assignedServices;
          this.services = response.data.unassignedServices;
          this.serviceMeta = response.data.metaData;
          if (this.services && this.services.length > 0) {
            this.mostrarSwitch = true;
            console.log('this.mostrarSwitch');
            console.log(this.mostrarSwitch);
          } else {
            this.mostrarSwitch = false;
            console.log('this.mostrarSwitch');
            console.log(this.mostrarSwitch);
          }
        })
        .catch((err) => {
          console.log(err, "error");

        });

    },
    /*getServicesProfessional() {
      //LLAMAR AL METODO
      //DADO EL ID DEL PROFESSIONAL Y LA BRANCH

      const idProfessional = this.professional[0];
      const idBranch = this.branch_id;

      //AXIOS
      axios
        .get(`https://api2.simplifies.cl/api/services-professional-branch`, {
          params: {
            branch_id: idBranch,
            professional_id: idProfessional,
          }
        })
        .then((response) => {
          console.log(response.data)
          this.servicesAsig = response.data.assignedServices;
          this.services = response.data.unassignedServices;
        })
        .catch((err) => {
          console.log(err, "error");

        });

    },*/
    toggleService3(service) {
      const index = this.selected.indexOf(service.id);

      if (index > -1) {
        // Si el servicio ya está seleccionado, no hagas nada
        return;
      }

      // Limpiar la selección anterior y agregar el nuevo servicio seleccionado
      this.selected = [service.id];
      this.selectedServiceType = [service.type_service];
      this.profitPercentaje = service.profit_percentaje;
      //
      //
      console.log('this.profitPercentaje');
      console.log(this.selected);
      console.log(this.selectedServiceType);
      console.log(this.profitPercentaje);
      this.profitPercen = this.profitPercentaje;

      //this.typeService(this.selectedServiceType[0],this.profitPercentaje[0]);


    },
    /*chargeServices() {
      axios
        .get(`https://api2.simplifies.cl/api/professionalservice-show`, {
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
    },*/

    chargeProfessionals() {
      LocalStorageService.setIsLocked(true);
      //const newArrayService = valueServices.map(item => parseInt(item)); // Convertir a enteros si es necesario
      //console.log(newArrayService);
      this.servicesAsig = [];
      this.services = [];
      this.professional = [];
      console.log('this.professional');
      console.log(this.professional);
      console.log('this.servicesAsig');
      console.log(this.servicesAsig);
      console.log('this.services');
      console.log(this.services);
      const data = {

        //services: newArrayService,
        branch_id: this.branch_id
        // branch_id: this.selected_branch.id
      };

      //this.array_services = newArrayService;
      axios
        .get(`https://api2.simplifies.cl/api/branch-professionals-barber-totem`, {
          params: data
        })
        .then((response) => {
          LocalStorageService.setIsLocked(false);
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
  background-color: rgb(241, 130, 84)
    /* Color de fondo deseado */
    /* Otros estilos si es necesario */
}
</style>