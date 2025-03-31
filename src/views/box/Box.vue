<!-- eslint-disable vue/return-in-computed-property -->
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
  <v-card elevation="3" class="mx-5" width='auto'>
    <v-toolbar color="#F18254">
      <v-row>
        <v-col cols="12" md="2" class="mt-2">
          <span class="ml-3"> <strong>Caja <!--- {{ this.nameBranch }}--></strong></span>
        </v-col>
        <v-col cols="12" md="10" c>
          <div class="text-center">
            <v-btn color="#E7E9E9" variant="flat" elevation="2" prepend-icon="mdi-gavel"
              @click="dialogCoexistence = true" class="mr-1">
              Convivencias
            </v-btn>
            <v-btn color="#E7E9E9" variant="flat" elevation="2" prepend-icon="mdi-clipboard-text" @click="chargeData()">
              Reservaciones
            </v-btn>
            <v-btn @click="showDialogProduct" color="#E7E9E9" variant="flat" elevation="2" prepend-icon="mdi-cart"
              class="ml-1">
              Venta Productos
            </v-btn>
            <v-btn @click="dialogDetallesCarPagado = true" color="#E7E9E9" variant="flat" elevation="2"
              prepend-icon="mdi-account-star-outline" :disabled="filteredItemsPay.length !== 0 ? false : true"
              class="ml-1">
              Clientes atendidos
            </v-btn>
            <v-btn :disabled="(closed_box || results.some(item => item.active === 2 || item.active === 3))"
              @click="openCloseBox" color="#E7E9E9" variant="flat" elevation="2" prepend-icon="mdi-cash-lock"
              class="ml-1">
              Cierre de Caja
            </v-btn>
            <v-btn @click="openDialogBox" color="#E7E9E9" variant="flat" elevation="2" prepend-icon="mdi-cash-register"
              class="ml-1">
              Caja
            </v-btn>
          </div>
        </v-col>
      </v-row>

    </v-toolbar>

    <v-card-text>
      <v-row class="mb-4 mt-1">
        <v-col cols="12" md="3">
          <v-card title="Total" :subtitle="totalMount1()" append-icon="mdi-check">

            <template v-slot:prepend>
              <v-avatar color="blue-darken-2">
                <v-icon icon="mdi-currency-usd"></v-icon>
              </v-avatar>
            </template>
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <v-card title="Cobrado" :subtitle="totalMountPagado()" prepend-icon="mdi mdi-currency-usd"
            append-icon="mdi-check">

            <template v-slot:prepend>
              <v-avatar color="green-darken-2">
                <v-icon icon="mdi-currency-usd"></v-icon>
              </v-avatar>
            </template>
          </v-card>
        </v-col>


        <v-col cols="12" md="3">
          <v-card title="Pendiente" :subtitle="totalMountPendientes()" append-icon="mdi-check">

            <template v-slot:prepend>
              <v-avatar color="red-darken-2">
                <v-icon icon="mdi-currency-usd"></v-icon>
              </v-avatar>
            </template>
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <v-card title="Efectivo en Caja" :subtitle="existence()" append-icon="mdi-check">

            <template v-slot:prepend>
              <v-avatar color="blue-darken-2">
                <v-icon icon="mdi-check-circle"></v-icon>
              </v-avatar>
            </template>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="12" md="4">
          <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches"
            v-if="this.mostrarFila" clearable label="Seleccione una Sucursal" prepend-icon="mdi-store" item-title="name"
            item-value="id" variant="underlined" @update:model-value="initialize()"></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="12">
          <v-card-title class="d-flex align-center pe-2">
            <v-btn @click="initialize()" class="mt-1 mb-1" color="#F18254">
              <v-icon left>mdi-refresh</v-icon>
              Refrescar
            </v-btn>
            <v-btn @click="showBonusProf" class="mt-1 mb-1 ml-1" color="#F18254">
              <v-icon left>mdi-cash-multiple</v-icon>
              Bonos por profesionales
            </v-btn>
            <v-btn v-if="this.ejecutado" @click="showBonus" class="mt-1 mb-1 ml-1" color="#F18254">
              <v-icon left>mdi-cash-multiple</v-icon>
              Bonos a pagar
            </v-btn>
            <v-btn @click="openCloseBoxDialog"
              :disabled="this.results.some(item => item.active === 2 || item.active === 3)" color="#F18254"
              variant="flat" elevation="2" prepend-icon="mdi-cash-lock" class="ml-1">
              Cierre Parcial
            </v-btn>
            <v-spacer></v-spacer>

            <v-text-field v-model="search" density="compact" label="Buscar" prepend-inner-icon="mdi-magnify"
              variant="solo-filled" flat hide-details single-line></v-text-field>
          </v-card-title>
          <!--<v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
        hide-details></v-text-field>-->


          <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="filteredItems"
            :search="search" class="elevation-1" no-results-text="No hay datos disponibles"
            no-data-text="No hay datos disponibles" :loading="loadingcar" loading-text="Cargando datos...">

            <template v-slot:item.professionalName="{ item }">

              <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                <v-img :src="'https://testapi.simplifies.cl/api/images/' + item.image_url" alt="image"></v-img>
              </v-avatar>
              {{ item.professionalName }}
            </template>

            <template v-slot:item.clientName="{ item }">

              <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                <v-img :src="'https://testapi.simplifies.cl/api/images/' + item.client_image" alt="image"></v-img>
              </v-avatar>
              {{ item.clientName }}
            </template>
            <template v-slot:item.technical_assistance="{ item }">
              {{ formatNumber(item.technical_assistance) }}
            </template>
            <template v-slot:item.product="{ item }">
              {{ formatNumber(item.product) }}
            </template>
            <template v-slot:item.service="{ item }">
              {{ formatNumber(item.service) }}
            </template>
            <template v-slot:item.amount="{ item }">
              {{ formatNumber(item.amount) }}
            </template>
            <template v-slot:item.state="{ item }">
              <v-chip :color="getColor(item.state)" class="text-uppercase" label size="small">
                {{ getText(item.state) }}
              </v-chip>
              <!--<v-chip :color="item.pay != 0 ? 'green' : 'red'" :text="item.pay" class="text-uppercase" label size="small">
            {{ item.pay === 0 ? 'Pendiente' : 'Pagado' }}
          </v-chip>-->
            </template>

            <template v-slot:top>

              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn density="comfortable" icon="mdi-eye" @click="(item.active != 3) && showDetails(item)"
                :color="(item.active != 3) ? 'blue' : 'grey'" variant="tonal" elevation="1" class="mr-1 mt-1 mb-1"
                title="Mostrar detalles del carro"></v-btn>
              <v-btn density="comfortable" icon="mdi-credit-card"
                @click="(item.active != 3 && item.state == 1) && payItem(item)"
                :color="(item.active != 3 && item.state == 1) ? 'green-darken-1' : 'grey'" variant="tonal" elevation="1"
                class="mr-1 mt-1 mb-1" title="Pagar el carro"></v-btn>
              <v-btn density="comfortable" icon="mdi-delete"
                @click="(item.active != 3 && item.state != 2) && deleteItemSolicitud(item)"
                :color="(item.active != 3 && item.state != 2) ? 'red-darken-4' : 'grey'" variant="tonal" elevation="1"
                title="Solicitud de eliminar carro"></v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>

    </v-card-text>
  </v-card>
  <!--Cierre de caja parcial-->
  <v-dialog v-model="dialogParcial" fullscreen transition="dialog-bottom-transition" persistent
    :no-click-animation="true">
    <v-card>
      <v-card-text>
        <v-form v-model="valid" enctype="multipart/form-data">
          <v-stepper elevation="6" bg-color="" v-model="stepCashier" :items="itemsCashier" hide-actions
            @update:model-value="handleStepChangeCashier"
            style="max-height: 100vh; min-height: 95vh; overflow-y: auto;">
            <template v-slot:item.1>
              <v-sheet border>
                <div style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                  <v-card style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                    <v-card-text>
                      <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
                      <ProductStoreStatus :branch_id="this.branch_id"
                        @update:has-invalid-state="setInvalidStateProduct" />
                    </v-card-text>
                  </v-card>
                </div>
              </v-sheet>
              <v-container fluid>
                <!-- BOTONES -->
                <v-row class="mt-1">
                  <v-btn color="#E7E9E9" variant="flat" @click="close">
                    Salir
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="#E7E9E9" :disabled="hasInvalidStateProduct" variant="flat"
                    @click="dialogDeleteParcial = true">Siguiente</v-btn>
                </v-row>
              </v-container>
            </template>
            <template v-slot:item.2>
              <v-sheet border>
                <div style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                  <v-card style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                    <v-card-text>
                      <v-row class="mb-4 mt-2" dense no-gutters>
                        <v-col cols="12" md="1" class="text-center">
                        </v-col>
                        <v-col cols="12" md="5">
                          <v-card class="mx-auto" subtitle="Datos de ingresos arrojados por el sistema"
                            style="background-color: #027b7b; color: white;" elevation="4">
                            <template v-slot:prepend>
                              <v-avatar color="white">
                                <v-icon icon="mdi-cog" color="#027b7b" size="large"></v-icon>
                              </v-avatar>
                            </template>
                            <template v-slot:title>
                              <span class="font-weight-black">Datos del Sistema</span>
                            </template>
                            <v-card-text class="bg-surface-light pt-4">
                              <v-text-field v-model="editedCloseBox.totalCreditCard" label="Tarjeta Crédito" readonly
                                prepend-icon="mdi-credit-card" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="editedCloseBox.totalDebit" label="Débito" readonly
                                prepend-icon="mdi-credit-card-outline" variant="underlined"
                                density="compact"></v-text-field>
                              <v-text-field v-model="editedCloseBox.totalTransfer" label="Transferencia" readonly
                                prepend-icon="mdi-bank-transfer" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="editedBox.existence" label="Efectivo" readonly
                                prepend-icon="mdi-cash" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="editedCloseBox.totalOther" label="Otros" readonly
                                prepend-icon="mdi-currency-usd" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="editedCloseBox.totalCardGif" label="Tarjeta Regalo" readonly
                                prepend-icon="mdi-gift" variant="underlined" density="compact"></v-text-field>
                            </v-card-text>
                          </v-card>
                        </v-col>
                        <v-col cols="12" md="5" class="ml-6">
                          <v-card class="mx-auto" subtitle="Introduces tus datos de ingresos "
                            style="background-color: #004059; color: white;" elevation="4">
                            <template v-slot:prepend>
                              <v-avatar color="white">
                                <v-icon icon="mdi-cash-register" color="#004059" size="large"></v-icon>
                              </v-avatar>
                            </template>
                            <template v-slot:title>
                              <span class="font-weight-black">Datos de la Cajera</span>
                            </template>
                            <template v-slot:append>
                              <v-btn prepend-icon="mdi-plus" variant="outlined" @click="dialogDetails = true">
                                Agregar
                              </v-btn>
                            </template>
                            <v-card-text class="bg-white pt-4" style="min-height: 44vh; overflow-y: auto;">
                              <v-div v-if="cashierData.details.length > 0">
                                <v-div v-for="detail in cashierData.details" :key="detail.id" class="mb-2">
                                  <template v-slot:default>
                                    <v-row dense>
                                      <v-col cols="12" md="11">
                                        <!--<v-text-field hide-details="auto" :model-value="formatNumber(detail.value)"
                                        :label="getOptionName(detail.type)" readonly prepend-icon="mdi-credit-card"
                                        variant="underlined" density="compact" class="mb-5"></v-text-field>-->
                                        <v-text-field :model-value="detail.value"
                                          @update:modelValue="updateMainField(detail, $event)" :label="detail.name"
                                          :prepend-icon="getDetailIcon(detail).icon" variant="underlined"
                                          density="compact" type="number" hide-details="auto"></v-text-field>
                                      </v-col>
                                      <v-col cols="12" md="1">
                                        <v-btn density="comfortable" icon="mdi-delete"
                                          @click.stop="removeDetail(detail)" style="cursor: pointer;"
                                          color="red-darken-4" variant="tonal" elevation="1"></v-btn>
                                      </v-col>
                                    </v-row>
                                  </template>
                                </v-div>
                              </v-div>
                            </v-card-text>
                          </v-card>
                        </v-col>
                        <!-- Columna 3: Diferencias 
                        <v-col cols="4" class="text-center">
                          <v-card class="pa-4 mx-2" elevation="2">
                            <v-card-title class="text-subtitle-1"
                              style="background-color: rgba(229, 115, 115, 0.9); color: white;">Diferencias</v-card-title>
                            <v-divider class="mb-4"></v-divider>
                            <v-text-field :value="calculateDifferenceCreditCard" readonly prepend-icon="mdi-credit-card"
                              variant="underlined" density="compact" class="mb-2"></v-text-field>
                            <v-text-field :value="calculateDifferenceDebit" readonly
                              prepend-icon="mdi-credit-card-outline" variant="underlined" density="compact"
                              class="mb-2"></v-text-field>
                            <v-text-field :value="calculateDifferenceTransfer" readonly prepend-icon="mdi-bank-transfer"
                              variant="underlined" density="compact" class="mb-2"></v-text-field>
                            <v-text-field :value="calculateDifferenceCash" readonly prepend-icon="mdi-bank-transfer"
                              variant="underlined" density="compact" class="mb-2"></v-text-field>
                            <v-text-field :value="calculateDifferenceOther" readonly prepend-icon="mdi-cash"
                              variant="underlined" density="compact" class="mb-2"></v-text-field>
                            <v-text-field :value="calculateDifferenceCardGif" readonly prepend-icon="mdi-gift"
                              variant="underlined" density="compact" class="mb-2"></v-text-field>
                          </v-card>
                        </v-col>-->
                      </v-row>
                      <!--<v-row class="mb-4 mt-2" dense no-gutters>
                        <v-col cols="12" md="6"></v-col>
                        <v-col cols="12" md="4" class="text-right">
                          <span class="text-h6 mb-2" :class="{
                            'text-red': calculateTotalDifferencesPagos1 < 0,
                            'text-green': calculateTotalDifferencesPagos1 >= 0
                          }">Diferencias:</span>
                        </v-col>
                        <v-col cols="12" md="2">
                          <v-text-field v-model="cashierData.differencePay" :value="calculateTotalDifferencesPagos"
                            variant="underlined" density="compact" class="mb-2" :class="{
                              'text-red': calculateTotalDifferencesPagos1 < 0,
                              'text-green': calculateTotalDifferencesPagos1 >= 0
                            }"></v-text-field>
                        </v-col>
                      </v-row>-->
                    </v-card-text>
                  </v-card>
                </div>

              </v-sheet>
              <v-container fluid>
                <!-- BOTONES -->
                <v-row class="mt-1">
                  <v-spacer></v-spacer>
                  <v-btn color="#E7E9E9" :disabled="cashierData.details.length === 0" variant="flat"
                    @click="dialogDeleteParcial = true">Siguiente</v-btn>
                </v-row>
              </v-container>
            </template>
            <template v-slot:item.3>
              <v-sheet border>
                <div style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                  <v-card style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                    <v-card-text>
                      <v-row class="mb-4 mt-2" dense no-gutters>
                        <v-col cols="12" md="1" class="text-center">
                        </v-col>
                        <v-col cols="12" md="5">
                          <v-card class="mx-auto" subtitle="Datos de Gastos arrojados por el sistema"
                            style="background-color: #027b7b; color: white;" elevation="4">
                            <template v-slot:prepend>
                              <v-avatar color="white">
                                <v-icon icon="mdi-cog" color="#027b7b" size="large"></v-icon>
                              </v-avatar>
                            </template>
                            <template v-slot:title>
                              <span class="font-weight-black">Datos del Sistema</span>
                            </template>
                            <v-card-text class="bg-surface-light pt-4">
                              <v-text-field v-model="editedBox.extraction" label="Extracción en caja" readonly
                                prepend-icon="mdi-cash-refund" variant="underlined" density="compact"></v-text-field>
                              <v-text-field :value="editedCloseBox.advancement" label="Adelanto" readonly
                                prepend-icon="mdi-cash" variant="underlined" density="compact"></v-text-field>
                            </v-card-text>
                          </v-card>
                        </v-col>
                        <!-- Columna 2: Datos de la Cajera -->
                        <v-col cols="12" md="5" class="ml-6">
                          <v-card class="mx-auto" subtitle="Introduces tus datos de gastos "
                            style="background-color: #004059; color: white;" elevation="4">
                            <template v-slot:prepend>
                              <v-avatar color="white">
                                <v-icon icon="mdi-cash-register" color="#004059" size="large"></v-icon>
                              </v-avatar>
                            </template>
                            <template v-slot:title>
                              <span class="font-weight-black">Datos de la Cajera</span>
                            </template>
                            <v-card-text class="bg-white pt-4" style="min-height: 17vh; overflow-y: auto;">
                              <v-text-field v-model="cashierData.extraction" label="Extracción"
                                prepend-icon="mdi-cash-refund" variant="underlined" density="compact"></v-text-field>
                              <v-text-field style="visibility: hidden" v-model="cashierData.advancement"
                                label="Adelanto" prepend-icon="mdi-cash" variant="underlined"
                                density="compact"></v-text-field>
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
                  <v-spacer></v-spacer>
                  <v-btn color="#E7E9E9" variant="flat" @click="dialogDeleteParcial = true">Siguiente</v-btn>
                </v-row>
              </v-container>
            </template>
            <template v-slot:item.4>
              <v-sheet border>
                <div style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                  <v-card style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                    <v-card-text>
                      <v-row class="mb-4 mt-2" dense no-gutters>
                        <v-col cols="12" md="1" class="text-center"></v-col>
                        <v-col cols="12" md="5">
                          <v-card class="mx-auto" subtitle="Resumen de datos arrojados por el sistema"
                            style="background-color: #027b7b; color: white;" elevation="4">
                            <template v-slot:prepend>
                              <v-avatar color="white">
                                <v-icon icon="mdi-cog" color="#027b7b" size="large"></v-icon>
                              </v-avatar>
                            </template>
                            <template v-slot:title>
                              <span class="font-weight-black">Datos del Sistema</span>
                            </template>
                            <v-card-text class="bg-surface-light pt-4">
                              <v-text-field v-model="editedCloseBox.totalCreditCard" label="Tarjeta Crédito" readonly
                                prepend-icon="mdi-credit-card" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="editedCloseBox.totalDebit" label="Débito" readonly
                                prepend-icon="mdi-credit-card-outline" variant="underlined"
                                density="compact"></v-text-field>
                              <v-text-field v-model="editedCloseBox.totalTransfer" label="Transferencia" readonly
                                prepend-icon="mdi-bank-transfer" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="editedBox.existence" label="Efectivo" readonly
                                prepend-icon="mdi-cash" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="editedCloseBox.totalOther" label="Otros" readonly
                                prepend-icon="mdi-currency-usd" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="editedCloseBox.totalCardGif" label="Tarjeta Regalo" readonly
                                prepend-icon="mdi-gift" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="editedBox.extraction" label="Extracción en caja" readonly
                                prepend-icon="mdi-cash-refund" variant="underlined" density="compact"></v-text-field>
                              <v-text-field :value="editedCloseBox.advancement" label="Adelanto" readonly
                                prepend-icon="mdi-cash" variant="underlined" density="compact"></v-text-field>
                            </v-card-text>
                          </v-card>
                        </v-col>
                        <v-col cols="12" md="5" class="ml-6">
                          <v-card class="mx-auto" subtitle="Resumen datos del cierre de caja"
                            style="background-color: #004059; color: white;" elevation="4">
                            <template v-slot:prepend>
                              <v-avatar color="white">
                                <v-icon icon="mdi-cash-register" color="#004059" size="large"></v-icon>
                              </v-avatar>
                            </template>
                            <template v-slot:title>
                              <span class="font-weight-black">Datos de la Cajera</span>
                            </template>
                            <v-card-text class="bg-white pt-4">
                              <v-text-field v-model="cashierData.totalCreditCard" label="Tarjeta Crédito" readonly
                                prepend-icon="mdi-credit-card" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="cashierData.totalDebit" label="Débito" readonly
                                prepend-icon="mdi-credit-card-outline" variant="underlined"
                                density="compact"></v-text-field>
                              <v-text-field v-model="cashierData.totalTransfer" label="Transferencia" readonly
                                prepend-icon="mdi-bank-transfer" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="cashierData.existence" label="Efectivo" readonly
                                prepend-icon="mdi-cash" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="cashierData.totalOther" label="Otros" readonly
                                prepend-icon="mdi-currency-usd" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="cashierData.totalCardGif" label="Tarjeta Regalo" readonly
                                prepend-icon="mdi-gift" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="cashierData.extraction" label="Extracción en caja" readonly
                                prepend-icon="mdi-cash-refund" variant="underlined" density="compact"></v-text-field>
                              <v-text-field style="visibility: hidden;" v-model="cashierData.advancement"
                                label="Adelanto" prepend-icon="mdi-cash" variant="underlined"
                                density="compact"></v-text-field>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                      <v-row v-if="cashierData.difference !== 0">
                        <v-col cols="12" md="1"></v-col>
                        <v-col cols="12" md="10">
                          <v-row class="mb-4 mt-2 text-right" dense no-gutters>
                            <v-col cols="12" md="12">
                              <span class="text-h6" :class="{
                                'text-red': calculateTotalDifferencesGlobal1 < 0,
                                'text-green': calculateTotalDifferencesGlobal1 >= 0
                              }">Existe una diferencia total de: {{ cashierData.difference }}</span>
                            </v-col>
                          </v-row>
                          <v-row class="mb-4 mt-1" dense no-gutters>
                            <v-col cols="12" md="6" class="text-h6">Comentario:</v-col>
                            <v-col cols="12" md="12" class="text-center">
                              <v-textarea v-model="cashierData.description" variant="underlined" density="compact"
                                class="mb-2" :rules="descriptionRules"></v-textarea>
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
                  <v-spacer></v-spacer>
                  <v-btn color="#F18254" :disabled="!valid" variant="flat" @click="saveCloseBoxParcial"
                    :loading="!loadingBonus">
                    Cerrar Caja
                  </v-btn>
                </v-row>
              </v-container>
            </template>
          </v-stepper>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
  <!--end Cierre de caja parcial-->
  <!--Cierre de caja-->
  <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition" persist :no-click-animatioin="true">
    <v-card>
      <v-card-text>
        <v-form v-model="valid" enctype="multipart/form-data">
          <v-stepper elevation="6" bg-color="" v-model="step" :items="items" hide-actions
            @update:model-value="handleStepChange" style="max-height: 100vh; min-height: 95vh; overflow-y: auto;">
            <template v-slot:item.1>
              <v-sheet border>
                <div style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                  <v-card style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                    <v-card-text>
                      <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
                      <ProductStoreStatus :branch_id="this.branch_id"
                        @update:has-invalid-state="setInvalidStateProduct" />
                    </v-card-text>
                  </v-card>
                </div>
              </v-sheet>
              <v-container fluid>
                <!-- BOTONES -->
                <v-row class="mt-1">
                  <v-btn color="#E7E9E9" variant="flat" @click="close">Salir</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="#E7E9E9" :disabled="hasInvalidStateProduct" variant="flat"
                    @click="dialogDeleteDiario = true">
                    Siguiente
                  </v-btn>
                </v-row>

              </v-container>
            </template>
            <template v-slot:item.2>
              <v-sheet border>
                <div style="max-height: 70vh; overflow-y: auto;">
                  <v-card>
                    <v-card-text>
                      <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo 
                      <Coexistence :branch_id="this.branch_id" />-->
                      <Coexistence :branch_id="branch_id" @update:has-invalid-state="setInvalidState" />
                    </v-card-text>
                    <v-divider></v-divider>
                  </v-card>
                </div>
              </v-sheet>
              <v-container fluid>
                <!-- BOTONES -->
                <v-row class="mt-1">
                  <!--<v-btn color="#E7E9E9" variant="flat" @click="prevStep">Volver</v-btn>-->
                  <v-spacer></v-spacer>
                  <v-btn color="#E7E9E9" :disabled="hasInvalidState" variant="flat"
                    @click="dialogDeleteDiario = true">Siguiente
                    <v-tooltip v-if="hasInvalidState" activator="parent" location="top">
                      No puedes avanzar mientras haya elementos sin actualizar
                    </v-tooltip></v-btn>
                </v-row>

              </v-container>
            </template>
            <template v-slot:item.3>
              <v-sheet border>
                <div style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                  <v-card style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                    <v-toolbar color="#F18254">
                      <v-row>
                        <v-col cols="12" md="8">
                          <span class="text-subtitle-2 ml-3">Bonos por profesionales</span>
                        </v-col>
                        <v-col cols="12" md="4" class="text-center">
                          <v-btn @click="exportToExcelProf" color="#E7E9E9" variant="flat" elevation="2"
                            prepend-icon="mdi-file-excel">
                            Exportar a Excel
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-toolbar>

                    <v-card-text class="mt-2 mb-2">
                      <v-text-field class="mt-1 mb-1" v-model="search8" append-icon="mdi-magnify" label="Buscar"
                        single-line hide-details></v-text-field>


                      <v-data-table :headers="headers9" :items-per-page-text="'Elementos por páginas'"
                        :items="bonusProf" :search="search9" class="elevation-1"
                        no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles"
                        :loading="loadingBonusStep" loading-text="Cargando datos...">

                        <template v-slot:item.name="{ item }">

                          <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                            <v-img :src="'https://testapi.simplifies.cl/api/images/' + item.image_url" alt="image"></v-img>
                          </v-avatar>
                          {{ item.name }}
                        </template>
                        <template v-slot:item.amount="{ item }">
                          {{ formatNumber(item.amount) }}
                        </template>
                        <template v-slot:item.actions="{ item }">
                          <v-btn variant="flat" @click="(item.pay) ? '' : payBonusProf(item)"
                            :color="(item.pay) ? 'grey' : '#F18254'" title="Pagar bono a profesional"
                            style="min-width: 100px;">
                            {{ item.pay ? 'Pagado' : 'Pagar' }}
                          </v-btn>
                        </template>
                        <template v-slot:top>

                          <v-divider class="mx-4" inset vertical></v-divider>
                          <v-spacer></v-spacer>
                        </template>

                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </div>
              </v-sheet>
              <v-container fluid>
                <v-row class="mt-1">
                  <!--<v-btn color="#E7E9E9" variant="flat" @click="prevStep">Volver</v-btn>-->
                  <v-spacer></v-spacer>
                  <v-btn color="#E7E9E9" :disabled="hasUnpaidBonus" variant="flat" @click="dialogDeleteDiario = true"
                    :loading="loadingBonusStep">Siguiente</v-btn>
                </v-row>

              </v-container>
            </template>
            <template v-slot:item.4>
              <v-sheet border>
                <div style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                  <v-card style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                    <v-card-text>
                      <v-row class="mb-4 mt-2" no-gutters>
                        <v-col cols="12" md="1" class="text-center">
                        </v-col>
                        <v-col cols="12" md="5">
                          <v-card class="mx-auto" subtitle="Datos de Ingresos arrojados por el sistema"
                            style="background-color: #027b7b; color: white;" elevation="4">
                            <template v-slot:prepend>
                              <v-avatar color="white">
                                <v-icon icon="mdi-cog" color="#027b7b" size="large"></v-icon>
                              </v-avatar>
                            </template>
                            <template v-slot:title>
                              <span class="font-weight-black">Datos del Sistema</span>
                            </template>
                            <v-card-text class="bg-surface-light pt-4">
                              <v-text-field v-model="editedCloseBox.totalCreditCard" label="Tarjeta Crédito" readonly
                                prepend-icon="mdi-credit-card" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="editedCloseBox.totalDebit" label="Débito" readonly
                                prepend-icon="mdi-credit-card-outline" variant="underlined"
                                density="compact"></v-text-field>
                              <v-text-field v-model="editedCloseBox.totalTransfer" label="Transferencia" readonly
                                prepend-icon="mdi-bank-transfer" variant="underlined" density="compact"></v-text-field>
                              <v-text-field :model-value="editedBox.existence" label="Efectivo" readonly
                                prepend-icon="mdi-cash" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="editedCloseBox.totalOther" label="Otros" readonly
                                prepend-icon="mdi-currency-usd" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="editedCloseBox.totalCardGif" label="Tarjeta Regalo" readonly
                                prepend-icon="mdi-gift" variant="underlined" density="compact"></v-text-field>
                            </v-card-text>
                          </v-card>
                        </v-col>

                        <!-- Columna 2: Datos de la Cajera -->
                        <v-col cols="12" md="5" class="ml-6">
                          <v-card class="mx-auto" subtitle="Introduces tus datos de ingresos "
                            style="background-color: #004059; color: white;" elevation="4">
                            <template v-slot:prepend>
                              <v-avatar color="white">
                                <v-icon icon="mdi-cash-register" color="#004059" size="large"></v-icon>
                              </v-avatar>
                            </template>
                            <template v-slot:title>
                              <span class="font-weight-black">Datos de la Cajera</span>
                            </template>
                            <template v-slot:append>
                              <v-btn prepend-icon="mdi-plus" variant="outlined" @click="dialogDetails = true">
                                Agregar
                              </v-btn>
                            </template>
                            <v-card-text class="bg-white pt-4" style="min-height: 44vh; overflow-y: auto;">
                              <v-div v-if="cashierData.details.length > 0">
                                <v-div v-for="detail in cashierData.details" :key="detail.id" class="mb-2">
                                  <template v-slot:default>
                                    <v-row dense>
                                      <v-col cols="12" md="11">
                                        <v-text-field :model-value="detail.value"
                                          @update:modelValue="updateMainField(detail, $event)" :label="detail.name"
                                          :prepend-icon="getDetailIcon(detail).icon" variant="underlined"
                                          density="compact" type="number" hide-details="auto"></v-text-field>
                                      </v-col>
                                      <v-col cols="12" md="1">
                                        <v-btn density="comfortable" icon="mdi-delete"
                                          @click.stop="removeDetail(detail)" style="cursor: pointer;"
                                          color="red-darken-4" variant="tonal" elevation="1"></v-btn>
                                      </v-col>
                                    </v-row>
                                  </template>
                                </v-div>
                              </v-div>
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
                  <!--<v-btn color="#E7E9E9" variant="flat" @click="prevStep">Volver</v-btn>-->
                  <v-spacer></v-spacer>
                  <v-btn color="#E7E9E9" :disabled="cashierData.details.length === 0" variant="flat"
                    @click="dialogDeleteDiario = true">Siguiente</v-btn>
                </v-row>
              </v-container>
            </template>
            <template v-slot:item.5>
              <v-sheet border>
                <div style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                  <v-card style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                    <v-card-text>
                      <v-row class="mb-4 mt-2" no-gutters>
                        <!-- Columna 1: Datos del Sistema -->
                        <v-col cols="12" md="1" class="text-center">
                        </v-col>
                        <v-col cols="12" md="5">
                          <v-card class="mx-auto" subtitle="Datos de Gastos arrojados por el sistema"
                            style="background-color: #027b7b; color: white;" elevation="4">
                            <template v-slot:prepend>
                              <v-avatar color="white">
                                <v-icon icon="mdi-cog" color="#027b7b" size="large"></v-icon>
                              </v-avatar>
                            </template>
                            <template v-slot:title>
                              <span class="font-weight-black">Datos del Sistema</span>
                            </template>
                            <v-card-text class="bg-surface-light pt-4">
                              <v-text-field v-model="editedBox.extraction" label="Extracción en caja" readonly
                                prepend-icon="mdi-cash-refund" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="this.editedCloseBox.totalBonus" label="Pago de bonos" readonly
                                prepend-icon="mdi-cash-refund" variant="underlined" density="compact"></v-text-field>
                              <v-text-field :value="editedCloseBox.advancement" label="Adelanto" readonly
                                prepend-icon="mdi-cash" variant="underlined" density="compact"></v-text-field>
                            </v-card-text>
                          </v-card>
                        </v-col>

                        <!-- Columna 2: Datos de la Cajera -->
                        <v-col cols="12" md="5" class="ml-6">
                          <v-card class="mx-auto" subtitle="Introduces tus datos de gastos "
                            style="background-color: #004059; color: white;" elevation="4">
                            <template v-slot:prepend>
                              <v-avatar color="white">
                                <v-icon icon="mdi-cash-register" color="#004059" size="large"></v-icon>
                              </v-avatar>
                            </template>
                            <template v-slot:title>
                              <span class="font-weight-black">Datos de la Cajera</span>
                            </template>
                            <v-card-text class="bg-white pt-4" style="min-height: 17vh; overflow-y: auto;">
                              <v-text-field v-model="cashierData.extraction" label="Extracción"
                                prepend-icon="mdi-cash-refund" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="cashierData.totalBonus" label="Bonos"
                                prepend-icon="mdi-cash-refund" variant="underlined" density="compact"></v-text-field>
                              <v-text-field style="visibility: hidden" v-model="cashierData.advancement"
                                label="Adelanto" prepend-icon="mdi-cash" variant="underlined"
                                density="compact"></v-text-field>
                            </v-card-text>
                          </v-card>
                        </v-col>

                        <!-- Columna 3: Diferencias 
                        <v-col cols="4" class="text-center">
                          <v-card class="pa-4 mx-2" elevation="2">
                            <v-card-title class="text-subtitle-1"
                              style="background-color: rgba(229, 115, 115, 0.9); color: white;">Diferencias</v-card-title>
                            <v-divider class="mb-4"></v-divider>
                            <v-text-field :value="calculateDifferenceExtraccion" readonly prepend-icon="mdi-cash-refund"
                              variant="underlined" density="compact"></v-text-field>
                            <v-text-field :value="calculateDifferenceBonusPay" readonly prepend-icon="mdi-cash-refund"
                              variant="underlined" density="compact"></v-text-field>
                            <v-text-field :value="calculateDifferenceAdelanto" readonly prepend-icon="mdi-cash"
                              variant="underlined" density="compact"></v-text-field>
                          </v-card>
                        </v-col>-->
                      </v-row>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </div>
              </v-sheet>
              <v-container fluid>
                <!-- BOTONES -->
                <v-row class="mt-1">
                  <!--<v-btn color="#E7E9E9" variant="flat" @click="prevStep">Volver</v-btn>-->
                  <v-spacer></v-spacer>
                  <v-btn color="#E7E9E9" variant="flat" @click="dialogDeleteDiario = true">Siguiente</v-btn>
                  <!--<v-btn color="#F18254" :disabled="ejecutado || !valid" variant="flat" @click="saveCloseBox"
                    :loading="!loadingBonus">
                    Cerrar Caja
                  </v-btn>-->
                </v-row>
              </v-container>
            </template>
            <template v-slot:item.6>
              <v-sheet border>
                <div style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                  <v-card style="max-height: 72vh; min-height: 72vh; overflow-y: auto;">
                    <v-card-text>
                      <v-row class="mb-4 mt-2" dense no-gutters>
                        <!-- Columna 1: Datos del Sistema -->
                        <v-col cols="12" md="1" class="text-center"></v-col>
                        <v-col cols="12" md="5">
                          <v-card class="mx-auto" subtitle="Resumen de datos arrojados por el sistema"
                            style="background-color: #027b7b; color: white;" elevation="4">
                            <template v-slot:prepend>
                              <v-avatar color="white">
                                <v-icon icon="mdi-cog" color="#027b7b" size="large"></v-icon>
                              </v-avatar>
                            </template>
                            <template v-slot:title>
                              <span class="font-weight-black">Datos del Sistema</span>
                            </template>
                            <v-card-text class="bg-surface-light pt-4">
                              <v-text-field v-model="editedCloseBox.totalCreditCard" label="Tarjeta Crédito" readonly
                                prepend-icon="mdi-credit-card" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="editedCloseBox.totalDebit" label="Débito" readonly
                                prepend-icon="mdi-credit-card-outline" variant="underlined"
                                density="compact"></v-text-field>
                              <v-text-field v-model="editedCloseBox.totalTransfer" label="Transferencia" readonly
                                prepend-icon="mdi-bank-transfer" variant="underlined" density="compact"></v-text-field>
                              <v-text-field :model-value="editedBox.existence" label="Efectivo" readonly
                                prepend-icon="mdi-cash" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="editedCloseBox.totalOther" label="Otros" readonly
                                prepend-icon="mdi-currency-usd" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="editedCloseBox.totalCardGif" label="Tarjeta Regalo" readonly
                                prepend-icon="mdi-gift" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="editedBox.extraction" label="Extracción en caja" readonly
                                prepend-icon="mdi-cash-refund" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="this.editedCloseBox.totalBonus" label="Pago de bonos" readonly
                                prepend-icon="mdi-cash-refund" variant="underlined" density="compact"></v-text-field>
                              <v-text-field :value="editedCloseBox.advancement" label="Adelanto" readonly
                                prepend-icon="mdi-cash" variant="underlined" density="compact"></v-text-field>
                            </v-card-text>
                          </v-card>
                        </v-col>

                        <!-- Columna 2: Datos de la Cajera -->
                        <v-col cols="12" md="5" class="ml-6">
                          <v-card class="mx-auto" subtitle="Resumen datos del cierre de caja"
                            style="background-color: #004059; color: white;" elevation="4">
                            <template v-slot:prepend>
                              <v-avatar color="white">
                                <v-icon icon="mdi-cash-register" color="#004059" size="large"></v-icon>
                              </v-avatar>
                            </template>
                            <template v-slot:title>
                              <span class="font-weight-black">Datos de la Cajera</span>
                            </template>
                            <v-card-text class="bg-white pt-4">
                              <v-text-field v-model="cashierData.totalCreditCard" label="Tarjeta Crédito" readonly
                                prepend-icon="mdi-credit-card" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="cashierData.totalDebit" label="Débito" readonly
                                prepend-icon="mdi-credit-card-outline" variant="underlined"
                                density="compact"></v-text-field>
                              <v-text-field v-model="cashierData.totalTransfer" label="Transferencia" readonly
                                prepend-icon="mdi-bank-transfer" variant="underlined" density="compact"></v-text-field>
                              <v-text-field :model-value="cashierData.existence" label="Efectivo" readonly
                                prepend-icon="mdi-cash" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="cashierData.totalOther" label="Otros" readonly
                                prepend-icon="mdi-currency-usd" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="cashierData.totalCardGif" label="Tarjeta Regalo" readonly
                                prepend-icon="mdi-gift" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="cashierData.extraction" label="Extracción"
                                prepend-icon="mdi-cash-refund" variant="underlined" density="compact"></v-text-field>
                              <v-text-field v-model="cashierData.totalBonus" label="Bonos"
                                prepend-icon="mdi-cash-refund" variant="underlined" density="compact"></v-text-field>
                              <v-text-field style="visibility: hidden" v-model="cashierData.advancement"
                                label="Adelanto" prepend-icon="mdi-cash" variant="underlined"
                                density="compact"></v-text-field>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                      <v-row v-if="cashierData.difference !== 0">
                        <v-col cols="12" md="1"></v-col>
                        <v-col cols="12" md="10">
                          <v-row class="mb-4 mt-2 text-left" no-gutters align="center">
                            <v-col cols="12" md="auto" class="d-flex align-center">
                              <span class="text-h6 mr-2" :class="{
                                'text-red': calculateTotalDifferencesGlobal1 < 0,
                                'text-green': calculateTotalDifferencesGlobal1 >= 0
                              }">Existe una diferencia total de:</span>

                              <v-text-field v-model="cashierData.difference" :value="calculateTotalDifferencesGlobal"
                                readonly variant="underlined" density="compact" hide-details style="width: 150px;"
                                :class="{
                                  'text-red': calculateTotalDifferencesGlobal1 < 0,
                                  'text-green': calculateTotalDifferencesGlobal1 >= 0
                                }"></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row class="mb-4 mt-1" dense no-gutters>
                            <v-col cols="12" md="6" class="text-h6">Comentario:</v-col>
                            <v-col cols="12" md="12" class="text-center">
                              <v-textarea v-if="cashierData.difference !== 0" v-model="cashierData.description"
                                variant="underlined" density="compact" :rules="descriptionRules"></v-textarea>
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
                  <!--<v-btn color="#E7E9E9" variant="flat" @click="prevStep">Volver</v-btn>-->
                  <v-spacer></v-spacer>
                  <!--<v-btn color="#E7E9E9" :disabled="cashierData.details.length === 0" variant="flat"
                    @click="nextStep">Siguiente</v-btn>-->
                  <v-btn color="#F18254" :disabled="!valid" variant="flat" @click="saveCloseBox"
                    :loading="!loadingBonus">
                    Cerrar Caja
                  </v-btn>
                </v-row>
              </v-container>
            </template>
          </v-stepper>
        </v-form>
      </v-card-text>
    </v-card>

  </v-dialog>
  <!-- Dialogo de confirmación pasar de página-->
  <v-dialog v-model="dialogDeleteParcial" max-width="600px">
    <v-card>
      <v-toolbar color="#F18254">
        <span class="text-subtitle-2 ml-4"> Confirmar</span>
      </v-toolbar>

      <v-card-text class="mt-2 mb-2"> ¿Está seguro(a) que la información registrada es correcta?</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#E7E9E9" variant="flat" @click="dialogDeleteParcial = false">
          Cancelar
        </v-btn>
        <v-btn color="#F18254" variant="flat" @click="nextStepCashier">
          Aceptar
        </v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogDeleteDiario" max-width="600px">
    <v-card>
      <v-toolbar color="#F18254">
        <span class="text-subtitle-2 ml-4"> Confirmar</span>
      </v-toolbar>

      <v-card-text class="mt-2 mb-2"> ¿Está seguro(a) que la información registrada es correcta?</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#E7E9E9" variant="flat" @click="dialogDeleteDiario = false">
          Cancelar
        </v-btn>
        <v-btn color="#F18254" variant="flat" @click="nextStep">
          Aceptar
        </v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- End Dialogo de confirmación pasar de página-->
  <v-dialog v-model="dialogDetails" max-width="500">
    <v-card>
      <v-toolbar color="#F18254">
        <span class="text-subtitle-1  ml-2">Agregar Métodos de Ingresos</span>
      </v-toolbar>
      <v-card-text>
        <v-select v-model="newDetail.type" :items="paymentOptions" item-title="name" item-value="type"
          label="Métodos de Ingresos" class="mb-4" variant="underlined" prepend-icon="mdi-cash-multiple"></v-select>

        <v-text-field v-model="newDetail.value" variant="underlined" label="Valor" type="number"
          prepend-icon="mdi-currency-usd"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#E7E9E9" variant="flat" @click="dialogDetails = false">
          Cancelar
        </v-btn>
        <v-btn color="#F18254" variant="flat" :disabled="!newDetail.type || !newDetail.value" @click="addDetail">
          Aceptar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!--end Cierre de caja-->
  <v-dialog v-model="dialogRequest" width="500">
    <v-card>
      <v-toolbar color="#F18254">
        <span class="text-subtitle-2 ml-4"> Solicitud de Eliminación de producto / servicio</span>
      </v-toolbar>

      <v-card-text class="mt-2 mb-2">


        <v-alert variant="outlined" type="warning" prominent border="top">
          Solicitud de eliminación en espera de aprobación
        </v-alert>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-btn color="default" variant="flat" @click="closeDeleteP">Cancelar</v-btn>
        <v-btn color="warning" variant="flat" @click="requestDelete">Aceptar</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>

    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogDelete" max-width="600px">
    <v-card>
      <v-toolbar color="red">
        <span class="text-subtitle-2 ml-4"> Eliminar Carro</span>
      </v-toolbar>

      <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el carro seleccionado?</v-card-text>
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
  <v-dialog v-model="dialogPay" max-width="800px">
    <v-card>
      <v-toolbar color="#F18254">
        <span class="text-subtitle-1  ml-2">Pagar Carro</span>
        <v-spacer></v-spacer>
        <span class="text-subtitle-1 mr-3">
          Monto a pagar {{ formatNumber(this.editedItem.amount) }} </span>
      </v-toolbar>

      <v-card-text>
        <v-form v-model="valid" enctype="multipart/form-data">
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.cash" clearable label="Efectivo" prepend-icon="mdi-cash"
                  variant="underlined" :rules="pago">
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.creditCard" clearable label="Tarjeta de Crédito"
                  prepend-icon="mdi-credit-card" variant="underlined" :rules="pago">
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.debit" clearable label="Debito" prepend-icon="mdi-credit-card-outline"
                  variant="underlined" :rules="pago">
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.transfer" clearable label="Transferencia"
                  prepend-icon="mdi-bank-transfer" variant="underlined" :rules="pago">
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.other" clearable label="Otro Método" prepend-icon="mdi-check"
                  variant="underlined" :rules="pago">
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.tip" clearable label="Propina" prepend-icon="mdi-currency-usd"
                      variant="underlined" :rules="pago">
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-select v-model="selectedOption" :items="options" label="Método de pago" variant="underlined"
                      hide-details></v-select>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field clearable v-model="editedCard.cardGiftUser_id" label="Tarjeta de regalo (código)"
                  prepend-icon="mdi-gift" variant="underlined"
                  :rules="customCardGiftValidation"></v-text-field><!--@input="onCardGiftSelected"-->
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-if="mostrarOtroCampo" v-model="editedCard.value" clearable label="Valor"
                  prepend-icon="mdi-currency-usd" variant="underlined" :disabled="true">
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="editedItem.cardGif" clearable label="Cantidad" prepend-icon="mdi-currency-usd"
                  variant="underlined" :rules=[customValidation] v-if="mostrarOtroCampo">
                </v-text-field>
              </v-col>
            </v-row>

          </v-container>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="closeDialogPay">
              Cancelar
            </v-btn>
            <v-btn color="#F18254" variant="flat" @click="savePay" :disabled="!valid" :loading="!loadingPayCar">
              Aceptar
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogDetallesCar" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar color="#F18254">
        <v-row>
          <v-col cols="12" md="7">
            <span class="text-subtitle-2 ml-4"> Detalles del Carro</span>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" md="5" class="text-center">
            <v-btn color="#E7E9E9" variant="flat" @click="showService(this.car_ref)" prepend-icon="mdi-list-box-outline"
              class="mr-1" :disabled="this.car_ref.pay == 1 || this.car_ref.state == 2 ? true : false">
              Agregar Servicio
            </v-btn>
            <v-btn color="#E7E9E9" variant="flat" @click="showProduct(this.car_ref)" prepend-icon="mdi-tag-outline"
              :disabled="this.car_ref.pay == 1 ? true : false">
              Agregar Producto
            </v-btn>
          </v-col>
        </v-row>
      </v-toolbar>

      <v-card-text class="mt-2 mb-2">
        <v-text-field class="mt-1 mb-1" v-model="search2" append-icon="mdi-magnify" label="Buscar" single-line
          hide-details></v-text-field>

        <v-data-table :headers="headers2" :items="orders" :search="search2" class="elevation-1"
          :items-per-page-text="'Elementos por páginas'" no-results-text="No hay datos disponibles"
          no-data-text="No hay datos disponibles" :loading="loadingOrders" loading-text="Cargando datos...">

          <template v-slot:item.image="{ item }">

            <v-avatar elevation="3" color="grey-lighten-4" size="large">
              <v-img :src="'https://testapi.simplifies.cl/api/images/' + item.image" alt="image"></v-img>
            </v-avatar>

          </template>
          <template v-slot:item.price="{ item }">
            {{ formatNumber(item.price) }}
          </template>
          <template v-slot:item.actions="{ item }">
            <template v-if="item.id !== null">
              <v-btn density="comfortable" icon="mdi-cancel"
                :color="(item.request_delete != 3) ? 'red-darken-4' : 'grey'" title="Solicitar eliminar orden"
                @click="item.request_delete != 3 && deleteOrder(item)" elevation="1" class="mr-1 mt-1 mb-1">
              </v-btn>

              <!--<v-btn :color="(item.request_delete && !this.car_ref.pay) ? 'blue' : 'grey'" density="comfortable" icon="mdi-check"
                    title="Denegar solicitud" @click="(item.request_delete && !this.car_ref.pay) && requestCancel(item)" elevation="1" class="mr-1 mt-1 mb-1"></v-btn>-->
            </template>
          </template>

        </v-data-table>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#E7E9E9" variant="flat" @click="closeDelete">
          Volver
        </v-btn>

        <v-btn color="#F18254" variant="flat" :disabled="this.car_ref.state != 1 ? true : false"
          @click="payItem(this.car_ref)">
          Marcar como Pagado
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!--AddProducts-->
  <v-dialog v-model="showAddProducts" max-width="500px">

    <v-card>
      <v-toolbar color="#F18254">
        <span class="text-subtitle-2 ml-4"> Agregar Producto</span>
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" enctype="multipart/form-data">
          <v-row>
            <v-col cols="12" md="12">
              <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="product_store_id" :items="products"
                clearable label="Productos" prepend-icon="mdi-tag-outline" item-title="name" item-value="id"
                variant="underlined" :rules="selectRules" @update:model-value="cantExist">
                <!--chips
              closable-chips<template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :prepend-avatar="'https://testapi.simplifies.cl/api/images/'+item.raw.image_product"
                  :text="item.raw.name"
                ></v-chip>
              </template>-->
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props"
                    :prepend-avatar="'https://testapi.simplifies.cl/api/images/' + item.raw.image_product"
                    :title="item.raw.name">
                    <v-list-item-subtitle class="d-flex justify-space-between">
                      Existencia: {{ item.raw.product_exit }}
                      Precio: {{ this.formatNumber(item.raw.price) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-autocomplete>
              <v-text-field v-model="product_exit" clearable label="Existencia" prepend-icon="mdi-cube-outline"
                variant="underlined" disabled="true">
              </v-text-field>
              <v-text-field v-model="cant" clearable label="Cantidad" prepend-icon="mdi-cart" variant="underlined"
                :rules=[validateCantidad]>
              </v-text-field>
            </v-col>


          </v-row>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="#E7E9E9" variant="flat" @click="closeAddProduct">
              Cancelar
            </v-btn>
            <v-btn color="#F18254" variant="flat" @click="saveAddProduct" :disabled="!valid" :loading="loadingProd">
              Aceptar
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
  <!--EndAddProducts-->
  <!--AddServices-->
  <v-dialog v-model="showAddServices" max-width="500px">
    <v-card>
      <v-toolbar color="#F18254">
        <span class="text-subtitle-2 ml-4"> Agergar Servicio</span>
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" enctype="multipart/form-data">
          <v-row>
            <v-col cols="12" md="12">
              <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_service_professional_id"
                :items="services" clearable label="Servicios" prepend-icon="mdi-list-box-outline" item-title="name"
                item-value="id" variant="underlined" :rules="selectRules">
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props"
                    :prepend-avatar="'https://testapi.simplifies.cl/api/images/' + item.raw.image_service"
                    :title="item.raw.name">
                    <v-list-item-subtitle class="d-flex justify-space-between">
                      Precio: {{ this.formatNumber(item.raw.price_service) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="#E7E9E9" variant="flat" @click="closeAddService">
              Cancelar
            </v-btn>
            <v-btn color="#F18254" variant="flat" @click="saveAddServie" :disabled="!valid" :loading="loadingServ">
              Aceptar
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
  <!--EndAddServices-->
  <v-dialog v-model="dialogBox" max-width="800px">
    <v-card>
      <v-toolbar color="#F18254">
        <span class="text-subtitle-2 ml-4">Actualizar Caja</span>
      </v-toolbar>

      <v-card-text>
        <v-form v-model="valid" enctype="multipart/form-data">
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="editedBox.cashFound" clearable label="Fondo en Caja" prepend-icon="mdi-safe"
                  variant="underlined" :rules="pago">
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="editedBox.existence" clearable label="Existencia" prepend-icon="mdi-check-circle"
                  variant="underlined" :rules="pago" :disabled="true">
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="editedBox.extraction" clearable label="Extracción"
                  prepend-icon="mdi-arrow-down-bold" variant="underlined" :rules="[checkExtraction]"
                  :disabled="!editedBox.existence">
                </v-text-field>
              </v-col>
              <!-- Campos adicionales -->
            </v-row>
            <v-row>
              <!-- Campos adicionales -->
              <v-col v-if="this.showAdditionalFields" cols="12" md="6">
                <v-file-input v-model="file" ref="fileInput" name="file" label="Archivo" prepend-icon="mdi-paperclip"
                  variant="underlined" :rules="selectRules"
                  accept=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .odt, .ods, .odp, .rtf, .html, .xml, .csv, .png, .jpg, .jpeg"
                  @change="onFileSelected">
                </v-file-input>
              </v-col>
              <v-col v-if="this.showAdditionalFields" cols="12" md="6">
                <v-text-field v-model="editedBox.comment" label="Comentario" variant="underlined" :rules="selectRules">
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="closeDialogBox">
              Cancelar
            </v-btn>
            <v-btn color="#F18254" variant="flat" @click="saveBox" :disabled="!valid">
              Aceptar
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
  <!--Clientes atendidos crros pagados-->
  <v-dialog v-model="dialogDetallesCarPagado" fullscreen transition="dialog-bottom-transition">

    <v-card>
      <v-toolbar color="#F18254">
        <v-row>
          <v-col cols="12" md="9">
            <span class="text-subtitle-2 ml-4"> Clientes atendidos</span>
          </v-col>
        </v-row>
      </v-toolbar>

      <v-card-text class="mt-2 mb-2">

        <v-text-field class="mt-1 mb-1" v-model="search3" append-icon="mdi-magnify" label="Buscar" single-line
          hide-details></v-text-field>


        <v-data-table :headers="headers3" :items-per-page-text="'Elementos por páginas'" :items="filteredItemsPay"
          :search="search3" class="elevation-1" no-results-text="No hay datos disponibles"
          no-data-text="No hay datos disponibles">

          <template v-slot:item.professionalName="{ item }">

            <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
              <v-img :src="'https://testapi.simplifies.cl/api/images/' + item.image_url" alt="image"></v-img>
            </v-avatar>
            {{ item.professionalName }}
          </template>

          <template v-slot:item.clientName="{ item }">

            <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
              <v-img :src="'https://testapi.simplifies.cl/api/images/' + item.client_image" alt="image"></v-img>
            </v-avatar>
            {{ item.clientName }}
          </template>

          <template v-slot:item.pay="{ item }">
            <v-chip :color="parseInt(item.pay) === '0' ? 'red' : 'green'" :text="item.pay" class="text-uppercase" label
              size="small">
              {{ item.pay === '0' ? 'Pendiente' : 'Pagado' }}
            </v-chip>
          </template>
          <template v-slot:item.phone="{ item }">
            <td>
              <a href="#" @click.prevent="openWhatsApp(item.phone)">{{ item.phone }}</a>
            </td>
          </template>
          <template v-slot:item.technical_assistance="{ item }">
            {{ formatNumber(item.technical_assistance) }}
          </template>
          <template v-slot:item.product="{ item }">
            {{ formatNumber(item.product) }}
          </template>
          <template v-slot:item.service="{ item }">
            {{ formatNumber(item.service) }}
          </template>
          <template v-slot:item.tip="{ item }">
            {{ formatNumber(item.tip) }}
          </template>
          <template v-slot:item.amount="{ item }">
            {{ formatNumber(item.amount) }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn density="comfortable" icon="mdi-pencil"
              @click="(item.pay == 1 && (item.active === 0 || item.active === 1)) && editingRequest(item, 2)"
              :color="(item.pay == 1 && (item.active === 0 || item.active === 1)) ? 'primary-darken-1' : 'grey'"
              variant="tonal" elevation="1" class="mr-1 mt-1 mb-1" title="Editar el carro"></v-btn>
            <v-btn density="comfortable" icon="mdi-delete"
              @click="(item.pay == 1 && (item.active === 0 || item.active === 1)) && editingRequest(item, 3)"
              :color="(item.pay == 1 && (item.active === 0 || item.active === 1)) ? 'red-darken-4' : 'grey'"
              variant="tonal" elevation="1" title="Solicitud de eliminar carro"></v-btn>
          </template>
          <template v-slot:item.action_descriptions="{ item }">
            <v-menu location="top" open-on-hover max-width="500px">
              <template v-slot:activator="{ props }">
                <v-chip 
        v-bind="props"
        color="indigo-darken-2" 
        small
        class="px-2"
      >
        <v-icon left color="indigo-darken-2" icon="mdi-clipboard-text-outline"/>
        {{ item.action_descriptions.length}}
      </v-chip>
              </template>

              <v-card class="pa-2" style="max-height: 300px; overflow-y: auto;">
                <div v-for="(action, index) in item.action_descriptions" :key="index" class="mb-2">
                  <div class="d-flex align-start">
                    <v-icon :color="getActionColor(action.action_type)" :icon="getActionIcon(action.action_type)" />
                    <div class="ml-2">
                      <div class="d-flex align-center">
                        <strong>{{ getActionTitle(action.action_type) }}</strong>
                      </div>
                      <div class="text-body-2">{{ action.description }}</div>
                      <div class="text-caption text-grey">
                        {{ getActionDetails(action) }} • {{ formatDateTime(action.timestamp) }}
                      </div>
                    </div>
                  </div>
                  <v-divider v-if="index < item.action_descriptions.length - 1" class="my-2" />
                </div>
              </v-card>
            </v-menu>
          </template>
          <template v-slot:item.change_log="{ item }">
            <v-menu location="top" open-on-hover max-width="500px">
              <template v-slot:activator="{ props }">
                <v-chip 
        v-bind="props"
        color="teal-darken-3"
        small
        class="px-2"
      >
        <v-icon left color="teal-darken-3" icon="mdi-history"/>
        {{ item.change_log.length }}
      </v-chip>
              </template>

              <v-card class="pa-2" style="max-height: 300px; overflow-y: auto;">
                <div v-for="(change, index) in item.change_log" :key="index" class="mb-2">
                  <div class="d-flex align-start">
                    <v-icon :color="getActionColor(change.action_type)" :icon="getActionIcon(change.action_type)" />
                    <div class="ml-2">
                      <div class="d-flex align-center">
                        <strong>{{ getActionTitle(change.action_type) }}</strong>
                      </div>
                      <div class="text-body-2">{{ change.changes }}</div>
                      <div class="text-caption text-grey">
                        {{ getActionDetails(change) }} • {{ formatDateTime(change.timestamp) }}
                      </div>
                    </div>
                  </div>
                  <v-divider v-if="index < item.change_log.length - 1" class="my-2" />
                </div>
              </v-card>
            </v-menu>
          </template>
          <template v-slot:top>

            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
          </template>

        </v-data-table>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#E7E9E9" variant="flat" @click="closeDelete">
          Volver
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!--End clientes atendidos-->
  <!--SaleProduct-->
  <v-dialog v-model="showDialogSaleProducts" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar color="#F18254">
        <v-row>
          <v-col cols="12" md="9">
            <span class="text-subtitle-2 ml-3">Venta de productos</span>
          </v-col>
          <v-col cols="12" md="3" class="text-center">
            <v-btn @click="showSalegProduct" color="#E7E9E9" variant="flat" elevation="2" prepend-icon="mdi-cart">
              Productos
            </v-btn>
          </v-col>
        </v-row>
      </v-toolbar>

      <v-card-text class="mt-2 mb-2">
        <v-text-field class="mt-1 mb-1" v-model="search4" append-icon="mdi-magnify" label="Buscar" single-line
          hide-details></v-text-field>


        <v-data-table v-model="selected" :headers="headers4" :items-per-page-text="'Elementos por páginas'"
          :items="cashierSalesProf" :search="search4" class="elevation-1" no-results-text="No hay datos disponibles"
          no-data-text="No hay datos disponibles" :item-selectable="isSelectable" show-select :loading="loadingCashier"
          loading-text="Cargando datos...">

          <template v-slot:item.name="{ item }">

            <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
              <v-img :src="'https://testapi.simplifies.cl/api/images/' + item.image_product" alt="image"></v-img>
            </v-avatar>
            {{ item.name }}
          </template>
          <template v-slot:item.pay="{ item }">
            <v-chip :color="parseInt(item.pay) === 0 ? 'red' : (parseInt(item.pay) === 1 ? 'green' : 'gray')"
              :text="item.pay" class="text-uppercase" label size="small">
              {{ parseInt(item.pay) === 0 ? 'Pendiente' : (parseInt(item.pay) === 1 ? 'Pagado' : 'Solicitud') }}
            </v-chip>
          </template>
          <template v-slot:item.price="{ item }">
            {{ formatNumber(item.price) }}
          </template>
          <template v-slot:item.sale_price="{ item }">
            {{ formatNumber(item.sale_price) }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-close"
              @click="(item.pay == 0) ? editItemProduct(item) : ''" :color="(item.pay != 0) ? 'grey' : 'red-darken-4'"
              variant="tonal" elevation="1" title="Solicitar Eliminar Producto"></v-btn>
          </template>
          <template v-slot:top>

            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
          </template>

        </v-data-table>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#F18254" variant="flat" @click="openDialogPaySales" :disabled="!selected.length > 0">
          Pagar
        </v-btn>
        <v-btn color="#E7E9E9" variant="flat" @click="closeDialogSaleProduct">
          Volver
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showSaleProducts" max-width="500px">
    <v-card>
      <v-toolbar color="#F18254">
        <span class="text-subtitle-2 ml-4"> Agregar Producto</span>
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" enctype="multipart/form-data">
          <v-row>
            <v-col cols="12" md="12">
              <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="product_store_id" :items="products"
                clearable label="Productos" prepend-icon="mdi-tag-outline" item-title="name" item-value="id"
                variant="underlined" :rules="selectRules" @update:model-value="cantExist">
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props"
                    :prepend-avatar="'https://testapi.simplifies.cl/api/images/' + item.raw.image_product"
                    :title="item.raw.name"><v-list-item-subtitle class="d-flex justify-space-between">
                      Existencia: {{ item.raw.product_exit }}
                      Precio: {{ this.formatNumber(item.raw.price) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-autocomplete>
              <v-text-field v-model="product_exit" clearable label="Existencia" prepend-icon="mdi-cube-outline"
                variant="underlined" disabled="true">
              </v-text-field>
              <v-text-field v-model="cant" clearable label="Cantidad" prepend-icon="mdi-cart" variant="underlined"
                :rules=[validateCantidad]>
              </v-text-field>
            </v-col>


          </v-row>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="#E7E9E9" variant="flat" @click="closeSaleProduct">
              Cancelar
            </v-btn>
            <v-btn color="#F18254" variant="flat" @click="saveProductSale" :disabled="!valid" :loading="loadingProd">
              Aceptar
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogPaySales" max-width="800px">
    <v-card>
      <v-toolbar color="#F18254">
        <span class="text-subtitle-1  ml-2">Pagar Productos Vendidos</span>
        <v-spacer></v-spacer>
        <span class="text-subtitle-1 mr-3">
          Monto a pagar {{ formatNumber(amountSales) }} </span>
      </v-toolbar>

      <v-card-text>
        <v-form v-model="valid" enctype="multipart/form-data">
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.cash" clearable label="Efectivo" prepend-icon="mdi-cash"
                  variant="underlined" :rules="pago">
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.creditCard" clearable label="Tarjeta de Crédito"
                  prepend-icon="mdi-credit-card" variant="underlined" :rules="pago">
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="editedItem.debit" clearable label="Debito" prepend-icon="mdi-credit-card-outline"
                  variant="underlined" :rules="pago">
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="editedItem.transfer" clearable label="Transferencia"
                  prepend-icon="mdi-bank-transfer" variant="underlined" :rules="pago">
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="editedItem.other" clearable label="Otro Método" prepend-icon="mdi-check"
                  variant="underlined" :rules="pago">
                </v-text-field>
              </v-col>
            </v-row>
            <!--<v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="editedItem.tip" clearable label="Propina" prepend-icon="mdi-currency-usd"
                      variant="underlined" :rules="pago">
                    </v-text-field>
                  </v-col>
                </v-row>-->
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field clearable v-model="editedCard.cardGiftUser_id" label="Tarjeta de regalo (código)"
                  prepend-icon="mdi-gift" variant="underlined"></v-text-field><!--@input="onCardGiftSelected"-->
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-if="mostrarOtroCampo" v-model="editedCard.value" clearable label="Valor"
                  prepend-icon="mdi-currency-usd" variant="underlined" :disabled="true">
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="editedItem.cardGif" clearable label="Cantidad" prepend-icon="mdi-currency-usd"
                  variant="underlined" :rules=[customValidation] v-if="mostrarOtroCampo">
                </v-text-field>
              </v-col>
            </v-row>

          </v-container>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="closeDialogPaySales">
              Cancelar
            </v-btn>
            <v-btn color="#F18254" variant="flat" @click="savePaySales" :disabled="!valid">
              Aceptar
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
  <!--endSaleProduct-->
  <!--Bonus-->
  <v-dialog v-model="showDialogBonus" max-width="800px" transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar color="#F18254">
        <v-row>
          <v-col cols="12" md="8">
            <span class="text-subtitle-2 ml-3">Bonos de profesionales</span>
          </v-col>
          <v-col cols="12" md="4" class="text-center">
            <v-btn @click="exportToExcel" color="#E7E9E9" variant="flat" elevation="2" prepend-icon="mdi-file-excel">
              Exportar a Excel
            </v-btn>
          </v-col>
        </v-row>
      </v-toolbar>

      <v-card-text class="mt-2 mb-2">
        <v-text-field class="mt-1 mb-1" v-model="search8" append-icon="mdi-magnify" label="Buscar" single-line
          hide-details></v-text-field>


        <v-data-table :headers="headers8" :items-per-page-text="'Elementos por páginas'" :items="bonus"
          :search="search8" class="elevation-1" no-results-text="No hay datos disponibles"
          no-data-text="No hay datos disponibles" :loading="loadingBonus" loading-text="Cargando datos...">

          <template v-slot:item.name="{ item }">

            <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
              <v-img :src="'https://testapi.simplifies.cl/api/images/' + item.image_url" alt="image"></v-img>
            </v-avatar>
            {{ item.name }}
          </template>
          <template v-slot:item.amount="{ item }">
            {{ formatNumber(item.amount) }}
          </template>
          <template v-slot:top>

            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
          </template>

        </v-data-table>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#E7E9E9" variant="flat" @click="showDialogBonus = false">
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--Bonus Professionals-->
  <v-dialog v-model="showDialogBonusProf" max-width="800px" transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar color="#F18254">
        <v-row>
          <v-col cols="12" md="8">
            <span class="text-subtitle-2 ml-3">Bonos por profesionales</span>
          </v-col>
          <v-col cols="12" md="4" class="text-center">
            <v-btn @click="exportToExcelProf" color="#E7E9E9" variant="flat" elevation="2"
              prepend-icon="mdi-file-excel">
              Exportar a Excel
            </v-btn>
          </v-col>
        </v-row>
      </v-toolbar>

      <v-card-text class="mt-2 mb-2">
        <v-text-field class="mt-1 mb-1" v-model="search8" append-icon="mdi-magnify" label="Buscar" single-line
          hide-details></v-text-field>


        <v-data-table :headers="headers9" :items-per-page-text="'Elementos por páginas'" :items="bonusProf"
          :search="search9" class="elevation-1" no-results-text="No hay datos disponibles"
          no-data-text="No hay datos disponibles" :loading="loadingBonusProf" loading-text="Cargando datos...">

          <template v-slot:item.name="{ item }">

            <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
              <v-img :src="'https://testapi.simplifies.cl/api/images/' + item.image_url" alt="image"></v-img>
            </v-avatar>
            {{ item.name }}
          </template>
          <template v-slot:item.amount="{ item }">
            {{ formatNumber(item.amount) }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn variant="flat" @click="(item.pay) ? '' : payBonusProf(item)" :color="(item.pay) ? 'grey' : '#F18254'"
              title="Pagar bono a profesional" style="min-width: 100px;">
              {{ item.pay ? 'Pagado' : 'Pagar' }} <!-- Cambia el texto según el estado de pay -->
            </v-btn>
          </template>
          <template v-slot:top>

            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
          </template>

        </v-data-table>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#E7E9E9" variant="flat" @click="showDialogBonusProf = false">
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--Confirmar pago de bonus-->
  <v-dialog v-model="dialogConfBonus" max-width="600px">
    <v-card>
      <v-toolbar color="#F18254">
        <span class="text-subtitle-2 ml-4"> Pagar bono</span>
      </v-toolbar>

      <v-card-text class="mt-2 mb-2"> ¿Desea pagar el bono seleccionado?</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#E7E9E9" variant="flat" @click="closeConfProf">
          Cancelar
        </v-btn>
        <v-btn color="#F18254" variant="flat" :loading="loadingBonusPay" @click="payBonus">
          Aceptar
        </v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--ver reservaciones de profesionales-->
  <v-dialog v-model="showReserPrpfessional" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar color="#F18254">
        <v-row align="center">
          <v-col cols="12" md="8" class="grow ml-4">
            <span class="text-h8">
              <strong>Reservas del profesional</strong></span>
          </v-col>
        </v-row>
      </v-toolbar>
      <v-container fluid>
        <v-card-text>
          <v-row>

            <v-row>

            </v-row>
            <div class="fixed-size-calendar">
              <v-sheet>

                <v-row>
                  <v-col cols="12" sm="12" md="3">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches"
                      v-if="this.mostrarFila" label="Seleccione una Sucursal" prepend-inner-icon="mdi-store"
                      item-title="name" item-value="id" density="compact" class="ma-2" variant="outlined"
                      @update:model-value="showReservations()"></v-autocomplete><!--@update:model-value="initialize()"-->
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="professional_idR"
                      :items="professionals" label="Profesional" prepend-inner-icon="mdi-account-tie-outline"
                      item-title="name" item-value="id" variant="outlined" density="compact" class="ma-2"
                      :rules="selectRules"><!--@update:model-value="showReservationsProfessional()"-->
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props"
                          :prepend-avatar="'https://testapi.simplifies.cl/api/images/' + item.raw.image_url"
                          :subtitle="'Cargo: ' + item.raw.charge" :title="item.raw.name"></v-list-item>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <!--<v-col cols="12" md="3">
                <v-select v-model="type" :items="types" class="ma-2" label="Modo de vista" variant="outlined"
                  density="compact" hide-details></v-select>
              </v-col>-->
                  <v-col cols="12" md="1">
                    <v-btn :disabled="!this.professional_idR" icon @click="showReservationsProfessional()"
                      color="#F18254">
                      <v-icon>mdi-magnify</v-icon></v-btn>
                  </v-col>
                </v-row>
                <v-calendar ref="calendar" v-model="value" :events="events" locale="es" :event-color="getEventColor"
                  class="fixed-size-calendar" text="Hoy" type="month">
                  <template v-slot:event="{ event }">
                    <div class="event-title">
                      {{ event.title }}
                    </div>
                  </template>
                </v-calendar>
              </v-sheet>
            </div>

          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#E7E9E9" variant="flat" @click="closeCalendar"> Volver </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
  <!-- Diálogo donde se mostrarán los detalles de las rutas -->
  <v-dialog v-model="dialogCoexistence" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <Coexistence :branch_id="this.branch_id" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="flat" color="#E7E9E9" @click="closeCoexistence">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogEditingRequest" max-width="600px">
    <v-card>
      <v-toolbar color="#F18254">
        <span v-if="this.indexEditingRequest === 2" class="text-subtitle-2 ml-4">Editar Carro</span>
        <span v-else-if="this.indexEditingRequest === 3" class="text-subtitle-2 ml-4">Eliminar Carro</span>
      </v-toolbar>

      <v-card-text>
        <v-form v-model="valid" enctype="multipart/form-data">
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="12">
                <v-textarea v-model="editedCar.description" clearable label="Motivo de la solicitud"
                  prepend-icon="mdi-safe" variant="underlined" :rules="descriptionRules">
                </v-textarea>
              </v-col>
            </v-row>
          </v-container>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="cancelEditingRequest">
              Cancelar
            </v-btn>
            <v-btn color="#F18254" variant="flat" @click="saveEditingRequest" :disabled="!valid">
              Aceptar
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

import axios from "axios";
import LocalStorageService from "@/LocalStorageService";
import * as XLSX from 'xlsx';
import { format } from "date-fns";
import { VCalendar } from 'vuetify/labs/VCalendar';
import Coexistence from "../coexistence/Coexistence.vue";
import { handleRequest } from "@/utils/api";
import ProductStoreStatus from "../productstorestatus/ProductStoreStatus.vue";
import _ from 'lodash';
import { cloneDeep } from "lodash";

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

export default {
  components: {
    VCalendar,
    Coexistence,
    ProductStoreStatus
  },

  data: () => ({
    tab: "caja", // Controla la ventana activa
    tabCashier: "caja", // Controla la ventana activa
    showReserPrpfessional: false,
    reservations: [],
    type: 'month',
    //steep
    hasInvalidState: false,
    hasInvalidStateProduct: false,
    currentStep: 1,
    step: 1,
    items: [
      'Inventario',
      'Convivencias',
      'Bonos',
      'Ingresos',
      'Gastos',
      'Resumen',
    ],
    stepCashier: 1,
    itemsCashier: [
      'Inventario',
      'Ingreso',
      'Gastos',
      'Resumen'
    ],
    //end steep
    types: [
      { title: 'Mes', value: 'month' },
      //{ title: 'Semana', value: 'week' },
      //{ title: 'Día', value: 'day' }
    ],
    dayLabels: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    monthLabels: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    today: new Date(),
    focus: '',
    value: [new Date()],
    weekday: [0, 1, 2, 3, 4, 5, 6],
    weekdays: [
      { title: 'Dom - Sáb', value: [0, 1, 2, 3, 4, 5, 6] },
      { title: 'Lun - Dom', value: [1, 2, 3, 4, 5, 6, 0] },
      { title: 'Lun - Vie', value: [1, 2, 3, 4, 5] },
      { title: 'Lun, Mié, Vie', value: [1, 3, 5] },
    ],
    events: [],
    professionals: [],
    cashierBoxClose: [],
    colors: [
      'blue',
      'green',
      'orange',
    ],
    dialogEditingRequest: false,
    indexEditingRequest: null,
    valid: true,
    loadingcar: true,
    loadingOrders: true,
    loadingCashier: true,
    loadingBonus: true,
    loadingPayCar: true,
    loadingBonusPay: false,
    loadingBonusProf: true,
    loadingBonusStep: false,
    loadingProd: false,
    loadingServ: false,
    mostrarFila: false,
    dialogCoexistence: false,
    car_ref: "",
    dialogCloseBoxing: false,
    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
    dialogDetallesCarPagado: false,
    search: '',
    search2: '',
    search3: '',
    dialog: false,
    dialogDeleteParcial: false,
    dialogDeleteDiario: false,
    dialogDetails: false,
    dialogParcial: false,
    dialogDetallesCar: false,
    dialogRequest: false,
    dialogDelete: false,
    dialogConfBonus: false,
    dialogPay: false,
    dialogBox: false,
    loading: false,
    bonus_ref: [],
    branch_id: null,
    charge_id: '',
    business_id: '',
    nameBranch: '',
    nameProfessional: '',
    professional_id: '',
    user_id: '',
    professional_idR: '',
    results: [],
    resultsPagado: [],
    orders: [],
    box: [],
    branches: '',
    cardGifts: [],
    mostrarCode: false,
    mostrarOtroCampo: false,
    ejecutado: false,
    ejecutadoCashier: false,
    closed_box: true,
    showAddServices: false,
    services: [],
    branch_service_professional_id: '',
    showAddProducts: false,
    products: [],
    product_exit: '',
    cant: '',
    priceService: '',
    product_store_id: '',
    intervalId: null,
    showSaleProducts: false,
    showDialogSaleProducts: false,
    cashierSales: [],
    cashierSalesProf: [],
    boxClose: [],
    search4: '',
    selected: [],
    bonus: [],
    bonusProf: [],
    amountSales: '',
    dialogPaySales: false,
    bonusPay: 0,
    payments: [],
    headers: [
      { title: 'No', value: 'id' },
      { title: 'Profesional', value: 'professionalName' },
      { title: 'Cliente', value: 'clientName' },
      { title: 'Técnico', value: 'technical_assistance' },
      { title: 'Productos', value: 'product' },
      { title: 'Servicios', value: 'service' },
      { title: 'Propina', value: 'tip' },
      { title: 'Monto Total', value: 'amount' },
      { title: 'Estado', value: 'state' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    headers3: [
      { title: 'No', value: 'id', sortable: true },
      { title: 'Profesional', value: 'professionalName', sortable: true },
      { title: 'Cliente', value: 'clientName', sortable: true },
      { title: 'Teléfono', key: 'phone', sortable: false },
      { title: 'Técnico', value: 'technical_assistance' },
      { title: 'Productos', value: 'product' },
      { title: 'Servicios', value: 'service' },
      { title: 'Propina', value: 'tip' },
      { title: 'Monto Total', value: 'amount', sortable: true },
      { title: 'Estado', value: 'pay' },
      { title: 'Solicitudes', value: 'action_descriptions' },
      { title: 'Cambios', value: 'change_log' },
      { title: 'Acciones', value: 'actions' },
    ],

    headers2: [
      { title: 'Referencia', value: 'id' },
      { title: 'Imagen', value: 'image' },
      { title: 'Nombre', value: 'name' },
      { title: 'Categoría', value: 'category' },
      { title: 'Importe', value: 'price' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    headers4: [
      { title: 'Producto', value: 'name' },
      { title: 'Precio', value: 'sale_price' },
      { title: 'Cantidad', value: 'cant' },
      { title: 'Importe', value: 'price' },
      { title: 'Estado', value: 'pay' },
      { title: 'Acciones', value: 'actions' },
    ],
    headers8: [
      { title: 'Profesional', value: 'name' },
      { title: 'Tipo', value: 'bonus' },
      { title: 'Importe', value: 'amount' }
    ],
    headers9: [
      { title: 'Profesional', value: 'name' },
      { title: 'Tipo', value: 'bonus' },
      { title: 'Importe', value: 'amount' },
      { title: 'Acción', value: 'actions' },
    ],
    showDialogBonus: false,
    showDialogBonusProf: false,
    search8: '',
    search9: '',
    editedIndex: -1,
    editedCar: {
      id: '',
      active: '',
      description: '',
    },
    defaultCar: {
      id: '',
      active: '',
      description: '',
    },
    editedItem: {
      id: '',
      order_id: '',
      car_id: '',
      request_delete: '',
      tip: '',
      cash: '',
      creditCard: '',
      debit: '',
      transfer: '',
      professional_id: '',
      other: '',
      amount: '',
      cardGif: '',
      tipByCash: 'Débito'
    },
    editedCloseBox: {
      id: '',
      totalCash: '',
      totalService: '',
      totalProduct: '',
      totalTip: '',
      totalCreditCard: '',
      totalMount: '',
      totalDebit: '',
      totalTransfer: '',
      totalOther: '',
      totalCardGif: '',
      advancement: '',
      totalBonus: '',
    },
    cashierData: {
      id: '',
      totalCash: '',
      totalService: '',
      totalProduct: '',
      totalTip: '',
      totalCreditCard: '',
      totalMount: '',
      totalDebit: '',
      totalTransfer: '',
      totalOther: '',
      totalCardGif: '',
      existence: '',
      cashFound: '',
      extraction: '',
      advancement: '',
      totalBonus: '',
      difference: '',
      description: '',
      differenceAccounts: '',
      differencePay: '',
      differenceBox: '',
      details: [
        { id: 1, type: 'totalCreditCard', value: 0, name: 'Tarjeta Crédito' },
        { id: 2, type: 'totalDebit', value: 0, name: 'Débito' },
        { id: 3, type: 'totalTransfer', value: 0, name: 'Transferencia' },
        { id: 4, type: 'existence', value: 0, name: 'Efectivo' },
        { id: 5, type: 'totalOther', value: 0, name: 'Otros' },
        { id: 6, type: 'totalCardGif', value: 0, name: 'Tarjeta Regalo' }
      ]
    },
    defaultcashierData: {
      id: '',
      totalCash: '',
      totalService: '',
      totalProduct: '',
      totalTip: '',
      totalCreditCard: '',
      totalMount: '',
      totalDebit: '',
      totalTransfer: '',
      totalOther: '',
      totalCardGif: '',
      existence: '',
      cashFound: '',
      extraction: '',
      advancement: '',
      totalBonus: '',
      difference: '',
      description: '',
      differenceAccounts: '',
      differencePay: '',
      differenceBox: '',
      details: [
        { id: 1, type: 'totalCreditCard', value: 0, name: 'Tarjeta Crédito' },
        { id: 2, type: 'totalDebit', value: 0, name: 'Débito' },
        { id: 3, type: 'totalTransfer', value: 0, name: 'Transferencia' },
        { id: 4, type: 'existence', value: 0, name: 'Efectivo' },
        { id: 5, type: 'totalOther', value: 0, name: 'Otros' },
        { id: 6, type: 'totalCardGif', value: 0, name: 'Tarjeta Regalo' }
      ]
    },
    paymentOptions: [],
    newDetail: {
      id: null,
      type: '',
      value: 0
    },
    editedCard: {
      cardGiftUser_id: '',
      code: '',
    },
    defaultCard: {
      cardGiftUser_id: '',
      code: '',
    },
    defaultCloseBox: {
      id: '',
      totalCash: '',
      totalService: '',
      totalProduct: '',
      totalTip: '',
      totalCreditCard: '',
      totalMount: '',
      totalDebit: '',
      totalTransfer: '',
      totalOther: '',
      totalCardGif: '',
      advancement: '',
      totalBonus: ''
    },
    editedBox: {
      branch_id: '',
      id: '',
      cashFound: '',
      existence: '',
      extraction: '',
      comment: '',
      file: '',
      nameProfessional: ''

    },
    defaultBox: {
      branch_id: '',
      cashFound: '',
      existence: '',
      extraction: '',
      comment: '',
      file: '',
      nameProfessional: ''
    },
    data: {},

    defaultItem: {
      id: '',
      order_id: '',
      car_id: '',
      request_delete: '',
      tip: '',
      cash: '',
      creditCard: '',
      debit: '',
      transfer: '',
      professional_id: '',
      other: '',
      amount: '',
      cardGif: '',
      tipByCash: 'Débito'
    },

    selectedOption: 'Débito',
    options: ['Débito', 'Efectivo', 'Transferencia', 'Tarjeta de regalo', 'Tarjeta de Crédito', 'Otro Método'],
    showAdditionalFields: false,
    file: '',
    pago: [
      //(value) => !!value || 'Campo requerido',
      (value) => !value || (/^\d+(\.\d+)?$/.test(value)) || "Debe ser un número con punto decimal (10.00)",
      (value) => !value || !isNaN(parseFloat(value)) || 'Debe ser un número',],
    pago1: [
      (value) => !!value || 'Campo requerido',
      (value) => !value || !isNaN(parseFloat(value)) || 'Debe ser un número',
      (value) => /^\d+(\.\d+)?$/.test(value) || "Debe ser un número con punto decimal (10.00)",],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    descriptionRules: [
      (v) => !!v || "El campo es obligatorio", // Campo requerido
      (v) => (v && v.length <= 500) || "Máximo 500 caracteres", // Límite de caracteres
    ],
  }),

  computed: {

    filteredItems() {
      return this.results.filter(item => item.pay === 0);
    },
    filteredItemsPay() {
      return this.results.filter(item => item.pay === 1);
    },
    formTitle() {
      return 'Cierre de Caja'
    },

    customCardGiftValidation() {
      return [
        v => (this.selectedOption === 'Tarjeta de regalo' && !v)
          ? 'El código de la tarjeta de regalo es obligatorio'
          : true,
      ];
    },
    rulesCampo1() {

      if (this.editedCard.value) {
        return [
          (value) => (value <= this.editedCard.value) || 'El monto a pagar con tarjeta de regalo debe ser menor o igual que el Valor de la misma',
          (value) => value === null || (!isNaN(value) && isFinite(value)) || 'Ingresa un número válido',
        ];
      }
      else {
        return true;
      }

    },

    hasUnpaidBonus() {
      return this.bonusProf.some(item => item.pay === false);
    },
    // Diferencias calculadas
    /*calculateDifferenceExistence() {
      if (this.cashierData.existence) {
        const efectivoSistema = parseFloat(this.editedBox.existence) || 0;
        const existenciaCajera = parseFloat(this.cashierData.existence) || 0;
        const diferencia = efectivoSistema - existenciaCajera;
        return diferencia.toFixed(2); // Redondea a 2 decimales
      } else {
        return 0.00;
      }

    },*/
    calculateDifferenceExtraccion() {
      //if (this.cashierData.extraction) {
      const extraccionSistema = parseFloat(this.editedBox.extraction) || 0;
      const extraccionCajera = parseFloat(this.cashierData.extraction) || 0;
      const diferencia = extraccionCajera - extraccionSistema;
      return diferencia.toFixed(2); // Redondea a 2 decimales
      //} else {
      //return 0.00
      //}

    },
    /*calculateTotalDifferences() {
      const diferenciaExistencia = parseFloat(this.calculateDifferenceExistence) || 0;
      const diferenciaExtraccion = parseFloat(this.calculateDifferenceExtraccion) || 0;
      const total = diferenciaExistencia + diferenciaExtraccion;
      this.cashierData.differenceBox = total.toFixed(2);
      return total.toFixed(2); // Redondea a 2 decimales
    },*/
    /*calculateDifferenceService() {
      if (this.cashierData.totalService) {
        const servicioSistema = parseFloat(this.editedCloseBox.totalService) || 0;
        const servicioCajera = parseFloat(this.cashierData.totalService) || 0;
        const diferencia = servicioSistema - servicioCajera;
        return diferencia.toFixed(2); // Redondea a 2 decimales
      } else {
        return 0.00;
      }
    },*/
    /*calculateDifferenceProduct() {
      if (this.cashierData.totalProduct) {
        const productoSistema = parseFloat(this.editedCloseBox.totalProduct) || 0;
        const productoCajera = parseFloat(this.cashierData.totalProduct) || 0;
        const diferencia = productoSistema - productoCajera;
        return diferencia.toFixed(2); // Redondea a 2 decimales
      } else {
        return 0.00;
      }
    },*/
    /*calculateDifferenceTip() {
      if (this.cashierData.totalTip) {
        const propinaSistema = parseFloat(this.editedCloseBox.totalTip) || 0;
        const propinaCajera = parseFloat(this.cashierData.totalTip) || 0;
        const diferencia = propinaSistema - propinaCajera;
        return diferencia.toFixed(2); // Redondea a 2 decimales
      } else {
        return 0.00;
      }
    },*/
    /*calculateTotalDifferencesIngresos() {
      const diferenciaServicio = parseFloat(this.calculateDifferenceService) || 0;
      const diferenciaProducto = parseFloat(this.calculateDifferenceProduct) || 0;
      const diferenciaPropina = parseFloat(this.calculateDifferenceTip) || 0;
      const total = diferenciaServicio + diferenciaProducto + diferenciaPropina;
      this.cashierData.differenceAccounts = total.toFixed(2);
      return total.toFixed(2); // Redondea a 2 decimales
    },*/
    calculateDifferenceCreditCard() {
      //if (this.cashierData.totalCreditCard) {
      const creditCardSistema = parseFloat(this.editedCloseBox.totalCreditCard) || 0;
      const creditCardCajera = parseFloat(this.cashierData.totalCreditCard) || 0;
      const diferencia = creditCardCajera - creditCardSistema;
      return diferencia.toFixed(2); // Redondea a 2 decimales
      //} else {
      //return 0.00;
      //}
    },
    calculateDifferenceDebit() {
      //if (this.cashierData.totalDebit) {
      const debitSistema = parseFloat(this.editedCloseBox.totalDebit) || 0;
      const debitCajera = parseFloat(this.cashierData.totalDebit) || 0;
      const diferencia = debitCajera - debitSistema;
      return diferencia.toFixed(2); // Redondea a 2 decimales
      //} else {
      //return 0.00;
      //}
    },
    calculateDifferenceTransfer() {
      //if (this.cashierData.totalTransfer) {
      const transferSistema = parseFloat(this.editedCloseBox.totalTransfer) || 0;
      const transferCajera = parseFloat(this.cashierData.totalTransfer) || 0;
      const diferencia = transferCajera - transferSistema;
      return diferencia.toFixed(2); // Redondea a 2 decimales
      //} else {
      //return 0.00;
      //}
    },
    calculateDifferenceCash() {
      //if (this.cashierData.totalCash) {
      const transferSistema = parseFloat(this.editedBox.existence) || 0;
      const transferCajera = parseFloat(this.cashierData.existence) || 0;
      const diferencia = transferCajera - transferSistema;
      return diferencia.toFixed(2); // Redondea a 2 decimales
      //} else {
      // return 0.00;
      //}
    },
    calculateDifferenceOther() {
      //if (this.cashierData.totalOther) {
      const otherSistema = parseFloat(this.editedCloseBox.totalOther) || 0;
      const otherCajera = parseFloat(this.cashierData.totalOther) || 0;
      const diferencia = otherCajera - otherSistema;
      return diferencia.toFixed(2); // Redondea a 2 decimales
      //} else {
      // return 0.00;
      //}
    },
    calculateDifferenceCardGif() {
      //if (this.cashierData.totalCardGif) {
      const cardGifSistema = parseFloat(this.editedCloseBox.totalCardGif) || 0;
      const cardGifCajera = parseFloat(this.cashierData.totalCardGif) || 0;
      const diferencia = cardGifCajera - cardGifSistema;
      return diferencia.toFixed(2); // Redondea a 2 decimales
      //} else {
      //return 0.00;
      //}
    },
    calculateTotalDifferencesPagos() {
      const diferenciaCreditCard = parseFloat(this.calculateDifferenceCreditCard) || 0;
      const diferenciaDebit = parseFloat(this.calculateDifferenceDebit) || 0;
      const diferenciaTransfer = parseFloat(this.calculateDifferenceTransfer) || 0;
      const diferenciaOther = parseFloat(this.calculateDifferenceOther) || 0;
      const diferenciaCardGif = parseFloat(this.calculateDifferenceCardGif) || 0;
      const diferenciaCash = parseFloat(this.calculateDifferenceCash) || 0;
      const total = diferenciaCreditCard + diferenciaDebit + diferenciaTransfer + diferenciaOther + diferenciaCardGif + diferenciaCash;
      this.cashierData.differencePay = total.toFixed(2);
      return total.toFixed(2); // Redondea a 2 decimales
    },
    calculateTotalDifferencesPagos1() {
      const diferenciaCreditCard = parseFloat(this.calculateDifferenceCreditCard) || 0;
      const diferenciaDebit = parseFloat(this.calculateDifferenceDebit) || 0;
      const diferenciaTransfer = parseFloat(this.calculateDifferenceTransfer) || 0;
      const diferenciaOther = parseFloat(this.calculateDifferenceOther) || 0;
      const diferenciaCardGif = parseFloat(this.calculateDifferenceCardGif) || 0;
      const diferenciaCash = parseFloat(this.calculateDifferenceCash) || 0;
      const total = diferenciaCreditCard + diferenciaDebit + diferenciaTransfer + diferenciaOther + diferenciaCardGif + diferenciaCash;
      return total.toFixed(2); // Redondea a 2 decimales
    },
    calculateDifferenceTotalMount() {
      //if (this.cashierData.totalMount) {
      const totalMountSistema = parseFloat(this.editedCloseBox.totalMount) || 0;
      const totalMountCajera = parseFloat(this.cashierData.totalMount) || 0;

      const diferencia = totalMountSistema - totalMountCajera;
      return diferencia.toFixed(2); // Redondea a 2 decimales
      //} else {
      //  return 0.00;
      //}
    },
    calculateDifferenceAdelanto() {
      if (this.cashierData.advancement) {
        const adelantoSistema = parseFloat(this.editedCloseBox.advancement) || 0;
        const adelantoCajera = parseFloat(this.cashierData.advancement) || 0;
        const diferencia = adelantoCajera - adelantoSistema;
        return diferencia.toFixed(2); // Redondea a 2 decimales
      } else {
        return 0.00;
      }
    },
    calculateDifferenceBonusPay() {
      //if (this.cashierData.totalBonus) {
      const bonusPaySistema = parseFloat(this.editedCloseBox.totalBonus) || 0;
      const bonusPayCajera = parseFloat(this.cashierData.totalBonus) || 0;
      const diferencia = bonusPayCajera - bonusPaySistema;
      return diferencia.toFixed(2); // Redondea a 2 decimales
      //} else {
      //return 0.00;
      //}
    },
    calculateTotalDifferencesTotales() {
      const diferenciaExtraxtion = parseFloat(this.calculateDifferenceExtraccion) || 0;
      const diferenciaAdelanto = parseFloat(this.calculateDifferenceAdelanto) || 0;
      const diferenciaBonusPay = parseFloat(this.calculateDifferenceBonusPay) || 0;
      const total = diferenciaAdelanto + diferenciaBonusPay + diferenciaExtraxtion;
      return total.toFixed(2); // Redondea a 2 decimales
    },

    calculateTotalDifferencesTotales1() {
      const diferenciaExtraxtion = parseFloat(this.calculateDifferenceExtraccion) || 0;
      const diferenciaAdelanto = parseFloat(this.calculateDifferenceAdelanto) || 0;
      const diferenciaBonusPay = parseFloat(this.calculateDifferenceBonusPay) || 0;
      const total = diferenciaAdelanto + diferenciaBonusPay + diferenciaExtraxtion;
      return total.toFixed(2); // Redondea a 2 decimales
    },
    calculateTotalDifferencesGlobal() {
      //const diferenciaCaja = parseFloat(this.calculateTotalDifferences) || 0; // Diferencias de "caja"
      //const diferenciaIngresos = parseFloat(this.calculateTotalDifferencesIngresos) || 0; // Diferencias de "typeingreso"
      //const diferenciaPagos = parseFloat(this.calculateTotalDifferencesPagos) || 0; // Diferencias de "typepago"
      const diferenciaTotales = parseFloat(this.calculateTotalDifferencesTotales) || 0; // Diferencias de "total"
      const differenceIngreso = parseFloat(this.calculateTotalDifferencesPagos) || 0;
      // Suma todas las diferencias
      const totalGlobal = diferenciaTotales + differenceIngreso;
      this.cashierData.difference = totalGlobal;
      return totalGlobal.toFixed(2); // Redondea a 2 decimales
    },

    calculateTotalDifferencesGlobal1() {
      //const diferenciaCaja = parseFloat(this.calculateTotalDifferences) || 0; // Diferencias de "caja"
      //const diferenciaIngresos = parseFloat(this.calculateTotalDifferencesIngresos) || 0; // Diferencias de "typeingreso"
      //const diferenciaPagos = parseFloat(this.calculateTotalDifferencesPagos) || 0; // Diferencias de "typepago"
      const diferenciaTotales = parseFloat(this.calculateTotalDifferencesTotales1) || 0; // Diferencias de "total"
      const differenceIngreso = parseFloat(this.calculateTotalDifferencesPagos1) || 0;
      // Suma todas las diferencias
      const totalGlobal = diferenciaTotales + differenceIngreso;
      this.cashierData.difference = totalGlobal;
      return totalGlobal.toFixed(2); // Redondea a 2 decimales
    },

    totalCashierPayments() {
      const totalCreditCard = parseFloat(this.cashierData.totalCreditCard) || 0;
      const totalDebit = parseFloat(this.cashierData.totalDebit) || 0;
      const totalTransfer = parseFloat(this.cashierData.totalTransfer) || 0;
      const totalOther = parseFloat(this.cashierData.totalOther) || 0;
      const totalCardGif = parseFloat(this.cashierData.totalCardGif) || 0;
      const totalEfectivo = parseFloat(this.cashierData.totalCash) || 0;

      // Suma todos los métodos de pago
      const total = totalCreditCard + totalDebit + totalTransfer + totalOther + totalCardGif + totalEfectivo;
      this.cashierData.totalMount = total;
      return total.toFixed(2); // Redondea a 2 decimales
    }
  },

  watch: {
    'editedCard.value': function (newVal) {
      //if (newVal !== '') {
      this.customValidation(); // Llamar a la validación solo cuando editedCard.value tenga un valor
      //}
    },
    dialog(val) {
      if (val) {
        this.stopInterval();
      } else {
        this.close();
        this.startInterval();
      }
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    'editedItem.cardGif': function (newCardGif, oldCardGif) {
      // Verifica si el nuevo valor no está vacío y es diferente al valor anterior
      if (newCardGif && newCardGif !== oldCardGif) {
        // Muestra los dos campos adicionales o realiza cualquier lógica que necesites
        this.mostrarCode = true;
      } else {
        // Oculta los campos adicionales si el valor está vacío
        this.mostrarCode = false;
        this.editedCard.value = 0;
        this.editedCard.cardGiftUser_id = '';
      }
    },
    'editedCard.cardGiftUser_id'(newValue, oldValue) {
      // Llama a la función cuando cambia el valor de cardGiftUser_id
      if (newValue) {
        this.onCardGiftSelected(newValue);
      }
    },
    /*selected() {
      this.calculateAmountSales();
    }*/
  },

  async mounted() {
    /*this.branch_id = userTokenStore.branch_id;
    this.nameBranch = userTokenStore.nameBranch;*/
    this.business_id = LocalStorageService.getItem('business_id');
    this.charge_id = LocalStorageService.getItem('charge_id');
    this.branch_id = LocalStorageService.getItem('branch_id');
    this.professional_id = LocalStorageService.getItem('professional_id');
    this.user_id = LocalStorageService.getItem('user_id');
    this.nameBranch = LocalStorageService.getItem('nameBranch');
    this.nameProfessional = JSON.parse(LocalStorageService.getItem("name"));
    this.charge = JSON.parse(LocalStorageService.getItem("charge"));
    /*axios
      .get('https://testapi.simplifies.cl/api/show-business', {
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
      });*/
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
      //this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitud.', 3000);
    } finally {
      if (this.charge === 'Administrador') {
        this.branch_id = this.branches[1].id;
        this.mostrarFila = true;
      }
      await this.startInterval();
      await this.initialize();
    }
  },
  beforeUnmount() {
    // Detener el intervalo cuando el componente se esté destruyendo para evitar fugas de memoria
    clearInterval(this.intervalId);
    LocalStorageService.setIsLocked(false);
  },

  methods: {
    // Determina si es una acción de resolución (approved/denied)
    // Método base para determinar si es una resolución
    isResolution(actionType) {
      return ['approved', 'denied'].includes(actionType);
    },

    // Obtener color según tipo de acción
    getActionColor(actionType) {
  const colors = {
    approved: 'green',
    denied: 'red',
    delete: 'red',
    add: 'green',
    edit: 'blue',
    payment: 'indigo', // Color azul oscuro para pagos
    default: 'grey'
  };
  return colors[actionType] || colors.default;
},

// Obtener icono según tipo de acción
getActionIcon(actionType) {
  const icons = {
    approved: 'mdi-check-circle',
    denied: 'mdi-close-circle',
    delete: 'mdi-delete',
    add: 'mdi-plus',
    edit: 'mdi-pencil',
    payment: 'mdi-cash-multiple', // Icono adecuado para pagos
    default: 'mdi-alert'
  };
  return icons[actionType] || icons.default;
},

// Obtener título descriptivo
getActionTitle(actionType) {
  const titles = {
    approved: 'Aprobado',
    denied: 'Denegado',
    delete: 'Eliminación',
    add: 'Adición',
    edit: 'Edición',
    payment: 'Actualización de Pago', // Título descriptivo para pagos
    default: 'Acción'
  };
  return titles[actionType] || titles.default;
},

    // Obtener color para chips/resolución
    getResolutionColor(actionType) {
      return this.isResolution(actionType) ?
        (actionType === 'approved' ? 'green' : 'red') : 'grey';
    },

    // Obtener texto para chips/resolución
    getResolutionText(actionType) {
      return this.isResolution(actionType) ?
        (actionType === 'approved' ? 'Aprobado' : 'Denegado') : 'Pendiente';
    },

    // Obtener detalles de quién realizó la acción
    getActionDetails(item) {
      const actor = item.nameProfessional || 'Sistema';
      return this.isResolution(item.action_type) ?
        `Resuelto por: ${actor}` : `Acción por: ${actor}`;
    },

    // Obtener icono global según estado general
    getGlobalIcon(items) {
      const hasDenied = items.some(i => i.action_type === 'denied' || i.action_type === 'delete');
      const hasPending = items.some(i => !this.isResolution(i.action_type));

      if (hasDenied) return 'mdi-alert-octagon';
      if (hasPending) return 'mdi-alert-circle';
      return 'mdi-check-circle';
    },

    // Obtener color global según estado general
    getGlobalColor(items) {
      const hasDenied = items.some(i => i.action_type === 'denied' || i.action_type === 'delete');
      const hasPending = items.some(i => !this.isResolution(i.action_type));

      if (hasDenied) return 'red-lighten-4';
      if (hasPending) return 'orange-lighten-4';
      return 'blue-grey-lighten-4';
    },
    formatDateTime(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    setInvalidState(value) {
      this.hasInvalidState = value;
    },
    setInvalidStateProduct(value) {
      this.hasInvalidStateProduct = value;
    },
    getDetailIcon(detail) {
      // Íconos y colores por defecto
      const defaultIcons = {
        totalCreditCard: { icon: 'mdi-credit-card' },
        totalDebit: { icon: 'mdi-credit-card-outline' },
        totalTransfer: { icon: 'mdi-bank-transfer' },
        existence: { icon: 'mdi-cash' },
        totalOther: { icon: 'mdi-currency-usd' },
        totalCardGif: { icon: 'mdi-gift' },
        // ... otros tipos
      };

      // Si el detalle tiene configuración de ícono, usarla
      if (detail.iconConfig) {
        return detail.iconConfig;
      }

      // Retornar configuración por defecto
      return defaultIcons[detail.type] || { icon: 'mdi-currency-usd', color: 'info' };
    },
    // Método updateDetail seguro
    updateMainField(detail, newValue) {
      newValue = parseFloat(newValue) || 0;
      const oldValue = parseFloat(detail.value) || 0;
      const difference = newValue - oldValue;

      if (difference === 0) return;

      // Verificar si el detalle es un objeto válido
      if (typeof detail === 'object' && detail !== null) {
        // Actualizar el valor en el detalle específico
        detail.value = newValue;
      } else {
        console.error('El detalle no es un objeto válido:', detail);
        return;
      }

      // Calcular el nuevo total sumando todos los detalles del mismo tipo
      if (detail.type in this.cashierData) {
        const total = this.cashierData.details
          .filter(d => d.type === detail.type)
          .reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);

        this.cashierData[detail.type] = total;
      }

      // Actualización cruzada para existence/totalCash
      /*if (detail.type === 'existence') {
        this.cashierData.totalCash = this.cashierData.existence;
      } else if (detail.type === 'totalCash') {
        this.cashierData.existence = this.cashierData.totalCash;
      }*/
    },
    getFieldName(type) {
      const names = {
        totalCreditCard: 'Tarjeta Crédito',
        totalDebit: 'Débito',
        totalTransfer: 'Transferencia',
        existence: 'Efectivo',
        totalOther: 'Otros',
        totalCardGif: 'Tarjeta Regalo'
      };
      return names[type] || type;
    },
    getOptionName(type) {
      const option = this.paymentOptions.find(opt => opt.type === type)
      return option ? option.name : type
    },
    addDetail() {
      // Generar ID único
      const newId = Date.now()
      const value = parseFloat(this.newDetail.value) || 0

      // Crear el objeto detalle
      const detail = {
        id: newId,
        type: this.newDetail.type,
        value: value,
        name: this.getOptionName(this.newDetail.type)
      }

      // Agregar a la lista de detalles
      this.cashierData.details.push(detail)

      // Sumar al total correspondiente
      if (this.newDetail.type === 'totalCash') {
        // Sumar a existence cuando es totalcash
        this.cashierData.existence = (parseFloat(this.cashierData.existence) || 0) + value
      } else if (this.cashierData[detail.type] !== undefined) {
        // Sumar a otros campos (income, expenses, etc.)
        const currentValue = this.cashierData[detail.type] === '' ? 0 : parseFloat(this.cashierData[detail.type])
        this.cashierData[detail.type] = currentValue + value
      }

      // Resetear el formulario y cerrar diálogo
      this.newDetail = { id: null, type: '', value: 0 }
      this.dialogDetails = false
    },

    // Función para eliminar un detalle
    removeDetail(detail) {
      if (this.cashierData[detail.type] !== undefined) {
        // Restar de otros campos
        const currentValue = this.cashierData[detail.type] === '' ? 0 : parseFloat(this.cashierData[detail.type])
        this.cashierData[detail.type] = currentValue - detail.value
      }

      // Eliminar de la lista de detalles
      this.cashierData.details = this.cashierData.details.filter(d => d.id !== detail.id)
    },
    //step
    changeStep(index) {
      this.step = index;
    },
    async nextStep() {
      if (this.step < this.items.length) {
        this.step++;
      }

      if (this.step === 2) {
        this.dialogDeleteDiario = false;
      }
      if (this.step === 3) {
        this.dialogDeleteDiario = false;
        this.bonusProf = [];
        this.loadingBonusStep = true;
        LocalStorageService.setIsLocked(true);
        axios
          .get('https://testapi.simplifies.cl/api/bonus-show', {
            params: {
              branch_id: this.branch_id
            }
          })
          .then((response) => {
            this.bonusProf = response.data.bonus;
          }).catch((error) => {
            this.loadingBonusStep = false;
          })
          .finally(() => {
            this.loadingBonusStep = false; // Desactivar el loading siempre
            LocalStorageService.setIsLocked(false);
          });
      }
      if (this.step === 4) {
        this.dialogDeleteDiario = false;

        this.results = [];
        this.box = [];
        this.boxClose = [];
        this.payments = [];
        this.cashierSales = [];
        this.bonusPay = [];
        this.cashierBoxClose = [];
        await this.initialize();
        this.editedItem = _.cloneDeep(this.defaultItem);
        this.cashierData = _.cloneDeep(this.defaultcashierData);
        this.editedCloseBox = _.cloneDeep(this.defaultCloseBox);
        this.editedBox = _.cloneDeep(this.defaultBox);
        this.totalMountCreditCards();
        this.totalMountDebits();
        this.totalMountTransfers();
        this.totalMountOthers();
        this.totalMountCardGif();
        this.totalBoxExtraction();
        this.totalBonusPay();
        this.totalMountServices();
        this.totalMountProducts();
        this.totalMountTips();
        this.totalMountCashs();
        this.totalMount();
        this.existence();
        try {
          this.loading = true;
          const result = await handleRequest({
            endpoint: 'payment-method',
            method: 'GET',
          });

          if (result.success) {
            this.paymentOptions = result.data.paymentOptions || [];
          } else {
            this.paymentOptions = [];
          }
        } catch (error) {
          this.loading = false;
          this.showAlert('error', 'Ocurrió un error inesperado al cargar los métodos de pago.', 3000);
        }
      }
      if (this.step === 5) {
        this.totalBonusPay();
        this.dialogDeleteDiario = false;
      }
      if (this.step === 6) {
        this.dialogDeleteDiario = false;
      }
      if (this.step > 6) {
        this.dialogDeleteDiario = false;
        this.dialog = false;
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

    changeStepCashier(index) {
      this.stepCashier = index;
    },
    async nextStepCashier() {
      if (this.stepCashier < this.items.length) {
        this.stepCashier++;
        if (this.stepCashier === 2) {
          this.dialogDeleteParcial = false;
          try {
            this.loading = true;
            const result = await handleRequest({
              endpoint: 'payment-method',
              method: 'GET',
            });

            if (result.success) {
              this.paymentOptions = result.data.paymentOptions || [];
            } else {
              this.paymentOptions = [];
            }
          } catch (error) {
            this.loading = false;
            this.showAlert('error', 'Ocurrió un error inesperado al cargar los métodos de pago.', 3000);
          }
        }
        if (this.stepCashier === 3) {
          this.dialogDeleteParcial = false;
          this.totalBoxExtraction();
        }
        if (this.stepCashier === 4) {
          this.dialogDeleteParcial = false;
        }
      }
      //this.verificateStepCashier(this.stepCashier);

    },

    prevStepCashier() {
      if (this.stepCashier > 1) {
        this.stepCashier--;
      }
    },

    verificateStep(newValue) {

    },

    verificateStepCashiet(newValue) {

    },
    //endsteep
    formatNumberNegativos(value) {
      if (isNaN(value) || !isFinite(value)) return "0.00"; // Manejar valores no válidos
      return value.toFixed(2); // Redondear a 2 decimales
    },
    openCloseBox() {
      this.stopInterval();
      this.tab = 'caja';
      this.step = 1;
      this.dialog = true;

      this.editedItem = _.cloneDeep(this.defaultItem);
      this.cashierData = _.cloneDeep(this.defaultcashierData);
      this.editedCloseBox = _.cloneDeep(this.defaultCloseBox);
      this.editedBox = _.cloneDeep(this.defaultBox);

      this.totalMountCreditCards();
      this.totalMountDebits();
      this.totalMountTransfers();
      this.totalMountOthers();
      this.totalMountCardGif();
      this.totalBoxExtraction();
      this.totalBonusPay();
      this.totalMountServices();
      this.totalMountProducts();
      this.totalMountTips();
      this.totalMountCashs();
      this.totalMount();
      this.existence();
      /*const cashierDataFiltered = this.cashierBoxClose.filter(item => item.type === 'Diario');

      // Verificar si hay datos filtrados
      if (cashierDataFiltered.length > 0) {
        // Asignar el primer elemento filtrado a cashierData
        const details = typeof cashierDataFiltered[0].details === 'string'
          ? JSON.parse(cashierDataFiltered[0].details)
          : cashierDataFiltered[0].details || [];
        this.cashierData = { ...this.cashierData, ...cashierDataFiltered[0], details: details };
      }*/
      this.loadingBonus = true;
    },
    openCloseBoxDialog() {
      this.stopInterval();
      this.editedItem = _.cloneDeep(this.defaultItem);
      this.cashierData = _.cloneDeep(this.defaultcashierData);
      this.editedCloseBox = _.cloneDeep(this.defaultCloseBox);
      this.editedBox = _.cloneDeep(this.defaultBox);
      this.totalBoxExtraction();
      this.existence();
      this.stepCashier = 1;
      // Filtrar results según las condiciones
      const filteredResults = this.results.filter(item => {
        return item.pay === 1 && item.user_id === null;
      });

      console.log('this.cashierSales');
      console.log(this.cashierSales);
      // Obtener array solo con los ids de filteredResults
      const filteredResultsIds = filteredResults.map(item => item.id);


      const filteredCashiers = this.cashierSales.filter(item => {
        console.log('item.professional_id');
        console.log(item.professional_id);
        return item.professional_id === Number(this.professional_id) && item.pay === 1 &&
          item.user_id === null;
      });

      /*
        .filter(item => (
          return Number(item.professional_id) === Number(this.professional_id) &&
          item.pay === 1 &&
          item.user_id === null
        ));*/

      const filteredcashiersIds = filteredCashiers.map(item => item.id);
      console.log('filteredcashiersIds');
      console.log(filteredcashiersIds);
      // Filtrar payments que coincidan con user_id Y car_id esté en filteredResultsIds
      /*const filteredpayments = this.payments.filter(item => {
        return (filteredResultsIds.includes(Number(item.car_id)));
      });*/
      const filteredpayments = this.payments.filter(item => {
        const carId = item.car_id ? Number(item.car_id) : null;
        const cashiersaleId = item.cashiersale_id ? Number(item.cashiersale_id) : null;

        // Verifica si carId está en filteredResultsIds (y no es null)
        const isCarMatch = carId !== null && filteredResultsIds.includes(carId);

        // Verifica si cashiersaleId está en filteredcashiersIds (y no es null)
        const isCashierMatch = cashiersaleId !== null && filteredcashiersIds.includes(cashiersaleId);

        // Retorna true si cumple alguna de las dos condiciones (OR)
        return isCarMatch || isCashierMatch;
      });

      console.log('filteredpayments'); // Aquí tienes el array de ids
      console.log(filteredpayments); // Aquí tienes el array de ids
      console.log('this.user_id'); // Aquí tienes el array de ids
      console.log(this.user_id); // Aquí tienes el array de ids

      // Calcular montos de servicios, productos y propinas
      const totalService = filteredResults
        .reduce((total, item) => total + item.service, 0);
      this.editedCloseBox.totalService = totalService;

      const totalProduct = filteredResults
        .reduce((total, item) => total + item.product, 0);
      const cashierSales = filteredCashiers
        .reduce((total, item) => total + item.price, 0);
      this.editedCloseBox.totalProduct = totalProduct + cashierSales;

      const totalTip = filteredResults
        .reduce((total, item) => total + item.tip, 0);
      this.editedCloseBox.totalTip = totalTip;

      // Calcular montos de pagos
      const totalCash = filteredpayments
        .reduce((total, item) => total + item.cash, 0);
      this.editedCloseBox.totalCash = totalCash;

      const totalDebit = filteredpayments
        .reduce((total, item) => total + item.debit, 0);
      this.editedCloseBox.totalDebit = totalDebit;

      const totalCreditCard = filteredpayments
        .reduce((total, item) => total + item.creditCard, 0);
      this.editedCloseBox.totalCreditCard = totalCreditCard;

      const totalTransfer = filteredpayments
        .reduce((total, item) => total + item.transfer, 0);
      this.editedCloseBox.totalTransfer = totalTransfer;

      const totalOther = filteredpayments
        .reduce((total, item) => total + item.other, 0);
      this.editedCloseBox.totalOther = totalOther;

      const totalCardGif = filteredpayments
        .reduce((total, item) => total + item.cardGif, 0);
      this.editedCloseBox.totalCardGif = totalCardGif;

      this.editedCloseBox.totalMount = totalCash + totalDebit + totalCreditCard + totalTransfer + totalOther + totalCardGif;

      this.dialogParcial = true;
    },
    onFileSelected(event) {
      let file = event.target.files[0];
      this.editedBox.file = file;
      console.log(this.editedItem.file);
      //this.cargarImage(file);
    },
    checkExtraction(value) {

      // Obtenemos el valor de extracción y existencia para validación
      const extraction = parseFloat(value);
      const existence = parseFloat(this.editedBox.existence);


      // Si el valor de extracciónestá vacío
      if (value === null || value === '') {
        this.showAdditionalFields = false; // No mostrar campos adicionales
        this.file = '';
        this.editedBox.comment = '';
        this.editedBox.file = '';
        return true; // Sin error, pero campos ocultos
      }
      // Validación: Si el valor no coincide con el formato de número decimal
      if (!/^\d+(\.\d+)?$/.test(value)) {
        this.showAdditionalFields = false; // Ocultar campos si no es válido
        this.file = '';
        this.editedBox.comment = '';
        this.editedBox.file = '';
        return "Debe ser un número con punto decimal (10.00)"; // Retornamos el mensaje de error
      }

      // Validación: Si el valor no puede ser convertido a número
      if (isNaN(parseFloat(value))) {
        this.showAdditionalFields = false; // Ocultar campos si no es válido
        this.file = '';
        this.editedBox.comment = '';
        this.editedBox.file = '';
        return 'Debe ser un número'; // Retornamos el mensaje de error
      }
      // Validamos si la extracción es mayor que la existencia
      if (extraction > existence) {
        this.showAdditionalFields = false; // Ocultar campos si no es válido
        this.file = '';
        this.editedBox.comment = '';
        this.editedBox.file = '';
        return "La Extracción no debe ser mayor a la existencia en caja";
      } else {
        // Solo si la extracción es válida mostramos los campos adicionales
        this.showAdditionalFields = true;
        return true; // Validación exitosa
      }
    },
    getMonthDateRange(date) {
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      return { start, end };
    },
    // aqui lo del calendario
    getEventColor(event) {
      return event.color
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    closeCalendar() {
      this.reservations = [];
      this.events = [];
      this.showReserPrpfessional = false;
    },

    closeCoexistence() {
      this.dialogCoexistence = false;
    },
    chargeData() {//aqui cargo el componente del calendar
      this.showReserPrpfessional = true;
      this.showReservations();
    },
    showReservations() {//aqui cargo el componente del calendar
      this.professional_idR = '';
      this.type = 'month';
      this.events = [];
      console.log('this.today');
      console.log(this.today);
      const today = new Date(this.today);
      const range = this.getMonthDateRange(today);
      const startDate = range.start.toISOString().split('T')[0];
      const endDate = range.end.toISOString().split('T')[0];
      /*const startDate = this.input
        ? format(this.input, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd");
      const endDate = this.input2
        ? format(this.input2, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd");*/
      LocalStorageService.setIsLocked(true);
      axios
        .get("https://testapi.simplifies.cl/api/branch-reservations-periodo", {
          params: {
            branch_id: this.branch_id,
            startDate: startDate,
            endDate: endDate
          },
        })
        .then((response) => {
          //this.reservations = response.data.reservaciones;
          this.professionals = response.data.professionals;
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
        });
    },
    showReservationsProfessional() {//aqui cargo el componente del calendar  
      LocalStorageService.setIsLocked(true);
      this.events = [];
      console.log('this.today');
      console.log(this.today);
      const today = new Date(this.today);
      const range = this.getMonthDateRange(today);
      const startDate = range.start.toISOString().split('T')[0];
      const endDate = range.end.toISOString().split('T')[0];
      axios
        .get("https://testapi.simplifies.cl/api/professional-reservations-periodo", {
          params: {
            branch_id: this.branch_id,
            professional_id: this.professional_idR,
            startDate: startDate,
            endDate: endDate
          },
        })
        .then((response) => {
          this.reservations = response.data.reservaciones;
          console.log('Reservaciones');
          console.log(this.reservations);
          let tempEvents = [];


          this.reservations.forEach(reservacion => {
            tempEvents.push({
              title: reservacion.clientName,
              start: new Date(reservacion.startDate),
              end: new Date(reservacion.endDate),
              color: reservacion.color,
              allDay: false
            });
          });
          this.events = tempEvents;
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
        });
    },
    openWhatsApp(phone) {
      window.open('http://wa.me/' + '+' + phone);
    },
    stopInterval() {
      console.log('Detener intervalo');
      clearInterval(this.intervalId);
      LocalStorageService.setIsLocked(false);
    },
    async startInterval() {
      console.log('Reiniciar intervalo');
      this.intervalId = setInterval(async () => {
        if (!LocalStorageService.getIsLocked()) {
          await this.initialize(this.branch_id);
        }
      }, 59000);
    },
    showBonus() {
      this.loadingBonus = true;
      LocalStorageService.setIsLocked(true);
      axios
        .get('https://testapi.simplifies.cl/api/branch-payment-show-bonus', {
          params: {
            branch_id: this.branch_id
          }
        })
        .then((response) => {
          this.bonus = response.data.bonus;
        }).finally(() => {
          this.showDialogBonus = true;
          this.loadingBonus = false;
          LocalStorageService.setIsLocked(false);
        });
    },
    showBonusProf() {
      this.loadingBonusProf = true;
      LocalStorageService.setIsLocked(true);
      axios
        .get('https://testapi.simplifies.cl/api/bonus-show', {
          params: {
            branch_id: this.branch_id
          }
        })
        .then((response) => {
          this.bonusProf = response.data.bonus;
        }).finally(() => {
          this.showDialogBonusProf = true;
          this.loadingBonusProf = false;
          LocalStorageService.setIsLocked(false);
        });
    },
    payBonusProf(item) {
      this.bonus_ref = item;
      this.dialogConfBonus = true;
    },
    closeConfProf() {
      this.bonus_ref = [];
      this.dialogConfBonus = false;
    },
    payBonus() {
      this.loadingBonusPay = true;
      this.data.branch_id = parseInt(this.bonus_ref.branch_id);
      this.data.name = this.bonus_ref.name;
      this.data.professional_id = this.bonus_ref.professional_id;
      this.data.type = this.bonus_ref.bonus;
      this.data.amount = this.bonus_ref.amount;
      this.data.order_id = this.bonus_ref.order_id;
      this.data.cant = this.bonus_ref.cant;
      this.data.retention = this.bonus_ref.retention;
      LocalStorageService.setIsLocked(true);
      axios
        .post('https://testapi.simplifies.cl/api/bonu-payment', this.data)
        .then(() => {
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.showAlert("success", "Pago del bono efectuado correctamente", 3000);
          // Actualizar el estado localmente
          this.bonusProf = this.bonusProf.map(item => {
            if (item.professional_id === this.bonus_ref.professional_id &&
              item.bonus === this.bonus_ref.bonus) {
              return { ...item, pay: true };
            }
            return item;
          });
          this.bonus_ref = [];
          this.dialogConfBonus = false;
          this.loadingBonusPay = false;
          this.loadingBonusPay = false;
          /*axios
            .get('https://testapi.simplifies.cl/api/bonus-show', {
              params: {
                branch_id: this.branch_id
              }
            })
            .then((response) => {
              this.bonusProf = response.data.bonus;
            }).finally(() => {
              //this.showDialogBonusProf = true;
              this.loadingBonusProf = false;
              LocalStorageService.setIsLocked(false);
            });*/
        });
      LocalStorageService.setIsLocked(false);
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

    customValidation() {
      if (this.selectedOption === 'Tarjeta de regalo') {
        // Convertir ambos valores a enteros y sumarlos
        const cardGifValue = parseInt(this.editedItem.cardGif, 10) || 0;
        const tipValue = parseInt(this.editedItem.tip, 10) || 0;
        const sum = cardGifValue + tipValue;
        console.log('con sin propina');
        console.log(sum);
        if (this.editedCard.value !== '' && sum > parseInt(this.editedCard.value)) {
          return 'El valor de la tarjeta de regalo no puede ser mayor que ' + this.formatNumber(this.editedCard.value);
        } else {
          return true;
        }
      } else {
        console.log('sin propina');
        console.log(this.editedItem.cardGif);
        if (this.editedCard.value !== '' && parseInt(this.editedItem.cardGif) > parseInt(this.editedCard.value)) {
          return 'El valor de la tarjeta de regalo no puede ser mayor que ' + this.formatNumber(this.editedCard.value);
        } else {
          return true;
        }
      }
    },
    getColor(state) {
      switch (state) {
        case 1:
          return 'red';
        case 2:
          return 'blue';
        case 3:
          return 'yellow';
        default:
          return 'grey';
      }
    },
    getText(state) {
      switch (state) {
        case 1:
          return 'Por Pagar';
        case 2:
          return 'Atendiéndose';
        case 3:
          return 'En Cola';
        default:
          return 'Desconocido';
      }
    },
    /*formatNumber(value) {
            return value.toLocaleString('en-US');
        },*/
    onCardGiftSelected(code) {
      LocalStorageService.setIsLocked(true);
      // Realiza cualquier lógica adicional aquí
      console.log('Elemento seleccionado:', code);
      axios
        .get('https://testapi.simplifies.cl/api/card-gift-user-show-value', {
          params: {
            code: code
          }
        })
        .then((response) => {
          this.editedCard.value = response.data
          console.log('Elemento seleccionado:', this.editedCard.value);
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          if (this.editedCard.value) {
            this.mostrarOtroCampo = true;
          }
          else {
            this.editedCard.value = 0;
            this.editedItem.cardGif = '';
            this.mostrarOtroCampo = false;
          }
        });
      // Muestra otro campo y asigna un valor

      //this.otroCampoValor = item.valor;  // Asigna el valor que desees
    },

    todosPagados() {
      return this.results.every(item => item.pay === '1');
    },
    marcarComoPagado(item) {
      LocalStorageService.setIsLocked(true);
      let request = {
        id: item.id
      };
      axios
        .put('https://testapi.simplifies.cl/api/car', request)
        .then(() => {
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.initialize();
          this.showAlert("success", "Carro pagado correctamente", 3000);
        });
    },
    deleteOrder(item) {
      LocalStorageService.setIsLocked(true);
      //this.dialogRequest = true
      //this.editedItem.order_id = item.id
      if (item.action_status === 0) {
        let request = {
          id: item.id,
          nameProfessional: this.nameProfessional,
          branch_id: this.branch_id,
          professional_id: this.professional_id
        };
        axios
          .post('https://testapi.simplifies.cl/api/order-destroy-solicitud', request)
          .then(() => {
            //this.initialize();
          }).finally(() => {
            LocalStorageService.setIsLocked(false);
            this.initialize();
            this.showDetails(this.car_ref);
            this.showAlert("success", "Solicitud de eliminación de orden hecha correctamente", 3000);
          });
      } else {
        let request = {
          id: item.id,
          professional_id: this.professional_id
        };
        axios
          .post('https://testapi.simplifies.cl/api/order-destroy-web', request)
          .then(() => {
            //this.initialize();
          }).finally(() => {
            LocalStorageService.setIsLocked(false);
            this.initialize();
            this.showDetails(this.car_ref);
            this.showAlert("success", "Orden eliminada correctamente", 3000);
          });
      }
    },

    editItemProduct(item) {
      LocalStorageService.setIsLocked(true);
      //this.dialogRequest = true
      //this.editedItem.order_id = item.id
      let request = {
        id: item.id,
        nameProfessional: this.nameProfessional,
        branch_id: this.branch_id,
        professional_id: this.professional_id
      };
      axios
        .post('https://testapi.simplifies.cl/api/cashiersale-destroy-solicitud', request)
        .then(() => {
          this.showSaleProducts = false;
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.showAlert("success", "Solicitud de eliminación de productos hecha correctamente", 3000);
          this.initialize();
          this.showDialogProduct();
        });
    },

    requestDelete() {
      LocalStorageService.setIsLocked(true);
      this.loading = true
      let request = {
        id: this.editedItem.order_id,
        nameProfessional: this.nameProfessional,
        branch_id: this.branch_id,
        professional_id: this.professional_id
      };
      axios
        .post('https://testapi.simplifies.cl/api/order-destroy-web', request)
        .then(() => {
          //this.initialize();
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.showDetails(this.car_ref);
          this.showAlert("success", "Orden eliminada correctamente", 3000);
        });
      this.dialogRequest = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    requestCancel(item) {
      LocalStorageService.setIsLocked(true);
      this.loading = true
      let request = {
        id: item.id,
        request_delete: 0,
        nameProfessional: this.nameProfessional,
        branch_id: this.branch_id,
      };
      axios
        .put('https://testapi.simplifies.cl/api/order-web', request)
        .then(() => {
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.showAlert("success", "Orden denegada para ser eliminada correctamente", 3000);
          //this.initialize();
          this.showDetails(this.car_ref)
        });
      this.dialogRequest = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    openDialogBox() {
      this.showAdditionalFields = false;
      this.dialogBox = true;
      this.editedBox.id = this.box ? this.box.id : 0;
      this.editedBox.cashFound = '';
      this.editedBox.existence = this.box ? this.box.existence : 0;
      this.editedBox.extraction = '';
      this.file = '';
    },
    closeDialogBox() {
      this.dialogBox = false;
      this.$nextTick(() => {
        this.editedBox = Object.assign({}, this.defaultBox)
      })
    },
    totalMount() {
      //console.log("boxxxxxx");
      //console.log(this.results);
      //if (!this.results) {   
      const amount = this.results.reduce((total, item) => total + item.amount, 0);
      const productsales = this.cashierSales.reduce((total, item) => total + item.price, 0);
      const temp = amount + productsales;
      this.editedCloseBox.totalMount = temp;
      return this.formatNumber(temp) + " CLP";
      //}
      //else{
      //return "CPL";
      //}
    },

    totalMount1() {
      //console.log("boxxxxxx");
      //console.log(this.results);
      //if (!this.results) {   
      const amount = this.results.reduce((total, item) => total + item.amount, 0);
      const productsales = this.cashierSales.reduce((total, item) => total + item.price, 0);
      const temp = amount + productsales;
      return this.formatNumber(temp) + " CLP";
      //}
      //else{
      //return "CPL";
      //}
    },

    totalMountPendientes() {
      //if (this.results) {
      //return " CPL"
      //}
      //else{
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.results
        .filter(item => item.pay === 0)
        .reduce((total, item) => total + item.amount, 0);
      const productsales = this.cashierSales.filter(item => (item.pay === 0 || item.pay === 3)).reduce((total, item) => total + item.price, 0);
      const pendiente = montosPendientes + productsales;
      if (!pendiente) {
        this.closed_box = false;
        // this.ejecutado = false;
        console.log(this.closed_box)
      }
      else {
        this.closed_box = true;
        //this.ejecutado = false;
      }
      return this.formatNumber(pendiente) + " CLP";
      //}
    },

    totalMountServices() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.results
        .filter(item => item.pay === 1)
        .reduce((total, item) => total + item.service, 0);
      this.editedCloseBox.totalService = montosPendientes;
      const temp = montosPendientes;
      return this.formatNumber(temp) + " CLP";
    },

    totalMountProducts() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.results
        .filter(item => item.pay === 1)
        .reduce((total, item) => total + item.product, 0);
      const cashierSales = this.cashierSales
        .filter(item => item.pay === 1)
        .reduce((total, item) => total + item.price, 0);
      this.editedCloseBox.totalProduct = montosPendientes + cashierSales;
      const temp = montosPendientes + cashierSales;
      return this.formatNumber(temp) + " CLP";
    },

    totalMountTips() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.results
        .filter(item => item.pay === 1)
        .reduce((total, item) => total + item.tip, 0);
      this.editedCloseBox.totalTip = montosPendientes;
      const temp = montosPendientes;
      return this.formatNumber(temp) + " CLP";
    },

    totalMountCashs() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.payments
        .reduce((total, item) => total + item.cash, 0);
      this.editedCloseBox.totalCash = montosPendientes;
      const temp = montosPendientes;
      return this.formatNumber(temp) + " CLP";
    },

    totalBoxCashs() {
      if (!this.box) {
        return '0.00' + " CLP";
      }
      else {
        this.editedBox.existence = this.box.existence;
        return this.box.existence ? this.formatNumber(this.box.existence) + " CLP" : '0.00' + " CLP";
      }
    },

    totalBoxExtraction() {
      if (!this.box) {
        return '0.00' + " CLP";
      } else {
        this.editedBox.extraction = this.box.extraction;
        return this.box.extraction ? this.formatNumber(this.box.extraction) + " CLP" : '0.00' + " CLP";
      }
    },

    /*totalBonusPay() {
          const totalUnpaid = this.bonusProf
        .filter(item => item.pay === 0)
        .reduce((sum, item) => sum + (parseFloat(item.amount) || 0, 0);
      
      console.log('Total bonos no pagados:', totalUnpaid);
      return totalUnpaid;
      /*console.log('bonos pagados');
      console.log(this.bonusPay);
      return this.bonusPay ? this.formatNumber(this.bonusPay) + " CLP" : '0.00' + " CLP";
    },*/

    totalBonusPay() {
      if (!this.bonusProf || !Array.isArray(this.bonusProf)) {
        this.editedCloseBox.totalBonus = 0;
        return 0;
      }

      const total = this.bonusProf.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

      console.log('Total calculado:', total);

      this.editedCloseBox.totalBonus = total;
      return total;
    },

    totalBonusPayCashier() {
      this.editedCloseBox.totalBonus = this.bonusPay ?? 0;
      return this.bonusPay ?? 0;
    },


    totalMountDebits() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.payments
        .reduce((total, item) => total + item.debit, 0);
      this.editedCloseBox.totalDebit = montosPendientes;
      const temp = montosPendientes;
      return this.formatNumber(temp) + " CLP";
    },

    totalMountCreditCards() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.payments
        .reduce((total, item) => total + item.creditCard, 0);
      this.editedCloseBox.totalCreditCard = montosPendientes;
      const temp = montosPendientes;
      return this.formatNumber(temp) + " CLP";
    },

    totalMountTransfers() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.payments
        .reduce((total, item) => total + item.transfer, 0);
      this.editedCloseBox.totalTransfer = montosPendientes;
      const temp = montosPendientes;
      return this.formatNumber(temp) + " CLP";
    },

    totalMountOthers() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.payments
        .reduce((total, item) => total + item.other, 0);
      this.editedCloseBox.totalOther = montosPendientes;
      const temp = montosPendientes;
      return this.formatNumber(temp) + " CLP";
    },

    totalMountCardGif() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.payments
        .reduce((total, item) => total + item.cardGif, 0);
      this.editedCloseBox.totalCardGif = montosPendientes;
      const temp = montosPendientes;
      return this.formatNumber(temp) + " CLP";
    },

    existence() {
      console.log('imprime existence');
      console.log(this.box);
      if (!this.box) {
        return "0.00 CLP";
      } else {
        if (!this.box.existence) {
          return "0.00 CLP";
        } else {
          const temp = this.box.existence;
          this.editedBox.existence = this.box.existence;
          this.editedCloseBox.existence = this.box.existence;
          console.log(temp);
          //return temp;
          return this.formatNumber(temp) + " CLP";
        }
      }
    },

    totalMountPagado() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      ///if (this.results) {
      ///return " CPL"
      //}
      //else{

      const montosPagados = this.results
        .filter(item => item.pay === 1)
        .reduce((total, item) => total + item.amount, 0);
      const productsales = this.cashierSales
        .filter(item => item.pay === 1)
        .reduce((total, item) => total + item.price, 0);
      console.log('productsales');
      console.log(this.cashierSales);
      const total = montosPagados + productsales;
      return total ? this.formatNumber(total) + " CLP" : "0.00 CLP";
      //}
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

    async initialize(branchId = null) {
      const currentBranchId = branchId || this.branch_id;
      if (!currentBranchId) {
        return;
      }
      // Usar currentBranchId en lugar de this.branch_id en la petición
      const requestParams = {
        branch_id: currentBranchId
      };
      //const token = LocalStorageService.getItem('token');
      //if (!LocalStorageService.getIsLocked()) {
      this.loadingcar = true;
      LocalStorageService.setIsLocked(true); // Bloquear antes de hacer la petición
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: 'branch-cars',
          method: 'GET',
          params: requestParams // Aquí pasas los parámetros
        });

        if (result.success) {
          this.results = result.data.cars;
          this.box = result.data.box;
          this.boxClose = result.data.box.box_close;
          this.payments = result.data.payments;
          this.cashierSales = result.data.cashierSales;
          this.bonusPay = result.data.bonusPay;
          if (result.data.cashierclosebox && Object.keys(result.data.cashierclosebox).length > 0) {
            // Asignar los valores de result.data.cashierclosebox a cashierData
            this.cashierBoxClose = result.data.cashierclosebox;
          }
        } else {
          // Si no hay datos, asignamos un array vacío
          this.results = [];
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        //this.showAlert('error', 'Ocurrió un error inesperado al procesar la solicitudsfsdfsf.', 3000);
      } finally {
        console.log('this.boxClose');
        console.log(this.boxClose);
        if (this.box === null) {
          this.ejecutado = false;
          this.ejecutadoCashier = false;
        } else {
          if (this.boxClose === null || this.boxClose.length === 0) {
            this.ejecutado = false;
            this.ejecutadoCashier = false;
          } else {
            // Verificar si hay algún box_close con type 'Diario' y user_id igual a this.user
            const hasParcial = this.boxClose.some(
              (close) => close.type === 'Parcial' && close.user_id === this.user
            );

            // Verificar si hay algún box_close con type 'Parcial'
            const hasDiario = this.boxClose.some(
              (close) => close.type === 'Diario'
            );

            // Asignar valores a ejecutado y ejecutadoCashier
            this.ejecutado = hasDiario;
            this.ejecutadoCashier = hasParcial;

            // Mensajes de depuración
            if (hasDiario) {
              console.log('this.box.box_close true (Diario)');
            }
            if (hasParcial) {
              console.log('this.box.box_close true (Parcial)');
            }
          }
        }
        LocalStorageService.setIsLocked(false); // Desbloquear después de la petición
        console.log('isLocked después de la solicitud Box initializating:', LocalStorageService.getIsLocked());
        this.loadingcar = false;
      }
    },
    editItem(item) {
      this.editedIndex = 1;
      this.editedItem = Object.assign({}, item)
      this.editedItem.businessType = item.business_type.id;
      this.dialog = true
    },
    deleteItem(item) {
      this.editedIndex = 1;
      this.editedItem.id = item.id;
      this.dialogDelete = true;
    },
    deleteItemSolicitud(item) {
      LocalStorageService.setIsLocked(true);
      this.editedItem.id = item.id;
      let request = {
        id: this.editedItem.id,
        nameProfessional: this.nameProfessional,
        branch_id: this.branch_id,
        professional_id: this.professional_id
      };
      axios
        .post('https://testapi.simplifies.cl/api/car-destroy-solicitud', request)
        .then(() => {
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.initialize();
          this.showAlert("success", "Solicitud de eliminacion hecha correctamente", 3000);
        });
    },
    editingRequest(item, active) {
      this.editedCar.id = item.id;
      this.editedCar.active = active;
      this.indexEditingRequest = active;
      this.dialogEditingRequest = true;
    },
    cancelEditingRequest() {
      this.dialogEditingRequest = false;
      this.indexEditingRequest = '';
      this.editedCar = _.cloneDeep(this.defaultCar);
    },
    async saveEditingRequest() {
      LocalStorageService.setIsLocked(true);
      this.valid = false;
      if (this.indexEditingRequest === 2) {
        this.data = {};

        this.data.id = this.editedCar.id;
        this.data.active = this.editedCar.active;
        this.data.description = this.editedCar.description;
        this.data.nameProfessional = this.nameProfessional;
        this.data.branch_id = this.branch_id;
        this.data.professional_id = this.professional_id
        try {
          const result = await handleRequest({
            endpoint: 'car-update-solicitud',
            method: 'POST',
            data: this.data
          });

          if (result.success) {
            this.showAlert("success", result.message, 3000);
            this.initialize();
          } else {
            this.showAlert("warning", result.message, 3000);
          }
        } catch (error) {
          this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
        } finally {
          LocalStorageService.setIsLocked(false);
          this.initialize();
          this.showAlert("success", "Solicitud de editar hecha correctamente", 3000);
          this.cancelEditingRequest();
        }
      }
      else if (this.indexEditingRequest === 3) {
        this.data = {};

        this.data.id = this.editedCar.id;
        this.data.active = this.editedCar.active;
        this.data.description = this.editedCar.description;
        this.data.nameProfessional = this.nameProfessional;
        this.data.branch_id = this.branch_id;
        this.data.professional_id = this.professional_id
        try {
          const result = await handleRequest({
            endpoint: 'car-destroy-solicitud',
            method: 'POST',
            data: this.data
          });

          if (result.success) {
            this.showAlert("success", result.message, 3000);
            this.initialize();
          } else {
            this.showAlert("warning", result.message, 3000);
          }
        } catch (error) {
          this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
        } finally {
          LocalStorageService.setIsLocked(false);
          this.initialize();
          this.showAlert("success", "Solicitud de Eliminacón hecha correctamente", 3000);
          this.cancelEditingRequest();
        }
      }
    },
    updateitemSolicitud(item) {
      LocalStorageService.setIsLocked(true);
      this.editedItem.id = item.id;
      let request = {
        id: this.editedItem.id,
        nameProfessional: this.nameProfessional,
        branch_id: this.branch_id,
        professional_id: this.professional_id
      };
      axios
        .post('https://testapi.simplifies.cl/api/car-update-solicitud', request)
        .then(() => {
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.initialize();
          this.showAlert("success", "Solicitud de editar hecha correctamente", 3000);
        });
    },

    payItem(item) {
      this.selectedOption = 'Débito';
      this.stopInterval();
      this.car_ref = [];
      this.initialize();
      console.log('Carro a pagar');
      console.log(item);
      this.car_ref = item;
      let temp = this.results.filter(item => item.id === this.car_ref.id);
      console.log('temp nuevo carrro');
      console.log(temp[0]);
      item = temp[0];
      this.editedIndex = 1;
      this.editedItem.car_id = item.id;
      this.editedItem.tip = item.tip;
      this.editedItem.cash = item.payment ? item.payment.cash : '';
      this.editedItem.creditCard = item.payment ? item.payment.creditCard : '';
      this.editedItem.debit = item.payment ? item.payment.debit : '';
      this.editedItem.transfer = item.payment ? item.payment.transfer : '';
      this.editedItem.other = item.payment ? item.payment.other : '';
      this.editedItem.amount = item.amount;
      this.editedItem.cardGif = item.cardGif;
      console.log(this.editedItem.cardGif);
      if (item.pay === 1) {
        this.dialogPay = false;
      }
      else {
        this.dialogPay = true;
      }

      /*axios
        .get('https://testapi.simplifies.cl/api/card-gift-show', {
          params: {
            business_id: this.business_id
          }
        })
        .then((response) => {
          this.cardGifts = response.data.cardGifts;
          this.value = this.cardGifts.value;
        });*/
    },
    showDetails(item) {
      LocalStorageService.setIsLocked(true);
      this.loadingOrders = true,
        console.log('carro a ver details');
      console.log(item);
      this.orders = [];
      this.car_ref = item
      this.editedItem.id = item.id;
      axios
        .get('https://testapi.simplifies.cl/api/order-show', {
          params: {
            car_id: item.id
          }
        })
        .then((response) => {
          this.orders = response.data.orders;
          console.log('imprime oreders');
          console.log(this.orders);
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
        }).finally(() => {
          console.log('this.loadingOrders = false;');
          this.loadingOrders = false;
          //this.priceService = this.orders.reduce((total, item) => total + item.price, 0);
          this.dialogDetallesCar = true;
          LocalStorageService.setIsLocked(false);
        });
    },
    deleteItemConfirm() {
      LocalStorageService.setIsLocked(true);
      let request = {
        id: this.editedItem.id,
        nameProfessional: this.nameProfessional,
        branch_id: this.branch_id
      };
      axios
        .post('https://testapi.simplifies.cl/api/car-destroy', request)
        .then(() => {
        }).finally(() => {
          this.showAlert("success", "Carro eliminado correctamente", 3000);
          LocalStorageService.setIsLocked(false);
        });
      this.dialogDelete = false;
    },
    savePay() {
      // Validación condicional para "Tarjeta de regalo"
      if (this.selectedOption === 'Tarjeta de regalo' && !this.editedCard.cardGiftUser_id) {
        // Llama la validación del campo
        this.showAlert("warning", "Selecciono pagar con tarjeta de regalo la propina, debe poner una tarjeta de regalo válida.", 3000);
      } else {
        this.loadingPayCar = false;
        this.data.car_id = this.editedItem.car_id;
        this.data.cash = parseFloat(this.editedItem.cash) || 0;
        this.data.creditCard = parseFloat(this.editedItem.creditCard) || 0;
        this.data.debit = parseFloat(this.editedItem.debit) || 0;
        this.data.transfer = parseFloat(this.editedItem.transfer) || 0;
        this.data.other = parseFloat(this.editedItem.other) || 0;
        this.data.cardGift = parseFloat(this.editedItem.cardGif) || 0;  // Fix typo here
        this.data.tip = parseFloat(this.editedItem.tip) || 0;
        this.data.code = this.editedCard.cardGiftUser_id || 0;  // Fix typo here
        this.data.nameProfessional = this.nameProfessional;
        this.data.tipByCash = this.selectedOption;
        this.data.branch_id = this.branch_id;
        const suma = this.data.cash + this.data.creditCard + this.data.debit + this.data.transfer + this.data.other + this.data.cardGift + this.data.tip;

        console.log(suma);
        console.log(this.editedItem.amount + this.data.tip);
        if (suma === this.editedItem.amount + this.data.tip) {
          LocalStorageService.setIsLocked(true);
          this.valid = true;
          axios
            .put('https://testapi.simplifies.cl/api/payment', this.data)
            .then(() => {
            }).finally(() => {
              LocalStorageService.setIsLocked(false);
              this.showAlert("success", "Pago efectuado correctamente", 3000);
              this.initialize();
              this.startInterval();
              this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedCard = Object.assign({}, this.defaultCard);
                this.mostrarOtroCampo = false;
              });
            });
          this.loadingPayCar = true;
          this.dialogPay = false;
          this.dialogDetallesCar = false;
          this.valid = true;
        }
        else {
          this.loadingPayCar = true;
          this.showAlert("warning", "Monto debe coincidir con el monto total " + this.formatNumber(Number(this.editedItem.amount) + Number(this.editedItem.tip)), 3000);
        }
        if (this.editedItem.cash || this.editedItem.creditCard || this.editedItem.debit || this.editedItem.transfer || this.editedItem.other || this.editedItem.cardGif || this.editedItem.tip) {
          this.valid = true;
          this.loadingPayCar = true;
        }
        //
      }

    },
    async saveCloseBox() {
      LocalStorageService.setIsLocked(true);
      this.loadingBonus = false;
      // Preparar los datos para enviar
      const carsWithPayEqualOne = this.results.filter(car => car.pay === 1 && car.user_id === null);
      const cashiersWithPayEqualOne = this.cashierSales.filter(cashier => cashier.pay === 1 && cashier.user_id === null);

      // Extraer los IDs de los elementos filtrados
      const carIds = carsWithPayEqualOne.map(car => car.id);
      const cashierIds = cashiersWithPayEqualOne.map(cashier => cashier.id);
      const requestData = {
        editedCloseBox: this.editedCloseBox, // Datos del sistema
        cashierData: this.cashierData, // Datos de la cajera
        car_ids: carIds,
        cashiersale_ids: cashierIds,
        branch_id: this.branch_id,
        nameProfessional: this.nameProfessional,
      };
      console.log('this.data para cerrar caja');
      console.log(requestData);
      try {
        const result = await handleRequest({
          endpoint: 'closebox',
          method: 'POST',
          data: requestData
        });

        // Manejo de la respuesta según el resultado
        if (result.success) {
          this.showAlert("success", result.message, 3000);
        } else {
          this.loadingBonus = true;
          this.dialog = false;
          this.showAlert("warning", result.message, 3000);
        }
      } catch (error) {
        this.loadingBonus = true;
        this.dialog = false;
        // Este bloque captura errores inesperados fuera del manejo estándar
        this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
      } finally {
        this.loadingBonus = true;
        this.dialog = false;
        this.showAlert("success", "Cierre de caja efectuado correctamente", 3000);
      }
      this.dialog = false;
      //this.loadingBonus = true;
      LocalStorageService.setIsLocked(false);
    },
    async saveCloseBoxParcial() {
      this.valid = false;
      LocalStorageService.setIsLocked(true);
      this.loadingBonus = false;
      // Preparar los datos para enviar
      const carsWithPayEqualOne = this.results.filter(car => car.pay === 1);
      const cashiersWithPayEqualOne = this.cashierSales.filter(cashier => cashier.pay === 1 && cashier.user_id === null);

      // Extraer los IDs de los elementos filtrados
      const carIds = carsWithPayEqualOne.map(car => car.id);
      const cashierIds = cashiersWithPayEqualOne.map(cashier => cashier.id);
      const requestData = {
        editedCloseBox: this.editedCloseBox, // Datos del sistema
        cashierData: this.cashierData, // Datos de la cajera
        car_ids: carIds,
        cashiersale_ids: cashierIds,
        branch_id: this.branch_id,
        nameProfessional: this.nameProfessional,
      };
      console.log('this.data para cerrar caja');
      console.log(requestData);
      try {
        const result = await handleRequest({
          endpoint: 'closebox-cashier',
          method: 'POST',
          data: requestData
        });

        // Manejo de la respuesta según el resultado
        /*if (result.success) {
          this.showAlert("success", result.message, 3000);
          this.closeParcial();
        } else {
          await this.startInterval();
          this.dialogParcial = false;
          this.loadingBonus = true;
          this.showAlert("warning", result.message, 3000);
        }*/
      } catch (error) {
        await this.startInterval();
        //this.dialogParcial = false;
        this.loadingBonus = true;
        // Este bloque captura errores inesperados fuera del manejo estándar
        this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
      } finally {
        await this.startInterval();
        //LocalStorageService.setIsLocked(false);
        //this.dialogParcial = false;
        this.loadingBonus = true;
        this.showAlert("success", "Cierre de caja efectuado correctamente, En breve se cerrará la sesión", 3000);
        setTimeout(() => {
          this.closeParcial();
        }, 3000);
      }
      //this.dialogParcial = false;
      LocalStorageService.setIsLocked(false);
    },
    saveBox() {
      {
        LocalStorageService.setIsLocked(true);
        this.editedBox.branch_id = this.branch_id;
        this.editedBox.nameProfessional = this.nameProfessional;
        const formData = new FormData();
        for (let key in this.editedBox) {
          formData.append(key, this.editedBox[key]);
        }

        console.log('formData');
        console.log(formData);
        axios
          .post('https://testapi.simplifies.cl/api/box', formData)
          .then(() => {
          }).finally(() => {
            LocalStorageService.setIsLocked(false);
            this.showAlert("success", "Caja Actualizada correctamente", 3000);
            this.initialize();
          });
        this.$nextTick(() => {
          this.editedBox = Object.assign({}, this.defaultBox)
        });
        this.dialogBox = false;
        this.valid = true;
      }
    },
    close() {
      this.dialog = false;
      this.dialogParcial = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.cashierData = Object.assign({}, this.defaultcashierData);
        this.editedCloseBox = Object.assign({}, this.defaultCloseBox);
        this.editedBox = Object.assign({}, this.defaultBox);
        this.editedIndex = -1
      });
    },
    closeParcial() {
      this.dialog = false;
      this.dialogParcial = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.cashierData = Object.assign({}, this.defaultcashierData);
        this.editedCloseBox = Object.assign({}, this.defaultCloseBox);
        this.editedBox = Object.assign({}, this.defaultBox);
        this.editedIndex = -1
      });
      const token = LocalStorageService.getItem('token');
      console.log('Cerrar Sesión')
      axios
        .get('https://testapi.simplifies.cl/api/logout', {
          headers: {
            'Authorization': `Bearer ${token.replace(/['"]+/g, '')}`
          }
        })
        .then(() => {
        }).finally(() => {

          LocalStorageService.logout();
          this.$router.push({ path: '/' });
        });
      //LocalStorageService.logout();
      //this.$router.push({ path: '/' });
    },
    closeDelete() {
      this.initialize();
      this.dialogDetallesCar = false;
      this.dialogDetallesCarPagado = false;
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    closeDialogPay() {
      this.dialogPay = false;
      this.startInterval();
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedCard = Object.assign({}, this.defaultCard);
        this.mostrarOtroCampo = false;
        this.editedIndex = -1
      })
    },
    markPagado() {
      this.dialogDetallesCar = false;
      this.marcarComoPagado(this.car_ref)
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDeleteP() {
      this.dialogRequest = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    //addServices
    showService(car) {
      LocalStorageService.setIsLocked(true);
      console.log('imprime Carro');
      console.log(car);

      axios
        .get('https://testapi.simplifies.cl/api/services-professional-branch-web', {
          params: {
            branch_id: this.branch_id,
            professional_id: car.professional_id
          }
        })
        .then((response) => {
          this.services = response.data.branchServicesPro;
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
        });
      this.showAddServices = true;

      console.log(car);
    },
    closeAddService() {
      this.showAddServices = false;
      this.branch_service_professional_id = '';
    },

    saveAddServie() {
      LocalStorageService.setIsLocked(true);
      this.loadingServ = true;
      this.data.car_id = this.car_ref.id;
      this.data.service_id = this.branch_service_professional_id;
      this.data.product_id = 0;
      this.data.type = 'service';
      this.data.nameProfessional = this.nameProfessional;
      this.data.branch_id = this.branch_id;
      this.data.cant = 1;
      console.log('Datos servicios agregar');
      console.log(this.data);
      axios
        .post('https://testapi.simplifies.cl/api/order-web', this.data)
        .then(() => {
        }).finally(() => {
          this.showAlert("success", "Servicio agregado correctamente", 3000);
          this.loadingServ = false;
          LocalStorageService.setIsLocked(false);
          this.initialize();
          /*let temp = this.results.filter(item => item.id == this.car_ref.id);
           console.log('tempsddasdasd');
           console.log(temp[0]);*/
          this.showDetails(this.car_ref);
          this.showAddServices = false;
          this.branch_service_professional_id = '';
          this.cant = '';
        });
    },
    //endAddService
    //addProduct
    validateCantidad(value) {
      if (value <= 0) {
        return "La cantidad debe ser mayor que cero";
      } else if (value <= this.product_exit) {
        return true; // La cantidad es válida
      } else {
        return "La cantidad debe ser menor o igual que la existencia (" + this.product_exit + ")";
      }
    },
    cantExist() {
      console.log('this.product_store_id');
      console.log(this.product_store_id);
      let exist = this.products.filter(item => item.id == this.product_store_id);
      console.log('exist[0]');
      console.log(exist[0]);
      this.product_exit = exist[0].product_exit;
    },
    showProduct(car) {
      console.log('imprime Carro');
      console.log(car);
      LocalStorageService.setIsLocked(true);
      axios
        .get('https://testapi.simplifies.cl/api/productstore-show-web', {
          params: {
            branch_id: this.branch_id
          }
        })
        .then((response) => {
          this.products = response.data.products;

          console.log('imprime Productos');
          console.log(this.products);
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
        });
      this.showAddProducts = true;

      console.log(car);
    },
    closeAddProduct() {
      this.showAddProducts = false;
      this.product_store_id = '';
    },
    saveAddProduct() {
      LocalStorageService.setIsLocked(true);
      this.loadingProd = true;
      this.data.car_id = this.car_ref.id;
      this.data.service_id = 0;
      this.data.product_id = this.product_store_id;
      this.data.type = 'product';
      this.data.nameProfessional = this.nameProfessional;
      this.data.branch_id = this.branch_id;
      this.data.cant = this.cant;
      console.log('Datos producto agregar');
      console.log(this.data);
      axios
        .post('https://testapi.simplifies.cl/api/order-web', this.data)
        .then(() => {
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.loadingProd = false;
          this.showAlert("success", "Producto agregado correctamente", 3000);
          this.initialize();
          /*let temp= this.results.filter(item => item.id == this.car_ref.id);
          console.log('tempsddasdasd');
          console.log(temp[0]);*/
          this.showDetails(this.car_ref);
          this.showAddProducts = false;
          this.product_store_id = '';
          this.cant = '';
        });
    },
    //endAddProduct
    //sale Product
    isSelectable(item) {
      return parseInt(item.pay) === 0;
    },
    calculateAmountSales() {
      this.amountSales = this.cashierSalesProf
        .filter(item => this.selected.includes(item.id))
        .reduce((total, item) => {
          //const price = parseFloat(item.price); // Convertir a número
          return total + (isNaN(item.price) ? 0 : item.price); // Sumar solo si es un número válido
        }, 0);
    },
    openDialogPaySales() {
      this.calculateAmountSales();
      this.dialogPaySales = true;
    },
    closeDialogPaySales() {
      this.selected = [];
      this.amountSales = '';
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedCard = Object.assign({}, this.defaultCard);
      this.dialogPaySales = false;
    },
    showDialogProduct() {
      LocalStorageService.setIsLocked(true);
      axios
        .get('https://testapi.simplifies.cl/api/cashiersale-show', {
          params: {
            branch_id: this.branch_id,
            professional_id: this.professional_id
          }
        })
        .then((response) => {
          this.cashierSalesProf = response.data.sales;
          console.log(this.cashierSalesProf);
        }).finally(() => {
          this.loadingCashier = false;
          LocalStorageService.setIsLocked(false);
        });
      this.showDialogSaleProducts = true;
    },
    closeDialogSaleProduct() {
      this.showDialogSaleProducts = false;
      this.initialize();
    },
    showSalegProduct() {
      LocalStorageService.setIsLocked(false);
      axios
        .get('https://testapi.simplifies.cl/api/productstore-show-web', {
          params: {
            branch_id: this.branch_id
          }
        })
        .then((response) => {
          this.products = response.data.products;

          console.log('imprime Productos');
          console.log(this.products);
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
        });
      this.showSaleProducts = true;
    },
    closeSaleProduct() {
      this.showSaleProducts = false;
      this.product_store_id = '';
      this.cant = '';

    },
    savePaySales() {
      {
        this.data.cash = parseFloat(this.editedItem.cash) || 0;
        this.data.creditCard = parseFloat(this.editedItem.creditCard) || 0;
        this.data.debit = parseFloat(this.editedItem.debit) || 0;
        this.data.transfer = parseFloat(this.editedItem.transfer) || 0;
        this.data.other = parseFloat(this.editedItem.other) || 0;
        this.data.cardGift = parseFloat(this.editedItem.cardGif) || 0;  // Fix typo here
        this.data.tip = /*parseFloat(this.editedItem.tip) ||*/ 0;
        this.data.code = this.editedCard.cardGiftUser_id || 0;  // Fix typo here
        this.data.nameProfessional = this.nameProfessional;
        this.data.branch_id = this.branch_id;
        this.data.professional_id = this.professional_id;
        this.data.ids = this.selected;
        console.log('data');
        console.log(this.data);
        const suma = this.data.cash + this.data.creditCard + this.data.debit + this.data.transfer + this.data.other + this.data.cardGift + this.data.tip;

        console.log(suma);
        console.log(this.amountSales + this.data.tip);
        if (suma === this.amountSales + this.data.tip) {
          LocalStorageService.setIsLocked(true);
          this.valid = true;
          axios
            .post('https://testapi.simplifies.cl/api/payment-product-sales', this.data)
            .then(() => {
            }).finally(() => {
              LocalStorageService.setIsLocked(false);
              this.showAlert("success", "Pago efectuado correctamente", 3000);
              this.initialize();
              this.showDialogProduct();
              this.$nextTick(() => {
                this.mostrarOtroCampo = false;
              });
            });
          this.dialogPaySales = false;
          this.selected = [];
          this.valid = true;
          this.editedItem = Object.assign({}, this.defaultItem);
        }
        else {
          this.showAlert("warning", "Monto debe coincidir con el monto total " + this.formatNumber(Number(this.amountSales)/* + Number(this.editedItem.tip)*/), 3000);
        }
        if (this.editedItem.cash || this.editedItem.creditCard || this.editedItem.debit || this.editedItem.transfer || this.editedItem.other || this.editedItem.cardGif /*|| this.editedItem.tip*/) {
          this.valid = true;
        }

      }
    },
    saveProductSale() {
      LocalStorageService.setIsLocked(true);
      this.loadingProd = true;
      this.data.product_store_id = this.product_store_id;
      this.data.nameProfessional = this.nameProfessional;
      this.data.branch_id = this.branch_id;
      this.data.professional_id = this.professional_id;
      this.data.cant = this.cant;
      axios
        .post('https://testapi.simplifies.cl/api/cashiersale', this.data)
        .then(() => {
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.showAlert("success", "Producto agregado correctamente", 3000);
          this.loadingProd = false;
          this.initialize();/*
          let temp= this.results.filter(item => item.id == this.car_ref.id);
          console.log('tempsddasdasd');
          console.log(temp[0]);*/
          this.showSaleProducts = false;
          this.product_store_id = '';
          this.cant = '';
          this.product_exit = '';
          this.showDialogProduct();
        });
    },
    exportToExcel() {
      console.log('Entra aqui a exportar');
      // Primero, prepara una matriz que contendrá todas las filas de datos, incluidos los encabezados
      let rows = [];

      // Construye un objeto para los encabezados basado en la estructura de 'headers'
      let headerRow = {};
      this.headers8.forEach(header => {
        headerRow[header.value] = header.title; // Usa 'key' para el mapeo y 'title' para el texto del encabezado
      });
      rows.push(headerRow);

      // Ahora, mapea los datos de los items para que coincidan con los encabezados
      this.bonus.forEach(item => {
        let rowData = {};
        this.headers8.forEach(header => {
          rowData[header.value] = item[header.value] || ''; // Asegura que cada celda se mapee correctamente; usa '' para datos faltantes
        });
        rows.push(rowData);
      });

      let nameReport = {
        // eslint-disable-next-line vue/no-use-computed-property-like-method
        name: 'Pago a profesional bonos', // Asume que 'name' es una de tus claves; ajusta según sea necesario
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
    exportToExcelProf() {
      console.log('Entra aqui a exportar');
      // Primero, prepara una matriz que contendrá todas las filas de datos, incluidos los encabezados
      let rows = [];

      // Construye un objeto para los encabezados basado en la estructura de 'headers'
      let headerRow = {};
      this.headers9.forEach(header => {
        headerRow[header.value] = header.title; // Usa 'key' para el mapeo y 'title' para el texto del encabezado
      });
      rows.push(headerRow);

      // Ahora, mapea los datos de los items para que coincidan con los encabezados
      this.bonus.forEach(item => {
        let rowData = {};
        this.headers9.forEach(header => {
          rowData[header.value] = item[header.value] || ''; // Asegura que cada celda se mapee correctamente; usa '' para datos faltantes
        });
        rows.push(rowData);
      });

      let nameReport = {
        // eslint-disable-next-line vue/no-use-computed-property-like-method
        name: 'Bonos por profesionales', // Asume que 'name' es una de tus claves; ajusta según sea necesario
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
.custom-tabs .v-tab {
  font-size: 12px;
  /* Tamaño de fuente más pequeño */
  padding: 4px 6px;
  /* Ajusta el padding para reducir el espacio */
}

.fixed-size-calendar {
  min-height: 100%;
  /* Ajustar según sea necesario */
  min-width: 100%;
  /* Ajustar según sea necesario */
  width: 100%;
  /* O establecer un ancho fijo */
  /* O establecer
   un ancho fijo */
}

.selected-tab {
  background-color: #F18254;
  /* Fondo del tab seleccionado */
  color: white;
  /* Texto blanco */
  border-radius: 4px;
  /* Esquinas redondeadas, opcional */
}

.v-calendar .v-event-title {
  white-space: normal !important;
  /* Permite el ajuste de texto */
  overflow-wrap: break-word;
  /* Rompe las palabras largas */
  word-break: break-word;
  /* Rompe el texto en palabras */
}
</style>