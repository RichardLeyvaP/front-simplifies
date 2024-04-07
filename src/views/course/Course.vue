<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
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
    <v-card elevation="6">
      <v-toolbar color="#F18254">
        <v-row align="center">
          <v-col cols="12" md="4" class="grow ml-4">
            <span class="text-subtitle-1"> <strong>Listado de Cursos</strong></span>
          </v-col>
          <v-col cols="12" md="5" class="mr-12"></v-col>
          <v-col cols="12" md="2">

            <v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen>
              <template v-slot:activator="{ props }">

                <v-btn v-bind="props" class="text-subtitle-1 " color="#E7E9E9" variant="flat" elevation="2"
                  prepend-icon="mdi-plus-circle">
                  Agregar Curso
                </v-btn>

              </template>
              <v-card>
                <v-toolbar color="#F18254">
                  <span class="text-subtitle-2 ml-4"> {{formTitle}}</span>
                </v-toolbar>
                <v-card-text>
                  <v-form v-model="valid" enctype="multipart/form-data">
                    <v-row>
                      <v-col cols="12" md="12">
                        <v-autocomplete clearable v-model="editedItem.enrollment_id" :items="enrollments"
                          label="Academia" prepend-icon="mdi-school-outline" item-title="name" item-value="id"
                          variant="underlined" :rules="selectRules"></v-autocomplete>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.name" clearable label="Nombre"
                          prepend-icon="mdi-account-tie-outline" variant="underlined" :rules="nameRules">
                        </v-text-field>

                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.description" clearable label="Descripción"
                          prepend-icon="mdi-text-box-outline" variant="underlined" :rules="nameRules">
                        </v-text-field>

                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field v-model="editedItem.price" clearable label="Precio Total"
                          prepend-icon="mdi-currency-usd" variant="underlined" :rules="priceRules">
                        </v-text-field>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field v-model="editedItem.reservation_price" clearable label="Precio Matrícula"
                          prepend-icon="mdi-currency-usd" variant="underlined" :rules="priceRules">
                        </v-text-field>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field v-model="editedItem.duration" clearable label="Duración (Hrs)"
                          prepend-icon="mdi-clock" variant="underlined" :rules="priceRules">
                        </v-text-field>
                      </v-col>


                      <v-col cols="12" md="4">
                        <v-text-field v-model="editedItem.total_enrollment" clearable label="Matrícula Total"
                          prepend-icon="mdi-format-list-numbered" variant="underlined" :rules="priceRules">
                        </v-text-field>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field v-model="editedItem.available_slots" clearable label="Cupos Disponibles"
                          prepend-icon="mdi-counter" variant="underlined" :rules="priceRules">
                        </v-text-field>
                      </v-col>



                      <v-col cols="12" md="4">
                        <v-text-field v-model="editedItem.practical_percentage" clearable label="% Práctico"
                          prepend-icon="mdi-file-percent" variant="underlined" :rules="priceRules">
                        </v-text-field>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field v-model="editedItem.theoretical_percentage" clearable label="% Teórico"
                          prepend-icon="mdi-file-percent-outline" variant="underlined" :rules="priceRules">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-menu v-model="menu1" :close-on-content-click="false" :nudge-right="40"
                          transition="scale-transition" offset-y min-width="290px">
                          <template v-slot:activator="{ props }">
                            <v-text-field v-bind="props" v-model="formattedStartDate" variant="underlined"
                              prepend-icon="mdi-calendar" label="Fecha inicial"></v-text-field>
                          </template>
                          <v-locale-provider locale="es">
                            <v-date-picker color="orange lighten-2" @input="menu1" v-model=editedItem.startDate  header="Calendario" title="Seleccione la fecha"></v-date-picker>
                          </v-locale-provider>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                          transition="scale-transition" offset-y min-width="290px">
                          <template v-slot:activator="{ props }">
                            <v-text-field v-bind="props" v-model="formattedEndDate" variant="underlined"
                              prepend-icon="mdi-calendar" label="Fecha final"></v-text-field>
                          </template>
                          <v-locale-provider locale="es">
                            <v-date-picker color="orange lighten-2" @input="menu" v-model=editedItem.endDate  header="Calendario" title="Seleccione la fecha" ></v-date-picker>
                          </v-locale-provider>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-file-input clearable v-model="file" ref="fileInput" label="Imagen del Curso"
                          variant="underlined" density="compact" name="file" accept=".png, .jpg, .jpeg"
                          @change="onFileSelected">
                        </v-file-input>
                        <v-avatar elevation="3" color="grey-lighten-4" size="large">
                          <img v-if="imagenDisponible()" :src="imgedit" height="70" width="70">
                        </v-avatar>
                      </v-col>
                    </v-row>
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

            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-toolbar color="red">
                  <span class="text-subtitle-2 ml-4"> Eliminar Curso</span>
                </v-toolbar>

                <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el Curso seleccionado?</v-card-text>
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
        <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar"
                                single-line hide-details>
                            </v-text-field>
        <v-data-table :headers="headers" :items="results" :search="search" class="elevation-1" no-data-text="No hay datos disponibles"
          no-results-text="No hay datos disponibles">
          <template v-slot:top>

            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
          </template>
          <template v-slot:item.name="{ item }">

            <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
              <v-img :src="'http://127.0.0.1:8000/api/images/' + item.course_image" alt="image"></v-img>
            </v-avatar>
            {{ item.name }}
          </template>
          <template v-slot:item.actions="{ item }">
            <!--<v-icon size="25" color="blue" class="me-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon size="25" color="green" @click="showStudents(item)">
              mdi-account-school
            </v-icon>
            <v-icon size="25" color="red" @click="deleteItem(item)">
              mdi-delete
            </v-icon>-->
            <v-btn density="comfortable" icon="mdi-pencil"  @click="editItem(item)" color="primary" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Editar Curso"></v-btn>
            <v-btn density="comfortable" icon="mdi-account-school"  @click="showStudents(item)" color="green" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Estudiantes inscritos"></v-btn>
            <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-storefront" @click="showProducts(item)" color="orange-darken-1" variant="tonal"
            elevation="1" title="Vender productos a estudiantes"></v-btn>
          <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar Curso"></v-btn>
          </template>
        </v-data-table>



        <!--TODO-->
        <v-dialog v-model="dialogUpdateS" max-width="700px">
          <v-card>
            <v-toolbar color="#F18254">
              <span class="text-subtitle-2 ml-4">Actualizar Datos {{formTitle}}</span>
            </v-toolbar>
            <v-card-text>
              <v-form v-model="valid" enctype="multipart/form-data">
                <v-row>



                  <v-col cols="12" md="6">

                    <v-switch v-model="editedItemS.enrollment_confirmed" label="Confirmar Matrícula"
                      color="amber-darken-1" false-value="0" true-value="1" hide-details></v-switch>

                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="editedItemS.reservation_payment" clearable label="Pago de Reservación "
                      prepend-icon="mdi-currency-usd" variant="underlined" :rules="pago">
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field v-model="editedItemS.total_payment" clearable label="Pago Total"
                      prepend-icon="mdi-currency-usd" variant="underlined" :rules="nameRules">
                    </v-text-field>
                  </v-col>


                  <v-col cols="12" md="12">
                    <v-file-input clearable v-model="editedItemS.image_url" ref="fileInput"
                      label="Captura de Transferencia" variant="underlined" density="compact" name="file"
                      accept=".png, .jpg, .jpeg" @change="onFileSelected">
                    </v-file-input>
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                      <img v-if="imagenDisponible()" :src="imgedit" height="120" width="120">
                    </v-card>


                  </v-col>
                </v-row><br>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn color="#E7E9E9" variant="flat" @click="closeUpdateS">
                    Cancelar
                  </v-btn>
                  <v-btn color="#F18254" variant="flat" @click="saveStatus" :disabled="!valid">
                    Aceptar
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>

        <!--Students-->
        <v-dialog v-model="dialogStudents" fullscreen transition="dialog-bottom-transition">
          <v-card>
            <v-toolbar color="#F18254">
              <span class="text-h6 ml-6"> Estudiantes del Curso</span>
              <v-spacer></v-spacer>
              <v-btn color="#E7E9E9" variant="flat" @click="this.dialogAddStudent = true">
                Agregar Estudiante
              </v-btn>
            </v-toolbar>

            <v-card-text class="mt-2 mb-2">

              <v-text-field class="mt-1 mb-1" v-model="search2" append-icon="mdi-magnify" label="Buscar" single-line
                hide-details></v-text-field>

              <v-data-table :headers="headers2" :items="courseStudents" :search="search2" class="elevation-1">

                <template v-slot:item.name="{ item }">
                  <v-avatar elevation="3" color="grey-lighten-4" size="large">
                    <v-img :src="'http://127.0.0.1:8000/api/images/' + item.student_image" alt="image"></v-img>
                  </v-avatar>
                  {{ item.name + ' ' + item.surname + ' ' + item.second_surname }}
                </template>

                <template v-slot:item.image_url="{ item }">
            <!-- Verifica si image_url cumple las condiciones -->
            <!--<v-icon color="green" v-if="item.image_url && item.image_url !== 'image/default.png'" @click="openModal(item.image_url)">
              mdi-eye
            </v-icon>-->
              <v-btn density="comfortable" icon="mdi-eye" color="green" v-if="item.image_url && item.image_url !== 'image/default.png'" @click="openModal(item.image_url)" variant="tonal"
                  elevation="1" class="mr-1 mt-1 mb-1" title="Ver detalles"></v-btn>
            </template>

                <template v-slot:item.enrollment_confirmed="{ item }">
                  <div class="text-end">
                    <v-chip :color="item.enrollment_confirmed == 1 ? 'green' : 'red'"
                      :text="item.enrollment_confirmed == 1 ? 'SI' : 'NO'" class="text-uppercase" size="small"
                      label></v-chip>
                  </div>
                </template>

                <template v-slot:item.actions="{ item }">
                 <!--<v-icon size="25" color="primary" @click="editS(item)">
                    mdi-pencil
                  </v-icon>
                  <v-icon size="25" color="red" @click="deleteS(item)">
                    mdi-delete
                  </v-icon>-->
                  <v-btn density="comfortable" icon="mdi-pencil"  @click="editS(item)" color="primary" variant="tonal"
                  elevation="1" class="mr-1 mt-1 mb-1" title="Editar Asignación"></v-btn>
                <v-btn density="comfortable" icon="mdi-delete" @click="deleteS(item)" color="red-darken-4" variant="tonal"
                  elevation="1" title="Eliminar asignación"></v-btn>
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
        <v-dialog v-model="dialogAddStudent" width="500">
          <v-card>
            <v-toolbar color="#F18254">
              <span class="text-subtitle-2 ml-4">Matricular Estudiante</span>
            </v-toolbar>
            <v-card-text class="mt-2 mb-2">
              <v-form ref="form" v-model="valid" enctype="multipart/form-data">
                <v-container>
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-autocomplete v-model="editedStudent.student_id" :items="students" label="Estudiante"
                        prepend-icon="mdi-account-tie-outline" item-title="name" item-value="id" variant="underlined"
                        :rules="selectRules"></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-container>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="#E7E9E9" variant="flat" @click="closeS">
                    Cancelar
                  </v-btn>
                  <v-btn color="#F18254" variant="flat" @click="saveS" :disabled="!valid">
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
              <span class="text-subtitle-2 ml-4"> Eliminar Estudisante del curso</span>
            </v-toolbar>

            <v-card-text class="mt-2 mb-2"> ¿Desea eliminar este cliente del curso?</v-card-text>
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

      </v-card-text>
    </v-card>
      <!-- Modal para mostrar la imagen -->
      <v-dialog v-model="dialogPhoto" persistent max-width="600px">
        <v-card>
              <v-toolbar color="#F18254">
                <span class="text-subtitle-2 ml-4"> Comprobante de Transferencia</span> <v-spacer></v-spacer>
                <v-btn  @click="dialogPhoto = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
              </v-toolbar>
        
          <v-card-text>
            <v-img :src="selectedImageUrl" aspect-ratio="1.5"></v-img>
          </v-card-text>
        </v-card>
    </v-dialog>

    <!--Venta Productos-->
    <v-dialog v-model="dialogProducts" fullscreen transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-1 ml-4">Productos vendidos a estudiantes del curso</span>
            <v-spacer></v-spacer>
            <v-btn class="text-subtitle-1  ml-12" color="#E7E9E9" variant="flat" @click="this.dialogAddProduct = true">
              Asignar Producto
            </v-btn>
          </v-toolbar>
          <v-card-text class="mt-2 mb-2">
            <v-text-field class="mt-1 mb-1" v-model="search3" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details></v-text-field>
            <v-data-table :headers="headers3" :items="productSales" :search="search3" class="elevation-1" :items-per-page-text="'Elementos por páginas'" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles" >
              <!--<template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">:group-by="groupBy"
              <tr>
                <td :colspan="columns.length">
                  <VBtn size="small" variant="text" :icon="isGroupOpen(item) ? '$expand' : '$next'"
                    @click="toggleGroup(item)"></VBtn>
                  {{ item.value }}
                </td>
              </tr>
            </template>-->
            <template v-slot:item.nameProduct="{ item }">

            <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
              <v-img :src="'http://127.0.0.1:8000/api/images/' + item.image_product" alt="image"></v-img>
            </v-avatar>
            {{ item.nameProduct }}
            </template>

            <template v-slot:item.nameStudent="{ item }">

            <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
              <v-img :src="'http://127.0.0.1:8000/api/images/' + item.student_image" alt="image"></v-img>
            </v-avatar>
            {{ item.nameStudent }}
            </template>

              <template v-slot:item.actions="{ item }">
                <!--<v-btn density="comfortable" icon="mdi-pencil"  @click="editItemProduct(item)" color="primary" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Editar existencia"></v-btn>-->
          <v-btn density="comfortable" icon="mdi-delete" @click="closeproductRequest(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar existencia de producto"></v-btn>
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
      <v-dialog v-model="dialogAddProduct" width="500">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-2 ml-4">{{formTitle}}</span>
          </v-toolbar>
          <v-card-text class="mt-2 mb-2">
            <v-form ref="form" v-model="valid" enctype="multipart/form-data">
              <v-container>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-autocomplete v-model="student_id" :items="studentsCourse" label="Estudiantes"
                      prepend-icon="mdi-account-tie-outline" item-title="name" item-value="id" variant="underlined"
                      :rules="selectRules"></v-autocomplete>
                  <v-autocomplete v-model="product_id" :items="products" clearable label="Productos"
                        prepend-icon="mdi-tag" item-title="name" item-value="id" variant="underlined"
                        :rules="selectRules"></v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="closeproduct">
                  Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" @click="saveProduct" :disabled="!valid">
                  Aceptar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogRequestProduct" width="500">
        <v-card>

          <v-toolbar color="red">
            <span class="text-subtitle-2 ml-4"> Eliminar asignación de producto</span>
          </v-toolbar>

          <v-card-text class="mt-2 mb-2"> ¿Desea eliminar la asignación del producto?</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="closerequestProduct">
              Cancelar
            </v-btn>
            <v-btn color="#F18254" variant="flat" @click="deleteProduct">
              Aceptar
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-container>
</template>
<script>

