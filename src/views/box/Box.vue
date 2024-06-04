<!-- eslint-disable vue/return-in-computed-property -->
<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-snackbar class="mt-12" location="right top" :timeout="sb_timeout" :color="sb_type" elevation="24" :multi-line="true"
    vertical v-model="snackbar">
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
        <v-col cols="12" md="4" class="mt-4">
          <span class="ml-4"> <strong>Caja <!--- {{ this.nameBranch }}--></strong></span>
        </v-col>
        <v-col cols="12" md="8" class="text-right">           
          <v-dialog v-model="dialog" max-width="1000px">
 <template v-slot:activator="{ props }">
          <div class="text-center">
            <v-btn @click="showDialogProduct" color="#E7E9E9" variant="flat" elevation="2"
                  prepend-icon="mdi-cart">
                  Venta Productos
                </v-btn>
                <v-btn @click="dialogDetallesCarPagado = true" color="#E7E9E9" variant="flat" elevation="2"
                  prepend-icon="mdi-account-star-outline" :disabled="filteredItemsPay.length !== 0 ? false : true" class="ml-1">
                  Clientes atendidos
                </v-btn>
                <v-btn :disabled="(closed_box || ejecutado)" v-bind="props" color="#E7E9E9" variant="flat" elevation="2"
                  prepend-icon="mdi-plus-circle" class="ml-1">
                  Cierre de Caja
                </v-btn>
                <v-btn @click="openDialogBox" color="#E7E9E9" variant="flat" elevation="2"
                  prepend-icon="mdi-cash-register" class="ml-1">
                  Caja
                </v-btn></div>
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
                <v-btn color="#F18254" :disabled="ejecutado" variant="flat" @click="saveCloseBox">
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
          <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches" v-if="this.mostrarFila" clearable
            label="Seleccione una Sucursal" prepend-icon="mdi-store" item-title="name" item-value="id"
            variant="underlined" @update:model-value="initialize()"></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>        
        <v-col cols="12" md="12">
          <v-card-title class="d-flex align-center pe-2">
            <v-btn @click="initialize" class="mt-1 mb-1" color="#F18254">
        <v-icon left>mdi-refresh</v-icon>
        Refrescar
      </v-btn>

      <v-spacer></v-spacer>

      <v-text-field
        v-model="search"
        density="compact"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
      ></v-text-field>
    </v-card-title>
          <!--<v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
        hide-details></v-text-field>-->


      <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="filteredItems" :search="search"
        class="elevation-1" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">

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
                {{ formatNumber(item.technical_assistance)}}                                  
                                          </template>
                                          <template v-slot:item.product="{ item }">
                {{ formatNumber(item.product)}}                                  
                                          </template>
                                          <template v-slot:item.service="{ item }">
                {{ formatNumber(item.service)}}                                  
                                          </template>
                                          <template v-slot:item.amount="{ item }">
                {{ formatNumber(item.amount)}}                                  
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
                <v-btn density="comfortable" icon="mdi-eye" @click="(item.active != 3) &&  showDetails(item)" :color="(item.active != 3) ? 'blue' : 'grey'" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Mostrar detalles del carro"></v-btn>
          <v-btn density="comfortable" icon="mdi-credit-card" @click="(item.active != 3) && payItem(item)" :color="(item.active != 3) ? 'green-darken-1' : 'grey'"
            variant="tonal" elevation="1" class="mr-1 mt-1 mb-1" title="Pagar el carro"></v-btn>
          <v-btn density="comfortable" icon="mdi-delete" @click="(item.active != 3) && deleteItemSolicitud(item)" :color="(item.active != 3) ? 'red-darken-4' : 'grey'" variant="tonal"
            elevation="1" title="Solicitud de eliminar carro"></v-btn>
              </v-list-item>
            </v-list>
          </v-menu>-->
          <v-btn density="comfortable" icon="mdi-eye" @click="(item.active != 3) &&  showDetails(item)" :color="(item.active != 3) ? 'blue' : 'grey'" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Mostrar detalles del carro"></v-btn>
          <v-btn density="comfortable" icon="mdi-credit-card" @click="(item.active != 3) && payItem(item)" :color="(item.active != 3) ? 'green-darken-1' : 'grey'"
            variant="tonal" elevation="1" class="mr-1 mt-1 mb-1" title="Pagar el carro"></v-btn>
          <v-btn density="comfortable" icon="mdi-delete" @click="(item.active != 3) && deleteItemSolicitud(item)" :color="(item.active != 3) ? 'red-darken-4' : 'grey'" variant="tonal"
            elevation="1" title="Solicitud de eliminar carro"></v-btn>
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
                    <v-text-field v-model="editedItem.tip" clearable label="Propina" prepend-icon="mdi-currency-usd"
                      variant="underlined" :rules="pago">
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field clearable v-model="editedCard.cardGiftUser_id" label="Tarjeta de regalo (código)"
                    prepend-icon="mdi-gift" variant="underlined" ></v-text-field><!--@input="onCardGiftSelected"-->
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
                  prepend-icon="mdi-list-box-outline" class="mr-1" :disabled="this.car_ref.pay == 1 ? true : false">
                  Agregar Servicio
                </v-btn>
                <v-btn color="#E7E9E9" variant="flat" @click="showProduct(this.car_ref)" prepend-icon="mdi-tag-outline" :disabled="this.car_ref.pay == 1 ? true : false">
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
              no-data-text="No hay datos disponibles">

              <template v-slot:item.image="{ item }">

                <v-avatar elevation="3" color="grey-lighten-4" size="large">
                  <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image" alt="image"></v-img>
                </v-avatar>

              </template>
              <template v-slot:item.price="{ item }">
                {{ formatNumber(item.price)}}                                  
                                          </template>
              <template v-slot:item.actions="{ item }">
                <v-btn density="comfortable" icon="mdi-cancel"
                :color="(item.request_delete != 3) ? 'red-darken-4' : 'grey'" title="Solicitar eliminar orden"
                  @click="item.request_delete != 3 && deleteOrder(item)" elevation="1" class="mr-1 mt-1 mb-1"></v-btn>

                <!--<v-btn :color="(item.request_delete && !this.car_ref.pay) ? 'blue' : 'grey'" density="comfortable" icon="mdi-check"
                  title="Denegar solicitud" @click="(item.request_delete && !this.car_ref.pay) && requestCancel(item)" elevation="1" class="mr-1 mt-1 mb-1"></v-btn>-->

              </template>

            </v-data-table>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="closeDelete">
              Volver
            </v-btn>

            <v-btn color="#F18254" variant="flat" :disabled="this.car_ref.pay" @click="payItem(this.car_ref)">
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
                  <v-autocomplete
                  :no-data-text="'No hay datos disponibles'" v-model="product_store_id" :items="products" clearable label="Productos"
                    prepend-icon="mdi-tag-outline" item-title="name" item-value="id" variant="underlined"
                    :rules="selectRules"  @update:model-value="cantExist" 
                  >
                  <!--chips
              closable-chips<template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :prepend-avatar="'https://api2.simplifies.cl/api/images/'+item.raw.image_product"
                  :text="item.raw.name"
                ></v-chip>
              </template>-->
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :prepend-avatar="'https://api2.simplifies.cl/api/images/'+item.raw.image_product"
                  :subtitle="'Existencia: '+item.raw.product_exit"
                  :title="item.raw.name"
                ></v-list-item>
              </template>
                </v-autocomplete>
                    <v-text-field v-model="product_exit" clearable label="Existencia"
                      prepend-icon="mdi-currency-usd" variant="underlined" disabled="true">
                    </v-text-field>
                    <v-text-field v-model="cant" clearable label="Cantidad"
                      prepend-icon="mdi-currency-usd" variant="underlined" :rules=[validateCantidad]>
                    </v-text-field>
                </v-col>
                
                
              </v-row>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="#E7E9E9" variant="flat" @click="closeAddProduct">
                  Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" @click="saveAddProduct" :disabled="!valid">
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
                  <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_service_professional_id" :items="services" clearable label="Servicios"
                    prepend-icon="mdi-list-box-outline" item-title="name" item-value="id" variant="underlined"
                    :rules="selectRules">
                    <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :prepend-avatar="'https://api2.simplifies.cl/api/images/'+item.raw.image_service"
                  :subtitle="'Precio: '+item.raw.price_service"
                  :title="item.raw.name"
                ></v-list-item>
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
                <v-btn color="#F18254" variant="flat" @click="saveAddServie" :disabled="!valid">
                  Aceptar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!--EndAddServices-->
      <v-dialog v-model="dialogBox" max-width="600px">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-2 ml-4">Actualizar Caja</span>
          </v-toolbar>

          <v-card-text>
            <v-form v-model="valid" enctype="multipart/form-data">
              <v-container>
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
                      prepend-icon="mdi-arrow-down-bold" variant="underlined" :rules="pago">
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


      <v-data-table :headers="headers3" :items-per-page-text="'Elementos por páginas'" :items="filteredItemsPay" :search="search3"
        class="elevation-1" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">

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
          <v-chip :color="parseInt(item.pay) === '0' ? 'red' : 'green'" :text="item.pay" class="text-uppercase" label size="small">
            {{ item.pay === '0' ? 'Pendiente' : 'Pagado' }}
          </v-chip>
        </template>
        <template v-slot:item.technical_assistance="{ item }">
                {{ formatNumber(item.technical_assistance)}}                                  
                                          </template>
                                          <template v-slot:item.product="{ item }">
                {{ formatNumber(item.product)}}                                  
                                          </template>
                                          <template v-slot:item.service="{ item }">
                {{ formatNumber(item.service)}}                                  
                                          </template>
                                          <template v-slot:item.tip="{ item }">
                {{ formatNumber(item.tip)}}                                  
                                          </template>
                                          <template v-slot:item.amount="{ item }">
                {{ formatNumber(item.amount)}}                                  
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
                <v-btn @click="showSalegProduct" color="#E7E9E9" variant="flat" elevation="2"
                  prepend-icon="mdi-cart">
                  Productos
                </v-btn>
              </v-col>
            </v-row>
          </v-toolbar>

          <v-card-text class="mt-2 mb-2">
            <v-text-field class="mt-1 mb-1" v-model="search4" append-icon="mdi-magnify" label="Buscar" single-line
        hide-details></v-text-field>


      <v-data-table v-model="selected" :headers="headers4" :items-per-page-text="'Elementos por páginas'" :items="cashierSalesProf" :search="search4"
        class="elevation-1" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles" :item-selectable="isSelectable" show-select>

        <template v-slot:item.name="{ item }">

          <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
            <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_product" alt="image"></v-img>
          </v-avatar>
          {{ item.name }}
        </template>
        <template v-slot:item.pay="{ item }">
          <v-chip :color="parseInt(item.pay) === 0 ? 'red' : 'green'" :text="item.pay" class="text-uppercase" label size="small">
            {{ parseInt(item.pay) === 0 ? 'Pendiente' : 'Pagado' }}
          </v-chip>
        </template>
        <template v-slot:item.price="{ item }">
                {{ formatNumber(item.price)}}                                  
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
            <v-btn color="#F18254" variant="flat" @click="openDialogPaySales" :disabled="!selected.length>0">
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
                    <v-autocomplete
                    :no-data-text="'No hay datos disponibles'" v-model="product_store_id" :items="products" clearable label="Productos"
                      prepend-icon="mdi-tag-outline" item-title="name" item-value="id" variant="underlined"
                      :rules="selectRules"  @update:model-value="cantExist" 
                    >
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :prepend-avatar="'https://api2.simplifies.cl/api/images/'+item.raw.image_product"
                    :subtitle="'Existencia: '+item.raw.product_exit"
                    :title="item.raw.name"
                  ></v-list-item>
                </template>
                  </v-autocomplete>
                      <v-text-field v-model="product_exit" clearable label="Existencia"
                        prepend-icon="mdi-currency-usd" variant="underlined" disabled="true">
                      </v-text-field>
                      <v-text-field v-model="cant" clearable label="Cantidad"
                        prepend-icon="mdi-currency-usd" variant="underlined" :rules=[validateCantidad]>
                      </v-text-field>
                  </v-col>
                  
                  
                </v-row>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn color="#E7E9E9" variant="flat" @click="closeSaleProduct">
                    Cancelar
                  </v-btn>
                  <v-btn color="#F18254" variant="flat" @click="saveProductSale" :disabled="!valid">
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
                    prepend-icon="mdi-gift" variant="underlined" ></v-text-field><!--@input="onCardGiftSelected"-->
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


      <v-data-table :headers="headers8" :items-per-page-text="'Elementos por páginas'" :items="bonus" :search="search8"
        class="elevation-1" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">

        <template v-slot:item.name="{ item }">

          <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
            <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_url" alt="image"></v-img>
          </v-avatar>
          {{ item.name }}
        </template>
        <template v-slot:item.amount="{ item }">
                {{ formatNumber(item.amount)}}                                  
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
            <v-btn color="#E7E9E9" variant="flat" @click="showDialogBonus=false">
              Volver
            </v-btn>
          </v-card-actions>
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
/*import { UserTokenStore } from "@/store/UserTokenStore";

const userTokenStore = UserTokenStore();*/
export default {
  data: () => ({
    valid: true,
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
    dialogPay: false,
    dialogBox: false,
    loading: false,
    branch_id: '',
    charge_id: '',
    business_id: '',
    nameBranch: '',
    nameProfessional: '',
    professional_id: '',
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
    product_exit:'',
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
      { title: 'Cantidad', value: 'cant' },
      { title: 'Importe', value: 'price' },
      { title: 'Estado', value: 'pay' },
    ],
    headers8: [
      { title: 'Profesional', value: 'name' },
      { title: 'Tipo', value: 'bonus' },
      { title: 'Importe', value: 'amount' }
    ],
    showDialogBonus: false,
    search8: '',
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
      cardGif: ''
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
      id: '',
      cashFound: '',
      existence: '',
      extraction: ''
    },
    defaultBox: {
      cashFound: '',
      existence: '',
      extraction: ''
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
      cardGif: ''
    },

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
    validateCantidadCard(value) {
      if (this.editedCard.value){
      return value <= this.editedItem.value || "La cantidad debe ser menor o igual que la existencia (" + this.editedItem.value + ")";
    }
    else{
      return true;
    }
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
    'editedCard.value': function(newVal) {
      if (newVal !== '') {
        this.customValidation(); // Llamar a la validación solo cuando editedCard.value tenga un valor
      }
    },
    dialog(val) {
      val || this.close()
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
      if(newValue){
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

          //this.intervalId = setInterval(this.initialize, 60000);
          this.intervalId = setInterval(() => {
            axios
        .get('https://api2.simplifies.cl/api/branch-cars', {
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
                console.log('this.box.box_close false');
        //console.log(this.box.box_close);
            } else {
                this.ejecutado = true;
                console.log('this.box.box_close true');
        //console.log(this.box);
            }
        }
        console.log('this.ejecutado');
        console.log(this.ejecutado);
          });
    }, 60000);
  },
  beforeUnmount() {
    // Detener el intervalo cuando el componente se esté destruyendo para evitar fugas de memoria
    clearInterval(this.intervalId);
  },

  methods: {
    formatNumber(value) {
      // Si el valor es menor que 1000, devuelve el valor original sin formato
  if (value < 1000) {
    return value;
  }

  // Primero, redondea el valor a dos decimales
  value = Math.round((value + Number.EPSILON) * 100) / 100;

  // Separa la parte entera de la parte decimal
  let parts = value.toString().split(".");
  let integerPart = parts[0];
  let decimalPart = parts.length > 1 ? "." + parts[1] : "";

  // Agrega los separadores de miles
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Combina la parte entera y la parte decimal
  return integerPart + decimalPart;
        },
    customValidation() {
      if (this.editedCard.value !== '' && parseInt(this.editedItem.cardGif) > parseInt(this.editedCard.value)) {
        return 'El valor de la tarjeta de regalo no puede ser mayor que ' + this.formatNumber(this.editedCard.value);
      }
      return true;
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
            return value.toLocaleString('es-ES');
        },*/
    onCardGiftSelected(code) {
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
                if (this.editedCard.value) {
                  this.mostrarOtroCampo = true;
                }
                else{
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
      let request = {
        id: item.id
      };
      axios
        .put('https://api2.simplifies.cl/api/car', request)
        .then(() => {
        }).finally(() => {
          this.initialize();
          this.showAlert("success", "Carro pagado correctamente", 3000);
          });
    },
    deleteOrder(item) {
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
          this.showDetails(this.car_ref);
          this.showAlert("success", "Solicitud de eliminación de orden hecha correctamente", 3000);
          });
    },

    requestDelete() {
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
      axios
        .get('https://api2.simplifies.cl/api/box-show', {
          params: {
            branch_id: this.branch_id
          }
        })
        .then((response) => {
          this.box = response.data.box;
        });
      this.dialogBox = true;
      this.editedBox.id = this.box.id;
      this.editedBox.cashFound = '';
      this.editedBox.existence = this.box.reduce((total, item) => total + item.existence, 0);
      this.editedBox.extraction = '';
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
      const temp = amount+productsales;
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
        const productsales = this.cashierSales.filter(item => item.pay === 0).reduce((total, item) => total + item.price, 0);
      const pendiente = montosPendientes+productsales;
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
      return montosPendientes + " CLP";
    },

    totalMountProducts() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.results
        .filter(item => item.pay === 1)
        .reduce((total, item) => total + item.product, 0);
      this.editedCloseBox.totalProduct = montosPendientes;
      return montosPendientes + " CLP";
    },

    totalMountTips() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.results
        .filter(item => item.pay === 1)
        .reduce((total, item) => total + item.tip, 0);
      this.editedCloseBox.totalTip = montosPendientes;
      return montosPendientes + " CLP";
    },

    totalMountCashs() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.payments
        .reduce((total, item) => total + item.cash, 0);
      this.editedCloseBox.totalCash = montosPendientes;
      return montosPendientes + " CLP";
    },

    totalMountDebits() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.payments
        .reduce((total, item) => total + item.debit, 0);
      this.editedCloseBox.totalDebit = montosPendientes;
      return montosPendientes + " CLP";
    },

    totalMountCreditCards() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.payments
        .reduce((total, item) => total + item.creditCard, 0);
      this.editedCloseBox.totalCreditCard = montosPendientes;
      return montosPendientes + " CLP";
    },

    totalMountTransfers() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.payments
        .reduce((total, item) => total + item.transfer, 0);
      this.editedCloseBox.totalTransfer = montosPendientes;
      return montosPendientes + " CLP";
    },

    totalMountOthers() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.payments
        .reduce((total, item) => total + item.other, 0);
      this.editedCloseBox.totalOther = montosPendientes;
      return montosPendientes + " CLP";
    },

    totalMountCardGif() {
      // Filtrar elementos con estado "Pendiente" y calcular la sumatoria
      const montosPendientes = this.payments
        .reduce((total, item) => total + item.cardGif, 0);
      this.editedCloseBox.totalCardGif = montosPendientes;
      return montosPendientes + " CLP";
    },

    existence() {
    console.log('imprime existence');
    console.log(this.box);
    if (!this.box) {    
        return "0 CLP";
    } else {
      const temp = this.box.existence;
    console.log(temp);
    //return temp;
    return this.formatNumber(temp) + " CLP";
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
      return total ? this.formatNumber(total) + " CPL" : " CPL";
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

      axios
        .get('https://api2.simplifies.cl/api/branch-cars', {
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
          });
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
          this.initialize();
          this.showAlert("success", "Solicitud de eliminacion hecha correctamente", 3000)
          });
    },

    payItem(item) {
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
        //this.priceService = this.orders.reduce((total, item) => total + item.price, 0);
        this.dialogDetallesCar = true;
          });
    },
    deleteItemConfirm() {
      let request = {
        id: this.editedItem.id,
        nameProfessional: this.nameProfessional,
        branch_id: this.branch_id
      };
      axios
        .post('https://api2.simplifies.cl/api/car-destroy', request)
        .then(() => {
        }).finally(() => {
          this.showAlert("success", "Carro eliminado correctamente", 3000)
          });
      this.dialogDelete = false;
    },
    savePay() {
      {
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
        this.data.branch_id = this.branch_id;
        const suma = this.data.cash + this.data.creditCard + this.data.debit + this.data.transfer + this.data.other + this.data.cardGift + this.data.tip;

        console.log(suma);
        console.log(this.editedItem.amount + this.data.tip);
        if (suma === this.editedItem.amount + this.data.tip) {
          this.valid = true;
          axios
            .put('https://api2.simplifies.cl/api/payment', this.data)
            .then(() => {
              }).finally(() => {
              this.showAlert("success", "Pago efectuado correctamente", 3000);
              this.initialize();
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

      }
    },
    saveCloseBox() {
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
            console.log('this.bonus');
            console.log(this.bonus);
        }).finally(() => {
          this.showAlert("success", "Cierre de caja efectuado correctamente", 3000);
          this.showDialogBonus = true;
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
        this.data.branch_id = this.branch_id;
        this.data.cashFound = this.editedBox.cashFound;
        this.data.existence = this.editedBox.existence;
        this.data.extraction = this.editedBox.extraction;
        this.data.nameProfessional = this.nameProfessional;
        axios
          .put('https://api2.simplifies.cl/api/box', this.data)
          .then(() => {
          }).finally(() => {
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
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedCard = Object.assign({}, this.defaultCard);
        this.mostrarOtroCampo = false;
        this.editedIndex = -1
      })
    },
    markPagado() {
      this.dialogDetallesCar = false
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
        });
      this.showAddServices = true;

      console.log(car);
    },
    closeAddService() {
      this.showAddServices = false;
      this.branch_service_professional_id = '';
    },

    saveAddServie() {
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
           /*this.initialize();
         let temp = this.results.filter(item => item.id == this.car_ref.id);
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
  }else if (value <= this.product_exit) {
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
        });
      this.showAddProducts = true;

      console.log(car);
    },
    closeAddProduct() {
      this.showAddProducts = false;
      this.product_store_id = '';
    },
    saveAddProduct() {
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
          this.showAlert("success", "Producto agregado correctamente", 3000);
          /*this.initialize();
          let temp= this.results.filter(item => item.id == this.car_ref.id);
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
        });
      this.showDialogSaleProducts = true;
    },
    closeDialogSaleProduct() {
      this.showDialogSaleProducts = false;      
      this.initialize();
    },
    showSalegProduct() {
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
          this.valid = true;
          axios
            .post('https://api2.simplifies.cl/api/payment-product-sales', this.data)
            .then(() => {
              }).finally(() => {
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
      this.data.product_store_id = this.product_store_id;
      this.data.nameProfessional = this.nameProfessional;
      this.data.branch_id = this.branch_id;
      this.data.professional_id = this.professional_id;
      this.data.cant = this.cant;
      axios
        .post('https://api2.simplifies.cl/api/cashiersale', this.data)
        .then(() => {
        }).finally(() => {
          this.showAlert("success", "Producto agregado correctamente", 3000);
          /*this.initialize();
          let temp= this.results.filter(item => item.id == this.car_ref.id);
          console.log('tempsddasdasd');
          console.log(temp[0]);*/
          this.showSaleProducts = false;
          this.product_store_id = '';
          this.cant = '';
          this.product_exit = '';
          this. showDialogProduct();
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
  },
}
</script>