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
<v-container>
  <v-card elevation="6" class="mx-5">

    <v-toolbar color="#F18254">
      <v-row >
        <v-col cols="12" md="9" class="mt-4">
          <span class="ml-3"> <strong>Listado de Sucursales</strong></span>
        </v-col>
        
        <v-col cols="12" md="3">          
          <v-btn class="text-subtitle-1  ml-12  " color="#E7E9E9" variant="flat" elevation="2"
                prepend-icon="mdi-plus-circle" @click="showAddBranch()">
                Agregar Sucursal
              </v-btn>
        </v-col>
        
        <v-dialog v-model="dialog" max-width="1000px">
            <v-card>
              <v-toolbar color="#F18254">
                <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
              </v-toolbar>
              <v-card-text>
                <v-form v-model="valid" enctype="multipart/form-data">
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.name" clearable label="Nombre"
                          prepend-icon="mdi-storefront-outline" variant="underlined" :rules="nameRules">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.phone" clearable label="Teléfono"
                          prepend-icon="mdi-phone-outline" variant="underlined"  placeholder="+56912345678" :rules="mobileRules">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.address" clearable label="Dirección"
                          prepend-icon="mdi-map-marker-outline" variant="underlined" :rules="dirRules">
                        </v-text-field>
                      </v-col>

                      <v-col cols="12" md="6">

                        <v-autocomplete :no-data-text="'No hay datos disponibles'" clearable label="Negocio" variant="underlined" prepend-icon="mdi-domain"
                          v-model="editedItem.business_id" :items="business" item-title="name" item-value="id"
                          :rules="selectRules">
                        </v-autocomplete>
                      </v-col>


                      <v-col cols="12" md="6">

                        <v-autocomplete :no-data-text="'No hay datos disponibles'" clearable label="Tipo de Negocio" variant="underlined" prepend-icon="mdi-domain"
                          v-model="editedItem.business_type_id" :items="businessTypes" item-title="name" item-value="id"
                          :rules="selectRules">
                        </v-autocomplete>
                        <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.useTechnical" :items="options" clearable label="Técnico"
                        prepend-icon="mdi-hair-dryer" item-title="name" item-value="id" variant="underlined"
                        ></v-autocomplete>
                        <v-text-field v-model="editedItem.location" clearable label="Localización (Google Maps)"
                          prepend-icon="mdi-map-marker" variant="underlined">
                        </v-text-field>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-file-input clearable v-model="file" ref="fileInput" label="Imagen Sucursal" variant="underlined"
                          density="compact" name="file" accept=".png, .jpg, .jpeg" @change="onFileSelected">
                        </v-file-input>
                        <!--<v-avatar elevation="3" color="grey-lighten-4" size="large">
                          <img v-if="imgedit" :src="imgedit" height="70" width="70">
                        </v-avatar>-->
                        <v-card elevation="6" class="mx-auto" max-width="120" max-height="120">
                        <img v-if="imagenDisponible()" :src="imgedit" height="120" width="120">
                      </v-card>
                      </v-col>
                    </v-row>
                  </v-container>

                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#E7E9E9" variant="flat" @click="close">
                      Cancelar
                    </v-btn>
                    <v-btn color="#F18254" variant="flat" @click="save" :disabled="!valid">
                      Aceptar
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>

          </v-dialog>
      </v-row>

    </v-toolbar>

    <v-card-text>
            <v-container>
      <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                hide-details>
            </v-text-field>
      <v-data-table :headers="headers" :search="search" :items="results" class="elevation-1" :items-per-page-text="'Elementos por páginas'" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">
        <template v-slot:item.name="{ item }">

          <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
            <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_data" alt="image"></v-img>
          </v-avatar>
          {{ item.name }}
        </template>
        
        <template v-slot:item.useTechnical="{ item }">
          <div class="text-end">
            <v-chip :color="item.useTechnical ? 'green' : 'red'" :text="item.useTechnical ? 'Si ' : 'No'"
              class="text-uppercase" size="small" label style="text-align: center;"></v-chip>
          </div>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-pencil" @click="editItem(item)" color="primary" variant="darken-1"
            elevation="1" title="Editar Sucursal"></v-btn>
          <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-account-tie" @click="showProfessionals(item)" color="indigo" variant="darken-2"
            elevation="1" title="Agregar Trabajdor"></v-btn>  
          <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-store-outline" @click="showStores(item)" color="green" variant="tonal"
            elevation="1" title="Agregar Almacén"></v-btn>  
          <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-handshake" @click="showAssociates(item)" color="orange" variant="tonal"
            elevation="1" title="Agregar Asociado"></v-btn>  
            <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-finance" @click="showWinner(item)" color="teal" variant="tonal"
            elevation="1" title="Finanzas de la  sucursal"></v-btn>  
          <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-delete" @click="deleteItem(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar Sucursal"></v-btn>
        </template>
      </v-data-table>
      </v-container>
      <v-dialog v-model="dialogDelete" max-width="600px">
            <v-card>
              <v-toolbar color="red">
                <span class="text-subtitle-2 ml-4"> Eliminar Sucursal</span>
              </v-toolbar>

              <v-card-text class="mt-2 mb-2"> ¿Desea eliminar la Sucursal seleccionada?</v-card-text>
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
      <!--Professionals-->
      <v-dialog v-model="dialogProfessionals" fullscreen transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-2 ml-4"> Trabajadores de la Sucursal</span>
            <v-spacer></v-spacer>
            <v-btn class="text-subtitle-1  ml-12" color="#E7E9E9" variant="flat" @click="showAddProfessionals()">
              Agregar Trabajador
            </v-btn>
          </v-toolbar>

          <v-card-text class="mt-2 mb-2">
            <v-text-field class="mt-1 mb-1" v-model="search2" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details></v-text-field>

            <v-data-table :headers="headers2" :items="branchProfessionals" :search="search2" class="elevation-1" :items-per-page-text="'Elementos por páginas'" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">
              <template v-slot:item.ponderation="{ item }">
                    {{ item.ponderation === 0 ? 1 : item.ponderation }}
                    </template>
              <template v-slot:item.name="{ item }">

                <v-avatar elevation="3" color="grey-lighten-4" size="large">
                  <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_url+'?$'+Date.now()" alt="image"></v-img>
                </v-avatar>
                {{ item.name}}
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn density="comfortable" icon="mdi-pencil"  @click="editItemProfessional(item)" color="primary" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Editar asignación de profesional"></v-btn>
                <v-btn density="comfortable" icon="mdi-delete" @click="deleteP(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar afiliación del trabajador"></v-btn>
                <!--<v-icon size="small" color="red" @click="deleteP(item)">
                  mdi-delete
                </v-icon>-->
              </template>

            </v-data-table>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#F18254" variant="flat" @click="closeDelete">
              Volver
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogAddProf" width="500">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-2 ml-4"> {{ formTitleProfessional }}</span>
          </v-toolbar>
          <v-card-text class="mt-2 mb-2">
            <v-form ref="form" v-model="valid" enctype="multipart/form-data">
              <v-container>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.professional_id" :items="professionals" label="Profesional"
                      prepend-icon="mdi-account-tie-outline" item-title="name" item-value="id" variant="underlined"
                      :rules="selectRules" v-if="!editando" @update:model-value="bonusActiv">
                      <template v-slot:item="{ props, item }">
                                                    <v-list-item
                                                        v-bind="props"
                                                        :prepend-avatar="'https://api2.simplifies.cl/api/images/'+item.raw.image_url"
                                                        :subtitle="'Cargo: '+item.raw.charge"
                                                        :title="item.raw.name"
                                                    ></v-list-item>
                                                    </template>
                      </v-autocomplete>
                      <v-text-field v-model="nameProfessional" label="Professional"
                                        prepend-icon="mdi-account-tie-outline" variant="underlined" v-if="editando" disabled="true">
                                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="12">
                                    <v-text-field v-model="editedItem.ponderation" clearable label="Ponderación"
                                        prepend-icon="mdi-arrow-collapse-vertical" variant="underlined" :rules="pago">
                                    </v-text-field>
                                    <v-text-field v-if="bonus" v-model="editedItem.limit" clearable label="Meta de Productividad"
                                        prepend-icon="mdi-currency-usd" variant="underlined" :rules="pago" >
                                    </v-text-field>
                                     <v-text-field v-if="bonus" v-model="editedItem.mountpay" clearable label="Monto a Pagar"
                                        prepend-icon="mdi-currency-usd" variant="underlined" :rules="pago" >
                                    </v-text-field>
                                    </v-col>
                </v-row>
              </v-container>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="closeP">
                  Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" @click="saveP" :disabled="!valid">
                  Aceptar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogRequest" width="500">
        <v-card>

          <v-toolbar color="red">
            <span class="text-subtitle-2 ml-4"> Eliminar afiliación del professional de esta sucursal</span>
          </v-toolbar>

          <v-card-text class="mt-2 mb-2"> ¿Desea eliminar esta afiliación del trabajador con la sucursal?</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="closerequest">
              Cancelar
            </v-btn>
            <v-btn color="#F18254" variant="flat" @click="requestDelete">
              Aceptar
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--Store-->
      <v-dialog v-model="dialogStores" fullscreen transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-1 ml-4"> Almacenes de la Sucursal</span>
            <v-spacer></v-spacer>
            <v-btn class="text-subtitle-1  ml-12" color="#E7E9E9" variant="flat" @click="showAddStores()">
              Agregar Almacén
            </v-btn>
          </v-toolbar>
          <v-card-text class="mt-2 mb-2">
            <v-text-field class="mt-1 mb-1" v-model="search3" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details></v-text-field>
            <v-data-table :headers="headers3" :items="branchStores" :search="search3" class="elevation-1" :items-per-page-text="'Elementos por páginas'" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">

              <!--<template v-slot:item.name="{ item }">

                    <v-avatar elevation="3" color="grey-lighten-4" size="large">
                      <v-img :src="'https://api2.simplifies.cl/api/images/'+item.image_url" alt="image"></v-img>
                    </v-avatar>
                    {{ item.name+' '+item.surname+' '+item.second_surname}}
                  </template>-->

              <template v-slot:item.actions="{ item }">
          <v-btn density="comfortable" icon="mdi-delete" @click="closestoreRequest(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar afiliación del almacén"></v-btn>
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
      <v-dialog v-model="dialogAddStore" width="500">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-2 ml-4">Agregar Almacén</span>
          </v-toolbar>
          <v-card-text class="mt-2 mb-2">
            <v-form ref="form" v-model="valid" enctype="multipart/form-data">
              <v-container>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.store_id" :items="stores" label="Almacén"
                      prepend-icon="mdi-store-outline" item-title="address" item-value="id" variant="underlined"
                      :rules="selectRules"></v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="closestore">
                  Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" @click="saveStore" :disabled="!valid">
                  Aceptar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogRequestStore" width="500">
        <v-card>

          <v-toolbar color="red">
            <span class="text-subtitle-2 ml-4"> Eliminar afiliación del almacén de esta sucursal</span>
          </v-toolbar>

          <v-card-text class="mt-2 mb-2"> ¿Desea eliminar esta afiliación del almacén con la sucursal?</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="closerequestStore">
              Cancelar
            </v-btn>
            <v-btn color="#F18254" variant="flat" @click="storeDelete">
              Aceptar
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--Associates-->
      <v-dialog v-model="dialogAssociates" fullscreen transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-1 ml-4"> Asociados a la Sucursal</span>
            <v-spacer></v-spacer>
            <v-btn class="text-subtitle-1  ml-12" color="#E7E9E9" variant="flat" @click="showAddAssociates()">
              Agregar Asociado
            </v-btn>
          </v-toolbar>
          <v-card-text class="mt-2 mb-2">
            <v-text-field class="mt-1 mb-1" v-model="search4" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details></v-text-field>
            <v-data-table :headers="headers4" :items="branchAssociates" :search="search4" class="elevation-1" :items-per-page-text="'Elementos por páginas'" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">

              <!--<template v-slot:item.name="{ item }">

                    <v-avatar elevation="3" color="grey-lighten-4" size="large">
                      <v-img :src="'https://api2.simplifies.cl/api/images/'+item.image_url" alt="image"></v-img>
                    </v-avatar>
                    {{ item.name+' '+item.surname+' '+item.second_surname}}
                  </template>-->

              <template v-slot:item.actions="{ item }">
          <v-btn density="comfortable" icon="mdi-delete" @click="closeassociateRequest(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar afiliación del asociado"></v-btn>
                <!--<v-icon size="small" color="red" @click="closestoreRequest(item)">
                  mdi-delete
                </v-icon>-->
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
      <v-dialog v-model="dialogAddAssociate" width="500">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-2 ml-4">Agregar Associado</span>
          </v-toolbar>
          <v-card-text class="mt-2 mb-2">
            <v-form ref="form" v-model="valid" enctype="multipart/form-data">
              <v-container>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="associated_id" :items="associates" label="Asociado"
                      prepend-icon="mdi-handshake" item-title="name" item-value="id" variant="underlined"
                      :rules="selectRules"></v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="closeassociate">
                  Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" @click="saveAssociated" :disabled="!valid">
                  Aceptar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogRequestAssociate" width="500">
        <v-card>

          <v-toolbar color="red">
            <span class="text-subtitle-2 ml-4"> Eliminar afiliación del asociado de esta sucursal</span>
          </v-toolbar>

          <v-card-text class="mt-2 mb-2"> ¿Desea eliminar esta afiliación del asociado con la sucursal?</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="closerequestAssociate">
              Cancelar
            </v-btn>
            <v-btn color="#F18254" variant="flat" @click="associateDelete">
              Aceptar
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--Finanzas-->
      <v-dialog v-model="dialogWinners" fullscreen transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-h6 ml-4">Ganancias de la Sucursal</span>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-container>
      <v-row>
        <!-- Primera columna -->
        <v-col cols="12" md="3">
          <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
            min-width="290px" multiple>
            <template v-slot:activator="{ props }">
              <v-text-field v-bind="props" :modelValue="dateFormatted" variant="outlined" append-inner-icon="mdi-calendar"
                label="Fecha inicial" multiple></v-text-field>
            </template>
            <v-locale-provider locale="es">
              <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2" :modelValue=input @update:modelValue="updateDate"
                format="yyyy-MM-dd" :max="dateFormatted2"></v-date-picker>
            </v-locale-provider>
          </v-menu>
        </v-col>
        <!-- Segunda columna -->
        <v-col cols="12" md="3">
          <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
            min-width="290px">
            <template v-slot:activator="{ props }">
              <v-text-field v-bind="props" :modelValue="dateFormatted2" variant="outlined"
                append-inner-icon="mdi-calendar" label="Fecha final"></v-text-field>
            </template>
            <v-locale-provider locale="es">
              <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2" :modelValue="getDate2" @update:modelValue="updateDate1"
                format="yyyy-MM-dd" :min="dateFormatted"></v-date-picker>
            </v-locale-provider>
          </v-menu>
        </v-col>
        <v-col cols="12" md="1">
                        <v-btn icon @click="updateDate3" color="#F18254" >
                    <v-icon>mdi-magnify</v-icon></v-btn>
                </v-col>
            </v-row>
              </v-container>
              <v-row>
            <v-container>
            <v-alert border type="info" variant="outlined" density="compact">
                    <p v-html="formTitleWin"></p>
                              </v-alert>
                            </v-container>
          </v-row> 
            <v-container>
          <v-row>
              <v-col cols="12" md="4" v-for="(item, key) in winners" :key="key">
                    <v-card class="mx-auto pa-4 ml-0" :subtitle="key=='Monto Generado' || key=='Monto Servicios Especiales' ? formatNumber(item.value) : item.value" :title="key">                  
                    <template v-slot:prepend>
                      <v-avatar :color="item.color">
                        <v-icon color="white">{{ item.icon }}</v-icon>
                      </v-avatar>
                    </template>                
                </v-card>
              </v-col>
            </v-row>
            </v-container>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="closeShowWinner">
              Volver
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</v-container>
</template>

<script>

import axios from "axios";
import { format } from "date-fns";
import LocalStorageService from "@/LocalStorageService";
export default {
  data: () => ({
    valid: true,
    branchSelect: "",
    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
    search3: '',
    search4: '',
    business_id: '',
    search2: '',
    search:'',
    editando: false,
    dialog: false,
    dialogDelete: false,
    dialogProfessionals: false,
    dialogStores: false,
    dialogAddProf: false,
    dialogRequest: false,
    dialogAddStore: false,
    dialogRequestStore: false,
    dialogRequestAssociate: false,
    dialogAssociates : false,
    dialogAddAssociate: false,
    associated_id: '',
    bonus: false,
    headers: [
      { title: 'Nombre', value: 'name' },
      { title: 'Teléfono', value: 'phone' },
      { title: 'Dirección', value: 'address', width: '200px'  },
      { title: 'Tipo de Negocio', value: 'business_type.name' },
      { title: 'Técnico', value: 'useTechnical' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    headers2: [
      { title: 'Nombre', value: 'name' },
      { title: 'Cargo', value: 'charge' },
      { title: 'Ponderación', value: 'ponderation' },
      { title: 'Meta Productividad', value: 'limit' },
      { title: 'Monto a Pagar', value: 'mountpay' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    headers3: [
      { title: 'Referencia', value: 'reference' },
      { title: 'Dirección', value: 'address' },
      { title: 'Descripción', value: 'description' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    headers4: [
      { title: 'Nombre', value: 'name' },
      { title: 'Email', value: 'email' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    results: [],

    business: [],
    businessTypes: [],
    branchProfessionals: [],
    branchStores: [],
    professionals: [],
    stores: [],
    associates: [],
    branchAssociates: [],

    editedIndex: -1,
    editedIndexP: -1,
    file: null,
    imgMiniatura: '',
    nameProfessional: '',
    editedItem: {
      id: '',
      name: '',
      phone: '',
      address: '',
      business_id: '',
      business_type_id: '',
      image_data: '',
      professional_id: '',
      ponderation: 1,
      store_id: '',
      useTechnical: 0,
      location: '',
      limit: '',
      mountpay: ''
    },
    data: {},
    options: [
        { name: 'SI', id: 1 },
        { name: 'NO', id: 0 }
      ],
    defaultItem: {
      name: '',
      phone: '',
      address: '',
      business_id: '',
      business_type_: '',
      image_data: '',
      professional_id: '',
      ponderation: 1,
      store_id: '',
      useTechnical: '',
      location: '',
      limit: '',
      mountpay: ''
    },
    //winners
    winners: [],
    dialogWinners: false,
    menu: false,
    menu2: false,
    input: null,
    input2: null,
    fecha: '',
    search5: '',
    editedIndexWin: -1,

    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 100) ||
        "El campo debe tener menos de 251 caracteres",
      (v) => (v && v.length >= 3) ||
        "El campo debe tener al menos de 3 caracteres",
    ],
    dirRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 250) ||
        "El campo debe tener menos de 251 caracteres",
      (v) => (v && v.length >= 3) ||
        "El campo debe tener al menos de 3 caracteres",
    ],
    mobileRules: [
      v => !!v || 'El número de móvil es requerido',
      v => /^\+569\d{8}$/.test(v) || 'Formato de número móvil inválido. Ejemplo: +56912345678'
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
  }),

  computed: {
    imgedit() {
      return this.imgMiniatura;
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Nueva Sucursal' : 'Editar Sucursal'
    },

    formTitleProfessional() {
      return this.editedIndexP === -1 ? 'Asignar Trabajador' : 'Editar Asignación del trabajador'
    },
    formTitleWin() {
      if (this.editedIndexWin === 2) {
        const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
        return `Ganancias de la Sucursal en el período [<strong>${startDate}</strong> - <strong>${endDate}</strong>]`;
		
      }
      else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fecha = format(new Date(), "yyyy-MM-dd");
        return `Ganancias de la Sucursal en el día`;
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
    'editedItem.ponderation': function(newValue) {
      // Si el nuevo valor es 0, lo ajustamos a 1
      if (newValue === 0) {
        this.editedItem.ponderation = 1;
      }
      else{
        this.editedItem.ponderation;
      }
    },
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  mounted() {
    this.business_id = LocalStorageService.getItem('business_id');
    this.editedItem.business_id = this.business_id; // Establecer el primer negocio como valor predeterminado
      //console.log('this.editedItem.business_id');
      //console.log(this.editedItem.business_id);
      axios
        .get('https://api2.simplifies.cl/api/business')
        .then((response) => {
          this.business = response.data.business;     
        }).finally(() => {
          if (this.business.length > 0) {
      this.editedItem.business_id = this.business[0].id; // Establecer el primer negocio como valor predeterminado
    } 
    this.initialize();
          });
  },

  methods: {
  bonusActiv(professional_id){
    const selectedProfessional = this.professionals.find(prof => prof.id === professional_id);
      if (selectedProfessional.charge == "Barbero y Encargado" || selectedProfessional.charge == "Barbero") {
        this.bonus = true;
      }
      else {
        this.bonus = false;
      }
  },
    imagenDisponible() {
        if (this.imgedit !== undefined && this.imgedit !== '') {
            // Intenta cargar la imagen en un elemento oculto para verificar si está disponible
            let img = new Image();
            img.src = this.imgedit;
            return true; // Devuelve true si la imagen está disponible
        }
        return false; // Si la URL de la imagen no está definida o está vacía, devuelve false
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
        .get('https://api2.simplifies.cl/api/branch')
        .then((response) => {
          this.results = response.data.branches;
          console.log('imprime sucursales');
          console.log(this.results);
        });
    },
    showAddBranch(){
      axios
        .get('https://api2.simplifies.cl/api/business-type')
        .then((response) => {
          this.businessTypes = response.data.businessTypes;
        });
        this.dialog = true;
    },
    onFileSelected(event) {
      let file = event.target.files[0];
      this.editedItem.image_data = file;
      console.log(this.editedItem.image_data);
      this.cargarImage(file);
    },
    cargarImage(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imgMiniatura = e.target.result;
      }
      reader.readAsDataURL(file);
    },
    editItem(item) {
      this.file = null;
      var img = new Image();
      img.src = 'https://api2.simplifies.cl/api/images/' + item.image_data;
      img.onload = () => {
        this.imgMiniatura = 'https://api2.simplifies.cl/api/images/' + item.image_data;
      };
      img.onerror = () => {
        this.imgMiniatura = '';
      };
      this.editedIndex = 1;
      this.editedItem = Object.assign({}, item);
      this.editedItem.business_type_id = parseInt(item.business_type_id);
      this.editedItem.business_id = parseInt(item.business_id);
      
      this.dialog = true;
      this.editando = true;
    },
    deleteItem(item) {
      this.editedIndex = 1;
      this.editedItem.id = item.id;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      //this.results.splice(this.editedIndex, 1)
      let request = {
        id: this.editedItem.id
      };
      axios
        .post('https://api2.simplifies.cl/api/branch-destroy', request)
        .then(() => {
          this.initialize();
          this.showAlert("success", "Sucursal eliminada correctamente", 3000)
        })
      this.closeDelete()
    },
    close() {
      this.file = null;
      this.imgMiniatura = '';
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    closeP() {
      this.dialogAddProf = false;
      this.bonus = false;
      this.editando = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
      //this.showProfessionals(this.branchSelect)
    },
    closestore() {
      this.dialogAddStore = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
      //this.showStores(this.branchSelect)
    },
    closeDelete() {
      this.dialogDelete = false;
      this.dialogAssociates = false;
      this.dialogProfessionals = false;
      this.dialogStores = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.branchSelect = '';
      this.branch_id = 0;
    },
    save() {
      if (this.editedIndex > -1) {
        this.valid = false;
        /*this.data.id = this.editedItem.id;
        this.data.name = this.editedItem.name;
        this.data.phone = this.editedItem.phone;
        this.data.address = this.editedItem.address;
        this.data.business_id = this.editedItem.business.id;
        this.data.business_type_id = this.editedItem.businessType;*/
        const formData = new FormData();
        for (let key in this.editedItem) {
          formData.append(key, this.editedItem[key]);
        }
        axios
          .post('https://api2.simplifies.cl/api/branch-update', formData)
          .then(() => {
            this.file = null;
            this.imgMiniatura = '';
          }).finally(() => {
            this.showAlert("success", "Sucursal modificada correctamente", 3000);
            this.initialize();
          });
      } else {
        this.valid = false;
        /*this.data.name = this.editedItem.name;
        this.data.phone = this.editedItem.phone;
        this.data.address = this.editedItem.address;
        this.data.business_id = this.editedItem.business;
        this.data.business_type_id = this.editedItem.businessType;*/
        const formData = new FormData();
        for (let key in this.editedItem) {
          formData.append(key, this.editedItem[key]);
        }
        axios
          .post('https://api2.simplifies.cl/api/branch', formData)
          .then(() => {
            this.file = null;
            this.imgMiniatura = '';
          }).finally(() => {
            this.showAlert("success", "Sucursal creada correctamente", 3000);
            this.initialize();
          });
      }
      this.close()
    },
    showProfessionals(item) {
      this.branchSelect = item;
      console.log(this.branchSelect);
      this.branch_id = item.id;
      console.log(item.id);
      axios
        .get('https://api2.simplifies.cl/api/branch-professionals', {
          params: {
            branch_id: item.id
          }
        })
        .then((response) => {
          this.branchProfessionals = response.data.professionals;
          console.log('imprime professionals');
        });
      this.dialogProfessionals = true;
    },
    showAddProfessionals(){
      this.editedIndexP = -1;
      axios
        .get('https://api2.simplifies.cl/api/professional-show-autocomplete-Notin', {
          params: {
            branch_id: this.branchSelect.id
          }
        })
        .then((response) => {
          this.professionals = response.data.professionals;
        });
        this.dialogAddProf = true;
    },
    editItemProfessional(item) {
      this.editedIndexP = 2;
      console.log('Professional');
      console.log(item);
      axios
        .get('https://api2.simplifies.cl/api/professional-show-autocomplete-Notin', {
          params: {
            branch_id: this.branchSelect.id
          }
        })
        .then((response) => {
          this.professionals = response.data.professionals;
        });
            this.editedIndex = 2;
            this.editedItem.professional_id = parseInt(item.professional_id);
            this.editedItem.ponderation = item.ponderation;
            this.editedItem.limit = item.limit;
            this.editedItem.mountpay = item.mountpay;
            this.nameProfessional = item.name;
            this.dialogAddProf = true;
            this.editando = true;
            if(item.charge === 'Barbero' || item.charge === 'Barbero y Encargado'){
              this.bonus = true;
            }
            },
    showStores(item) {
      this.branchSelect = item;
      console.log(this.branchSelect);
      this.branch_id = item.id;
      console.log(item.id);
      axios
        .get('https://api2.simplifies.cl/api/store-show', {
          params: {
            branch_id: item.id
          }
        })
        .then((response) => {
          this.branchStores = response.data.stores;
          console.log('imprime professionals');
        });
      this.dialogStores = true;
    },
    showAddStores(){
      axios
        .get('https://api2.simplifies.cl/api/store')
        .then((response) => {
          this.stores = response.data.stores;
        });
      this.dialogAddStore = true;
    },
    saveP() {
      if (this.editedIndexP == 2) {
        this.valid = false,
        this.data.branch_id = this.branch_id;
      this.data.professional_id = this.editedItem.professional_id;
      this.data.ponderation = this.editedItem.ponderation;
      this.data.limit = this.editedItem.limit;
      this.data.mountpay = this.editedItem.mountpay;
      axios
        .put('https://api2.simplifies.cl/api/branchprofessional', this.data)
        .then(() => {
          this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
          }).finally(() => {
          this.showProfessionals(this.branchSelect);
          this.showAlert("success", "Asignación del trabajado a la sucursal editada correctamente", 3000);
          });
          this.dialogAddProf = false;
          this.editando = false;
          this.bonus = false;
        this.editedIndex = -1;
        })
      }else{
        this.valid = false,
        this.data.branch_id = this.branch_id;
      this.data.professional_id = this.editedItem.professional_id;
      this.data.ponderation = this.editedItem.ponderation;
      this.data.limit = this.editedItem.limit;
      this.data.mountpay = this.editedItem.mountpay;
      axios
        .post('https://api2.simplifies.cl/api/branchprofessional', this.data)
        .then(() => {
          this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
          }).finally(() => {
          this.showProfessionals(this.branchSelect);
          this.showAlert("success", "Trabajdor afiliado correctamente a la sucursal", 3000);
          });
          this.dialogAddProf = false;
          this.editando = false;
          this.bonus = false;
        this.editedIndex = -1;
        })
      }
    },
    saveStore() {
      this.valid = false,
        this.data.branch_id = this.branch_id;
      this.data.store_id = this.editedItem.store_id;
      axios
        .post('https://api2.simplifies.cl/api/branchstore', this.data)
        .then(() => {
          this.dialogAddStore = false;
          }).finally(() => {
          this.showStores(this.branchSelect);
          this.showAlert("success", "Almacén afiliado correctamente a la sucursal", 3000);
          this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
          });
        })
    },
    deleteP(item) {
      this.dialogRequest = true
      //this.editedItem.branch_id=item.id
      this.editedItem.professional_id = item.professional_id
    },
    closestoreRequest(item) {
      this.dialogRequestStore = true
      //this.editedItem.branch_id=item.id
      this.editedItem.store_id = item.id
    },
    requestDelete() {
      let request = {
        branch_id: this.branch_id,
        professional_id: this.editedItem.professional_id
      };
      axios
        .post('https://api2.simplifies.cl/api/branchprofessional-destroy', request)
        .then(() => {
          this.dialogRequest = false;
        }).finally(() => {
          this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem);
          })
          this.showProfessionals(this.branchSelect);
          this.showAlert("success", "Afiliación eliminada correctamente", 3000);
          });
    },
    storeDelete() {
      let request = {
        branch_id: this.branch_id,
        store_id: this.editedItem.store_id
      };
      axios
        .post('https://api2.simplifies.cl/api/branchstore-destroy', request)
        .then(() => {
          this.dialogRequestStore = false
        }).finally(() => {
          this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
          })
          this.showStores(this.branchSelect);
          this.showAlert("success", "Afiliación eliminada correctamente", 3000);
          });
    },

    closerequest() {
      this.dialogRequest = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
      //this.showProfessionals(this.branchSelect)
    },
    closerequestStore() {
      this.dialogRequestStore = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
      //this.showStores(this.branchSelect)
    },
    //Asociados
    showAssociates(item) {
      this.branchSelect = item;
      this.branch_id = item.id;
      axios
        .get('https://api2.simplifies.cl/api/associate-branch', {
          params: {
            branch_id: item.id
          }
        })
        .then((response) => {
          this.branchAssociates = response.data.associates;
          console.log('imprime professionals');
        });
      this.dialogAssociates = true;
    },
    showAddAssociates(){
      axios
        .get('https://api2.simplifies.cl/api/associated')
        .then((response) => {
          this.associates = response.data.associates;
        });
      this.dialogAddAssociate = true;
    },
    closeassociate() {
      this.dialogAddAssociate = false;
      this.associated_id = '';
      //this.showAssociates(this.branchSelect)
    },
    saveAssociated() {
      this.valid = false,
        this.data.branch_id = this.branch_id;
      this.data.associated_id = this.associated_id;
      axios
        .post('https://api2.simplifies.cl/api/associate-branch', this.data)
        .then(() => {
          this.dialogAddAssociate = false;
          }).finally(() => {
          this.showAssociates(this.branchSelect);
          this.showAlert("success", "Asociado afiliado correctamente a la sucursal", 3000);
          this.associated_id = '';
        });
    },
    closeassociateRequest(item) {
      this.dialogRequestAssociate = true
      //this.editedItem.branch_id=item.id
      this.associated_id = item.id
    },
    closerequestAssociate() {
      this.dialogRequestAssociate = false;
      this.associated_id = '';
      //this.showAssociates(this.branchSelect)
    },
    associateDelete() {
      let request = {
        branch_id: this.branch_id,
        associated_id: this.associated_id
      };
      axios
        .post('https://api2.simplifies.cl/api/associate-branch-destroy', request)
        .then(() => {
          this.dialogRequestAssociate = false
        }).finally(() => {
          this.associated_id = '';
          this.showAssociates(this.branchSelect);
          this.showAlert("success", "Afiliación eliminada correctamente", 3000);
          });
    },
    //Finanzas
    showWinner(item) {
      this.branchSelect = item;
      this.branch_id = item.id;
      this.editedIndexWin = -1;
      axios
        .get('https://api2.simplifies.cl/api/branch_winner_icon', {
          params: {
            branch_id: this.branch_id
          }
        })
        .then((response) => {
          this.winners = response.data;
        }).finally(() => {         
          this.dialogWinners = true;
          });
    },
    closeShowWinner() {
      this.dialogWinners = false; 
          this.editedIndexWin = -1;
    },
    formatNumber(value) {
            return value.toLocaleString('es-ES');
        },
    updateDate(val) {
      this.input = val;
      this.menu = false;
    },
    updateDate1(val) {
      this.input2 = val;
      this.menu2 = false;
    },
    updateDate3() {
      this.editedIndexWin = 2;
      //this.input2 = val;
      this.input = this.input ? new Date(this.input) : new Date();
      const startDate = this.input ? format(this.input, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      const endDate = this.input2 ? format(this.input2, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      axios
        .get('https://api2.simplifies.cl/api/branch_winner_icon', {
          params: {
            branch_id: this.branch_id,
            startDate: startDate,
            endDate: endDate
          }
        })
        .then((response) => {
          this.winners = response.data;
        })
      //this.menu2 = false;
    },
  },
}
</script>