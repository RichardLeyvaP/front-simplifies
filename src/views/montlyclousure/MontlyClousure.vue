<template>
    <!-- Snackbar para notificaciones (se mantiene igual) -->
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

    <v-container style="min-width: 100%; max-height: 100%;">
        <v-card elevation="6" class="mx-4" width='auto'>
            <v-toolbar color="#F18254">
                <v-row align="center">
                    <v-col cols="12" md="10" class="grow t">
                        <span class="text-subtitle-1 ml-2"> <strong> Cierre de mes</strong></span>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-btn @click="showMonthlyClosure" color="black" prepend-icon="mdi-check" title="Cierre mes"
                            style="background-color: #E7E9E9;" :loading="loadingAcept"
                            :disabled="Number(selectedYear) !== new Date().getFullYear()">
                            <span>Cierre</span>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-toolbar>

            <!-- Filtros -->
            <v-row dense class="ml-5 mt-5">
                <v-col cols="12" md="3" v-if="mostrarFila">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches"
                        label="Seleccione una Sucursal" prepend-icon="mdi-store" item-title="name" item-value="id"
                        variant="underlined" @update:modelValue="onBranchChange"></v-autocomplete>
                </v-col>
                <v-col cols="12" md="2">
                    <v-select v-model="selectedYear" :items="years" label="Selecciona un año" variant="underlined"
                        prepend-icon="mdi-calendar"></v-select><!--@update:model-value="initialize()"-->
                </v-col>
                <v-col cols="12" md="1">
                    <v-btn icon @click="initialize()" color="#F18254">
                        <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                </v-col>
            </v-row>

            <!-- Tabla de cierres -->
            <v-row dense>
                <v-col cols="12">
                    <v-card-text>
                        <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar"
                            single-line hide-details></v-text-field>

                        <v-data-table :headers="headers" :items="filteredClosures" :search="search" :loading="loading"
                            loading-text="Cargando cierres de mes..." no-data-text="No hay cierres registrados"
                            no-results-text="No se encontraron resultados" show-expand>
                            <template #[`item.displayName`]="{ item }">
                                {{ item.type === 'Sucursal' ? item.branchName : item.businessName }}
                            </template>
                            <template #[`item.type`]="{ item }">
                                <v-chip small>
                                    {{ item.type }}
                                </v-chip>
                            </template>
                            <template v-slot:item.month="{ item }">
                                {{ formatMonth(item.month) }}
                            </template>
                            <template v-slot:item.actions="{ item, internalItem, isExpanded, toggleExpand }">
                                <!-- Botón de expansión (ícono verde) -->
                                <v-btn density="comfortable"
                                    :icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                    @click="toggleExpand(internalItem)" color="green" variant="tonal" elevation="1"
                                    title="Más Información" class="mr-1"></v-btn>

                            </template>
                            <template v-slot:expanded-row="{ columns, item }">
                                <tr>
                                    <td :colspan="columns.length" class="py-2">
                                        <div style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                                            <v-card style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                                                <v-card-text>
                                                    <v-row class="mb-4 mt-2" dense no-gutters>
                                                        <v-col cols="12" md="4">
                                                            <v-card class="mx-2"
                                                                subtitle="Dinero disponible ingresado en el mes"
                                                                style="background-color: #F18254; color: white;"
                                                                elevation="4">
                                                                <template v-slot:prepend>
                                                                    <v-avatar color="white">
                                                                        <v-icon icon="mdi-cash-multiple" color="#F18254"
                                                                            size="large"></v-icon>
                                                                    </v-avatar>
                                                                </template>
                                                                <template v-slot:title>
                                                                    <span class="font-weight-black">Dinero
                                                                        Disponible</span>
                                                                </template>
                                                                <v-card-text class="bg-surface-light pt-4">


                                                                    <v-row dense align="center"
                                                                        v-if="item.available_money">
                                                                        <v-col cols="12" md="6">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold">Dinero
                                                                                disponible: $</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" class="text-right">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold text-black">{{
                                                                                    formatNumber(item.available_money)
                                                                                }}</span>
                                                                        </v-col>
                                                                    </v-row>
                                                                </v-card-text>
                                                            </v-card>
                                                        </v-col>
                                                        <v-col cols="12" md="4">
                                                            <v-card class="mx-2"
                                                                subtitle="Datos arrojados por el sistema"
                                                                style="background-color: #F18254; color: white;"
                                                                elevation="4">
                                                                <template v-slot:prepend>
                                                                    <v-avatar color="white">
                                                                        <v-icon icon="mdi-cash-multiple" color="#F18254"
                                                                            size="large"></v-icon>
                                                                    </v-avatar>
                                                                </template>
                                                                <template v-slot:title>
                                                                    <span class="font-weight-black">Aplicación</span>
                                                                </template>
                                                                <v-card-text class="bg-surface-light pt-4">


                                                                    <v-row dense align="center">
                                                                        <v-col cols="12" md="6">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold">Utilidad:
                                                                                $</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" class="text-right">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold text-black">{{
                                                                                    formatNumber(item.utility)
                                                                                }}</span>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <v-row dense align="center">
                                                                        <v-col cols="12" md="6">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold">Retención:
                                                                                $</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" class="text-right">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold text-black">{{
                                                                                    formatNumber(item.retention)
                                                                                }}</span>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <v-row dense align="center">
                                                                        <v-col cols="12" md="6">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold">-Descuentos:
                                                                                $</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" class="text-right">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold text-black">{{
                                                                                    formatNumber(item.discounts)
                                                                                }}</span>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <v-row dense align="center">
                                                                        <v-col cols="12" md="6">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold">TOTAL:
                                                                                $</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" class="text-right">
                                                                            <span :class="`text-body-1 font-weight-bold ${totalCalculado >= 0 ? 'text-black' : 'text-error'
                                                                                }`">
                                                                                {{ formatNumber(totalCalculado) }}
                                                                            </span>
                                                                        </v-col>
                                                                    </v-row>
                                                                </v-card-text>
                                                            </v-card>
                                                        </v-col>
                                                        <v-col cols="12" md="4">
                                                            <v-card class="mx-2" subtitle="Arqueo del cierre de mes"
                                                                style="background-color: #F18254; color: white;"
                                                                elevation="4">
                                                                <template v-slot:prepend>
                                                                    <v-avatar color="white">
                                                                        <v-icon icon="mdi-cash-multiple" color="#F18254"
                                                                            size="large"></v-icon>
                                                                    </v-avatar>
                                                                </template>
                                                                <template v-slot:title>
                                                                    <span class="font-weight-black">Arqueo</span>
                                                                </template>
                                                                <v-card-text class="bg-surface-light pt-4">


                                                                    <v-row dense align="center">
                                                                        <v-col cols="12" md="6">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold">Diferencias:
                                                                                $</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" class="text-right">
                                                                            <span :class="`text-body-1 font-weight-bold ${item.differences >= 0 ? 'text-black' : 'text-error'
                                                                                }`">
                                                                                {{ formatNumber(item.differences)
                                                                                }}
                                                                            </span>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <v-row dense align="center">
                                                                        <v-col cols="12" md="6">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold">Utilidad
                                                                                Final: $</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" class="text-right">
                                                                            <span :class="`text-body-1 font-weight-bold ${item.net_utility >= 0 ? 'text-black' : 'text-error'
                                                                                }`">
                                                                                {{ formatNumber(item.net_utility)
                                                                                }}
                                                                            </span>
                                                                        </v-col>
                                                                    </v-row>
                                                                </v-card-text>
                                                            </v-card>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>
                                            </v-card>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <template v-slot:item.data-table-expand="{ item, isExpanded, toggleExpand }">
                                <!-- Template vacío para ocultar el expand en filas normales -->
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-col>
            </v-row>
        </v-card>
    </v-container>

    <v-dialog v-model="dialogMontlyClousure" fullscreen transition="dialog-bottom-transition" persistent
        :no-click-animation="true">
        <v-card>
            <v-card-text>
                <v-form v-model="valid" enctype="multipart/form-data">

                    <v-stepper elevation="6" bg-color="" v-model="step" :items="items" hide-actions
                        @update:model-value="handleStepChange"
                        style="max-height: 100vh; min-height: 95vh; overflow-y: auto;">
                        <template v-slot:item.1>
                            <v-sheet border>
                                <div style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                                    <v-row class="mt-2" dense align="center">
                                        <v-col cols="12" md="1">
                                        </v-col>
                                        <!-- Año - Cambiado cols="12" a cols="6" para md y sm -->
                                        <v-col cols="12" md="3" class="mx-8" v-if="false">
                                            <v-select v-model="selectedYear" :items="years" label="Año"
                                                variant="underlined" prepend-icon="mdi-calendar" density="comfortable"
                                                disabled="true"></v-select>
                                        </v-col>

                                        <!-- Mes - Cambiado cols="12" a cols="6" para md y sm -->
                                        <v-col cols="12" md="3" class="mx-8">
                                            <v-select v-model="selectedMounth" :items="months.map(month => ({
            value: month.value,
            title: formatMonth(`${selectedYear}-${month.value}`)  // Concatenamos año + mes
        }))" label="Mes"
                                                variant="underlined" prepend-icon="mdi-calendar-month"
                                                density="comfortable"></v-select>
                                        </v-col>

                                        <!-- Espacio adicional si necesitas más controles -->
                                        <v-col cols="12" md="4">
                                            <!-- Controles adicionales aquí -->
                                        </v-col>
                                    </v-row>
                                    <v-card style="max-height: 55vh; min-height: 55vh; overflow-y: auto;">
                                        <v-card-text>
                                            <v-row class="mb-4 mt-2" dense no-gutters>
                                                <v-col cols="12" md="1" class="text-center"></v-col>
                                                <v-col cols="12" md="5">
                                                    <v-card class="mx-6" subtitle="Introduces tus datos de ingresos "
                                                        style="background-color: #F18254; color: white;" elevation="4">
                                                        <template v-slot:prepend>
                                                            <v-avatar color="white">
                                                                <v-icon icon="mdi-cash-multiple" color="#004059"
                                                                    size="large"></v-icon>
                                                            </v-avatar>
                                                        </template>
                                                        <template v-slot:title>
                                                            <span class="font-weight-black">Datos de Ingresos</span>
                                                        </template>
                                                        <template v-slot:append>
                                                            <v-btn prepend-icon="mdi-plus" variant="outlined"
                                                                @click="dialogIncomes = true">
                                                                Agregar
                                                            </v-btn>
                                                        </template>
                                                        <v-card-text class="bg-white pa-0"
                                                            style="display: flex; flex-direction: column; max-height: 33vh; min-height: 33vh;">
                                                            <!-- Encabezados fijos -->
                                                            <div class="sticky-header"
                                                                style="padding: 12px 16px; background: white; z-index: 1;">
                                                                <v-row dense align="center" class="font-weight-bold">
                                                                    <v-col cols="6">Destino</v-col>
                                                                    <v-col cols="4" class="text-left">Monto</v-col>
                                                                    <v-col cols="2" class="text-right">Acción</v-col>
                                                                </v-row>
                                                            </div>

                                                            <!-- Área de scroll (esto es lo clave) -->
                                                            <div style="flex: 1; overflow-y: auto; padding: 0 16px;">
                                                                <div v-if="editedItem.incomes.length > 0">
                                                                    <div v-for="income in editedItem.incomes"
                                                                        :key="income.id">
                                                                        <v-row dense align="center">
                                                                            <v-col cols="6">
                                                                                <span class="text-body-1">{{
                                                                                    income.name }}</span>
                                                                            </v-col>
                                                                            <v-col cols="4" class="text-left">
                                                                                <span
                                                                                    class="text-body-1 font-weight-medium">${{
                                                                                        formatNumber(income.amount)
                                                                                    }}</span>
                                                                            </v-col>
                                                                            <v-col cols="2" class="text-right">
                                                                                <v-btn density="comfortable"
                                                                                    icon="mdi-delete"
                                                                                    @click.stop="removeIncome(income)"
                                                                                    color="red-darken-4"
                                                                                    variant="tonal"></v-btn>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </div>
                                                                </div>
                                                                <div v-else class="text-center text-grey py-8">
                                                                    No hay ingresos registrados
                                                                </div>
                                                            </div>
                                                        </v-card-text>
                                                    </v-card>
                                                    <v-spacer></v-spacer>
                                                    <v-divider></v-divider>
                                                    <v-divider class="my-2"></v-divider>
                                                    <v-row dense align="center" v-if="editedItem.available_money">
                                                        <v-col cols="12" md="3" class="mx-6">
                                                            <span class="text-body-1 font-weight-bold">Dinero
                                                                disponible:</span>
                                                        </v-col>
                                                        <v-col cols="12" md="6" class="text-left">
                                                            <span class="text-body-1 font-weight-bold text-black">${{
                                                                formatNumber(editedItem.available_money)
                                                            }}</span>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                                <v-col cols="12" md="5">
                                                    <v-card class="mx-6" subtitle="Introduces tus datos de gastos "
                                                        style="background-color: #F18254; color: white;" elevation="4">
                                                        <template v-slot:prepend>
                                                            <v-avatar color="white">
                                                                <v-icon icon="mdi-cash-remove" color="#004059"
                                                                    size="large"></v-icon>
                                                            </v-avatar>
                                                        </template>
                                                        <template v-slot:title>
                                                            <span class="font-weight-black">Datos de Gastos</span>
                                                        </template>
                                                        <template v-slot:append>
                                                            <v-btn prepend-icon="mdi-plus" variant="outlined"
                                                                @click="dialogExpenses = true">
                                                                Agregar
                                                            </v-btn>
                                                        </template>
                                                        <v-card-text class="bg-white pa-0"
                                                            style="display: flex; flex-direction: column; max-height: 33vh; min-height: 33vh;">
                                                            <!-- Encabezados fijos -->
                                                            <div class="sticky-header"
                                                                style="padding: 12px 16px; background: white; z-index: 1;">
                                                                <v-row dense align="center" class="font-weight-bold">
                                                                    <v-col cols="6">Destino</v-col>
                                                                    <v-col cols="4" class="text-left">Monto</v-col>
                                                                    <v-col cols="2" class="text-right">Acción</v-col>
                                                                </v-row>
                                                            </div>

                                                            <!-- Área de scroll (esto es lo clave) -->
                                                            <div style="flex: 1; overflow-y: auto; padding: 0 16px;">
                                                                <div v-if="editedItem.expenses.length > 0">
                                                                    <div v-for="expense in editedItem.expenses"
                                                                        :key="expense.id">
                                                                        <v-row dense align="center">
                                                                            <v-col cols="6">
                                                                                <span class="text-body-1">{{
                                                                                    expense.name }}</span>
                                                                            </v-col>
                                                                            <v-col cols="4" class="text-left">
                                                                                <span
                                                                                    class="text-body-1 font-weight-medium">${{
                                                                                        formatNumber(expense.amount)
                                                                                    }}</span>
                                                                            </v-col>
                                                                            <v-col cols="2" class="text-right">
                                                                                <v-btn density="comfortable"
                                                                                    icon="mdi-delete"
                                                                                    @click.stop="removeExpense(expense)"
                                                                                    color="red-darken-4"
                                                                                    variant="tonal"></v-btn>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </div>
                                                                </div>
                                                                <div v-else class="text-center text-grey py-8">
                                                                    No hay gastos registrados
                                                                </div>
                                                            </div>
                                                        </v-card-text>
                                                        <!-- Pie de la tabla -->
                                                        <!-- 
                                                        <v-card-actions>
                                                            <v-spacer></v-spacer>
                                                            <v-btn @click="save" color="primary" :loading="loadingSave">
                                                                Guardar
                                                            </v-btn>
                                                        </v-card-actions>-->
                                                    </v-card>
                                                    <v-spacer></v-spacer>
                                                    <v-divider></v-divider>
                                                    <v-divider class="my-2"></v-divider>
                                                    <v-row dense align="center" v-if="editedItem.discounts">
                                                        <v-col cols="12" md="3" class="mx-6">
                                                            <span class="text-body-1 font-weight-bold">Descuento:</span>
                                                        </v-col>
                                                        <v-col cols="12" md="6" class="text-left">
                                                            <span class="text-body-1 font-weight-bold text-warning">${{
                                                                formatNumber(editedItem.discounts)
                                                            }}</span>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </div>
                            </v-sheet>
                            <v-container fluid>
                                <!-- BOTONES -->
                                <v-row class="mt-1">
                                    <v-btn color="#E7E9E9" variant="flat" @click="dialogMontlyClousure = false">
                                        Salir
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn color="#E7E9E9" variant="flat" @click="nextStep">Siguiente</v-btn>
                                </v-row>
                            </v-container>
                        </template>
                        <!--<template v-slot:item.2>
                            <v-sheet border>
                                <div style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                                    <v-card style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                                        <v-card-text>
                                            <v-row class="mb-4 mt-2" dense no-gutters>
                                                <v-col cols="12" md="1" class="text-center"></v-col>
                                                <v-col cols="12" md="5" class="ml-6">
                                                    <v-card class="mx-auto" subtitle="Introduces tus datos de ingresos "
                                                        style="background-color: #F18254; color: white;" elevation="4">
                                                        <template v-slot:prepend>
                                                            <v-avatar color="white">
                                                                <v-icon icon="mdi-cash-remove" color="#004059"
                                                                    size="large"></v-icon>
                                                            </v-avatar>
                                                        </template>
                                                        <template v-slot:title>
                                                            <span class="font-weight-black">Datos de Gastos</span>
                                                        </template>
                                                        <template v-slot:append>
                                                            <v-btn prepend-icon="mdi-plus" variant="outlined"
                                                                @click="dialogExpenses = true">
                                                                Agregar
                                                            </v-btn>
                                                        </template>
                                                        <v-card-text class="bg-white pt-4"
                                                            style="min-height: 44vh; overflow-y: auto;">

                                                            <v-row dense align="center" class="font-weight-bold">
                                                                <v-col cols="12" md="6">Destino</v-col>
                                                                <v-col cols="12" md="4" class="text-left">Monto</v-col>
                                                                <v-col cols="12" md="2"
                                                                    class="text-right">Acción</v-col>
                                                            </v-row>
                                                            <v-div v-if="editedItem.expenses.length > 0">
                                                                <v-div v-for="expense in editedItem.expenses"
                                                                    :key="expense.id" class="mb-2">
                                                                    <template v-slot:default>
                                                                        <v-row dense align="center">
                                                                            <v-col cols="12" md="6">
                                                                                <span class="text-body-1">{{
                                                                                    expense.name
                                                                                    }}</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="4" class="text-left">
                                                                                <span
                                                                                    class="text-body-1 font-weight-medium">${{
                                                                                        formatNumber(expense.amount)
                                                                                    }}</span>
                                                                            </v-col>
                                                                            <v-col cols="12" md="2" class="text-right">
                                                                                <v-btn density="comfortable"
                                                                                    icon="mdi-delete"
                                                                                    @click.stop="removeExpense(expense)"
                                                                                    style="cursor: pointer;"
                                                                                    color="red-darken-4" variant="tonal"
                                                                                    elevation="1"></v-btn>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </template>
                                                                </v-div>
                                                            </v-div>
                                                        </v-card-text>
                                                    </v-card>
                                                    <v-spacer></v-spacer>
                                                    <v-divider></v-divider>
                                                    <v-divider class="my-2"></v-divider>
                                                    <v-row dense align="center" v-if="editedItem.discounts">
                                                        <v-col cols="12" md="3">
                                                            <span class="text-body-1 font-weight-bold">Descuento:</span>
                                                        </v-col>
                                                        <v-col cols="12" md="6" class="text-left">
                                                            <span class="text-body-1 font-weight-bold text-warning">${{
                                                                formatNumber(editedItem.discounts)
                                                                }}</span>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </div>

                            </v-sheet>
                            <v-container fluid>
                                <v-row class="mt-1">
                                    <v-btn color="#E7E9E9" variant="flat" @click="prevStep">
                                        Volver
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn color="#E7E9E9" variant="flat" @click="nextStep">
                                        Siguiente
                                    </v-btn>
                                </v-row>
                            </v-container>
                        </template>-->
                        <template v-slot:item.2>
                            <v-sheet border>
                                <div style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                                    <v-card style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                                        <v-card-text>
                                            <v-row class="mb-4 mt-2" dense no-gutters>
                                                <v-col cols="12" md="4">
                                                    <v-card class="mx-2"
                                                        subtitle="Dinero disponible ingresado en el mes"
                                                        style="background-color: #F18254; color: white;" elevation="4">
                                                        <template v-slot:prepend>
                                                            <v-avatar color="white">
                                                                <v-icon icon="mdi-cash-multiple" color="#F18254"
                                                                    size="large"></v-icon>
                                                            </v-avatar>
                                                        </template>
                                                        <template v-slot:title>
                                                            <span class="font-weight-black">Dinero Disponible</span>
                                                        </template>
                                                        <v-card-text class="bg-surface-light pt-4">


                                                            <v-row dense align="center"
                                                                v-if="editedItem.available_money">
                                                                <v-col cols="12" md="6">
                                                                    <span class="text-body-1 font-weight-bold">Dinero
                                                                        disponible: $</span>
                                                                </v-col>
                                                                <v-col cols="12" md="6" class="text-right">
                                                                    <span
                                                                        class="text-body-1 font-weight-bold text-black">{{
                                                                            formatNumber(editedItem.available_money)
                                                                        }}</span>
                                                                </v-col>
                                                            </v-row>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                                <v-col cols="12" md="4">
                                                    <v-card class="mx-2" subtitle="Datos arrojados por el sistema"
                                                        style="background-color: #F18254; color: white;" elevation="4">
                                                        <template v-slot:prepend>
                                                            <v-avatar color="white">
                                                                <v-icon icon="mdi-cash-multiple" color="#F18254"
                                                                    size="large"></v-icon>
                                                            </v-avatar>
                                                        </template>
                                                        <template v-slot:title>
                                                            <span class="font-weight-black">Aplicación</span>
                                                        </template>
                                                        <v-card-text class="bg-surface-light pt-4">


                                                            <v-row dense align="center">
                                                                <v-col cols="12" md="6">
                                                                    <span class="text-body-1 font-weight-bold">Utilidad:
                                                                        $</span>
                                                                </v-col>
                                                                <v-col cols="12" md="6" class="text-right">
                                                                    <span
                                                                        class="text-body-1 font-weight-bold text-black">{{
                                                                            formatNumber(editedItem.utility)
                                                                        }}</span>
                                                                </v-col>
                                                            </v-row>
                                                            <v-row dense align="center">
                                                                <v-col cols="12" md="6">
                                                                    <span
                                                                        class="text-body-1 font-weight-bold">Retención:
                                                                        $</span>
                                                                </v-col>
                                                                <v-col cols="12" md="6" class="text-right">
                                                                    <span
                                                                        class="text-body-1 font-weight-bold text-black">{{
                                                                            formatNumber(editedItem.retention)
                                                                        }}</span>
                                                                </v-col>
                                                            </v-row>
                                                            <v-row dense align="center">
                                                                <v-col cols="12" md="6">
                                                                    <span
                                                                        class="text-body-1 font-weight-bold">-Descuentos:
                                                                        $</span>
                                                                </v-col>
                                                                <v-col cols="12" md="6" class="text-right">
                                                                    <span
                                                                        class="text-body-1 font-weight-bold text-black">{{
                                                                            formatNumber(editedItem.discounts)
                                                                        }}</span>
                                                                </v-col>
                                                            </v-row>
                                                            <v-row dense align="center">
                                                                <v-col cols="12" md="6">
                                                                    <span class="text-body-1 font-weight-bold">TOTAL:
                                                                        $</span>
                                                                </v-col>
                                                                <v-col cols="12" md="6" class="text-right">
                                                                    <span :class="`text-body-1 font-weight-bold ${totalCalculado >= 0 ? 'text-black' : 'text-error'
                                                                        }`">
                                                                        {{ formatNumber(totalCalculado) }}
                                                                    </span>
                                                                </v-col>
                                                            </v-row>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                                <v-col cols="12" md="4">
                                                    <v-card class="mx-2" subtitle="Arqueo del cierre de mes"
                                                        style="background-color: #F18254; color: white;" elevation="4">
                                                        <template v-slot:prepend>
                                                            <v-avatar color="white">
                                                                <v-icon icon="mdi-cash-multiple" color="#F18254"
                                                                    size="large"></v-icon>
                                                            </v-avatar>
                                                        </template>
                                                        <template v-slot:title>
                                                            <span class="font-weight-black">Arqueo</span>
                                                        </template>
                                                        <v-card-text class="bg-surface-light pt-4">


                                                            <v-row dense align="center">
                                                                <v-col cols="12" md="6">
                                                                    <span
                                                                        class="text-body-1 font-weight-bold">Diferencias:
                                                                        $</span>
                                                                </v-col>
                                                                <v-col cols="12" md="6" class="text-right">
                                                                    <span :class="`text-body-1 font-weight-bold ${editedItem.differences >= 0 ? 'text-black' : 'text-error'
                                                                        }`">
                                                                        {{ formatNumber(editedItem.differences) }}
                                                                    </span>
                                                                </v-col>
                                                            </v-row>
                                                            <v-row dense align="center">
                                                                <v-col cols="12" md="6">
                                                                    <span class="text-body-1 font-weight-bold">Utilidad
                                                                        Final: $</span>
                                                                </v-col>
                                                                <v-col cols="12" md="6" class="text-right">
                                                                    <span :class="`text-body-1 font-weight-bold ${editedItem.net_utility >= 0 ? 'text-black' : 'text-error'
                                                                        }`">
                                                                        {{ formatNumber(editedItem.net_utility) }}
                                                                    </span>
                                                                </v-col>
                                                            </v-row>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </div>

                            </v-sheet>
                            <v-container fluid>
                                <!-- BOTONES -->
                                <v-row class="mt-1">
                                    <v-btn color="#E7E9E9" variant="flat" @click="prevStep">
                                        Volver
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn color="#E7E9E9" variant="flat" @click="saveMonthlyClosure" :loading="loadingSave"
>
                                        Finalizar
                                    </v-btn>
                                </v-row>
                            </v-container>
                        </template>
                    </v-stepper>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>

    <!-- End Dialogo de confirmación pasar de página-->
    <v-dialog v-model="dialogIncomes" max-width="500">
        <v-card>
            <v-toolbar color="#F18254">
                <span class="text-subtitle-1  ml-2">Agregar Ingresos</span>
            </v-toolbar>
            <v-card-text>
                <v-text-field v-model="newIncomes.name" variant="underlined" label="Destino"
                    prepend-icon="mdi-cash-check"></v-text-field>
                <v-text-field v-model="newIncomes.amount" variant="underlined" label="Monto" type="number" min="0"
                    prepend-icon="mdi-currency-usd"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="dialogIncomes = false">
                    Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" :disabled="!newIncomes.name || !newIncomes.amount"
                    :loading="loadingAddIncomes" @click="addIncomes">
                    Aceptar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogExpenses" max-width="500">
        <v-card>
            <v-toolbar color="#F18254">
                <span class="text-subtitle-1  ml-2">Agregar Descuentos</span>
            </v-toolbar>
            <v-card-text>
                <v-text-field v-model="newExpenses.name" variant="underlined" label="Destino"
                    prepend-icon="mdi-chart-box-outline"></v-text-field>
                <v-text-field v-model="newExpenses.amount" variant="underlined" label="Monto" type="number" min="0"
                    prepend-icon="mdi-currency-usd"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="dialogExpenses = false">
                    Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" :disabled="!newExpenses.name || !newExpenses.amount"
                    :loading="loadingAddExpenses" @click="addExpenses">
                    Aceptar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDeleteIncome" max-width="500px">
        <v-card>
            <v-toolbar color="red">
                <span class="text-subtitle-2 ml-4"> Eliminar un Ingreso</span>
            </v-toolbar>

            <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el ingreso seleccionado?</v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="closeDelete">
                    Cancelar
                </v-btn>
                <v-btn color="warning" variant="flat" @click="deleteItemConfirmIncome">
                    Aceptar
                </v-btn>


            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDeleteExpense" max-width="500px">
        <v-card>
            <v-toolbar color="red">
                <span class="text-subtitle-2 ml-4"> Eliminar un Gasto</span>
            </v-toolbar>

            <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el gasto seleccionado?</v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="closeDelete">
                    Cancelar
                </v-btn>
                <v-btn color="warning" variant="flat" @click="deleteItemConfirmExpense">
                    Aceptar
                </v-btn>


            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api";

export default {

    data: () => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        // Cálculo del mes anterior con ajuste de año
        const previousDate = new Date(currentDate);
        previousDate.setMonth(previousDate.getMonth() - 1);
        const previousMonth = previousDate.getMonth() + 1;
        const previousYear = previousDate.getFullYear();
        const years = [];
        for (let year = 2023; year <= currentYear; year++) {
            years.push(year);
        }
        years.reverse();
        // Array completo de nombres de meses
        const monthNames = {
            1: 'Enero',
            2: 'Febrero',
            3: 'Marzo',
            4: 'Abril',
            5: 'Mayo',
            6: 'Junio',
            7: 'Julio',
            8: 'Agosto',
            9: 'Septiembre',
            10: 'Octubre',
            11: 'Noviembre',
            12: 'Diciembre'
        };
        return {
            loading: false,
            loadingAddIncomes: false,
            loadingAddExpenses: false,
            loadingSave: false,
            search: '',
            valid: true,
            monthMenu: false,
            branch_id: null,
            business_id: null,
            mostrarFila: false,
            closures: [],
            branches: [],
            utility: 0,
            retention: 0,
            finance_ids: [],
            retention_ids: [],
            type: 'Business',
            years,
            months: [
                {
                    value: ('0' + previousMonth).slice(-2),
                    title: `${monthNames[previousMonth]}`
                },
                {
                    value: ('0' + currentMonth).slice(-2),
                    title: `${monthNames[currentMonth]}`
                }
            ],
            selectedYear: previousMonth === 12 ? previousYear : currentYear, // Ajuste de año
            selectedMounth: ('0' + previousMonth).slice(-2), // Años desde 2023 hasta actual
            /*months: [
                { value: '', title: '' },
                { value: 1, title: 'Enero' },
                { value: 2, title: 'Febrero' },
                { value: 3, title: 'Marzo' },
                { value: 4, title: 'Abril' },
                { value: 5, title: 'Mayo' },
                { value: 6, title: 'Junio' },
                { value: 7, title: 'Julio' },
                { value: 8, title: 'Agosto' },
                { value: 9, title: 'Septiembre' },
                { value: 10, title: 'Octubre' },
                { value: 11, title: 'Noviembre' },
                { value: 12, title: 'Diciembre' }
            ],*/
            headers: [
                { title: 'Realizado', key: 'data', sortable: true },
                { title: 'Mes', key: 'month', sortable: true },
                { title: 'Nombre', key: 'displayName', sortable: true },
                { title: 'Tipo', key: 'type', sortable: true, },
                { title: 'Utilidad Final', key: 'net_utility', sortable: true, },
                { title: 'Responsable', key: 'professionalName', sortable: true },
                { title: 'Acciones', key: 'actions', sortable: false },
            ],
            // Snackbar (se mantiene igual)
            snackbar: false,
            sb_type: '',
            sb_message: '',
            sb_timeout: 2000,
            sb_title: '',
            sb_icon: '',
            step: 1,
            items: [
                'Ingresos y Gastos',
                'Resumen'
            ],
            editedItem: {
                id: '',
                branch_id: '',
                business_id: '',
                data: '',
                available_money: 0,
                utility: 0,
                net_utility: 0,
                retention: 0,
                discounts: 0,
                differences: 0,
                incomes: [],
                expenses: [],
                user_id: '',
            },
            defaultEditedItem: {
                id: '',
                branch_id: '',
                business_id: '',
                data: '',
                available_money: 0,
                utility: 0,
                net_utility: 0,
                retention: 0,
                discounts: 0,
                differences: 0,
                incomes: [], //ingresos
                expenses: [], //gastos
                user_id: '',
            },
            newIncomes: {
                id: null,
                name: '',
                amount: 0
            },
            newExpenses: {
                id: null,
                name: '',
                amount: 0
            },
            dialogIncomes: false,
            dialogExpenses: false,
            dialogDeleteIncome: false,
            dialogDeleteExpense: false,
            dialogDelete: false,
            dialogMontlyClousure: false,
        }
    },

    computed: {
        totalCalculado() {
            return (parseFloat(this.editedItem.utility) || 0) +
                (parseFloat(this.editedItem.retention) || 0) -
                (parseFloat(this.editedItem.discounts) || 0);
        },

        filteredClosures() {
            return this.closures.filter(closure => closure.data !== null);
        }
    },

    async mounted() {
        this.business_id = LocalStorageService.getItem('business_id');
        this.charge_id = LocalStorageService.getItem('charge_id');
        this.charge = JSON.parse(LocalStorageService.getItem("charge"));
        this.branch_id = LocalStorageService.getItem('branch_id');
        this.charge = JSON.parse(LocalStorageService.getItem("charge"));

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
                this.type = 'Business'
                this.branch_id = null;
                this.mostrarFila = true;
            }
            else {
                this.type = 'Branch'
                this.mostrarFila = false;
            }
            await this.initialize();
        }


    },

    watch: {
        // Watcher único para 'available_money' que ejecuta ambos cálculos
        'editedItem.available_money': {
            handler(newVal) {
                this.calcularDiferencias();
                this.calcularUtilidadFinal();
            },
            immediate: true
        },

        // Watcher para 'totalCalculado' (solo necesita calcular diferencias)
        'totalCalculado': {
            handler: 'calcularDiferencias',
            immediate: true
        },

        // Watcher para 'retention' (solo necesita calcular utilidad final)
        'editedItem.retention': {
            handler: 'calcularUtilidadFinal',
            immediate: true
        },
        selectedMounth(newVal) {
            if (newVal === '12' && this.selectedYear < new Date().getFullYear()) {
                this.selectedYear += 1; // Avanza al siguiente año si seleccionan diciembre
            } else if (newVal === '01' && this.selectedYear > 2023) {
                this.selectedYear -= 1; // Retrocede al año anterior si seleccionan enero
            }
            this.initialize();
            console.log(this.selectedYear);
        }
    },

    methods: {
        loadClosureData() {
            const month = `${this.selectedYear}-${String(this.selectedMounth).padStart(2, '0')}`;
            console.log('month seleccionado');
            console.log(month);
            const foundClosure = this.closures.find(closure => {
                const closureMonth = closure.month?.toString().trim();
                return closureMonth === month;
            });

            const safeParse = (data) => {
                if (Array.isArray(data)) return data;
                if (typeof data !== 'string') return [];
                try {
                    return JSON.parse(data || '[]');
                } catch (e) {
                    console.error('Error al parsear:', e);
                    return [];
                }
            };

            this.editedItem = foundClosure
                ? {
                    ...foundClosure,
                    incomes: safeParse(foundClosure.incomes),
                    expenses: safeParse(foundClosure.expenses)
                }
                : { ...this.defaultEditedItem };
        },
        formatMonth(monthString) {
            if (!monthString) return 'N/A';

            const [year, month] = monthString.split('-');
            const months = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];
            return `${months[parseInt(month) - 1]} del ${year}`;
        },
        processedClosures() {
            return this.closures.map(item => ({
                ...item,
                displayName: item.type === 'Branch' ? item.branchName : item.businessName
            }));
        },
        onBranchChange(newVal) {
            if (newVal) {
                this.type = 'Branch';
            }
        },
        calcularUtilidadFinal() {
            const available = parseFloat(this.editedItem.available_money) || 0;
            const retention = parseFloat(this.editedItem.retention) || 0;
            this.editedItem.net_utility = available - retention;
        },
        calcularDiferencias() {
            this.editedItem.differences = this.totalCalculado -
                (parseFloat(this.editedItem.available_money)) || 0;
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
        async initialize() {
            this.loading = true;
            this.closures = [];
            try {
                const params = {
                    year: this.selectedYear ?? new Date().getFullYear(), // Solo usa año actual si this.year es null/undefined
                    branch_id: this.type === 'Branch' ? this.branch_id : null,
                    business_id: this.type === 'Business' ? this.business_id : null,
                };

                const result = await handleRequest({
                    endpoint: 'mounthly-clousure-year',
                    method: 'GET',
                    params
                });

                this.closures = result.data.success ? result.data.closures : [];
                console.log('this.closures');
                console.log(this.closures);
                this.loading = false;

            } catch (error) {
                this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
                this.closures = [];
            } finally {
                this.loading = false;
                this.loadClosureData();
            }
        },

        async showMonthlyClosure() {
            this.loadClosureData();
            this.dialogMontlyClousure = true;
        },

        async addIncomes() {
            this.loadingAddIncomes = true;
            // Generar ID único
            const newId = Date.now()
            const value = parseFloat(this.newIncomes.amount) || 0
            this.editedItem.available_money += value;
            // Crear el objeto detalle
            const income = {
                id: newId,
                amount: value,
                name: this.newIncomes.name
            }

            // Agregar a la lista de detalles
            this.editedItem.incomes.push(income)
            this.editedItem.branch_id = this.type === 'Branch' ? this.branch_id : null;
            this.editedItem.business_id = this.type === 'Business' ? this.business_id : null;

            const requestData = {
                editedItem: this.editedItem, // Datos del sistema
                month: `${this.selectedYear}-${this.selectedMounth}`,  // Formato YYYY-MM
            };
            try {
                const result = await handleRequest({
                    endpoint: 'mounthly-clousure-incomes',
                    method: 'POST',
                    data: requestData
                });

                // Manejo de la respuesta según el resultado
                if (result.success) {
                    this.showAlert("success", result.message, 3000);
                } else {
                    //this.loadingBonus = true;
                    //this.dialogMontlyClousure = false;
                    this.showAlert("warning", result.message, 3000);
                }
            } catch (error) {
                this.loadingAddIncomes = false;
                // Este bloque captura errores inesperados fuera del manejo estándar
                this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
            } finally {
                //this.close();
                this.dialogIncomes = false;
                this.loadingAddIncomes = false;
                this.showAlert("success", "Ingreso Agregado correctamente.", 3000);
                await this.initialize();
            }

            // Resetear el formulario y cerrar diálogo
            this.newIncomes = { id: null, name: '', amount: 0 }
            this.dialogIncomes = false;
        },
        deleteIncome() {
            this.dialogDeleteIncome = true;
        },
        deleteExpense() {
            this.dialogDeleteExpense = true;
        },
        closeDelete() {
            this.dialogDeleteIncome = false;
            this.dialogDeleteExpense = false;
        },
        async removeIncome(income) {
            // Buscar el índice del ingreso en el array
            const index = this.editedItem.incomes.findIndex(item => item.id === income.id);

            if (index !== -1) {
                // Obtener el monto del ingreso a eliminar
                const removedAmount = this.editedItem.incomes[index].amount;

                // Restar el monto del available_money
                this.editedItem.available_money -= removedAmount;

                // Eliminar el ingreso del array
                this.editedItem.incomes.splice(index, 1);
            }

            const requestData = {
                editedItem: this.editedItem, // Datos del sistema
            };
            try {
                const result = await handleRequest({
                    endpoint: 'mounthly-clousure-destroy',
                    method: 'POST',
                    data: requestData
                });

                // Manejo de la respuesta según el resultado
                if (result.success) {
                    this.showAlert("success", result.message, 3000);
                } else {
                    //this.loadingBonus = true;
                    //this.dialogMontlyClousure = false;
                    this.showAlert("warning", result.message, 3000);
                }
            } catch (error) {
                // Este bloque captura errores inesperados fuera del manejo estándar
                this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
            } finally {
                //this.close();
                this.showAlert("success", "Ingreso eliminado correctamente.", 3000);
                await this.initialize();
                this.closeDelete();
            }
        },

        async addExpenses() {
            // Generar ID único
            this.loadingAddExpenses = true;
            const newId = Date.now()
            const value = parseFloat(this.newExpenses.amount) || 0
            this.editedItem.discounts += value;
            // Crear el objeto detalle
            const expense = {
                id: newId,
                amount: value,
                name: this.newExpenses.name
            }

            // Agregar a la lista de detalles
            this.editedItem.expenses.push(expense)
            const requestData = {
                editedItem: this.editedItem, // Datos del sistema
                month: `${this.selectedYear}-${this.selectedMounth}`,  // Formato YYYY-MM
            };
            try {
                const result = await handleRequest({
                    endpoint: 'mounthly-clousure-expenses',
                    method: 'POST',
                    data: requestData
                });

                // Manejo de la respuesta según el resultado
                if (result.success) {
                    this.showAlert("success", result.message, 3000);
                } else {
                    //this.loadingBonus = true;
                    //this.dialogMontlyClousure = false;
                    this.showAlert("warning", result.message, 3000);
                }
            } catch (error) {
                this.loadingAddExpenses = false;
                // Este bloque captura errores inesperados fuera del manejo estándar
                this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
            } finally {
                //this.close();
                this.dialogExpenses = false;
                this.loadingAddExpenses = false;
                this.showAlert("success", "Gasto Agregado correctamente.", 3000);
                await this.initialize();
            }

            // Resetear el formulario y cerrar diálogo
            this.newExpenses = { id: null, name: '', amount: 0 }
            this.dialogExpenses = false
        },
        async removeExpense(expense) {
            // Buscar el índice del ingreso en el array
            const index = this.editedItem.expenses.findIndex(item => item.id === expense.id);

            if (index !== -1) {
                // Obtener el monto del ingreso a eliminar
                const removedAmount = this.editedItem.expenses[index].amount;

                // Restar el monto del available_money
                this.editedItem.discounts -= removedAmount;

                // Eliminar el ingreso del array
                this.editedItem.expenses.splice(index, 1);
            }

            const requestData = {
                editedItem: this.editedItem, // Datos del sistema
            };
            try {
                const result = await handleRequest({
                    endpoint: 'mounthly-clousure-destroy',
                    method: 'POST',
                    data: requestData
                });

                // Manejo de la respuesta según el resultado
                if (result.success) {
                    this.showAlert("success", result.message, 3000);
                } else {
                    //this.loadingBonus = true;
                    //this.dialogMontlyClousure = false;
                    this.showAlert("warning", result.message, 3000);
                }
            } catch (error) {
                this.loadingAddExpenses = false;
                // Este bloque captura errores inesperados fuera del manejo estándar
                this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
            } finally {
                //this.close();
                this.showAlert("success", "Gasto eliminado correctamente.", 3000);
                await this.initialize();
                this.closeDelete();
            }
        },
        async utilityMonthlyClosure() {
            const requestParams = {
                branch_id: this.type === 'Branch' ? Number(this.branch_id) : null,
                business_id: this.type === 'Business' ? Number(this.business_id) : null,
                month: `${this.selectedYear}-${this.selectedMounth}`,  // Formato YYYY-MM
            };
            try {
                const result = await handleRequest({
                    endpoint: 'mounthly-clousure-utility',
                    method: 'POST',
                    params: requestParams // Aquí pasas los parámetros
                });

                if (result.success) {
                    // Si la solicitud es exitosa, asignamos las sucursales
                    this.editedItem.utility = result.data.utility;
                    this.editedItem.retention = result.data.retentions_total;
                    this.finance_ids = result.data.finance_ids;
                    this.retention_ids = result.data.retention_ids;
                    console.log('this.editedItem');
                    console.log(this.editedItem);
                } else {
                    // Si no hay datos, asignamos un array vacío
                    this.editedItem.utility = 0;
                    this.editedItem.retention = 0;
                    this.finance_ids = [];
                    this.retention_ids = [];
                }
            } catch (error) {
                this.utility = 0;
                this.finance_ids = [];
                this.finance_ids = [];
                this.retention_ids = [];
                // Captura de errores no controlados
                this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
            } /*finally {
                this.loadClosureData();
            }*/
        },
        changeStep(index) {
            this.step = index;
        },
        async nextStep() {
            if (this.step < this.items.length) {
                this.step++;
            }

            if (this.step == 2) {
                await this.utilityMonthlyClosure();
            }

            console.log('Aqui se muestran los Step');
            console.log(this.step);
            //this.verificateStep(this.step);

        },

        prevStep() {
            if (this.step > 1) {
                this.step--;
            }
        },

        calculateTotal(items) {
            if (!items || !Array.isArray(items)) return 0;
            return items.reduce((sum, item) => sum + (item.amount || 0), 0);
        },

        async saveMonthlyClosure() {
            this.loadingSave = true;
            this.editedItem.branch_id = this.type === 'Branch' ? this.branch_id : null;
            this.editedItem.business_id = this.type === 'Business' ? this.business_id : null;

            const requestData = {
                editedItem: this.editedItem, // Datos del sistema
                month: `${this.selectedYear}-${this.selectedMounth}`,  // Formato YYYY-MM
                //branch_id: this.branch_id,
                //business_id: this.business_id,
                //finance_ids: this.finance_ids,
                //retention_ids: this.retention_ids,
            };
            console.log('this.data para cierre mensual');
            console.log(requestData);
            try {
                const result = await handleRequest({
                    endpoint: 'mounthly-clousure',
                    method: 'POST',
                    data: requestData
                });

                // Manejo de la respuesta según el resultado
                if (result.success) {
                    this.showAlert("success", result.message, 3000);
                } else {
                    this.loadingSave = false;
                    this.dialogMontlyClousure = false;
                    this.showAlert("warning", result.message, 3000);
                }
            } catch (error) {
                this.loadingSave = false;
                this.dialogMontlyClousure = false;
                // Este bloque captura errores inesperados fuera del manejo estándar
                this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
            } finally {
                this.close();
                this.loadingSave = false;
                this.showAlert("success", "Cierre de caja efectuado correctamente", 3000);
                await this.initialize();
            }
        },
        close() {
            this.dialogMontlyClousure = false;
            this.editedItem = Object.assign({}, this.defaultEditedItem);
        },
        // Método showAlert se mantiene igual
        showAlert(sb_type, sb_message, sb_timeout) {
            this.sb_type = sb_type;
            if (sb_type == "success") {
                this.sb_title = 'Éxito';
                this.sb_icon = 'mdi-check-circle';
            } else if (sb_type == "error") {
                this.sb_title = 'Error';
                this.sb_icon = 'mdi-alert-circle';
            } else if (sb_type == "warning") {
                this.sb_title = 'Advertencia';
                this.sb_icon = 'mdi-alert';
            } else {
                this.sb_title = 'Información';
                this.sb_icon = 'mdi-information';
            }
            this.sb_message = sb_message;
            this.sb_timeout = sb_timeout;
            this.snackbar = true;
        }
    }
}
</script>

<style>
.text-green {
    color: #4CAF50;
}

.text-red {
    color: #F44336;
}

.bg-green {
    background-color: #4CAF50;
}

.bg-red {
    background-color: #F44336;
}

.bg-blue {
    background-color: #2196F3;
}

.bg-primary {
    background-color: #F18254;
}
</style>