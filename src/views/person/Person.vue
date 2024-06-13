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
  <v-container>
    <v-card elevation="6" class="mx-5">
      <v-toolbar color="#F18254">
        <v-row align="center">
          <v-col cols="12" md="3" class="grow ml-3">
            <span class="text-subtitle-1">
              <strong>Listado de Profesionales</strong></span
            >
          </v-col>
          <v-col cols="12" md="8" class="text-right">
            <v-btn
              class="text-subtitle-1"
              color="#E7E9E9"
              variant="flat"
              elevation="2"
              prepend-icon="mdi-finance"
              @click="showWinner()"
            >
              Ganancias
            </v-btn>
            <v-btn
              class="text-subtitle-1 ml-1"
              color="#E7E9E9"
              variant="flat"
              elevation="2"
              prepend-icon="mdi-clipboard-text"
              @click="chargeData()"
            >
              Reservaciones
            </v-btn>
            <v-btn
              class="text-subtitle-1 ml-1"
              color="#E7E9E9"
              variant="flat"
              elevation="2"
              prepend-icon="mdi-timer"
              @click="showAsist()"
            >
              Asistencias
            </v-btn>
            <v-btn
              class="text-subtitle-1 ml-1"
              color="#E7E9E9"
              variant="flat"
              elevation="2"
              prepend-icon="mdi-plus-circle"
              @click="showAddProfessional()"
            >
              Agregar Profesional
            </v-btn>
            <v-dialog v-model="dialog" max-width="1000px">
              <v-card>
                <v-toolbar color="#F18254">
                  <span class="text-subtitle-2 ml-4"> Profesional</span>
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
                          v-model="editedItem.user"
                          clearable
                          label="Usuario"
                          prepend-icon="mdi-email-outline"
                          variant="underlined"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-if="mostrar"
                          v-model="editedItem.password"
                          clearable
                          label="Contraseña"
                          prepend-icon="mdi-form-textbox-password"
                          variant="underlined"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="4">
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
                      <v-col cols="12" md="4">
                        <v-autocomplete
                          :no-data-text="'No hay datos disponibles'"
                          v-model="editedItem.charge_id"
                          :items="charges"
                          clearable
                          label="Cargo"
                          prepend-icon="mdi-account-tie-outline"
                          item-title="name"
                          item-value="id"
                          variant="underlined"
                          :rules="selectRules"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="editedItem.retention"
                          clearable
                          label="% Impuesto"
                          prepend-icon="mdi-percent"
                          variant="underlined"
                          :rules="pago"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-file-input
                          clearable
                          v-model="file"
                          ref="fileInput"
                          label="Avatar Profesional"
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
                  <span class="text-subtitle-2 ml-4"> Eliminar Profesional</span>
                </v-toolbar>

                <v-card-text class="mt-2 mb-2">
                  ¿Desea eliminar el Profesional seleccionado?</v-card-text
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

            <!--Actualizar contraseña-->
            <v-dialog v-model="showPasswordForm" width="500">
              <v-card>
                <v-toolbar color="#F18254">
                  <span class="text-subtitle-2 ml-4">Cambiar Contraseña</span>
                </v-toolbar>

                <v-card-text class="mt-2 mb-2">
                  <v-form ref="form" v-model="valid" enctype="multipart/form-data">
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="confirmPassword"
                            label="Nueva Contraseña"
                            :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="showConfirmPassword ? 'text' : 'password'"
                            @click:append="showConfirmPassword = !showConfirmPassword"
                            hint="Haz clic en el ícono para mostrar/ocultar la contraseña"
                            variant="underlined"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="confirmNewPassword"
                            label="Confirmar Nueva Contraseña"
                            :append-icon="
                              showConfirmNewPassword ? 'mdi-eye' : 'mdi-eye-off'
                            "
                            :type="showConfirmNewPassword ? 'text' : 'password'"
                            @click:append="
                              showConfirmNewPassword = !showConfirmNewPassword
                            "
                            hint="Haz clic en el ícono para mostrar/ocultar la contraseña"
                            variant="underlined"
                          ></v-text-field>
                          <v-alert
                            v-if="confirmPassword !== confirmNewPassword"
                            type="error"
                          >
                            Las contraseñas no coinciden.
                          </v-alert>
                        </v-col>
                      </v-row>
                    </v-container>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="#E7E9E9" variant="flat" @click="closedialogPas">
                        Cancelar
                      </v-btn>
                      <v-btn
                        color="#F18254"
                        variant="flat"
                        @click="shangePassword"
                        :disabled="confirmPassword !== confirmNewPassword"
                      >
                        Aceptar
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </v-toolbar>
      <v-card-text>
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
          :items-per-page-text="'Elementos por páginas'"
          :search="search"
          :items="results"
          class="elevation-1"
          no-results-text="No hay datos disponibles"
          no-data-text="No hay datos disponibles"
        >
          <template v-slot:item.retention="{ item }">
            {{ item.retention ? item.retention + "%" : "" }}
          </template>
          <template v-slot:item.name="{ item }">
            <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
              <v-img
                :src="'https://api2.simplifies.cl/api/images/' + item.image_url"
                alt="image"
              ></v-img
              ><!--+ '?$' + Date.now()
                -->
            </v-avatar>
            {{ item.name }}
          </template>
          <template v-slot:item.actions="{ item }">
            <!--<v-icon size="25" color="blue" class="me-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon size="25" color="green" class="me-2" @click="changePass(item)">
            mdi-lock-reset
          </v-icon>
          <v-icon size="25" color="red" @click="deleteItem(item)">
            mdi-delete
          </v-icon>-->
            <v-btn
              density="comfortable"
              icon="mdi-pencil"
              @click="editItem(item)"
              color="primary"
              variant="tonal"
              elevation="1"
              class="mr-1 mt-1 mb-1"
              title="Editar Profesional"
            ></v-btn>
            <v-btn
              density="comfortable"
              icon="mdi-calendar-blank"
              @click="showFreeday(item)"
              color="green"
              variant="tonal"
              elevation="1"
              class="mr-1 mt-1 mb-1"
              title="Días libres"
            ></v-btn>
            <v-btn
              density="comfortable"
              icon="mdi-lock-reset"
              @click="changePass(item)"
              color="teal"
              variant="tonal"
              elevation="1"
              class="mr-1 mt-1 mb-1"
              title="Modificar contraseña"
            ></v-btn>
            <v-btn
              density="comfortable"
              icon="mdi-timer-off"
              @click="showLater(item)"
              color="orange"
              variant="tonal"
              elevation="1"
              class="mr-1 mt-1 mb-1"
              title="Legadas tardes por sucursal"
            ></v-btn>
            <!--<v-btn
              density="comfortable"
              icon="mdi-clipboard-text"
              @click="chargeData(item)"
              color="teal"
              variant="tonal"
              elevation="1"
              class="mr-1 mt-1 mb-1"
              title="Ver Reservaciones"
            ></v-btn>-->
            <v-btn
              density="comfortable"
              icon="mdi-delete"
              @click="deleteItem(item)"
              color="red-darken-4"
              variant="tonal"
              elevation="1"
              title="Eliminar Profesional"
            ></v-btn>
          </template>
        </v-data-table>
      </v-card-text>

      <!--Winner-->
      <v-dialog v-model="dialogWinner" fullscreen transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="#F18254">
            <v-row align="center">
              <v-col cols="12" md="8" class="grow ml-4">
                <span class="text-h8">
                  <strong>Monto generado por Profesionales</strong></span
                >
              </v-col>
              <v-spacer></v-spacer>
              <!--<v-col cols="12" md="3">
                <v-btn
                  class="text-subtitle-1 ml-12"
                  color="#E7E9E9"
                  variant="flat"
                  elevation="2"
                  prepend-icon="mdi-file-excel"
                  @click="exportToExcel"
                >
                  Exportar a Excel
                </v-btn>
              </v-col>-->
            </v-row>
          </v-toolbar>
          <v-container>
            <v-row>
              <!-- Primera columna -->
              <v-col cols="12" sm="6" md="3">
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      :modelValue="dateFormatted"
                      variant="outlined"
                      append-inner-icon="mdi-calendar"
                      label="Fecha inicial"
                    ></v-text-field>
                  </template>
                  <v-locale-provider locale="es">
                    <v-date-picker
                      header="Calendario"
                      title="Seleccione la fecha"
                      color="orange lighten-2"
                      :modelValue="input"
                      @update:modelValue="updateDate"
                      format="yyyy-MM-dd"
                      :max="dateFormatted2"
                    ></v-date-picker>
                  </v-locale-provider>
                </v-menu>
              </v-col>
              <!-- Segunda columna -->
              <v-col cols="12" sm="6" md="3">
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      :modelValue="dateFormatted2"
                      variant="outlined"
                      append-inner-icon="mdi-calendar"
                      label="Fecha final"
                    ></v-text-field>
                  </template>
                  <v-locale-provider locale="es">
                    <v-date-picker
                      header="Calendario"
                      title="Seleccione la fecha"
                      color="orange lighten-2"
                      :modelValue="getDate2"
                      @update:modelValue="updateDate1"
                      format="yyyy-MM-dd"
                      :min="dateFormatted"
                    ></v-date-picker>
                  </v-locale-provider>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="12" md="3">
          <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="branch_id" :items="branches" v-if="this.mostrarFila" clearable
            label="Seleccione una Sucursal" prepend-inner-icon="mdi-store" item-title="name" item-value="id"
            variant="outlined"></v-autocomplete><!-- @update:model-value="initialize()">-->
        </v-col>
              <v-col cols="12" md="1">
                <v-btn icon @click="updateDate2" color="#F18254">
                  <v-icon>mdi-magnify</v-icon></v-btn
                >
              </v-col>
              <v-col cols="12">
                <v-alert border type="info" variant="outlined" density="compact">
                  <p v-html="formTitleWin"></p>
                </v-alert>
                <v-card class="mx-auto overflow-visible">
                  <v-card-text>
                    <v-text-field
                      class="mt-1 mb-1"
                      v-model="search2"
                      append-icon="mdi-magnify"
                      label="Buscar"
                      single-line
                      hide-details
                    >
                    </v-text-field>
                    <v-data-table
                      :headers="headers1"
                      :items-per-page-text="'Elementos por páginas'"
                      :items="winner"
                      
                      :search="search2"
                      class="elevation-2"
                      no-results-text="No hay datos disponibles"
                      no-data-text="No hay datos disponibles"
                    ><!--:group-by="groupBy"-->
                      <template
                        v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }"
                      >
                        <tr>
                          <td :colspan="columns.length">
                            <VBtn
                              size="small"
                              variant="text"
                              :icon="isGroupOpen(item) ? '$expand' : '$next'"
                              @click="toggleGroup(item)"
                            ></VBtn>
                            {{ item.value }}
                          </td>
                        </tr>
                      </template>
                      <template v-slot:item.tip="{ item }">
                        <v-chip
                          class="text-uppercase font-weight-bold"
                          size="small"
                          label
                        >
                          {{ formatNumber(item.tip) }}</v-chip
                        >
                      </template>
                      <template v-slot:item.bonus="{ item }">
                        <v-chip
                          class="text-uppercase font-weight-bold"
                          size="small"
                          label
                        >
                          {{ formatNumber(item.bonus) }}</v-chip
                        >
                      </template>
                      <template v-slot:item.amount="{ item }">
                        <v-chip
                          class="text-uppercase font-weight-bold"
                          size="small"
                          label
                        >
                          {{ formatNumber(item.amount) }}</v-chip
                        >
                      </template>
                      <template v-slot:item.amountGenerate="{ item }">
                        <v-chip
                          class="text-uppercase font-weight-bold"
                          size="small"
                          label
                        >
                          {{ formatNumber(item.amountGenerate) }}</v-chip
                        >
                      </template>
                      <template v-slot:item.retention="{ item }">
                        <v-chip
                          class="text-uppercase font-weight-bold"
                          size="small"
                          label
                        >
                          {{ formatNumber(item.retention) }}</v-chip
                        >
                      </template>
                      <template v-slot:item.tip80="{ item }">
                        <v-chip
                          class="text-uppercase font-weight-bold"
                          size="small"
                          label
                        >
                          {{ formatNumber(item.tip80) }}</v-chip
                        >
                      </template>
                      <template v-slot:item.total="{ item }">
                        <v-chip
                          class="text-uppercase font-weight-bold"
                          size="small"
                          label
                        >
                          {{ formatNumber(item.total) }}</v-chip
                        >
                      </template>
                      <template v-slot:item.name="{ item }">
                      <v-avatar class="mr-1" elevation="3" color="grey-lighten-4">
                        <v-img
                          :src="'https://api2.simplifies.cl/api/images/' + item.image_url"
                          alt="image"
                        ></v-img
                        ><!--+ '?$' + Date.now()
                          -->
                      </v-avatar>
                      {{ item.name }}
                    </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="closeWinner"> Volver </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--Laters-->
      <v-dialog v-model="dialogLater" fullscreen transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="#F18254">
            <v-row align="center">
              <v-col cols="12" md="8" class="grow ml-4">
                <span class="text-h8">
                  <strong>Llegadas tardes por sucursal</strong></span
                >
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="12" md="3">
                <v-btn
                  class="text-subtitle-1 ml-12"
                  color="#E7E9E9"
                  variant="flat"
                  elevation="2"
                  prepend-icon="mdi-file-excel"
                  @click="exportToExcel1"
                >
                  Exportar a Excel
                </v-btn>
              </v-col>
            </v-row>
          </v-toolbar>
          <v-container>
            <v-row>
              <!-- Primera columna -->
              <v-col cols="12" sm="6" md="3">
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      :modelValue="dateFormatted"
                      variant="outlined"
                      append-inner-icon="mdi-calendar"
                      label="Fecha inicial"
                    ></v-text-field>
                  </template>
                  <v-locale-provider locale="es">
                    <v-date-picker
                      header="Calendario"
                      title="Seleccione la fecha"
                      color="orange lighten-2"
                      :modelValue="input"
                      @update:modelValue="updateDate"
                      format="yyyy-MM-dd"
                      :max="dateFormatted2"
                    ></v-date-picker>
                  </v-locale-provider>
                </v-menu>
              </v-col>
              <!-- Segunda columna -->
              <v-col cols="12" sm="6" md="3">
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      :modelValue="dateFormatted2"
                      variant="outlined"
                      append-inner-icon="mdi-calendar"
                      label="Fecha final"
                    ></v-text-field>
                  </template>
                  <v-locale-provider locale="es">
                    <v-date-picker
                      header="Calendario"
                      title="Seleccione la fecha"
                      color="orange lighten-2"
                      :modelValue="getDate2"
                      @update:modelValue="updateDate1"
                      format="yyyy-MM-dd"
                      :min="dateFormatted"
                    ></v-date-picker>
                  </v-locale-provider>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="12" md="3">
                <v-autocomplete
                  :no-data-text="'No hay datos disponibles'"
                  v-model="branch_id"
                  :items="branches"
                  v-if="this.mostrarFila"
                  label="Seleccione una Sucursal"
                  prepend-inner-icon="mdi-store"
                  item-title="name"
                  item-value="id"
                  variant="outlined"
                ></v-autocomplete
                ><!--@update:model-value="initialize()"-->
              </v-col>
              <v-col cols="12" md="1">
                <v-btn icon @click="updateDate3" color="#F18254">
                  <v-icon>mdi-magnify</v-icon></v-btn
                >
              </v-col>
              <v-col cols="12">
                <v-alert border type="info" variant="outlined" density="compact">
                  <p v-html="formTitleLater"></p>
                </v-alert>
              </v-col>
            </v-row>
            <v-card-text>
              <v-text-field
                class="mt-1 mb-1"
                v-model="search3"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
              >
              </v-text-field>
              <v-data-table
                :headers="headers2"
                :items-per-page-text="'Elementos por páginas'"
                :items="laters"
                :search="search3"
                class="elevation-2"
                no-results-text="No hay datos disponibles"
                no-data-text="No hay datos disponibles"
              >
              </v-data-table>
            </v-card-text>
          </v-container>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="closeLater"> Volver </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--assistance-->
      <v-dialog v-model="dialogAsist" fullscreen transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-1 ml-4"
              >Asistencias de profesionales por sucursales</span
            >
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-container>
            <v-row>
              <!-- Primera columna -->
              <v-col cols="12" sm="6" md="3">
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      :modelValue="dateFormatted"
                      variant="outlined"
                      append-inner-icon="mdi-calendar"
                      label="Fecha inicial"
                    ></v-text-field>
                  </template>
                  <v-locale-provider locale="es">
                    <v-date-picker
                      header="Calendario"
                      title="Seleccione la fecha"
                      color="orange lighten-2"
                      :modelValue="input"
                      @update:model-value="updateDate"
                      format="yyyy-MM-dd"
                      :max="dateFormatted2"
                    ></v-date-picker>
                  </v-locale-provider>
                </v-menu>
              </v-col>
              <!-- Segunda columna -->
              <v-col cols="12" sm="6" md="3">
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      :modelValue="dateFormatted2"
                      variant="outlined"
                      append-inner-icon="mdi-calendar"
                      label="Fecha final"
                    ></v-text-field>
                  </template>
                  <v-locale-provider locale="es">
                    <v-date-picker
                      header="Calendario"
                      title="Seleccione la fecha"
                      color="orange lighten-2"
                      :modelValue="getDate2"
                      format="yyyy-MM-dd"
                      :min="dateFormatted"
                      @update:model-value="updateDate1"
                    ></v-date-picker
                    ><!--@update:model-value="updateDate2"-->
                  </v-locale-provider>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="12" md="3">
                <v-autocomplete
                  :no-data-text="'No hay datos disponibles'"
                  v-model="branch_id"
                  :items="branches"
                  label="Seleccione una Sucursal"
                  prepend-inner-icon="mdi-store"
                  item-title="name"
                  item-value="id"
                  variant="outlined"
                ></v-autocomplete
                ><!--@update:model-value="onBranchChange"-->
              </v-col>
              <v-col cols="12" md="1">
                <v-btn icon @click="updateDate5" color="#F18254">
                  <v-icon>mdi-magnify</v-icon></v-btn
                >
              </v-col>
              <v-col cols="12" md="12">
                <v-card elevation="2">
                  <v-tabs v-model="tabBar" color="rgb(241, 130, 84)" elevation="6"
                    ><!-- @click="handleTabChange"-->
                    <v-tab value="one">Llegadas tardes por profesional</v-tab>
                    <v-tab value="two">Mejores asistencias por profesional</v-tab>
                  </v-tabs>
                  <v-card-text>
                    <v-window v-model="tabBar">
                      <v-window-item value="one">
                        <v-alert border type="info" variant="outlined" density="compact">
                          <p v-html="formTitleAsist1"></p>
                        </v-alert>
                        <v-card-text>
                          <v-text-field
                            class="mt-1 mb-1"
                            v-model="search5"
                            append-icon="mdi-magnify"
                            label="Buscar"
                            single-line
                            hide-details
                          >
                          </v-text-field>
                          <v-data-table
                            :headers="headers3"
                            :items-per-page-text="'Elementos por páginas'"
                            :items="asistLate"
                            :search="search5"
                            class="elevation-2"
                            no-results-text="No hay datos disponibles"
                            no-data-text="No hay datos disponibles"
                          >
                          </v-data-table>
                        </v-card-text>
                      </v-window-item>

                      <v-window-item value="two">
                        <v-alert border type="info" variant="outlined" density="compact">
                          <p v-html="formTitleAsist2"></p>
                        </v-alert>
                        <v-card-text>
                          <v-text-field
                            class="mt-1 mb-1"
                            v-model="search6"
                            append-icon="mdi-magnify"
                            label="Buscar"
                            single-line
                            hide-details
                          >
                          </v-text-field>
                          <v-data-table
                            :headers="headers4"
                            :items-per-page-text="'Elementos por páginas'"
                            :items="asistTime"
                            :search="search6"
                            class="elevation-2"
                            no-results-text="No hay datos disponibles"
                            no-data-text="No hay datos disponibles"
                          >
                          </v-data-table>
                        </v-card-text>
                      </v-window-item>
                    </v-window>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-spacer></v-spacer>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="#E7E9E9" variant="flat" @click="closeAsist"> Volver </v-btn>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-dialog>

      <!--Freeday-->
      <v-dialog v-model="dialogfreeday" width="700">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-2 ml-4">Días libres</span>
          </v-toolbar>

          <v-card-text class="mt-2 mb-2">
            <v-table density="compact">
              <thead>
                <tr>
                  <th class="text-left">Día</th>
                  <th class="text-left">Laboral</th>
                  <th class="text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(freeday, index) in freedays" :key="index">
                  <td>{{ freeday.nombre }}</td>
                  <td>
                    <v-switch
                      class="mx-0 pa-0"
                      density="compact"
                      inset
                      color="amber-darken-4"
                      v-model="freeday.esLaboral"
                    ></v-switch>
                  </td>
                  <td v-if="freeday.esLaboral">Descanso</td>
                  <td v-else>Laboral</td>
                </tr>
              </tbody>
            </v-table>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="#E7E9E9" variant="flat" @click="closeFreeday">
                Cancelar
              </v-btn>
              <v-btn
                @click="saveFreeday"
                class="text-subtitle-1 ml-1"
                color="#F18254"
                variant="flat"
                elevation="2"
                prepend-icon="mdi-plus-circle"
              >
                Actualizar
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!--Para verificar el email existe-->
      <v-dialog v-model="dialogEmail" @click:outside="closeEmail" max-width="500px">
              <v-card>
                <v-toolbar color="#F18254">
                  <span class="text-subtitle-2 ml-4">Información!!!</span>
                </v-toolbar>

                <v-card-text class="mt-2">
                  <span>Ya existe un cliente con este correo, ¿desea continuar?</span>
                </v-card-text>

                <v-card-text class="d-flex align-center mt-2">
                  <v-avatar class="mr-2">
                    <v-img :src="'https://api2.simplifies.cl/api/images/' + clientImage" alt="Avatar del cliente"></v-img>
                  </v-avatar>
                  <span>{{ clientName }}</span>
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

            <!--ver reservaciones de profesionales-->
            <v-dialog v-model="showReserPrpfessional" fullscreen transition="dialog-bottom-transition">

              <v-card>

          <v-toolbar color="#F18254">
            <v-row align="center">
              <v-col cols="12" md="8" class="grow ml-4">
                <span class="text-h8">
                  <strong>Reservas del profesional</strong></span
                >
              </v-col>
            </v-row>
          </v-toolbar>
          <v-container>
            <v-card-text>
              <v-row>
              
            <v-row>
              
            </v-row>
                <div class="fixed-size-calendar">
    <v-sheet>

    <v-row>
      <v-col cols="12" sm="12" md="3">
                <v-autocomplete
                  :no-data-text="'No hay datos disponibles'"
                  v-model="branch_id"
                  :items="branches"
                  v-if="this.mostrarFila"
                  label="Seleccione una Sucursal"
                  prepend-inner-icon="mdi-store"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  class="ma-2"
                  variant="outlined"
                  @update:model-value="showReservations()"
                ></v-autocomplete
                ><!--@update:model-value="initialize()"-->
              </v-col>
              <v-col cols="12" md="3">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="professional_id" :items="professionals" label="Profesional"
                      prepend-inner-icon="mdi-account-tie-outline" item-title="name" item-value="id" variant="outlined" density="compact" class="ma-2"
                        :rules="selectRules"><!--@update:model-value="showReservationsProfessional()"-->
                      <template v-slot:item="{ props, item }">
                                                    <v-list-item
                                                        v-bind="props"
                                                        :prepend-avatar="'https://api2.simplifies.cl/api/images/'+item.raw.image_url"
                                                        :subtitle="'Cargo: '+item.raw.charge"
                                                        :title="item.raw.name"
                                                    ></v-list-item>
                                                    </template>
                      </v-autocomplete>
                      </v-col>
      <v-col cols="12" md="3">
        <v-select
        v-model="type"
        :items="types"
        class="ma-2"
        label="Modo de vista"
        variant="outlined"
        density="compact"
        hide-details
      ></v-select>
      </v-col>
      <v-col cols="12" md="1" >
                <v-btn :disabled="!this.professional_id" icon @click="showReservationsProfessional()" color="#F18254">
                  <v-icon>mdi-magnify</v-icon></v-btn
                >
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
      <v-calendar
        ref="calendar"
        v-model="value"
        :events="events"
        :view-mode="type"
        :event-color="getEventColor" 
        class="fixed-size-calendar" 
        hide-day-header="false"     
      >
      <template #day-label="{ day }">
          {{ dayLabels[day] }}
        </template>
        <template #month-label="{ month }">
          {{ monthLabels[month] }}
        </template>
        <template #weekday-label="{ weekday }">
          {{ dayLabels[weekday] }}
        </template>
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
    </v-card>
  </v-container>
