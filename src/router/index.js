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
      meta: { requiresAuth: true, requiresPermissions: ["view_totem"] }
  },  
  /*{
    path: "/reserve",
    name: "Reservar",
    component: () =>
      import( "@/views/reserve/Reserve.vue"),
  }, */
  {
    path: "/toProfessional",
    name: "toProfessional",
    component: () =>
      import( "@/views/totem/enteringWork.vue"),
  },
  {
    path: "/reserve",
    name: "Reservar",
    component: () =>
      import( "@/views/totem/reservation.vue"),
  },
  /*{
    path: "/profesional",
    name: "Profesional",
    component: () =>
      import( "@/views/totem/Profesional.vue"),
  },*/
  {
    path: "/",
    name: "Login",
    component: () =>
      import( "@/views/login.vue"),
  },
  /*{
    path: "/login",
    name: "Prueba",
    component: () =>
      import( "@/views/login.vue"),
  },*/
 
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
        name: "Empresa",
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
        path: "/branch-rule",
        name: "Rule Branch",
        component: () =>
          import( "@/views/branch_rule/BranchRule.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_branch_rules"] },
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
      /*{
        path: "/student",
        name: "Student",
        component: () =>
          import( "@/views/student/Student.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_students"] },
      },*/
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
          import( "@/views/workplaces/WorkPlaces.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_workplace"] },
      },
      {
        path: "/branch-service-professional",
        name: "Servicios se una branch",
        component: () =>
          import( "@/views/branchservice/Branchservices.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_service_branch"] },
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
        meta: { requiresAuth: true, requiresPermissions: ["view_service_professional"] },
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
        path: "/move-product",
        name: "Movimiento de productos",
        component: () =>
          import( "@/views/reportes/MoveProductsBranches.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_move_products"] },
      },
      {
        path: "/product-stock",
        name: "Reposición de Productos",
        component: () =>
          import( "@/views/reportes/ReposicionProduct.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["products_stock"] },
      },
      {
        path: "/expense",
        name: "Gastos",
        component: () =>
          import( "@/views/expense/Expense.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_expenses"] },
      },
      {
        path: "/revenue",
        name: "Ingreo",
        component: () =>
          import( "@/views/revenue/Revenue.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_revenues"] },
      },
      {
        path: "/finance",
        name: "Operaciones",
        component: () =>
          import( "@/views/finance/Finance.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_finances"] },
      },
      {
        path: "/schedule",
        name: "Horarios",
        component: () =>
          import( "@/views/schedule/Schedule.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_schedules"] },
      },
      {
        path: "/finance-branches",
        name: "Finanzas por sucursales",
        component: () =>
          import( "@/views/reportes/FinanceBranches.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_finance_branches"] },
      },
      {
        path: "/finance-branches-details",
        name: "Finanzas por sucursales Detalladas",
        component: () =>
          import( "@/views/reportes/FinanceBranchesDetails.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_finance_branches_details"] },
      },
      {
        path: "/details-operations",
        name: "Finanzas por sucursales por operación",
        component: () =>
          import( "@/views/reportes/DetailsOperations.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_details_operations"] },
      },
      {
        path: "/branch-traces",
        name: "Operaciones de la caja",
        component: () =>
          import( "@/views/reportes/BranchTraces.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_branch_traces"] },
      },
      {
        path: "/vacation",
        name: "Permisos Asistencia",
        component: () =>
          import( "@/views/vacation/Vacations.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_vacations"] },
      },
      {
        path: "/couses-winner",
        name: "Ingresos por cursos",
        component: () =>
          import( "@/views/reportes/CourseWinner.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_courses_winner"] },
      },
      {
        path: "/professional-payment",
        name: "Pago a Profesionales",
        component: () =>
          import( "@/views/professionalpayment/ProfessionalPayment.vue"),
        meta: { requiresAuth: true, requiresPermissions: ["view_professional_payment"] },
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
