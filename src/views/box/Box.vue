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
        <v-col cols="12" md="3" class="mt-4">
          <span class="ml-4"> <strong>Caja <!--- {{ this.nameBranch }}--></strong></span>
        </v-col>
        <v-col cols="12" md="9" class="text-right">
          <v-dialog v-model="dialog" max-width="1000px">
            <template v-slot:activator="{ props }">
              <div class="text-center">
                <v-btn class="text-subtitle-1" color="#E7E9E9" variant="flat" elevation="2"
              prepend-icon="mdi-clipboard-text" @click="chargeData()">
              Reservaciones
            </v-btn>
                <v-btn @click="showDialogProduct" color="#E7E9E9" variant="flat" elevation="2" prepend-icon="mdi-cart" class="ml-1">
                  Venta Productos
                </v-btn>
                <v-btn @click="dialogDetallesCarPagado = true" color="#E7E9E9" variant="flat" elevation="2"
                  prepend-icon="mdi-account-star-outline" :disabled="filteredItemsPay.length !== 0 ? false : true"
                  class="ml-1">
                  Clientes atendidos
                </v-btn>
                <v-btn :disabled="closed_box" v-bind="props" color="#E7E9E9" variant="flat" elevation="2"
                  prepend-icon="mdi-plus-circle" class="ml-1">
                  Cierre de Caja
                </v-btn>
                <v-btn @click="openDialogBox" color="#E7E9E9" variant="flat" elevation="2"
                  prepend-icon="mdi-cash-register" class="ml-1">
                  Caja
                </v-btn>
              </div>
            </template>
            <v-card>
              <v-toolbar color="#F18254">
                <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
              </v-toolbar>
              <v-card-text>

                <v-row class="mb-4 mt-1">
                  <v-col cols="4">
                    <v-card class="mx-auto" max-width="344" title="Total" :subtitle="totalMount()"
                      append-icon="mdi-check">

                      <template v-slot:prepend>
                        <v-avatar color="blue-darken-2">
                          <v-icon icon="mdi-currency-usd"></v-icon>
                        </v-avatar>
                      </template>
                    </v-card>
                  </v-col>

                  <v-col cols="4">
                    <v-card class="mx-auto" max-width="344" title="Servicios" :subtitle="totalMountServices()"
                      append-icon="mdi-check">

                      <template v-slot:prepend>
                        <v-avatar color="light-blue">
                          <v-icon icon="mdi-list-box-outline"></v-icon>
                        </v-avatar>
                      </template>
                    </v-card>
                  </v-col>

                  <v-col cols="4">
                    <v-card class="mx-auto" max-width="344" title="Productos" :subtitle="totalMountProducts()"
                      append-icon="mdi-check">

                      <template v-slot:prepend>
                        <v-avatar color="lime">
                          <v-icon icon="mdi-tag-outline"></v-icon>
                        </v-avatar>
                      </template>
                    </v-card>
                  </v-col>

                  <v-col cols="4">
                    <v-card class="mx-auto" max-width="344" title="Propinas" :subtitle="totalMountTips()"
                      append-icon="mdi-check">

                      <template v-slot:prepend>
                        <v-avatar color="purple">
                          <v-icon icon="mdi-cash-100"></v-icon>
                        </v-avatar>
                      </template>
                    </v-card>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="4">
                    <v-card class="mx-auto" max-width="344" title="Efectivo" :subtitle="totalMountCashs()"
                      append-icon="mdi-check">

                      <template v-slot:prepend>
                        <v-avatar color="amber ">
                          <v-icon icon="mdi-cash"></v-icon>
                        </v-avatar>
                      </template>
                    </v-card>
                  </v-col>

                  <v-col cols="4">
                    <v-card class="mx-auto" max-width="344" title="Débito" :subtitle="totalMountDebits()"
                      append-icon="mdi-check">

                      <template v-slot:prepend>
                        <v-avatar color="cyan">
                          <v-icon icon="mdi-credit-card-outline"></v-icon>
                        </v-avatar>
                      </template>
                    </v-card>
                  </v-col>

                  <v-col cols="4">
                    <v-card class="mx-auto" max-width="344" title="Tarjeta Crédito" :subtitle="totalMountCreditCards()"
                      append-icon="mdi-check">

                      <template v-slot:prepend>
                        <v-avatar color="teal">
                          <v-icon icon="mdi-credit-card"></v-icon>
                        </v-avatar>
                      </template>
                    </v-card>
                  </v-col>

                  <v-col cols="4">
                    <v-card class="mx-auto" max-width="344" title="Transferencia" :subtitle="totalMountTransfers()"
                      append-icon="mdi-check">

                      <template v-slot:prepend>
                        <v-avatar color="red-darken-2">
                          <v-icon icon="mdi-bank-transfer"></v-icon>
                        </v-avatar>
                      </template>
                    </v-card>
                  </v-col>
                  <v-col cols="4">
                    <v-card class="mx-auto" max-width="344" title="Otros" :subtitle="totalMountOthers()"
                      append-icon="mdi-check">

                      <template v-slot:prepend>
                        <v-avatar color="green-darken-2">
                          <v-icon icon="mdi-currency-usd"></v-icon>
                        </v-avatar>
                      </template>
                    </v-card>
                  </v-col>
                  <v-col cols="4">
                    <v-card class="mx-auto" max-width="344" title="Tarjeta Regalo" :subtitle="totalMountCardGif()"
                      append-icon="mdi-check">

                      <template v-slot:prepend>
                        <v-avatar color="green-darken-2">
                          <v-icon icon="mdi-gift"></v-icon>
                        </v-avatar>
                      </template>
                    </v-card>
                  </v-col>
                </v-row>

              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="#F18254" :disabled="box_close" variant="flat" @click="saveCloseBox">
                  Cerrar Caja
                </v-btn>
              </v-card-actions>
            </v-card>

          </v-dialog>
        </v-col>
      </v-row>

    </v-toolbar>

    <v-card-text>
      <v-row class="mb-4 mt-1">
        <v-col cols="12" md="3">
          <v-card title="Total" :subtitle="totalMount()" append-icon="mdi-check">

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

            <v-spacer></v-spacer>

            <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify"
              variant="solo-filled" flat hide-details single-line></v-text-field>
          </v-card-title>
          <!--<v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
        hide-details></v-text-field>-->


          <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="filteredItems"
            :search="search" class="elevation-1" no-results-text="No hay datos disponibles"
            no-data-text="No hay datos disponibles" :loading="loadingcar" loading-text="Cargando datos...">

            <template v-slot:item.professionalName="{ item }">

              <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_url" alt="image"></v-img>
              </v-avatar>
              {{ item.professionalName }}
            </template>

            <template v-slot:item.clientName="{ item }">

              <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                <v-img :src="'https://api2.simplifies.cl/api/images/' + item.client_image" alt="image"></v-img>
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
              <!--<v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
            </template>

        <v-list>
          <v-list-item>
            <v-btn density="comfortable" icon="mdi-eye" @click="(item.active != 3) &&  showDetails(item)"
              :color="(item.active != 3) ? 'blue' : 'grey'" variant="tonal" elevation="1" class="mr-1 mt-1 mb-1"
              title="Mostrar detalles del carro"></v-btn>
            <v-btn density="comfortable" icon="mdi-credit-card" @click="(item.active != 3) && payItem(item)"
              :color="(item.active != 3) ? 'green-darken-1' : 'grey'" variant="tonal" elevation="1"
              class="mr-1 mt-1 mb-1" title="Pagar el carro"></v-btn>
            <v-btn density="comfortable" icon="mdi-delete" @click="(item.active != 3) && deleteItemSolicitud(item)"
              :color="(item.active != 3) ? 'red-darken-4' : 'grey'" variant="tonal" elevation="1"
              title="Solicitud de eliminar carro"></v-btn>
          </v-list-item>
        </v-list>
        </v-menu>-->
              <v-btn density="comfortable" icon="mdi-eye" @click="(item.active != 3) && showDetails(item)"
                :color="(item.active != 3) ? 'blue' : 'grey'" variant="tonal" elevation="1" class="mr-1 mt-1 mb-1"
                title="Mostrar detalles del carro"></v-btn>
              <v-btn density="comfortable" icon="mdi-credit-card"
                @click="(item.active != 3 && item.state == 1) && payItem(item)"
                :color="(item.active != 3 && item.state == 1) ? 'green-darken-1' : 'grey'" variant="tonal" elevation="1"
                class="mr-1 mt-1 mb-1" title="Pagar el carro"></v-btn>
              <v-btn density="comfortable" icon="mdi-delete" @click="(item.active != 3) && deleteItemSolicitud(item)"
                :color="(item.active != 3) ? 'red-darken-4' : 'grey'" variant="tonal" elevation="1"
                title="Solicitud de eliminar carro"></v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
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
                    <v-text-field v-model="editedItem.debit" clearable label="Debito"
                      prepend-icon="mdi-credit-card-outline" variant="underlined" :rules="pago">
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
                  <v-select v-model="selectedOption" :items="options" label="Método de pago"
                                variant="underlined" hide-details></v-select>
                </v-col>
              </v-row>
            </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field clearable v-model="editedCard.cardGiftUser_id" label="Tarjeta de regalo (código)"
                      prepend-icon="mdi-gift" variant="underlined" :rules="customCardGiftValidation"></v-text-field><!--@input="onCardGiftSelected"-->
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field v-if="mostrarOtroCampo" v-model="editedCard.value" clearable label="Valor"
                      prepend-icon="mdi-currency-usd" variant="underlined" :disabled="true">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field v-model="editedItem.cardGif" clearable label="Cantidad"
                      prepend-icon="mdi-currency-usd" variant="underlined" :rules=[customValidation]
                      v-if="mostrarOtroCampo">
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
                <v-btn color="#F18254" variant="flat" @click="savePay" :disabled="!valid">
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
                <v-btn color="#E7E9E9" variant="flat" @click="showService(this.car_ref)"
                  prepend-icon="mdi-list-box-outline" class="mr-1" :disabled="this.car_ref.pay == 1 || this.car_ref.state == 2 ? true : false">
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
                  <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image" alt="image"></v-img>
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

            <v-btn color="#F18254" variant="flat" :disabled="this.car_ref.state != 1 ? true : false" @click="payItem(this.car_ref)">
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
                  <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="product_store_id"
                    :items="products" clearable label="Productos" prepend-icon="mdi-tag-outline" item-title="name"
                    item-value="id" variant="underlined" :rules="selectRules" @update:model-value="cantExist">
                    <!--chips
              closable-chips<template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :prepend-avatar="'https://api2.simplifies.cl/api/images/'+item.raw.image_product"
                  :text="item.raw.name"
                ></v-chip>
              </template>-->
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props"
                        :prepend-avatar="'https://api2.simplifies.cl/api/images/' + item.raw.image_product"
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
                        :prepend-avatar="'https://api2.simplifies.cl/api/images/' + item.raw.image_service"
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
                    <v-text-field v-model="editedBox.existence" clearable label="Existencia"
                      prepend-icon="mdi-check-circle" variant="underlined" :rules="pago" :disabled="true">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field v-model="editedBox.extraction" clearable label="Extracción"
                      prepend-icon="mdi-arrow-down-bold" variant="underlined" :rules="pago" @update:modelValue="checkExtraction">
                    </v-text-field>
                  </v-col>
                  <!-- Campos adicionales -->
                </v-row>
                <v-row>
                  <!-- Campos adicionales -->
                  <v-col v-if="this.showAdditionalFields" cols="12" md="6">
                    <v-file-input v-model="file" ref="fileInput" name="file" label="Archivo" prepend-icon="mdi-paperclip" variant="underlined" :rules="selectRules" accept=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .odt, .ods, .odp, .rtf, .html, .xml, .csv, .png, .jpg, .jpeg"  @change="onFileSelected">
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
                  <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_url" alt="image"></v-img>
                </v-avatar>
                {{ item.professionalName }}
              </template>

              <template v-slot:item.clientName="{ item }">

                <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                  <v-img :src="'https://api2.simplifies.cl/api/images/' + item.client_image" alt="image"></v-img>
                </v-avatar>
                {{ item.clientName }}
              </template>

              <template v-slot:item.pay="{ item }">
                <v-chip :color="parseInt(item.pay) === '0' ? 'red' : 'green'" :text="item.pay" class="text-uppercase"
                  label size="small">
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
              no-data-text="No hay datos disponibles" :item-selectable="isSelectable" show-select :loading="loadingCashier" loading-text="Cargando datos...">

              <template v-slot:item.name="{ item }">

                <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                  <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_product" alt="image"></v-img>
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
                  @click="(item.pay == 0) ? editItemProduct(item) : ''"
                  :color="(item.pay != 0) ? 'grey' : 'red-darken-4'" variant="tonal" elevation="1"
                  title="Solicitar Eliminar Producto"></v-btn>
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
                  <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="product_store_id"
                    :items="products" clearable label="Productos" prepend-icon="mdi-tag-outline" item-title="name"
                    item-value="id" variant="underlined" :rules="selectRules" @update:model-value="cantExist">
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props"
                        :prepend-avatar="'https://api2.simplifies.cl/api/images/' + item.raw.image_product"
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
                    <v-text-field v-model="editedItem.debit" clearable label="Debito"
                      prepend-icon="mdi-credit-card-outline" variant="underlined" :rules="pago">
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
                    <v-text-field v-model="editedItem.cardGif" clearable label="Cantidad"
                      prepend-icon="mdi-currency-usd" variant="underlined" :rules=[customValidation]
                      v-if="mostrarOtroCampo">
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
                <v-btn @click="exportToExcel" color="#E7E9E9" variant="flat" elevation="2"
                  prepend-icon="mdi-file-excel">
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
                  <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_url" alt="image"></v-img>
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
                  <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_url" alt="image"></v-img>
                </v-avatar>
                {{ item.name }}
              </template>
              <template v-slot:item.amount="{ item }">
                {{ formatNumber(item.amount) }}
              </template>
              <template v-slot:item.actions="{ item }">
                    <v-btn variant="flat" @click="(item.pay) ? '' :payBonusProf(item)" :color="(item.pay) ? 'grey' : '#F18254'" title="Pagar bono a profesional" style="min-width: 100px;">
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
            <v-btn color="#F18254" variant="flat" @click="payBonus">
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
                      :prepend-avatar="'https://api2.simplifies.cl/api/images/' + item.raw.image_url"
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
              <!--<v-cols cols="6">
