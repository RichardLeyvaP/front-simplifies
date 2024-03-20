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
                    <span class="text-subtitle-1"> <strong>Detalles de operaciones por Sucursal</strong></span>
                </v-col>
                <v-col cols="12" md="4"></v-col>
                <v-col cols="12" md="2">

                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ props }">

                            <v-btn v-bind="props" class="text-subtitle-1  ml-12  " color="#E7E9E9" variant="flat"
                                elevation="2" prepend-icon="mdi-plus-circle">
                                Agregar operación
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
                                            <v-select label="Tipo de operación" v-model="editedItem.operation"
                                                :items="['Ingreso', 'Gasto']" item-value="['Ingreso', 'Gasto']"
                                                variant="underlined" density="compact" :rules="selectRules"
                                                prepend-icon="mdi-cash-multiple"></v-select>
                                        </v-col>
                                    </v-row>
                                    <v-row v-if="editedItem.operation === 'Ingreso'">
                                        <v-col>
                                            <v-autocomplete v-model="editedItem.revenue_id" :items="revenues" clearable
                                                label="Ingresos" prepend-inner-icon="mdi-cash-plus" item-title="name"
                                                item-value="id" variant="underlined" :rules="selectRules"></v-autocomplete>
                                        </v-col>
                                    </v-row>
                                    <v-row v-if="editedItem.operation === 'Gasto'">
                                        <v-col>
                                            <v-autocomplete v-model="editedItem.expense_id" :items="expenses" clearable
                                                label="Gastos" prepend-inner-icon="mdi-cash-plus" item-title="name"
                                                item-value="id" variant="underlined" :rules="selectRules"></v-autocomplete>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" md="6">
                                            <v-text-field v-model="editedItem.amount" clearable label="Monto"
                                            prepend-icon="mdi-currency-usd" variant="underlined" :rules="pago">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-text-field v-model="editedItem.control" clearable label="No.Control"
                                            prepend-icon="mdi-security" variant="underlined" :disabled="true">
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
            { title: 'No. Control', key: 'control' },
            { title: 'Fecha Registro', key: 'data' },
            { title: 'Tipo de Operación', key: 'operation' },
            { title: 'Detalle de Operación', key: 'nameDetalle' },
            { title: 'Ingreso', key: 'revenue' },
            { title: 'Gasto', key: 'expense' },
            { title: 'Comentario', key: 'comment' },
            { title: 'Archivo', key: 'file' },
            { title: 'Acciones', key: 'actions', sortable: false },
        ],
        results: [],
        expenses: [],
        revenues: [],
        branches: [],
        editedIndex: -1,
        editedItem: {
            control: '',
            operation: 'Ingreso',
            amount: '',
            comment: '',
            file: '',
            expense_id: '',
            revenue_id: '',
            id: ''
        },
        data: {},

        defaultItem: {
            control: '',
            operation: 'Ingreso',
            amount: '',
            comment: '',
            file: '',
            expense_id: '',
            revenue_id: '',
        },
        pago: [
   (value) => !isNaN(parseFloat(value)) || 'Debe ser un número'],
        selectRules: [(v) => !!v || "Seleccionar al menos un elemeto"],
    }),

    computed: {

        formTitle() {
            if (this.editedIndex === -1) {
                return 'Registrar Operación';
            }
            if (this.editedIndex === 3) {
                return 'Editar Operacion';
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
        editItem(item) {
      this.editedIndex = 1;
      this.editedItem = Object.assign({}, item)
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
                .get('http://127.0.0.1:8000/api/finance-show', {
                    params: {
                        branch_id: this.branch_id
                    }
                })
                .then((response) => {
                    this.results = response.data.finances;
                    console.log('this.results');
                    console.log(this.results);
                    this.editedItem.control = this.results ? this.results[0].control + 1: '';// Obtener el numero de control realizado
                    console.log('this.results');
                    console.log(this.results);
                    console.log('this.editedItem.control');
                    console.log(this.editedItem.control);
                });
                axios
                .get('http://127.0.0.1:8000/api/expense')
                .then((response) => {
                    this.expenses = response.data.expenses;
                    console.log('this.expenses');
                    console.log(this.expenses);
                });
            axios
                .get('http://127.0.0.1:8000/api/revenue')
                .then((response) => {
                    this.revenues = response.data.revenues;
                });

        },

        deleteItem(item) {
            this.editedItem.rule_id = item.rule_id;
            this.dialogDelete = true;
            console.log('item');
            console.log(this.editedItem);
        },
        deleteItemConfirm() {
            this.data.branch_id = this.branch_id;
            this.data.rule_id = this.editedItem.rule_id;
            axios
                .post('http://127.0.0.1:8000/api/branchrule-destroy', this.data)
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
                this.data.rule_id = this.editedItem.rule_id;
                axios
                    .post('http://127.0.0.1:8000/api/branchrule', this.data)
                    .then(() => {
                        this.initialize();
                        this.showAlert("success", "Regla de convivencia asignada correctamente", 3000)
                    });
            }
            this.close();

        },
    },
}
</script>