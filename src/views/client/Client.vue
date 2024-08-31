<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-snackbar
    class="mt-12"
    location="right top"
    :timeout="sb_timeout"
    :color="sb_type"
    elevation="24"
    :multi-line="true"
    vertical
    v-model="snackbar"
  >
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
        <v-col cols="12" md="4" class="grow ml-4">
          <span class="text-subtitle-1"> <strong>Listado de Clientes</strong></span>
        </v-col>
        <v-col cols="12" md="7" class="text-right">
        <v-btn
                v-bind="props"
                class="text-subtitle-1 ml-1"
                color="#E7E9E9"
                variant="flat"
                elevation="2"
                prepend-icon="mdi-gift"
                @click="showGiftCard()"
              >
                Tarjeta de Regalo
              </v-btn>
          <v-btn
                v-bind="props"
                class="text-subtitle-1 ml-1"
                color="#E7E9E9"
                variant="flat"
                elevation="2"
                prepend-icon="mdi-account-multiple"
                @click="ClientsFrecuence()"
              >
                Frecuencia por Sucursal
              </v-btn>
              
          <v-dialog v-model="dialog" max-width="1000px">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                class="text-subtitle-1 ml-1"
                color="#E7E9E9"
                variant="flat"
                elevation="2"
                prepend-icon="mdi-plus-circle"
              >
                Agregar Cliente
              </v-btn>
            </template>
            <v-card>
              <v-toolbar color="#F18254">
                <span class="text-subtitle-2 ml-4"> Cliente</span>
              </v-toolbar>
              <v-card-text>
                <v-form v-model="valid" enctype="multipart/form-data">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editedItem.name"
                        clearable
                        label="Nombre y Apellidos"
                        prepend-icon="mdi-account-tie-outline"
                        variant="underlined"
                        :rules="nameRules"
                      >
                      </v-text-field>
                    </v-col>
                    <!--<v-col cols="12" md="6">
                      <v-text-field
                        v-model="editedItem.surname"
                        clearable
                        label="Primer Apellido"
                        prepend-icon="mdi-account-tie-outline"
                        variant="underlined"
                        :rules="nameRules"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editedItem.second_surname"
                        clearable
                        label="Segundo Apellido"
                        prepend-icon="mdi-account-tie-outline"
                        variant="underlined"
                        :rules="nameRules"
                      >
                      </v-text-field>
                    </v-col>-->
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editedItem.email"
                        clearable
                        label="Correo Electrónico"
                        prepend-icon="mdi-email-outline"
                        variant="underlined"
                        :rules="emailRules"
                        @change="handleEmailChange"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editedItem.phone"
                        clearable
                        label="Teléfono"
                        prepend-icon="mdi-phone-outline"
                        placeholder="+56912345678"
                        variant="underlined"
                        :rules="mobileRules"
                      >
                      </v-text-field>
                    </v-col>
                    <!--<v-col cols="12" md="6">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" clearable v-model="editedItem.user_id" :items="users" label="Usuario" prepend-icon="mdi-account-tie-outline" item-title="name" item-value="id" variant="underlined" :rules="selectRules"></v-autocomplete>
                  </v-col>-->
                    <v-col cols="12" md="6">
                      <v-file-input
                        clearable
                        v-model="file"
                        ref="fileInput"
                        label="Avatar Cliente"
                        variant="underlined"
                        density="compact"
                        name="file"
                        accept=".png, .jpg, .jpeg"
                        @change="onFileSelected"
                      >
                      </v-file-input>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-card
                        elevation="6"
                        class="mx-auto"
                        max-width="120"
                        max-height="120"
                      >
                        <img
                          v-if="imagenDisponible()"
                          :src="imgedit"
                          height="120"
                          width="120"
                        />
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="#E7E9E9" variant="flat" @click="close">
                      Cancelar
                    </v-btn>
                    <v-btn
                      color="#F18254"
                      variant="flat"
                      @click="save"
                      :disabled="!valid"
                    >
                      Aceptar
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-toolbar color="red">
                <span class="text-subtitle-2 ml-4"> Eliminar Cliente</span>
              </v-toolbar>

              <v-card-text class="mt-2 mb-2">
                ¿Desea eliminar el Cliente seleccionado?</v-card-text
              >
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
      <v-col cols="12" sm="12" md="4">
          <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches"
            v-if="this.mostrarFila" clearable label="Seleccione una Sucursal" prepend-icon="mdi-store" item-title="name"
            item-value="id" variant="underlined" @update:model-value="initialize()"></v-autocomplete>
        </v-col>
      <v-text-field
        class="mt-1 mb-1"
        v-model="search"
        append-icon="mdi-magnify"
        label="Buscar"
        single-line
        hide-details
      >
      </v-text-field>
      <v-data-table
        :headers="headers"
        :search="search"
        :items-per-page-text="'Elementos por páginas'"
        :items="results"
        class="elevation-1"
        no-data-text="No hay datos disponibles"
        no-results-text="No hay datos disponibles"
        :loading="loadingClient" loading-text="Cargando datos..."
      >
        <template v-slot:top>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
        </template>
        <template v-slot:item.name="{ item }">
          <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
            <v-img
              :src="
                'https://api2.simplifies.cl/api/images/' +
                item.client_image"
              alt="image"
            ></v-img><!--+ '?$' + Date.now()
                -->
          </v-avatar>
          {{ item.name }}
        </template>
        <template v-slot:item.phone="{ item }">
        <td>
          <a href="#" @click.prevent="openWhatsApp(item.phone)">{{ item.phone }}</a>
        </td>
      </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            density="comfortable"
            icon="mdi-pencil"
            @click="editItem(item)"
            color="primary"
            variant="tonal"
            elevation="1"
            class="mr-1 mt-1 mb-1"
            title="Editar cliente"
          ></v-btn>
          <v-btn density="comfortable" icon="mdi-gift" @click="showUserCardGift(item)" color="green" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Asignar tarjeta de regalo"></v-btn>
          <v-btn
            density="comfortable"
            icon="mdi-history"
            @click="showHistory(item)"
            color="orange"
            variant="tonal"
            elevation="1"
            class="mr-1 mt-1 mb-1"
            title="Historial del cliente"
          ></v-btn>
          <v-btn
            density="comfortable"
            icon="mdi-delete"
            @click="deleteItem(item)"
            color="red-darken-4"
            variant="tonal"
            elevation="1"
            title="Eliminar Cliente"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card-text>

    <!--ClientHistory-->
    <v-dialog v-model="dialogHistory" fullscreen transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar color="#F18254">
          <span class="text-subtitle-1 ml-4">Historial del Cliente</span>
          <v-spacer></v-spacer>
        </v-toolbar>
        <br>
        <v-row>
          <v-col cols="12" md="4">
            <v-card class="mx-auto" max-width="400">
              <v-img
                class="align-end text-white"
                height="300"
                :src="'https://api2.simplifies.cl/api/images/' + history.imageLook"
                cover
              >
                <v-card-title>
                  <v-chip class="ma-2" color="" label>
                    <v-icon icon="mdi-camera" start></v-icon>
                    Último Look
                  </v-chip>
                </v-card-title>
              </v-img>

              <v-card-text class="pt-2">
                {{ history.clientName }}
                <v-chip class="ma-1" color="warning" label size="small">
                  <v-icon icon="mdi-timer" start></v-icon>
                  {{ history.frecuencia }}
                </v-chip>

                <v-chip class="" color="warning" label size="small">
                  <v-icon icon="mdi-store" start></v-icon>
                  {{ history.cantVisit }} Visitas
                </v-chip>
                <br>
                <v-divider class="mt-2"></v-divider>
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="text-h8 mt-3">Última vez atendido</div>
                  </v-col>
                  <v-col cols="6" md="6">
                    <div class="text-h8 mt-3">{{ history.lastDate }}</div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="12">
                    <div class="text-h8 mt-3">Sucursal: {{ history.branchName }}</div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="12">
                    <div class="text-h8 mt-3">
                      Profesional:
                      <v-avatar
                        elevation="3"
                        class="mx-auto"
                        max-width="60"
                        max-height="60"
                      >
                        <v-img
                          :src="'https://api2.simplifies.cl/api/images/' + history.image_url"
                          alt="Imagen"
                        ></v-img>
                      </v-avatar>
                      {{ history.professionalName }}
                    </div>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <br>
                <v-textarea
                  label=" Comentario "
                  row-height="25"
                  rows="3"
                  variant="outlined"
                  auto-grow
                  shaped
                  v-model="history.endLook"
                  prepend-inner-icon="mdi-comment"
                  readonly
                >
                </v-textarea>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="mx-auto" max-width="450">
              <v-toolbar>
                <v-btn icon="mdi-menu" variant="text"></v-btn>

                <v-toolbar-title class="text-subtitle-2"
                  >Servicios más demandados</v-toolbar-title
                >
              </v-toolbar>

              <v-list lines="two" item-props>
                <v-list-item
                  v-for="service in history.services"
                  :key="service.id"
                  :title="service.name"
                  :subtitle="service.cant"
                >
                  <template v-slot:prepend>
                    <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                      <v-img
                        :src="'https://api2.simplifies.cl/api/images/' + service.image_service"
                        alt="image"
                      ></v-img>
                    </v-avatar>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="mx-auto" max-width="450">
              <v-toolbar>
                <v-btn icon="mdi-tag" variant="text"></v-btn>

                <v-toolbar-title class="text-subtitle-2"
                  >Productos más Comprados</v-toolbar-title
                >
              </v-toolbar>

              <v-list lines="two" item-props>
                <v-list-item
                  v-for="product in history.products"
                  :key="product.id"
                  :title="product.name"
                  :subtitle="product.cant"
                >
                  <template v-slot:prepend>
                    <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                      <v-img
                        :src="'https://api2.simplifies.cl/api/images/' + product.image_product"
                        alt="image"
                      ></v-img>
                    </v-avatar>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
        <v-spacer></v-spacer>
        <br>
        <br>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#E7E9E9" variant="flat" @click="closeHistory"> Volver </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--ClientFrecuence-->
    <v-dialog v-model="dialogFrecuence" fullscreen transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar color="#F18254">
          <v-col cols="12" md="9" class="grow ml-4">
            <span class="text-h8"> <strong>Visitas por clientes</strong></span>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" md="3" class="right">
            <v-btn class="text-subtitle-1  ml-12" color="#E7E9E9" variant="flat" elevation="2"
              prepend-icon="mdi-file-excel" @click="exportToExcel">
              Exportar a Excel
            </v-btn>
          </v-col>
      </v-toolbar>
        <v-container fluid>
        <v-row>
         <!-- Primera columna -->
         <v-col cols="12" sm="6" md="3" >
          <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
            min-width="290px">
            <template v-slot:activator="{ props }">
              <v-text-field v-bind="props" :modelValue="dateFormatted" variant="outlined" append-inner-icon="mdi-calendar"
                label="Fecha inicial"></v-text-field>
            </template>
            <v-locale-provider locale="es">
              <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2" :modelValue=input @update:model-value="updateDate"
                format="yyyy-MM-dd" :max="dateFormatted2"></v-date-picker>
            </v-locale-provider>
          </v-menu>
        </v-col>
        <!-- Segunda columna -->
        <v-col cols="12" sm="6" md="3">
          <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
            min-width="290px">
            <template v-slot:activator="{ props }">
              <v-text-field v-bind="props" :modelValue="dateFormatted2" variant="outlined"
                append-inner-icon="mdi-calendar" label="Fecha final" ></v-text-field>
            </template>
            <v-locale-provider locale="es">
              <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2" :modelValue="getDate2" 
                format="yyyy-MM-dd" :min="dateFormatted" @update:model-value="updateDate1"></v-date-picker><!--@update:model-value="updateDate2"-->
            </v-locale-provider>
          </v-menu>
        </v-col>
        <v-col cols="12" md="3">
          <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches" v-if="this.mostrarFila" 
            label="Seleccione una Sucursal" prepend-inner-icon="mdi-store" item-title="name" item-value="id"
            variant="outlined" ></v-autocomplete><!--@update:model-value="initialize()"-->
        </v-col>
        <v-col cols="12" md="1">
                        <v-btn icon @click="updateDate2" color="#F18254" >
                    <v-icon>mdi-magnify</v-icon></v-btn>
                </v-col>
      </v-row></v-container>
      <v-row>
        <v-col cols="12">
          <v-container fluid>
            <v-alert border type="info" variant="outlined" density="compact">
              <p v-html="formTitleFrec"></p>
                        </v-alert>
          </v-container>
          <v-container fluid>
          <v-card-text>
            <v-text-field class="mt-1 mb-1" v-model="search2" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details>
            </v-text-field>
            <v-data-table :headers="headers1" :items-per-page-text="'Elementos por páginas'" :items="frecuence"
              :search="search2" class="elevation-2" no-results-text="No hay datos disponibles"
              no-data-text="No hay datos disponibles" :loading="loadingVisit" loading-text="Cargando datos...">
           
              <template v-slot:item.name="{ item }">

                <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                  <v-img :src="'https://api2.simplifies.cl/api/images/' + item.client_image" alt="image"></v-img>
                </v-avatar>
                {{ item.name }}
              </template>
              <template v-slot:item.frecuence="{ item }">
                <v-chip :color="item.frecuence != 'No Frecuente' ? 'green' : 'red'" :text="item.pay"
                  class="text-uppercase" label size="small">
                  {{ item.frecuence }}
                </v-chip>
              </template>
            </v-data-table>

          </v-card-text>
        </v-container>
        </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#E7E9E9" variant="flat" @click="closeClientFrecuence"> Volver </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Para verificar el email existe-->
    <v-dialog v-model="dialogEmail" @click:outside="closeEmail" max-width="500px">
              <v-card>
                <v-toolbar color="#F18254">
                  <span class="text-subtitle-2 ml-4">Información!!!</span>
                </v-toolbar>

                <v-card-text class="mt-2">
                  <span>Ya existe un profesional con este correo, ¿desea continuar?</span>
                </v-card-text>

                <v-card-text class="d-flex align-center mt-2">
                  <v-avatar class="mr-2">
                    <v-img :src="'https://api2.simplifies.cl/api/images/' + profesImage" alt="Avatar del profesional"></v-img>
                  </v-avatar>
                  <span>{{ profesName }}</span>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="#E7E9E9" variant="flat" @click="closeEmail">
                    Cancelar
                  </v-btn>
                  <v-btn color="#F18254" variant="flat" @click="acceptEmail">
                    Aceptar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!--GiftCard-->
    <v-dialog v-model="dialogGistCard" fullscreen transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar color="#F18254">
          <v-col cols="12" md="9" class="grow ml-4">
            <span class="text-h8"> <strong>Tarjetas de Regalos</strong></span>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" md="3" class="right">
            <v-btn class="text-subtitle-1  ml-12  " color="#E7E9E9" variant="flat" elevation="2"
                prepend-icon="mdi-plus-circle" @click="showAddCardGiftCard()">
                Crear Tarjeta
              </v-btn>
          </v-col>
      </v-toolbar>
        <v-container fluid>
        <v-row>
          <v-card-text>
          <v-text-field class="mt-1 mb-1" v-model="search3" append-icon="mdi-magnify" label="Buscar" single-line hide-details>
      </v-text-field>
      <v-data-table :headers="headers2" :items-per-page-text="'Elementos por páginas'" :items="cardGiftsData" :search="search3" class="elevation-1"
        no-data-text="No hay datos disponibles" no-results-text="No hay datos disponibles" :loading="loadingCardGift" loading-text="Cargando datos...">
        <template v-slot:top>

          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
        </template>
        <template v-slot:item.image_cardgift="{ item }">

          <v-card class="my-2" rounded elevation="10" width="100">
            <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_cardgift" alt="image" cover></v-img>
          </v-card>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn density="comfortable" icon="mdi-pencil" @click="editItemCardGift(item)" color="primary" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Editar tarjeta de regalo"></v-btn>
          <v-btn density="comfortable" icon="mdi-gift" @click="showCardGiftUser(item)" color="green" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Asignar tarjeta de regalo"></v-btn>
          <v-btn density="comfortable" icon="mdi-delete" @click="deleteItemCardGift(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar tarjeta de regalo"></v-btn>
        </template>
      </v-data-table>
    </v-card-text>
        </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#E7E9E9" variant="flat" @click="closeshowGiftCard"> Volver </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--formulario addGiftCard-->
    <v-dialog v-model="dialogAddCardGift" max-width="700px">
            <v-card>
              <v-toolbar color="#F18254">
                <span class="text-subtitle-1 ml-4">Crear Tarjeta de Regalo</span>
              </v-toolbar>
              <v-card-text>
                <v-form v-model="valid" enctype="multipart/form-data">
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-autocomplete :no-data-text="'No hay datos disponibles'" clearable v-model="editedItemCardGift.business_id" :items="business" label="Negocio"
                        prepend-icon="mdi-domain" item-title="name" item-value="id" variant="underlined"
                        :rules="selectRules"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="editedItemCardGift.name" clearable label="Nombre" prepend-icon="mdi-card"
                        variant="underlined" :rules="nameRules">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="editedItemCardGift.value" clearable label="Valor" prepend-icon="mdi-currency-usd"
                        variant="underlined" :rules="pago">
                      </v-text-field>
                    </v-col>

                  </v-row>
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-file-input clearable v-model="file" ref="fileInput" label="Imagen de Tarjeta Regalo"
                        variant="underlined" density="compact" name="file" accept=".png, .jpg, .jpeg"
                        @change="onFileSelected">
                      </v-file-input>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                        <img v-if="imagenDisponible()" :src="imgedit" height="120" width="210">
                      </v-card>


                    </v-col>
                  </v-row><br>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="#E7E9E9" variant="flat" @click="closeAddCardGiftCard">
                      Cancelar
                    </v-btn>
                    <v-btn color="#F18254" variant="flat" @click="saveCardGift" :disabled="!valid">
                      Aceptar
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-dialog>
    <!--formulario dleeAddCardGift-->
    <v-dialog v-model="dialogDeleteCardGift" max-width="500px">
            <v-card>
              <v-toolbar color="red">
                <span class="text-subtitle-2 ml-4"> Eliminar Terjeta de Regalo</span>
              </v-toolbar>

              <v-card-text class="mt-2 mb-2"> ¿Desea eliminar la Trjeta de Regalo?</v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="closeDeleteCardGift">
                  Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" @click="deleteItemConfirmCardGift">
                  Aceptar
                </v-btn>


              </v-card-actions>
            </v-card>
          </v-dialog>
          <!--cardgiftsUser-->
      <v-dialog v-model="dialogCardGitfUser" fullscreen transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-h6 ml-6"> Asignar Tarjeta de Regalo</span>
            <v-spacer></v-spacer>
            <v-btn class="ml-4" color="#E7E9E9" variant="flat" @click="showAddCardGiftClient()">
              Asignar a Cliente
            </v-btn>  
          </v-toolbar>

          <v-card-text class="mt-2 mb-2">

            <v-text-field class="mt-1 mb-1" v-model="search4" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details></v-text-field>

            <v-data-table :headers="headers3" :items="cardgiftUser" :search="search4" class="elevation-1"
              :items-per-page-text="'Elementos por páginas'" no-results-text="No hay datos disponibles"
              no-data-text="No hay datos disponibles" :loading="loadingCardGftUser" loading-text="Cargando datos...">

              <template v-slot:item.name="{ item }">

                <v-avatar elevation="3" color="grey-lighten-4" size="large">
                  <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_cardgift" alt="image"></v-img>
                </v-avatar>
                {{ item.name }}
              </template>

              <template v-slot:item.userName="{ item }">

                <v-avatar elevation="3" color="grey-lighten-4" size="large">
                  <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_url" alt="image"></v-img>
                </v-avatar>
                {{ item.userName }}
              </template>

              <template v-slot:item.actions="{ item }">
                <!--<v-icon size="25" color="red" @click="deleteS(item)">
                  mdi-delete
                </v-icon>-->
                <v-btn density="comfortable" icon="mdi-delete" @click="deleteCardGiftUser(item)" color="red-darken-4" variant="tonal"
                  elevation="1" title="Eliminar asignación"></v-btn>
              </template>

            </v-data-table>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#F18254" variant="flat" @click="closeCardGiftUser">
              Volver
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--dielogo desasignat tarjete-->
      <v-dialog v-model="dialogDeleteCardGiftUser" width="500">
        <v-card>

          <v-toolbar color="red">
            <span class="text-subtitle-2 ml-4"> Eliminar Tarjeta asignada al cliente</span>
          </v-toolbar>

          <v-card-text class="mt-2 mb-2"> ¿Desea eliminar esta asignación?</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="closedeleteCardGiftUser">
              Cancelar
            </v-btn>
            <v-btn color="#F18254" variant="flat" @click="requestDeleteCardGiftUser">
              Aceptar
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--Asignar tarjeta a cliente-->
      <v-dialog v-model="dialogAddCardGiftClient" width="700">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-2 ml-4">Asignar a Cliente</span>
          </v-toolbar>
          <v-card-text class="mt-2 mb-2">
            <v-form ref="form" v-model="valid" enctype="multipart/form-data">
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedCardGiftUser.user_id" :items="users" label="Cliente"
                      prepend-icon="mdi-store-outline" item-title="name" item-value="user_id" variant="underlined"
                      :rules="selectRules" @update:model-value="handleClientSelection">
                      <template v-slot:item="{ props, item }">
                                                    <v-list-item
                                                        v-bind="props"
                                                        :prepend-avatar="'https://api2.simplifies.cl/api/images/'+item.raw.client_image"
                                                        :title="item.raw.name"
                                                    ></v-list-item>
                                                    </template>
                      </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                      offset-y min-width="290px">
                      <template v-slot:activator="{ props }">
                        <v-text-field v-bind="props" :model-value="dateFormatted" variant="underlined"
                          append-icon="mdi-calendar" label="Fecha de Expiración"></v-text-field>
                      </template>
                      <v-locale-provider locale="es">
                        <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2"
                          :model-value=input @update:model-value="updateDate" format="yyyy-MM-dd" 
                          :min="new Date(
                        Date.now() -
                        new Date().getTimezoneOffset() * 60000
                      )
                        .toISOString()
                        .substr(0, 10)
                        "></v-date-picker>
                      </v-locale-provider>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row v-if="details && Object.keys(details).length > 0">
    <v-col cols="12">
      <v-card>
  <v-card-title class="headline">Detalles del Cliente</v-card-title>
  <v-divider></v-divider>
  <v-card-text>
    <v-row>
      <v-col cols="12" sm="3" class="text-left">
        <v-card elevation="3" max-width="130" max-height="130">
          <v-img class="d-flex align-end text-white" height="130" :src="'https://api2.simplifies.cl/api/images/' + details.imageLook" cover>
    <v-card-title class="pa-0">
        <v-chip color="">
            <v-icon icon="mdi-camera" class="mr-1"></v-icon>
            <span class="caption">{{ nameClient }}</span>
        </v-chip>
    </v-card-title>
