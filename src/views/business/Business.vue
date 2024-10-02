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
        <v-col cols="12" md="5" class="grow ml-4">
          <span class="text-subtitle-1"> <strong>Negocios</strong></span>
        </v-col>
        <v-col cols="12" md="6" class="text-right">
          <v-btn class="text-subtitle-1" color="#E7E9E9" variant="flat" elevation="2" prepend-icon="mdi-finance"
            @click="showWinnerBranch()">
            Ganancias Por Sucursales
          </v-btn>
          <v-btn class="text-subtitle-1  ml-1" color="#E7E9E9" variant="flat" elevation="2"
            prepend-icon="mdi-plus-circle" :disabled="mostrar" @click="showAddNegocio()">
            Nuevo Negocio
          </v-btn>
          <v-dialog v-model="dialog" max-width="800px">
            <v-card>
              <v-toolbar color="#F18254">
                <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form" v-model="valid" enctype="multipart/form-data">
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.name" clearable label="Nombre del Negocio"
                          prepend-icon="mdi-ruler" variant="underlined" :rules="nameRules">
                        </v-text-field>
                      </v-col>                      
                      <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.address" clearable label="Dirección"
                          prepend-icon="mdi-form-textarea" variant="underlined" :rules="dirRules">
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.professional_id"
                          :items="professionals" clearable label="Propietario" prepend-icon="mdi-account-tie-outline"
                          item-title="name" item-value="id" variant="underlined" :rules="selectRules"></v-autocomplete>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.api_url" clearable label="Url del API"
                          prepend-icon="mdi-ruler" variant="underlined">
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                    <!-- Primera columna -->
                    <v-col cols="12" md="6">
                        <v-menu v-model="menu3" :close-on-content-click="false" :nudge-right="40"
                          transition="scale-transition" offset-y min-width="290px">
                          <template v-slot:activator="{ props }">
                            <v-text-field v-bind="props" v-model="formattedStartDate" variant="underlined"
                              prepend-icon="mdi-calendar" label="Fecha inicial"></v-text-field>
                          </template>
                          <v-locale-provider locale="es">
                            <v-date-picker color="orange lighten-2" @input="menu3" v-model="editedItem.start_date"
                              header="Calendario" title="Seleccione la fecha" :min="new Date(
                                Date.now() -
                                new Date().getTimezoneOffset() * 60000
                              )
                                .toISOString()
                                .substr(0, 10)
                                " :max="formattedEndDate" @update:modelValue="updateDate5"></v-date-picker>
                          </v-locale-provider>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-menu v-model="menu4" :close-on-content-click="false" :nudge-right="40"
                          transition="scale-transition" offset-y min-width="290px">
                          <template v-slot:activator="{ props }">
                            <v-text-field v-bind="props" v-model="formattedEndDate" variant="underlined"
                              prepend-icon="mdi-calendar" label="Fecha final"></v-text-field>
                          </template>
                          <v-locale-provider locale="es">
                            <v-date-picker color="orange lighten-2" @input="menu4" v-model="editedItem.end_date"
                              header="Calendario" title="Seleccione la fecha" :min="formattedStartDate
                                " @update:modelValue="updateDate4"></v-date-picker>
                          </v-locale-provider>
                        </v-menu>
                      </v-col>
                    </v-row>
                    
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-file-input clearable v-model="file" ref="fileInput" label="Imagen del Negocio"
                        variant="underlined" density="compact" name="file" accept=".png, .jpg, .jpeg"
                        @change="onFileSelected">
                      </v-file-input>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                        <img v-if="imagenDisponible()" :src="imgedit" height="120" width="210">
                      </v-card>


                    </v-col>
                  </v-row><br>
                  </v-container>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#E7E9E9" variant="flat" @click="close">
                      Cancelar
                    </v-btn>
                    <v-btn color="#F18254" variant="flat" @click="save" :disabled="!valid">
                      Aceptar
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>

              <v-toolbar color="red">
                <span class="text-subtitle-2 ml-4"> Eliminar Negocio</span>
              </v-toolbar>

              <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el negocio?</v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="closeDelete">
                  Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" @click="deleteItemConfirm">
                  Aceptar
                </v-btn>

              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-card-text>
      <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="results"
        class="elevation-1" :locale="locale" no-results-text="No hay datos disponibles"
        no-data-text="No hay datos disponibles" :loading="loadingBusiness" loading-text="Cargando datos...">
        <template v-slot:item.actions="{ item }">
          <v-btn density="comfortable" icon="mdi-finance" @click="showWinner()" color="green" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Ganancias del Negocio"></v-btn>
          <v-btn density="comfortable" icon="mdi-pencil" @click="editItem(item)" color="primary" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Editar Negocio"></v-btn>
          <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar Negocio"></v-btn>
        </template>
        <template v-slot:item.name="{ item }">

        <v-avatar class="mr-1" elevation="3" color="grey-lighten-4" size="large">
          <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_url" alt="image"></v-img>
        </v-avatar><!--+'?$'+Date.now()-->
        {{ item.name }}
        </template>
      </v-data-table>
    </v-card-text>
    <!--Reportes Ganancia Business-->
    <v-dialog v-model="dialogShowWinner" fullscreen transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar color="#F18254">
          <span class="text-h6 ml-4">Monto generado</span>
          <v-spacer></v-spacer>
          <v-btn class="text-subtitle-1  ml-12" color="#E7E9E9" variant="flat" elevation="2"
            prepend-icon="mdi-file-excel" @click="exportToExcel">
            Exportar a Excel
          </v-btn>
        </v-toolbar>
        <v-container>
          <v-row>
            <!-- Primera columna -->
            <v-col cols="12" sm="6" md="3">
              <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                offset-y min-width="290px" multiple>
                <template v-slot:activator="{ props }">
                  <v-text-field v-bind="props" :modelValue="dateFormatted" variant="outlined"
                    append-inner-icon="mdi-calendar" label="Fecha inicial" multiple></v-text-field>
                </template>
                <v-locale-provider locale="es">
                  <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2"
                    :modelValue=input @update:modelValue="updateDate" format="yyyy-MM-dd"
                    :max="dateFormatted2"></v-date-picker>
                </v-locale-provider>
              </v-menu>
            </v-col>
            <!-- Segunda columna -->
            <v-col cols="12" sm="6" md="3">
              <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                offset-y min-width="290px">
                <template v-slot:activator="{ props }">
                  <v-text-field v-bind="props" :modelValue="dateFormatted2" variant="outlined"
                    append-inner-icon="mdi-calendar" label="Fecha final"></v-text-field>
                </template>
                <v-locale-provider locale="es">
                  <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2"
                    :modelValue="getDate2" @update:modelValue="updateDate1" format="yyyy-MM-dd"
                    :min="dateFormatted"></v-date-picker>
                </v-locale-provider>
              </v-menu>
            </v-col>
            <v-col cols="12" md="1">
              <v-btn icon @click="updateDate2" color="#F18254">
                <v-icon>mdi-magnify</v-icon></v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-container>
          <v-alert border type="info" variant="outlined" density="compact">
            <p v-html="formTitleWin"></p>
          </v-alert>
        </v-container>
        <v-card-text>
          <v-text-field class="mt-1 mb-1" v-model="search2" append-icon="mdi-magnify" label="Buscar" single-line
            hide-details></v-text-field>
          <v-data-table :headers="headers1" :items-per-page-text="'Elementos por páginas'" :items="winners"
            :search="search2" class="elevation-2" no-results-text="No hay datos disponibles"
            no-data-text="No hay datos disponibles" :loading="loadingWinners" loading-text="Cargando datos...">
            <template v-slot:item.tip="{ item }">
              <v-chip v-if="item.tip > 0" class="text-uppercase font-weight-bold" size="small" label> {{
                formatNumber(item.tip)}}</v-chip>
            </template>
            <template v-slot:item.earnings="{ item }">
              <v-chip v-if="item.earnings > 0" class="text-uppercase font-weight-bold" size="small" label> {{
                formatNumber(item.earnings)}}</v-chip>
            </template>
            <template v-slot:item.total="{ item }">
              <v-chip v-if="item.total > 0" class="text-uppercase font-weight-bold" size="small" label> {{
                formatNumber(item.total)}}</v-chip>
            </template>
            <template v-slot:item.academia="{ item }">
              <v-chip v-if="item.academia > 0" class="text-uppercase font-weight-bold" size="small" label> {{
                formatNumber(item.academia)}}</v-chip>
            </template>
            <template v-slot:item.technical_assistance="{ item }">
              <v-chip v-if="item.technical_assistance > 0" class="text-uppercase font-weight-bold" size="small" label>
                {{
                  formatNumber(item.technical_assistance)}}</v-chip>
            </template>
          </v-data-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#E7E9E9" variant="flat" @click="closeShowWinner">
            Volver
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--end Ganancias Busuness-->
    <!--Reporte Ganancias Branches-->
    <v-dialog v-model="dialogShowWinnerBranches" fullscreen transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar color="#F18254">
          <span class="text-h6 ml-4">Monto generado por sucursales</span>
          <v-spacer></v-spacer>
          <v-btn class="text-subtitle-1  ml-12" color="#E7E9E9" variant="flat" elevation="2"
            prepend-icon="mdi-file-excel" @click="exportToExcel1">
            Exportar a Excel
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <v-row>
            <!-- Primera columna -->
            <v-col cols="12" md="3">
              <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                offset-y min-width="290px" multiple>
                <template v-slot:activator="{ props }">
                  <v-text-field v-bind="props" :modelValue="dateFormatted" variant="outlined"
                    append-inner-icon="mdi-calendar" label="Fecha inicial" multiple></v-text-field>
                </template>
                <v-locale-provider locale="es">
                  <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2"
                    :modelValue=input @update:modelValue="updateDate" format="yyyy-MM-dd"
                    :max="dateFormatted2"></v-date-picker>
                </v-locale-provider>
              </v-menu>
            </v-col>
            <!-- Segunda columna -->
            <v-col cols="12" md="3">
              <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                offset-y min-width="290px">
                <template v-slot:activator="{ props }">
                  <v-text-field v-bind="props" :modelValue="dateFormatted2" variant="outlined"
                    append-inner-icon="mdi-calendar" label="Fecha final"></v-text-field>
                </template>
                <v-locale-provider locale="es">
                  <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2"
                    :modelValue="getDate2" @update:modelValue="updateDate1" format="yyyy-MM-dd"
                    :min="dateFormatted"></v-date-picker>
                </v-locale-provider>
              </v-menu>
            </v-col>
            <v-col cols="12" md="1">
              <v-btn icon @click="updateDate3" color="#F18254">
                <v-icon>mdi-magnify</v-icon></v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-row>
          <v-col cols="12" md="12">
            <v-container fluid>
              <v-alert border type="info" variant="outlined" density="compact">
                <p v-html="formTitleWinB"></p>
              </v-alert>
            </v-container>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12">
            <v-card-text>
              <v-text-field class="mt-1 mb-1" v-model="search3" append-icon="mdi-magnify" label="Buscar" single-line
                hide-details></v-text-field>
              <v-data-table :headers="headers2" :items-per-page-text="'Elementos por páginas'" :items="winnersbranches"
                :search="search3" class="elevation-2" no-results-text="No hay datos disponibles"
                no-data-text="No hay datos disponibles" :loading="loadingWinnerBranch" loading-text="Cargando datos...">
                <template v-slot:item.tip="{ item }">
                  <v-chip class="text-uppercase font-weight-bold" size="small" label> {{
                    formatNumber(item.tip) }}</v-chip>
                </template>
                <template v-slot:item.earnings="{ item }">
                  <v-chip class="text-uppercase font-weight-bold" size="small" label> {{
                    formatNumber(item.earnings) }}</v-chip>
                </template>
                <template v-slot:item.technical_assistance="{ item }">
                  <v-chip class="text-uppercase font-weight-bold" size="small" label> {{
                    formatNumber(item.technical_assistance) }}</v-chip>
                </template>
                <template v-slot:item.servicesAmount="{ item }">
                  <v-chip class="text-uppercase font-weight-bold" size="small" label> {{
                    formatNumber(item.servicesAmount) }}</v-chip>
                </template>
                <template v-slot:item.productsAmount="{ item }">
                  <v-chip class="text-uppercase font-weight-bold" size="small" label> {{
                    formatNumber(item.productsAmount) }}</v-chip>
                </template>
                <template v-slot:item.total="{ item }">
                  <v-chip class="text-uppercase font-weight-bold" size="small" label> {{
                    formatNumber(item.total) }}</v-chip>
                </template>
              </v-data-table>
            </v-card-text>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#E7E9E9" variant="flat" @click="closeShowWinnerBranches">
            Volver
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--end Ganancias Branches-->
  </v-card>
