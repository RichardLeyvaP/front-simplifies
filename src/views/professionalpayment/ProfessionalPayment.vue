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
                    <span class="text-subtitle-1"> <strong>Pago a Professionales</strong></span>
                </v-col>
                <v-col cols="12" md="4"></v-col>
                <v-col cols="12" md="2">

                    <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" class="text-subtitle-1  ml-12 " color="#E7E9E9" variant="flat"
                                elevation="2" prepend-icon="mdi-plus-circle">
                                Nuevo Pago
                            </v-btn>
                        </template>
                        <v-card>
                            <v-toolbar color="#F18254">
                                <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
                            </v-toolbar>
                            <v-card-text>
                                <v-form ref="form" v-model="valid" enctype="multipart/form-data">
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-autocomplete v-model="branch_id" :items="branches"
                                                    v-if="this.mostrarFila" clearable label="Seleccione una Sucursal"
                                                    prepend-icon="mdi-store" item-title="name" item-value="id"
                                                    variant="underlined"
                                                    @update:model-value="initialize()"></v-autocomplete>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="3">
                                                <v-autocomplete v-model="professional_id" :items="professionals"
                                                    clearable label="Seleccione un professional"
                                                    prepend-icon="mdi-account-tie-outline" item-title="name"
                                                    item-value="id" variant="underlined"
                                                    :rules="selectRules"
                                                    @update:model-value="carsEarrings()"></v-autocomplete>
                                            </v-col>
                                            <v-col cols="12" md="3">
                                                <v-select label="Tipo de pago" v-model="editedItem.type"
                                                    :items="['Adelanto', 'Quincena', 'Mes']"
                                                    :item-value="['Adelanto', 'Quincena', 'Mes']" variant="underlined"
                                                    :rules="selectRules"
                                                    prepend-icon="mdi-check-circle"></v-select><!--:disabled="!this.mostrarType"-->
                                            </v-col>
                                            <v-col cols="12" md="3">
                                                <v-card class="mx-auto" max-width="344" title="Monto a Pagar"
                                                    :subtitle="totalMount()" append-icon="mdi-check" v-if="this.mostrarCars">

                                                    <template v-slot:prepend>
                                                        <v-avatar color="blue-darken-2">
                                                            <v-icon icon="mdi-currency-usd"></v-icon>
                                                        </v-avatar>
                                                    </template>
                                                </v-card>
                                                <v-text-field v-model="editedItem.amount" clearable label="Monto"
                                                    prepend-icon="mdi-cash" variant="underlined" :rules="pago" v-if="!this.mostrarCars">
                                                </v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>

                                            <v-col cols="12" md="12" v-if="mostrarCars">
                                                <v-text-field class="mt-1 mb-1" v-model="search2"
                                                    append-icon="mdi-magnify" label="Buscar" single-line
                                                    hide-details></v-text-field>
                                                <v-data-table v-model="selected2" :headers="headers2"
                                                    :items-per-page-text="'Elementos por páginas'" :search="search2"
                                                    :items="cars" class="elevation-1"
                                                    no-results-text="No hay datos disponibles"
                                                    no-data-text="No hay datos disponibles" show-select>
                                                    <template v-slot:item.clientName="{ item }">

                                                        <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                                                            <v-img
                                                                :src="'http://127.0.0.1:8000/api/images/' + item.client_image"
                                                                alt="image"></v-img>
                                                        </v-avatar>
                                                        {{ item.clientName }}
                                                    </template>
                                                    <template v-slot:item.pay="{ item }">
                                                        {{ item.totalServices + item.tip}}
                                                    </template>
                                                </v-data-table>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                    <v-divider></v-divider>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="#E7E9E9" variant="flat" @click="close">
                                            Cancelar
                                        </v-btn>
                                        <v-btn color="#F18254" variant="flat" @click="save"
                                            :disabled="!this.editedItem.amount">
                                            Pagar
                                        </v-btn>
                                    </v-card-actions>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>

                            <v-toolbar color="red">
                                <span class="text-subtitle-2 ml-4"> Eliminar Pago a Professional</span>
                            </v-toolbar>

                            <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el pago al professional?</v-card-text>
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
            <v-row>
                <v-col cols="12" sm="12" md="4">
                    <v-autocomplete v-model="branch_id" :items="branches" v-if="this.mostrarFila" clearable
                        label="Seleccione una Sucursal" prepend-icon="mdi-store" item-title="name" item-value="id"
                        variant="underlined" @update:model-value="initialize()"></v-autocomplete>
                </v-col>
            </v-row>
            <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                hide-details></v-text-field>
            <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :search="search"
                :items="results" class="elevation-1" no-results-text="No hay datos disponibles"
                no-data-text="No hay datos disponibles">
                <template v-slot:item.nameProfessional="{ item }">

                    <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                        <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image_url" alt="image"></v-img>
                    </v-avatar>
                    {{ item.nameProfessional }}
                </template>
                <template v-slot:item.actions="{ item }">
                    <!--<v-btn density="comfortable" icon="mdi-pencil" @click="editItem(item)" color="primary"
                        variant="tonal" elevation="1" class="mr-1 mt-1 mb-1" title="Editar Pago a profesional"></v-btn>-->
                    <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="red-darken-4"
                        variant="tonal" elevation="1" title="Eliminar Pago a profesional"></v-btn>
                    <!--<v-icon size="25" color="blue" class="me-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon size="25" color="red" @click="deleteItem(item)">
              mdi-delete
            </v-icon>-->
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script>

