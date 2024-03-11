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
    items: [
      { title: 'Mi Perfil', icon: "mdi-account-tie-outline" },     
      { title: 'Cambiar Contraseña', icon: "mdi-form-textbox-password" },
      { title: 'Cerrar Sesión', icon: "mdi-exit-to-app", to:"/login"},

    ],
  }),
  mounted() {
    console.log(userTokenStore);
    // Recuperar datos del localStorage al cargar la aplicación
    this.nameBranch = JSON.parse(LocalStorageService.getItem('nameBranch'));
    this.name = JSON.parse(LocalStorageService.getItem('name'));
    this.charge = JSON.parse(LocalStorageService.getItem('charge'));
    const image = LocalStorageService.getItem('image');
    const cleanedImage = image.replace(/"/g, '');
    this.imageUrl = `http://127.0.0.1:8000/api/images/${cleanedImage}`;
    console.log(this.imageUrl);
    // Otros datos que hayas almacenado
  }
}
</script>
