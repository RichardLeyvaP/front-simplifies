<!-- eslint-disable vue/multi-word-component-names -->

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
  <div style="background-color: #B0BEC5;">

    <v-card class="mx-auto mt-12" elevation="12" max-width="448" rounded="lg">
      <v-toolbar color="blue-grey-lighten-5
" class="pt-12 pb-12" dark>
        <v-img class="mx-auto my-6" max-width="228" src="@/assets/logo_negro.png"></v-img>
      </v-toolbar>
      <v-progress-linear v-if="loading" color="amber-darken-1" indeterminate></v-progress-linear>
      <div class="mx-auto pl-10 mt-8 pr-10 pb-8">

        <v-text-field v-model="editedItem.email" label="Correo Electrónico" prepend-inner-icon="mdi-email"
          variant="outlined" persistent-hint></v-text-field>


        <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
          v-model="editedItem.password" label="Ingresar Contraseña" prepend-inner-icon="mdi-key" variant="outlined"
          @click:append-inner="visible = !visible"></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">

          <v-spacer></v-spacer>
          <a class="text-caption text-decoration-none text-blue mb-3" href="#" rel="noopener noreferrer" target="_blank" @click.prevent="toggleForm">
            Olvidaste tu Contraseña</a>
            
        </div>
        <v-dialog v-model="dialog" max-width="500">
          <v-card>
            <v-toolbar color="#F18254">
                <span class="text-subtitle-2 ml-4">Recuperar contraseña</span>
              </v-toolbar>
              <v-card-text>
                    <v-form ref="form" v-model="valid" enctype="multipart/form-data">
                    <v-container>                       
                            <v-text-field v-model="emailpas" clearable label="Correo" prepend-icon="mdi-email-outline"
                      variant="underlined">
                    </v-text-field>
                    </v-container>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#E7E9E9" variant="flat" @click="toggleForm">
                      Cancelar
                    </v-btn>
                    <v-btn color="#F18254" variant="flat" @click="changePass">
                      Aceptar
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
            </v-dialog>

              <!--<v-card v-if="formVisible">
                  <v-card-text>
                    <v-form ref="form" v-model="valid" enctype="multipart/form-data">
                    <v-container>                       
                            <v-text-field v-model="emailpas" clearable label="Correo" prepend-icon="mdi-email-outline"
                      variant="underlined">
                    </v-text-field>
                    </v-container>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#E7E9E9" variant="flat" @click="toggleForm">
                      Cancelar
                    </v-btn>
                    <v-btn color="#F18254" variant="flat" @click="changePass">
                      Aceptar
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
              </v-card>-->

        <v-radio-group v-model="selectedOption" inline>
          <v-radio color="amber-darken-1" label="Empresa" value="empresa"></v-radio>
          <v-radio color="amber-darken-2" class="ml-4" label="Sucursales" value="sucursales"></v-radio>
        </v-radio-group>

        <!-- El v-select se muestra solo si 'sucursales' es la opción seleccionada -->
        <v-autocomplete :no-data-text="'No hay datos disponibles'" v-if="selectedOption === 'sucursales'" clearable label="Seleccione una Sucursal"
          variant="outlined" prepend-inner-icon="mdi-domain" v-model="editedItem.branch_id" :items="branches"
          item-title="name" item-value="id">
        </v-autocomplete>

        <v-btn class="mb-8" :loading="loading" color="orange" size="large" variant="tonal" block @click="save"
          :disabled="!valid">
          Ingresar
        </v-btn>

        <v-divider></v-divider>

        <v-row class="mt-2" justify="center">
          Simplifies v1.0
        </v-row>
      </div>

    </v-card>
    <br><br><br><br><br>
  </div>
</template>

<script>

