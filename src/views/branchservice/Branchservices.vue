<!-- eslint-disable vue/multi-word-component-names -->
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
    <v-card elevation="6" class="mx-5" width='auto'>
        <v-toolbar color="#F18254">
            <v-row align="center">
                <v-col cols="12" md="5" class="grow ml-4">
                    <span class="text-subtitle-1"> <strong>Listado de Servicios que realiza la Sucursal</strong></span>
                </v-col>
                <v-col cols="12" md="4"></v-col>
                <v-col cols="12" md="2">

                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ props }">

                            <v-btn v-bind="props" class="text-subtitle-1  ml-12  " color="#E7E9E9" variant="flat"
                                elevation="2" prepend-icon="mdi-plus-circle">
                                Asignar a Servicios la sucursal
                            </v-btn>

                        </template>
                        <v-card>
                            <v-toolbar color="#F18254">
                                <span class="text-subtitle-2 ml-4"> {{ formTitle }}</span>
                            </v-toolbar>
                            <v-card-text>
                                <v-form v-model="valid" enctype="multipart/form-data">
                                    <v-row>
                                        <v-col cols="12" md="12">
                                            <v-autocomplete v-model="editedItem.service_id" :items="services" clearable
                                                label="Servicios" prepend-inner-icon="mdi-store" item-title="name"
                                                item-value="id" variant="underlined" :rules="selectRules"></v-autocomplete>
                                        </v-col>
                                    </v-row>
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
                                <span class="text-subtitle-2 ml-4"> Eliminar la asignación de este servicio a esta
                                    sucursal</span>
                            </v-toolbar>

                            <v-card-text class="mt-2 mb-2"> ¿Desea deshacer la asignación?</v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="#E7E9E9" variant="flat" @click="closeDelete">
                                    Cancelar
                                </v-btn>
                                <v-btn color="warning" variant="flat" @click="deleteItemConfirm">
                                    Aceptar
                                </v-btn>


                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-col>

            </v-row>

        </v-toolbar>

        <v-row>
            <v-container>
                <v-col cols="12" sm="12" md="6">
                    <v-autocomplete v-model="branch_id" :items="branches" v-if="this.mostrarFila" clearable
                        label="Seleccione una Sucursal" prepend-icon="mdi-store" item-title="name" item-value="id"
                        variant="underlined" @update:model-value="initialize()"></v-autocomplete>
                </v-col>

            </v-container>
        </v-row>
        <v-card-text>
            <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                hide-details>
            </v-text-field>
            <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="results" :search="search" class="elevation-1"
                no-data-text="No hay datos disponibles" no-results-text="No hay datos disponibles" >
                <template v-slot:top>

                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </template>
                <template v-slot:item.name="{ item }">

                    <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                        <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image_service" alt="image"></v-img>
                    </v-avatar>
                    {{ item.name }}
                </template>
                <template v-slot:item.actions="{ item }">
                    <!--<v-icon size="25" color="blue" class="me-2" @click="editItem(item)">
         mdi-pencil
       </v-icon>
                    <v-icon size="25" color="green" @click="showProfessionals(item)">
                        mdi-account-tie-outline
                    </v-icon>-->
                    <v-icon size="25" color="red" @click="deleteItem(item)">
                        mdi-delete
                    </v-icon>
                </template>
            </v-data-table>
        </v-card-text>

        <!--Professionals-->
        <v-dialog v-model="dialogProfessionals" fullscreen transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar color="#F18254">
                    <span class="text-h6 ml-4"> Trabajadores que realizan servicio</span>
                    <v-spacer></v-spacer>
                    <v-btn class="text-subtitle-1  ml-12" color="#E7E9E9" variant="flat"
                        @click="this.dialogAddProfessionals = true">
                        Asignar Trabajador
                    </v-btn>
                </v-toolbar>
                <v-card-text class="mt-2 mb-2">
                    <v-text-field class="mt-1 mb-1" v-model="search2" append-icon="mdi-magnify" label="Buscar" single-line
                        hide-details></v-text-field>
                    <v-data-table :headers="headers2" :items="branchServiceProfessionals" :search="search2"
                        class="elevation-1" :items-per-page-text="'Elementos por páginas'" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">
                        <template v-slot:item.name="{ item }">

                            <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                                <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image_url" alt="image"></v-img>
                            </v-avatar>
                            {{ item.name }}
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-icon size="25" color="red" @click="closeProfessionalRequest(item)">
                                mdi-delete
                            </v-icon>
                        </template>

                    </v-data-table>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#E7E9E9" variant="flat" @click="closeDelete">
                        Volver
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogAddProfessionals" width="500">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-2 ml-4">Asignar Trabajador</span>
          </v-toolbar>
          <v-card-text class="mt-2 mb-2">
            <v-form ref="form" v-model="valid" enctype="multipart/form-data">
              <v-container>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-autocomplete v-model="professional_id" :items="professionals" label="Profesional"
                      prepend-icon="mdi-account-tie-outline" item-title="name" item-value="id" variant="underlined"
                      :rules="selectRules"></v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="closeProfessional">
                  Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" @click="saveProfessional" :disabled="!valid">
                  Aceptar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDeleteProfessional" width="500">
        <v-card>

          <v-toolbar color="red">
            <span class="text-subtitle-2 ml-4"> Eliminar Servicio asignado a profesional</span>
          </v-toolbar>

          <v-card-text class="mt-2 mb-2"> ¿Desea eliminar este servicio a este professional?</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="closerequestProfessional">
              Cancelar
            </v-btn>
            <v-btn color="#F18254" variant="flat" @click="professionalsDelete">
              Aceptar
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>




    <br>