import axios from "axios";
import { useDate } from 'vuetify';

export default {
  data: () => ({

    dialogPhoto: false, // Controla la visibilidad del modal
    selectedImageUrl: '', // URL de la imagen seleccionada para mostrar en el modal
    
    menu: false,
    courseSelect: "",
    input: null,
    menu1: false,
    input1: null,
    valid: true,
    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
    search: '',
    startDate: null,
    endDate: null,
    editando: false,
    dialog: false,
    message_delete: true,
    dialogUpdateS: false,
    dialogDelete: false,
    dialogStudents: false,
    dialogAddStudent: false,
    dialogRequest: false,
    course_id: '',
    search2: '',
    isDatePickerOpen: false,
    selectedDate: null,
    //venta productos
    dialogProducts: false,
    productSales: [],
    search3: '',
    studentsCourse: [],
    dialogAddProduct: false,
    enrollment_id: '',
    dialogRequestProduct: false,
    products: [],
    product_id:'',
    productsale_id: '',
    headers3: [
      { title: 'Nombre Estudiante', key: 'nameStudent' },
      { title: 'Nombre Producto', key: 'nameProduct' },
      { title: 'Precio del producto', key: 'price' },
      { title: 'Fecha de venta', key: 'data' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    headers: [
      { title: 'Nombre', key: 'name' },
      { title: 'Prec. Reserva', key: 'reservation_price' },
      { title: 'Prec. Total', key: 'price' },
      { title: 'Matrícula', key: 'total_enrollment' },
      { title: 'Cupos', key: 'available_slots' },

      { title: 'Fecha Inicio', key: 'startDate' },
      { title: 'Hrs', key: 'duration' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    headers2: [
      { title: 'Nombre', value: 'name' },
      { title: 'Correo', value: 'email' },
      { title: 'Teléfono', value: 'phone' },
      { title: 'Matriculado', value: 'enrollment_confirmed' },
      { title: 'Pago de Reserva', value: 'reservation_payment' },
      { title: 'Pago Total', value: 'total_payment' },
      { title: 'Comprobante', value: 'image_url' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],

    results: [],
    courseStudents: [],
    editedIndex: 1,
    users: [],
    file: '',
    imgMiniatura: '',
    editedItem: {
      name: '',
      description: '',
      price: '',
      startDate: null,
      endDate: null,
      enrollment_id: '',
      course_image: '',
      total_enrollment: '',
      available_slots: '',
      reservation_price: '',
      duration: '',
      practical_percentage: '',
      theoretical_percentage: '',
      id: ''
    },
    editedStudent: {
      student_id: '',
      course_id: '',
      id:'',
    },
    defaultStudent: {
      student_id: '',
      course_id: '',
      id:'',
    },
    data: {},

    editedItemS: {
      reservation_payment: '',
      total_payment: '',
      enrollment_confirmed: '',
      image_url: '',
      student_id: '',
      course_id: '',
      id: '',

    },

    defaultItem: {
      name: '',
      description: '',
      price: '',
      startDate: null,
      endDate: null,
      enrollment_id: '',
      course_image: '',
      total_enrollment: '',
      available_slots: '',
      reservation_price: '',
      duration: '',
      practical_percentage: '',
      theoretical_percentage: '',
      id:'',

    },

    selectRules: [(v) => !!v || "Seleccionar al menos un elemeto"],
  }),
  setup() {
        const adapter = useDate()

    const parseDate = (dateString) => {
      return adapter.parseISO(dateString)
    }

    return {
     parseDate
    }
    },

  computed: {
    imgedit() {
      return this.imgMiniatura;
    },

    formTitle() {
      if (this.editedIndex == 3) {
        return 'Asignar producto a estudiante';
      }
      if (this.editedIndex == 2) {
        return 'Editar Curso';
      }
      if (this.editedIndex == 1) {
        return 'Nuevo curso';
      }
      else{
        return 'Asiganar estudiante al curso'
      }
      //return this.editedIndex === -1 ? 'Nuevo Curso' : 'Editar Curso'
    },
    /*dateFormatted() {
      const date = this.input ? new Date(this.input) : new Date();
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    dateFormatted1() {
      const date = this.input1 ? new Date(this.input1) : new Date();
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    getDate() {
      return this.input ? new Date(this.input) : new Date();
    },
    getDate1() {
      return this.input1 ? new Date(this.input1) : new Date();
    },*/
    formattedStartDate() {
            if (this.editedItem.startDate) {
              console.log('this.editedItem.startDate datos');
              console.log(this.editedItem.startDate);
                const date = new Date(this.editedItem.startDate); 
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                console.log(`${year}-${month}-${day}`);

                return `${year}-${month}-${day}`;
            }
            return "";
            
        },
        formattedEndDate() {
            if (this.editedItem.endDate) {
              console.log('this.editedItem.endDate');
              console.log(this.editedItem.endDate);
                const date = new Date(this.editedItem.endDate);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                console.log(`${year}-${month}-${day}`);
                return `${year}-${month}-${day}`;

            }
            return "";
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

  mounted() {
    this.business_id = localStorage.getItem('business_id');
    this.initialize()
  },

  methods: {
    imagenDisponible() {
        if (this.imgedit !== undefined && this.imgedit !== '') {
            // Intenta cargar la imagen en un elemento oculto para verificar si está disponible
            let img = new Image();
            img.src = this.imgedit;
            return img.complete; // Devuelve true si la imagen está disponible
        }
        return false; // Si la URL de la imagen no está definida o está vacía, devuelve false
    },

    openModal(imageUrl) {
      
      this.selectedImageUrl = "http://127.0.0.1:8000/api/images/"+imageUrl; 
     // alert(this.selectedImageUrl)// Establece la imagen seleccionada
      this.dialogPhoto = true; // Abre el modal
    },
    /*updateDate(val) {
      this.input = val;
      this.editedItem.endDate = format(val, "yyyy-MM-dd");
      this.menu = false;
    },
    updateDate1(val) {
      this.input1 = val;
      this.editedItem.startDate = format(val, "yyyy-MM-dd");
      this.menu1 = false;
    },*/
    showStudents(item) {
      this.courseSelect = item;
      console.log('this.courseSelect');
      console.log(this.courseSelect);
      this.course_id = item.id;
      console.log(item.id);
      axios
        .get('http://127.0.0.1:8000/api/course-student-show', {
          params: {
            course_id: item.id
          }
        })
        .then((response) => {
          this.courseStudents = response.data.students;
          console.log('imprime estudiantes');
          console.log(response.data.students);

        });
      this.dialogStudents = true;
    },
    deleteS(item) {
      this.dialogRequest = true
      //this.editedItem.branch_id=item.id
      this.editedStudent.student_id = item.id
    },

    editS(item) {
      console.log("Este es el Item")
      console.log(item)
      this.dialogUpdateS = true;
      //this.editedItem.branch_id=item.id
      this.editedItemS.reservation_payment = item.reservation_payment;
      this.editedItemS.total_payment = item.total_payment;
      this.editedItemS.enrollment_confirmed = item.enrollment_confirmed;
      //this.editedItemS.image_url = item.image_url;
      this.editedItemS.student_id = item.id;
      this.imgMiniatura = 'http://127.0.0.1:8000/api/images/'+item.image_url;
      /*  this.editedItemS.id_course=
      
      
      */

      this.editedStudent.student_id = item.id

    },
    closeS() {
      this.dialogAddStudent = false;
      this.$nextTick(() => {
        this.editedStudent = Object.assign({}, this.defaultStudent)
      })
      this.showStudents(this.courseSelect)
    },
    saveS() {
      this.valid = false,
        this.data.course_id = this.course_id;
      this.data.student_id = this.editedStudent.student_id;
      console.log(this.data);
      axios
        .post('http://127.0.0.1:8000/api/course-student', this.data)
        .then(() => {
          this.$nextTick(() => {
            this.editedStudent = Object.assign({}, this.defaultStudent)
          })
          this.dialogAddStudent = false;
          this.showStudents(this.courseSelect);
          this.showAlert("success", "Cliente matriculado correctamente al curso", 3000);
          this.initialize();
        })
    },

    saveStatus() {
      this.valid = false,
        this.data.course_id = this.course_id;
      this.data.student_id = this.editedStudent.student_id;
      this.editedItemS.image_url = this.editedItem.course_image;
      this.editedItemS.course_id = this.course_id;
      let formData = new FormData();
      console.log('this.editedItemS------------');
      console.log(this.editedItemS);
      formData.append('file', this.editedItemS.image_url); 

      for (let key in this.editedItemS) {
         formData.append(key, this.editedItemS[key]);
      }
      axios
        .post('http://127.0.0.1:8000/api/course-student-update', formData)
        .then(() => {

          this.dialogAddStudent = false;
          this.showStudents(this.courseSelect);
          this.showAlert("success", "Cliente actualizado correctamente", 3000);
          this.initialize();
          this.closeUpdateS();
        })
    },
    closerequest() {
      this.dialogRequest = false;
      this.$nextTick(() => {
        this.editedStudent = Object.assign({}, this.defaultStudent)
      })
      this.showStudents(this.courseSelect)
    },
    requestDelete() {
      let request = {
        course_id: this.course_id,
        student_id: this.editedStudent.student_id
      };
      axios
        .post('http://127.0.0.1:8000/api/course-student-destroy', request)
        .then(() => {
          this.dialogRequest = false
          this.$nextTick(() => {
            this.editedStudent = Object.assign({}, this.defaultStudent)
          })
          this.initialize()
          console.log(this.courseSelect);
          this.showStudents(this.courseSelect)
          this.showAlert("success", "Cliente  eliminado del curso correctamente", 3000)
          this.initialize()
        })
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
        .get('http://127.0.0.1:8000/api/course-show', {
          params: {
            business_id: this.business_id
          }
        })
        .then((response) => {
          this.results = response.data.courses;
        });
      axios
        .get('http://127.0.0.1:8000/api/enrollment-show', {
          params: {
            business_id: this.business_id
          }
        })
        .then((response) => {
          this.enrollments = response.data.enrollments;
        });
      axios
        .get('http://127.0.0.1:8000/api/student-show')
        .then((response) => {
          this.students = response.data.students;
        })
    },
    onFileSelected(event) {
      let file = event.target.files[0];
      this.editedItem.course_image = file;
      console.log(this.editedItem.course_image);
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
      this.file = '';
      this.imgMiniatura = 'http://127.0.0.1:8000/api/images/' + item.course_image;
      this.editedIndex = 2;
      this.editedItem = Object.assign({}, item);
      this.editedItem.startDate = this.parseDate(item.startDate);
      this.editedItem.endDate = this.parseDate(item.endDate);
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
        .post('http://127.0.0.1:8000/api/course-destroy', request)
        .then(() => {
          this.message_delete = true
          this.showAlert("success", "Curso eliminado correctamente", 3000);
          this.initialize();
        })
      this.closeDelete()
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = 1
        this.imgMiniatura = '';
        this.file = '';
      })
    },
    closeUpdateS() {
      this.dialogUpdateS = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    closeDelete() {
      this.dialogStudents = false;
      this.dialogDelete = false;
      this.dialogRequest = false;
      this.dialogProducts = false;
      this.imgMiniatura = '';
      this.file = '';
        this.editedIndex = 1
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedStudent = Object.assign({}, this.defaultStudent)
      })
    },
    save() {
      if (this.editedIndex == 2) {
        this.valid = false;
        /*this.data.id = this.editedItem.id;
        this.data.name = this.editedItem.name;
        this.data.surname = this.editedItem.surname;
        this.data.second_surname = this.editedItem.second_surname;
        this.data.email = this.editedItem.email;
        this.data.phone = this.editedItem.phone;*/
        this.editedItem.startDate = this.formattedStartDate;
        this.editedItem.endDate = this.formattedEndDate;
        const formData = new FormData();
        for (let key in this.editedItem) {
          formData.append(key, this.editedItem[key]);
        }
        console.log(formData);
        axios
          .post('http://127.0.0.1:8000/api/course-update', formData)
          .then(() => {
            this.showAlert("success", "Curso editado correctamente", 3000);
            this.initialize();
            this.imgMiniatura = '';
            this.file = '';
            
          })
      } if (this.editedIndex == 1) {
        this.valid = false;
        /*this.data.name = this.editedItem.name;
        this.data.name = this.editedItem.name;
        this.data.surname = this.editedItem.surname;
        this.data.second_surname = this.editedItem.second_surname;
        this.data.email = this.editedItem.email;
        this.data.phone = this.editedItem.phone;*/
        this.editedItem.startDate = this.formattedStartDate;
        this.editedItem.endDate = this.formattedEndDate;
        const formData = new FormData();
        for (let key in this.editedItem) {
          formData.append(key, this.editedItem[key]);
        }
        axios
          .post('http://127.0.0.1:8000/api/course', formData)
          .then(() => {
            this.showAlert("success", "Curso registrado correctamente", 3000);
            this.initialize();
            this.imgMiniatura = '';
            this.file = '';
          })
      }
      this.close()
    },
    //venta productos
    showProducts(item) {
      this.courseSelect = item;
      console.log('this.courseSelect');
      console.log(this.courseSelect);
      this.course_id = item.id;
      this.enrollment_id = item.enrollment_id;
      console.log(item.id);
      axios
        .get('http://127.0.0.1:8000/api/productsale-show', {
          params: {
            course_id: item.id,
            enrollment_id: item.enrollment_id
          }
        })
        .then((response) => {
          this.productSales = response.data.productsales;
          console.log('imprime estudiantes');
          console.log(response.data.productSales);

        });
        axios
        .get('http://127.0.0.1:8000/api/course-student-product-show',{
          params: {
            course_id: item.id
          }
        })
        .then((response) => {
          this.studentsCourse = response.data.students;
        });
        axios
        .get('http://127.0.0.1:8000/api/products-academy-show', {
          params: {
            enrollment_id: item.enrollment_id
          }
        })
        .then((response) => {
          this.products = response.data.products;
          console.log('imprime productos');
          console.log(response.data.products);

        });
        this.editedIndex = 3;
      this.dialogProducts = true;
    },
    closeproduct() {
      this.dialogAddProduct = false;
      this.product_id = '';
      this.student_id = '';
      this.showProducts(this.courseSelect)
    },
    saveProduct() {
      if (this.editedIndex == 3) {
        this.valid = false,
        this.data.enrollment_id = this.enrollment_id;
      this.data.student_id = this.student_id;
      this.data.id = this.product_id;
      this.data.cant = 1;
      console.log('this.data');
      console.log(this.data);
      axios
          .post('http://127.0.0.1:8000/api/productsale', this.data)
          .then(() => {
          this.dialogAddProduct = false;
          this.student_id = '',
          this.product_id = '';
          this.showProducts(this.courseSelect);
          this.showAlert("success", "Producto asignado correctamente al estudiante", 3000);
        })
      }
      /*if (this.editedIndex == 4){
        this.valid = false,
        this.data.enrollment_id = this.enrollment_id;
      this.data.store_id = this.store_id;
      this.data.product_id = this.product_id;
      this.data.product_quantity = this.product_quantity;
      console.log('this.data');
      console.log(this.data);
      axios
          .put('http://127.0.0.1:8000/api/productstore', this.data)
          .then(() => {
          this.dialogAddProduct = false;
          this.store_id = '',
          this.product_id = '';
          this.product_quantity = '';
          this.showProducts(this.enrollmentSelect);
          this.showAlert("success", "Asignacion editada correctamente", 3000);
        })
      }*/
    },
    closeproductRequest(item) {
      this.dialogRequestProduct = true
      //this.editedItem.branch_id=item.id
      this.productsale_id = item.id;

    },
    closerequestProduct() {
      this.dialogRequestProduct = false;
      this.productsale_id = '';
      this.showProducts(this.courseSelect)
    },
    deleteProduct() {
      let request = {
        id: this.productsale_id
      };
      axios
        .post('http://127.0.0.1:8000/api/productsale-destroy', request)
        .then(() => {
          this.dialogRequestProduct = false;
          this.productsale_id = '',
          console.log('this.courseSelect');
          console.log(this.courseSelect);
          this.showProducts(this.courseSelect);
          this.showAlert("success", "Asignación eliminada correctamente", 3000);    
        })
    },
  },//endMethods
}
</script>