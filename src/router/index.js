// Composables
import { createRouter, createWebHistory } from "vue-router";
import LocalStorageService from "@/LocalStorageService";
/*import { UserTokenStore } from "@/store/UserTokenStore";

const userTokenStore = UserTokenStore();*/

const routes = [
  {
    path: "/shift-board",
    name: "ShiftBoard",
    component: () =>
      import( "@/views/shift_board/ShiftBoard.vue"),
    meta: { requiresAuth: true, requiresPermissions: ["view_shift_boards"] }
  },
  {
    path: "/totem",
    name: "Totem",
    component: () =>
      import( "@/views/totem/Totem.vue"),
  },  
  {
    path: "/reserve",
    name: "Reservar",
    component: () =>
      import( "@/views/reserve/Reserve.vue"),
  },
  {
    path: "/profesional",
    name: "Profesional",
    component: () =>
      import( "@/views/totem/Profesional.vue"),
  },
  {
    path: "/",
    name: "Login",
    component: () =>
      import( "@/views/login.vue"),
  },
  {
    path: "/login",
    name: "Prueba",
    component: () =>
      import( "@/views/login.vue"),
  },
 
  {
    path: "/dashboard",
    name: "dashboard",
    //component: () =>   import( "@/views/Login.vue"),
    component: () => import( "@/views/DashboardView.vue"),
    meta: {
      requiresAuth: true, requiresPermissions: ["view_dashboard"]
    },
    children: [
      {
        path: "/business-type",
        name: "BusinessType",
        component: () =>
          import( "@/views/businessType/BusinessType.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_business_types"] },
      },
      {
        path: "/home",
        name: "Home",
        component: () =>
          import( "@/views/Home.vue"),
      },
      {
        path: "/store",
        name: "Store",
        component: () =>
          import( "@/views/store/Store.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_stores"] },
      },

      {
        path: "/box",
        name: "Box",
        component: () =>
          import( "@/views/box/Box.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_shopping_carts"] },
      },
      {
        path: "/busines",
        name: "Bussiness",
        component: () =>
          import( "@/views/business/Business.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_business"] },
      },
      {
        path: "/student",
        name: "Estudiantes",
        component: () =>
          import( "@/views/students/Students.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_students"] },
      },
      {
        path: "/course",
        name: "Cursos",
        component: () =>
          import( "@/views/course/Course.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_courses"] },
      },
      {
        path: "/academy",
        name: "Academias",
        component: () =>
          import( "@/views/academy/Academy.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_academy"] },
      },
      {
        path: "/charge",
        name: "Charge",
        component: () =>
          import( "@/views/charge/Charge.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_charges"] },
      },
      {
        path: "/permission",
        name: "Permisos",
        component: () =>
          import( "@/views/permission/Permission.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_permissions"] },
      },
      {
        path: "/product-category",
        name: "product-category",
        component: () =>
          import( "@/views/product_category/ProductCategory.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_product_categories"] },
      },

      {
        path: "/product",
        name: "product",
        component: () =>
          import( "@/views/product/Product.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_products"] },
      },

      {
        path: "/service",
        name: "service",
        component: () =>
          import( "@/views/service/Service.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_services"] },
      },
      {
        path: "/product-store",
        name: "product-store",
        component: () =>
          import( "@/views/product_store/ProductStore.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_product_store"] },
      },
      {
        path: "/rule",
        name: "Rule",
        component: () =>
          import( "@/views/rule/Rule.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_rules"] },
      },

      {
        path: "/person",
        name: "Person",
        component: () =>
          import( "@/views/person/Person.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_professionals"] },
      },
      {
        path: "/client",
        name: "Client",
        component: () =>
          import( "@/views/client/Client.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_clients"] },
      },
      {
        path: "/student",
        name: "Student",
        component: () =>
          import( "@/views/student/Student.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_students"] },
      },
      {
        path: "/card-gifts",
        name: "Tarjeta Regalo",
        component: () =>
          import( "@/views/cardGift/CardGift.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_gift_cards"] },
      },
      {
        path: "/business",
        name: "Business",
        component: () =>
          import(
             "@/views/business/Business.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_business"] },
      },
      {
        path: "/associated",
        name: "Associados",
        component: () =>
          import(
             "@/views/associated/Associated.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_associates"] },
      },
      {
        path: "/branch",
        name: "Branches",
        component: () =>
          import( "@/views/branch/Branches.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_branches"] },
      },
      {
        path: "/workplace",
        name: "Puestos de Trabajo",
        component: () =>
          import( "@/views/workplaces/Workplaces.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_workplace"] },
      },
      {
        path: "/branch-service-professional",
        name: "Servicios se una branch",
        component: () =>
          import( "@/views/branchservice/BranchServices.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_dashboard"] },
      },
      {
        path: "/business-winner",
        name: "Ganancias Negocios",
        component: () =>
          import( "@/views/reportes/BusinessWinner.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_business_earnings"] },
      },
      {
        path: "/branch-arriving-late",
        name: "Llegadas Tardes",
        component: () =>
          import( "@/views/reportes/BranchArrivingLate.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_late_arrivals"] },
      },
      {
        path: "/professional-arriving-late",
        name: "Llegadas Tardes Profesional",
        component: () =>
          import( "@/views/reportes/ProfessionalArrivingLate.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_professional_late_arrivals"] },
      },
      {
        path: "/professional-arriving",
        name: "Mejores Asistencia Por Profesional",
        component: () =>
          import( "@/views/reportes/ProfessionalArriving.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_best_attendance"] },
      },
      {
        path: "/branch-winner",
        name: "Ganancias Sucursal",
        component: () =>
          import( "@/views/reportes/BranchWinner.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_branch_earnings"] },
      },
      {
        path: "/professional-service",
        name: "Asignar Servicio a profesional",
        component: () =>
          import( "@/views/professionalservice/professionalservice.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_dashboard"] },
      },
      {
        path: "/company-winner",
        name: "Ganancias Compañía",
        component: () =>
          import( "@/views/reportes/CompanyWinner.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_company_earnings"] },
      },
      {
        path: "/branch-winner-professional",
        name: "Monto generado por Profesional",
        component: () =>
          import( "@/views/reportes/BranchWinnerProfessional.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_professional_earnings"] },
      },
      {
        path: "/professional-branch-winner",
        name: "Ganancias Profesional",
        component: () =>
          import( "@/views/reportes/ProfessionalBranchWinner.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_stores"] },
      },
      {
        path: "/client-history",
        name: "Historia de Cliente",
        component: () =>
          import( "@/views/reportes/ClientHistory.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_client_history"] },
      },
      {
        path: "/clients-visist",
        name: "Visitas por clientes",
        component: () =>
          import( "@/views/reportes/ClientsFrecuence.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_clients_frecuence"] },
      },
      {
        path: "/product-mostsolt",
        name: "Productos más vendidos",
        component: () =>
          import( "@/views/reportes/ProductMostSold.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["products_mostsold"] },
      },
      {
        path: "/product-stock",
        name: "Reposición de Productos",
        component: () =>
          import( "@/views/reportes/ReposicionProduct.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["products_stock"] },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  //setActivePinia(createPinia());
  //const store = useUserStore();

  // Requiere autenticación
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    console.log("Esta entrando aqui");
    // El usuario no está autenticado

    // const lastRouteName = localStorage.getItem('permissions')

    console.log(LocalStorageService.getItem("authenticateUser"));
    //console.log(localStorage.getItem("isAuthenticated"));
    if (
      LocalStorageService.getItem("authenticateUser") == false ||
      !LocalStorageService.getItem("authenticateUser")
    ) {
      console.log("aqui entra tambien");
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
      return;
    }
  }
  // Requiere permisos
  if (to.matched.some((record) => record.meta.requiresPermissions)) {
    const permissions = to.meta.requiresPermissions;
    // El usuario no tiene los permisos requeridos
    //const userPermissions1 = userTokenStore.permissionsUser;
    
    const userPermissions = LocalStorageService.getItem("permissionsUser");
    console.log(userPermissions);
    const hasPermissions = permissions.every((permission) =>
      //userPermissions.includes(permission)
      userPermissions.includes(permission)
    );

    if (hasPermissions) {
      next();
    } else {
      next("/forbidden");
      return;
    }
  }

  next();
});

export default router;