</template>
<script>
import axios from "axios";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import LocalStorageService from "@/LocalStorageService";
import { VCalendar } from 'vuetify/labs/VCalendar'



export default {
  components: {
    VCalendar,
  },

  data: () => ({
    type: 'month',
    types: [
      { title: 'Mes', value: 'month' },
      { title: 'Semana', value: 'week' },
      { title: 'Día', value: 'day' }
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
        'grey darken-1',
        'indigo',
        'deep-purple',
        'cyan',
        
      ],
    // aqui va lo del calendar
    tabBar: null,
    valid: true,
    snackbar: false,
    sb_type: "",
    sb_message: "",
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    mostrar: true,
    search: "",
    search3: "",
    dialog: false,
    editando: false,
    message_delete: true,
    dialogDelete: false,
    dialogEmail: false,
    showPasswordForm: false,
    showReserPrpfessional: false,
    branches: [],
    business_id: "",
    professional_id: "",
    branch_id: "",
    mostrarFila: false,
    selectedProfessional: [],
    headers: [
      { title: "Nombre y Apellidos", key: "name" },
      //{ title: 'Primer Apellido', key: 'surname' },
      //{ title: 'Segundo Apellido', key: 'second_surname' },
      { title: "Correo", key: "email" },
      { title: "Teléfono", key: "phone" },
      { title: "Usuario", align: "start", value: "user", width: "40px" },
      { title: "Cargo", align: "start", value: "charge", width: "100px" },
      { title: "Impuesto", key: "retention", width: "30px" },
      { title: "Acciones", key: "actions", sortable: false },
    ],
    results: [],
    users: [],
    charges: [],
    editedIndex: -1,
    editedIndexWin: -1,
    editedIndexLater: -1,
    editedIndexAsist1: -1,
    editedIndexAsist2: -1,
    file: null,
    imgMiniatura: "",
    options: [
      {
        name: "Si",
        id: 1,
      },
      {
        name: "No",
        id: 0,
      },
    ],
    editedItem: {
      name: "",
      surname: "",
      user: "",
      userName: "",
      retention: "",
      password: "",
      second_surname: "",
      email: "",
      phone: '+569',
      user_id: "",
      charge_id: "",
      image_url: "",
      state: "",
      id: "",
    },
    data: {},

    defaultItem: {
      name: "",
      password: "",
      user: "",
      surname: "",
      second_surname: "",
      email: "",
      phone: '+569',
      retention: "",
      user_id: "",
      charge_id: "",
      image_url: "",
      state: "",
    },
    confirmPassword: "",
    showConfirmPassword: false,
    confirmNewPassword: "",
    showConfirmNewPassword: false,
    //winner
    winner: [],
    fecha: "",
    menu: false,
    menu2: false,
    input: null,
    input2: null,
    search2: "",
    dialogWinner: false,
    headers1: [
      { title: "Profesional", key: "name", sortable: false },
      //{ title: "Sucursal", key: "branchName", sortable: false },
      { title: "Total Servicios", key: "amountGenerate", sortable: true },
      { title: "Ganancia del barbero", key: "amount", sortable: true },
      { title: "Retención", key: "retention", sortable: true },
      { title: "Propina", key: "tip", sortable: true },
      { title: "Propina 80%", key: "tip80", sortable: true },
      { title: "Bonos", key: "bonus", sortable: true },
      { title: "Clientes atendidos", key: "total_cars", sortable: true },
      { title: "Total", key: "total", sortable: true },
    ],
    /*groupBy: [
      {
        key: "name",
      },
    ],*/
    //laters
    dialogLater: false,
    laters: [],
    charge: "",
    headers2: [
      /*{ title: 'Profesional', key: 'name', sortable: false },
      { title: 'Monto', key: 'amount', sortable: false },*/
      { title: "Hora de entrada", key: "start_time", sortable: false },
      { title: "Hora de salida", key: "end_time", sortable: false },
    ],

    //Asistance
    dialogAsist: false,
    asistLate: [],
    asistTime: [],

    typeUser: '',
    userId: '',
    clientName: '',
    clientImage: '',

    headers3: [
      { title: "Profesional", key: "name", sortable: false },
      { title: "Cargo", key: "charge", sortable: false },
      { title: "Cantidad", key: "cant", sortable: false },
    ],
    headers4: [
      { title: "Profesional", key: "name", sortable: false },
      { title: "Cargo", key: "charge", sortable: false },
      { title: "Cantidad", key: "cant", sortable: false },
    ],
    search5: "",
    search6: "",
    //freeday
    dialogfreeday: false,
    freedays: [],

    reservations: [],
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) || "El campo debe tener al menos de 3 caracteres",
    ],
    emailRules: [
      (v) => !!v || "El Correo Electrónico es requerido",
      (v) => /.+@.+\..+/.test(v) || "El Correo Electrónico no es válido",
    ],
    mobileRules: [
      v => !!v || 'El número de móvil es requerido',
      v => /^\+569\d{8}$/.test(v) || 'Formato de número móvil inválido. Ejemplo: +56912345678'
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    pago: [(value) => /^\d+(\.\d+)?$/.test(value) || "Debe ser un número con punto decimal (10.00)",          
      (value) => !isNaN(parseFloat(value)) || "Debe ser un número"],
  }),

  computed: {
    imgedit() {
      return this.imgMiniatura;
    },
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Profesional" : "Editar Profesional";
    },
    formTitleWin() {
      if (this.editedIndexWin === 2) {
        const startDate = this.input
          ? format(this.input, "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd");
        const endDate = this.input2
          ? format(this.input2, "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd");
        return `Monto generado por Profesionales en el período [<strong>${startDate}</strong> - <strong>${endDate}</strong>]`;
      } else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fecha = format(new Date(), "yyyy-MM-dd");
        return `Monto generado por Profesionales el en día  <strong>${this.fecha}</strong>`;
      }
    },
    formTitleLater() {
      if (this.editedIndexLater === 2) {
        const startDate = this.input
          ? format(this.input, "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd");
        const endDate = this.input2
          ? format(this.input2, "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd");
        return `Llegadas tardes en el período [<strong>${startDate}</strong> - <strong>${endDate}</strong>]`;
      } else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fecha = format(new Date(), "yyyy-MM-dd");
        return `Legada tarde en el día  <strong>${this.fecha}</strong>`;
      }
    },
    formTitleAsist1() {
      if (this.editedIndexAsist1 === 2) {
        const startDate = this.input
          ? format(this.input, "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd");
        const endDate = this.input2
          ? format(this.input2, "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd");
        return `Llegadas tardes en el período [<strong>${startDate}</strong> - <strong>${endDate}</strong>]`;
      } else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fecha = format(new Date(), "yyyy-MM-dd");
        return `Llegada tarde en el día  <strong>${this.fecha}</strong>`;
      }
    },
    formTitleAsist2() {
      if (this.editedIndexAsist1 == 2) {
        const startDate = this.input3
          ? format(this.input3, "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd");
        const endDate = this.input4
          ? format(this.input4, "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd");
        return `Profesionales con mejor asistencia en el período [<strong>${startDate}</strong> - <strong>${endDate}</strong>]`;
      } else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fecha = format(new Date(), "yyyy-MM-dd");
        return `Profesionales con mejor asistencia en el día  <strong>${this.fecha}</strong>`;
      }
    },
    dateFormatted() {
      const date = this.input ? new Date(this.input) : new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    dateFormatted2() {
      const date = this.input2 ? new Date(this.input2) : new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
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
    }
  },

  mounted() {
    this.branch_id = parseInt(LocalStorageService.getItem("branch_id"));
    this.business_id = parseInt(LocalStorageService.getItem("business_id"));
    this.charge = JSON.parse(LocalStorageService.getItem("charge"));
    axios
      .get("https://api2.simplifies.cl/api/charge-web", {
        params: {
          business_id: this.business_id,
        },
      })
      .then((response) => {
        this.branches = response.data.branches;
        this.charges = response.data.charges;
        //this.branch_id = this.branches[0].id;
      })
      .finally(() => {
        if (this.charge === "Administrador") {
          this.branch_id = this.branches[0].id;
          this.mostrarFila = true;
        }
        this.initialize();
      });
  },

  methods: {
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
      closeCalendar(){
        this.editedItem = Object.assign({}, this.defaultItem);
        this.reservations = [];
        this.events = [];
        this.showReserPrpfessional = false;
      },
    // aqui lo del calendario
    handleEmailChange() {
      axios
        .get("https://api2.simplifies.cl/api/professional-email", {
          params: {
            email: this.editedItem.email
          },
        })
        .then((response) => {
          this.userId = response.data.user;
          this.clientName = response.data.clientName;
          this.clientImage = response.data.clientImage;
          this.typeUser = response.data.type;
        })
        .finally(() => {
          if(this.typeUser === 'Client'){
            this.dialogEmail = true;
            //this.showAlert("success", "Este correo ya esta asignado a un cliente", 3000);
          }
          if(this.typeUser === 'Professional'){
            this.dialogEmail = false;
            this.showAlert("warning", "Ya existe un professional con este correo", 3000);
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
    shangePassword() {
      console.log(this.editedItem.user_id);
      axios
        .get("https://api2.simplifies.cl/api/change_password", {
          params: {
            id: this.editedItem.user_id,
            password: this.confirmPassword,
          },
        })
        .then((response) => {
          console.log(response);
          this.showAlert("success", "Contraseña modificada correctamente", 3000);
          this.confirmPassword = "";
          this.confirmNewPassword = "";
          this.showPasswordForm = false;
        });
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
      axios.get("https://api2.simplifies.cl/api/professional").then((response) => {
        this.results = response.data.professionals;
      });
    },
    showAddProfessional() {
      this.dialog = true;
      this.mostrar = true;
      this.editedItem = Object.assign({}, this.defaultItem);
    },
    onFileSelected(event) {
      let file = event.target.files[0];
      this.editedItem.image_url = file;
      console.log(this.editedItem.image_url);
      this.cargarImage(file);
    },
    cargarImage(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imgMiniatura = e.target.result;
      };
      reader.readAsDataURL(file);
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
    editItem(item) {
      this.file = null;
      var img = new Image();
      img.src = "https://api2.simplifies.cl/api/images/" + item.image_url;
      img.onload = () => {
        this.imgMiniatura = "https://api2.simplifies.cl/api/images/" + item.image_url;
      };
      img.onerror = () => {
        this.imgMiniatura = "";
      };
      this.editedIndex = 1;
      this.editedItem = Object.assign({}, item);
      this.editedItem.charge_id = parseInt(item.charge_id);
      this.dialog = true;
      this.editando = true;
      this.mostrar = false;
    },
    changePass(item) {
      this.editedItem = Object.assign({}, item);
      console.log("this.editedItem");
      console.log(this.editedItem);
      this.showPasswordForm = true;
    },
    chargeData(item) {//aqui cargo el componente del calendar

      this.editedItem = Object.assign({}, item);      
      this.showReserPrpfessional = true;      
      this.showReservations();
    },
    showReservations() {//aqui cargo el componente del calendar
      this.professional_id = '';
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
        });
      },
      showReservationsProfessional() {//aqui cargo el componente del calendar
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
      axios
        .get("https://api2.simplifies.cl/api/professional-reservations-periodo", {
          params: {
            branch_id: this.branch_id,
            professional_id: this.professional_id,
            startDate: startDate,
            endDate: endDate
          },
        })
        .then((response) => {
          this.reservations = response.data.reservaciones;
        })
        .finally(() => {
          this.events = [];
          this.reservations.forEach(reservacion => {
        this.events.push({
          title: reservacion.clientName,
          start: new Date(reservacion.startDate),
          end: new Date(reservacion.endDate),
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          allDay: false
        });
      });
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
        id: this.editedItem.id,
      };
      axios.post("https://api2.simplifies.cl/api/professional-destroy", request).then(() => {
        this.initialize();
        this.message_delete = true;
        this.showAlert("success", "Profesional eliminado correctamente", 3000);
      });
      this.closeDelete();
    },
    close() {
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.imgMiniatura = "";
        this.file = null;
        this.dialog = false;
      });
    },
    closedialogPas() {
      this.showPasswordForm = false;
      this.professional_id = '';
      this.$nextTick(() => {
        this.password = "";
        this.password_new = "";
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
      if (this.editedIndex > -1) {
        this.valid = false;
        /*this.data.id = this.editedItem.id;
        this.data.name = this.editedItem.name;
        this.data.surname = this.editedItem.surname;
        this.data.second_surname = this.editedItem.second_surname;
        this.data.email = this.editedItem.email;
        this.data.phone = this.editedItem.phone;
        this.data.user_id = this.editedItem.user_id;
        this.data.charge_id = this.editedItem.charge_id;
        this.data.state = this.editedItem.state;*/
        const formData = new FormData();
        for (let key in this.editedItem) {
          formData.append(key, this.editedItem[key]);
        }
        axios
          .post("https://api2.simplifies.cl/api/professional-update", formData)
          .then(() => {
            this.initialize();
            this.showAlert("success", "Profesional editado correctamente", 3000);
            this.mostrar = true;
            this.imgMiniatura = "";
            this.file = null;
          })
          .catch((error) => {
            if (error.response.status === 400)
              this.showAlert("warning", "Usuario ya existe", 3000);
              else if (error.response.status === 401)
              this.showAlert("warning", "Correo ya existe", 3000);
          });
      } else {
        this.valid = false;
        /*this.data.name = this.editedItem.name;
        this.data.name = this.editedItem.name;
        this.data.surname = this.editedItem.surname;
        this.data.second_surname = this.editedItem.second_surname;
        this.data.email = this.editedItem.email;
        this.data.phone = this.editedItem.phone;        
        this.data.user_id = this.editedItem.user_id;        
        this.data.charge_id = this.editedItem.charge_id;
        this.data.state = this.editedItem.state;*/
        const formData = new FormData();
        for (let key in this.editedItem) {
          formData.append(key, this.editedItem[key]);
        }
        axios
          .post("https://api2.simplifies.cl/api/register_professional", formData)
          .then(() => {
            this.initialize();
            this.showAlert("success", "Profesional registrado correctamente", 3000);
            this.imgMiniatura = "";
            this.file = null;
          })
          .catch((error) => {
            console.log(error.response);
            if (error.response.status === 400){
              this.showAlert("warning", "Usuario ya existe", 3000);
            }else if (error.response.status === 401) {
              this.showAlert("warning", "Correo ya existe", 3000);
            }
          });
          
      }
      this.close();
    },
    //winner
    showWinner() {
      this.editedIndexWin = -1;
      axios
        .get("https://api2.simplifies.cl/api/branch_professionals_winner", {
          params: {
            branch_id: this.branch_id
          },
        })
        .then((response) => {
          this.winner = response.data;
        })
        .finally(() => {
          this.dialogWinner = true;
        });
    },
    closeWinner() {
      this.dialogWinner = false;
    },
    /*formatNumber(value) {
      return value.toLocaleString("es-ES");
    },*/
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
    exportToExcel() {
      // Primero, prepara una matriz que contendrá todas las filas de datos, incluidos los encabezados
      let rows = [];

      // Construye un objeto para los encabezados basado en la estructura de 'headers'
      let headerRow = {};
      this.headers1.forEach((header) => {
        headerRow[header.key] = header.title; // Usa 'key' para el mapeo y 'title' para el texto del encabezado
      });
      rows.push(headerRow);

      // Ahora, mapea los datos de los items para que coincidan con los encabezados
      this.winner.forEach((item) => {
        let rowData = {};
        this.headers1.forEach((header) => {
          rowData[header.key] = item[header.key] || ""; // Asegura que cada celda se mapee correctamente; usa '' para datos faltantes
        });
        rows.push(rowData);
      });

      let nameReport = {
        // eslint-disable-next-line vue/no-use-computed-property-like-method
        branchName: this.formTitleWin, // Asume que 'name' es una de tus claves; ajusta según sea necesario
        amount: "",
        retention: "",
        tip: "", // Deja vacíos los demás campos para esta fila especial
        tip80: "", // Deja vacíos los demás campos para esta fila especial
        total_cars: "", // Usa 'total' para mostrar la fecha; ajusta las claves según corresponda a tu estructura
        total: "", // Usa 'total' para mostrar la fecha; ajusta las claves según corresponda a tu estructura
      };
      rows.push(nameReport);

      // Convierte la matriz de filas en una hoja de trabajo Excel
      const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true }); // 'skipHeader: true' porque ya agregamos manualmente los encabezados

      // Crea un nuevo libro de trabajo y añade la hoja de trabajo con los datos
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report" + this.fecha);

      // Escribe el libro de trabajo a un archivo y desencadena la descarga
      //XLSX.writeFile(wb, "report.xlsx");
      XLSX.writeFile(
        wb,
        `report_${new Date().toLocaleDateString().replace(/\//g, "-")}.xlsx`
      );
    },
    updateDate(val) {
      this.input = val;
      this.menu = false;
    },
    updateDate1(val) {
      this.input2 = val;
      this.menu2 = false;
    },
    updateDate2() {
      //this.input2 = val;
      this.editedIndexWin = 2;
      const startDate = this.input
        ? format(this.input, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd");
      const endDate = this.input2
        ? format(this.input2, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd");
      axios
        .get("https://api2.simplifies.cl/api/branch_professionals_winner", {
          params: {
            startDate: startDate,
            endDate: endDate,
            branch_id: this.branch_id
          },
        })
        .then((response) => {
          this.winner = response.data;
        });
    },
    //later
    showLater(item) {
      this.professional_id = item.id;
      this.editedIndexLater = -1;
      this.dialogLater = true;
      /*axios
      .get('https://api2.simplifies.cl/api/show-business', {
        params: {
          business_id: this.business_id
        }
      })
        .then((response) => {
          this.branches = response.data.branches;
          //this.branch_id = this.branches[0].id;
        })
        .finally(() => {
          if (this.charge === 'Administrador') {
          this.branch_id = this.branches[0].id;
          this.mostrarFila = true;
        }
        });*/
    },
    closeLater() {
      this.dialogLater = false;
    },
    updateDate3() {
      //this.input2 = val;
      this.editedIndexLater = 2;
      const startDate = this.input
        ? format(this.input, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd");
      const endDate = this.input2
        ? format(this.input2, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd");
      axios
        .get("https://api2.simplifies.cl/api/arriving-late-professional-periodo", {
          params: {
            branch_id: this.branch_id,
            professional_id: this.professional_id,
            startDate: startDate,
            endDate: endDate,
          },
        })
        .then((response) => {
          this.laters = response.data;
        });
    },
    exportToExcel1() {
      // Primero, prepara una matriz que contendrá todas las filas de datos, incluidos los encabezados
      let rows = [];

      // Construye un objeto para los encabezados basado en la estructura de 'headers'
      let headerRow = {};
      this.headers2.forEach((header) => {
        headerRow[header.key] = header.title; // Usa 'key' para el mapeo y 'title' para el texto del encabezado
      });
      rows.push(headerRow);

      // Ahora, mapea los datos de los items para que coincidan con los encabezados
      this.laters.forEach((item) => {
        let rowData = {};
        this.headers2.forEach((header) => {
          rowData[header.key] = item[header.key] || ""; // Asegura que cada celda se mapee correctamente; usa '' para datos faltantes
        });
        rows.push(rowData);
      });

      let nameReport = {
        // eslint-disable-next-line vue/no-use-computed-property-like-method
        name: this.formTitleLater, // Asume que 'name' es una de tus claves; ajusta según sea necesario
        start_time: "",
        end_time: "", //, // Deja vacíos los demás campos para esta fila especial
        //total: '' // Usa 'total' para mostrar la fecha; ajusta las claves según corresponda a tu estructura
      };
      rows.push(nameReport);

      // Convierte la matriz de filas en una hoja de trabajo Excel
      const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true }); // 'skipHeader: true' porque ya agregamos manualmente los encabezados

      // Crea un nuevo libro de trabajo y añade la hoja de trabajo con los datos
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report" + this.fecha);

      // Escribe el libro de trabajo a un archivo y desencadena la descarga
      //XLSX.writeFile(wb, "report.xlsx");
      XLSX.writeFile(
        wb,
        `report_${new Date().toLocaleDateString().replace(/\//g, "-")}.xlsx`
      );
    },

    //asistencias
    showAsist() {
      this.editedIndexAsist1 = -1;
      this.editedIndexAsist2 = -1;
      axios
        .get("https://api2.simplifies.cl/api/branch_professionals_winner", {
          params: {
            branch_id: this.branch_id,
          },
        })
        .then((response) => {
          this.asistTime = response.data.tiempo;
          this.asistLate = response.data.tardes;
        })
        .finally(() => {
          this.dialogAsist = true;
        });
    },
    closeAsist() {
      this.dialogAsist = false;
    },
    updateDate5() {
      console.log("Entra aqui a mejores aisitencias del periodo");
      //this.input2 = val;
      this.editedIndexAsist1 = 2;
      this.editedIndexAsist2 = 2;
      const startDate = this.input
        ? format(this.input, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd");
      const endDate = this.input2
        ? format(this.input2, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd");
      console.log(startDate);
      console.log(endDate);
      axios
        .get("https://api2.simplifies.cl/api/arriving-branch-periodo", {
          params: {
            branch_id: this.branch_id,
            startDate: startDate,
            endDate: endDate,
          },
        })
        .then((response) => {
          this.asistTime = response.data.tiempo;
          this.asistLate = response.data.tardes;
        });
      //this.menu2 = false;
    },

    //dias libres
    showFreeday(item) {
      this.selectedProfessional = item;
      this.professional_id = item.id;
      axios
        .get("https://api2.simplifies.cl/api/restday-show", {
          params: {
            professional_id: this.professional_id,
          },
        })
        .then((response) => {
          this.freedays = response.data.Schedules
          console.log('this.freedays dias de descanso');
          console.log(this.freedays);
        })
        .finally(() => {
          this.freedays = this.freedays.map((schedule) => ({
            nombre: schedule.day,
            esLaboral: parseInt(schedule.state) !== 0,
          }));          
      this.dialogfreeday = true;
        });
    },
    closeFreeday() {
      this.freedays = [];
      this.selectedProfessional = [];
      this.dialogfreeday = false;
    },
    saveFreeday() {
      //const start_time;
      //const closing_time;

      const updatedData = this.freedays.map((dia) => {
        const state = dia.esLaboral;
        return {
          day: dia.nombre,
          state: state ? 1 : 0,
        };
      });
      let request = {
        professional_id: this.professional_id,
        schedule: updatedData,
      };
      /*const updatedData = this.dias.map(dia => ({
                day: dia.nombre,
                start_time: dia.entradaHora + ':' + dia.entradaMinuto,
                closing_time: dia.salidaHora + ':' + dia.salidaMinuto,
            }));*/
      console.log("request");
      console.log(request);
      axios
        .put("https://api2.simplifies.cl/api/restday", request)
        .then(() => {
          this.showAlert("success", "Días de descanso actualizado correctamente", 3000);
        })
        .catch((error) => {
          // Maneja cualquier error que ocurra al enviar los datos al servidor
          this.showAlert("warning", "Error interno del sistema", 3000);
        })
        .finally(() => {
          this.showFreeday(this.selectedProfessional);
        });
    },
  },
};
</script>

<style>
.my-select .v-select__slot,
.my-select .v-input__control {
  min-height: auto;
  /* Ajusta el tamaño mínimo según necesites */
  padding: 4px;
  /* Ajusta el padding para reducir espacio */
}

.my-select .v-select__selections {
  font-size: 0.875rem;
  /* Reduce el tamaño de la fuente */
}

.my-switch .v-input--selection-controls__input {
  margin: 0;
  /* Ajusta el margen del switch si es necesario */
}
.custom-calendar .vc-day {
    /* Aplica estilos para controlar el tamaño de los días */
    font-size: 14px; /* Tamaño de fuente */
    padding: 8px; /* Espaciado interno */
}
.fixed-size-calendar {
  min-height:100%;  /* Ajustar según sea necesario */
  min-width: 100%;   /* Ajustar según sea necesario */
  width: 100%;       /* O establecer un ancho fijo */     /* O establecer un ancho fijo */
}
</style>