</template>
<script>

import axios from "axios";
import LocalStorageService from "@/LocalStorageService";

export default {
    data: () => ({
        valid: true,
        mover: true,
        mostrarFila: false,
        snackbar: false,
        sb_type: '',
        sb_message: '',
        sb_timeout: 2000,
        sb_title: '',
        sb_icon: '',
        dialog: false,
        branch_id: '',
        business_id: '',
        professional_id: '',
        branch_service_id: '',
        search: '',
        search2: '',
        message_delete: true,
        dialogProfessionals: false,
        dialogAddProfessionals: false,
        dialogDelete: false,
        dialogDeleteProfessional: false,
        headers: [
            //{ title: 'Almacén', align: 'start', value: 'direccionStore' },
            { title: 'Nombre', key: 'name' },
            { title: 'Tipo Servicio', key: 'type_service' },
            { title: 'Duración', key: 'duration_service' },
            { title: 'Descripción', key: 'service_comment' },
            { title: 'Precio', align: 'start', value: 'price_service' },
            { title: 'Acciones', key: 'actions', sortable: false },
        ],
        headers2: [
            { title: 'Nombre', key: 'name' },
            { title: 'Correo', key: 'email' },
            { title: 'Teléfono', key: 'phone' },
            { title: 'Acciones', key: 'actions', sortable: false },
        ],
        results: [],
        services: [],
        professionals: [],
        branches: [],
        branchServiceProfessionals: [],
        branchServiceSelect: '',
        editedIndex: -1,
        editedItem: {
            service_id: '',
            id: ''
        },
        data: {},

        defaultItem: {
            service_id: '',
        },

        selectRules: [(v) => !!v || "Seleccionar al menos un elemeto"],
    }),

    computed: {
        formTitle() {
            if (this.editedIndex === -1) {
                return 'Asignar Servicio a sucursal';
            }
            if (this.editedIndex === 3) {
                return 'Editar Asignación de servicio a sucursal';
            }
            else {
                return 'Trasladar producto de un almacén a otro'
            }
        }
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
        this.business_id = LocalStorageService.getItem('business_id');
        this.charge_id = LocalStorageService.getItem('charge_id');
        this.branch_id = LocalStorageService.getItem('branch_id') ? 1 : LocalStorageService.getItem('branch_id');
        if (this.charge_id === '4') {
            // Mostrar la fila con Autocomplete
            this.mostrarFila = true;
        }
        console.log(this.charge_id);
        this.initialize()
    },

    methods: {

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
            axios
                .get('http://127.0.0.1:8000/api/professionalservice-show', {
                    params: {
                        branch_id: this.branch_id
                    }
                })
                .then((response) => {
                    this.results = response.data.branchServices;
                });
            axios
                .get('http://127.0.0.1:8000/api/branch-service-show', {
                    params: {
                        branch_id: this.branch_id
                    }
                })
                .then((response) => {
                    this.services = response.data.services;
                });
            axios
                .get('http://127.0.0.1:8000/api/show-business', {
                    params: {
                        business_id: this.business_id
                    }
                })
                .then((response) => {
                    this.branches = response.data.branches;
                });

        },

        deleteItem(item) {
            this.editedItem = Object.assign({}, item);
            this.dialogDelete = true;
        },
        deleteItemConfirm() {
            this.data.branch_id = this.branch_id;
            this.data.service_id = this.editedItem.service_id;
            axios
                .post('http://127.0.0.1:8000/api/branchservice-destroy', this.data)
                .then(() => {
                    this.initialize();
                    this.message_delete = true
                    this.showAlert("success", "Asignación eliminada correctamente", 3000)
                });
            this.closeDelete()
        },
        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
                this.mostrarCampos = false
            })
        },
        closeDelete() {
            this.dialogDelete = false
            this.dialogProfessionals = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        save() {
            if (this.editedIndex === -1) {
                console.log('insertar');
                this.valid = false;
                this.data.branch_id = this.branch_id;
                this.data.service_id = this.editedItem.service_id;
                axios
                    .post('http://127.0.0.1:8000/api/branchservice', this.data)
                    .then(() => {
                        this.initialize();
                        this.showAlert("success", "Producto asignado correctamente", 3000)
                    });
            }
            this.close();

        },

        //professionals

        showProfessionals(item) {
            this.branchServiceSelect = item;
            console.log(this.branchServiceSelect);
            this.branch_service_id = item.id;
            console.log(item.id);
            axios
                .get('http://127.0.0.1:8000/api/branch-service-professionals', {
                    params: {
                        branch_service_id: item.id
                    }
                })
                .then((response) => {
                    this.branchServiceProfessionals = response.data.professionals;
                    console.log('imprime permissions');
                });
                axios
                .get('http://127.0.0.1:8000/api/professionals-branch-service', {
                    params: {
                        branch_service_id: item.id
                    }
                })
                .then((response) => {
                    this.professionals = response.data.professionals;
                });
            this.dialogProfessionals = true;
        },
        closeProfessional() {
      this.dialogAddProfessionals = false;
      this.branch_service_id = '';
      this.showProfessionals(this.branchServiceSelect);
    },
    saveProfessional() {
      this.valid = false,
        this.data.professional_id = this.professional_id;
      this.data.branch_service_id = this.branch_service_id;
      axios
        .post('http://127.0.0.1:8000/api/professionalservice', this.data)
        .then(() => {
         this.professional_id = '',
          this.dialogAddProfessionals = false;
          this.showProfessionals(this.branchServiceSelect);
          this.showAlert("success", "Permiso asignado correctamente", 3000);
        })
    },
    closeProfessionalRequest(item) {
      console.log(item);
      this.dialogDeleteProfessional = true
      //this.editedItem.branch_id=item.id
      this.professional_id = item.professional_id;
      this.branch_service_id = item.branch_service_id;
    },
    closerequestProfessional() {
      this.dialogDeleteProfessional = false;
      this.branch_service_id = '',
         this.professional_id_id = '',
      this.showPermission(this.branchServiceSelect)
    },
    professionalsDelete() {
      let request = {
        professional_id: this.professional_id,
        branch_service_id: this.branch_service_id
      };
      axios
        .post('http://127.0.0.1:8000/api/professionalservice-destroy', request)
        .then(() => {
          this.dialogDeleteProfessional = false
          this.charge_id = '',
         this.permission_id = '',
          console.log(this.branchServiceSelect);
          this.showProfessionals(this.branchServiceSelect)
          this.showAlert("success", "Asignación de profesional a servicio hecha correctamente", 3000)
        })
    },
    },
}
</script>