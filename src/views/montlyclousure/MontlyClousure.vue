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
                        <v-btn @click="showMonthlyClosure" color="black" prepend-icon="mdi-plus-circle"
                            title="Cierre de mes" style="background-color: #E7E9E9;" :loading="loadingAcept"
                            :disabled="Number(selectedYear) !== new Date().getFullYear()">
                            <span>Cierre de mes</span>
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
                            <template v-slot:item.differences="{ item }">
                                <v-chip small variant="flat" :color="getDifferenceColor(item.differences)"
                                    class="font-weight-bold text-black">
                                    {{ formatNumber(Number(item.differences)) }}
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
                                                                        <v-icon icon="mdi-account-cog" color="#F18254"
                                                                            size="large"></v-icon>
                                                                    </v-avatar>
                                                                </template>
                                                                <template v-slot:title>
                                                                    <span class="font-weight-black">Datos del
                                                                        Administrador</span>
                                                                </template>
                                                                <v-card-text class="bg-white pt-4">


                                                                    <v-row dense align="center">
                                                                        <v-col cols="12" md="6">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold">Dinero en Caja:
                                                                                $</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" class="text-right">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold text-black">{{
                                                                                formatNumber(Number(item.available_money))
                                                                                }}</span>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!--<v-row dense align="center">
                                                                        <v-col cols="12" md="6">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold">Utilidad:
                                                                                $</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" class="text-right">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold text-black">{{
                                                                                formatNumber(Number(item.client_utility))
                                                                                }}</span>
                                                                        </v-col>
                                                                    </v-row>-->
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
                                                                        <v-icon icon="mdi-server" color="#F18254"
                                                                            size="large"></v-icon>
                                                                    </v-avatar>
                                                                </template>
                                                                <template v-slot:title>
                                                                    <span class="font-weight-black">Datos Aplicación</span>
                                                                </template>
                                                                <v-card-text class="bg-white pt-4">

                                                                    <v-row dense align="center">
                                                                        <v-col cols="12" md="6">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold">Ingresos:
                                                                                </span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" class="text-right">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold text-black">$ {{
                                                                                formatNumber(Number(item.system_incomes))
                                                                                }}</span>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <v-row dense align="center">
                                                                        <v-col cols="12" md="6">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold">Utilidad:
                                                                                </span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" class="text-right">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold text-black">$ {{
                                                                                formatNumber(Number(item.utility))
                                                                                }}</span>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <v-row dense align="center">
                                                                        <v-col cols="12" md="6">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold">Gastos:
                                                                                </span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" class="text-right">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold text-black">$ {{
                                                                                formatNumber(Number(item.spent))
                                                                                }}</span>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <v-row dense align="center">
                                                                        <v-col cols="12" md="6">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold">Retención:
                                                                                </span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" class="text-right">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold text-black">$ {{
                                                                                formatNumber(Number(item.retention))
                                                                                }}</span>
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
                                                                        <v-icon icon="mdi-scale-balance" color="#F18254"
                                                                            size="large"></v-icon>
                                                                    </v-avatar>
                                                                </template>
                                                                <template v-slot:title>
                                                                    <span class="font-weight-black">Diferencias</span>
                                                                </template>
                                                                <v-card-text class="bg-white pt-4">


                                                                    <v-row dense align="center">
                                                                        <v-col cols="12" md="6">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold">Diferencia:
                                                                                </span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" class="text-right">
                                                                            <span :class="`text-body-1 font-weight-bold ${Number(item.differences) >= 0 ? 'text-black' : 'text-red'
                                                                                }`">$ 
                                                                                {{
                                                                                formatNumber(Number(item.differences))
                                                                                }}
                                                                            </span>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <!--<v-row dense align="center">
                                                                        <v-col cols="12" md="6">
                                                                            <span
                                                                                class="text-body-1 font-weight-bold">Utilidad:
                                                                                $</span>
                                                                        </v-col>
                                                                        <v-col cols="12" md="6" class="text-right">
                                                                            <span :class="`text-body-1 font-weight-bold ${Number(item.difference_utility) >= 0 ? 'text-black' : 'text-red'
                                                                                }`">
                                                                                {{
                                                                                formatNumber(Number(item.difference_utility))
                                                                                }}
                                                                            </span>
                                                                        </v-col>
                                                                    </v-row>-->
                                                                   
                                                                </v-card-text>
                                                            </v-card>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row v-if="item.differences !== 0">
                                                        <v-col cols="12" md="12">
                                                            <v-row class="mb-4 mt-2 text-left" dense no-gutters>

                                                                <v-col cols="12" md="12">
                                                                    <span class="text-h6 ml-6" :class="{
                                                                'text-red': item.differences < 0,
                                                                'text-green': item.differences > 0
                                                            }">Existe una diferencia total de: </span>
                                                                    <span :class="`text-body-1 font-weight-bold ${item.differences > 0 ? 'text-green' : 'text-red'
                                                                }`">
                                                                        {{ formatNumber(item.differences) }}
                                                                    </span>
                                                                </v-col>
                                                            </v-row>
                                                            <v-row class="mb-4 mt-1" dense no-gutters>
                                                                <v-col cols="12" md="12" class="text-center ml-2">
                                                                    <v-textarea v-model="item.description" readonly
                                                                        label="¿Por qué?" variant="solo"
                                                                        density="compact"
                                                                        :rules="descriptionRules"></v-textarea>
                                                                </v-col>
                                                            </v-row>
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
                                <div style="max-height: 72vh; min-height: 72vh; overflow-y: auto; justify-content: center;">
                                    <v-row class="mt-2" dense align="center">
                                        <!-- Año - Cambiado cols="12" a cols="6" para md y sm -->
                                        <v-col cols="12" md="3" v-if="false">
                                            <v-select v-model="selectedYear" :items="years" label="Año"
                                                variant="underlined" prepend-icon="mdi-calendar" density="comfortable"
                                                disabled="true"></v-select>
                                        </v-col>
                                        <v-col cols="12" md="3" v-if="mostrarFila">
                                            <v-autocomplete :no-data-text="'No hay datos disponibles'"
                                                v-model="branch_id" :items="branches" label="Seleccione una Sucursal"
                                                prepend-icon="mdi-store" item-title="name" item-value="id"
                                                variant="underlined" @update:modelValue="onBranchChangeAdd"
                                                class="ml-10"></v-autocomplete>
                                        </v-col>

                                        <!-- Mes - Cambiado cols="12" a cols="6" para md y sm -->
                                        <v-col cols="12" md="3">
                                            <v-select v-model="selectedMounth" :items="months.map(month => ({
                                                value: month.value,
                                                title: `${month.title} ${selectedYear}`
                                            }))" label="Mes" variant="underlined" prepend-icon="mdi-calendar-month"
                                                class="mx-6"></v-select>
                                        </v-col>

                                    </v-row>
                                    <v-card style="max-height: 55vh; min-height: 55vh; overflow-y: auto;">
                                        <v-card-text>
                                            <v-row class="mb-4 mt-2" dense no-gutters>
                                                <v-col cols="12" md="12">
                                                    <v-card class="mx-6" subtitle="Introduce tus datos de ingresos "
                                                        style="background-color: #F18254; color: white;" elevation="4">
                                                        <template v-slot:prepend>
                                                            <v-avatar color="white">
                                                                <v-icon icon="mdi-cash-multiple" color="#004059" size="large"></v-icon>
                                                            </v-avatar>
                                                        </template>
                                                        <template v-slot:title>
                                                            <span class="font-weight-black">Datos de Ingresos</span>
                                                        </template>
                                                        <template v-slot:append>
                                                            <v-btn prepend-icon="mdi-plus-circle" variant="flat" elevation="2" @click="dialogIncomes = true">
                                                                Agregar
                                                            </v-btn>
                                                        </template>
                                                        <v-card-text class="bg-white pt-4" style="min-height: 33vh; overflow-y: auto;">
                                                            <div style="flex: 1; overflow-y: auto; padding: 8px 16px;">
                                                                <div v-if="editedItem.incomes.length > 0">
                                                                    <!-- Cambio principal aquí: agrupamos los ingresos de 2 en 2 -->
                                                                    <template v-for="(income, index) in editedItem.incomes" :key="income.id">
                                                                        <!-- Nueva fila cada 2 elementos -->
                                                                        <v-row v-if="index % 2 === 0" class="mb-2">
                                                                            <!-- Primer elemento del par -->
                                                                            <v-col cols="12" md="5">
                                                                                <v-text-field
                                                                                    :model-value="formatNumberInput(income.amount)"
                                                                                    @update:model-value="updateIncome(income, parseNumberInput($event))"
                                                                                    :label="income.name"
                                                                                    variant="underlined"
                                                                                    density="compact"
                                                                                    @keypress="onlyNumbers"
                                                                                    hide-details="auto">
                                                                                </v-text-field>
                                                                            </v-col>
                                                                            <v-col cols="12" md="1">
                                                                                <v-btn density="comfortable"
                                                                                    icon="mdi-delete"
                                                                                    @click.stop="removeIncome(income)"
                                                                                    color="red-darken-4" variant="tonal"
                                                                                    elevation="1"></v-btn>
                                                                            </v-col>
                                                                            
                                                                            <!-- Segundo elemento del par si existe -->
                                                                            <template v-if="editedItem.incomes[index + 1]">
                                                                                <v-col cols="12" md="5">
                                                                                    <v-text-field
                                                                                        :model-value="formatNumberInput(editedItem.incomes[index + 1].amount)"
                                                                                        @update:model-value="updateIncome(editedItem.incomes[index + 1], parseNumberInput($event))"
                                                                                        :label="editedItem.incomes[index + 1].name"
                                                                                        variant="underlined"
                                                                                        density="compact"
                                                                                        @keypress="onlyNumbers"
                                                                                        hide-details="auto">
                                                                                    </v-text-field>
                                                                                </v-col>
                                                                                <v-col cols="12" md="1">
                                                                                    <v-btn density="comfortable"
                                                                                        icon="mdi-delete"
                                                                                        @click.stop="removeIncome(editedItem.incomes[index + 1])"
                                                                                        color="red-darken-4" variant="tonal"
                                                                                        elevation="1"></v-btn>
                                                                                </v-col>
                                                                            </template>
                                                                            <!-- Espacio vacío si no hay segundo elemento -->
                                                                            <template v-else>
                                                                                <v-col cols="12" md="5"></v-col>
                                                                                <v-col cols="12" md="1"></v-col>
                                                                            </template>
                                                                        </v-row>
                                                                    </template>
                                                                </div>
                                                            </div>
                                                        </v-card-text>
                                                    </v-card>
                                                    <v-spacer></v-spacer>
                                                    <v-divider></v-divider>
                                                    <v-divider class="my-2"></v-divider>
                                                    <v-row dense align="center" v-if="editedItem.available_money">
                                                        <v-col cols="12" md="12" class="text-right">
                                                            <span class="text-body-1 font-weight-bold mr-6">Dinero en Caja: ${{
                                                                formatNumber(editedItem.available_money)
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
                                    <v-btn color="#E7E9E9" variant="flat" @click="salir()"
                                        :disabled="this.loadingAddIncomes">
                                        Salir
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn color="#E7E9E9" variant="flat" @click="nextStep"
                                        :loading="this.loadingAddIncomes">Siguiente</v-btn>
                                </v-row>
                            </v-container>
                        </template>
                        <!--okk-->
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
                                                                <v-icon icon="mdi-account-cog" color="#F18254"
                                                                    size="large"></v-icon>
                                                            </v-avatar>
                                                        </template>
                                                        <template v-slot:title>
                                                            <span class="font-weight-black">Datos del Administrador</span>
                                                        </template>
                                                        <v-card-text class="bg-white pt-4">
                                                            <v-row dense align="center">
                                                                <v-col cols="12" md="6">
                                                                    <span class="text-body-1 font-weight-bold">Dinero en Caja: </span>
                                                                </v-col>
                                                                <v-col cols="12" md="6" class="text-right">
                                                                    <span
                                                                        class="text-body-1 font-weight-bold text-black">$ {{
                                                                        formatNumber(editedItem.available_money)
                                                                        }}</span>
                                                                </v-col>
                                                            </v-row>
                                                            <!--<v-row dense align="center">
                                                                <v-col cols="12" md="6">
                                                                    <span class="text-body-1 font-weight-bold">Utilidad: $</span>
                                                                </v-col>
                                                                <v-col cols="12" md="6" class="text-right">
                                                                
                                                                    <span
                                                                       :class="`text-body-1 font-weight-bold ${editedItem.client_utility >= 0 ? 'text-black' : 'text-red'
                                                                        }`">{{
                                                                        formatNumber(editedItem.client_utility)
                                                                        }}</span>
                                                                </v-col>
                                                            </v-row>-->
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                                <v-col cols="12" md="4">
                                                    <v-card class="mx-2" subtitle="Datos arrojados por el sistema"
                                                        style="background-color: #F18254; color: white;" elevation="4">
                                                        <template v-slot:prepend>
                                                            <v-avatar color="white">
                                                                <v-icon icon="mdi-server" color="#F18254"
                                                                    size="large"></v-icon>
                                                            </v-avatar>
                                                        </template>
                                                        <template v-slot:title>
                                                            <span class="font-weight-black">Datos Aplicación</span>
                                                        </template>
                                                        <v-card-text class="bg-white pt-4">

                                                            <v-row dense align="center">
                                                                <v-col cols="12" md="6">
                                                                    <span class="text-body-1 font-weight-bold">Ingresos:
                                                                        </span>
                                                                </v-col>
                                                                <v-col cols="12" md="6" class="text-right">
                                                                    <span
                                                                        class="text-body-1 font-weight-bold text-black">$ {{
                                                                        formatNumber(editedItem.system_incomes)
                                                                        }}</span>
                                                                </v-col>
                                                            </v-row>

                                                            <v-row dense align="center">
                                                                <v-col cols="12" md="6">
                                                                    <span class="text-body-1 font-weight-bold">Utilidad:
                                                                        </span>
                                                                </v-col>
                                                                <v-col cols="12" md="6" class="text-right">
                                                                    <span
                                                                        class="text-body-1 font-weight-bold text-black">$ {{
                                                                        formatNumber(editedItem.utility)
                                                                        }}</span>
                                                                </v-col>
                                                            </v-row>
                                                            <v-row dense align="center">
                                                                <v-col cols="12" md="6">
                                                                    <span class="text-body-1 font-weight-bold">Gastos:
                                                                        </span>
                                                                </v-col>
                                                                <v-col cols="12" md="6" class="text-right">
                                                                    <span
                                                                        class="text-body-1 font-weight-bold text-black">$ {{
                                                                        formatNumber(editedItem.spent)
                                                                        }}</span>
                                                                </v-col>
                                                            </v-row>
                                                            <v-row dense align="center">
                                                                <v-col cols="12" md="6">
                                                                    <span
                                                                        class="text-body-1 font-weight-bold">Retención:
                                                                        </span>
                                                                </v-col>
                                                                <v-col cols="12" md="6" class="text-right">
                                                                    <span
                                                                        class="text-body-1 font-weight-bold text-black">$ {{
                                                                        formatNumber(editedItem.retention)
                                                                        }}</span>
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
                                                                <v-icon icon="mdi-scale-balance" color="#F18254"
                                                                    size="large"></v-icon>
                                                            </v-avatar>
                                                        </template>
                                                        <template v-slot:title>
                                                            <span class="font-weight-black">Diferencias</span>
                                                        </template>
                                                        <v-card-text class="bg-white pt-4">


                                                            <v-row dense align="center">
                                                                <v-col cols="12" md="6">
                                                                    <span
                                                                        class="text-body-1 font-weight-bold">Diferencias:
                                                                        </span>
                                                                </v-col>
                                                                <v-col cols="12" md="6" class="text-right">
                                                                    <span :class="`text-body-1 font-weight-bold ${editedItem.differences >= 0 ? 'text-black' : 'text-red'
                                                                        }`">$ 
                                                                        {{ formatNumber(editedItem.differences)
                                                                        }}
                                                                    </span>
                                                                </v-col>
                                                            </v-row>
                                                            <!--<v-row dense align="center">
                                                                <v-col cols="12" md="6">
                                                                    <span class="text-body-1 font-weight-bold">Utilidad:
                                                                        $</span>
                                                                </v-col>
                                                                <v-col cols="12" md="6" class="text-right">
                                                                    <span :class="`text-body-1 font-weight-bold ${editedItem.difference_utility >= 0 ? 'text-black' : 'text-red'
                                                                        }`">
                                                                        {{ formatNumber(editedItem.difference_utility)
                                                                        }}
                                                                    </span>
                                                                </v-col>
                                                            </v-row>-->

                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                            </v-row>
                                            <v-row v-if="editedItem.differences !== 0">
                                                <v-col cols="12" md="12">
                                                    <v-row class="mb-4 mt-2 text-left" dense no-gutters>

                                                        <v-col cols="12" md="12">
                                                            <span class="text-h6 ml-6" :class="{
                                                                'text-red': editedItem.differences < 0,
                                                                'text-green': editedItem.differences > 0
                                                            }">Existe una diferencia total de: </span>
                                                            <span :class="`text-body-1 font-weight-bold ${editedItem.differences > 0 ? 'text-green' : 'text-red'
                                                                }`">
                                                                {{ formatNumber(editedItem.differences) }}
                                                            </span>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row class="mb-4 mt-1" dense no-gutters>
                                                        <v-col cols="12" md="12" class="text-center ml-2">
                                                            <v-textarea v-model="editedItem.description"
                                                                label="¿Por qué?" variant="solo" density="compact"
                                                                :rules="descriptionRules"></v-textarea>
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
                                    <v-btn color="#E7E9E9" variant="flat" @click="prevStep" :disabled="loadingSave">
                                        Volver
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn color="#E7E9E9" variant="flat" @click="salir()" class="mx-2"
                                        :disabled="loadingSave">
                                        Salir
                                    </v-btn>
                                    <v-btn color="#E7E9E9" variant="flat" @click="saveMonthlyClosure"
                                        :loading="loadingSave" :disabled="!valid">
                                        Guardar
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
                <v-text-field v-model="newIncome.name" variant="underlined" label="Destino"
                    prepend-icon="mdi-cash-check"></v-text-field>
                <v-text-field :model-value="formatNumberInput(newIncome.amount)"
                    @update:model-value="newIncome.amount = parseNumberInput($event)" variant="underlined" label="Monto"
                    prepend-icon="mdi-currency-usd" @keypress="onlyNumbers">
                </v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="dialogIncomes = false">
                    Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" :disabled="!newIncome.name || !newIncome.amount"
                    :loading="loadingAddIncomes" @click="addIncome">
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
                <v-text-field v-model="newExpense.name" variant="underlined" label="Destino"
                    prepend-icon="mdi-chart-box-outline"></v-text-field>
                <v-text-field v-model="newExpense.amount" variant="underlined" label="Monto" type="number" min="0"
                    prepend-icon="mdi-currency-usd"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="dialogExpenses = false">
                    Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" :disabled="!newExpense.name || !newExpense.amount"
                    :loading="loadingAddExpenses" @click="addExpense">
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
import _ from 'lodash';

export default {

    data: () => {
        const currentDate = new Date();
        const currentDay = currentDate.getDate(); // Día actual del mes
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
        // Determinar qué meses mostrar según el día actual
        let availableMonths = [];
        if (currentDay <= 10) {
            // Si es antes o igual al día 10, mostrar mes anterior y actual
            availableMonths = [
                {
                    value: ('0' + previousMonth).slice(-2),
                    title: `${monthNames[previousMonth]}`
                },
                {
                    value: ('0' + currentMonth).slice(-2),
                    title: `${monthNames[currentMonth]}`
                }
            ];
        } else {
            // Si es después del día 10, solo mostrar mes actual
            availableMonths = [
                {
                    value: ('0' + currentMonth).slice(-2),
                    title: `${monthNames[currentMonth]}`
                }
            ];
        }
        return {
            originalIncomeAmount: 0,
            currentEditingIncome: null,
            originalValue: 0,
            originalExpenseAmount: 0,
            originalClientRetention: 0,
            currentEditingExpense: null,
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
            months: availableMonths, // Usamos el array calculado
            selectedYear: previousMonth === 12 ? previousYear : currentYear, // Ajuste de año
            selectedMounth: currentDay <= 10 ? ('0' + previousMonth).slice(-2) : ('0' + currentMonth).slice(-2),
            headers: [
                { title: 'Realizado', key: 'data', sortable: true },
                { title: 'Mes', key: 'month', sortable: true },
                { title: 'Nombre', key: 'displayName', sortable: true },
                { title: 'Diferencia', key: 'differences', sortable: true },
                { title: 'Tipo', key: 'type', sortable: true, },
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
                system_incomes: 0,
                spent: 0,
                discounts: 0,
                description: '',
                differences: 0,
                incomes: [
                    { id: 1, type: 'cash', amount: 0, name: 'Efectivo', },
                    { id: 2, type: 'bank', amount: 0, name: 'Banco', },
                    { id: 3, type: 'debit', amount: 0, name: 'Débito por caer', }, // ID único
                ],
                expenses: [
                    { id: 1, type: 'debitexpense', amount: 0, name: 'Comisión Débito', },
                    { id: 2, type: 'retention', amount: 0, name: 'Retenciones', },
                ],
                user_id: '',
                client_utility: 0,
                client_retention: 0,
                difference_incomes: 0,
                difference_utility: 0,
                difference_retention: 0,
                difference_spent: 0,
            },
            originalItem: {
                id: '',
                branch_id: '',
                business_id: '',
                data: '',
                available_money: 0,
                utility: 0,
                net_utility: 0,
                retention: 0,
                system_incomes: 0,
                spent: 0,
                discounts: 0,
                differences: 0,
                description: '',
                incomes: [
                    { id: 1, type: 'cash', amount: 0, name: 'Efectivo', },
                    { id: 2, type: 'bank', amount: 0, name: 'Banco', },
                    { id: 3, type: 'debit', amount: 0, name: 'Débito por caer', }, // ID único
                ],
                expenses: [
                    { id: 1, type: 'debitexpense', amount: 0, name: 'Comisión Débito', },
                    { id: 2, type: 'retention', amount: 0, name: 'Retenciones', },
                ],
                user_id: '',
                client_utility: 0,
                client_retention: 0,
                difference_incomes: 0,
                difference_utility: 0,
                difference_retention: 0,
                difference_spent: 0,
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
                system_incomes: 0,
                spent: 0,
                discounts: 0,
                differences: 0,
                description: '',
                incomes: [
                    { id: 1, type: 'cash', amount: 0, name: 'Efectivo', },
                    { id: 2, type: 'bank', amount: 0, name: 'Banco', },
                    { id: 3, type: 'debit', amount: 0, name: 'Débito por caer', }, // ID único
                ],
                expenses: [
                    { id: 1, type: 'debitexpense', amount: 0, name: 'Comisión Débito', },
                    { id: 2, type: 'retention', amount: 0, name: 'Retenciones', },
                ],
                user_id: '',
                client_utility: 0,
                client_retention: 0,
                difference_incomes: 0,
                difference_utility: 0,
                difference_retention: 0,
                difference_spent: 0,
            },
            newIncome: {
                id: null,
                name: '',
                amount: 0,
                type: 'insert'
            },
            newExpense: {
                id: null,
                name: '',
                amount: 0,
                type: 'insert'
            },
            dialogIncomes: false,
            dialogExpenses: false,
            dialogDeleteIncome: false,
            dialogDeleteExpense: false,
            dialogDelete: false,
            dialogMontlyClousure: false,
             descriptionRules: [
      (v) => !!v || "El campo es obligatorio", // Campo requerido
      (v) => (v && v.length <= 500) || "Máximo 500 caracteres", // Límite de caracteres
    ],
        }
        
    },

    computed: {
        /*totalCalculado() {
            return (parseFloat(this.editedItem.retention) || 0) +
                (parseFloat(this.editedItem.utility) || 0);
        },*/

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
        'editedItem.available_money': {
            handler(newVal) {
                //this.updateClientUtility();
                this.calculateDifferences();
                //this.calculateDifferencesUtility();
            },
            deep: true
        },
        /*'editedItem.discounts': {
            handler(newVal) {
                //this.updateClientUtility();
                this.calculateDifferencesSpent();
            },
            deep: true
        },*/
        'editedItem.utility': {
            handler(newVal) {
                this.calculateDifferences();
            },
            immediate: true
        },
        /*'editedItem.spent': {
            handler(newVal) {
                //this.updateClientUtility();
                this.calculateDifferencesSpent();
            },
            immediate: true
        },*/
        /*'editedItem.utility': {
            handler(newVal) {
                this.calculateDifferencesUtility();
            },
            immediate: true
        },*/
        /*'editedItem.client_utility': {
            handler(newVal) {
                this.calculateDifferencesUtility();
            },
            immediate: true
        },*/
        /*'editedItem.client_retention': {
            handler(newVal) {
                this.calculateDifferencesRetention();
            },
            immediate: true
        },*/
        /*'editedItem.retention': {
            handler(newVal) {
                this.calculateDifferencesRetention();
                //this.calculateDifferencesUtility();
            },
            immediate: true
        },*/
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
        onlyNumbers(event) {
    const key = event.key;
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
                        '.', 'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'];
    
    if (!allowedKeys.includes(key)) {
      event.preventDefault();
    }
  },
        formatNumberInput(value) {
    if (!value) return ''
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
  
  // Parsea el número para guardarlo sin formato
  parseNumberInput(formattedValue) {
    if (!formattedValue) return null
    return Number(formattedValue.toString().replace(/\./g, ''))
  },
        getDifferenceColor(difference) {
            if (difference < 0) {
            return '#F18254'; // Rojo para valores negativos
            } else if (difference > 0) {
            return 'green-lighten-4'; // Verde para valores positivos
            } else {
            return 'grey-lighten-2'; // Gris para cero
            }
        },
        areArraysDifferent(originalArray, editedArray) {
            // Ordenar ambos arrays por un campo único (por ejemplo, `id`)
            const sortedOriginal = [...originalArray].sort((a, b) => a.id - b.id);
            const sortedEdited = [...editedArray].sort((a, b) => a.id - b.id);

            // Comparar las cadenas generadas
            return JSON.stringify(sortedOriginal) !== JSON.stringify(sortedEdited);
        },
        //ok utilitys
        /*updateClientUtility() {
            this.editedItem.client_utility = (parseFloat(this.editedItem.available_money) || 0) -
                ((parseFloat(this.editedItem.spent) + parseFloat(this.editedItem.retention)) || 0);
        },*/
        //ok diferences
        calculateDifferences() {
            const available = parseFloat(this.editedItem.available_money) || 0;
            const systemUtility = parseFloat(this.editedItem.utility) || 0;
            const retentions = parseFloat(this.editedItem.retention) || 0;
            this.editedItem.difference_incomes = available - (systemUtility + retentions);
            this.editedItem.differences = available - (systemUtility + retentions);
        },
        /*calculateDifferencesSpent() {
            const discounts = parseFloat(this.editedItem.discounts) || 0;
            const spent = parseFloat(this.editedItem.spent) || 0;
            this.editedItem.difference_spent = discounts - spent;
        },*/
        /*calculateDifferencesUtility() {
            const clientUtility = parseFloat(this.editedItem.client_utility) || 0;
            const utility = parseFloat(this.editedItem.utility) || 0;
            this.editedItem.difference_utility = clientUtility - utility;
            this.editedItem.differences = clientUtility - utility;
        },*/
        /*calculateDifferencesUtility() {
            const client_utility = parseFloat(this.editedItem.client_utility) || 0;
            //console.log('Utilidades cliente:', client_utility);
            const utility = parseFloat(this.editedItem.utility) || 0;
            //console.log('Utilidades sistema:', utility);
            const retention = parseFloat(this.editedItem.retention) || 0;
            //console.log('Retenciones sistema:', retention);
            this.editedItem.difference_utility = client_utility - (utility - retention);
            this.editedItem.differences = client_utility - (utility - retention);
            //console.log('diferencia en utilidades:', this.editedItem.difference_utility);
        },*/
        /*calculateDifferencesRetention() {
            const clientRetention = parseFloat(this.editedItem.client_retention) || 0;
            const retention = parseFloat(this.editedItem.retention) || 0;
            this.editedItem.difference_retention = clientRetention - retention;
        },*/
        // Para actualizar ingresos (incomes)
        updateIncome(income, newAmount) {
           
            let oldAmount = parseFloat(income.amount) || 0;
            let formatnewAmount = this.parseNumberInput(newAmount);
            let difference = formatnewAmount - oldAmount;

            if (difference === 0) return;

            // Actualizar el monto en el gasto
            income.amount = formatnewAmount;

            // Actualizar discounts
            this.editedItem.available_money = (parseFloat(this.editedItem.available_money) || 0) + difference;

        },
        addIncome() {
        const newId = Date.now();
        const amount = parseFloat(this.parseNumberInput(this.newIncome.amount)) || 0;

        const income = {
            id: newId,
            type: this.newIncome.type,
            amount: amount,
            name: this.newIncome.name
        };

        // Agregar al array de incomes
        this.editedItem.incomes.push(income);

        // Actualizar available_money
        this.editedItem.available_money = (parseFloat(this.editedItem.available_money) || 0) + amount;

        // Resetear formulario
        this.newIncome = { id: null, name: '', amount: 0, type: '' };
        this.dialogIncomes = false;
        },
        // Para actualizar gastos (expenses)
        updateExpense(expense, newAmount) {
            newAmount = parseFloat(newAmount) || 0;
            let oldAmount = parseFloat(expense.amount) || 0;
            let difference = newAmount - oldAmount;

            if (difference === 0) return;

            // Actualizar el monto en el gasto
            expense.amount = newAmount;

            // Actualizar discounts
            this.editedItem.discounts = (parseFloat(this.editedItem.discounts) || 0) + difference;

            // Si es retención, actualizar client_retention
            if (expense.type === 'retention') {
                this.editedItem.client_retention = newAmount;
            }
        },
        // Para agregar nuevos gastos
        addExpense() {
            const newId = Date.now();
            const amount = parseFloat(this.newExpense.amount) || 0;

            const expense = {
                id: newId,
                type: this.newExpense.type,
                amount: amount,
                name: this.newExpense.name,
            };

            // Agregar al array de expenses
            this.editedItem.expenses.push(expense);

            // Actualizar discounts
            this.editedItem.discounts = (parseFloat(this.editedItem.discounts) || 0) + amount;

            // Si es retención, actualizar client_retention
            if (expense.type === 'retention') {
                this.editedItem.client_retention = amount;
            }

            // Resetear formulario
            this.newExpense = { id: null, name: '', amount: 0, type: '' };
            this.dialogExpenses = false;
        },

        // Para eliminar ingresos
        removeIncome(income) {
            const amount = parseFloat(income.amount) || 0;

            // Restar de available_money
            this.editedItem.available_money = (parseFloat(this.editedItem.available_money) || 0) - amount;

            // Eliminar del array
            this.editedItem.incomes = this.editedItem.incomes.filter(i => i.id !== income.id);

        },

        // Para eliminar gastos
        removeExpense(expense) {
            const amount = parseFloat(expense.amount) || 0;

            // Restar de discounts
            this.editedItem.discounts = (parseFloat(this.editedItem.discounts) || 0) - amount;

            // Si es retención, resetear client_retention
            if (expense.type === 'retention') {
                this.editedItem.client_retention = 0;
            }

            // Eliminar del array
            this.editedItem.expenses = this.editedItem.expenses.filter(e => e.id !== expense.id);

        },
        async loadClosureData() {
            const month = `${this.selectedYear}-${String(this.selectedMounth).padStart(2, '0')}`;
            console.log('month seleccionado');
            console.log(month);
            let foundClosure = this.closures.find(closure => {
                const closureMonth = closure.month?.toString().trim();
                return closureMonth === month;
            });

            /*const safeParse = (data) => {
                if (Array.isArray(data)) return data;
                if (typeof data !== 'string') return [];
                try {
                    return JSON.parse(data || '[]');
                } catch (e) {
                    console.error('Error al parsear:', e);
                    return [];
                }
            };*/
            console.log('foundClosure');
            console.log(foundClosure);
            if(foundClosure){
                //this.editedItem = Object.assign({}, foundClosure);
                //this.originalItem = Object.assign({}, foundClosure);
                this.originalItem = _.cloneDeep(foundClosure);
                this.editedItem = _.cloneDeep(foundClosure);
            }else{
                //this.editedItem = Object.assign({}, this.defaultEditedItem);
                //this.originalItem = Object.assign({}, this.defaultEditedItem);
                this.originalItem = _.cloneDeep(this.defaultEditedItem);
                this.editedItem = _.cloneDeep(this.defaultEditedItem); 
            }
            console.log('this.editedItem');
            console.log(this.editedItem);
            /*this.editedItem = foundClosure
                ? {
                    ...foundClosure,
                    incomes: safeParse(foundClosure.incomes),
                    expenses: safeParse(foundClosure.expenses)
                }
                : { ...this.defaultEditedItem,
                    incomes: this.defaultEditedItem.incomes,
                    expenses: this.defaultEditedItem.expenses };

                this.originalItem = foundClosure
                ? {
                    ...foundClosure,
                    incomes: safeParse(foundClosure.incomes),
                    expenses: safeParse(foundClosure.expenses)
                }
                : { ...this.defaultEditedItem,
                    incomes: this.defaultEditedItem.incomes,
                    expenses: this.defaultEditedItem.expenses  };*/
        },
        formatMonth(dateString) {
            if (!dateString) return '';

            const [year, month] = dateString.split('-');
            const monthNames = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];

            const monthIndex = parseInt(month) - 1;
            if (monthIndex >= 0 && monthIndex < 12) {
                return `${monthNames[monthIndex]} ${year}`;
            }
            return dateString;
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
        async onBranchChangeAdd(newVal) {
            if (newVal) {
                this.type = 'Branch';
                await this.initialize();
            }
        },
        /*calcularUtilidadFinal() {
            const available = parseFloat(this.editedItem.available_money) || 0;
            const discounts = parseFloat(this.editedItem.discounts || 0);
            const retention = parseFloat(this.editedItem.retention) || 0;
            this.editedItem.net_utility = available - retention - discounts;
        },*/
        /*calcularDiferencias() {
            this.editedItem.differences = (parseFloat(this.editedItem.available_money)) - ((parseFloat(this.editedItem.retention) || 0) +
                (parseFloat(this.editedItem.utility) || 0)) || 0;
        },*/
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
            await this.initialize();
            this.step = 1;
            this.dialogMontlyClousure = true;
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
                    this.editedItem.utility = Number(result.data.utility);
                    this.editedItem.retention = Number(result.data.retentions_total);
                    this.editedItem.spent = Number(result.data.spent);
                    this.editedItem.system_incomes = Number(result.data.system_incomes);
                    this.finance_ids = result.data.finance_ids;
                    this.retention_ids = result.data.retention_ids;
                    console.log('this.editedItem');
                    console.log(this.editedItem);
                } else {
                    // Si no hay datos, asignamos un array vacío
                    this.editedItem.utility = 0;
                    this.editedItem.retention = 0;
                    this.editedItem.spent = 0;
                    this.editedItem.system_income = 0;
                    this.finance_ids = [];
                    this.retention_ids = [];
                }
            } catch (error) {
                this.utility = 0;
                this.editedItem.spent = 0;
                this.editedItem.system_income = 0;
                this.editedItem.retention = 0;
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
            if (this.step === 1) {
                
                const fieldsToUpdate = ['incomes', 'expenses', 'available_money', 'discounts', 'client_retention'];
                const updatedFields = Object.keys(this.editedItem)
                    .filter((key) => {
                        const isDifferent = fieldsToUpdate.includes(key) && (
                            key !== 'incomes' && key !== 'expenses'
                                ? JSON.stringify(this.editedItem[key]) !== JSON.stringify(this.originalItem[key])
                                : this.areArraysDifferent(this.originalItem[key], this.editedItem[key])
                        );
                        if (isDifferent) console.log(`Campo diferente: ${key}`);
                        return isDifferent;
                    })
                    .reduce((obj, key) => ({ ...obj, [key]: this.editedItem[key] }), {});
        if (Object.keys(updatedFields).length > 0)
        {
            console.log('Object.keys(updatedFields).length');
            console.log(Object.keys(updatedFields).length);
            this.editedItem.branch_id = this.type === 'Branch' ? this.branch_id : null;
                this.editedItem.business_id = this.type === 'Business' ? this.business_id : null;
                this.loadingAddIncomes = true;
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
                    this.loadingAddIncomes = false;
                } else {
                    //this.loadingBonus = true;
                    //this.dialogMontlyClousure = false;
                    this.showAlert("warning", result.message, 3000);
                    this.loadingAddIncomes = false;
                }
            } catch (error) {
                this.loadingAddIncomes = false;
                // Este bloque captura errores inesperados fuera del manejo estándar
                this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
            } finally {
                //this.close();
                this.dialogIncomes = false;
                this.loadingAddIncomes = false;
                this.showAlert("success", "Datos Actualizados correctamente.", 3000);
                await this.initialize();
                await this.utilityMonthlyClosure();
            }
        }else{
            console.log('No hubo cambios');
        }
                /**/
            }
            if (this.step < this.items.length) {
                this.step++;
            }

            if (this.step === 2) {
                
                await this.utilityMonthlyClosure();
            }

            console.log('Aqui se muestran los Step');
            console.log(this.step);
            //this.verificateStep(this.step);

        },
        salir(){
            this.dialogMontlyClousure = false;
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
                this.showAlert("success", "Cierre de mes efectuado correctamente", 3000);
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