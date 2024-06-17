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
                <v-col cols="12" md="4"></v-col>
                <v-col cols="12" md="2">
                
                    <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
                            <v-toolbar color="#F18254">
                                <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
                            </v-toolbar>
                        <v-card>
                            <v-tabs v-model="tabBar" color="rgb(241, 130, 84)"
                            elevation="6"><!-- @click="handleTabChange"-->
                            <v-tab value="one">Pago de carros</v-tab>
                            <v-tab value="two">Pago de docencia</v-tab>
                        </v-tabs>
                        <v-card-text>
                            <v-window v-model="tabBar">
                        <v-window-item value="one">
                                    <v-card>
                            <v-card-text>
                                <v-form ref="form" v-model="valid" enctype="multipart/form-data">
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" md="3">
                                                <v-select label="Tipo de pago" v-model="editedItem.type"
                                                    :items="['Adelanto', 'Quincena', 'Mes']"
                                                    :item-value="['Adelanto', 'Quincena', 'Mes']" variant="underlined"
                                                    :rules="selectRules"
                                                    prepend-icon="mdi-check-circle"></v-select><!--:disabled="!this.mostrarType"-->
                                            </v-col>
                                            
                                            <v-col cols="12" md="4"></v-col>
                                            <!--<v-col cols="12" md="4">
                                                    <v-text-field v-model="editedItem.amount" clearable label="Monto"
                                                        prepend-icon="mdi-cash" variant="underlined" :rules="pago1">
                                                    </v-text-field>
                                                </v-col>-->
                                            <v-col cols="12" md="5">
                                                <v-card class="mx-auto" max-width="344" title="Monto a Pagar"
                                                    :subtitle="this.formatNumber(totalMount())" append-icon="mdi-check"
                                                    v-if="this.mostrarCars">

                                                    <template v-slot:prepend>
                                                        <v-avatar color="blue-darken-2">
                                                            <v-icon icon="mdi-currency-usd"></v-icon>
                                                        </v-avatar>
                                                    </template>
                                                </v-card>
                                                </v-col>
                                        </v-row>
                                        <v-row>

                                            <v-col cols="12" md="12" v-if="mostrarCars">
                                                <v-text-field class="mt-1 mb-1" v-model="search2"
                                                    append-icon="mdi-magnify" label="Buscar" single-line
                                                    hide-details></v-text-field>
                                                <v-data-table v-model="selected2" :headers="headers2"
                                                    :items-per-page-text="'Elementos por páginas'" :search="search2"
                                                    :items="cars" class="elevation-1"
                                                    no-results-text="No hay datos disponibles"
                                                    no-data-text="No hay datos disponibles" 
                                                    item-selectable="selectable" show-select
                                                    >
                                                    <template v-slot:item.clientName="{ item }">
                                                        <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                                                            <v-img
                                                                :src="'https://api2.simplifies.cl/api/images/' + item.client_image"
                                                                alt="image"></v-img>
                                                        </v-avatar>
                                                        {{ item.clientName }}
                                                    </template>
                                                    <template v-slot:item.meta="{ item }">
                                                        <div class="text-center" v-html="formatMeta(item.meta)"></div>
                                                    </template>
                                                    <template v-slot:item.pay="{ item }">                                                    
                                                        {{ formatNumber(Number(item.totalServices) + Number(item.tip)) }}
                                                    </template>
                                                    <template v-slot:item.totalServices ="{ item }">
                         {{ formatNumber(item.totalServices)}}
                                    </template>
                                    <template v-slot:item.amountGenerate ="{ item }">
                         {{ formatNumber(item.amountGenerate)}}
                                    </template>
                                    <template v-slot:item.tip ="{ item }">
                         {{ formatNumber(item.tip)}}
                                    </template>
                                                </v-data-table>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                    <v-divider></v-divider>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="#E7E9E9" variant="flat" @click="close">
                                            Cancelar
                                        </v-btn>
                                        <v-btn color="#F18254" variant="flat" @click="save" :disabled="!valid || !selected2.length>0">
                                            Pagar
                                        </v-btn>
                                    </v-card-actions>
                                </v-form>
                            </v-card-text>
                        </v-card>
                                </v-window-item>

                        <v-window-item value="two">
                                    <v-card>
                            <v-card-text>
                                <v-form ref="form" v-model="valid" enctype="multipart/form-data">
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" md="3">
                                                <v-select label="Tipo de pago" v-model="editedItem.academia"
                                                    :items="['Pago Academia']"
                                                    :item-value="['Pago Academia']" variant="underlined"
                                                    :rules="selectRules"
                                                    prepend-icon="mdi-check-circle"></v-select><!--:disabled="!this.mostrarType"-->
                                            </v-col>
                                            <v-col cols="12" md="4">
                                                    <v-text-field v-model="editedItem.amountAcadem" clearable label="Monto"
                                                        prepend-icon="mdi-cash" variant="underlined" :rules="[...pago, validateAmount]">
                                                    </v-text-field>
                                                </v-col>
                                            <!--<v-col cols="12" md="5">
                                                <v-card class="mx-auto" max-width="344" title="Monto a Pagar"
                                                    :subtitle="this.formatNumber(totalMount())" append-icon="mdi-check"
                                                    v-if="this.mostrarCars">

                                                    <template v-slot:prepend>
                                                        <v-avatar color="blue-darken-2">
                                                            <v-icon icon="mdi-currency-usd"></v-icon>
                                                        </v-avatar>
                                                    </template>
                                                </v-card>
                                                </v-col>-->
                                        </v-row>
                                        <v-row>
                                                <v-col cols="12" md="12" v-if="mostrarDoc">
                                                    <v-text-field class="mt-1 mb-1" v-model="search2"
                                                    append-icon="mdi-magnify" label="Buscar" single-line
                                                    hide-details></v-text-field>
                                                <v-data-table v-model="selectedCourse" :headers="headers4"
                                                    :items-per-page-text="'Elementos por páginas'" :search="search4"
                                                    :items="courses" class="elevation-1"
                                                    no-results-text="No hay datos disponibles"
                                                    no-data-text="No hay datos disponibles" select-strategy="single" show-select>
                                                    <template v-slot:item.price="{ item }">
                {{ formatNumber(parseInt(item.price))}}                                  
                                          </template>
                                                </v-data-table>
                                                </v-col>
                                                </v-row>
                                        </v-container>
                                        <v-divider></v-divider>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="#E7E9E9" variant="flat" @click="close">
                                            Cancelar
                                        </v-btn>
                                        <v-btn color="#F18254" variant="flat" @click="saveCourse" :disabled="(!valid || !selectedCourse.length)">
                                            Pagar
                                        </v-btn>
                                    </v-card-actions>
                                        </v-form>
                                        </v-card-text>
                                        </v-card>
                                    </v-window-item>

                            </v-window>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>

                            <v-toolbar color="red">
                                <span class="text-subtitle-2 ml-4"> Eliminar Pago a Profesional</span>
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
            <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :search="search"
                :items="results" class="elevation-1" no-results-text="No hay datos disponibles"
                no-data-text="No hay datos disponibles">
                <template v-slot:item.name="{ item }">

                    <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                        <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_url" alt="image"></v-img>
                    </v-avatar>
                    {{ item.name }}
                </template>
                <template v-slot:item.actions="{ item }">
                    <!--<v-btn density="comfortable" icon="mdi-pencil" @click="editItem(item)" color="primary"
                        variant="tonal" elevation="1" class="mr-1 mt-1 mb-1" title="Editar Pago a profesional"></v-btn>-->
                    <v-btn density="comfortable" icon="mdi-account-cash" @click="pagoProfessional(item)" color="primary"
                        variant="tonal" elevation="1" title="Pago a profesional"></v-btn>
                    <!--<v-icon size="25" color="blue" class="me-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon size="25" color="red" @click="deleteItem(item)">
              mdi-delete
            </v-icon>-->
                </template>
            </v-data-table>
        </v-card-text>

        <!--Barbero y encargado-->
        <v-dialog v-model="dialogBarberoEncargado" fullscreen transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar color="#F18254">
                    <span class="text-subtitle-1 ml-4">Pagos realizados</span>
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
                <v-container>
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
            <v-card class="pa-2" elevation="2"  @click="filterResults('Bono convivencias')">
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
            <v-card class="pa-2" elevation="2"  @click="filterResults('Bono servicios')">
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
            <v-card class="pa-2" elevation="2"  @click="filterResults('Bono productos')">
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
                    <v-data-table :headers="headers3" :items="professionalPayment" :search="search3" class="elevation-1"
                        :items-per-page-text="'Elementos por páginas'" no-results-text="No hay datos disponibles"
                        no-data-text="No hay datos disponibles">
                        <template v-slot:item.date="{ item }">
                            <span :class="{ 'bold-row': item.date == 'Total' }">
                                {{ item.date }}
                            </span>
                        </template>
                        <template v-slot:item.amount="{ item }">
                {{ formatNumber(parseInt(item.amount))}}                                  
                                          </template>
                        <template v-slot:item.actions="{ item }">
                            <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)"
                                color="red-darken-4" variant="tonal" elevation="1"
                                title="Eliminar Pago a profesional"></v-btn>
                        </template>

                    </v-data-table>
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
        <v-dialog v-model="dialogOtros" max-width="600px">
            <v-card>
                <v-toolbar color="#F18254">
                    <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
                </v-toolbar>
                <v-card-text>
                    <v-form ref="form" v-model="valid" enctype="multipart/form-data">
                        <v-container>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-select label="Tipo de pago" v-model="editedItem.type"
                                        :items="['Adelanto', 'Quincena', 'Mes']"
                                        :item-value="['Adelanto', 'Quincena', 'Mes']" variant="underlined"
                                        :rules="selectRules"
                                        prepend-icon="mdi-check-circle"></v-select><!--:disabled="!this.mostrarType"-->
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="editedItem.amount" clearable label="Monto"
                                        prepend-icon="mdi-cash" variant="underlined" :rules="pago">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="#E7E9E9" variant="flat" @click="close">
                                Cancelar
                            </v-btn>
                            <v-btn color="#F18254" variant="flat" @click="saveOtros" :disabled="!valid">
                                Aceptar
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
                    <span class="text-subtitle-1 ml-4">Pagos realizados cajero (a)</span>
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
                <v-container>
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
                                <v-data-table :headers="headers5" :items-per-page-text="'Elementos por páginas'"
                                    :items="results1" :search="search5" class="elevation-2"
                                    no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">
                                    <template v-slot:item.date="{ item }">
                                        <span :class="{ 'bold-row': item.date == 'Total' }">
                                            {{ item.date }}
                                        </span>
                                    </template>
                                    
                                    <template v-slot:item.amount="{ item }">
                {{ formatNumber(parseInt(item.amount))}}                                  
                                          </template>
                                          <template v-slot:item.coffe_percent="{ item }">
                {{ formatNumber(parseInt(item.coffe_percent))}}                                  
                                          </template>
                                    <template v-slot:item.actions="{ item }">
                                        <v-btn density="comfortable" icon="mdi-delete" @click="deleteItemCashier(item)"
                                            color="red-darken-4" variant="tonal" elevation="1"
                                            title="Eliminar Pago a profesional"></v-btn>
                                    </template>
                                </v-data-table>
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
                    <span class="text-subtitle-2 ml-4"> Eliminar Pago a Professional</span>
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
                    <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
                </v-toolbar>
                <v-card-text>
                    <v-card>
                        <v-tabs v-model="tabBarCashier" color="rgb(241, 130, 84)"
                            elevation="6"><!-- @click="handleTabChange"-->
                            <v-tab value="one">Pago de Ppropinas</v-tab>
                            <v-tab value="two">Pago de venta de productos</v-tab>
                        </v-tabs>
                        <v-card-text>
                            <v-window v-model="tabBarCashier">
                        <v-window-item value="one">
                                    <v-card>
                                        <v-card-text>
                                            <v-form ref="form" v-model="valid" enctype="multipart/form-data">
                        <v-container>
                            <v-row>
                                <v-col cols="12" md="3">
                                    <v-select label="Tipo de pago" v-model="editedItem.type"
                                        :items="['Adelanto', 'Quincena', 'Mes']"
                                        :item-value="['Adelanto', 'Quincena', 'Mes']" variant="underlined"
                                        :rules="selectRules"
                                        prepend-icon="mdi-check-circle"></v-select><!--:disabled="!this.mostrarType"-->
                                </v-col>
                                <v-col cols="12" md="4">
                                                    <v-text-field v-model="editedItem.amount" clearable label="Monto"
                                                        prepend-icon="mdi-cash" variant="underlined" :rules="pago1">
                                                    </v-text-field>
                                                </v-col>
                                <v-col cols="12" md="5">
                                    <v-card class="mx-auto" max-width="344" title="Monto a Pagar"
                                        :subtitle="this.formatNumber(totalMount1())" append-icon="mdi-check">

                                        <template v-slot:prepend>
                                            <v-avatar color="blue-darken-2">
                                                <v-icon icon="mdi-currency-usd"></v-icon>
                                            </v-avatar>
                                        </template>
                                    </v-card>
                                </v-col>
                            </v-row>
                            <v-row>

                                <v-col cols="12" md="12">
                                <v-container>
                                    <v-text-field class="mt-1 mb-1" v-model="search6" append-icon="mdi-magnify"
                                        label="Buscar" single-line hide-details></v-text-field>
                                    <v-data-table v-model="selected2" :headers="headers6"
                                        :items-per-page-text="'Elementos por páginas'" :search="search6" :items="cars1"
                                        class="elevation-1" no-results-text="No hay datos disponibles"
                                        no-data-text="No hay datos disponibles" show-select>
                                        <template v-slot:item.clientName="{ item }">

                                            <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                                                <v-img :src="'https://api2.simplifies.cl/api/images/' + item.client_image"
                                                    alt="image"></v-img>
                                            </v-avatar>
                                            {{ item.clientName }}
                                        </template>
                                        <template v-slot:item.professionalName="{ item }">

                                        <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                                            <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_url"
                                                alt="image"></v-img>
                                        </v-avatar>
                                        {{ item.professionalName }}
                                        </template>
                                        <template v-slot:item.tip="{ item }">
                {{ formatNumber(parseInt(item.tip))}}                                  
                                          </template>
                                          <template v-slot:item.tipCashier="{ item }">
                {{ formatNumber(parseInt(item.tipCashier))}}                                  
                                          </template>
                                          <template v-slot:item.tipCoffe="{ item }">
                {{ formatNumber(parseInt(item.tipCoffe))}}                                  
                                          </template>
                                    </v-data-table>
                                </v-container>
                                </v-col>
                            </v-row>
                        </v-container>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="#E7E9E9" variant="flat" @click="close">
                                Cancelar
                            </v-btn>
                            <v-btn color="#F18254" variant="flat" @click="saveCashier" :disabled="(!valid && (!selected2.length))">
                                Pagar
                            </v-btn>
                        </v-card-actions>
                    </v-form>
                            </v-card-text>
                                    </v-card>
                        </v-window-item>
                        <v-window-item value="two">
                                    <v-card>
                            <v-card-text>
                                <v-form ref="form" v-model="valid" enctype="multipart/form-data">
                        <v-container>
                            <v-row>
                                <v-col cols="12" md="3">
                                    <v-select label="Tipo de pago" v-model="editedItem.cashierproduct"
                                        :items="['Pago venta de productos']"
                                        :item-value="['Pago venta de productos']" variant="underlined"
                                        :rules="selectRules"
                                        prepend-icon="mdi-check-circle"></v-select><!--:disabled="!this.mostrarType"-->
                                </v-col>
                                <v-col cols="12" md="4">
                                                    <v-text-field v-model="editedItem.amountSaleProduct" clearable label="Monto"
                                                        prepend-icon="mdi-cash" variant="underlined" :rules="pago1">
                                                    </v-text-field>
                                                </v-col>
                            </v-row>
                            <v-row>

                                <v-col cols="12" md="12">
                                <v-container>
                                    <v-text-field class="mt-1 mb-1" v-model="search6" append-icon="mdi-magnify"
                                        label="Buscar" single-line hide-details></v-text-field>
                                    <v-data-table v-model="selectedCashier" :headers="headers7"
                                        :items-per-page-text="'Elementos por páginas'" :search="search7" :items="cashierSales"
                                        class="elevation-1" no-results-text="No hay datos disponibles"
                                        no-data-text="No hay datos disponibles" show-select>
                                        <template v-slot:item.name="{ item }">

                                            <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                                            <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_product" alt="image"></v-img>
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
                                </v-container>
                                </v-col>
                            </v-row>
                        </v-container>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="#E7E9E9" variant="flat" @click="close">
                                Cancelar
                            </v-btn>
                            <v-btn color="#F18254" variant="flat" @click="saveCashierProduct" :disabled="!isFormValid">
                                Pagar
                            </v-btn>
                        </v-card-actions>
                    </v-form>
                            </v-card-text>
                            </v-card>
                            </v-window-item>
                            </v-window>
                            </v-card-text>
                    </v-card>
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
export default {
    data: () => ({
        tabBar: false,
        tabBarCashier: false,
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
        dialogCashier: false,
        dialogDeleteCashier: false,
        dialogCashierCars: false,
        //mostrarType: true,
        headers: [
            { title: 'Nombre del profesional', value: 'name' },
            { title: 'Correo', value: 'email' },
            { title: 'Cargo', value: 'charge' },
            { title: 'Acciones', value: 'actions' },
        ],
        headers3: [
            { title: 'Fecha', key: 'date' },
            { title: 'Tipo de pago', key: 'type' },
            { title: 'Monto Líquido', key: 'amount' },
            { title: 'Acciones', value: 'actions' },
        ],
        headers5: [
            { title: 'Fecha del pago', key: 'date' },
            { title: 'Tipo de Pago', key: 'type' },
            { title: 'Monto Líquido', key: 'amount' },
            { title: 'Monto café', key: 'coffe_percent' },
            { title: 'Acciones', value: 'actions' },
        ],
        headers6: [
            { title: 'ID', align: 'start', key: 'id' },
            { title: 'Nombre Cliente', key: 'clientName' },
            { title: 'Nombre Profesional', key: 'professionalName' },
            { title: 'Fecha',  key: 'data' },
            { title: 'Propina', key: 'tip' },
            { title: 'Propina 10% Cajero (a)', key: 'tipCashier' },
            { title: 'Propina 10% Café', key: 'tipCoffe' },
        ],
        results: [],
        results1: [],
        selectedOption: '',
        typePay: '',
        //options: ['Adelanto', 'Quincena', 'Mes'],
        professionals: [],
        professional_id: '',
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
            { title: 'ID', align: 'start', value: 'id' },
            { title: 'Nombre Cliente', value: 'clientName' },
            { title: 'Fecha', align: 'end', value: 'data' },
            { title: 'Ganancias Servicios', align: 'end', value: 'totalServices' },
            { title: 'Cantidad Servicios', align: 'end', value: 'services' },
            { title: 'Cantidad Productos', align: 'end', value: 'products' },
            { title: 'Monto Generado', align: 'end', value: 'amountGenerate' },
            { title: 'Propina (80%)', align: 'end', value: 'tip' },
            { title: 'Convivencia', align: 'end', value: 'meta' },
            { title: 'Monto a Pagar', align: 'end', value: 'pay' },
        ],
        search2: '',
        headers4: [
            { title: 'ID', align: 'start', value: 'id' },
            { title: 'Academia', align: 'start', value: 'nameEnrollment' },
            { title: 'Nombre Curso', value: 'nameCourse' },
            { title: 'Precio Curso', value: 'price' },
            { title: 'Total Pagado', value: 'totalPayment' },
            { title: 'Descripción', value: 'description' },
            { title: 'Fecha Inicio', align: 'end', value: 'startDate' },
            { title: 'Fecha Terminación', align: 'end', value: 'endDate' }
        ],
    headers7: [
      { title: 'Producto', value: 'name' },
      { title: 'Cantidad', value: 'cant' },
      { title: 'Importe', value: 'price' },
    ],
    search7: '',
        search4: '',
        courses: [],
    }),

    computed: {
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
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
        /*selected2(newVal) {
            if (newVal.length == 0) {
                // Si selected2 cambia a null, establecer editedItem.amount en cero
                this.editedItem.amount = '';
            }
        }*/
    },

    mounted() {
        this.business_id = LocalStorageService.getItem('business_id');
        this.branch_id = LocalStorageService.getItem('branch_id');
        this.charge_id = LocalStorageService.getItem('charge_id');
        this.charge = JSON.parse(LocalStorageService.getItem("charge"));
        axios
            .get('https://api2.simplifies.cl/api/show-business', {
                params: {
                    business_id: this.business_id
                }
            })
            .then((response) => {
                this.branches = response.data.branches;
            }).finally(() => {
                if (this.charge === 'Administrador') {
                    this.branch_id = this.branches[0].id;
                    this.mostrarFila = true;
                }
                this.initialize();
            });
    },

    methods: {
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
            console.log(' selectedItem');
      console.log(selectedItem.price);
      console.log(' this.selectedCourse');
      console.log(this.selectedCourse);
      //const selectedItem = this.selectedCourse[0].price;
      console.log('value del monto');
      console.log(value);
      console.log(' parseInt(selectedItem.price)');
      console.log( selectedItem.price);
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

        /*professionalChange(){
            this.chargeProfessional = this.professionals.find(professional => professional.id == this.professional_id);
            console.log('this.chargeProfessional');
            console.log(this.chargeProfessional);
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

        initialize() {
            this.professionals = [];
            this.professional_id = '';

            axios
                .get('https://api2.simplifies.cl/api/branch_professionals_web', {
                    params: {
                        branch_id: this.branch_id
                    }
                })
                .then((response) => {
                    this.results = response.data.professionals;
                });
        },
        showAddPago() {
            if (this.charge == 'Barbero' || this.charge == 'Barbero y Encargado') {
                axios
                    .get('https://api2.simplifies.cl/api/professional-car-notpay', {
                        params: {
                            branch_id: this.branch_id,
                            professional_id: this.professional_id
                        }
                    })
                    .then((response) => {
                        this.cars = response.data.cars;
                        this.courses = response.data.courses;
                        /*if(this.cars.length == 0){
                            //this.editedItem.type = 'Adelanto';
                            this.mostrarCars = false;
                            //this.mostrarType = false;
                        }else{
                            this.mostrarCars = true;
                            //this.mostrarType = true;
                        }*/
                        this.mostrarCars = true;
                        this.mostrarDoc = true;
                    });
                this.dialog = true;
            } else {
                this.dialogOtros = true;
            }

        },
        /*/*carsEarrings() {
            this.editedItem.amount = '';
            this.chargeProfessional = this.professionals.find(professional => professional.id == this.professional_id);
            console.log('this.chargeProfessional');
            console.log(this.chargeProfessional.charge);
            this.mostrarCars = true;
            
            if(this.chargeProfessional.charge == 'Barbero' || this.chargeProfessional.charge == 'Barbero y Encargado'){
                axios
                .get('https://api2.simplifies.cl/api/professional-car-notpay', {
                    params: {
                        branch_id: this.branch_id,
                        professional_id: this.professional_id
                    }
                })
                .then((response) => {
                    this.cars = response.data;
                    /*if(this.cars.length == 0){
                        //this.editedItem.type = 'Adelanto';
                        this.mostrarCars = false;
                        //this.mostrarType = false;
                    }else{
                        this.mostrarCars = true;
                        //this.mostrarType = true;
                    }*/

        /*console.log('this.cars');
        console.log(this.cars);
    });
}else{
    this.mostrarCars = false;
    //this.mostrarType = true;
    console.log('es otro cargo');
}
 
},*/
        /*toggleService(serviceId) {
            const index = this.selected.indexOf(serviceId);
            console.log(this.selected);
            if (index > -1) {
                this.selected.splice(index, 1);
            } else {
                this.selected.push(serviceId);
            }
        },
        isSelected(serviceId) {
            return this.selected.includes(serviceId);
        },*/
        editItem(item) {
            this.editedIndex = 1;
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        pagoProfessional(item) {
            this.professional_id = item.id;
            this.charge = item.charge;
            if (item.charge == 'Cajero (a)') {
                this.showCashier();
            }
            else {
                this.showProfessional();
            }
        },

        showProfessional() {
            axios
                .get('https://api2.simplifies.cl/api/professional-payment-show', {
                    params: {
                        branch_id: this.branch_id,
                        professional_id: this.professional_id
                    }
                })
                .then((response) => {
                    this.professionalPayment = response.data;
                    /*if(this.cars.length == 0){
                        //this.editedItem.type = 'Adelanto';
                        this.mostrarCars = false;
                        //this.mostrarType = false;
                    }else{
                        this.mostrarCars = true;
                        //this.mostrarType = true;
                    }*/
                }).finally(() =>{
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

                });
            this.dialogBarberoEncargado = true;
        },
        showProfessionalPeriodo() {
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
                });
        },
        deleteItem(item) {
            this.editedIndex = -1;
            this.editedItem.id = item.id;
            this.dialogDelete = true;
        },
        deleteItemConfirm() {
            //this.results.splice(this.editedIndex, 1)
            let request = {
                id: this.editedItem.id
            };
            axios
                .post('https://api2.simplifies.cl/api/professional-payment-destroy', request)
                .then(() => {
                    this.showAlert("success", "Pago eliminado correctamente", 3000);
                }).finally(() => {
                    this.showProfessional();
                });
            this.closeDelete()
        },
        close() {
            this.dialog = false;
            this.dialogOtros = false;
            this.dialogCashierCars = false;
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
        save() {
            this.valid = false;
            console.log('this.ironValues');
            console.log(this.selected2);
            //console.log(this.selectedOption);
            this.cars.forEach(car => {
                if (car.meta === 'Si') {
                    if (!this.selected2.includes(car.id)) {
                        this.selected2.push(car.id);
                    }
                }
            });
            console.log(this.selected);
            this.data.professional_id = this.professional_id;
            this.data.branch_id = this.branch_id;
            this.data.car_ids = this.selected2;

            const temp = Number(this.totalMount());              
            this.data.amount = temp;

            this.data.type = this.editedItem.type;
            console.log('this.data');
            console.log(this.data);
            axios
                .post('https://api2.simplifies.cl/api/professional-payment', this.data)
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
                    this.showAlert("success", "Pago realizado correctamente", 3000);
                    this.showProfessional();
                });
            this.close();
        },
        //course
        saveCourse() {
            this.valid = false;
            /* if (this.editedIndex > -1) {
                 this.data.id = this.editedItem.id;
                 this.data.name = this.editedItem.name;
                 axios
                     .put('https://api2.simplifies.cl/api/workplace', this.data)
                     .then(() => {
                         this.initialize();
                         this.showAlert("success", "Pago editado correctamente", 3000);
                     })
             } else {*/
            console.log('this.selectedCourse');
            console.log(this.selectedCourse);
            //const newArrayCar = this.selected.map(item => parseInt(item)); // Convertir a enteros si es necesario
            //console.log('newArrayCar');
            //console.log(newArrayCar);
            this.data.professional_id = this.professional_id;
            this.data.branch_id = this.branch_id;
            this.data.course_ids = this.selectedCourse[0];
                this.data.amount = this.editedItem.amountAcadem;
            this.data.type = this.editedItem.academia;
            console.log('this.data');
            console.log(this.data);
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
                    this.showAlert("success", "Pago realizado correctamente", 3000);
                    this.showProfessional();
                });
            //}
            /*this.valid = false;
            this.data.name = this.editedItem.name;
            this.data.branch_id = this.branch_id

            axios
                .post('https://api2.simplifies.cl/api/workplace', this.data)
                .then(() => {
                    this.initialize();
                    this.showAlert("success", "Puesto de trabajo editado correctamente", 3000);
                })*/
            this.close();
        },
        saveOtros() {
            this.valid = false;
        
            this.data.professional_id = this.professional_id;
            this.data.branch_id = this.branch_id;
            this.data.amount = this.editedItem.amount;
            this.data.type = this.editedItem.type;
            console.log('this.data');
            console.log(this.data);
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
                    this.showAlert("success", "Pago realizado correctamente", 3000);
                    this.showProfessional();
                });
            this.close();
        },
        exportToExcelProfessional() {
            console.log('Entra aqui a exportar professional');
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
        showCashier() {
            axios
                .get('https://api2.simplifies.cl/api/operation-tip', {
                    params: {
                        branch_id: this.branch_id,
                        professional_id: this.professional_id
                    }
                })
                .then((response) => {
                    this.results1 = response.data;
                });
            this.dialogCashier = true;
        },
        showPay() {
            console.log('Entra aqui a pagos realizados');
            //this.editedIndex1 = 1;
            //this.state=true;
            //this.input2 = new Date();
            //this.input3 = new Date()
            const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
            const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
            axios
                .get('https://api2.simplifies.cl/api/operation-tip-periodo', {
                    params: {
                        branch_id: this.branch_id,
                        professional_id: this.professional_id,
                        startDate: startDate,
                        endDate: endDate
                    }
                })
                .then((response) => {
                    this.results1 = response.data;
                });
        },
        cashierDelete() {
            this.dialogCashier = false;
            this.professional_id = '';
        },
        deleteItemCashier(item) {
            this.editedIndex = -1;
            this.editedItem.id = item.id;
            this.typePay = item.car;
            this.dialogDeleteCashier = true;
        },
        deleteItemConfirmCashier() {
            //this.results.splice(this.editedIndex, 1)
            let request = {
                id: this.editedItem.id,
                type: this.typePay
            };
            axios
                .post('https://api2.simplifies.cl/api/operation-tip-destroy', request)
                .then(() => {
                }).finally(() => {
                    this.showAlert("success", "Pago eliminado correctamente", 3000);
                    this.showCashier();
                });
            this.closeDelete()
        },
        showAddOperationTip() {
            axios
                .get('https://api2.simplifies.cl/api/cashier-car-notpay', {
                    params: {
                        branch_id: this.branch_id,
                        professional_id: this.professional_id
                    }
                })
                .then((response) => {
                    this.cars1 = response.data.cars;
                    this.cashierSales = response.data.sales;
                });
            this.dialogCashierCars = true;
        },
        saveCashier() {
            this.valid = false;
            /* if (this.editedIndex > -1) {
                 this.data.id = this.editedItem.id;
                 this.data.name = this.editedItem.name;
                 axios
                     .put('https://api2.simplifies.cl/api/workplace', this.data)
                     .then(() => {
                         this.initialize();
                         this.showAlert("success", "Pago editado correctamente", 3000);
                     })
             } else {*/
            console.log('this.ironValues');
            console.log(this.selected2);
            //console.log(this.selectedOption);
            console.log(this.selected);
            //const newArrayCar = this.selected.map(item => parseInt(item)); // Convertir a enteros si es necesario
            //console.log('newArrayCar');
            //console.log(newArrayCar);
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
            console.log('this.data');
            console.log(this.data);
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
                    this.showAlert("success", "Pago realizado correctamente", 3000);
                    this.showCashier();
                });
            //}
            /*this.valid = false;
            this.data.name = this.editedItem.name;
            this.data.branch_id = this.branch_id

            axios
                .post('https://api2.simplifies.cl/api/workplace', this.data)
                .then(() => {
                    this.initialize();
                    this.showAlert("success", "Puesto de trabajo editado correctamente", 3000);
                })*/
            this.close();
        },
        saveCashierProduct() {
            this.valid = false;
            this.data.professional_id = this.professional_id;
            this.data.branch_id = this.branch_id;
            this.data.ids = this.selectedCashier;
            this.data.amount = this.editedItem.amountSaleProduct;
            this.data.type = this.editedItem.cashierproduct;
            console.log('this.data');
            console.log(this.data);
            axios
                .post('https://api2.simplifies.cl/api/professional-payment-cashier', this.data)
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
                    this.showAlert("success", "Pago realizado correctamente", 3000);
                    this.showCashier();
                });
            //}
            /*this.valid = false;
            this.data.name = this.editedItem.name;
            this.data.branch_id = this.branch_id

            axios
                .post('https://api2.simplifies.cl/api/workplace', this.data)
                .then(() => {
                    this.initialize();
                    this.showAlert("success", "Puesto de trabajo editado correctamente", 3000);
                })*/
            this.close();
        },
        exportToExcelCashier() {
            console.log('Entra aqui a exportar');
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