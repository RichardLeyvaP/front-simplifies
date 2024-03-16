<template>
  <v-app-bar scroll-threshold="0">
    <v-app-bar-title>

      <v-img src="@/assets/logo_negro.png" class="justify-center" max-height="100" max-width="174" style="display:block;">
      </v-img>

    </v-app-bar-title>
    <v-spacer></v-spacer>

    <v-menu>
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
    </v-menu>
    <v-dialog v-if="showPasswordForm" width="500">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-2 ml-4">Cambiar Contraseña</span>
          </v-toolbar>
          <v-card-text class="mt-2 mb-2">
            <v-form ref="form" v-model="valid" enctype="multipart/form-data">
              <v-container>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-text-field v-model="editedItem.password" clearable label="Contraseña"
                      prepend-icon="mdi-form-textbox-password" variant="underlined" >
                    </v-text-field>
                    </v-col>
                </v-row>
              </v-container>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="closePermission">
                  Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" @click="savePermission" :disabled="!valid">
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
import { UserTokenStore } from "@/store/UserTokenStore";

const userTokenStore = UserTokenStore();
export default {
  data: () => ({
    nameBranch: '',
    name: '',
    charge: '',
    image: '',
    imageUrl: '',
    showPasswordForm: false,
    items: [
      { title: 'Mi Perfil', icon: "mdi-account-tie-outline" },     
      { title: 'Cambiar Contraseña', icon: "mdi-form-textbox-password", click:"handleItemClick()"},
      { title: 'Cerrar Sesión', icon: "mdi-exit-to-app", to:"/"},

    ],
  }),
  mounted() {
    console.log(userTokenStore);
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
    handleItemClick() {
        this.showPasswordForm = true;
    },
  }
}
</script>
