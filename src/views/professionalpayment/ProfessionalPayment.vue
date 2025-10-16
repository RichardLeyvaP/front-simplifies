<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-snackbar class="mt-12" location="right top" :timeout="sb_timeout" :color="sb_type" elevation="24"
        :multi-line="true" vertical v-model="snackbar">
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
    <v-card elevation="6" class="mx-5">
        <v-toolbar color="#F18254">
            <v-row align="center">
                <v-col cols="12" md="5" class="grow ml-4 t">
                    <span class="text-subtitle-1"> <strong>Pago a Profesionales</strong></span>
                </v-col>
            </v-row>
        </v-toolbar>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="12" md="4">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches"
                        v-if="this.mostrarFila" clearable label="Seleccione una Sucursal" prepend-icon="mdi-store"
                        item-title="name" item-value="id" variant="underlined"
                        @update:model-value="initialize()"></v-autocomplete>
                </v-col>
            </v-row>
            <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                hide-details></v-text-field>
            <div :style="divStyle">
                <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :search="search"
                    :items="results" class="elevation-1" no-results-text="No hay datos disponibles"
                    no-data-text="No hay datos disponibles" :loading="loadingPay" loading-text="Cargando datos...">
                    <template v-slot:item.name="{ item }">

                        <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                            <v-img :src="`${this.$axios.defaults.baseURL}images/${item.image_url}`" alt="image"></v-img>
                        </v-avatar>
                        {{ item.name }}
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-btn density="comfortable" icon="mdi-account-cash" @click="pagoProfessional(item)"
                            color="primary" variant="tonal" elevation="1" title="Pago a profesional"></v-btn>
                    </template>
                </v-data-table>
            </div>
        </v-card-text>

        <!--Barbero y encargado-->
        <v-dialog v-model="dialogBarberoEncargado" fullscreen transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar color="#F18254">
                    <span class="text-subtitle-1 ml-4">Pagos realizados a [<strong>{{ this.professional_name
                            }}</strong>]</span>
                    <v-spacer></v-spacer>
                    <v-btn class="text-subtitle-1  ml-1" color="#E7E9E9" variant="flat" elevation="2"
                        prepend-icon="mdi-file-excel" @click="exportToExcelProfessional">
                        Exportar a Excel
                    </v-btn>
                    <v-btn class="text-subtitle-1  ml-1 " color="#E7E9E9" variant="flat" elevation="2"
                        prepend-icon="mdi-plus-circle" @click="showAddPago()">
                        Nuevo Pago
                    </v-btn>
                </v-toolbar>
                <v-container fluid>
                    <v-row>
                        <!-- Primera columna -->
                        <v-col cols="12" sm="6" md="2">
                            <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                                transition="scale-transition" offset-y min-width="290px">
                                <template v-slot:activator="{ props }">
                                    <v-text-field v-bind="props" :modelValue="dateFormatted" variant="outlined"
                                        append-inner-icon="mdi-calendar" label="Fecha inicial"></v-text-field>
                                </template>
                                <v-locale-provider locale="es">
                                    <v-date-picker header="Calendario" title="Seleccione la fecha"
                                        color="orange lighten-2" :modelValue="getDate" @update:model-value="updateDate"
                                        format="yyyy-MM-dd" :max="dateFormatted2"></v-date-picker>
                                </v-locale-provider>
                            </v-menu>
                        </v-col>
                        <!-- Segunda columna -->
                        <v-col cols="12" sm="6" md="2">
                            <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                                transition="scale-transition" offset-y min-width="290px">
                                <template v-slot:activator="{ props }">
                                    <v-text-field v-bind="props" :modelValue="dateFormatted2" variant="outlined"
                                        append-inner-icon="mdi-calendar" label="Fecha final"></v-text-field>
                                </template>
                                <v-locale-provider locale="es">
                                    <v-date-picker header="Calendario" title="Seleccione la fecha"
                                        color="orange lighten-2" :modelValue="getDate2"
                                        @update:model-value="updateDate2" format="yyyy-MM-dd"
                                        :min="dateFormatted"></v-date-picker>
                                </v-locale-provider>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" md="1">
                            <v-btn icon @click="showProfessionalPeriodo()" color="#F18254">
                                <v-icon>mdi-magnify</v-icon></v-btn>
                        </v-col>
                        <v-col cols="2" class="pa-1" md="2">
                            <v-card class="pa-2" elevation="2" @click="filterResults('Bono convivencias')">
                                <v-list-item :subtitle="formatNumber(bonoconvivencia)" title="Bono convivencias">
                                    <template v-slot:prepend>
                                        <v-avatar color="green">
                                            <v-icon color="white">{{ 'mdi-plus-circle' }}</v-icon>
                                        </v-avatar>
                                    </template>
                                </v-list-item>
                            </v-card>
                        </v-col>
                        <v-col cols="2" class="pa-1" md="2">
                            <v-card class="pa-2" elevation="2" @click="filterResults('Bono servicios')">
                                <v-list-item :subtitle="formatNumber(bonoservicios)" title="Bono servicios">
                                    <template v-slot:prepend>
                                        <v-avatar color="green">
                                            <v-icon color="white">{{ 'mdi-plus-circle' }}</v-icon>
                                        </v-avatar>
                                    </template>
                                </v-list-item>
                            </v-card>
                        </v-col>
                        <v-col cols="2" class="pa-1" md="2">
                            <v-card class="pa-2" elevation="2" @click="filterResults('Bono productos')">
                                <v-list-item :subtitle="formatNumber(bonoproductos)" title="Bono productos">
                                    <template v-slot:prepend>
                                        <v-avatar color="green">
                                            <v-icon color="white">{{ 'mdi-plus-circle' }}</v-icon>
                                        </v-avatar>
                                    </template>
                                </v-list-item>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
                <v-card-text>
                    <v-text-field class="mt-1 mb-1" v-model="search3" append-icon="mdi-magnify" label="Buscar"
                        single-line hide-details></v-text-field>
                    <div style="max-height: 60vh; overflow-y: auto;">
                        <v-data-table :headers="headers3" :items="professionalPayment" :search="search3"
                            class="elevation-1" :items-per-page-text="'Elementos por páginas'"
                            no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles"
                            :loading="loadingPayment" loading-text="Cargando datos...">
                            <template v-slot:item.date="{ item }">
                                <span :class="{ 'bold-row': item.date == 'Total' }">
                                    {{ item.date }}
                                </span>
                            </template>
                            <template v-slot:item.amount="{ item }">
                                {{ formatNumber(parseFloat(item.amount))}}
                            </template>
                            <template v-slot:item.actions="{ item }">
                                <v-btn density="comfortable" icon="mdi-pencil"
                                    @click="(this.charge === 'Barbero' || this.charge === 'Barbero y Encargado'|| item.type !== 'Mes') ? '' :editItem(item)"
                                    :color="(this.charge === 'Barbero' || this.charge === 'Barbero y Encargado'|| item.type !== 'Mes') ? 'grey' : 'primary'"
                                    variant="tonal" elevation="1" class="mr-1 mt-1 mb-1"
                                    title="Editar Pago Mensual a profesional"></v-btn>
                                <v-btn v-if="item.date !== 'Total'" density="comfortable" icon="mdi-delete"
                                    :color="(item.type === 'Mes') ? 'red-darken-4' : 'grey'" variant="tonal"
                                    elevation="1" title="Eliminar Pago a profesional"
                                    @click="(item.type === 'Mes') ? deleteItem(item) : ''"></v-btn>
                            </template>

                        </v-data-table>
                    </div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#E7E9E9" variant="flat" @click="barberoDelete">
                        Volver
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!--Barbero y encargado nuevo pago-->
        <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">

            <v-card>
                <v-toolbar color="#F18254">
                    <span class="text-subtitle-2 ml-4">{{ formTitle }} [<strong>{{ this.professional_name
                            }}</strong>]</span>
                </v-toolbar>
                <v-card-text>
                    <v-form ref="form" v-model="valid" enctype="multipart/form-data">
                        <v-stepper elevation="6" bg-color="" v-model="stepProfessional" :items="itemsProfessional"
                            hide-actions style="max-height: 100vh; min-height: 95vh; overflow-y: auto">
                            <template v-slot:item.1>
                                <div style="flex: 1; overflow-y: auto; padding: 16px;">
                                    <v-row>
                                        <v-col cols="12" md="3">

                                        </v-col>
                                        <v-col cols="12" md="4">

                                        </v-col>
                                        <v-col cols="12" md="5">
                                            <v-card class="mx-auto" max-width="344" title="Monto a Pagar"
                                                :subtitle="this.formatNumber(payments.cars.total_neto)"
                                                append-icon="mdi-check">

                                                <template v-slot:prepend>
                                                    <v-avatar color="#F18254">
                                                        <v-icon icon="mdi-currency-usd"></v-icon>
                                                    </v-avatar>
                                                </template>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                    <v-row>

                                        <v-col cols="12" md="12">
                                            <v-text-field class="mt-1 mb-1" v-model="search6" append-icon="mdi-magnify"
                                                label="Buscar" single-line hide-details></v-text-field>
                                            <div style="max-height: 50vh; overflow-y: auto;">
                                                <v-data-table :headers="headers2"
                                                    :items-per-page-text="'Elementos por páginas'" :search="search2"
                                                    :items="cars" class="elevation-1"
                                                    no-results-text="No hay datos disponibles"
                                                    no-data-text="No hay datos disponibles" :loading="loadingProfessPay"
                                                    loading-text="Cargando datos..." sticky-header>
                                                    <template v-slot:item.clientName="{ item }">
                                                        <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                                                            <v-img
                                                                :src="`${this.$axios.defaults.baseURL}images/${item.client_image}`"
                                                                alt="image"></v-img>
                                                        </v-avatar>
                                                        {{ item.clientName }}
                                                    </template>
                                                    <template v-slot:item.meta="{ item }">
                                                        <div class="text-center" v-html="formatMeta(item.meta)"></div>
                                                    </template>
                                                    <template v-slot:item.pay="{ item }">
                                                        <strong>{{ formatNumber(Number(item.totalServices) +
                                                            Number(item.tip)) }}</strong>
                                                    </template>
                                                    <template v-slot:item.totalServices="{ item }">
                                                        {{ formatNumber(item.totalServices)}}
                                                    </template>
                                                    <template v-slot:item.amountGenerate="{ item }">
                                                        {{ formatNumber(item.amountGenerate)}}
                                                    </template>
                                                    <template v-slot:item.tip="{ item }">
                                                        {{ formatNumber(item.tip)}}
                                                    </template>
                                                </v-data-table>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </div>
                                <v-divider></v-divider>
                                <div style="padding: 16px; border-top: 1px solid #eee;">
                                    <!-- BOTONES -->
                                    <v-row class="mt-1">
                                        <v-btn color="#E7E9E9" variant="flat" @click="close()">Salir</v-btn>
                                        <v-spacer></v-spacer>
                                        <v-btn color="#E7E9E9" variant="flat" @click="nextStepProfessional">
                                            Siguiente
                                        </v-btn>
                                    </v-row>
                                </div>
                            </template>
                            <template v-slot:item.2>
                                <div style="flex: 1; overflow-y: auto; padding: 16px;">
                                    <v-row>
                                        <v-col cols="12" md="3">
                                            <v-select label="Tipo de pago" v-model="editedItem.academia"
                                                :items="['Pago Academia']" :item-value="['Pago Academia']"
                                                variant="underlined" :rules="selectRules"
                                                prepend-icon="mdi-check-circle"
                                                v-if="this.courses.length > 0"></v-select>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="amountFormatted" label="Monto"
                                                v-if="this.courses.length > 0" prepend-icon="mdi-cash"
                                                variant="underlined" :rules="[...pago, validateAmount]">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="5">
                                            <v-card class="mx-auto" max-width="344" title="Pago de Docencia"
                                                :subtitle="this.formatNumber(Number(editedItem.amountAcadem))"
                                                append-icon="mdi-check">

                                                <template v-slot:prepend>
                                                    <v-avatar color="#F18254">
                                                        <v-icon icon="mdi-currency-usd"></v-icon>
                                                    </v-avatar>
                                                </template>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                    <v-row>

                                        <v-col cols="12" md="12">
                                            <v-text-field class="mt-1 mb-1" v-model="search4" append-icon="mdi-magnify"
                                                label="Buscar" single-line hide-details></v-text-field>
                                            <div style="max-height: 50vh; overflow-y: auto;">
                                                <v-data-table :headers="headers4" 
                                                    :items-per-page-text="'Elementos por páginas'" :search="search4"
                                                    :items="courses" class="elevation-1"
                                                    no-results-text="No hay datos disponibles"
                                                    no-data-text="No hay datos disponibles" :loading="loadingCoursePay"
                                                    loading-text="Cargando datos...">
                                                    <template v-slot:item.price="{ item }">
                                                        {{ formatNumber(parseFloat(item.price))}}
                                                    </template>
                                                    <template v-slot:item.totalPayment="{ item }">
                                                        {{ formatNumber(parseFloat(item.totalPayment))}}
                                                    </template>
                                                </v-data-table>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </div>
                                <v-divider></v-divider>
                                <div style="padding: 16px; border-top: 1px solid #eee;">
                                    <!-- BOTONES -->
                                    <v-row class="mt-1">
                                        <v-btn color="#E7E9E9" variant="flat"
                                            @click="prevStepProfessional">Volver</v-btn>
                                        <v-spacer></v-spacer>
                                        <v-btn color="#E7E9E9" variant="flat" @click="nextStepProfessional"
                                            :disabled="courses.length > 0 ? !selected2.length && !valid: false">
                                            Siguiente
                                        </v-btn>
                                    </v-row>
                                </div>
                            </template>
                            <template v-slot:item.3>
                                <div style="flex: 1; overflow-y: auto; padding: 16px;">
                                    <v-row>
                                        <v-col cols="12" md="3">
                                        </v-col>
                                        <v-col cols="12" md="4">
                                        </v-col>
                                        <v-col cols="12" md="5">
                                            <v-card class="mx-auto" max-width="344" title="Bono de Productos"
                                                :subtitle="this.formatNumber(payments.products.commission_neto)"
                                                append-icon="mdi-check">

                                                <template v-slot:prepend>
                                                    <v-avatar color="#F18254">
                                                        <v-icon icon="mdi-currency-usd"></v-icon>
                                                    </v-avatar>
                                                </template>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                    <v-row>

                                        <v-col cols="12" md="12">
                                            <v-text-field class="mt-1 mb-1" v-model="search6" append-icon="mdi-magnify"
                                                label="Buscar" single-line hide-details></v-text-field>
                                            <div style="max-height: 50vh; overflow-y: auto;">
                                                <v-data-table :headers="headers7"
                                                    :items-per-page-text="'Elementos por páginas'" :search="search7"
                                                    :items="products" class="elevation-1"
                                                    no-results-text="No hay datos disponibles"
                                                    no-data-text="No hay datos disponibles" :loading="loadingSale"
                                                    loading-text="Cargando datos...">
                                                    <template v-slot:item.name="{ item }">

                                                        <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                                                            <v-img
                                                                :src="`${this.$axios.defaults.baseURL}images/${item.image_product}`"
                                                                alt="image"></v-img>
                                                        </v-avatar>
                                                        {{ item.name }}
                                                    </template>
                                                    <template v-slot:item.professional_commission="{ item }">
                                                        {{ formatNumber(item.professional_commission)}}
                                                    </template>
                                                    <template v-slot:top>

                                                        <v-divider class="mx-4" inset vertical></v-divider>
                                                        <v-spacer></v-spacer>
                                                    </template>
                                                </v-data-table>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </div>
                                <v-divider></v-divider>
                                <div style="padding: 16px; border-top: 1px solid #eee;">
                                    <!-- BOTONES -->
                                    <v-row class="mt-1">
                                        <v-btn color="#E7E9E9" variant="flat"
                                            @click="prevStepProfessional">Volver</v-btn>
                                        <v-spacer></v-spacer>
                                        <v-btn color="#E7E9E9" variant="flat" @click="nextStepProfessional">
                                            Siguiente
                                        </v-btn>
                                    </v-row>
                                </div>
                            </template>
                            <template v-slot:item.4>
                                <div style="flex: 1; overflow-y: auto; padding: 16px;">
                                    <v-container fluid>
                                        <v-row dense>
                                            <!-- Ingresos (positivos) -->
                                            <v-col cols="12" md="4" v-if="payments.products.commission_neto > 0">
                                                <v-card class="h-100" title="Bono de Productos"
                                                    :subtitle="formatNumber(payments.products.commission_neto)">
                                                    <template v-slot:prepend>
                                                        <v-avatar color="green-lighten-1">
                                                            <v-icon>mdi-gift-outline</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                    <template v-slot:append>
                                                        <v-avatar color="green-lighten-4" size="32">
                                                            <v-icon color="green-darken-2" size="20">mdi-plus</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                </v-card>
                                            </v-col>

                                            <v-col cols="12" md="4" v-if="payments.tips.tip_neto > 0">
                                                <v-card class="h-100" title="Comisión de Propinas"
                                                    :subtitle="formatNumber(payments.tips.tip_neto)">
                                                    <template v-slot:prepend>
                                                        <v-avatar color="amber-lighten-1">
                                                            <v-icon>mdi-hand-coin-outline</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                    <template v-slot:append>
                                                        <v-avatar color="green-lighten-4" size="32">
                                                            <v-icon color="green-darken-2" size="20">mdi-plus</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                </v-card>
                                            </v-col>

                                            <v-col cols="12" md="4" v-if="payments.cars.total_neto > 0">
                                                <v-card class="h-100" title="Ganancias en Servicios"
                                                    :subtitle="formatNumber(payments.cars.total_neto)">
                                                    <template v-slot:prepend>
                                                        <v-avatar color="blue-lighten-1">
                                                            <v-icon>mdi-account-cash-outline</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                    <template v-slot:append>
                                                        <v-avatar color="green-lighten-4" size="32">
                                                            <v-icon color="green-darken-2" size="20">mdi-plus</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                </v-card>
                                            </v-col>

                                            <v-col cols="12" md="4" v-if="payments.salary.salary_bruto > 0">
                                                <v-card class="h-100" title="Salario"
                                                    :subtitle="formatNumber(payments.salary.salary_bruto)">
                                                    <template v-slot:prepend>
                                                        <v-avatar color="deep-purple-lighten-1">
                                                            <v-icon>mdi-wallet-outline</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                    <template v-slot:append>
                                                        <v-avatar color="green-lighten-4" size="32">
                                                            <v-icon color="green-darken-2" size="20">mdi-plus</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                </v-card>
                                            </v-col>

                                            <!-- Egresos (negativos) -->
                                            <v-col cols="12" md="4" v-if="payments.workerPurchases.total_purchases > 0">
                                                <v-card class="h-100" title="Compra de Productos"
                                                    :subtitle="formatNumber(payments.workerPurchases.total_purchases)">
                                                    <template v-slot:prepend>
                                                        <v-avatar color="red-lighten-1">
                                                            <v-icon>mdi-cart-arrow-down</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                    <template v-slot:append>
                                                        <v-avatar color="red-lighten-4" size="32">
                                                            <v-icon color="red-darken-2" size="20">mdi-minus</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                </v-card>
                                            </v-col>

                                            <v-col cols="12" md="4" v-if="payments.advances.total_advance > 0">
                                                <v-card class="h-100" title="Solicitud de Adelantos"
                                                    :subtitle="formatNumber(payments.advances.total_advance)">
                                                    <template v-slot:prepend>
                                                        <v-avatar color="orange-lighten-1">
                                                            <v-icon>mdi-cash-fast</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                    <template v-slot:append>
                                                        <v-avatar color="red-lighten-4" size="32">
                                                            <v-icon color="red-darken-2" size="20">mdi-minus</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                </v-card>
                                            </v-col>
                                            <v-col cols="12" md="4" v-if="editedItem.amountAcadem > 0">
                                                <v-card class="h-100" title="Pago por Cursos"
                                                    :subtitle="formatNumber(Number(editedItem.amountAcadem))">
                                                    <template v-slot:prepend>
                                                        <v-avatar color="teal-lighten-1">
                                                            <v-icon>mdi-school-outline</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                    <template v-slot:append>
                                                        <v-avatar color="teal-lighten-4" size="32">
                                                            <v-icon color="teal-darken-2" size="20">mdi-plus</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                </v-card>
                                            </v-col>
                                        </v-row>

                                        <!-- Total destacado -->
                                        <v-row class="mt-4">
                                            <v-col cols="12">
                                                <v-card class="bg-indigo-lighten-5" flat>
                                                    <v-card-item>
                                                        <template v-slot:prepend>
                                                            <v-avatar color="indigo-darken-2" size="56">
                                                                <v-icon size="32">mdi-cash-multiple</v-icon>
                                                            </v-avatar>
                                                        </template>

                                                        <v-card-title class="text-h5">Total a Cobrar</v-card-title>
                                                        <v-card-subtitle class="text-h5 font-weight-bold">
                                                            {{ formatNumber(payments.totalNeto + Number(editedItem.amountAcadem)) }}
                                                        </v-card-subtitle>
                                                    </v-card-item>
                                                </v-card>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </div>

                                <v-divider></v-divider>
                                <div style="padding: 16px; border-top: 1px solid #eee;">
                                    <v-row class="mt-1">
                                        <v-btn color="#E7E9E9" variant="flat"
                                            @click="prevStepProfessional">Volver</v-btn>
                                        <v-spacer></v-spacer>
                                        <v-btn color="#E7E9E9" variant="flat" @click="close()"
                                            class="mr-1">Salir</v-btn>
                                        <v-btn color="#F18254" variant="flat" :disabled="(payments.totalNeto + Number(editedItem.amountAcadem)) <= 0" @click="save">
                                            Pagar
                                        </v-btn>
                                    </v-row>
                                </div>
                            </template>
                        </v-stepper>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>

                <v-toolbar color="red">
                    <span class="text-subtitle-2 ml-4"> Eliminar Pago a Profesional [<strong>{{ this.professional_name
                            }}</strong>]</span>
                </v-toolbar>

                <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el pago al profesional?</v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#E7E9E9" variant="flat" @click="closeDelete">
                        Cancelar
                    </v-btn>
                    <v-btn color="#F18254" variant="flat" @click="deleteItemConfirm">
                        Aceptar
                    </v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogOtros" max-width="800px">
            <v-card>
                <v-toolbar color="#F18254">
                    <span class="text-subtitle-2 ml-4">{{ formTitle }} [<strong>{{ this.professional_name
                            }}</strong>]</span>
                </v-toolbar>
                <v-card-text>
                    <v-form ref="form" v-model="valid" enctype="multipart/form-data">
                        <div style="flex: 1; overflow-y: auto; padding: 16px;">
                            <v-container fluid>
                                <v-row dense>
                                    <!-- Ingresos (positivos) -->
                                    <v-col cols="12" md="6" v-if="payments.products.commission_neto > 0">
                                        <v-card class="h-100" title="Bono de Productos"
                                            :subtitle="formatNumber(payments.products.commission_neto)">
                                            <template v-slot:prepend>
                                                <v-avatar color="green-lighten-1">
                                                    <v-icon>mdi-gift-outline</v-icon>
                                                </v-avatar>
                                            </template>
                                            <template v-slot:append>
                                                <v-avatar color="green-lighten-4" size="32">
                                                    <v-icon color="green-darken-2" size="20">mdi-plus</v-icon>
                                                </v-avatar>
                                            </template>
                                        </v-card>
                                    </v-col>

                                    <v-col cols="12" md="6" v-if="payments.tips.tip_neto > 0">
                                        <v-card class="h-100" title="Comisión de Propinas"
                                            :subtitle="formatNumber(payments.tips.tip_neto)">
                                            <template v-slot:prepend>
                                                <v-avatar color="amber-lighten-1">
                                                    <v-icon>mdi-hand-coin-outline</v-icon>
                                                </v-avatar>
                                            </template>
                                            <template v-slot:append>
                                                <v-avatar color="green-lighten-4" size="32">
                                                    <v-icon color="green-darken-2" size="20">mdi-plus</v-icon>
                                                </v-avatar>
                                            </template>
                                        </v-card>
                                    </v-col>

                                    <v-col cols="12" md="6" v-if="payments.cars.total_neto > 0">
                                        <v-card class="h-100" title="Ganancias en Servicios"
                                            :subtitle="formatNumber(payments.cars.total_neto)">
                                            <template v-slot:prepend>
                                                <v-avatar color="blue-lighten-1">
                                                    <v-icon>mdi-account-cash-outline</v-icon>
                                                </v-avatar>
                                            </template>
                                            <template v-slot:append>
                                                <v-avatar color="green-lighten-4" size="32">
                                                    <v-icon color="green-darken-2" size="20">mdi-plus</v-icon>
                                                </v-avatar>
                                            </template>
                                        </v-card>
                                    </v-col>

                                    <v-col cols="12" md="6" v-if="payments.salary.salary_bruto > 0">
                                        <v-card class="h-100" title="Salario"
                                            :subtitle="formatNumber(payments.salary.salary_bruto)">
                                            <template v-slot:prepend>
                                                <v-avatar color="deep-purple-lighten-1">
                                                    <v-icon>mdi-wallet-outline</v-icon>
                                                </v-avatar>
                                            </template>
                                            <template v-slot:append>
                                                <v-avatar color="green-lighten-4" size="32">
                                                    <v-icon color="green-darken-2" size="20">mdi-plus</v-icon>
                                                </v-avatar>
                                            </template>
                                        </v-card>
                                    </v-col>

                                    <!-- Egresos (negativos) -->
                                    <v-col cols="12" md="6" v-if="payments.workerPurchases.total_purchases > 0">
                                        <v-card class="h-100" title="Compra de Productos"
                                            :subtitle="formatNumber(payments.workerPurchases.total_purchases)">
                                            <template v-slot:prepend>
                                                <v-avatar color="red-lighten-1">
                                                    <v-icon>mdi-cart-arrow-down</v-icon>
                                                </v-avatar>
                                            </template>
                                            <template v-slot:append>
                                                <v-avatar color="red-lighten-4" size="32">
                                                    <v-icon color="red-darken-2" size="20">mdi-minus</v-icon>
                                                </v-avatar>
                                            </template>
                                        </v-card>
                                    </v-col>

                                    <v-col cols="12" md="6" v-if="payments.advances.total_advance > 0">
                                        <v-card class="h-100" title="Solicitud de Adelantos"
                                            :subtitle="formatNumber(payments.advances.total_advance)">
                                            <template v-slot:prepend>
                                                <v-avatar color="orange-lighten-1">
                                                    <v-icon>mdi-cash-fast</v-icon>
                                                </v-avatar>
                                            </template>
                                            <template v-slot:append>
                                                <v-avatar color="red-lighten-4" size="32">
                                                    <v-icon color="red-darken-2" size="20">mdi-minus</v-icon>
                                                </v-avatar>
                                            </template>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" md="6" v-if="editedItem.amountAcadem > 0">
                                        <v-card class="h-100" title="Pago por Cursos"
                                            :subtitle="formatNumber(Number(editedItem.amountAcadem))">
                                            <template v-slot:prepend>
                                                <v-avatar color="teal-lighten-1">
                                                    <v-icon>mdi-school-outline</v-icon>
                                                </v-avatar>
                                            </template>
                                            <template v-slot:append>
                                                <v-avatar color="teal-lighten-4" size="32">
                                                    <v-icon color="teal-darken-2" size="20">mdi-plus</v-icon>
                                                </v-avatar>
                                            </template>
                                        </v-card>
                                    </v-col>
                                </v-row>

                                <!-- Total destacado -->
                                <v-row class="mt-4">
                                    <v-col cols="12">
                                        <v-card class="bg-indigo-lighten-5" flat>
                                            <v-card-item>
                                                <template v-slot:prepend>
                                                    <v-avatar color="indigo-darken-2" size="56">
                                                        <v-icon size="32">mdi-cash-multiple</v-icon>
                                                    </v-avatar>
                                                </template>

                                                <v-card-title class="text-h5">Total a Cobrar</v-card-title>
                                                <v-card-subtitle class="text-h5 font-weight-bold">
                                                    {{ formatNumber(payments.totalNeto) }}
                                                </v-card-subtitle>
                                            </v-card-item>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </div>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="#E7E9E9" variant="flat" @click="close">
                                Cancelar
                            </v-btn>
                            <v-btn color="#F18254" variant="flat" :disabled="payments.totalNeto <= 0" @click="saveOtrosCharge">
                                Pagar
                            </v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!--Cajeros-->
        <v-dialog v-model="dialogCashier" fullscreen transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar color="#F18254">
                    <span class="text-subtitle-1 ml-4">Pagos realizados cajero (a) [<strong>{{ this.professional_name
                            }}</strong>]</span>
                    <v-spacer></v-spacer>
                    <v-btn class="text-subtitle-1  ml-1" color="#E7E9E9" variant="flat" elevation="2"
                        prepend-icon="mdi-file-excel" @click="exportToExcelCashier">
                        Exportar a Excel
                    </v-btn>
                    <v-btn class="text-subtitle-1  ml-1 " color="#E7E9E9" variant="flat" elevation="2"
                        prepend-icon="mdi-plus-circle" @click="showAddOperationTip()">
                        Nuevo Pago
                    </v-btn>

                </v-toolbar>
                <v-container fluid>
                    <v-row>
                        <!-- Primera columna -->
                        <v-col cols="12" sm="6" md="3">
                            <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                                transition="scale-transition" offset-y min-width="290px">
                                <template v-slot:activator="{ props }">
                                    <v-text-field v-bind="props" :modelValue="dateFormatted" variant="outlined"
                                        append-inner-icon="mdi-calendar" label="Fecha inicial"></v-text-field>
                                </template>
                                <v-locale-provider locale="es">
                                    <v-date-picker header="Calendario" title="Seleccione la fecha"
                                        color="orange lighten-2" :modelValue="getDate" @update:model-value="updateDate"
                                        format="yyyy-MM-dd" :max="dateFormatted2"></v-date-picker>
                                </v-locale-provider>
                            </v-menu>
                        </v-col>
                        <!-- Segunda columna -->
                        <v-col cols="12" sm="6" md="3">
                            <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                                transition="scale-transition" offset-y min-width="290px">
                                <template v-slot:activator="{ props }">
                                    <v-text-field v-bind="props" :modelValue="dateFormatted2" variant="outlined"
                                        append-inner-icon="mdi-calendar" label="Fecha final"></v-text-field>
                                </template>
                                <v-locale-provider locale="es">
                                    <v-date-picker header="Calendario" title="Seleccione la fecha"
                                        color="orange lighten-2" :modelValue="getDate2"
                                        @update:model-value="updateDate2" format="yyyy-MM-dd"
                                        :min="dateFormatted"></v-date-picker>
                                </v-locale-provider>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" md="1">
                            <v-btn icon @click="showPay()" color="#F18254">
                                <v-icon>mdi-magnify</v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-container>
                <v-card-text class="mt-1 mb-1">
                    <v-row>
                        <v-col cols="12">
                            <v-card-text>
                                <v-text-field class="mt-1 mb-1" v-model="search5" append-icon="mdi-magnify"
                                    label="Buscar" single-line hide-details>
                                </v-text-field>
                                <div style="max-height: 50vh; overflow-y: auto;">
                                    <v-data-table :headers="headers5" :items-per-page-text="'Elementos por páginas'"
                                        :items="results1" :search="search5" class="elevation-2"
                                        no-results-text="No hay datos disponibles"
                                        no-data-text="No hay datos disponibles" :loading="loadingCashier"
                                        loading-text="Cargando datos...">
                                        <template v-slot:item.date="{ item }">
                                            <span :class="{ 'bold-row': item.date == 'Total' }">
                                                {{ item.date }}
                                            </span>
                                        </template>

                                        <template v-slot:item.amount="{ item }">
                                            {{ formatNumber(item.amount)}}
                                        </template>
                                        <template v-slot:item.coffe_percent="{ item }">
                                            {{ formatNumber(item.coffe_percent)}}
                                        </template>
                                        <template v-slot:item.actions="{ item }">
                                            <v-btn density="comfortable" icon="mdi-pencil"
                                                @click="(this.charge === 'Barbero' || this.charge === 'Barbero y Encargado'|| item.type !== 'Mes') ? '' :editItemCashier(item)"
                                                :color="(this.charge === 'Barbero' || this.charge === 'Barbero y Encargado'|| item.type !== 'Mes') ? 'grey' : 'primary'"
                                                variant="tonal" elevation="1" class="mr-1 mt-1 mb-1"
                                                title="Editar Pago Mensual a profesional"></v-btn>
                                            <v-btn v-if="item.date !== 'Total'" density="comfortable" icon="mdi-delete"
                                                :color="(item.type === 'Mes') ? 'red-darken-4' : 'grey'" variant="tonal"
                                                elevation="1" title="Eliminar Pago a profesional"
                                                @click="(item.type === 'Mes') ? deleteItem(item) : ''"></v-btn>
                                        </template>
                                    </v-data-table>
                                </div>
                            </v-card-text>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#E7E9E9" variant="flat" @click="cashierDelete">
                        Volver
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDeleteCashier" fullscreen>
            <v-card>

                <v-toolbar color="red">
                    <span class="text-subtitle-2 ml-4"> Eliminar Pago a Professional [<strong>{{ this.professional_name
                            }}</strong>]</span>
                </v-toolbar>

                <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el pago al professional?</v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#E7E9E9" variant="flat" @click="closeDelete">
                        Cancelar
                    </v-btn>
                    <v-btn color="#F18254" variant="flat" @click="deleteItemConfirmCashier">
                        Aceptar
                    </v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogCashierCars" fullscreen transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar color="#F18254">
                    <span class="text-subtitle-2 ml-4">{{ formTitle }} [<strong>{{ this.professional_name
                            }}</strong>]</span>
                </v-toolbar>
                <v-card-text>
                    <v-form ref="form" v-model="valid" enctype="multipart/form-data">
                        <v-stepper elevation="6" bg-color="" v-model="step" :items="items" hide-actions
                            style="max-height: 100vh; min-height: 95vh; overflow-y: auto">
                            <template v-slot:item.1>
                                <div style="flex: 1; overflow-y: auto; padding: 16px;">
                                    <v-row>
                                        <v-col cols="12" md="3">

                                        </v-col>
                                        <v-col cols="12" md="4">

                                        </v-col>
                                        <v-col cols="12" md="5">
                                            <v-card class="mx-auto" max-width="344" title="Monto a Pagar"
                                                :subtitle="this.formatNumber(totalMount1())" append-icon="mdi-check">

                                                <template v-slot:prepend>
                                                    <v-avatar color="#F18254">
                                                        <v-icon icon="mdi-currency-usd"></v-icon>
                                                    </v-avatar>
                                                </template>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                    <v-row>

                                        <v-col cols="12" md="12">
                                            <v-text-field class="mt-1 mb-1" v-model="search6" append-icon="mdi-magnify"
                                                label="Buscar" single-line hide-details></v-text-field>
                                            <div style="max-height: 50vh; overflow-y: auto;">
                                                <v-data-table :headers="headers6"
                                                    :items-per-page-text="'Elementos por páginas'" :search="search6"
                                                    :items="cars1" class="elevation-1"
                                                    no-results-text="No hay datos disponibles"
                                                    no-data-text="No hay datos disponibles" :loading="loadingTip"
                                                    loading-text="Cargando datos...">
                                                    <template v-slot:item.clientName="{ item }">

                                                        <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                                                            <v-img
                                                                :src="`${this.$axios.defaults.baseURL}images/${item.client_image}`"
                                                                alt="image"></v-img>
                                                        </v-avatar>
                                                        {{ item.clientName }}
                                                    </template>
                                                    <template v-slot:item.professionalName="{ item }">

                                                        <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                                                            <v-img
                                                                :src="`${this.$axios.defaults.baseURL}images/${item.image_url}`"
                                                                alt="image"></v-img>
                                                        </v-avatar>
                                                        {{ item.professionalName }}
                                                    </template>
                                                    <template v-slot:item.tip="{ item }">
                                                        {{ formatNumber(parseFloat(item.tip))}}
                                                    </template>
                                                    <template v-slot:item.tipCashier="{ item }">
                                                        {{ formatNumber(parseFloat(item.tipCashier))}}
                                                    </template>
                                                    <template v-slot:item.tipCoffe="{ item }">
                                                        {{ formatNumber(parseFloat(item.tipCoffe))}}
                                                    </template>
                                                </v-data-table>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </div>
                                <v-divider></v-divider>
                                <div style="padding: 16px; border-top: 1px solid #eee;">
                                    <!-- BOTONES -->
                                    <v-row class="mt-1">
                                        <v-btn color="#E7E9E9" variant="flat" @click="close()">Salir</v-btn>
                                        <v-spacer></v-spacer>
                                        <v-btn color="#E7E9E9" variant="flat" @click="nextStep">
                                            Siguiente
                                        </v-btn>
                                    </v-row>
                                </div>
                            </template>
                            <template v-slot:item.2>
                                <div style="flex: 1; overflow-y: auto; padding: 16px;">
                                    <v-row>
                                        <v-col cols="12" md="3">
                                        </v-col>
                                        <v-col cols="12" md="4">
                                        </v-col>
                                        <v-col cols="12" md="5">
                                            <v-card class="mx-auto" max-width="344" title="Bono de Productos"
                                                :subtitle="this.formatNumber(payments.products.commission_neto)"
                                                append-icon="mdi-check">

                                                <template v-slot:prepend>
                                                    <v-avatar color="#F18254">
                                                        <v-icon icon="mdi-currency-usd"></v-icon>
                                                    </v-avatar>
                                                </template>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                    <v-row>

                                        <v-col cols="12" md="12">
                                            <v-text-field class="mt-1 mb-1" v-model="search6" append-icon="mdi-magnify"
                                                label="Buscar" single-line hide-details></v-text-field>
                                            <div style="max-height: 50vh; overflow-y: auto;">
                                                <v-data-table :headers="headers7"
                                                    :items-per-page-text="'Elementos por páginas'" :search="search7"
                                                    :items="cashierSales" class="elevation-1"
                                                    no-results-text="No hay datos disponibles"
                                                    no-data-text="No hay datos disponibles" :loading="loadingSale"
                                                    loading-text="Cargando datos...">
                                                    <template v-slot:item.name="{ item }">

                                                        <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                                                            <v-img
                                                                :src="`${this.$axios.defaults.baseURL}images/${item.image_product}`"
                                                                alt="image"></v-img>
                                                        </v-avatar>
                                                        {{ item.name }}
                                                    </template>
                                                    <template v-slot:item.price="{ item }">
                                                        {{ formatNumber(item.price)}}
                                                    </template>
                                                    <template v-slot:top>

                                                        <v-divider class="mx-4" inset vertical></v-divider>
                                                        <v-spacer></v-spacer>
                                                    </template>
                                                </v-data-table>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </div>
                                <v-divider></v-divider>
                                <div style="padding: 16px; border-top: 1px solid #eee;">
                                    <!-- BOTONES -->
                                    <v-row class="mt-1">
                                        <v-btn color="#E7E9E9" variant="flat" @click="prevStep">Volver</v-btn>
                                        <v-spacer></v-spacer>
                                        <v-btn color="#E7E9E9" variant="flat" @click="nextStep">
                                            Siguiente
                                        </v-btn>
                                    </v-row>
                                </div>
                            </template>
                            <template v-slot:item.3>
                                <div style="flex: 1; overflow-y: auto; padding: 16px;">
                                    <v-container fluid>
                                        <v-row dense>
                                            <!-- Ingresos (positivos) -->
                                            <v-col cols="12" md="4" v-if="payments.products.commission_neto > 0">
                                                <v-card class="h-100" title="Bono de Productos"
                                                    :subtitle="formatNumber(payments.products.commission_neto)">
                                                    <template v-slot:prepend>
                                                        <v-avatar color="green-lighten-1">
                                                            <v-icon>mdi-gift-outline</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                    <template v-slot:append>
                                                        <v-avatar color="green-lighten-4" size="32">
                                                            <v-icon color="green-darken-2" size="20">mdi-plus</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                </v-card>
                                            </v-col>

                                            <v-col cols="12" md="4" v-if="payments.tips.tip_neto > 0">
                                                <v-card class="h-100" title="Comisión de Propinas"
                                                    :subtitle="formatNumber(payments.tips.tip_neto)">
                                                    <template v-slot:prepend>
                                                        <v-avatar color="amber-lighten-1">
                                                            <v-icon>mdi-hand-coin-outline</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                    <template v-slot:append>
                                                        <v-avatar color="green-lighten-4" size="32">
                                                            <v-icon color="green-darken-2" size="20">mdi-plus</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                </v-card>
                                            </v-col>

                                            <v-col cols="12" md="4" v-if="payments.cars.total_neto > 0">
                                                <v-card class="h-100" title="Ganancias en Servicios"
                                                    :subtitle="formatNumber(payments.cars.total_neto)">
                                                    <template v-slot:prepend>
                                                        <v-avatar color="blue-lighten-1">
                                                            <v-icon>mdi-account-cash-outline</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                    <template v-slot:append>
                                                        <v-avatar color="green-lighten-4" size="32">
                                                            <v-icon color="green-darken-2" size="20">mdi-plus</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                </v-card>
                                            </v-col>

                                            <v-col cols="12" md="4" v-if="payments.salary.salary_bruto > 0">
                                                <v-card class="h-100" title="Salario"
                                                    :subtitle="formatNumber(payments.salary.salary_bruto)">
                                                    <template v-slot:prepend>
                                                        <v-avatar color="deep-purple-lighten-1">
                                                            <v-icon>mdi-wallet-outline</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                    <template v-slot:append>
                                                        <v-avatar color="green-lighten-4" size="32">
                                                            <v-icon color="green-darken-2" size="20">mdi-plus</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                </v-card>
                                            </v-col>

                                            <!-- Egresos (negativos) -->
                                            <v-col cols="12" md="4" v-if="payments.workerPurchases.total_purchases > 0">
                                                <v-card class="h-100" title="Compra de Productos"
                                                    :subtitle="formatNumber(payments.workerPurchases.total_purchases)">
                                                    <template v-slot:prepend>
                                                        <v-avatar color="red-lighten-1">
                                                            <v-icon>mdi-cart-arrow-down</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                    <template v-slot:append>
                                                        <v-avatar color="red-lighten-4" size="32">
                                                            <v-icon color="red-darken-2" size="20">mdi-minus</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                </v-card>
                                            </v-col>

                                            <v-col cols="12" md="4" v-if="payments.advances.total_advance > 0">
                                                <v-card class="h-100" title="Solicitud de Adelantos"
                                                    :subtitle="formatNumber(payments.advances.total_advance)">
                                                    <template v-slot:prepend>
                                                        <v-avatar color="orange-lighten-1">
                                                            <v-icon>mdi-cash-fast</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                    <template v-slot:append>
                                                        <v-avatar color="red-lighten-4" size="32">
                                                            <v-icon color="red-darken-2" size="20">mdi-minus</v-icon>
                                                        </v-avatar>
                                                    </template>
                                                </v-card>
                                            </v-col>
                                        </v-row>

                                        <!-- Total destacado -->
                                        <v-row class="mt-4">
                                            <v-col cols="12">
                                                <v-card class="bg-indigo-lighten-5" flat>
                                                    <v-card-item>
                                                        <template v-slot:prepend>
                                                            <v-avatar color="indigo-darken-2" size="56">
                                                                <v-icon size="32">mdi-cash-multiple</v-icon>
                                                            </v-avatar>
                                                        </template>

                                                        <v-card-title class="text-h5">Total a Cobrar</v-card-title>
                                                        <v-card-subtitle class="text-h5 font-weight-bold">
                                                            {{ formatNumber(payments.totalNeto) }}
                                                        </v-card-subtitle>
                                                    </v-card-item>
                                                </v-card>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </div>

                                <v-divider></v-divider>
                                <div style="padding: 16px; border-top: 1px solid #eee;">
                                    <v-row class="mt-1">
                                        <v-btn color="#E7E9E9" variant="flat" @click="prevStep">Volver</v-btn>
                                        <v-spacer></v-spacer>
                                        <v-btn color="#E7E9E9" variant="flat" @click="close()"
                                            class="mr-1">Salir</v-btn>
                                        <v-btn color="#F18254" variant="flat" :disabled="payments.totalNeto <= 0" @click="saveCashierProduct">
                                            Pagar
                                        </v-btn>
                                    </v-row>
                                </div>
                            </template>
                        </v-stepper>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogEdit" max-width="400px"> 
            <v-card>
                <v-toolbar color="#F18254">
                    <span class="text-subtitle-2 ml-4"> Editar pago mensual</span>
                </v-toolbar>
                <v-card-text>
                    <v-form ref="form" v-model="valid" enctype="multipart/form-data">
                        <v-row>
                                <v-col cols="12" md="12">
                                    <v-text-field v-model="editedItem.amount" clearable label="Monto"
                                        prepend-icon="mdi-cash" variant="underlined" :rules="pago">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="#E7E9E9" variant="flat" :disabled="loadingWorkPlace" @click="close">
                                Cancelar
                                </v-btn>
                                <v-btn color="#F18254" variant="flat" @click="editPay" :disabled="!valid" :loading="loadingWorkPlace">
                                Aceptar
                                </v-btn>
                            </v-card-actions>
                    </v-form>
                </v-card-text>
                </v-card>
        </v-dialog>
        <v-dialog v-model="dialogEditCashier" max-width="400px"> 
            <v-card>
                <v-toolbar color="#F18254">
                    <span class="text-subtitle-2 ml-4"> Editar pago mensual</span>
                </v-toolbar>
                <v-card-text>
                    <v-form ref="form" v-model="valid" enctype="multipart/form-data">
                        <v-row>
                                <v-col cols="12" md="12">
                                    <v-text-field v-model="editedItem.amount" clearable label="Monto"
                                        prepend-icon="mdi-cash" variant="underlined" :rules="pago">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="#E7E9E9" variant="flat" :disabled="loadingWorkPlace" @click="close">
                                Cancelar
                                </v-btn>
                                <v-btn color="#F18254" variant="flat" @click="editPayCashier" :disabled="!valid" :loading="loadingWorkPlace">
                                Aceptar
                                </v-btn>
                            </v-card-actions>
                    </v-form>
                </v-card-text>
                </v-card>
        </v-dialog>
    </v-card>
