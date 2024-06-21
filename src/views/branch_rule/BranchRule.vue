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
    <v-container>
    <v-card elevation="6" class="mx-5" width='auto'>
        <v-toolbar color="#F18254">
            <v-row align="center">
                <v-col cols="12" md="5" class="grow ml-4">
                    <span class="text-subtitle-1"> <strong>Listado de reglas de convivencia de la Sucursal</strong></span>
                </v-col>
                <v-col cols="12" md="4"></v-col>
                <v-col cols="12" md="2">

                            <v-btn class="text-subtitle-1  ml-12  " color="#E7E9E9" variant="flat"
                                elevation="2" prepend-icon="mdi-plus-circle" @click="showAddRules()">
                                Asignar regla
                            </v-btn>
                    <v-dialog v-model="dialog" max-width="500px">
                        <v-card>
                            <v-toolbar color="#F18254">
                                <span class="text-subtitle-2 ml-4"> {{ formTitle }}</span>
                            </v-toolbar>
                            <v-card-text>
                                <v-form v-model="valid" enctype="multipart/form-data">
                                    <v-row>
                                        <v-col cols="12" md="12">
                                            <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.rule_id" :items="rules" clearable
                                                label="Reglas de convivencia" prepend-inner-icon="mdi-ruler"
                                                item-title="name" item-value="id" variant="underlined"
                                                :rules="selectRules"></v-autocomplete>
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
                                <span class="text-subtitle-2 ml-4"> Eliminar la asignación de esta regla de convivencia a
                                    esta sucursal</span>
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
                <v-col cols="12" md="6">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches" v-if="this.mostrarFila"
                        label="Seleccione una Sucursal" prepend-icon="mdi-store" item-title="name" item-value="id"
                        variant="underlined" @update:model-value="initialize()" ></v-autocomplete>
                </v-col>

            </v-container>
        </v-row>
        <v-container>
    <v-row>
        <v-col cols="12">
            <v-card>
                <v-card-text>
                    <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details></v-text-field>
                    <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="results" :search="search" class="elevation-1" no-data-text="No hay datos disponibles" no-results-text="No hay datos disponibles" :loading="loadingrules" loading-text="Cargando datos...">
                        <template v-slot:top>
                            <v-divider class="mx-4" inset vertical></v-divider>
                            <v-spacer></v-spacer>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="red-darken-4" variant="tonal" elevation="1" title="Eliminar regla de convivencia"></v-btn>
                        </template>
                        <template v-slot:item.description="{ item }">
                            <div class="description-cell">{{ item.description }}</div>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</v-container>
    </v-card>
</v-container>



    <br>
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
        loadingrules: true,
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
        charge: '',
        business_id: '',
        search: '',
        search2: '',
        message_delete: true,
        dialogDelete: false,
        headers: [
            //{ title: 'Almacén', align: 'start', value: 'direccionStore' },
            { title: 'Nombre', key: 'name' },
            { title: 'Tipo', key: 'type' },
            { title: 'Descripción', key: 'description' },
            { title: 'Acciones', key: 'actions', sortable: false },
        ],
        results: [],
        rules: [],
        branches: [],
        editedIndex: -1,
        editedItem: {
            rule_id: '',
            id: ''
        },
        data: {},

        defaultItem: {
            rule_id: '',
        },

        selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    }),

    computed: {
        formTitle() {
            if (this.editedIndex === -1) {
                return 'Asignar regla de convivencia a sucursal';
            }
            if (this.editedIndex === 3) {
                return 'Editar Asignación de regla de convivencia a sucursal';
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
        this.charge = JSON.parse(LocalStorageService.getItem("charge"));
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
        if (this.charge === 'Administrador') 
            {
                this.branch_id = this.branches[0].id;
                this.mostrarFila = true;
            }
                            //this.branch_id = !this.branch_id ? this.branch_id : this.branches[0].id;
                            this.initialize()
          });
            

        console.log(this.charge_id);
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
            this.loadingrules = true;
            LocalStorageService.setIsLocked(true);
            axios
                .get('https://api2.simplifies.cl/api/branch_rules', {
                    params: {
                        branch_id: this.branch_id
                    }
                })
                .then((response) => {
                    this.results = response.data.rules;
                }).finally(() => {
                    this.loadingrules = false;
            LocalStorageService.setIsLocked(false);
        });
        },

        showAddRules(){
            LocalStorageService.setIsLocked(true);
            axios
                .get('https://api2.simplifies.cl/api/branch-rules-noIn', {
                    params: {
                        branch_id: this.branch_id
                    }
                })
                .then((response) => {
                    this.rules = response.data.rules;
                }).finally(() => {
            LocalStorageService.setIsLocked(false);
        });
                this.dialog = true;
        },
        deleteItem(item) {
            this.editedItem.rule_id = item.rule_id;
            this.dialogDelete = true;
            console.log('item');
            console.log(this.editedItem);
        },
        deleteItemConfirm() {
            LocalStorageService.setIsLocked(true);
            this.data.branch_id = this.branch_id;
            this.data.rule_id = this.editedItem.rule_id;
            axios
                .post('https://api2.simplifies.cl/api/branchrule-destroy', this.data)
                .then(() => {
                    this.message_delete = true;
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.showAlert("success", "Asignación eliminada correctamente", 3000);
                    this.initialize();
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
            LocalStorageService.setIsLocked(true);
            if (this.editedIndex === -1) {
                console.log('insertar');
                this.valid = false;
                this.data.branch_id = this.branch_id;
                this.data.rule_id = this.editedItem.rule_id;
                axios
                    .post('https://api2.simplifies.cl/api/branchrule', this.data)
                    .then(() => {
                    }).finally(() => {
                        LocalStorageService.setIsLocked(false);
                        this.showAlert("success", "Regla de convivencia asignada correctamente", 3000);
                        this.initialize();
                });
            }
            this.close();

        },
    },
}
</script>
<style>
.description-cell {
    max-width: 400px; /* Define el ancho máximo del campo de descripción */
    overflow: hidden; /* Oculta el texto que se desborda del campo de descripción */
    text-overflow: ellipsis; /* Muestra puntos suspensivos (...) cuando el texto se recorta */
}
</style>