</template>

<script>

import axios from "axios";
import { format } from "date-fns";
import { useDate } from 'vuetify';
import * as XLSX from 'xlsx';
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
    loadingBusiness: true,
    loadingWinners: true,
    loadingWinnerBranch: true,
    valid: true,
    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
    mostrar: false,
    file: null,
    imgMiniatura: '',

    dialog: false,
    dialogDelete: false,
    headers: [

      { title: 'Negocio', value: 'name' },
      { title: 'Dirección', value: 'address' },
      { title: 'Propietario', value: 'professional.name' },
      { title: 'Fecha de Inicio', value: 'start_date' },
      { title: 'Fecha Final', value: 'end_date' },
      { title: 'Código', value: 'code' },
      { title: 'API', value: 'api_url' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    headers1: [
      { title: 'Negocio', key: 'name', sortable: false },
      { title: 'Propina', key: 'tip', sortable: false },
      { title: 'Monto', key: 'earnings', sortable: false },
      { title: 'Asistencia Técnica', key: 'technical_assistance', sortable: false },
      { title: 'Academia', key: 'academia', sortable: false },
      { title: 'Total', key: 'total', sortable: false }
    ],
    headers2: [
      { title: 'Sucursal', key: 'name', sortable: false },
      { title: 'Propina', key: 'tip', sortable: false },
      { title: 'Servicios', key: 'servicesAmount', sortable: false },
      { title: 'Productos', key: 'productsAmount', sortable: false },
      { title: 'Monto', key: 'earnings', sortable: false },
      { title: 'Asistencia Técnica', key: 'technical_assistance', sortable: false },
      { title: 'Total', key: 'total', sortable: false }
    ],
    locale: {
      itemsPerPageText: 'Elementos por página:',
      pageText: '{0}-{1} de {2}',
      noDataText: 'No hay datos disponibles',
    },
    results: [],

    professionals: [],

    editedIndex: -1,
    editedIndexWin: -1,
    editedIndexWinB: -1,

    editedItem: {
      id: '',
      name: '',
      address: '',
      professional_id: '',
      start_date: null,
      end_date: null,
      api_url: ''
    },
    data: {},

    defaultItem: {
      name: '',
      address: '',
      professional_id: '',
      start_date: null,
      end_date: null,
      api_url: ''
    },
    //reporte variables
    dialogShowWinner: false,
    dialogShowWinnerBranches: false,
    menu: false,
    menu2: false,
    input: null,
    input2: null,
    menu3: false,
    menu4: false,
    input3: null,
    input4: null,
    winners: [],
    winnersbranches: [],
    fecha: '',
    search2: '',
    search3: '',
    //endReporte

    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) ||
        "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) ||
        "El campo debe tener al menos de 3 caracteres",
    ],
    dirRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 250) ||
        "El campo debe tener menos de 251 caracteres",
      (v) => (v && v.length >= 3) ||
        "El campo debe tener al menos de 3 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
  }),
  setup() {
    const adapter = useDate()

    const parseDate = (dateString) => {
      return adapter.parseISO(dateString)
    }

    return {
      parseDate
    }
  },

  computed: {
    formattedStartDate() {
      if (this.editedItem.start_date) {
        console.log('this.editedItem.startDate datos');
        console.log(this.editedItem.start_date);
        const date = new Date(this.editedItem.start_date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        console.log(`${year}-${month}-${day}`);

        return `${year}-${month}-${day}`;
      }
      return "";

    },
    formattedEndDate() {
      if (this.editedItem.end_date) {
        console.log('this.editedItem.endDate');
        console.log(this.editedItem.end_date);
        const date = new Date(this.editedItem.end_date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        console.log(`${year}-${month}-${day}`);
        return `${year}-${month}-${day}`;

      }
      return "";
    },
    imgedit() {
      return this.imgMiniatura;
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Negocio' : 'Editar Negocio'
    },
    formTitleWin() {
      if (this.editedIndexWin === 2) {
        const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
        const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
        return `Monto generado en el período [<strong>${startDate}</strong> - <strong>${endDate}</strong>]`;
      }
      else {
        return `Monto generado en día`;
      }
    },
    formTitleWinB() {
      if (this.editedIndex === 2) {
        const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
        const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
        return `Monto generado por Sucursales en el período [<strong>${startDate}</strong> - <strong>${endDate}</strong>]`;
      }
      else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fecha = format(new Date(), "yyyy-MM-dd");
        return `Monto generado por Sucursales en el día`;
      }
    },
    dateFormatted() {
      const date = this.input ? new Date(this.input) : new Date();
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    dateFormatted2() {
      const date = this.input2 ? new Date(this.input2) : new Date();
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    /*dateFormatted3() {
      const date = this.input3 ? new Date(this.input3) : new Date();
      const day = date.getDate3().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    dateFormatted4() {
      const date = this.input4 ? new Date(this.input4) : new Date();
      const day = date.getDate4().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },*/
    getDate() {
      return this.input ? new Date(this.input) : new Date();
    },
    getDate2() {
      return this.input2 ? new Date(this.input2) : new Date();
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  mounted() {
    this.business_id = parseInt(LocalStorageService.getItem("business_id"));
    this.initialize();
    if (!this.result) {
      this.mostrar = true;
    }
  },

  methods: {
    showAlert(sb_type, sb_message, sb_timeout) {
      this.sb_type = sb_type;

      if (sb_type == "success") {
        this.sb_title = "Éxito";
        this.sb_icon = "mdi-check-circle";
      }

      if (sb_type == "error") {
        this.sb_title = "Error";
        this.sb_icon = "mdi-check-circle";
      }

      if (sb_type == "warning") {
        this.sb_title = "Advertencia";
        this.sb_icon = "mdi-alert-circle";
      }
      this.sb_message = sb_message;
      this.sb_timeout = sb_timeout;
      this.snackbar = true;
    },
    imagenDisponible() {
      if (this.imgedit !== undefined && this.imgedit !== '') {
        // Intenta cargar la imagen en un elemento oculto para verificar si está disponible
        let img = new Image();
        img.src = this.imgedit;
        return true; // Devuelve true si la imagen está disponible
      }
      return false; // Si la URL de la imagen no está definida o está vacía, devuelve false
    },
    onFileSelected(event) {
      let file = event.target.files[0];
      this.editedItem.image_url = file;
      //console.log(this.editedItem.image_cardgift);
      this.cargarImage(file);
    },
    cargarImage(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imgMiniatura = e.target.result;
      }
      reader.readAsDataURL(file);
    },
    initialize() {
      this.loadingBusiness = true;
      LocalStorageService.setIsLocked(true);
      axios
        .get('https://api2.simplifies.cl/api/business')
        .then((response) => {
          this.results = response.data.business;
          this.professionals = response.data.professionals;
        }).finally(() => {
            LocalStorageService.setIsLocked(false);
            this.loadingBusiness = false;
        });

    },
    showAddNegocio() {
      this.file = null;
      this.input3 = null
     this.input4 = null;
     this.menu3 = false
     this.menu4 = false
     this.imgMiniatura = '';
     this.editedItem = Object.assign({}, this.defaultItem)
      //LocalStorageService.setIsLocked(true);
      /*axios
        .get('https://api2.simplifies.cl/api/professional-show-autocomplete')
        .then((response) => {
          this.professionals = response.data.professionals;
        }).finally(() => {
            LocalStorageService.setIsLocked(false);
        });*/
      this.dialog = true;
    },
    editItem(item) {
      //LocalStorageService.setIsLocked(true);
      this.editedItem = Object.assign({}, this.defaultItem)
      this.file = null;
      var img = new Image();
      img.src = 'https://api2.simplifies.cl/api/images/' + item.image_url;
      img.onload = () => {
        this.imgMiniatura = 'https://api2.simplifies.cl/api/images/' + item.image_url;
      };
      img.onerror = () => {
        this.imgMiniatura = '';
      };
      this.editedIndex = 1;
      this.editedItem = Object.assign({}, item);
      this.editedItem.start_date = this.parseDate(item.start_date);
      this.editedItem.end_date = this.parseDate(item.end_date);
      this.editedItem.professional_id = parseInt(item.professional_id);
      this.dialog = true
    },
    deleteItem(item) {
      this.editedIndex = 1;
      this.editedItem.id = item.id;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      LocalStorageService.setIsLocked(true);
      //this.results.splice(this.editedIndex, 1)
      let request = {
        id: this.editedItem.id
      };
      axios
        .post('https://api2.simplifies.cl/api/business-destroy', request)
        .then(() => {
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.showAlert("success", "Negocio eliminado correctamente", 3000);
          this.initialize();
        });
      this.closeDelete()
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save() {
      LocalStorageService.setIsLocked(true);
      if (this.editedIndex > -1) {
        this.valid = false;
        this.data.id = this.editedItem.id;
        this.data.name = this.editedItem.name;
        this.data.address = this.editedItem.address;
        this.data.professional_id = this.editedItem.professional_id;
        this.editedItem.start_date = this.formattedStartDate;
        this.editedItem.end_date = this.formattedEndDate;
        const formData = new FormData();
        for (let key in this.editedItem) {
          formData.append(key, this.editedItem[key]);
        }
        axios
          .post('https://api2.simplifies.cl/api/business-update', formData)
          .then(() => {
          }).finally(() => {
            LocalStorageService.setIsLocked(false);
            this.showAlert("success", "Negocio editado correctamente", 3000);
            this.initialize();
          });
      } else {
        this.valid = false;
        this.data.name = this.editedItem.name;
        this.data.address = this.editedItem.address;
        this.data.professional_id = this.editedItem.professional_id;
        this.editedItem.start_date = this.formattedStartDate;
        this.editedItem.end_date = this.formattedEndDate;
        const formData = new FormData();
        for (let key in this.editedItem) {
          formData.append(key, this.editedItem[key]);
        }
        axios
          .post('https://api2.simplifies.cl/api/business', formData)
          .then(() => {
          }).finally(() => {
            LocalStorageService.setIsLocked(false);
            this.showAlert("success", "Negocio creado correctamente", 3000);
            this.initialize();
          });
      }
      this.close()
    },

    //reporte Ganancias 
    formatNumber(value) {
      // Si el valor es menor que 1000, devuelve el valor original con dos decimales
      if (value < 1000) {
        return (Math.round((value + Number.EPSILON) * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      // Primero, redondea el valor a dos decimales
      value = Math.round((value + Number.EPSILON) * 100) / 100;

      // Convierte el valor a cadena con formato de número local (en-US)
      let formattedValue = value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      return formattedValue;
    },
    showWinner() {
      this.loadingWinners = true;
      LocalStorageService.setIsLocked(true);
      const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      axios
        .get('https://api2.simplifies.cl/api/business-winner', {
          params: {
            startDate: startDate,
            endDate: endDate
          }
        })
        .then((response) => {
          this.winners = response.data;
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.dialogShowWinner = true;
          this.loadingWinners = false;
        });
    },
    updateDate(val) {
      this.input = val;
      this.menu = false;
    },
    updateDate1(val) {
      this.input2 = val;
      this.menu2 = false;
    },
    updateDate5() {      
      this.menu3 = false;
    },
    updateDate4() {
      this.menu4 = false;
    },
    updateDate2() {
      this.loadingWinners = true;
      LocalStorageService.setIsLocked(true);
      this.editedIndexWin = 2;
      const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      axios
        .get('https://api2.simplifies.cl/api/business-winner', {
          params: {
            startDate: startDate,
            endDate: endDate
          }
        })
        .then((response) => {
          this.winners = response.data;
        }).finally(() => {
            LocalStorageService.setIsLocked(false);
            this.loadingWinners = false;
        });
    },
    closeShowWinner() {
      this.dialogShowWinner = false;
      this.editedIndexWin = -1;
      //this.showPermission(this.chargeSelect);
    },
    exportToExcel() {
      // Primero, prepara una matriz que contendrá todas las filas de datos, incluidos los encabezados
      let rows = [];

      // Construye un objeto para los encabezados basado en la estructura de 'headers'
      let headerRow = {};
      this.headers1.forEach(header => {
        headerRow[header.key] = header.title; // Usa 'key' para el mapeo y 'title' para el texto del encabezado
      });
      rows.push(headerRow);

      // Ahora, mapea los datos de los items para que coincidan con los encabezados
      this.winners.forEach(item => {
        let rowData = {};
        this.headers1.forEach(header => {
          rowData[header.key] = item[header.key] || ''; // Asegura que cada celda se mapee correctamente; usa '' para datos faltantes
        });
        rows.push(rowData);
      });

      let nameReport = {
        // eslint-disable-next-line vue/no-use-computed-property-like-method
        name: this.formTitleWin, // Asume que 'name' es una de tus claves; ajusta según sea necesario
        tip: '', // Deja vacíos los demás campos para esta fila especial
        earnings: '',
        technical_assistance: '',
        total: '' // Usa 'total' para mostrar la fecha; ajusta las claves según corresponda a tu estructura
      };
      rows.push(nameReport);

      // Convierte la matriz de filas en una hoja de trabajo Excel
      const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true }); // 'skipHeader: true' porque ya agregamos manualmente los encabezados

      // Crea un nuevo libro de trabajo y añade la hoja de trabajo con los datos
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report" + this.fecha);

      // Escribe el libro de trabajo a un archivo y desencadena la descarga
      //XLSX.writeFile(wb, "report.xlsx");
      XLSX.writeFile(wb, `report_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
    },
    //monto por branches
    showWinnerBranch() {
      this.loadingWinnerBranch = true;
      LocalStorageService.setIsLocked(true);
      axios
        .get('https://api2.simplifies.cl/api/company_winner', {
          params: {
            business_id: this.business_id,
          }
        })
        .then((response) => {
          this.winnersbranches = response.data;
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.dialogShowWinnerBranches = true;
          this.loadingWinnerBranch = false;
        });
    },
    closeShowWinnerBranches() {
      this.dialogShowWinnerBranches = false;
      this.editedIndexWinB = -1;
    },
    updateDate3() {
      this.loadingWinnerBranch = true;
      LocalStorageService.setIsLocked(true);
      this.editedIndex = 2;
      const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      axios
        .get('https://api2.simplifies.cl/api/company_winner', {
          params: {
            startDate: startDate,
            endDate: endDate,
            business_id: this.business_id,
          }
        })
        .then((response) => {
          this.winnersbranches = response.data;
        }).finally(() => {
            LocalStorageService.setIsLocked(false);
            this.loadingWinnerBranch = false;
        });
    },
    exportToExcel1() {
      // Primero, prepara una matriz que contendrá todas las filas de datos, incluidos los encabezados
      let rows = [];

      // Construye un objeto para los encabezados basado en la estructura de 'headers'
      let headerRow = {};
      this.headers2.forEach(header => {
        headerRow[header.key] = header.title; // Usa 'key' para el mapeo y 'title' para el texto del encabezado
      });
      rows.push(headerRow);

      // Ahora, mapea los datos de los items para que coincidan con los encabezados
      this.winnersbranches.forEach(item => {
        let rowData = {};
        this.headers2.forEach(header => {
          rowData[header.key] = item[header.key] || ''; // Asegura que cada celda se mapee correctamente; usa '' para datos faltantes
        });
        rows.push(rowData);
      });

      let nameReport = {
        // eslint-disable-next-line vue/no-use-computed-property-like-method
        name: this.formTitleWinB, // Asume que 'name' es una de tus claves; ajusta según sea necesario
        tip: '', // Deja vacíos los demás campos para esta fila especial
        servicesAmount: '',
        productsAmount: '',
        earnings: '',
        technical_assistance: '',
        total: '' // Usa 'total' para mostrar la fecha; ajusta las claves según corresponda a tu estructura
      };
      rows.push(nameReport);

      // Convierte la matriz de filas en una hoja de trabajo Excel
      const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true }); // 'skipHeader: true' porque ya agregamos manualmente los encabezados

      // Crea un nuevo libro de trabajo y añade la hoja de trabajo con los datos
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report" + this.fecha);

      // Escribe el libro de trabajo a un archivo y desencadena la descarga
      //XLSX.writeFile(wb, "report.xlsx");
      XLSX.writeFile(wb, `report_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
    },
  },
}
</script>