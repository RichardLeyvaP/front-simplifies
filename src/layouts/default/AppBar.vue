<template>
   <v-snackbar class="mt-12" location="right top" :timeout="sb_timeout" :color="sb_type"
     elevation="24"  :multi-line="true"  vertical v-model="snackbar">
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
  <v-app-bar scroll-threshold="0">
    <v-app-bar-title>

      <v-img src="@/assets/logo_negro.png" class="justify-center" max-height="100" max-width="174" style="display:block;">
      </v-img>

    </v-app-bar-title>
    <v-spacer></v-spacer>

    <v-menu>
  <template v-slot:activator="{ props }">
    <v-list-item v-bind="props" variant="tonal" class="mr-4" lines="two" :prepend-avatar="imageUrl" :title="name" :subtitle="charge">
      <template v-slot:append>
        <v-btn size="small" variant="text" icon="mdi-menu-down"></v-btn>
      </template>
    </v-list-item>
  </template>

  <v-list>
    <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" @click="handleItemClick(item)">
      <template v-slot:prepend>
        <v-icon :icon="item.icon"></v-icon>
      </template>
      <v-list-item-title>{{ item.title }}</v-list-item-title>
    </v-list-item>
  </v-list>
</v-menu>
    <!--<v-menu>
      <template v-slot:activator="{ props }">

        <v-list-item v-bind="props" variant="tonal" class="mr-4" lines="two" :prepend-avatar=imageUrl :title=name
          :subtitle=charge>
          <template v-slot:append>
            <v-btn size="small" variant="text" icon="mdi-menu-down"></v-btn>
          </template></v-list-item>

      </template>

      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to">

          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>


          <v-list-item-title> {{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>-->
    <v-dialog v-model="showPasswordForm" width="500">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-2 ml-4">Cambiar Contraseña</span>
          </v-toolbar>
          <v-card-text class="mt-2 mb-2">
            <v-form ref="form" v-model="valid" enctype="multipart/form-data">
              <v-container>
                <v-row>
                  <v-col cols="12">
          <v-text-field
            v-model="password"
            label="Contraseña"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            hint="Haz clic en el ícono para mostrar/ocultar la contraseña"
            variant="underlined"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="confirmPassword"
            label="Nueva Contraseña"
            :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showConfirmPassword ? 'text' : 'password'"
            @click:append="showConfirmPassword = !showConfirmPassword"
            hint="Haz clic en el ícono para mostrar/ocultar la contraseña"
            variant="underlined"
          ></v-text-field>
          
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="confirmNewPassword"
            label="Confirmar Nueva Contraseña"
            :append-icon="showConfirmNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showConfirmNewPassword ? 'text' : 'password'"
            @click:append="showConfirmNewPassword = !showConfirmNewPassword"
            hint="Haz clic en el ícono para mostrar/ocultar la contraseña"
            variant="underlined"
          ></v-text-field>
          <v-alert v-if="confirmPassword !== confirmNewPassword" type="error">
            Las contraseñas no coinciden.
          </v-alert>
        </v-col>
                </v-row>
              </v-container>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" @click="shangePassword" :disabled="confirmPassword !== confirmNewPassword">
                  Aceptar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
  </v-app-bar>
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
//import { UserTokenStore } from "@/store/UserTokenStore";
import axios from "axios";
//const userTokenStore = UserTokenStore();
export default {
  data: () => ({
    nameBranch: '',
    name: '',
    charge: '',
    image: '',
    imageUrl: '',
    password: '',
    user_id:'',
    showPasswordForm: false,
    showPassword: false,
    confirmPassword: '',    
    showConfirmPassword: false,
      confirmNewPassword: '',
      showConfirmNewPassword: false,
    items: [
      { title: 'Mi Perfil', icon: "mdi-account-tie-outline" },     
      { title: 'Cambiar Contraseña', icon: "mdi-form-textbox-password"},
      { title: 'Cerrar Sesión', icon: "mdi-exit-to-app", to:"/"},
    ],
  }),
  mounted() {
    //console.log(userTokenStore);
    // Recuperar datos del localStorage al cargar la aplicación
    this.nameBranch = JSON.parse(LocalStorageService.getItem('nameBranch'));
    this.name = JSON.parse(LocalStorageService.getItem('name'));
    this.charge = JSON.parse(LocalStorageService.getItem('charge'));
    this.user_id = JSON.parse(LocalStorageService.getItem('user_id'));
    const image = LocalStorageService.getItem('image');
    const cleanedImage = image.replace(/"/g, '');
    this.imageUrl = `http://127.0.0.1:8000/api/images/${cleanedImage}`;
    console.log(this.imageUrl);
    // Otros datos que hayas almacenado
  },
  methods: {
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
    shangePassword(){
      console.log(this.user_id)
      axios
        .get('http://127.0.0.1:8000/api/change_password', {
                    params: {
                        id: this.user_id,
                        password: this.confirmPassword,
                    }
                })
        .then((response) => {
          console.log(response);
            this.showAlert("success", "Contraseña modificada correctamente", 3000)
            this.confirmPassword = '';
            this.confirmNewPassword = '';
            this.showPasswordForm = false;
        });
    },
    handleItemClick(item) {
      if (item.title === 'Cambiar Contraseña') {
        console.log('Cambiar contraseña')
        // Aquí puedes mostrar el modal
        this.showPasswordForm = true; // Reemplaza 'modal' con la referencia a tu modal
      }
    },
    close() {
      this.showPasswordForm = false
      this.$nextTick(() => {
        this.password = '';
        this.password_new = '';
      });
    },
  }
}
</script>