</v-img>
                  <!--<v-img :src="'https://api2.simplifies.cl/api/images/' + details.imageLook" alt="image"></v-img>-->
                </v-card>
      </v-col>
      <v-col cols="12" sm="6" class="text-left">
        <p><strong>Última vez atendido por:</strong> {{ details.professionalName }}</p>
        <p><strong>Cantidad de Visitas:</strong> {{ details.cantVisit }}</p>
        <p><strong>Última visita:</strong> {{ details.lastVisit }}</p>
        <p><strong>Frecuencia:</strong> {{ details.frecuencia }}</p>
      </v-col>
    </v-row>
  </v-card-text>
</v-card>
    </v-col>
</v-row>
              </v-container>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="closedialogAddCardGiftUser">
                  Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" @click="saveCardGiftUser" :disabled="!valid">
                  Aceptar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!--Desde user asignar tarjeta-->
      <v-dialog v-model="dialogUserCardGitf" fullscreen transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-h6 ml-6"> Asignar Tarjeta de Regalo</span>
            <v-spacer></v-spacer>
            <v-btn class="ml-4" color="#E7E9E9" variant="flat" @click="showAddClientCardGift()">
              Asignar Tarjeta
            </v-btn>  
          </v-toolbar>

          <v-card-text class="mt-2 mb-2">

            <v-text-field class="mt-1 mb-1" v-model="search4" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details></v-text-field>

            <v-data-table :headers="headers4" :items="userCardgift" :search="search5" class="elevation-1"
              :items-per-page-text="'Elementos por páginas'" no-results-text="No hay datos disponibles"
              no-data-text="No hay datos disponibles" :loading="loadingUserCardGft" loading-text="Cargando datos...">

              <template v-slot:item.name="{ item }">

                <v-avatar elevation="3" color="grey-lighten-4" size="large">
                  <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_cardgift" alt="image"></v-img>
                </v-avatar>
                {{ item.name }}
              </template>

              <template v-slot:item.actions="{ item }">
                <!--<v-icon size="25" color="red" @click="deleteS(item)">
                  mdi-delete
                </v-icon>-->
                <v-btn density="comfortable" icon="mdi-delete" @click="deleteUserCardGift(item)" color="red-darken-4" variant="tonal"
                  elevation="1" title="Eliminar asignación"></v-btn>
              </template>

            </v-data-table>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#F18254" variant="flat" @click="closeUserCardGift">
              Volver
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogUserDeleteCardGift" width="500">
        <v-card>

          <v-toolbar color="red">
            <span class="text-subtitle-2 ml-4"> Eliminar Tarjeta asignada al cliente</span>
          </v-toolbar>

          <v-card-text class="mt-2 mb-2"> ¿Desea eliminar esta asignación?</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="closedeleteUserCardGift">
              Cancelar
            </v-btn>
            <v-btn color="#F18254" variant="flat" @click="requestUserDeleteCardGift">
              Aceptar
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogClientAddCardGift" width="700">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-2 ml-4">Asignar Tarjeta</span>
          </v-toolbar>
          <v-card-text class="mt-2 mb-2">
            <v-form ref="form" v-model="valid" enctype="multipart/form-data">
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedCardGiftUser.card_gift_id" :items="cardGiftsData" label="Tarjeta de Regalo"
                      prepend-icon="mdi-gift" item-title="name" item-value="id" variant="underlined"
                      :rules="selectRules" @update:model-value="handleClientSelection">
                      <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props"
                        :prepend-avatar="'https://api2.simplifies.cl/api/images/' + item.raw.image_cardgift"
                        :title="item.raw.name">
                        <v-list-item-subtitle class="d-flex justify-space-between">
                          Valor: {{ item.raw.value }}
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                      </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                      offset-y min-width="290px">
                      <template v-slot:activator="{ props }">
                        <v-text-field v-bind="props" :model-value="dateFormatted" variant="underlined"
                          append-icon="mdi-calendar" label="Fecha de Expiración"></v-text-field>
                      </template>
                      <v-locale-provider locale="es">
                        <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2"
                          :model-value=input @update:model-value="updateDate" format="yyyy-MM-dd" 
                          :min="new Date(
                        Date.now() -
                        new Date().getTimezoneOffset() * 60000
                      )
                        .toISOString()
                        .substr(0, 10)
                        "></v-date-picker>
                      </v-locale-provider>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-container>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="closedialogAddtUserCardGif">
                  Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" @click="saveUserCardGift" :disabled="!valid">
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
import * as XLSX from 'xlsx';
import { format } from "date-fns";
import LocalStorageService from "@/LocalStorageService";

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
    loadingVisit: true,
    loadingClient: true,
    loadingCardGift: true,
    loadingCardGftUser: true,
    dialogAddCardGift: false,
    dialogDeleteCardGift: false,
    valid: true,
    snackbar: false,
    sb_type: "",
    sb_message: "",
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    editando: false,
    dialog: false,
    search: "",
    message_delete: true,
    dialogDelete: false,
    headers: [
      { title: "Nombre y Apellidos", key: "name" },
      //{ title: 'Primer Apellido', key: 'surname' },
      //{ title: 'Segundo Apellido', key: 'second_surname' },
      { title: "Correo", key: "email" },
      { title: "Teléfono", key: "phone" },
      { title: "Acciones", key: "actions", sortable: false },
    ],
    results: [],
    cardGiftsData: [],
    business: [],
    editedIndex: -1,
    editedIndexF: -1,
    editedIndexG: -1,
    users: [],
    file: null,
    imgMiniatura: "",
    editedItem: {
      name: "",
      surname: "",
      second_surname: "",
      email: "",
      phone: '+569',
      user_id: '',
      client_image: "",
      id: "",
    },
    data: {},

    defaultItem: {
      name: "",
      surname: "",
      second_surname: "",
      email: "",
      phone: '+569',
      user_id: '',
      client_image: "",
    },

    editedItemCardGift: {
      business_id: '',
      value: '',
      id: '',
      image_cardgift: '',
      user_id: '',
      name: ''
    },

    defaultItemCardGift: {
      business_id: '',
      value: '',
      id: '',
      image_cardgift: '',
      user_id: '',
      name: ''
    },

    cardSelect: '',
    loadingUser: true,
    dialogCardGitfUser: false,

    editedCardGiftUser: {
      user_id: '',
      expiration_date: '',
      card_gift_id: '',
      id: ''
    },
    defaultCardGiftUser: {
      student_id: '',
      card_gift_id: '',
      expiration_date: '',
      id: ''
    },
    cardgiftUser: [],
    dialogDeleteCardGiftUser: false,
    dialogAddCardGiftClient: false,
    dialogUserDeleteCardGift: false,

    //user Card Gift
    userSelect: '',
    userCardgift: [],
    dialogUserCardGitf: false,
    loadingUserCardGft: true,
    dialogClientAddCardGift: false,
    //reporte
    dialogHistory: false,
    dialogFrecuence: false,
    dialogGistCard: false,
    frecuences: [],
    menu: false,
    menu2: false,
    input: null,
    input2: null,
    search2: '',
    search3: '',
    search4: '',
    search5: '',
    charge: '',
    history: [],
    frecuence: [],


    typeUser: '',
    userId: '',
    profesName: '',
    profesImage: '',
    dialogEmail: false,

    headers1: [
      { title: 'Profesional', key: 'name', sortable: false },
      { title: 'Correo', key: 'email', sortable: false },
      { title: 'Teléfono', key: 'phone', sortable: false },
      { title: 'Clasificación', key: 'frecuence', sortable: true },
      { title: 'Cantidad Visitas', key: 'cant_visist', sortable: true },
      { title: 'Última vez Atendido', key: 'data', sortable: true },
    ],
    headers2: [
      { title: 'Nombre', key: 'name' },
      { title: 'Imagen', key: 'image_cardgift' },
      { title: 'Valor', value: 'value' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    headers3: [
      { title: 'Nombre Tarjeta', value: 'name' },
      { title: 'Nombre Usuario', value: 'userName' },
      { title: 'Valor Inicial', value: 'value' },
      { title: 'Estado', value: 'state' },
      { title: 'Valor Actual', value: 'exist' },
      { title: 'Fecha Asignada', value: 'issue_date' },
      { title: 'Fecha Expiración', value: 'expiration_date' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    headers4: [
      { title: 'Nombre Tarjeta', value: 'name' },
      { title: 'Valor Inicial', value: 'value' },
      { title: 'Estado', value: 'state' },
      { title: 'Valor Actual', value: 'exist' },
      { title: 'Fecha Asignada', value: 'issue_date' },
      { title: 'Fecha Expiración', value: 'expiration_date' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) || "El campo debe tener al menos de 3 caracteres",
    ],
    emailRules: [
      (v) => !!v || "El Correo Electrónico es requerido",
      (v) => /.+@.+\..+/.test(v) || "El Correo Electrónico no es válido",
    ],
    /* emailRules: [
      //v => !!v || 'El Correo es requerido',
      (value) => !value || (/.+@.+\..+/.test(value)) || "Debe ser un número con punto decimal (10.00)",
      //v => /.+@.+\..+/.test(v) || 'Correo electrónico no válido',
    ], */
    mobileRules: [
      v => !!v || 'El número de móvil es requerido',
      v => /^\+569\d{8}$/.test(v) || 'Formato de número móvil inválido. Ejemplo: +56912345678'
    ],
    /*mobileRules: [
      (v) => !!v || "El Teléfono es requerido",
      //(value) => this.validateTelefono(value) || "El número de teléfono no es válido",
    ],*/
    pago: [(value) => /^\d+(\.\d+)?$/.test(value) || "Debe ser un número con punto decimal (10.00)",
      (v) => !!v || (!isNaN(v) && isFinite(v)) || 'Ingresa un número válido'],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
  }),

  computed: {
    imgedit() {
      return this.imgMiniatura;
    },
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Persona" : "Editar Persona";
    },
    formTitleFrec() {
      if (this.editedIndexF === 2) {
        const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        //this.fecha = (this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")) + '-' + (this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
        return `Visitas por clientes en el período [<strong>${startDate}</strong> - <strong>${endDate}</strong>]`;
      }
      else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fecha = format(new Date(), "yyyy-MM-dd");
        return `Visitas por clientes  <strong>${this.fecha}</strong>]`;
      }
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
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  mounted() {
    this.branch_id = parseInt(LocalStorageService.getItem("branch_id"));
    this.business_id = parseInt(LocalStorageService.getItem("business_id"));
    this.charge_id = parseInt(LocalStorageService.getItem('charge_id'));
    this.charge = JSON.parse(LocalStorageService.getItem("charge"));
    LocalStorageService.setIsLocked(true);
    axios
      .get('https://api2.simplifies.cl/api/show-business', {
        params: {
          business_id: this.business_id
        }
      })
      .then((response) => {
        this.branches = response.data.branches;
      }).finally(() => {
        LocalStorageService.setIsLocked(false);
        if (this.charge === 'Administrador') {
          this.branch_id = this.branches[0].id;
      this.mostrarFila = true;
    } 
    this.initialize();
          });
  },

  methods: {
    handleEmailChange() {
      LocalStorageService.setIsLocked(true);
      axios
        .get("https://api2.simplifies.cl/api/client-email", {
          params: {
            email: this.editedItem.email
          },
        })
        .then((response) => {
          this.userId = response.data.user;
          this.profesName = response.data.clientName;
          this.profesImage = response.data.clientImage;
          this.typeUser = response.data.type;
        })
        .finally(() => {
          LocalStorageService.setIsLocked(false);
          if(this.typeUser === 'Client'){
            this.dialogEmail = false;
            this.showAlert("warning", "Ya existe un cliente con este correo", 3000);
            //this.showAlert("success", "Este correo ya esta asignado a un cliente", 3000);
          }
          if(this.typeUser === 'Professional'){
            this.dialogEmail = true;
          }
        });
    },
    closeEmail(){
      this.dialogEmail = false;
      this.userId = '',
      this.close();
    },
    acceptEmail(){
      this.editedItem.user_id = this.userId;
      this.dialogEmail = false;
    },
    openWhatsApp(phone) {
      window.open('http://wa.me/' + phone);
    },
    validateTelefono(value) {
      // Expresión regular para validar un número de teléfono con prefijo de Chile
      const telefonoRegex = /^(\+?56|0056|56)?(2|3|4|5|6|7|9)\d{7}$/;
      // Verifica si el valor coincide con la expresión regular
      return telefonoRegex.test(value);
    },
    imagenDisponible() {
      if (this.imgedit !== undefined && this.imgedit !== "") {
        // Intenta cargar la imagen en un elemento oculto para verificar si está disponible
        let img = new Image();
        img.src = this.imgedit;
        return true; // Devuelve true si la imagen está disponible
      }
      return false; // Si la URL de la imagen no está definida o está vacía, devuelve false
    },

    showAlert(sb_type, sb_message, sb_timeout) {
      this.sb_type = sb_type;

      if (sb_type == "success") {
        this.sb_title = "Éxito";
        this.sb_icon = "mdi-check-circle";
      }

      if (sb_type == "error") {
        this.sb_title = "Error";
        this.sb_icon = "mdi-check-circle";
      }

      if (sb_type == "warning") {
        this.sb_title = "Advertencia";
        this.sb_icon = "mdi-alert-circle";
      }
      this.sb_message = sb_message;
      this.sb_timeout = sb_timeout;
      this.snackbar = true;
    },
    initialize() {
      this.loadingClient = true;
      LocalStorageService.setIsLocked(true);
      axios.get("https://api2.simplifies.cl/api/client-branch", {
                    params: {
                        branch_id: this.branch_id,
                    }
                }).then((response) => {
        this.results = response.data.clients;
      }).finally(() => {
            LocalStorageService.setIsLocked(false);
            this.loadingClient = false;
        });
      /*axios
        .get('https://api2.simplifies.cl/api/usuario')
        .then((response) => {
          this.users = response.data.users;
        });*/
    },
    onFileSelected(event) {
      let file = event.target.files[0];
      this.editedItem.client_image = file;
      this.editedItemCardGift.image_cardgift = file;
      console.log(this.editedItem.client_image);
      this.cargarImage(file);
    },
    cargarImage(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imgMiniatura = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    editItem(item) {
      this.file = null;
      var img = new Image();
      img.src = "https://api2.simplifies.cl/api/images/" + item.client_image;
      img.onload = () => {
        this.imgMiniatura = "https://api2.simplifies.cl/api/images/" + item.client_image;
      };
      img.onerror = () => {
        this.imgMiniatura = "";
      };
      this.editedIndex = 1;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.editando = true;
    },
    deleteItem(item) {
      this.editedIndex = 1;
      this.editedItem.id = item.id;
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      LocalStorageService.setIsLocked(true);
      //this.results.splice(this.editedIndex, 1)
      let request = {
        id: this.editedItem.id,
      };
      axios
        .post("https://api2.simplifies.cl/api/client-destroy", request)
        .then(() => {})
        .finally(() => {
          LocalStorageService.setIsLocked(false);
          this.showAlert("success", "Cliente eliminado correctamente", 3000);
          this.initialize();
        });
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.imgMiniatura = "";
        this.file = "";
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      LocalStorageService.setIsLocked(true);
      if (this.editedIndex > -1) {
        this.valid = false;
        /*this.data.id = this.editedItem.id;
        this.data.name = this.editedItem.name;
        this.data.surname = this.editedItem.surname;
        this.data.second_surname = this.editedItem.second_surname;
        this.data.email = this.editedItem.email;
        this.data.phone = this.editedItem.phone;*/
        const formData = new FormData();
        for (let key in this.editedItem) {
          formData.append(key, this.editedItem[key]);
        }
        axios
          .post("https://api2.simplifies.cl/api/client-update", formData)
          .then(() => {})
          .finally(() => {
            LocalStorageService.setIsLocked(false);
            this.showAlert("success", "Cliente editado correctamente", 3000);
            this.initialize();
          });
      } else {
        this.valid = false;
        /*this.data.name = this.editedItem.name;
        this.data.name = this.editedItem.name;
        this.data.surname = this.editedItem.surname;
        this.data.second_surname = this.editedItem.second_surname;
        this.data.email = this.editedItem.email;
        this.data.phone = this.editedItem.phone;*/
        const formData = new FormData();
        for (let key in this.editedItem) {
          formData.append(key, this.editedItem[key]);
        }
        axios
          .post("https://api2.simplifies.cl/api/client", formData)
          .then(() => {
            LocalStorageService.setIsLocked(false);
            this.initialize();
            this.showAlert("success", "Cliente registrado correctamente", 3000);
          })
          .catch((error) => {
            if (error.response.status == "400"){
              this.showAlert("warning", "Correo ya existe", 3000);
            }else if (error.response.status === 401) {
              this.showAlert("warning", "Correo ya existe", 3000);
            }
          });
      }
      this.close();
    },
    showHistory(item) {
      LocalStorageService.setIsLocked(true);
      console.log("Client History");
      axios
        .get("https://api2.simplifies.cl/api/client-history", {
          params: {
            //branch_id: this.branch_id,
            client_id: item.id,
          },
        })
        .then((response) => {
          this.history = response.data.clientHistory;
        })
        .finally(() => {
          LocalStorageService.setIsLocked(false);
          this.dialogHistory = true;
        });
    },
    closeHistory() {
      this.dialogHistory = false;
    },
    ClientsFrecuence() {
      this.loadingVisit = true;
      LocalStorageService.setIsLocked(true);
      this.editedIndex = 2;
      const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      axios
        .get('https://api2.simplifies.cl/api/clients-frecuence-periodo', {
          params: {
            branch_id: this.branch_id,
            startDate: startDate,
            endDate: endDate
          }
        })
        .then((response) => {
          this.frecuence = response.data;
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.dialogFrecuence = true;
          this.loadingVisit = false;
          });
    },
    closeClientFrecuence() {
      this.dialogFrecuence = false;
    },
    updateDate(val) {
      this.input = val;
      this.menu = false;
      this.menu2 = false;
    },
    updateDate1(val) {
      this.input2 = val;
      this.menu2 = false;
    },
    updateDate2() {
      this.loadingVisit = true;
      LocalStorageService.setIsLocked(true);
      this.editedIndexF = 2;
      const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      axios
        .get('https://api2.simplifies.cl/api/clients-frecuence-periodo', {
          params: {
            branch_id: this.branch_id,
            startDate: startDate,
            endDate: endDate
          }
        })
        .then((response) => {
          this.frecuence = response.data;
        }).finally(() => {
            LocalStorageService.setIsLocked(false);
            this.loadingVisit = false;
        });
    },
    exportToExcel() {
      // Primero, prepara una matriz que contendrá todas las filas de datos, incluidos los encabezados
      let rows = [];

      // Construye un objeto para los encabezados basado en la estructura de 'headers'
      let headerRow = {};
      this.headers1.forEach(header => {
        headerRow[header.key] = header.title; // Usa 'key' para el mapeo y 'title' para el texto del encabezado
      });
      rows.push(headerRow);

      // Ahora, mapea los datos de los items para que coincidan con los encabezados
      this.frecuence.forEach(item => {
        let rowData = {};
        this.headers1.forEach(header => {
          rowData[header.key] = item[header.key] || ''; // Asegura que cada celda se mapee correctamente; usa '' para datos faltantes
        });
        rows.push(rowData);
      });

      let nameReport = {
        // eslint-disable-next-line vue/no-use-computed-property-like-method
        name: this.formTitleFrec, // Asume que 'name' es una de tus claves; ajusta según sea necesario
        email: '',
        phone: '+569', // Deja vacíos los demás campos para esta fila especial
        frecuence: '', // Usa 'total' para mostrar la fecha; ajusta las claves según corresponda a tu estructura
        cant_visist: '',
        data: ''
      };
      rows.push(nameReport);

      // Convierte la matriz de filas en una hoja de trabajo Excel
      const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true }); // 'skipHeader: true' porque ya agregamos manualmente los encabezados

      // Crea un nuevo libro de trabajo y añade la hoja de trabajo con los datos
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report" + this.fecha);

      // Escribe el libro de trabajo a un archivo y desencadena la descarga
      //XLSX.writeFile(wb, "report.xlsx");
      XLSX.writeFile(wb, `report_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
    },
    showGiftCard(){
      this.dialogGistCard = true;
      this.loadingCardGift = true;
      LocalStorageService.setIsLocked(true);
      axios
        .get('https://api2.simplifies.cl/api/card-gift')
        .then((response) => {
          this.cardGiftsData = response.data.cardGifts;
          this.business = response.data.business;
        }).finally(() => {
            LocalStorageService.setIsLocked(false);
            this.loadingCardGift = false;
            if (this.business.length > 0) {
            this.editedItemCardGift.business_id = this.business[0].id; // Establecer el primer negocio como valor predeterminado
          }
        });
    },
    closeshowGiftCard(){
      this.dialogGistCard = false;
    },
    showAddCardGiftCard(){
      this.dialogAddCardGift = true;
    },
    closeAddCardGiftCard() {
      this.editedIndexG = -1;
      this.dialogAddCardGift = false;
      this.$nextTick(() => {
          this.editedItemCardGift = Object.assign({}, this.defaultItemCardGift)
          this.imgMiniatura = '';
          this.file = null;
        })
    },
    saveCardGift() {
      LocalStorageService.setIsLocked(true);

        //console.log(this.editedItem.id);
        this.valid = false;
        const formData = new FormData();
        for (let key in this.editedItemCardGift) {
          formData.append(key, this.editedItemCardGift[key]);
        }
        if( this.editedIndexG == -1){
          axios
          .post('https://api2.simplifies.cl/api/card-gift', formData)
          .then(() => {
            this.imgMiniatura = '';
            this.file = null;

          }).finally(() => {
            LocalStorageService.setIsLocked(false);
            this.showAlert("success", "Tarjeta de Regalo editada correctamente", 3000);
            this.showGiftCard();
          });
        }else{
          axios
          .post('https://api2.simplifies.cl/api/card-gift-update', formData)
          .then(() => {
            this.imgMiniatura = '';
            this.file = null;

          }).finally(() => {
            LocalStorageService.setIsLocked(false);
            this.showAlert("success", "Tarjeta de Regalo editada correctamente", 3000);
            this.showGiftCard();
            this.editedIndexG = -1;
          });
        }
      this.closeAddCardGiftCard()
    },
    editItemCardGift(item) {
      this.editedIndexG = 1;
      this.dialogAddCardGift = true;
      this.file = null;
      var img = new Image();
      img.src = 'https://api2.simplifies.cl/api/images/' + item.image_cardgift;
      img.onload = () => {
        this.imgMiniatura = 'https://api2.simplifies.cl/api/images/' + item.image_cardgift;
      };
      img.onerror = () => {
        this.imgMiniatura = '';
      };
      console.log('item de cardGift');
      console.log(item);
      this.editedItemCardGift = Object.assign({}, item);
    },
    deleteItemCardGift(item) {
      this.editedItemCardGift.id = item.id;
      this.dialogDeleteCardGift = true;
    },
    closeDeleteCardGift() {
      this.$nextTick(() => {
        this.editedItemCardGift = Object.assign({}, this.defaultItemCardGift)
      })
      //this.initialize();
      this.dialogDeleteCardGift = false;
    },
    deleteItemConfirmCardGift() {
      LocalStorageService.setIsLocked(true);
      //this.results.splice(this.editedIndex, 1)
      let request = {
        id: this.editedItemCardGift.id
      };
      axios
        .post('https://api2.simplifies.cl/api/card-gift-destroy', request)
        .then(() => {
          this.dialogDeleteCardGift = false;
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.showAlert("success", "Tarjeta de regalo eliminada correctamente", 3000);
          this.showGiftCard();
          });
    },
    showCardGiftUser(item) {
      this.cardSelect = item;
      //console.log(this.cardSelect);
      this.loadingCardGftUser = true;
      console.log(item.id);
      this.editedCardGiftUser.card_gift_id = item.id
      this.data.card_gift_id = item.id
      LocalStorageService.setIsLocked(true);
      axios
        .get('https://api2.simplifies.cl/api/card-gift-user-show', {
          params: {
            card_gift_id: item.id
          }
        })
        .then((response) => {
          this.cardgiftUser = response.data.cardgiftUser;
          this.loadingCardGftUser = false;
          LocalStorageService.setIsLocked(false);
        });
      this.dialogCardGitfUser = true;
    },
    closeCardGiftUser() {
      this.$nextTick(() => {
        this.editedCardGiftUser = Object.assign({}, this.defaultCardGiftUser)
      })
      this.dialogCardGitfUser = false;
      //this.showCardGifts(this.cardSelect)
    },
    deleteCardGiftUser(item) {
      this.dialogDeleteCardGiftUser = true;
      //this.editedItem.branch_id=item.id
      this.editedCardGiftUser.id = item.id
    },
    closedeleteCardGiftUser() {
      this.$nextTick(() => {
        this.editedCardGiftUser = Object.assign({}, this.defaultCardGiftUser)
      })
      this.dialogDeleteCardGiftUser = false;
    },
    requestDeleteCardGiftUser() {
      LocalStorageService.setIsLocked(true);
      let request = {
        id: this.editedCardGiftUser.id
      };
      axios
        .post('https://api2.simplifies.cl/api/card-gift-user-destroy', request)
        .then(() => {
          this.dialogDeleteCardGiftUser = false;
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.showCardGiftUser(this.cardSelect);
          this.showAlert("success", "Asignacion eliminada correctamente", 3000);
          this.$nextTick(() => {
            this.editedCardGiftUser = Object.assign({}, this.defaultCardGiftUser)
          });
          });
    },
    showAddCardGiftClient(){
      LocalStorageService.setIsLocked(true);
      axios
        .get('https://api2.simplifies.cl/api/client-autocomplete1', {
                    params: {
                        branch_id: this.branch_id,
                    }
                })
        .then((response) => {
          this.users = response.data.clients;
        }).finally(() => {
            LocalStorageService.setIsLocked(false);
        });
        this.dialogAddCardGiftClient = true;
    },
    closedialogAddCardGiftUser() {
      this.dialogAddCardGiftClient = false;
      this.details = '';
      this.nameClient = '';
      this.$nextTick(() => {
        this.editedCardGiftUser = Object.assign({}, this.defaultCardGiftUser)
      })
      //this.showCardGifts(this.cardSelect)
    },
    saveCardGiftUser() {
      LocalStorageService.setIsLocked(true);
      this.valid = false,
        this.data.card_gift_id = this.cardSelect.id;
      this.data.user_id = this.editedCardGiftUser.user_id;
      this.data.branch_id = this.branch_id;
      this.data.expiration_date = this.editedCardGiftUser.expiration_date ? this.editedCardGiftUser.expiration_date : format(new Date(), "yyyy-MM-dd");/*this.input ? format(new Date(this.input), "") : new Date();*/
      console.log('this.editedCardGiftUser.expiration_date');
      console.log(this.data.expiration_date);
      axios
        .post('https://api2.simplifies.cl/api/card-gift-user', this.data)
        .then(() => {
          this.$nextTick(() => {
            this.editedCardGiftUser = Object.assign({}, this.defaultCardGiftUser);
            this.details = '';
            this.nameClient = '';
          });
          this.dialogAddCardGiftClient = false;
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.showAlert("success", "Tarjeta asignada correctamente al usuario", 3000);
          this.showCardGiftUser(this.cardSelect);
          });
    },

    //User Card Gift
    showUserCardGift(item) {
      this.userSelect = item;
      console.log(item.user_id);
      this.loadingUserCardGft = true;
      console.log(item.id);
      this.editedCardGiftUser.user_id = item.user_id
      this.data.user_id = item.user_id
      LocalStorageService.setIsLocked(true);
      axios
        .get('https://api2.simplifies.cl/api/card-gift-user-cardgift', {
          params: {
            user_id: item.user_id,
            business_id: this.business_id
          }
        })
        .then((response) => {
          this.userCardgift = response.data.cardgiftUser;
          this.cardGiftsData = response.data.cardGifts;
          this.loadingUserCardGft = false;
          LocalStorageService.setIsLocked(false);
        });
      this.dialogUserCardGitf = true;
    },
    closeUserCardGift() {
      this.$nextTick(() => {
        this.editedCardGiftUser = Object.assign({}, this.defaultCardGiftUser)
      })
      this.dialogUserCardGitf = false;
      //this.showCardGifts(this.cardSelect)
    },
    deleteUserCardGift(item) {
      this.dialogUserDeleteCardGift = true;
      //this.editedItem.branch_id=item.id
      this.editedCardGiftUser.id = item.id
    },
    closedeleteUserCardGift() {
      this.$nextTick(() => {
        this.editedCardGiftUser = Object.assign({}, this.defaultCardGiftUser)
      })
      this.dialogUserDeleteCardGift = false;
    },
    requestUserDeleteCardGift() {
      LocalStorageService.setIsLocked(true);
      let request = {
        id: this.editedCardGiftUser.id
      };
      axios
        .post('https://api2.simplifies.cl/api/card-gift-user-destroy', request)
        .then(() => {
          this.dialogUserDeleteCardGift = false;
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.showUserCardGift(this.userSelect);
          this.showAlert("success", "Asignacion eliminada correctamente", 3000);
          this.$nextTick(() => {
            this.editedCardGiftUser = Object.assign({}, this.defaultCardGiftUser)
          });
          });
    },
    showAddClientCardGift(){
        this.dialogClientAddCardGift = true;
    },
    closedialogAddtUserCardGif() {
      this.dialogClientAddCardGift = false;
      this.$nextTick(() => {
        this.editedCardGiftUser = Object.assign({}, this.defaultCardGiftUser)
      })
      //this.showCardGifts(this.cardSelect)
    },
    saveUserCardGift() {
      LocalStorageService.setIsLocked(true);
      this.valid = false,
        this.data.card_gift_id = this.editedCardGiftUser.card_gift_id;
      this.data.user_id = this.userSelect.user_id;
      this.data.branch_id = this.branch_id;
      this.data.expiration_date = this.editedCardGiftUser.expiration_date ? this.editedCardGiftUser.expiration_date : format(new Date(), "yyyy-MM-dd");/*this.input ? format(new Date(this.input), "") : new Date();*/
      console.log('this.editedCardGiftUser.expiration_date');
      console.log(this.data.expiration_date);
      axios
        .post('https://api2.simplifies.cl/api/card-gift-user', this.data)
        .then(() => {
          this.$nextTick(() => {
            this.editedCardGiftUser = Object.assign({}, this.defaultCardGiftUser);
          });
          this.dialogClientAddCardGift = false;
        }).finally(() => {
          LocalStorageService.setIsLocked(false);
          this.showAlert("success", "Tarjeta asignada correctamente al cliente", 3000);
          this.showUserCardGift(this.userSelect);
          });
    },
  },
};
</script>
