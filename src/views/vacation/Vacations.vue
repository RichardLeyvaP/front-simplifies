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
                <v-col cols="12" md="4" class="grow ml-4 t">
                    <span class="text-subtitle-1"> <strong>Vacaciones</strong></span>
                </v-col>
                <v-col cols="12" md="5" class="mr-6"></v-col>
                <v-col cols="12" md="2">

                    <v-dialog v-model="dialog" max-width="600px">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" class="text-subtitle-1  ml-12 " color="#E7E9E9" variant="flat"
                                elevation="2" prepend-icon="mdi-plus-circle" :disabled="mostrar">
                                Asignar
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
                                            <v-col cols="12" md="12">
                                                <v-autocomplete v-model="professional_id" :items="professionals"
                                                    clearable label="Porfesional"
                                                    prepend-inner-icon="mdi-account-tie-outline" item-title="name"
                                                    item-value="id" variant="underlined"
                                                    :rules="selectRules" :disabled='edit'></v-autocomplete>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="12">
                                                <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                                                    transition="scale-transition" offset-y min-width="290px" multiple>
                                                    <template v-slot:activator="{ props }">
                                                        <v-text-field v-bind="props" v-model="formattedStartDate"
                                                            variant="underlined" append-inner-icon="mdi-calendar"
                                                            label="Fecha inicial" multiple></v-text-field>
                                                    </template>
                                                    <v-locale-provider locale="es">
                                                        <v-date-picker @input="menu = false" header="Calendario"
                                                            title="Seleccione la fecha" color="orange lighten-2"
                                                            v-model="startDate" :min="new Date(
                        Date.now() -
                        new Date().getTimezoneOffset() * 60000
                      )
                        .toISOString()
                        .substr(0, 10)
                        " @update:modelValue="updateDate"></v-date-picker>
                                                    </v-locale-provider>
                                                </v-menu>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="12">
                                                <v-menu v-model="menu2" :close-on-content-click="false"
                                                    :nudge-right="40" transition="scale-transition" offset-y
                                                    min-width="290px">
                                                    <template v-slot:activator="{ props }">
                                                        <v-text-field v-bind="props" v-model="formattedEndDate"
                                                            variant="underlined" append-inner-icon="mdi-calendar"
                                                            label="Fecha final"></v-text-field>
                                                    </template>
                                                    <v-locale-provider locale="es">
                                                        <v-date-picker @input="menu2 = false" header="Calendario"
                                                            title="Seleccione la fecha" color="orange lighten-2"
                                                            v-model="endDate" :min="new Date(
                        Date.now() -
                        new Date().getTimezoneOffset() * 60000
                      )
                        .toISOString()
                        .substr(0, 10)
                        " @update:modelValue="updateDate1"></v-date-picker>
                                                    </v-locale-provider>
                                                </v-menu>
                                            </v-col>
                                            <v-col cols="12" md="12">
                                                <v-text-field v-model="description" clearable label="Descripción"
                      prepend-inner-icon="mdi-file-document" variant="underlined">
                    </v-text-field>
                                            </v-col>
                                        </v-row>
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
                                <span class="text-subtitle-2 ml-4"> Eliminar días de vacaciones</span>
                            </v-toolbar>

                            <v-card-text class="mt-2 mb-2"> ¿Desea eliminar los días de vacaciones?</v-card-text>
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
            <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :search='search'
                :items="results" class="elevation-1" :locale="locale" no-results-text="No hay datos disponibles"
                no-data-text="No hay datos disponibles">
                <template v-slot:item.actions="{ item }">
                    <v-btn density="comfortable" icon="mdi-pencil" @click="editItem(item)" color="primary"
                        variant="tonal" elevation="1" class="mr-1 mt-1 mb-1" title="Editar días de vacaciones"></v-btn>
                    <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="red-darken-4"
                        variant="tonal" elevation="1" title="Eliminar días de vacaciones"></v-btn>
                </template>
                <template v-slot:item.name="{ item }">

                    <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                        <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image_url" alt="image"></v-img>
                    </v-avatar>
                    {{ item.name }}
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script >

