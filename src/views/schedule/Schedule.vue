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
                    <span class="text-subtitle-1"> <strong>Horario de trabajo por Sucursal</strong></span>
                </v-col>
                <v-col cols="12" md="4"></v-col>
                <v-col cols="12" md="2">

                    <v-dialog v-model="dialog" max-width="600px">
                        <template v-slot:activator="{ props }">

                            <v-btn v-bind="props" class="text-subtitle-1  ml-12  " color="#E7E9E9" variant="flat"
                                elevation="2" prepend-icon="mdi-plus-circle">
                                Agregar horario
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
                                            <v-select label="Día de la semana" v-model="editedItem.day"
                                                :items="['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']" item-value="['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']"
                                                variant="underlined" density="compact" :rules="selectRules"
                                                prepend-icon="mdi-calendar"></v-select>
                                        </v-col>
                                    </v-row>
                                    <v-row>
    <v-col cols="12"  md="6">
      <v-select
        :items="hours"
        label="Hora"
        v-model="selectedHour"
        variant="underlined"
        @update:model-value="updateFormattedTime"
      ></v-select>
      
    </v-col>
    <v-col cols="12"  md="6">
      <v-select
        :items="hours"
        label="Hora"
        v-model="selectedHour1"
        variant="underlined"
        @update:model-value="updateFormattedTime1"
      ></v-select>      
    </v-col>
    </v-row>
    <v-row>
    <v-col cols="12"  md="6">
      <v-select
        :items="minutes"
        label="Minutos"
        v-model="selectedMinute"
        variant="underlined"
        @update:model-value="updateFormattedTime"
      ></v-select>
    </v-col>
    <v-col cols="12"  md="6">
      <v-select
        :items="minutes"
        label="Minutos"
        v-model="selectedMinute1"
        variant="underlined"
        @update:model-value="updateFormattedTime1"
      ></v-select>
    </v-col>
  </v-row>
  
  <v-row>
                                        <v-col cols="12" md="6">
                                            <v-text-field v-model="editedItem.start_time" clearable label="Hora de inicio"
                                                prepend-icon="mdi-timer-outline" variant="underlined" :rules="nameRules" :disabled="true">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-text-field v-model="editedItem.closing_time" clearable label="Hora de cierre"
                                                prepend-icon="mdi-timer-off-outline" variant="underlined" :rules="nameRules" :disabled="true">
                                            </v-text-field>
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
                                <span class="text-subtitle-2 ml-4"> Eliminar horario de trabajo de la sucursal</span>
                            </v-toolbar>

                            <v-card-text class="mt-2 mb-2"> ¿Desea deshacer el horario?</v-card-text>
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
            <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="results"
                :search="search" class="elevation-1" no-data-text="No hay datos disponibles"
                no-results-text="No hay datos disponibles">
                <template v-slot:top>

                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </template>

                <template v-slot:item.actions="{ item }">
                    <v-icon size="25" color="blue" class="me-2" @click="editItem(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon size="25" color="red" @click="deleteItem(item)">
                        mdi-delete
                    </v-icon>
                </template>
            </v-data-table>
        </v-card-text>


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
        file: '',
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
        search: '',
        search2: '',
        message_delete: true,
        dialogDelete: false,
        headers: [
            //{ title: 'Almacén', align: 'start', value: 'direccionStore' },
            { title: 'Dia', key: 'day' },
            { title: 'Hora de apertura', key: 'start_time' },
            { title: 'Hora de cierre', key: 'closing_time' },
            { title: 'Acciones', key: 'actions', sortable: false },
        ],
        results: [],
        branches: [],
        editedIndex: -1,
        selectedHour: '',
      selectedMinute: '',
        selectedHour1: '',
      selectedMinute1: '',
        editedItem: {
            day: '',
            start_time: '',
            closing_time: '',
            branch_id: '',
            id: ''
        },
        data: {},

        defaultItem: {
            day: '',
            start_time: '',
            closing_time: '',
            branch_id: '',
            id: ''
        },
        selectRules: [(v) => !!v || "Seleccionar al menos un elemeto"],
        nameRules: [
     (v) => !!v || "El campo es requerido"],

      hours: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')),
      minutes: Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')),

    }),

    computed: {
        formattedTime() {
      // Comprueba si ambos, la hora y los minutos, han sido seleccionados
      if (this.selectedHour !== null && this.selectedMinute !== null) {
        this.editedItem.start_time == `${this.selectedHour}:${this.selectedMinute}`
        console.log('`${this.selectedHour}:${this.selectedMinute}`');
        console.log(this.editedItem.start_time);
        return `${this.selectedHour}:${this.selectedMinute}`
      }
      return ''; // Retorna una cadena vacía si la hora o los minutos no han sido seleccionados aún
    },

        formTitle() {
            if (this.editedIndex === -1) {
                return 'Crear Horario';
            }
            if (this.editedIndex === 1) {
                return 'Editar Horario';
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
        this.branch_id = LocalStorageService.getItem('branch_id');
        axios
            .get('http://127.0.0.1:8000/api/show-business', {
                params: {
                    business_id: this.business_id
                }
            })
            .then((response) => {
                this.branches = response.data.branches;
                this.branch_id = !this.branch_id ? this.branch_id : this.branches[0].id;

                this.initialize()
            });
        if (this.charge_id === '4') {
            // Mostrar la fila con Autocomplete
            this.mostrarFila = true;
        }
        console.log(this.charge_id);
    },

    methods: {

        updateFormattedTime() {
      if (this.selectedHour && this.selectedMinute) {
        this.editedItem.start_time = `${this.selectedHour}:${this.selectedMinute}`;
      }
    },
    updateFormattedTime1() {
      if (this.selectedHour1 && this.selectedMinute1) {
        this.editedItem.closing_time = `${this.selectedHour1}:${this.selectedMinute1}`;
      }
    },
        editItem(item) {
            this.editedIndex = 1;
            this.editedItem = Object.assign({}, item);
            console.log('this.editedItem');
            console.log(this.editedItem);
            this.dialog = true
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
            axios
                .get('http://127.0.0.1:8000/api/show_schedule_branch', {
                    params: {
                        branch_id: this.branch_id
                    }
                })
                .then((response) => {
                    this.results = response.data.Schedules;
                    console.log('this.results');
                    console.log(this.results);
                });
            },

        deleteItem(item) {
            this.editedItem.id = item.id;
            this.dialogDelete = true;
            console.log('item');
            console.log(this.editedItem);
        },
        deleteItemConfirm() {
            this.data.id = this.editedItem.id;
            axios
                .post('http://127.0.0.1:8000/api/schedule-destroy', this.data)
                .then(() => {
                    this.initialize();
                    this.showAlert("success", "Operación eliminada correctamente", 3000)
                });
            this.closeDelete()
        },
        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
            this.selectedHour = '';
            this.selectedMinute = '';
            this.selectedHour1 = '';
            this.selectedMinute1 = '';
            this.file = '';
            this.initialize();
        },
        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
            this.initialize();
        },
        save() {
            if (this.editedIndex > -1) {
                this.valid = false;
                this.data.id = this.editedItem.id;
                this.data.day = this.editedItem.day;
                this.data.start_time = this.editedItem.start_time;
                this.data.closing_time = this.editedItem.closing_time;
                this.data.branch_id = this.editedItem.branch_id;
                console.log('formData');
                console.log(this.data);
                axios
                    .put('http://127.0.0.1:8000/api/schedule', this.data)
                    .then(() => {
                        this.initialize();
                        this.showAlert("success", "Operación editada correctamente", 3000);
                        this.file = '';
                        this.selectedHour = '';
                        this.selectedMinute = '';
                        this.selectedHour1 = '';
                        this.selectedMinute1 = '';
                    })
            } else {
                this.valid = false;
                
                this.data.day = this.editedItem.day;
                this.data.start_time = this.editedItem.start_time;
                this.data.closing_time = this.editedItem.closing_time;
                this.data.branch_id = this.branch_id;
                console.log('formData');
                console.log(this.data);
                axios
                    .post('http://127.0.0.1:8000/api/schedule', this.data)
                    .then(() => {
                        this.initialize();
                        this.showAlert("success", "Registro de operación creado correctamente", 3000);
                        this.file = '';
                        this.selectedHour = '';
            this.selectedMinute = '';
            this.selectedHour1 = '';
            this.selectedMinute1 = '';
                    }).catch(error => {
        // Manejo del error
        if (error.response.status === 400) {
            this.showAlert("error", "Los dás de la semana no se pueden repetir", 3000);
        } else {
            this.showAlert("error", "Ocurrió un error al procesar la solicitud", 3000);
        }
    });
            }
            this.close()
        },
    },
}
</script>