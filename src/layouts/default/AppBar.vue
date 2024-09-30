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
    <v-badge :content="notificationsWithStateZero" color="red" class="mr-4">
  <v-icon
    id="menu-activator"
    color="#F18254"
    @click="showMenu = !showMenu; clearNotifications()" 
    class="mr-2"
    size="x-large"
  ><!--@click="showMenu = !showMenu; clearNotifications()" poniendo esto podemos hacer la logica de pasar todas las que state sea 0 a uno-->
    mdi-bell
  </v-icon>
</v-badge>

<v-menu activator="#menu-activator">
  <v-list>
    <v-list-item
    v-for="item in results"
          :key="item.id"
      :prepend-avatar="'https://api2.simplifies.cl/api/images/' + item.image_url"
      @click="handleItemClickNotif(item)">
      <div class="d-flex align-center justify-space-between w-100"> <!-- Contenedor flex -->
        <v-list-item-title class="mr-2" :class="{ 'highlight': item.state2 === 2, 'accent': item.state !== 2 }">{{ item.tittle }}</v-list-item-title>
        <!-- Iconos de acción 
        <div v-if="item.tittle === 'Solicitud'">
          <v-icon @click.stop="acceptRequest(item)">mdi-check</v-icon>
          <v-icon @click.stop="rejectRequest(item)">mdi-close</v-icon>
        </div>-->
      </div>
      <v-list-item-subtitle :class="{ 'highlight': item.state2 === 2, 'accent': item.state2 !== 2 }">{{ item.nameProfessional }}</v-list-item-subtitle> <!-- Título del elemento de la lista -->
      <v-list-item-subtitle :class="{ 'highlight': item.state2 === 2, 'accent': item.state2 !== 2 }">{{ item.description }}</v-list-item-subtitle> <!-- Título del elemento de la lista -->
    </v-list-item>
  </v-list>
</v-menu>

    <v-menu>
  <template v-slot:activator="{ props }">
    <v-list-item v-bind="props" variant="tonal" class="mr-4" lines="two" :prepend-avatar="imageUrl" :title="name" :subtitle="charge">
      <template v-slot:append>
        <v-btn size="small" variant="text" icon="mdi-menu-down"></v-btn>
      </template>
    </v-list-item>
  </template>

  <v-list>
    <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" @click="handleItemClick(item)" >
      <template v-slot:prepend>
        <v-icon :icon="item.icon"></v-icon>
      </template>
      <v-list-item-title>{{ item.title }}</v-list-item-title>
    </v-list-item>
  </v-list>