import axios from "axios";
import { useDate } from 'vuetify';
import LocalStorageService from "@/LocalStorageService";
export default {
    data: () => ({
        valid: true,
        snackbar: false,
        edit: false,
        sb_type: '',
        sb_message: '',
        sb_timeout: 2000,
        sb_title: '',
        sb_icon: '',
        mostrarFila: false,
        menu: false,
        menu2: false,
        startDate: null,
        endDate: null,
        description: '',
        search: '',
        branch_id: '',
        charge: '',
        id: '',
        dialog: false,
        dialogDelete: false,
        professional_id: '',
        headers: [
            { title: 'Profesional', value: 'name' },
            { title: 'Fecha Entrada', value: 'startDate' },
            { title: 'Fecha Salida', value: 'endDate' },
            { title: 'Descripción', value: 'description' },
            { title: 'Acciones', key: 'actions', sortable: false },
        ],
        locale: {
            itemsPerPageText: 'Elementos por página:',
            pageText: '{0}-{1} de {2}',
            noDataText: 'No hay datos disponibles',
        },
        results: [],

        professionals: [],

        editedIndex: -1,

        data: {},

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
        selectRules: [(v) => !!v || "Seleccionar al menos un elemeto"],
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
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevos días de vacaciones' : 'Editar dìas de vacaciones'
        },
        formattedStartDate() {
            if (this.startDate) {
                //console.log('this.startDate');
                //console.log(new Date(this.startDate));
                //return new Date(this.startDate);

                /*console.log('this.startDate');
                console.log(this.startDate);*/
                const date = new Date(this.startDate); //2024-04-06
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                console.log(`${year}-${month}-${day}`);
                //new Date('2018-03-02');

                return `${year}-${month}-${day}`;
            }
            return "";
            
        },
        formattedEndDate() {
            if (this.endDate) {
                const date = new Date(this.endDate);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                return `${year}-${month}-${day}`;
            }
            return "";
        },
        /* dateFormatted() {
       const date = this.input ? new Date(this.input) : new Date();
       const day = date.getDate().toString().padStart(2, '0');
       const month = (date.getMonth() + 1).toString().padStart(2, '0');
       const year = date.getFullYear();
       return `${year}-${month}-${day}`;
     },
     getDate() {
       return this.input ? new Date(this.input) : new Date();
     },
     dateFormatted2() {
       const date = this.input ? new Date(this.input) : new Date();
       const day = date.getDate().toString().padStart(2, '0');
       const month = (date.getMonth() + 1).toString().padStart(2, '0');
       const year = date.getFullYear();
       return `${year}-${month}-${day}`;
     },
     getDate2() {
       return this.input ? new Date(this.input) : new Date();
     },*/
    },

    watch: {
        dialog(val) {
            val || this.close();
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    mounted() {
        this.branch_id = LocalStorageService.getItem('branch_id');
        this.charge = JSON.parse(LocalStorageService.getItem("charge"));
        this.initialize();
    },

    methods: {
        updateDate() {
      this.menu = false;
    },
    updateDate1() {
      this.menu2 = false;
    },
    showAlert(sb_type,sb_message, sb_timeout)
    {    
      this.sb_type= sb_type

      if(sb_type=="success")
      {
        this.sb_title='Éxito'
        this.sb_icon='mdi-check-circle'
      }
      
      if(sb_type=="error")
      {
        this.sb_title='Error'
        this.sb_icon='mdi-check-circle'
      }

      if(sb_type=="warning")
      {
        this.sb_title='Advertencia'
        this.sb_icon='mdi-alert-circle'
      }
      this.sb_message= sb_message
      this.sb_timeout= sb_timeout
      this.snackbar= true
    },
        /*formatDate(date) {
            if (!date) return null;

            /*const dateObject = new Date(date);
            const year = dateObject.getFullYear();
            const month = String(dateObject.getMonth() + 1).padStart(2, "0");
            const day = String(dateObject.getDate()).padStart(2, "0");

            return `${year}-${month}-${day}`;*/
        //},*/
        initialize() {
            if (this.charge == 'Administrador') {
                axios
                    .get('http://127.0.0.1:8000/api/professional-show-autocomplete')
                    .then((response) => {
                        this.professionals = response.data.professionals;
                    });
                axios
                    .get('http://127.0.0.1:8000/api/vacation')
                    .then((response) => {
                        this.results = response.data.vacations;
                    });
            } else {
                console.log('No es administrador');
                axios
                    .get('http://127.0.0.1:8000/api/professional-show-autocomplete-branch', {
                        params: {
                            branch_id: this.branch_id
                        }
                    })
                    .then((response) => {
                        this.professionals = response.data.professionals;
                    });
                axios
                    .get('http://127.0.0.1:8000/api/vacation-show', {
                        params: {
                            branch_id: this.branch_id
                        }
                    })
                    .then((response) => {
                        this.results = response.data.vacations;
                    });
            }


        },
        editItem(item) {
            this.editedIndex = 1;
            this.id = item.id;
            this.professional_id = item.professional_id;
            this.description = item.description;
            this.startDate = this.parseDate(item.startDate);
            this.endDate = this.parseDate(item.endDate);
                this.dialog = true;
                this.edit = true;
        },
        deleteItem(item) {
            this.editedIndex = 1;
            this.id = item.id;
            this.dialogDelete = true;
        },
        deleteItemConfirm() {
            //this.results.splice(this.editedIndex, 1)
            let request = {
                id: this.id
            };
            axios
                .post('http://127.0.0.1:8000/api/vacation-destroy', request)
                .then(() => {
                    this.showAlert("success", "Vacaciones eliminadas correctamente", 3000)
                    this.initialize();
                })
            this.closeDelete()
        },
        close() {
            this.dialog = false;
            this.edit = false;
            this.professional_id = '',
            this.description = '';
                        this.startDate = null,
                        this.endDate = null,
                this.editedIndex = -1
        },
        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        save() {
            if (this.editedIndex > -1) {
                this.valid = false;
                this.data.id = this.id,
                this.data.description = this.description;
                    this.data.professional_id = this.professional_id;
                    this.data.startDate = this.formattedStartDate;
                this.data.endDate = this.formattedEndDate;
                console.log(this.data);
                axios
                    .put('http://127.0.0.1:8000/api/vacation', this.data)
                    .then(() => {
                        this.initialize();
                        this.professional_id = '',
                        this.description = '';
                        this.startDate = null,
                        this.endDate = null,
                        this.showAlert("success", "Vacaciones actualizadas correctamente", 3000);
                        this.edit = false;
                    })
            } else {
                this.valid = false;
                this.data.professional_id = this.professional_id;
                this.data.description = this.description;
                this.data.startDate = this.formattedStartDate;
                this.data.endDate = this.formattedEndDate;
                console.log(this.data);
                axios
                    .post('http://127.0.0.1:8000/api/vacation', this.data)
                    .then(() => {
                        this.professional_id = '',
                        this.description = '';
                        this.startDate = null,
                        this.endDate = null,
                        this.edit = false;
                        this.showAlert("success", "Vacaciones asignadas correctamente", 3000);
                        this.initialize();
                    })
            }
            this.close()
        },
    },
}
</script>