import axios from "axios";
//import { UserTokenStore } from "@/store/UserTokenStore";
import LocalStorageService from "@/LocalStorageService";
import router from '@/router/index';
//const userTokenStore = UserTokenStore();
export default {
  data: () => ({
    loading: false,
    selectedOption: null, // Controla la opción seleccionada
    visible: false,
    valid: true,
    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
    dialog: false,
    formVisible: false,
      emailpas: '',
    //step: 1,
    data: {},
    branches: [],
    business: [],
    user: [],

    editedItem: {
      password: '',
      branch_id: '',
      business_id: '',
      email: ''
    },
    defaultItem: {
      password: '',
      branch_id: '',
      business_id: '',
      email: ''
    },
    requiredRules: [
      (v) => !!v || "El campo es requerido",
    ],
  }),
  mounted() {
    this.loading = false;
    this.valid = true;
  },
  created() {
    this.logout()
    this.initialize()
  },
  methods: {
    toggleForm() {
      //this.formVisible = !this.formVisible;
      this.dialog = !this.dialog ;
    },
    changePass (){
      axios
        .get('https://api2.simplifies.cl/api/reactive-password', {
                    params: {
                        email: this.emailpas,
                    }
                })
        .then((response) => {
          console.log(response);
          if (response.data){
            this.showAlert("success", "Contraseña enviada a su correo", 3000)
            this.email2 = '';
            this.toggleForm();
          }
        }).catch(error => {
          this.showAlert("warning", "Correo incorrecto", 3000);
          this.emailpas = '';
          this.toggleForm();
        })
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
    logout() {
      LocalStorageService.logout();
    },
    save() {
      this.valid = false;
      this.loading = true;
      this.data.email = this.editedItem.email;
      this.data.password = this.editedItem.password;
      this.data.branch_id = this.editedItem.branch_id;

      console.log(this.data);
      axios
        .post('https://api2.simplifies.cl/api/login', this.data)
        .then((response) => {
          if (response.data) {
            if (this.editedItem.branch_id === response.data.branch_id || (this.selectedOption === "empresa" && response.data.business_id )) {
              this.user = response.data;
              console.log('this.user-------');
              console.log(this.user);
              /*userTokenStore.setUserToken(this.user.token);
              userTokenStore.setUserName(this.user.name);
              userTokenStore.setBranchId(this.user.branch_id);
              userTokenStore.setProfessionalId(this.user.professional_id);
              userTokenStore.setCharge(this.user.charge);
              userTokenStore.setNameBranch(this.user.nameBranch);
              userTokenStore.setNameBusiness(this.user.nameBusiness);
              userTokenStore.setImage(this.user.image);
              userTokenStore.setBusinessId(this.user.business_id);
              userTokenStore.setPermissionsUser(this.user.permissions);
              userTokenStore.setAuthenticateUser(true);*/
              //localStorage
              LocalStorageService.setItem("token", this.user.token);
              LocalStorageService.setItem("name", this.user.name);
              LocalStorageService.setItem("branch_id", this.user.branch_id);
              LocalStorageService.setItem("professional_id", this.user.professional_id);
              LocalStorageService.setItem("charge", this.user.charge);
              LocalStorageService.setItem("charge_id", this.user.charge_id);
              LocalStorageService.setItem("nameBranch", this.user.nameBranch);
              LocalStorageService.setItem("nameBusiness", this.user.nameBusiness);
              LocalStorageService.setItem("image", this.user.image);
              LocalStorageService.setItem("business_id", this.user.business_id);
              LocalStorageService.setItem("permissionsUser", this.user.permissions);
              LocalStorageService.setItem("authenticateUser", true);
              LocalStorageService.setItem("user_id", this.user.id);
              this.editedItem = Object.assign({}, this.defaultItem);
              setTimeout(() => {
                router.push({ name: "Home" });
              }, 2000);

            }
            else {              
          this.valid = true;
              this.showAlert("warning", "No es usuario de este sitio", 3000);
              router.push({ name: "Login" });
              this.loading = false;
              this.editedItem = Object.assign({}, this.defaultItem);
            }
          }
        }).catch(error => {
          this.valid = true;
          this.showAlert("warning", "Usuario y contraseña incorrectos", 3000)
          this.editedItem = Object.assign({}, this.defaultItem);
          this.loading = false;
        })
    },

    initialize() {
      axios
        .get('https://api2.simplifies.cl/api/branch')
        .then((response) => {
          this.branches = response.data.branches;
        });
    },
  },
  props: {
    source: String
  }


}
</script>

<style scoped>
.blue {
  background-color: #F18254;
  opacity: 0.9;
  /* Ajusta la opacidad según sea necesario */
}

.gray {
  background-color: #4a4949;
  opacity: 0.9;
  /* Ajusta la opacidad según sea necesario */
}

/* Restablecer márgenes y rellenos globales */
body,
html {
  margin: 0;
  padding: 0;
}

/* Opcional: Establecer altura mínima para asegurar que el contenido se ajuste */
.fill-height {
  height: 100vh;
  /* 100% del alto de la ventana */
  display: flex;
  align-items: center
}
</style>