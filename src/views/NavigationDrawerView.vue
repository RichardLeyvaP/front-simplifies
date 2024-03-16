<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <v-card class="full-height">
    <v-layout class="full-height">
      <v-navigation-drawer permanent class="pt-4" color="#2B3141" theme="dark">
        <template v-slot:prepend>
          <v-list-item color="black" class="text-subtitle-1" lines="two" variant="flat"
            prepend-avatar="@/assets/hernandez_big.png" :title="this.titulo" :subtitle="this.subtitle">
          </v-list-item>
        </template>

        <v-divider></v-divider>

        <v-list color="" density="compact" nav>
          <v-list-item prepend-icon="mdi-view-dashboard-outline" title="Dashboard" to="home" value="home"></v-list-item>
          <v-list-group value="Administración" v-if="filteredMenuAdministracion.length !== 0">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-cog-outline" title="Administración"></v-list-item>
            </template>

            <v-list-item v-for="item in filteredMenuAdministracion" style="padding-left: 20px !important;" :key="item.title" :prepend-icon="item.icon" :title="item.title"
            :to="item.to" :value="item.value"> <!-- Filtrado directo usando v-if -->
  
            </v-list-item>

          </v-list-group>

          <v-list-group value="Almacenes" v-if="filteredMenuAlmacenes.length !== 0">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-store-outline" title="Almacenes"></v-list-item>
            </template>

            <v-list-item v-for="item in filteredMenuAlmacenes" style="padding-left: 20px !important;" :key="item.title" :prepend-icon="item.icon" :title="item.title"
            :to="item.to" :value="item.value"> <!-- Filtrado directo usando v-if -->
  
            </v-list-item>

          </v-list-group>

          <v-list-item v-for="item in filteredMenuItems"   :key="item.title" :prepend-icon="item.icon" :title="item.title"
            :to="item.to" :value="item.value"></v-list-item>

          <v-list-group value="Academias" v-if="filteredMenuAcademia.length !== 0">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-school" title="Academias"></v-list-item>
            </template>


            <v-list-item v-for="item in filteredMenuAcademia" style="padding-left: 20px !important" :key="item.title" :prepend-icon="item.icon" :title="item.title"
            :to="item.to" :value="item.value"></v-list-item> <!-- Filtrado directo usando v-if -->
          </v-list-group>
          <v-list-group value="Reportes" v-if="filteredMenuReportes.length !== 0">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-file-document-outline" title="Reportes"></v-list-item>
            </template>


            <v-list-item v-for="item in filteredMenuReportes" style="padding-left: 20px !important" :key="item.title" :prepend-icon="item.icon" :title="item.title"
            :to="item.to" :value="item.value"></v-list-item> <!-- Filtrado directo usando v-if -->
          </v-list-group>
          <v-list-group value="Mantenedores" v-if="filteredMenuMainteiners.length !== 0">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-progress-wrench" title="Mantenedores"></v-list-item>
            </template>

            <v-list-item v-for="item in filteredMenuMainteiners" style="padding-left: 20px !important" :key="item.title" :prepend-icon="item.icon" :title="item.title"
            :to="item.to" :value="item.value"></v-list-item> <!-- Filtrado directo usando v-if -->
          </v-list-group>

        </v-list>
      </v-navigation-drawer>
      <v-main class="full-height" style="overflow-y: auto;"></v-main>
    </v-layout>
  </v-card>
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
/*import { UserTokenStore } from "@/store/UserTokenStore";

const userTokenStore = UserTokenStore();*/
export default {
  data: () => ({
    user: [],
    nameBranch: '',
    nameBusiness: '',
    charge_id: '',
    permissionsUser: '',
    titulo: '',
    subtitle: '',
    token: '',
    open: ['Users'],
    mainteiners: [
      { title: "Tipos de Negocio", icon: "mdi-format-list-bulleted-type", to: "/business-type", permission: "view_business_types" },
      //{ title: "Cargos", icon: "mdi-family-tree", to: "/charge", permission: "view_charges" },
      { title: "Reglas de convivencia", icon: "mdi-ruler", to: "/rule", permission: "view_rules" },
      //{ title: "Categorías de Productos", icon: "mdi-tag-check", to: "/product-category", permission: "view_product_categories" },
    ],
    listItems: [
      { icon: "mdi-storefront-outline", title: "Sucursales", to: "branch", value: "surcursal", permission: "view_branches" },
      //{ icon: "mdi-tag-outline", title: "Productos", to: "product", value: "products", permission: "view_products" },
      { icon: "mdi-list-box-outline", title: "Servicios", to: "service", value: "services", permission: "view_services" },
      //{ icon: "mdi-store-outline", title: "Almacenes", to: "store", value: "stores", permission: "view_stores" },
      { icon: "mdi-calendar-outline", title: "Agendas", value: "reservation", to: "reservation", permission: "view_calendar" },
      { icon: "mdi-cash-register", title: "Caja", to: "box", value: "cash", permission: "view_shopping_carts" },
      { icon: "mdi-television", title: "Pizarras de Turnos", to: "shift-board", value: "shift-board", permission: "view_shift_boards" },
      { icon: "mdi-gift", title: "Tarjeta Regalo", to: "card-gifts", value: "Tarjeta Regalos", permission: "view_gift_cards" },
    ],
    reportes: [
      { icon: "mdi-finance", title: "Ganancias Sucursales del Negocio", to: "branch-winner", value: "branch-winners", permission: "view_branch_earnings" },
      { icon: "mdi-finance", title: "Ganancias Negocio", to: "company-winner", value: "company-winners", permission: "view_company_earnings" },
      { icon: "mdi-finance", title: "Monto por Profesionales", to: "branch-winner-professional", value: "branch-winner-professional", permission: "view_professional_earnings" },
      { icon: "mdi-finance", title: "Historial Clientes", to: "client-history", value: "client-history", permission: "view_client_history" },
      { icon: "mdi-finance", title: "Ganancias Negocios por Sucursales", to: "business-winner", value: "business-winner", permission: "view_business_earnings" },
      { icon: "mdi-timer-off", title: "Llegadas Tardes General", to: "branch-arriving-late", value: "branch-arriving-late", permission: "view_late_arrivals" },
      { icon: "mdi-timer-off", title: "Asistencia por Profesional", to: "professional-arriving-late", value: "professional-arriving-late", permission: "view_professional_late_arrivals" },
      { icon: "mdi-timer", title: "Profesionales Mejor Asistencias", to: "professional-arriving", value: "professional-arriving", permission: "view_best_attendance" },
      { icon: "mdi-account-multiple", title: "Visitas por Clientes", to: "clients-visist", value: "clients-visist", permission: "view_clients_frecuence" },
      { icon: "mdi-trending-up", title: "Productos más vendidos", to: "product-mostsolt", value: "product-mostsolt", permission: "products_mostsold" },
      { icon: "mdi-shuffle", title: "Reposición de Productos", to: "product-stock", value: "product-stock", permission: "products_stock" },  
    ],
    academias: [
      { icon: "mdi-school", title: "Academia", to: "academy", value: "academy", permission: "view_academy" },
      { icon: "mdi-account-group", title: "Estudiantes", to: "student", value: "student", permission: "view_students" },
      { icon: "mdi-book", title: "Cursos", to: "course", value: "course", permission: "view_courses" },
    ],
    administracion: [
      { icon: "mdi-domain", title: "Empresa", to: "busines", value: "busines", permission: "view_busines" },
      { title: "Cargos", icon: "mdi-family-tree", to: "/charge", permission: "view_charges" },
      //{ icon: "mdi-store", title: "Asignar Productos", to: "product-store", value: "product-store", permission: "view_product_store" },
      { icon: "mdi-security", title: "Permisos del Sistema", to: "permission", value: "permission", permission: "view_permissions" },
      { icon: "mdi-account-tie-outline", title: "Profesionales", to: "person", value: "profesionals", permission: "view_professionals" },
      { icon: "mdi-account-star-outline", title: "Clientes", to: "client", value: "clients", permission: "view_clients" },
      { icon: "mdi-handshake", title: "Associados", to: "associated", value: "associated", permission: "view_associates" },
      { icon: "mdi-list-box-outline", title: "Asignar servicios a professional", to: "professional-service", value: "professional-service", permission: "view_dashboard" },
      { icon: "mdi-list-box-outline", title: "Asignar servicios a una Sucursal", to: "branch-service-professional", value: "branch-service-professional", permission: "view_dashboard" },          
      { icon: "mdi mdi-chair-rolling", title: "Puestos de Trabajo", to: "workplace", value: "workplace", permission: "view_workplace" },
  
    ],
    almacenes: [      
      { icon: "mdi-store-outline", title: "Almacenes", to: "store", value: "stores", permission: "view_stores" },
      { icon: "mdi-tag-outline", title: "Productos", to: "product", value: "products", permission: "view_products" },
      { icon: "mdi-store", title: "Asignar Productos", to: "product-store", value: "product-store", permission: "view_product_store" },
      { title: "Categorías de Productos", icon: "mdi-tag-check", to: "/product-category", permission: "view_product_categories" },
    ],
    allowedPermissions: ["view_dashboard", "view_menu",],

  }),
  computed: {
    // Filtra los ítems de menú basándose en los permisos permitidos
    filteredMenuAdministracion() {
      console.log(this.permissionsUser);
      return this.administracion.filter(item => this.permissionsUser.includes(item.permission));
    },
    filteredMenuAcademia() {
      console.log(this.permissionsUser);
      return this.academias.filter(item => this.permissionsUser.includes(item.permission));
    },
    filteredMenuItems() {
      console.log(this.permissionsUser);
      return this.listItems.filter(item => this.permissionsUser.includes(item.permission));
    },
    filteredMenuReportes() {
      console.log(this.permissionsUser);
      return this.reportes.filter(item => this.permissionsUser.includes(item.permission));
    },
    filteredMenuMainteiners() {
      console.log(this.permissionsUser);
      return this.mainteiners.filter(item => this.permissionsUser.includes(item.permission));
    },
    filteredMenuAlmacenes() {
      console.log(this.permissionsUser);
      return this.almacenes.filter(item => this.permissionsUser.includes(item.permission));
    }
},
  created() {
    //this.loadedData = LocalStorageService.getItem("myDataKey");
    // Recuperar datos del localStorage al cargar la aplicación
    this.nameBranch = JSON.parse(LocalStorageService.getItem("nameBranch"));
    this.nameBusiness = JSON.parse(LocalStorageService.getItem("nameBusiness"));
    this.name = JSON.parse(LocalStorageService.getItem("name"));
    this.charge_id = LocalStorageService.getItem("charge_id");
    this.permissionsUser = LocalStorageService.getItem("permissionsUser");
    console.log(this.permissionsUser);
    if (this.charge_id === '4') {
      // Mostrar la fila con Autocomplete
      this.titulo = this.nameBusiness;
      this.subtitle = 'Negocio';
    }
    else {
      this.titulo = this.nameBranch;
      this.subtitle = 'Sucursal';
    }
    /*this.nameBranch = userTokenStore.nameBranch;
    this.nameBusiness = userTokenStore.nameBusiness;
    this.name = userTokenStore.userName;*/
    // Otros datos que hayas almacenado
  }
}
</script>

<style>
.full-height {
  height: 100%;
}
</style>


