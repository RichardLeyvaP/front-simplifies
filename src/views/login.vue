<!-- eslint-disable vue/multi-word-component-names -->

<template>

  <div style="background-color: #B0BEC5;">
 
    <v-card class="mx-auto mt-12" elevation="12" max-width="448" rounded="lg">
      <v-toolbar color="blue-grey-lighten-5
" class="pt-12 pb-12" dark>
        <v-img class="mx-auto my-6" max-width="228" src="@/assets/logo_negro.png"></v-img>
      </v-toolbar>
      <v-progress-linear v-if="loading"
      color="amber-darken-1"
      indeterminate
    ></v-progress-linear>
      <div class="mx-auto pl-10 mt-8 pr-10 pb-8">   

        <v-text-field v-model="editedItem.email" label="Correo Electrónico" prepend-inner-icon="mdi-email"
          variant="outlined" persistent-hint></v-text-field>


        <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
          v-model="editedItem.password" label="Ingresar Contraseña" prepend-inner-icon="mdi-key" variant="outlined"
          @click:append-inner="visible = !visible"></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">

          <v-spacer></v-spacer>
          <a class="text-caption text-decoration-none text-blue mb-3" href="#" rel="noopener noreferrer"
            target="_blank">
            Olvidaste tu Contraseña</a>
        </div>

        <v-radio-group v-model="selectedOption" inline>
          <v-radio color="amber-darken-1" label="Empresa" value="empresa"></v-radio>
          <v-radio color="amber-darken-2" class="ml-4" label="Sucursales" value="sucursales"></v-radio>
        </v-radio-group>

        <!-- El v-select se muestra solo si 'sucursales' es la opción seleccionada -->
        <v-autocomplete v-if="selectedOption === 'sucursales'" clearable label="Seleccione una Sucursal"
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
import { UserTokenStore } from "@/store/UserTokenStore";
import LocalStorageService from "@/LocalStorageService";
import router from '@/router/index';
const userTokenStore = UserTokenStore();
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
      axios
        .post('http://127.0.0.1:8000/api/login', this.data)
        .then((response) => {
          if (response.data) {
            if (this.editedItem.branch_id === response.data.branch_id || this.selectedOption === "empresa") {
              this.user = response.data;
              userTokenStore.setUserToken(this.user.token);
              userTokenStore.setUserName(this.user.name);
              userTokenStore.setBranchId(this.user.branch_id);
              userTokenStore.setProfessionalId(this.user.professional_id);
              userTokenStore.setCharge(this.user.charge);
              userTokenStore.setNameBranch(this.user.nameBranch);
              userTokenStore.setNameBusiness(this.user.nameBusiness);
              userTokenStore.setImage(this.user.image);
              userTokenStore.setBusinessId(this.user.business_id);
              userTokenStore.setPermissionsUser(this.user.permissions);
              userTokenStore.setAuthenticateUser(true);
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
              this.editedItem = Object.assign({}, this.defaultItem);
              setTimeout(() => {
                router.push({ name: "Home" });
              }, 2000);

            }
            else {
              this.showAlert("warning", "No es usuario de este sitio", 3000);
              router.push({ name: "/" });
              this.editedItem = Object.assign({}, this.defaultItem);
            }
          }
        }).catch(error => {
          this.showAlert("warning", "Usuario y contraseña incorrectos", 3000)
          this.editedItem = Object.assign({}, this.defaultItem);
        })
    },

    initialize() {
      axios
        .get('http://127.0.0.1:8000/api/branch')
        .then((response) => {
          this.branches = response.data.branches;
        });
      axios
        .get('http://127.0.0.1:8000/api/business')
        .then((response) => {
          this.business = response.data.business;
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