import axios from "axios";
import LocalStorageService from "@/LocalStorageService";
export default {
    data: () => ({
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
        branches: [],
        cars: [],
        search: '',
        mostrarFila: false,
        dialog: false,
        mostrarCars: false,
        dialogDelete: false,
        //mostrarType: true,
        headers: [
            { title: 'Nombre del profesional', value: 'nameProfessional' },
            { title: 'Fecha del pago', value: 'date' },
            { title: 'Tipo de Pago', value: 'type' },
            { title: 'Monto pagado', value: 'amount' },
            { title: 'Acciones', value: 'actions' },
        ],
        results: [],
        selectedOption: '',
        //options: ['Adelanto', 'Quincena', 'Mes'],
        professionals: [],
        professional_id: '',
        selected: [],
        editedIndex: -1,

        editedItem: {
            id: '',
            nameProfessional: '',
            type: '',
            amount: '',
        },
        data: {},

        defaultItem: {
            id: '',
            nameProfessional: '',
            type: '',
            amount: '',
        },
        nameRules: [
            (v) => !!v || "El campo es requerido",
        ],
        pago: [
            (value) => !!value || 'Campo requerido',
            (value) => !value || !isNaN(parseFloat(value)) || 'Debe ser un número'],
        selectRules: [(v) => !!v || "Seleccionar al menos un elemeto"],
        selected2: [],
        headers2: [
            { title: 'ID', align: 'start', value: 'id' },
            { title: 'Nombre Cliente', align: 'end', value: 'clientName' },
            { title: 'Fecha', align: 'end', value: 'data' },
            { title: 'Ganancias Servicios', align: 'end', value: 'totalServices' },
            { title: 'Cantidad Servicios', align: 'end', value: 'services' },
            { title: 'Monto Generado', align: 'end', value: 'amountGenerate' },
            { title: 'Propina (80%)', align: 'end', value: 'tip' },
            { title: 'Monto a Pagar', align: 'end', value: 'pay' },
        ],
        search2: '',
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo Pago a profesional' : 'Editar Pago a profesional'
        },
        ironValues() {
            return this.selected2.map(selection => selection.id);
        }
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
        /*selectedOption(newOption) {
            // Realizar diferentes operaciones en función de la opción seleccionada
            switch (newOption) {
                case this.options[0]:
                    this.mostrarCars = false;
                    this.selected2 = [];
                    break;
                case this.options[1]:
                    this.mostrarCars = true;
                    //this.carsEarrings();
                    break;
                case this.options[2]:
                    this.mostrarCars = true;
                    //this.carsEarrings();
                    break;
            }
        }*/
    },

    mounted() {
        this.business_id = LocalStorageService.getItem('business_id');
        this.branch_id = LocalStorageService.getItem('branch_id');
        this.charge_id = LocalStorageService.getItem('charge_id');
        this.charge = JSON.parse(LocalStorageService.getItem("charge"));
        axios
            .get('http://127.0.0.1:8000/api/show-business', {
                params: {
                    business_id: this.business_id
                }
            })
            .then((response) => {
                this.branches = response.data.branches;
                //this.branch_id = !this.branch_id ? this.branch_id : this.branches[0].id;
                if (this.charge === 'Administrador') {
                    this.branch_id = this.branches[0].id;
                }
                this.initialize()
            });

        if (this.charge === 'Administrador') {
            this.mostrarFila = true;
        }
        
    },

    methods: {
        totalMount() {
            let selectedItems;
            if (this.selected2.length == 0) {
                return this.cars.reduce((total, item) => {
                // Asegúrate de que item.totalServices y item.tip sean números
                const totalServices = Number(item.totalServices) || 0;
                const tip = Number(item.tip) || 0;
                //this.editedItem.amount = total + totalServices + tip;
                return total + totalServices + tip;
            }, 0);
            } else {
                // Mapea los IDs de selected2 a los objetos correspondientes en cars
                selectedItems = this.selected2.map(selectedId => this.cars.find(car => car.id === selectedId));
                // Calcula el total sumando totalServices y tip de los elementos seleccionados
            return selectedItems.reduce((total, item) => {
                // Asegúrate de que item.totalServices y item.tip sean números
                const totalServices = Number(item.totalServices) || 0;
                const tip = Number(item.tip) || 0;
                this.editedItem.amount = total + totalServices + tip;
                return total + totalServices + tip;
            }, 0);
            }
            
        },
        
        /*professionalChange(){
            this.chargeProfessional = this.professionals.find(professional => professional.id == this.professional_id);
            console.log('this.chargeProfessional');
            console.log(this.chargeProfessional);
        },*/
        formatNumber(value) {
            return value.toLocaleString('es-ES');
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
            this.professionals = [];
            this.professional_id = '';

            axios
                .get('http://127.0.0.1:8000/api/branch-payment-show', {
                    params: {
                        branch_id: this.branch_id
                    }
                })
                .then((response) => {
                    this.results = response.data;
                });

            axios
                .get('http://127.0.0.1:8000/api/branch_professionals_web', {
                    params: {
                        branch_id: this.branch_id
                    }
                })
                .then((response) => {
                    this.professionals = response.data.professionals;
                });

        },
        carsEarrings() {
            this.editedItem.amount = '';
            this.chargeProfessional = this.professionals.find(professional => professional.id == this.professional_id);
            console.log('this.chargeProfessional');
            console.log(this.chargeProfessional.charge);
            this.mostrarCars = true;
            
            if(this.chargeProfessional.charge == 'Barbero' || this.chargeProfessional.charge == 'Barbero y Encargado'){
                axios
                .get('http://127.0.0.1:8000/api/professional-car-notpay', {
                    params: {
                        branch_id: this.branch_id,
                        professional_id: this.professional_id
                    }
                })
                .then((response) => {
                    this.cars = response.data;
                    /*if(this.cars.length == 0){
                        //this.editedItem.type = 'Adelanto';
                        this.mostrarCars = false;
                        //this.mostrarType = false;
                    }else{
                        this.mostrarCars = true;
                        //this.mostrarType = true;
                    }*/

                    console.log('this.cars');
                    console.log(this.cars);
                });
            }else{
                this.mostrarCars = false;
                //this.mostrarType = true;
                console.log('es otro cargo');
            }
            
        },
        /*toggleService(serviceId) {
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
        },*/
        editItem(item) {
            this.editedIndex = 1;
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        deleteItem(item) {
            this.editedIndex = -1;
            this.editedItem.id = item.id;
            this.dialogDelete = true;
        },
        deleteItemConfirm() {
            //this.results.splice(this.editedIndex, 1)
            let request = {
                id: this.editedItem.id
            };
            axios
                .post('http://127.0.0.1:8000/api/professional-payment-destroy', request)
                .then(() => {
                    this.initialize();
                    this.showAlert("success", "Pago eliminado correctamente", 3000);
                })
            this.closeDelete()
        },
        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            });
            this.editedIndex = -1;
            this.selectedOption = null;
            this.cars = [];
            this.selected2 = [];
            this.professional_id = '';
            this.mostrarCars = false;

        },
        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1;
                this.cars = [];
                this.selected = [];
                this.professional_id = '';
                this.mostrarCars = false;
            });

        },
        save() {
            this.valid = false;
            /* if (this.editedIndex > -1) {
                 this.data.id = this.editedItem.id;
                 this.data.name = this.editedItem.name;
                 axios
                     .put('http://127.0.0.1:8000/api/workplace', this.data)
                     .then(() => {
                         this.initialize();
                         this.showAlert("success", "Pago editado correctamente", 3000);
                     })
             } else {*/
            console.log('this.ironValues');
            console.log(this.selected2);
            //console.log(this.selectedOption);
            console.log(this.selected);
            //const newArrayCar = this.selected.map(item => parseInt(item)); // Convertir a enteros si es necesario
            //console.log('newArrayCar');
            //console.log(newArrayCar);
            this.data.professional_id = this.professional_id;
            this.data.branch_id = this.branch_id;
            this.data.car_ids = this.selected2;
            this.data.amount = this.editedItem.amount;
            this.data.type = this.editedItem.type;
            console.log('this.data');
            console.log(this.data);
            axios
                .post('http://127.0.0.1:8000/api/professional-payment', this.data)
                .then(() => {
                    this.$nextTick(() => {
                        this.editedItem = Object.assign({}, this.defaultItem);
                    });

                    this.initialize();
                    this.editedIndex = -1;
                    this.type = null;
                    this.cars = [];
                    this.selected2 = [];
                    this.professional_id = '';
                    this.mostrarCars = false;
                    this.showAlert("success", "Pago realizado correctamente", 3000);
                })
            //}
            /*this.valid = false;
            this.data.name = this.editedItem.name;
            this.data.branch_id = this.branch_id

            axios
                .post('http://127.0.0.1:8000/api/workplace', this.data)
                .then(() => {
                    this.initialize();
                    this.showAlert("success", "Puesto de trabajo editado correctamente", 3000);
                })*/
            this.close();
        },
    },
}
</script>
<style>
.selected-item {
    background-color: orange !important;
}

/* Espacio entre los items */
.list-item-spacing {
    margin-bottom: 8px;
    /* Ajusta según necesites */
}
</style>