</v-menu>
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
// Interceptor para agregar el token a cada solicitud
axios.interceptors.request.use(config => {
  const token = LocalStorageService.getItem('token'); // Suponiendo que guardaste el token en localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token.replace(/['"]+/g, '')}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});
//import router from '@/router/index';
//const userTokenStore = UserTokenStore();
export default {
  data: () => ({
    intervalId: null,
    snackbar: false,
  sb_type: '',
  sb_message: '',
  sb_timeout: 2000,
  sb_title:'',
  sb_icon:'',
    nameBranch: '',
    name: '',
    charge: '',
    image: '',
    imageUrl: '',
    password: '',
    user_id:'',
    branch_id:'',
    professional_id: '',
    results: [],
    showPasswordForm: false,
    showPassword: false,
    confirmPassword: '',    
    showConfirmPassword: false,
      confirmNewPassword: '',
      showConfirmNewPassword: false,
    items: [
      //{ title: 'Mi Perfil', icon: "mdi-account-tie-outline" },     
      { title: 'Cambiar Contraseña', icon: "mdi-form-textbox-password"},
      { title: 'Cerrar Sesión', icon: "mdi-exit-to-app"},
    ],
  }),
  mounted() {
    //console.log(userTokenStore);
    // Recuperar datos del localStorage al cargar la aplicación
    this.nameBranch = JSON.parse(LocalStorageService.getItem('nameBranch'));
    this.name = JSON.parse(LocalStorageService.getItem('name'));
    this.charge = JSON.parse(LocalStorageService.getItem('charge'));
    this.user_id = JSON.parse(LocalStorageService.getItem('user_id'));
    this.professional_id = JSON.parse(LocalStorageService.getItem('professional_id'));
    this.branch_id = LocalStorageService.getItem('branch_id');
    const image = LocalStorageService.getItem('image');
    const cleanedImage = image.replace(/"/g, '');
    this.imageUrl = `https://api2.simplifies.cl/api/images/${cleanedImage}`;
    console.log(this.imageUrl);
    // Otros datos que hayas almacenado
    // Iniciar el intervalo con la lógica de bloqueo
    if (this.charge !== 'Totem' && this.charge !== 'Pizarra') {        
    this.initialize();    
    this.startInterval();
    }
    
    // Redirigir según el cargo
    this.redirectBasedOnCharge();
  },
  beforeUnmount() {
    //Detener el intervalo cuando el componente se esté destruyendo para evitar fugas de memoria
    clearInterval(this.intervalId);
  },
  computed: {
    notificationsWithStateZero() {
      return this.results.filter(notification => notification.state2 === 0).length;
    }
  },
  methods: {

    


    startInterval() {
  this.intervalId = setInterval(() => {
    if (!LocalStorageService.getIsLocked()) {
      LocalStorageService.setIsLocked(true); // Bloquear antes de hacer la petición
      axios
        .get('https://api2.simplifies.cl/api/notification-professional-web', {
          /*headers: {
                'Authorization': `Bearer ${token.replace(/['"]+/g, '')}`
            },*/
          params: {
            branch_id: this.branch_id,
            professional_id: this.professional_id
          }
        })
        .then((response) => {
          this.results = response.data.notifications;
        }).catch((error) => {
          if (error.response) {
            // El servidor respondió con un código de estado diferente de 2xx
            if (error.response.status === 500) {
              this.showAlert("error", "Error interno del servidor. Por favor, intenta de nuevo más tarde.", 3000);
            } else {
              this.showAlert("warning", 'Ocurrió un error en la solicitud', 3000);
            }
          } else if (error.request) {
            // La solicitud fue hecha, pero no hubo respuesta
            this.showAlert("warning", 'No se pudo establecer conexión con el servidor. Por favor, revisa tu conexión a Internet', 3000);
          } else {
            // Algo más causó el error
            this.showAlert("warning", 'Ocurrió un error desconocido. Por favor, intenta de nuevo.', 3000);
          }
        })
        .finally(() => {
          LocalStorageService.setIsLocked(false); // Desbloquear después de la petición
          console.log('isLocked después de la solicitud Bar:', LocalStorageService.getIsLocked());
        });
    }
  }, 30000);
},
    redirectBasedOnCharge() {
      switch (this.charge) {
        case 'Cajero (a)':
          this.$router.push({ path: 'box' });
          break;
        case 'Totem':
          this.$router.push({ path: 'totem' });
          break;
        case 'Pizarra':
          this.$router.push({ path: 'shift-board' });
          break;
      }
    },
    handleItemClickNotif(item) {
      let request = {
        id: item.id,
        charge: this.charge
      };
      axios
        .put('https://api2.simplifies.cl/api/notification3', request)
        .then(() => {
          //this.initialize();
        }).finally(() => {
          //this.initialize();
          this.$router.push({ path: 'car-order-delete' });
          });
  },
    clearNotifications() {
      const results = this.results
    .filter(notification => notification.state2 === 0)
    .map(notification => notification.id);
    if(results && results.length > 0){
      let request = {
        ids: results,
        charge: this.charge
      };
      axios
        .put('https://api2.simplifies.cl/api/notification-charge', request)
        .then(() => {
          //this.initialize();
        }).finally(() => {
          this.initialize();
          });
    }
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
    shangePassword(){
      console.log(this.user_id)
      axios
        .get('https://api2.simplifies.cl/api/change_password', {
                    params: {
                        id: this.user_id,
                        password: this.confirmPassword,
                    }
                })
        .then((response) => {
          console.log(response);
            this.confirmPassword = '';
            this.confirmNewPassword = '';
            this.showPasswordForm = false;
            this.showAlert("success", "Contraseña modificada correctamente", 3000);
        });
    },
    handleItemClick(item) {
      if (item.title === 'Cambiar Contraseña') {
        console.log('Cambiar contraseña')
        // Aquí puedes mostrar el modal
        this.showPasswordForm = true; // Reemplaza 'modal' con la referencia a tu modal
      }
      if (item.title === 'Cerrar Sesión') {
        const token = LocalStorageService.getItem('token');
        console.log('Cerrar Sesión')
        axios
        .get('https://api2.simplifies.cl/api/logout', {
          headers: {
                'Authorization': `Bearer ${token.replace(/['"]+/g, '')}`
            }
                })
        .then();
      LocalStorageService.logout();
        this.$router.push({ path: '/' });
      }
      if (item.title === 'Mi Perfil') {
        console.log('Mi Perfil')
        axios
        .get('https://api2.simplifies.cl/api/professional-show', {
                    params: {
                        id: this.professional_id,
                    }
                })
        .then((response) => {
          this.results = response.data.professional;
          console.log(this.results);
          /*console.log(response);
            this.showAlert("success", "Contraseña modificada correctamente", 3000)
            this.confirmPassword = '';
            this.confirmNewPassword = '';
            this.showPasswordForm = false;*/
        });
        // Aquí puedes mostrar el modal
        //this.showPasswordForm = true; // Reemplaza 'modal' con la referencia a tu modal
      }
    },
    close() {
      this.showPasswordForm = false
      this.$nextTick(() => {
        this.password = '';
        this.password_new = '';
      });
    },
    initialize(){
      const token = LocalStorageService.getItem('token');
      console.log('Este es el token');
      console.log(token);
      console.log('Este es el token Bearer');
      console.log(`Bearer ${token}`);
      axios
        .get('https://api2.simplifies.cl/api/notification-professional-web', {
          /*headers: {
                'Authorization': `Bearer ${token.replace(/['"]+/g, '')}`
            },*/
                    params: {
                        branch_id: this.branch_id,
                        professional_id: this.professional_id
                    }
                })
        .then((response) => {
          this.results = response.data.notifications;
        }).catch((error) => {
          if (error.response) {
            // El servidor respondió con un código de estado diferente de 2xx
            if (error.response.status === 500) {
              this.showAlert("error", "Error interno del servidor. Por favor, intenta de nuevo más tarde.", 3000);
            } else {
              this.showAlert("warning", 'Ocurrió un error en la solicitud', 3000);
            }
          } else if (error.request) {
            // La solicitud fue hecha, pero no hubo respuesta
            this.showAlert("warning", 'No se pudo establecer conexión con el servidor. Por favor, revisa tu conexión a Internet', 3000);
          } else {
            // Algo más causó el error
            this.showAlert("warning", 'Ocurrió un error desconocido. Por favor, intenta de nuevo.', 3000);
          }
        });
    }
  }
}
</script>
<style>
.highlight { /* Color de texto primario en Vuetify por defecto */
  opacity: 0.6;
}
.accent {  
  font-weight: bold;
}
</style>