</template>

<script>

import axios from "axios";
import { format } from "date-fns";
import * as XLSX from 'xlsx';
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api";

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
    data: () => ({
        tabBar: false,
        tabBarCashier: false,
        loadingProfessPay: true,
        loadingCoursePay: true,
        loadingPayment: true,
        loadingCashier: true,
        loadingSale: true,
        loadingTip: true,
        loadingPay: true,
        valid: true,
        snackbar: false,
        sb_type: '',
        sb_message: '',
        sb_timeout: 2000,
        sb_title: '',
        sb_icon: '',
        menu: false,
        menu2: false,
        input: null,
        input2: null,
        branch_id: '',
        charge: '',
        business_id: '',
        branches: [],
        cars: [],
        cars1: [],
        professionalPayment: [],
        bonoconvivencia: 0,
        bonoservicios: 0,
        bonoproductos: 0,
        search: '',
        search3: '',
        search5: '',
        search6: '',
        mostrarFila: false,
        dialog: false,
        mostrarCars: false,
        mostrarDoc: false,
        dialogDelete: false,
        dialogBarberoEncargado: false,
        dialogOtros: false,
        dialogEdit: false,
        dialogEditCashier: false,
        dialogCashier: false,
        dialogDeleteCashier: false,
        dialogCashierCars: false,
        //mostrarType: true,
        headers: [
            { title: 'Nombre del profesional', value: 'name', sortable: true},
            { title: 'Correo', value: 'email', sortable: true},
            { title: 'Cargo', value: 'charge', sortable: true },
            { title: 'Acciones', value: 'actions' },
        ],
        headers3: [
            { title: 'Fecha', key: 'date', sortable: true },
            { title: 'Tipo de pago', key: 'type', sortable: true },
            { title: 'Monto Líquido', key: 'amount', sortable: true },
            { title: 'Acciones', value: 'actions' },
        ],
        headers5: [
            { title: 'Fecha del pago', key: 'date', sortable: true },
            { title: 'Tipo de Pago', key: 'type', sortable: true },
            { title: 'Monto Líquido', key: 'amount', sortable: true },
            { title: 'Monto café', key: 'coffe_percent', sortable: true },
            { title: 'Acciones', value: 'actions' },
        ],
        headers6: [
            { title: 'ID', align: 'start', key: 'id' },
            { title: 'Nombre Cliente', key: 'clientName', sortable: true },
            { title: 'Nombre Profesional', key: 'professionalName', sortable: true },
            { title: 'Fecha',  key: 'data', sortable: true },
            { title: 'Propina', key: 'tip', sortable: true },
            { title: 'Propina 10% Cajero (a)', key: 'tipCashier', sortable: true },
            { title: 'Propina 10% Café', key: 'tipCoffe', sortable: true },
        ],
        results: [],
        results1: [],
        selectedOption: '',
        typePay: '',
        //options: ['Adelanto', 'Quincena', 'Mes'],
        professionals: [],
        professional_id: '',
        professional_name: '',
        selected: [],
        editedIndex: -1,

        editedItem: {
            id: '',
            nameProfessional: '',
            type: '',
            amount: '',
            coffe_percent: '',
            academia: 'Pago Academia',
            cashierproduct: 'Pago venta de Productos',
            amountAcadem: '',
            amountSaleProduct: '',
        },
        data: {},

        defaultItem: {
            id: '',
            nameProfessional: '',
            type: '',
            amount: '',
            coffe_percent: '',
            academia: 'Pago Academia',
            cashierproduct: 'Pago venta de Productos',
            amountAcadem: '',
            amountSaleProduct: '',
        },
        nameRules: [
            (v) => !!v || "El campo es requerido",
        ],
        pago: [
            (value) => !!value || 'Campo requerido',
            (value) => /^\d+(\.\d+)?$/.test(value) || "Debe ser un número con punto decimal (10.00)",
            (value) => !value || !isNaN(parseFloat(value)) || 'Debe ser un número'],
            pago1: [
                (value) => /^\d+(\.\d+)?$/.test(value) || "Debe ser un número con punto decimal (10.00)",
            (value) => !value || !isNaN(parseFloat(value)) || 'Debe ser un número'],
        selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
        selected2: [],
        selectedCourse: [],
        cashierSales: [],
        selectedCashier: [],
        headers2: [
            { title: 'ID', align: 'start', value: 'id', sortable: true },
            { title: 'Nombre Cliente', value: 'clientName', sortable: true },
            { title: 'Fecha', align: 'start', value: 'data', sortable: true },
            { title: 'Ganancias Servicios', align: 'start', value: 'totalServices', sortable: true },
            { title: 'Cantidad Servicios', align: 'start', value: 'services', sortable: true },
            { title: 'Cantidad Productos', align: 'start', value: 'products', sortable: true },
            { title: 'Monto Generado', align: 'start', value: 'amountGenerate', sortable: true },
            { title: 'Propina (80%)', align: 'start', value: 'tip', sortable: true },
            { title: 'Convivencia', align: 'start', value: 'metaService', sortable: true },
            { title: 'Monto a Pagar', align: 'start', value: 'pay', sortable: true },
        ],
        search2: '',
        headers4: [
            { title: 'ID', align: 'start', value: 'id', sortable: true },
            { title: 'Academia', align: 'start', value: 'nameEnrollment', sortable: true },
            { title: 'Nombre Curso', value: 'nameCourse', sortable: true },
            { title: 'Precio Curso', value: 'price', sortable: true },
            { title: 'Total Pagado', value: 'totalPayment', sortable: true },
            { title: 'Descripción', value: 'description', sortable: true },
            { title: 'Fecha Inicio', align: 'end', value: 'startDate', sortable: true },
            { title: 'Fecha Terminación', align: 'end', value: 'endDate', sortable: true }
        ],
    headers7: [
      { title: 'Producto', value: 'name', sortable: true },
      { title: 'Cantidad', value: 'cant', sortable: true },
      { title: 'Comisión', value: 'professional_commission', sortable: true },
    ],
    search7: '',
        search4: '',
        courses: [],

        step: 1,
        stepProfessional: 1,
        items: ["Comisión de Propinas", "Comisión de Productos Vendidos", "Resumen de Pago"],
        itemsProfessional: ["Pago de carros", "Pago de docencia", "Comisión de Productos Vendidos", "Resumen de Pago"],
        payments: [],
        products: [],
    }),

    computed: {
        divStyle() {
            return {
                'max-height': this.mostrarFila ? '63vh' : '70vh', // Cambia el valor de max-height según mostrarFila
                'overflow-y': 'auto',
            };
            },
        isFormValid() {
            return this.valid && this.selectedCashier.length > 0 && this.editedItem.amountSaleProduct;
        },
        amountFromMethod() {
            if(this.selected2.length === 0){
                return 0;
            }
            else{
                
        return this.totalMount1();
            }
        },

        amountFromMethod1() {
                if(this.selected2.length === 0){
                    return 0;
                }
                else{
                    
            return this.totalMount();
                }
        },
    
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo Pago a profesional' : 'Editar Pago a profesional'
        },
        ironValues() {
            return this.selected2.map(selection => selection.id);
        },
        dateFormatted() {
            const date = this.input ? new Date(this.input) : new Date();
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        },
        dateFormatted2() {
            const date = this.input2 ? new Date(this.input2) : new Date();
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        },
        getDate() {
            return this.input ? new Date(this.input) : new Date();
        },
        getDate2() {
            return this.input2 ? new Date(this.input2) : new Date();
        },
        calculateTotal() {
        // Si necesitas sumarlo manualmente
        const academAmount = Number(this.editedItem.amountAcadem) || 0;
        return this.payments.totalNeto + academAmount;
        },
        amountFormatted: {
        get() {
        return this.formatNumberInput(Number(this.editedItem.amountAcadem))
        },
        set(value) {
        this.editedItem.amountAcadem = this.parseNumberInput(value)
        }
        },
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    async mounted() {
        this.business_id = LocalStorageService.getItem('business_id');
        this.branch_id = LocalStorageService.getItem('branch_id');
        this.charge_id = LocalStorageService.getItem('charge_id');
        this.charge = JSON.parse(LocalStorageService.getItem("charge"));
        LocalStorageService.setIsLocked(true);
        const requestParams = {
            business_id: this.business_id
        };
        try {
            const result = await handleRequest({
                endpoint: 'show-business',
                method: 'GET',
                params: requestParams // Aquí pasas los parámetros
            });

            if (result.success) {
                // Si la solicitud es exitosa, asignamos las sucursales
                this.branches = result.data.branches;
            } else {
                // Si no hay datos, asignamos un array vacío
                this.branches = [];
            }
        } catch (error) {
            this.branches = [];
            // Captura de errores no controlados
            this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
        } finally {
            if (this.charge === 'Administrador') {
                this.branch_id = this.branches[0].id;
                this.mostrarFila = true;
            }
            await this.initialize();
        }
    },

    methods: {
        formatNumberInput(value) {
            if (!value) return ''
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
        
        // Parsea el número para guardarlo sin formato
        parseNumberInput(formattedValue) {
            if (!formattedValue) return null
            return Number(formattedValue.toString().replace(/\./g, ''))
        },
        async nextStep() {
        if (this.step < this.items.length) {
            this.step++;
        }
        },

        prevStep() {
        if (this.step > 1) {
            this.step--;
        }
        },
        async nextStepProfessional() {
        if (this.stepProfessional < this.itemsProfessional.length) {
            this.stepProfessional++;
        }
        },

        prevStepProfessional() {
        if (this.stepProfessional > 1) {
            this.stepProfessional--;
        }
        },
        formatMeta(meta) {
        if (meta === 'Si') {
            return `<span class="green-text">${meta}</span>`;
        } else {
            return `<span class="black-text">${meta}</span>`;
        }
        },
        validateAmount(value) {
            if (this.selectedCourse.length === 0) {
                return true; // No hay curso seleccionado, no validar aún.
            }
            const selectedItem = this.courses.find(course => course.id === this.selectedCourse[0]);
            return parseInt(value) <= parseInt(selectedItem.price) || 'El monto debe ser menor o igual al precio del curso seleccionado';
        },
        filterResults(typeDetail) {
        this.search3 = typeDetail;
        },
        updateDate(val) {
            this.input = val;
            this.menu = false;
        },
        updateDate2(val) {
            this.input2 = val;
            this.menu2 = false;
        },
        totalMount() {
            let selectedItems;
            if (this.selected2.length == 0) {
                return this.cars.reduce((total, item) => {
                    // Asegúrate de que item.totalServices y item.tip sean números
                    const totalServices = Number(item.totalServices) || 0;
                    const tip = Number(item.tip) || 0;
                    const amount = total + totalServices + tip;
                    return amount;
                }, 0);
            } else {
                // Mapea los IDs de selected2 a los objetos correspondientes en cars
                selectedItems = this.selected2.map(selectedId => this.cars.find(car => car.id === selectedId));
                // Calcula el total sumando totalServices y tip de los elementos seleccionados
                return selectedItems.reduce((total, item) => {
                    // Asegúrate de que item.totalServices y item.tip sean números
                    const totalServices = Number(item.totalServices) || 0;
                    const tip = Number(item.tip) || 0;
                    const amount = total + totalServices + tip;
                    return amount;
                }, 0);
            }

        },
        totalMount1() {
            let selectedItems;
            if (this.selected2.length == 0) {
                return this.cars1.reduce((total, item) => {
                    // Asegúrate de que item.totalServices y item.tip sean números
                    //const totalServices = Number(item.totalServices) || 0;
                    const tip = Number(item.tipCashier) || 0;
                    //this.editedItem.amount = total + totalServices + tip;
                    const amount = total + tip;
                    return amount;
                }, 0);
            } else {
                // Mapea los IDs de selected2 a los objetos correspondientes en cars
                selectedItems = this.selected2.map(selectedId => this.cars1.find(car => car.id === selectedId));
                // Calcula el total sumando totalServices y tip de los elementos seleccionados
                return selectedItems.reduce((total, item) => {
                    // Asegúrate de que item.totalServices y item.tip sean números
                    //const totalServices = Number(item.totalServices) || 0;
                    const tip = Number(item.tipCashier) || 0;
                    //this.editedItem.amount = total + tip;
                    //this.editedItem.coffe_percent = total + tip;
                    const amount = total + tip;
                    return amount;
                }, 0);
            }
        },
        formatNumber(value) {
        // Si el valor es menor que 1000, devuelve el valor original con dos decimales
        if (value < 1000) {
            return (Math.round((value + Number.EPSILON) * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        // Primero, redondea el valor a dos decimales
        value = Math.round((value + Number.EPSILON) * 100) / 100;

        // Convierte el valor a cadena con formato de número local (en-US)
        let formattedValue = value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        return formattedValue;
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

        async initialize() {
            this.loadingPay = true;
            LocalStorageService.setIsLocked(true);
            this.professionals = [];
            this.professional_id = '';
            this.professional_name = '';
        try {
            const requestParams = {
                branch_id: this.branch_id
            };
        const result = await handleRequest({
          endpoint: "branch_professionals_web",
          method: "GET",
          params: requestParams
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.results = result.data.professionals;
        } else {
          // Si no hay datos, asignamos un array vacío
            this.results = [];
            LocalStorageService.setIsLocked(false);
            this.loadingPay = false;
        }
        } catch (error) {
            LocalStorageService.setIsLocked(false);
            this.loadingPay = false;
            // Captura de errores no controlados
            this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
        } finally {
            LocalStorageService.setIsLocked(false);
            this.loadingPay = false;
        }
        },
        async showAddPago() {
            if (this.charge == 'Barbero' || this.charge == 'Barbero y Encargado') {
                this.loadingProfessPay = true;
                this.loadingCoursePay = true;
                this.loadingSale = true;
                this.stepProfessional = 1;
                LocalStorageService.setIsLocked(true);
        try {
            const requestParams = {
                branch_id: this.branch_id,
                professional_id: this.professional_id
            };
            const result = await handleRequest({
            endpoint: "professional-car-notpay",
            method: "GET",
            params: requestParams
            });

            if (result.success) {
            // Si la solicitud es exitosa, asignamos las sucursales
                this.cars = result.data.cars;
                this.courses = result.data.courses;
                this.payments = result.data.payments;            
                this.products = result.data.produts;   
                this.selectCourse = result.data.coursesIds;
         
            } else {
            // Si no hay datos, asignamos un array vacío
                this.cars = [];
                this.courses = [];
                this.payments = [];
                this.products = [];
                this.selectCourse = [];
                LocalStorageService.setIsLocked(false);
                this.loadingProfessPay = false;
                this.loadingCoursePay = false;
                this.loadingSale = false;
                this.mostrarCars = false;
                this.mostrarDoc = false;
            }
        } catch (error) {
                LocalStorageService.setIsLocked(false);
                this.loadingProfessPay = false;
                this.loadingCoursePay = false;
                this.loadingSale = false;
                this.mostrarCars = false;
                this.mostrarDoc = false;
                // Captura de errores no controlados
                this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
        } finally {
                LocalStorageService.setIsLocked(false);
                this.mostrarCars = true;
                this.mostrarDoc = true;
                this.loadingProfessPay = false;
                this.loadingCoursePay = false;
                this.loadingSale = false;
        }
            this.dialog = true;
        } else {
            try {
            const requestParams = {
                branch_id: this.branch_id,
                professional_id: this.professional_id
            };
            const result = await handleRequest({
            endpoint: "professional-car-notpay",
            method: "GET",
            params: requestParams
            });

            if (result.success) {
            // Si la solicitud es exitosa, asignamos las sucursales
                this.payments = result.data.payments;                   
            } else {
            // Si no hay datos, asignamos un array vacío
                this.payments = [];               
                LocalStorageService.setIsLocked(false);
            }
        } catch (error) {
                LocalStorageService.setIsLocked(false);
                // Captura de errores no controlados
                this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
        } finally {
                LocalStorageService.setIsLocked(false);
        }
            this.dialogOtros = true;
        }

        },
        editItem(item) {
            this.editedIndex = 1;
            this.editedItem = Object.assign({}, item)
            this.dialogEdit = true
        },
        editItemCashier(item) {
            this.editedIndex = 1;
            this.editedItem = Object.assign({}, item)
            this.dialogEditCashier = true
        },
        pagoProfessional(item) {
            this.professional_id = item.id;
            this.professional_name = item.name;
            this.charge = item.charge;
            if (item.charge == 'Cajero (a)') {
                this.showCashier();
            }
            else {
                this.showProfessional();
            }
        },

        async showProfessional() {
            this.professionalPayment = [];
            this.loadingPayment = true;
            LocalStorageService.setIsLocked(true);
                const requestParams = {
                branch_id: this.branch_id,
                professional_id: this.professional_id
                };
                try {
                    const result = await handleRequest({
                        endpoint: 'professional-payment-show',
                        method: 'GET',
                        params: requestParams // Aquí pasas los parámetros
                    });

                    if (result.success) {
                        // Si la solicitud es exitosa, asignamos las sucursales
                        this.professionalPayment = result.data;
                    } else {
                        this.loadingPayment = false;
                        LocalStorageService.setIsLocked(false);
                        // Si no hay datos, asignamos un array vacío
                        this.professionalPayment = [];                    
                        this.showAlert("warning", result.message, 3000);
                    }
                } catch (error) {
                    this.professionalPayment = [];
                    this.loadingPayment = false;
                    LocalStorageService.setIsLocked(false);
                    // Captura de errores no controlados
                    this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
                } finally {
                    this.loadingPayment = false;
                    LocalStorageService.setIsLocked(false);
                    this.loadingPayment = false;
                    this.bonoconvivencia = [];
                    this.bonoconvivencia = [];
                    this.bonoproductos = [];
                    this.bonoconvivencia = this.professionalPayment.reduce((total, item) => {
                        // Verifica si el campo "revenue" tiene un valor numérico
                        if (item.type === 'Bono convivencias') {
                            // Suma el valor de "revenue" al total
                            return total + parseInt(item.amount);
                        } else {
                            // Si el campo "revenue" no es un número, no suma nada
                            return total;
                        }
                    }, 0);

                    this.bonoservicios = this.professionalPayment.reduce((total, item) => {
                        // Verifica si el campo "revenue" tiene un valor numérico
                        if (item.type === 'Bono servicios') {
                            // Suma el valor de "revenue" al total
                            return total + parseInt(item.amount);
                        } else {
                            // Si el campo "revenue" no es un número, no suma nada
                            return total;
                        }
                    }, 0);

                    this.bonoproductos = this.professionalPayment.reduce((total, item) => {
                        // Verifica si el campo "revenue" tiene un valor numérico
                        if (item.type === 'Bono productos') {
                            // Suma el valor de "revenue" al total
                            return total + parseInt(item.amount);
                        } else {
                            // Si el campo "revenue" no es un número, no suma nada
                            return total;
                        }
                    }, 0);
                }
            this.dialogBarberoEncargado = true;
        },
        showProfessionalPeriodo() {
            this.loadingPayment = true;
            LocalStorageService.setIsLocked(true);
            this.search3 = '';
            const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
            const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
            axios
                .get('https://api2.simplifies.cl/api/professional-payment-periodo', {
                    params: {
                        branch_id: this.branch_id,
                        professional_id: this.professional_id,
                        startDate: startDate,
                        endDate: endDate
                    }
                })
                .then((response) => {
                    this.professionalPayment = response.data;
                    
                }).finally(() => {
            LocalStorageService.setIsLocked(false);
            this.bonoconvivencia = this.professionalPayment.reduce((total, item) => {
                        // Verifica si el campo "revenue" tiene un valor numérico
                        if (item.type === 'Bono convivencias') {
                            // Suma el valor de "revenue" al total
                            return total + parseFloat(item.amount);
                        } else {
                            // Si el campo "revenue" no es un número, no suma nada
                            return total;
                        }
                    }, 0);

                    this.bonoservicios = this.professionalPayment.reduce((total, item) => {
                        // Verifica si el campo "revenue" tiene un valor numérico
                        if (item.type === 'Bono servicios') {
                            // Suma el valor de "revenue" al total
                            return total + parseFloat(item.amount);
                        } else {
                            // Si el campo "revenue" no es un número, no suma nada
                            return total;
                        }
                    }, 0);

                    this.bonoproductos = this.professionalPayment.reduce((total, item) => {
                        // Verifica si el campo "revenue" tiene un valor numérico
                        if (item.type === 'Bono productos') {
                            // Suma el valor de "revenue" al total
                            return total + parseFloat(item.amount);
                        } else {
                            // Si el campo "revenue" no es un número, no suma nada
                            return total;
                        }
                    }, 0);
            this.loadingPayment = false;
        });
        },
        deleteItem(item) {
            this.editedIndex = -1;
            this.editedItem.id = item.id;
            this.dialogDelete = true;
        },
        async deleteItemConfirm() {
            LocalStorageService.setIsLocked(true);
                const requestParams = {
                    id: this.editedItem.id
                };
                try {
                    const result = await handleRequest({
                        endpoint: 'professional-payment-destroy',
                        method: 'POST',
                        params: requestParams // Aquí pasas los parámetros
                    });

                    if (result.success) {
                        // Si la solicitud es exitosa, asignamos las sucursales
                        this.showAlert("success", "Pago eliminado correctamente", 3000);
                    } else {
                        this.dialogDelete = false;
                        // Si no hay datos, asignamos un array vacío
                        this.showAlert("warning", result.message, 3000);
                        
                    }
                } catch (error) {
                    this.dialogDelete = false;
                    // Captura de errores no controlados
                    this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
                } finally {
                    this.showProfessional();
                    this.dialogDelete = false;
                }
            //this.closeDelete();
        },
        close() {
            this.dialog = false;
            this.dialogOtros = false;
            this.dialogCashierCars = false;
            this.dialogEditCashier = false;
            this.dialogEdit = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
            });
            this.editedIndex = -1;
            this.selectedOption = null;
            this.cars = [];
            this.selected2 = [];
            this.mostrarCars = false;

        },
        barberoDelete() {
            this.dialogBarberoEncargado = false;
            this.professional_id = '';
            this.professional_name = '';
            this.charge = '';
        },
        closeDelete() {
            this.dialogDelete = false;
            this.dialogDeleteCashier = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1;
                this.cars = [];
                this.selected = [];
                this.mostrarCars = false;
            });

        },
        async save() {
            LocalStorageService.setIsLocked(true);
            this.valid = false;
                try {
                const requestParams = {
                    branch_id: this.branch_id,
                    professional_id: this.professional_id,
                    payments: this.payments,
                    type: 'Mes',
                    typeAcadem: this.editedItem.academia,
                    amountAcadem: this.editedItem.amountAcadem,
                    course_ids: this.selectCourse,
                };
                const result = await handleRequest({
                endpoint: "professional-payment-barbero",
                method: "POST",
                data: requestParams
                });

                if (result.success) {
                // Si la solicitud es exitosa, asignamos las sucursales
                this.showAlert("success", result.message, 3000);
                    
                } else {
                    this.$nextTick(() => {
                            this.editedItem = Object.assign({}, this.defaultItem);
                        });
                        this.editedIndex = -1;
                        this.type = null;
                        this.cars = [];
                        this.selected2 = [];
                        this.mostrarCars = false;
                        this.courses = [];
                        this.selectedCourse = [];
                        this.mostrarDoc = false;
                // Si no hay datos, asignamos un array vacío
                this.showAlert("warning", result.message, 3000);
                LocalStorageService.setIsLocked(false);
                }
                } catch (error) {
                    LocalStorageService.setIsLocked(false);
                        this.editedIndex = -1;
                        this.type = null;
                        this.cars = [];
                        this.selected2 = [];
                        this.mostrarCars = false;
                        this.courses = [];
                        this.selectedCourse = [];
                        this.mostrarDoc = false;
                    // Captura de errores no controlados
                    this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
                } finally {
                    LocalStorageService.setIsLocked(false);
                    this.showProfessional();
                }
            this.close();
        },
        //course
        saveCourse() {
            LocalStorageService.setIsLocked(true);
            this.valid = false;
            this.data.professional_id = this.professional_id;
            this.data.branch_id = this.branch_id;
            this.data.course_ids = this.selectedCourse[0];
                this.data.amount = this.editedItem.amountAcadem;
            this.data.type = this.editedItem.academia;
             axios
                .post('https://api2.simplifies.cl/api/professional-payment', this.data)
                .then(() => {
                    this.$nextTick(() => {
                        this.editedItem = Object.assign({}, this.defaultItem);
                    });
                    this.editedIndex = -1;
                    this.courses = [];
                    this.selectedCourse = [];
                    this.mostrarDoc = false;
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.showAlert("success", "Pago realizado correctamente", 3000);
                    this.showProfessional();
                });
            this.close();
        },
        saveOtros() {
            LocalStorageService.setIsLocked(true);
            this.valid = false;
        
            this.data.professional_id = this.professional_id;
            this.data.branch_id = this.branch_id;
            this.data.amount = this.editedItem.amount;
            this.data.type = this.editedItem.type;
            axios
                .post('https://api2.simplifies.cl/api/professional-payment', this.data)
                .then(() => {
                    this.$nextTick(() => {
                        this.editedItem = Object.assign({}, this.defaultItem);
                    });
                    this.editedIndex = -1;
                    this.type = null;
                    this.mostrarCars = false;
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.showAlert("success", "Pago realizado correctamente", 3000);
                    this.showProfessional();
                });
            this.close();
        },
        async saveOtrosCharge(){
            LocalStorageService.setIsLocked(true);
            this.valid = false;
        try {
            const requestParams = {
                branch_id: this.branch_id,
                professional_id: this.professional_id,
                payments: this.payments,
                type: 'Mes'
            };
            const result = await handleRequest({
            endpoint: "professional-payment-charge",
            method: "POST",
            data: requestParams
            });

            if (result.success) {
            // Si la solicitud es exitosa, asignamos las sucursales
            this.showAlert("success", result.message, 3000);
                
            } else {
                this.$nextTick(() => {
                        this.editedItem = Object.assign({}, this.defaultItem);
                    });
                    this.editedIndex = -1;
                    this.type = null;
            // Si no hay datos, asignamos un array vacío
            this.showAlert("warning", result.message, 3000);
            LocalStorageService.setIsLocked(false);
            }
            } catch (error) {
                LocalStorageService.setIsLocked(false);
                this.editedIndex = -1;
                this.type = null;
                this.$nextTick(() => {
                        this.editedItem = Object.assign({}, this.defaultItem);
                    });
                // Captura de errores no controlados
                this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
            } finally {
                this.$nextTick(() => {
                        this.editedItem = Object.assign({}, this.defaultItem);
                    });
                LocalStorageService.setIsLocked(false);
                this.showProfessional();
            }
            this.close();
        },
        exportToExcelProfessional() {
            // Primero, prepara una matriz que contendrá todas las filas de datos, incluidos los encabezados
            let rows = [];

            // Construye un objeto para los encabezados basado en la estructura de 'headers'
            let headerRow = {};
            this.headers3.forEach(header => {
                headerRow[header.key] = header.title; // Usa 'key' para el mapeo y 'title' para el texto del encabezado
            });
            rows.push(headerRow);

            // Ahora, mapea los datos de los items para que coincidan con los encabezados
            this.professionalPayment.forEach(item => {
                let rowData = {};
                this.headers3.forEach(header => {
                    rowData[header.key] = item[header.key] || ''; // Asegura que cada celda se mapee correctamente; usa '' para datos faltantes
                });
                rows.push(rowData);
            });

            let nameReport = {
                // eslint-disable-next-line vue/no-use-computed-property-like-method
                date: '',
                type: '',
                amount: ''
            };
            rows.push(nameReport);

            // Convierte la matriz de filas en una hoja de trabajo Excel
            const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true }); // 'skipHeader: true' porque ya agregamos manualmente los encabezados

            // Crea un nuevo libro de trabajo y añade la hoja de trabajo con los datos
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Report" + format(new Date(), "yyyy-MM-dd"));

            // Escribe el libro de trabajo a un archivo y desencadena la descarga
            //XLSX.writeFile(wb, "report.xlsx");
            XLSX.writeFile(wb, `report_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
        },
        //cajeros
        async showCashier() {
            this.results1 = [];
            this.loadingCashier = true;
            LocalStorageService.setIsLocked(true);
            this.step = 1;
        const requestParams = {
                branch_id: this.branch_id,
                professional_id: this.professional_id
            };
            try {
                const result = await handleRequest({
                    endpoint: 'operation-tip',
                    method: 'GET',
                    params: requestParams // Aquí pasas los parámetros
                });

                if (result.success) {
                    // Si la solicitud es exitosa, asignamos las sucursales
                    this.results1 = result.data;
                } else {
                    this.loadingCashier = false;
                    LocalStorageService.setIsLocked(false);
                    // Si no hay datos, asignamos un array vacío
                    this.results1 = [];                    
                    this.showAlert("warning", result.message, 3000);
                }
            } catch (error) {
                this.results1 = [];
                this.loadingCashier = false;
                LocalStorageService.setIsLocked(false);
                // Captura de errores no controlados
                this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
            } finally {
                this.loadingCashier = false;
                LocalStorageService.setIsLocked(false);
            }
            this.dialogCashier = true;
        },
        async showPay() {
            this.loadingCashier = true;
            LocalStorageService.setIsLocked(true);
            const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
            const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
        const requestParams = {
                branch_id: this.branch_id,
                professional_id: this.professional_id,
                startDate: startDate,
                endDate: endDate
            };
            try {
                const result = await handleRequest({
                    endpoint: 'operation-tip-periodo',
                    method: 'GET',
                    params: requestParams // Aquí pasas los parámetros
                });

                if (result.success) {
                    // Si la solicitud es exitosa, asignamos las sucursales
                    this.results1 = result.data;
                } else {
                    this.loadingCashier = false;
                    LocalStorageService.setIsLocked(false);
                    // Si no hay datos, asignamos un array vacío
                    this.results1 = [];                    
                    this.showAlert("warning", result.message, 3000);
                }
            } catch (error) {
                this.results1 = [];
                this.loadingCashier = false;
                LocalStorageService.setIsLocked(false);
                // Captura de errores no controlados
                this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
            } finally {
                this.loadingCashier = false;
                LocalStorageService.setIsLocked(false);
            }
        },
        cashierDelete() {
            this.dialogCashier = false;
            this.professional_id = '';
            this.professional_name = '';
        },
        deleteItemCashier(item) {
            this.editedIndex = -1;
            this.editedItem.id = item.id;
            this.typePay = item.car;
            this.dialogDeleteCashier = true;
        },
        async deleteItemConfirmCashier() {
            LocalStorageService.setIsLocked(true);
            const requestParams = {
                    id: this.editedItem.id
                };
                try {
                    const result = await handleRequest({
                        endpoint: 'professional-payment-destroy',
                        method: 'POST',
                        params: requestParams // Aquí pasas los parámetros
                    });

                    if (result.success) {
                        // Si la solicitud es exitosa, asignamos las sucursales
                        this.showAlert("success", "Pago eliminado correctamente", 3000);
                    } else {
                        this.dialogDelete = false;
                        // Si no hay datos, asignamos un array vacío
                        this.showAlert("warning", result.message, 3000);
                        
                    }
                } catch (error) {
                    this.dialogDelete = false;
                    // Captura de errores no controlados
                    this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
                } finally {
                    this.showCashier();
                    this.dialogDelete = false;
                }
        },
        async showAddOperationTip() {
            this.loadingSale = true;
            this.loadingTip = true;
            this.cars1 = [];
            this.cashierSales = [];
            LocalStorageService.setIsLocked(true);
        try {
            const requestParams = {
                branch_id: this.branch_id,
                professional_id: this.professional_id
            };
        const result = await handleRequest({
          endpoint: "cashier-car-notpay",
          method: "GET",
          params: requestParams
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
            this.cars1 = result.data.cars;
            this.cashierSales = result.data.sales.products_sold;
            this.payments = result.data.payments;
            
        } else {
          // Si no hay datos, asignamos un array vacío
            this.cars1 = [];
            this.cashierSales = [];
            this.payments = [];
            LocalStorageService.setIsLocked(false);
            this.loadingSale = false;
            this.loadingTip = false;
        }
        } catch (error) {
            LocalStorageService.setIsLocked(false);
            this.loadingSale = false;
            this.loadingTip = false;
            // Captura de errores no controlados
            this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
        } finally {
            LocalStorageService.setIsLocked(false);
            this.loadingSale = false;
            this.loadingTip = false;
            this.dialogCashierCars = true;
        }
        },
        saveCashier() {
            LocalStorageService.setIsLocked(true);
            this.valid = false;
            this.data.professional_id = this.professional_id;
            this.data.branch_id = this.branch_id;
            this.data.car_ids = this.selected2;
            if(this.selected2.length){  
                const temp = Number(this.totalMount1());              
            this.data.amount = temp+Number(this.editedItem.amount);
            this.data.coffe_percent = this.totalMount1();
            }else{
                this.data.amount = this.editedItem.amount;
            this.data.coffe_percent = 0; 
            }
            this.data.type = this.editedItem.type;
            axios
                .post('https://api2.simplifies.cl/api/operation-tip', this.data)
                .then(() => {
                    this.$nextTick(() => {
                        this.editedItem = Object.assign({}, this.defaultItem);
                    });
                    this.editedIndex = -1;
                    this.type = null;
                    this.cars = [];
                    this.selected2 = [];
                    this.mostrarCars = false;
                }).finally(() => {
                    LocalStorageService.setIsLocked(false);
                    this.showAlert("success", "Pago realizado correctamente", 3000);
                    this.showCashier();
                });
            this.close();
        },
        async saveCashierProduct() {
            LocalStorageService.setIsLocked(true);
            this.valid = false;
            try {
            const requestParams = {
                branch_id: this.branch_id,
                professional_id: this.professional_id,
                payments: this.payments,
                type: 'Mes'
            };
            const result = await handleRequest({
            endpoint: "professional-payment-cashier-mounth",
            method: "POST",
            data: requestParams
            });

            if (result.success) {
            // Si la solicitud es exitosa, asignamos las sucursales
            this.showAlert("success", result.message, 3000);
                
            } else {
                this.$nextTick(() => {
                        this.editedItem = Object.assign({}, this.defaultItem);
                    });
                    this.editedIndex = -1;
                    this.type = null;
                    this.cars = [];
                    this.selected2 = [];
                    this.mostrarCars = false;
            // Si no hay datos, asignamos un array vacío
            this.showAlert("warning", result.message, 3000);
            LocalStorageService.setIsLocked(false);
            }
            } catch (error) {
                LocalStorageService.setIsLocked(false);
                this.editedIndex = -1;
                    this.type = null;
                    this.cars = [];
                    this.selected2 = [];
                    this.mostrarCars = false;
                // Captura de errores no controlados
                this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
            } finally {
                LocalStorageService.setIsLocked(false);
                this.showCashier();
            }
            this.close();
        },
        exportToExcelCashier() {
            // Primero, prepara una matriz que contendrá todas las filas de datos, incluidos los encabezados
            let rows = [];

            // Construye un objeto para los encabezados basado en la estructura de 'headers'
            let headerRow = {};
            this.headers5.forEach(header => {
                headerRow[header.key] = header.title; // Usa 'key' para el mapeo y 'title' para el texto del encabezado
            });
            rows.push(headerRow);

            // Ahora, mapea los datos de los items para que coincidan con los encabezados
            this.results1.forEach(item => {
                let rowData = {};
                this.headers5.forEach(header => {
                    rowData[header.key] = item[header.key] || ''; // Asegura que cada celda se mapee correctamente; usa '' para datos faltantes
                });
                rows.push(rowData);
            });

            let nameReport = {
                // eslint-disable-next-line vue/no-use-computed-property-like-method
                coffe: 'Pagos realizados a cajero(a)s', // Asume que 'name' es una de tus claves; ajusta según sea necesario
                date: '',
                type: '',
                amount: ''
            };
            rows.push(nameReport);

            // Convierte la matriz de filas en una hoja de trabajo Excel
            const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true }); // 'skipHeader: true' porque ya agregamos manualmente los encabezados

            // Crea un nuevo libro de trabajo y añade la hoja de trabajo con los datos
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Report" + format(new Date(), "yyyy-MM-dd"));

            // Escribe el libro de trabajo a un archivo y desencadena la descarga
            //XLSX.writeFile(wb, "report.xlsx");
            XLSX.writeFile(wb, `report_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
        },
        async editPay() {
            this.loadingWorkPlace= true;
            LocalStorageService.setIsLocked(true);
                const requestParams = {
                    id: this.editedItem.id,
                    amount: this.editedItem.amount
                };
                try {
                    const result = await handleRequest({
                        endpoint: 'professional-payment-update',
                        method: 'POST',
                        data: requestParams // Aquí pasas los parámetros
                    });

                    if (result.success) {
                        // Si la solicitud es exitosa, asignamos las sucursales
                        this.showAlert("success", "Pago editado correctamente", 3000);
                    } else {
                        this.dialogEdit = false;
                        this.loadingWorkPlace= false;
                        // Si no hay datos, asignamos un array vacío
                        this.showAlert("warning", result.message, 3000);
                        
                    }
                } catch (error) {
                    this.dialogEdit = false;
                    this.loadingWorkPlace= false;
                    // Captura de errores no controlados
                    this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
                } finally {
                    this.showProfessional();
                    this.dialogEdit = false;
                    this.loadingWorkPlace= false;
                }
        },
        async editPayCashier() {
            this.loadingWorkPlace= true;
            LocalStorageService.setIsLocked(true);
                const requestParams = {
                    id: this.editedItem.id,
                    amount: this.editedItem.amount
                };
                try {
                    const result = await handleRequest({
                        endpoint: 'professional-payment-update',
                        method: 'POST',
                        data: requestParams // Aquí pasas los parámetros
                    });

                    if (result.success) {
                        // Si la solicitud es exitosa, asignamos las sucursales
                        this.showAlert("success", "Pago editado correctamente", 3000);
                    } else {
                        this.dialogEdit = false;
                        this.dialogEditCashier = false;
                        this.loadingWorkPlace= false;
                        // Si no hay datos, asignamos un array vacío
                        this.showAlert("warning", result.message, 3000);
                        
                    }
                } catch (error) {
                    this.dialogEdit = false;
                    this.dialogEditCashier = false;
                    this.loadingWorkPlace= false;
                    // Captura de errores no controlados
                    this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
                } finally {
                    this.showCashier();
                    this.dialogEdit = false;
                    this.dialogEditCashier = false;
                    this.loadingWorkPlace= false;
                }
        },
    },
}
</script>
<style>
.selected-item {
    background-color: orange !important;
}

/* Espacio entre los items */
.list-item-spacing {
    margin-bottom: 8px;
    /* Ajusta según necesites */
}
.green-text {
  color: green;
  text-transform: uppercase;
}
.black-text {
  color: black;
  text-transform: uppercase;
}
</style>