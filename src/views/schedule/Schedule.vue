<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
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
        <v-card elevation="6" class="mx-5">
            <v-toolbar color="#F18254">
                <v-row align="center">
                    <v-col cols="12" md="4" class="grow ml-4">
                        <span class="text-subtitle-1"> <strong>Horarios de Trabajo por Sucursales</strong></span>
                    </v-col>
                    <v-col cols="12" md="5" class="mr-12"></v-col>
                </v-row>
            </v-toolbar>
            <br>
            <v-container>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches" v-if="this.mostrarFila" clearable
                            label="Seleccione una Sucursal" prepend-icon="mdi-store" item-title="name" item-value="id"
                            variant="underlined" @update:model-value="initialize()"></v-autocomplete>

                    </v-col>
                    <!-- Aquí puedes agregar más datos o componentes -->
                    <br>
                    <v-col cols="12" md="12">
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-left">Día</th>
                                    <th class="text-left">Laboral</th>
                                    <th class="text-left">Hora de Entrada</th>
                                    <th class="text-left">Hora de Salida</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(dia, index) in dias" :key="index">
                                    <td>{{ dia.nombre }}</td>
                                    <td>
                                        <v-switch class="ma-0 mx-0 pa-0 px-0" inset color="amber-darken-4"
                                            v-model="dia.esLaboral"></v-switch>
                                    </td>
                                    <td v-if="dia.esLaboral">
                                        <v-row align="center" no-gutters>
                                            <v-col cols="2">
                                                <v-select variant="underlined" :items="horas" v-model="dia.entradaHora"
                                                    dense outlined></v-select>
                                            </v-col>
                                            <v-col cols="1" class=" pl-2 ">
                                                :
                                            </v-col>
                                            <v-col cols="2">
                                                <v-select variant="underlined" :items="minutos" v-model="dia.entradaMinuto"
                                                    dense outlined></v-select>
                                            </v-col>
                                        </v-row>
                                    </td>
                                    <td v-else>Cerrado</td>
                                    <td v-if="dia.esLaboral">
                                        <v-row no-gutters>
                                            <v-col cols="2">
                                                <v-select variant="underlined" :items="horas" v-model="dia.salidaHora" dense
                                                    outlined></v-select>
                                            </v-col>
                                            <v-col cols="1" class="mt-5 pl-2 ">
                                                :
                                            </v-col>
                                            <v-col cols="2">
                                                <v-select variant="underlined" :items="minutos" v-model="dia.salidaMinuto"
                                                    dense outlined></v-select>
                                            </v-col>
                                        </v-row>
                                    </td>
                                    <td v-else>Cerrado</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-col>
                </v-row>
            </v-container>
            <v-container>
                <v-row>
                    <br>
                    <v-spacer></v-spacer>
                    <v-col cols="12" md="10"></v-col>
                    <v-col cols="12" md="2">
                        <v-btn @click="save" class="text-subtitle-1  ml-12  " color="warning" variant="flat" elevation="2"
                            prepend-icon="mdi-plus-circle">
                            Actualizar
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
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
    name: 'HorariosLista',
    data: () => ({
        snackbar: false,
        sb_type: '',
        sb_message: '',
        sb_timeout: 2000,
        sb_title: '',
        sb_icon: '',
        charge: '',
        dias: [],
        branches: [],
        results: [],
        branch_id: '',
        charge_id: '',
        business_id: '',
        mostrarFila: false,
        horas: Array.from({ length: 24 }, (_, i) => (i < 10 ? `0${i}` : `${i}`)),
        minutos: ['00', '15', '30', '45'],
    }),
    mounted() {
        // Simulando una solicitud a la API
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
                this.initialize()
          });
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
            LocalStorageService.setIsLocked(true);
            axios
                .get('https://api2.simplifies.cl/api/show_schedule_branch', {
                    params: {
                        branch_id: this.branch_id
                    }
                })
                .then((response) => {
                    this.results = response.data;
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.dias = this.results.Schedules.map(schedule => ({
                        nombre: schedule.day,
                        esLaboral: schedule.start_time !== null || schedule.closing_time !== null,
                        entradaHora: schedule.start_time !== null ? schedule.start_time.split(':')[0] : '00',
                        entradaMinuto: schedule.start_time !== null ? schedule.start_time.split(':')[1] : '00',
                        salidaHora: schedule.closing_time !== null ? schedule.closing_time.split(':')[0] : '00',
                        salidaMinuto: schedule.closing_time !== null ? schedule.closing_time.split(':')[1] : '00'
                    }));
          });
        },

        save() {
            LocalStorageService.setIsLocked(true);

            const updatedData = this.dias.map(dia => {
        
                console.log('`${dia.entradaHora}:${dia.entradaMinuto}`');
                console.log(`${dia.entradaHora}:${dia.entradaMinuto}`);
                console.log('`${dia.salidaHora}:${dia.salidaMinuto}`');
                console.log(`${dia.salidaHora}:${dia.salidaMinuto}`);
                //console.log('${dia.salidaMinuto}');
                //console.log(dia.salidaMinuto);
                const start_time = (dia.entradaHora || dia.entradaMinuto) ? `${dia.entradaHora}:${dia.entradaMinuto}` : null;
                const closing_time = (dia.salidaHora || dia.salidaMinuto) ? `${dia.salidaHora}:${dia.salidaMinuto}` : null;
                return {
                    day: dia.nombre,
                    start_time: dia.esLaboral === false ? null : start_time === '00:00' ? null : start_time,
                    closing_time: dia.esLaboral === false ? null : closing_time === '00:00' ? null : closing_time,
                };
            });
            let request = {
                branch_id: this.branch_id,
                schedule: updatedData
            };
            /*const updatedData = this.dias.map(dia => ({
                day: dia.nombre,
                start_time: dia.entradaHora + ':' + dia.entradaMinuto,
                closing_time: dia.salidaHora + ':' + dia.salidaMinuto,
            }));*/
            console.log('request');
            console.log(request);
            axios.put('https://api2.simplifies.cl/api/schedule', request)
                .then(() => {
                    LocalStorageService.setIsLocked(false);
                    this.initialize();
                    this.showAlert("success", "Horario actualizado correctamente", 3000);
                }).catch(error => {
                    // Maneja cualquier error que ocurra al enviar los datos al servidor
                    this.showAlert("warning", "Error interno del sistema", 3000);
                });
        }
    },
};
</script>
  
<style>
.my-select .v-select__slot,
.my-select .v-input__control {
    min-height: auto;
    /* Ajusta el tamaño mínimo según necesites */
    padding: 4px;
    /* Ajusta el padding para reducir espacio */
}

.my-select .v-select__selections {
    font-size: 0.875rem;
    /* Reduce el tamaño de la fuente */
}

.my-switch .v-input--selection-controls__input {
    margin: 0;
    /* Ajusta el margen del switch si es necesario */
}
</style>