<v-select
v-model="weekday"
:items="weekdays"
class="ma-2"
label="weekdays"
variant="outlined"
dense
hide-details
></v-select>
</v-cols>-->
            </v-row>
            <v-calendar ref="calendar" v-model="value" :events="events" locale="es"
                      :event-color="getEventColor" class="fixed-size-calendar" text="Hoy" type="month">
                    </v-calendar>
            <!--<v-sheet>
:weekdays="weekday"
<v-calendar
ref="calendar"
v-model="value"
:events="events"
:view-mode="type"
:weekdays="weekday"
></v-calendar>
</v-sheet>-->
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
    </v-card-text>


  </v-card>
</template>

<script>

import axios from "axios";
import LocalStorageService from "@/LocalStorageService";
import * as XLSX from 'xlsx';
import { format } from "date-fns";
import { VCalendar } from 'vuetify/labs/VCalendar'

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
  },

  data: () => ({
    showReserPrpfessional: false,
    reservations: [],
    type: 'month',
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
    colors: [
      'blue',
      'green',
      'orange',
    ],
    valid: true,
    loadingcar:true,
    loadingOrders: true,
    loadingCashier: true,
    loadingBonus: true,
    loadingBonusProf: true,
    loadingProd: false,
    loadingServ: false,
    mostrarFila: false,
    car_ref: "",
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
    dialogDetallesCar: false,
    dialogRequest: false,
    dialogDelete: false,
    dialogConfBonus: false,
    dialogPay: false,
    dialogBox: false,
    loading: false,
    bonus_ref: [],
    branch_id: '',
    charge_id: '',
    business_id: '',
    nameBranch: '',
    nameProfessional: '',
    professional_id: '',
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
    search4: '',
    selected: [],
    bonus: [],
    bonusProf: [],
    amountSales: '',
    dialogPaySales: false,
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
      { title: 'No', value: 'id' },
      { title: 'Profesional', value: 'professionalName' },
      { title: 'Cliente', value: 'clientName' },
      { title: 'Teléfono', key: 'phone', sortable: false },
      { title: 'Técnico', value: 'technical_assistance' },
      { title: 'Productos', value: 'product' },
      { title: 'Servicios', value: 'service' },
      { title: 'Propina', value: 'tip' },
      { title: 'Monto Total', value: 'amount' },
      { title: 'Estado', value: 'pay' },
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
      tipByCash: 'Efectivo'
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
      totalCardGif: ''
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
      totalCardGif: ''
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
      tipByCash: 'Efectivo'
    },

    selectedOption: 'Efectivo',
    options: ['Efectivo', 'Débito', 'Transferencia', 'Tarjeta de regalo', 'Tarjeta de Crédito', 'Otro Método'],
    showAdditionalFields: false,
    file: '',
    pago: [
      //(value) => !!value || 'Campo requerido',
      (value) => !value || (/^\d+(\.\d+)?$/.test(value)) || "Debe ser un número con punto decimal (10.00)",
      (value) => !value || !isNaN(parseFloat(value)) || 'Debe ser un número'],
    pago1: [
      (value) => !!value || 'Campo requerido',
      (value) => !value || !isNaN(parseFloat(value)) || 'Debe ser un número',
      (value) => /^\d+(\.\d+)?$/.test(value) || "Debe ser un número con punto decimal (10.00)",],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
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
  },

  watch: {
    'editedCard.value': function (newVal) {
      if (newVal !== '') {
        this.customValidation(); // Llamar a la validación solo cuando editedCard.value tenga un valor
      }
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

  mounted() {
    /*this.branch_id = userTokenStore.branch_id;
    this.nameBranch = userTokenStore.nameBranch;*/
    this.business_id = LocalStorageService.getItem('business_id');
    this.charge_id = LocalStorageService.getItem('charge_id');
    this.branch_id = LocalStorageService.getItem('branch_id');
    this.professional_id = LocalStorageService.getItem('professional_id');
    this.nameBranch = LocalStorageService.getItem('nameBranch');
    this.nameProfessional = JSON.parse(LocalStorageService.getItem("name"));
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
      this.startInterval();
  },
  beforeUnmount() {
    // Detener el intervalo cuando el componente se esté destruyendo para evitar fugas de memoria
    clearInterval(this.intervalId);
    LocalStorageService.setIsLocked(false);
  },

  methods: {
    onFileSelected(event) {
            let file = event.target.files[0];
            this.editedBox.file = file;
            console.log(this.editedItem.file);
            //this.cargarImage(file);
        },
    checkExtraction() {
      this.showAdditionalFields = this.editedBox.extraction !== '';
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
      .get("https://api2.simplifies.cl/api/branch-reservations-periodo", {
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
      .get("https://api2.simplifies.cl/api/professional-reservations-periodo", {
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
      window.open('http://wa.me/'+'+' + phone);
    },
    stopInterval() {
      console.log('Detener intervalo');
    clearInterval(this.intervalId);
    LocalStorageService.setIsLocked(false);
    },
    startInterval() {
      if (!this.branch_id) {
        return; // Sale de la función si branch_id no tiene valor
      }
      //const token = LocalStorageService.getItem('token');
      console.log('Reiniciar intervalo');
      this.intervalId = setInterval(() => {
        if (!LocalStorageService.getIsLocked()) {
          this.loadingcar = true;
        LocalStorageService.setIsLocked(true); // Bloquear antes de hacer la petición
        axios
          .get('https://api2.simplifies.cl/api/branch-cars', {
            /*headers: {
                  'Authorization': `Bearer ${token.replace(/['"]+/g, '')}`
              },*/
            params: {
              branch_id: this.branch_id
            }
          })
          .then((response) => {
            this.results = response.data.cars;
            this.box = response.data.box;
            this.payments = response.data.payments;
            this.cashierSales = response.data.cashierSales;
            console.log('this.box');
            console.log(this.box);
          }).finally(() => {
            if (this.box === null) {
              this.ejecutado = false;
            } else {
              if (this.box.box_close === null) {
                this.ejecutado = false;
                console.log('this.box.box_close false');
              } else {
                this.ejecutado = true;
                console.log('this.box.box_close true');
              }
            }
            console.log('this.ejecutado');
            console.log(this.ejecutado);
            LocalStorageService.setIsLocked(false); // Desbloquear después de la petición
            console.log('isLocked después de la solicitud Box:', LocalStorageService.getIsLocked());
            this.loadingcar = false;
          });
        }
      }, 30000);
    },
    showBonus() {
      this.loadingBonus = true;
      LocalStorageService.setIsLocked(true);
      axios
        .get('https://api2.simplifies.cl/api/branch-payment-show-bonus', {
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
        .get('https://api2.simplifies.cl/api/bonus-show', {
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
            .post('https://api2.simplifies.cl/api/bonu-payment', this.data)
            .then(() => {
            }).finally(() => {
              LocalStorageService.setIsLocked(false);
              this.showAlert("success", "Pago del bono efectuado correctamente", 3000);
              this.bonus_ref = [];
              this.dialogConfBonus = false;
              this.startInterval();
              this.initialize();
              this.showBonusProf();
            });
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
      if(this.selectedOption === 'Tarjeta de regalo'){
        // Convertir ambos valores a enteros y sumarlos
        const cardGifValue = parseInt(this.editedItem.cardGif, 10) || 0;
        const tipValue = parseInt(this.editedItem.tip, 10) || 0;
        const sum = cardGifValue + tipValue;
        console.log('con sin propina');
        console.log(sum);
        if (this.editedCard.value !== '' && sum > parseInt(this.editedCard.value)) {
        return 'El valor de la tarjeta de regalo no puede ser mayor que ' + this.formatNumber(this.editedCard.value);
        }else{
          return true;
        }
      }else{
        console.log('sin propina');
        console.log(this.editedItem.cardGif);
        if (this.editedCard.value !== '' && parseInt(this.editedItem.cardGif) > parseInt(this.editedCard.value)) {
        return 'El valor de la tarjeta de regalo no puede ser mayor que ' + this.formatNumber(this.editedCard.value);
      }else{
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
        .get('https://api2.simplifies.cl/api/card-gift-user-show-value', {
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
        .put('https://api2.simplifies.cl/api/car', request)
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
      let request = {
        id: item.id,
        nameProfessional: this.nameProfessional,
        branch_id: this.branch_id,
        professional_id: this.professional_id
      };
      axios
        .post('https://api2.simplifies.cl/api/order-destroy-solicitud', request)
        .then(() => {
          //this.initialize();
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.showDetails(this.car_ref);
          this.showAlert("success", "Solicitud de eliminación de orden hecha correctamente", 3000);
        });
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
        .post('https://api2.simplifies.cl/api/cashiersale-destroy-solicitud', request)
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
        .post('https://api2.simplifies.cl/api/order-destroy-web', request)
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
        .put('https://api2.simplifies.cl/api/order-web', request)
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
      /*axios
        .get('https://api2.simplifies.cl/api/box-show', {
          params: {
            branch_id: this.branch_id
          }
        })
        .then((response) => {
          this.box = response.data.box;
        });*/
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

    initialize() {
      if (!this.branch_id) {
    return; // Sale de la función si branch_id no tiene valor
  }
      //const token = LocalStorageService.getItem('token');
      //if (!LocalStorageService.getIsLocked()) {
        this.loadingcar = true;
      LocalStorageService.setIsLocked(true); // Bloquear antes de hacer la petición
      axios
        .get('https://api2.simplifies.cl/api/branch-cars', {
          /*headers: {
                'Authorization': `Bearer ${token.replace(/['"]+/g, '')}`
            },*/
          params: {
            branch_id: this.branch_id
          }
        })
        .then((response) => {
          this.results = response.data.cars;
          this.box = response.data.box;
          this.payments = response.data.payments;
          this.cashierSales = response.data.cashierSales;
          console.log('this.box');
          console.log(this.box);
        }).finally(() => {
          if (this.box === null) {
            this.ejecutado = false;
          } else {
            // Si this.box no es null, verificar si box_close es null
            if (this.box.box_close === null) {
              this.ejecutado = false;
            } else {
              this.ejecutado = true;
            }
          }
          console.log('this.ejecutado');
          console.log(this.ejecutado);
          LocalStorageService.setIsLocked(false);
          console.log('isLocked después de la solicitud Box:', LocalStorageService.getIsLocked());
          this.loadingcar = false;
        });
      //}
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
        .post('https://api2.simplifies.cl/api/car-destroy-solicitud', request)
        .then(() => {
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.initialize();
          this.showAlert("success", "Solicitud de eliminacion hecha correctamente", 3000);
        });
    },

    payItem(item) {
      this.selectedOption = 'Efectivo';
      this.stopInterval();
      this.car_ref = [];
      this.initialize();
      console.log('Carro a pagar');
      console.log(item);
      this.car_ref = item;
      let temp = this.results.filter(item => item.id == this.car_ref.id);
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
        .get('https://api2.simplifies.cl/api/card-gift-show', {
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
      this.car_ref = item
      this.editedItem.id = item.id;
      axios
        .get('https://api2.simplifies.cl/api/order-show', {
          params: {
            car_id: item.id
          }
        })
        .then((response) => {
          this.orders = response.data.orders;
          console.log('imprime oreders');
          console.log(this.orders);
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
        .post('https://api2.simplifies.cl/api/car-destroy', request)
        .then(() => {
        }).finally(() => {
          this.showAlert("success", "Carro eliminado correctamente", 3000);
          LocalStorageService.setIsLocked(false);
        });
      this.dialogDelete = false;
    },
    savePay() {
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
            .put('https://api2.simplifies.cl/api/payment', this.data)
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
          this.dialogPay = false;
          this.dialogDetallesCar = false;
          this.valid = true;
        }
        else {
          this.showAlert("warning", "Monto debe coincidir con el monto total " + this.formatNumber(Number(this.editedItem.amount) + Number(this.editedItem.tip)), 3000);
        }
        if (this.editedItem.cash || this.editedItem.creditCard || this.editedItem.debit || this.editedItem.transfer || this.editedItem.other || this.editedItem.cardGif || this.editedItem.tip) {
          this.valid = true;
        }
    },
    saveCloseBox() {
      LocalStorageService.setIsLocked(true);
      //this.data.box_id = this.editedBox.id;
      this.data.totalCash = this.editedCloseBox.totalCash;
      this.data.totalCreditCard = this.editedCloseBox.totalCreditCard;
      this.data.totalDebit = this.editedCloseBox.totalDebit;
      this.data.totalTransfer = this.editedCloseBox.totalTransfer;
      this.data.totalOther = this.editedCloseBox.totalOther;
      this.data.totalTip = this.editedCloseBox.totalTip;
      this.data.totalService = this.editedCloseBox.totalService;
      this.data.totalProduct = this.editedCloseBox.totalProduct;
      this.data.totalMount = this.editedCloseBox.totalMount;
      this.data.totalCardGif = this.editedCloseBox.totalCardGif;
      this.data.branch_id = this.branch_id;
      this.data.nameProfessional = this.nameProfessional;
      console.log(this.data);
      axios
        .post('https://api2.simplifies.cl/api/closebox', this.data)
        .then((response) => {
          this.bonus = response.data.bonus;
          this.loadingBonus = true;
          console.log('this.bonus');
          console.log(this.bonus);
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.showAlert("success", "Cierre de caja efectuado correctamente", 3000);
          this.showDialogBonus = true;
          this.loadingBonus = false;
          //this.startInterval();
          //this.initialize();
        });
      this.$nextTick(() => {
        this.editedCloseBox = Object.assign({}, this.defaultCloseBox)

      });
      this.ejecutado = true;
      this.dialog = false;
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
          .post('https://api2.simplifies.cl/api/box', formData)
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
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
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
        .get('https://api2.simplifies.cl/api/services-professional-branch-web', {
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
        .post('https://api2.simplifies.cl/api/order-web', this.data)
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
        .get('https://api2.simplifies.cl/api/productstore-show-web', {
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
        .post('https://api2.simplifies.cl/api/order-web', this.data)
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
        .get('https://api2.simplifies.cl/api/cashiersale-show', {
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
        .get('https://api2.simplifies.cl/api/productstore-show-web', {
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
            .post('https://api2.simplifies.cl/api/payment-product-sales', this.data)
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
        .post('https://api2.simplifies.cl/api/cashiersale', this.data)
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
.fixed-size-calendar {
  min-height: 100%;
  /* Ajustar según sea necesario */
  min-width: 100%;
  /* Ajustar según sea necesario */
  width: 100%;
  /* O establecer un ancho fijo */
  /* O establecer un ancho fijo */
}
</style>