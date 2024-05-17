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

                <v-btn class="text-subtitle-1 " color="#E7E9E9" variant="flat" elevation="2"
                  prepend-icon="mdi-plus-circle" @click="showAddCurso()">
                  Agregar Curso
                </v-btn>
            <v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen>
              <v-card>
                <v-toolbar color="#F18254">
                  <span class="text-subtitle-2 ml-4"> {{formTitle}}</span>
                </v-toolbar>
                <v-card-text>
                  <v-form v-model="valid" enctype="multipart/form-data">
                    <v-row>
                      <v-col cols="12" md="12">
                        <v-autocomplete :no-data-text="'No hay datos disponibles'" clearable v-model="editedItem.enrollment_id" :items="enrollments"
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
                            <v-date-picker color="orange lighten-2" @input="menu1" v-model=editedItem.startDate  header="Calendario" title="Seleccione la fecha" :min="new Date(
                        Date.now() -
                        new Date().getTimezoneOffset() * 60000
                      )
                        .toISOString()
                        .substr(0, 10)
                        " @update:modelValue="updateDate1"></v-date-picker>
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
                            <v-date-picker color="orange lighten-2" @input="menu" v-model=editedItem.endDate  header="Calendario" title="Seleccione la fecha"  :min="new Date(
                        Date.now() -
                        new Date().getTimezoneOffset() * 60000
                      )
                        .toISOString()
                        .substr(0, 10)
                        " @update:modelValue="updateDate"></v-date-picker>
                          </v-locale-provider>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-file-input clearable v-model="file" ref="fileInput" label="Imagen del Curso"
                          variant="underlined" density="compact" name="file" accept=".png, .jpg, .jpeg"
                          @change="onFileSelected">
                        </v-file-input>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-card elevation="6" class="mx-auto" max-width="120" max-height="120">
                        <img v-if="imagenDisponible()" :src="imgedit" height="120" width="120">
                      </v-card>
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
              <v-img :src="'https://api2.simplifies.cl/api/images/' + item.course_image" alt="image"></v-img>
            </v-avatar>
            {{ item.name }}
          </template>
          <template v-slot:item.reservation_price ="{ item }">
                         {{ formatNumber(item.reservation_price)}}
                                    </template>
                                    <template v-slot:item.price ="{ item }">
                         {{ formatNumber(item.price)}}
                                    </template>
          <template v-slot:item.actions="{ item }">

            <v-btn density="comfortable" icon="mdi-pencil"  @click="editItem(item)" color="primary" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Editar Curso"></v-btn>
            <v-btn density="comfortable" icon="mdi-account-school"  @click="showStudents(item)" color="green" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Estudiantes inscritos"></v-btn>
            <!--<v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-storefront" @click="showProducts(item)" color="orange-darken-1" variant="tonal"
            elevation="1" title="Vender productos a estudiantes"></v-btn>-->
            <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-account-tie" @click="showAddProfessional(item)" color="indigo" variant="darken-2"
            elevation="1" title="Asignar Professional"></v-btn>  
          <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar Curso"></v-btn>
          </template>
        </v-data-table>



        <!--TODO-->
        <v-dialog v-model="dialogUpdateS" max-width="700px">
          <v-card>
            <v-toolbar color="#F18254">
              <span class="text-subtitle-2 ml-4">Actualizar Datos</span>
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
                    <v-card elevation="6" class="mx-auto" max-width="120" max-height="120">
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
              <v-btn color="#E7E9E9" variant="flat" @click="showAddStudent()">
                Agregar Estudiante
              </v-btn>
            </v-toolbar>

            <v-card-text class="mt-2 mb-2">

              <v-text-field class="mt-1 mb-1" v-model="search2" append-icon="mdi-magnify" label="Buscar" single-line
                hide-details></v-text-field>

              <v-data-table :headers="headers2" :items="courseStudents" :search="search2" class="elevation-1">

                <template v-slot:item.name="{ item }">
                  <v-avatar elevation="3" color="grey-lighten-4" size="large">
                    <v-img :src="'https://api2.simplifies.cl/api/images/' + item.student_image" alt="image"></v-img>
                  </v-avatar>
                  {{ item.name + ' ' + item.surname }}
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
                  <div class="text-center">
                    <v-chip :color="item.enrollment_confirmed == 1 ? 'green' : 'red'"
                      :text="item.enrollment_confirmed == 1 ? 'SI' : 'NO'" class="text-uppercase" size="small"
                      label></v-chip>
                  </div>
                </template>
                <template v-slot:item.enabled="{ item }">
                  <div class="text-center">
                    {{parseInt(item.enabled) ? 'Habilitado' : 'No Habilitado'}}
                  </div>
                </template>
                <template v-slot:item.status="{ item }">
                  <div class="text-center">
                    {{parseInt(item.status) ? 'Ok' : 'Retrasado'}}
                  </div>
                </template>
                <template v-slot:item.amount_pay="{ item }">
                  <div class="text-center">
                    {{formatNumber(item.amount_pay)}}
                  </div>
                </template>
                <template v-slot:item.reservation_payment ="{ item }">
                         {{ formatNumber(item.reservation_payment)}}
                                    </template>
                                    <template v-slot:item.total_payment ="{ item }">
                         {{ formatNumber(item.total_payment)}}
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
                  <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-storefront" @click="showProducts(item)" color="orange-darken-1" variant="tonal"
            elevation="1" title="Asignar productos al estudiante"></v-btn>
            <v-btn density="comfortable" class="mr-1 mt-1 mb-1" icon="mdi-checkbox-marked-circle" @click="editState(item)" color="green-darken-1" variant="tonal"
            elevation="1" title="Editar estado en el curso"></v-btn>
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
                      <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedStudent.student_id" :items="students" label="Estudiante"
                        prepend-icon="mdi-account-tie-outline" item-title="name" item-value="id" variant="underlined"
                        :rules="selectRules">
                        <template v-slot:item="{ props, item }">
                          <v-list-item
                            v-bind="props"
                            :prepend-avatar="'https://api2.simplifies.cl/api/images/'+item.raw.client_image"
                            :title="item.raw.name"
                          ></v-list-item>
                        </template>
                        </v-autocomplete>
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

            <v-card-text class="mt-2 mb-2"> ¿Desea eliminar este estudiante del curso?</v-card-text>
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
            <span class="text-subtitle-1 ml-4">Productos asignados al estudiante</span>
            <v-spacer></v-spacer>
            <v-btn class="text-subtitle-1  ml-12" color="#E7E9E9" variant="flat" @click="showAddProduct()">
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
            <template v-slot:item.price ="{ item }">
                         {{ formatNumber(item.price)}}
                                    </template>
            <template v-slot:item.nameProduct="{ item }">

            <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
              <v-img :src="'https://api2.simplifies.cl/api/images/' + item.image_product" alt="image"></v-img>
            </v-avatar>
            {{ item.nameProduct }}
            </template>

            <!--<template v-slot:item.nameStudent="{ item }">

            <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
              <v-img :src="'https://api2.simplifies.cl/api/images/' + item.student_image" alt="image"></v-img>
            </v-avatar>
            {{ item.nameStudent }}
            </template>-->

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
            <v-btn color="#E7E9E9" variant="flat" @click="(this.dialogProducts = false) && (this.productSelect = '')">
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
                    <!--<v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="student_id" :items="studentsCourse" label="Estudiantes"
                      prepend-icon="mdi-account-tie-outline" item-title="name" item-value="id" variant="underlined"
                      :rules="selectRules"></v-autocomplete>-->
                  <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="product_id" :items="products" clearable label="Productos"
                        prepend-icon="mdi-tag" item-title="name" item-value="id" variant="underlined"
                        :rules="selectRules" @update:model-value="cantExist">
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

      <!--Professionals-->
      <v-dialog v-model="dialogAddProfessional" fullscreen transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="#F18254">
            <span class="text-subtitle-2 ml-4">Profesionales asignados al curso</span>
            <v-spacer></v-spacer>
            <v-btn class="text-subtitle-1  ml-12" color="#E7E9E9" variant="flat" @click="showAdddialogProfessionals()">
              Asignar Profesional
            </v-btn>
          </v-toolbar>

          <v-card-text class="mt-2 mb-2">
            <v-text-field class="mt-1 mb-1" v-model="search4" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details></v-text-field>

            <v-data-table :headers="headers4" :items="courseprofessionals" :search="search4" class="elevation-1" :items-per-page-text="'Elementos por páginas'" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">
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
                <v-btn density="comfortable" icon="mdi-delete" @click="deleteProfessional(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar afiliación del professional"></v-btn>
                <!--<v-icon size="small" color="red" @click="deleteP(item)">
                  mdi-delete
                </v-icon>-->
              </template>

            </v-data-table>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#F18254" variant="flat" @click="closeProfessional">
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
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="professional_id" :items="professionals" label="Profesional"
                      prepend-icon="mdi-account-tie-outline" item-title="name" item-value="id" variant="underlined"
                      :rules="selectRules">
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
                </v-row>
              </v-container>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E7E9E9" variant="flat" @click="closeAdddialogProfessionals">
                  Cancelar
                </v-btn>
                <v-btn color="#F18254" variant="flat" @click="saveProfessional" :disabled="!valid">
                  Aceptar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogRequestProfessional" width="500">
        <v-card>

          <v-toolbar color="red">
            <span class="text-subtitle-2 ml-4"> Eliminar afiliación del profesional al curso</span>
          </v-toolbar>

          <v-card-text class="mt-2 mb-2"> ¿Desea eliminar esta afiliación del profesional con el curso?</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#E7E9E9" variant="flat" @click="closerequestProfessional">
              Cancelar
            </v-btn>
            <v-btn color="#F18254" variant="flat" @click="requestDeleteProfessional">
              Aceptar
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--editar estado del estudainte--> 
      <v-dialog v-model="dialogUpdateState" max-width="700px">
          <v-card>
            <v-toolbar color="#F18254">
              <span class="text-subtitle-2 ml-4">Actualizar Estado en el Curso</span>
            </v-toolbar>
            <v-card-text>
              <v-form v-model="valid" enctype="multipart/form-data">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="enabled" :items="options" clearable label="Habilitado"
                        prepend-icon="mdi-format-list-bulleted-square" item-title="name" item-value="id"
                        variant="underlined"></v-autocomplete>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="payment_status" :items="options1" clearable label="Estado de los Pagos"
                        prepend-icon="mdi-format-list-bulleted-square" item-title="name" item-value="id"
                        variant="underlined"></v-autocomplete>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field v-show="payment_status === 0" v-model="amount_pay" clearable label="Monto a pagar"
                      prepend-icon="mdi-currency-usd" variant="underlined" :rules="pago">
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn color="#E7E9E9" variant="flat" @click="closeState">
                    Cancelar
                  </v-btn>
                  <v-btn color="#F18254" variant="flat" @click="StateSave" :disabled="!valid">
                    Aceptar
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
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
    business_id: '',
    message_delete: true,
    dialogUpdateS: false,
    dialogUpdateState: false,
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
    cant: '',
    product_exit: '',
    productSelect: [],
    headers3: [
      //{ title: 'Nombre Estudiante', key: 'nameStudent' },
      { title: 'Nombre Producto', key: 'nameProduct' },
      { title: 'Precio del producto', key: 'price' },
      { title: 'Cantidad', key: 'cant' },
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
      { title: 'Habilitado', value: 'enabled' },
      { title: 'Pago', value: 'status' },
      { title: 'Monto a Pagar', value: 'amount_pay' },
      { title: 'Comprobante', value: 'image_url' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],

    results: [],
    courseStudents: [],
    enrollments : [],
    editedIndex: 1,
    users: [],
    students: [],
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
    
    enabled: '',
      payment_status: '',
      amount_pay: '',
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
    //professional
    professionals: [],
    courseprofessionals: [],
    dialogAddProfessional: false,
    professional_id: '',
    dialogAddProf: false,
    dialogRequestProfessional: false,
    headers4: [
      //{ title: 'Nombre Estudiante', key: 'nameStudent' },
      { title: 'Nombre Profesional', key: 'name' },
      { title: 'Email', key: 'email' },
      { title: 'Cargo', key: 'charge' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    search4: '',
    options: [
      {
        "name": "Habilitado",
        "id": 1
      },
      {
        "name": "No Habilitado",
        "id": 0
      }
    ],
    options1: [
      {
        "name": "Ok",
        "id": 1
      },
      {
        "name": "Retrasado",
        "id": 0
      }
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    pago: [
      (value) => !!value || 'Campo requerido',
      (value) => !value || !isNaN(parseFloat(value)) || 'Debe ser un número'],
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
    imagenDisponible() {
      if (this.imgedit !== undefined && this.imgedit !== '') {
      
        // Intenta cargar la imagen en un elemento oculto para verificar si está disponible
        let img = new Image();
        img.src = this.imgedit;

        return true; // Devuelve true si la imagen está disponible
      }
      return false; // Si la URL de la imagen no está definida o está vacía, devuelve false*/
    },
    updateDate() {
      this.menu = false;
    },
    updateDate1() {
      this.menu1 = false;
    },
    validateCantidad(value) {
      if (value == 0) {
    return "El valor no puede ser nulo";
  } else if (value <= this.product_exit) {
    return true; // La cantidad es válida
  } else {
    return "La cantidad debe ser menor o igual que la existencia (" + this.product_exit + ")";
  }
    },
    cantExist() {
      let exist = this.products.filter(item => item.id == this.product_id);
      this.product_exit = exist[0].product_exit;

      console.log(exist[0].product_exit);
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

    openModal(imageUrl) {
      
      var img = new Image();
      img.src = 'https://api2.simplifies.cl/api/images/' + imageUrl;
      img.onload = () => {
      this.selectedImageUrl = 'https://api2.simplifies.cl/api/images/' + imageUrl; 
      };
      img.onerror = () => {
        this.selectedImageUrl = '';
      };
     // alert(this.selectedImageUrl)// Establece la imagen seleccionada
      this.dialogPhoto = true; // Abre el modal
    },
    
    showStudents(item) {
      this.courseSelect = item;
      /*console.log('this.courseSelect');
      console.log(this.courseSelect);*/
      this.course_id = item.id;
      //console.log(item.id);
      axios
        .get('https://api2.simplifies.cl/api/course-student-show', {
          params: {
            course_id: item.id
          }
        })
        .then((response) => {
          this.courseStudents = response.data.students;
          /*console.log('imprime estudiantes');
          console.log(response.data.students);*/

        });
      this.dialogStudents = true;
    },
    showAddStudent(){
          axios
          .get('https://api2.simplifies.cl/api/student-show', {
            params: {
              course_id: this.courseSelect.id
            }
          })
          .then((response) => {
            this.students = response.data.students;
          });
          this.dialogAddStudent = true;
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
      var img = new Image();
      img.src = 'https://api2.simplifies.cl/api/images/'+item.image_url;
      img.onload = () => {
        this.imgMiniatura = 'https://api2.simplifies.cl/api/images/'+item.image_url;
      };
      img.onerror = () => {
        this.imgMiniatura = '';
      };
      /*  this.editedItemS.id_course=
      
      
      */

      this.editedStudent.student_id = item.id

    },
    closeS() {
      this.dialogAddStudent = false;
      this.$nextTick(() => {
        this.editedStudent = Object.assign({}, this.defaultStudent)
      })
      //this.showStudents(this.courseSelect)
    },
    saveS() {
      this.valid = false,
        this.data.course_id = this.course_id;
      this.data.student_id = this.editedStudent.student_id;
      console.log(this.data);
      axios
        .post('https://api2.simplifies.cl/api/course-student', this.data)
        .then(() => {
          this.$nextTick(() => {
            this.editedStudent = Object.assign({}, this.defaultStudent)
          })
          this.dialogAddStudent = false;
          //this.initialize();
        }).finally(() => {
          this.showAlert("success", "Estudiante matriculado correctamente al curso", 3000);
          this.showStudents(this.courseSelect);
          });
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
        .post('https://api2.simplifies.cl/api/course-student-update', formData)
        .then(() => {
          this.dialogAddStudent = false;
        }).finally(() => {
          this.showAlert("success", "Estudiante actualizado correctamente", 3000);
          this.showStudents(this.courseSelect);
          });
          this.closeUpdateS();
    },
    closerequest() {
      this.dialogRequest = false;
      this.$nextTick(() => {
        this.editedStudent = Object.assign({}, this.defaultStudent)
      })
      //this.showStudents(this.courseSelect)
    },
    requestDelete() {
      let request = {
        course_id: this.course_id,
        student_id: this.editedStudent.student_id
      };
      axios
        .post('https://api2.simplifies.cl/api/course-student-destroy', request)
        .then(() => {
          this.dialogRequest = false;
        }).finally(() => {
          this.showAlert("success", "Estudiante  eliminado del curso correctamente", 3000);
          this.showStudents(this.courseSelect);
          });
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
        .get('https://api2.simplifies.cl/api/course-show', {
          params: {
            business_id: this.business_id
          }
        })
        .then((response) => {
          this.results = response.data.courses;
        });
      
    },
    showAddCurso(){
      axios
              .get('https://api2.simplifies.cl/api/enrollment-show', {
                params: {
                  business_id: this.business_id
                }
              })
              .then((response) => {
                this.enrollments = response.data.enrollments;
              });
      this.dialog = true;
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
      this.file = null;
      var img = new Image();
      img.src = 'https://api2.simplifies.cl/api/images/' + item.image_data;
      img.onload = () => {
        this.imgMiniatura = 'https://api2.simplifies.cl/api/images/' + item.image_data;
      };
      img.onerror = () => {
        this.imgMiniatura = '';
      };
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
        .post('https://api2.simplifies.cl/api/course-destroy', request)
        .then(() => {
        }).finally(() => {
          this.showAlert("success", "Curso eliminado correctamente", 3000);
          this.initialize();
          });
      this.closeDelete()
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = 1
        this.imgMiniatura = '';
        this.file = null;
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
      this.file = null;
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
          .post('https://api2.simplifies.cl/api/course-update', formData)
          .then(() => {
            this.imgMiniatura = '';
            this.file = null;            
          }).finally(() => {
            this.showAlert("success", "Curso editado correctamente", 3000);
            this.initialize();
          });
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
          .post('https://api2.simplifies.cl/api/course', formData)
          .then(() => {
            this.imgMiniatura = '';
            this.file = null;
          }).finally(() => {
            this.showAlert("success", "Curso registrado correctamente", 3000);
            this.initialize();
          });
      }
      this.close()
    },
    //venta productos
    showProducts(item) {
      console.log('this.courseSelect');
      console.log(this.courseSelect);
      this.productSelect = item;
      console.log( 'this.productSelect');
      console.log( this.productSelect);
      console.log('this.courseSelect[0].enrollment_confirmed');
      console.log(this.courseSelect.enrollment_id);
      this.course_id = this.courseSelect.id;
      this.enrollment_id = this.courseSelect.enrollment_id;
      this.student_id = item.id;
      /*this.courseSelect = item;
      console.log(item.id);*/
      axios
        .get('https://api2.simplifies.cl/api/productsale-show', {
          params: {
            course_id: item.course_id,
            enrollment_id: this.courseSelect.enrollment_id,
            student_id: item.id
          }
        })
        .then((response) => {
          this.productSales = response.data.productsales;
        });
        /*axios
        .get('https://api2.simplifies.cl/api/course-student-product-show',{
          params: {
            course_id: item.id
          }
        })
        .then((response) => {
          this.studentsCourse = response.data.students;
        });*/
        
        this.editedIndex = 3;
      this.dialogProducts = true;
    },
    showAddProduct(){
        axios
                .get('https://api2.simplifies.cl/api/products-academy-show', {
                  params: {
                    enrollment_id: this.courseSelect.enrollment_id
                  }
                })
                .then((response) => {
                  this.products = response.data.products;
                });
                this.dialogAddProduct = true;
    },
    closeproduct() {
      this.dialogAddProduct = false;
      this.product_id = '';
      this.student_id = '';
      this.cant = '';
      //this.showProducts(this.productSelect)
    },
    saveProduct() {
      if (this.editedIndex == 3) {
        this.valid = false,
        /*console.log('this.course_id');
      console.log(this.course_id);*/
        this.data.enrollment_id = this.enrollment_id;
      this.data.student_id = this.student_id;
      this.data.id = this.product_id;
      this.data.cant = this.cant;
      this.data.course_id = this.course_id;
      /*console.log('this.data');
      console.log(this.data);*/
      axios
          .post('https://api2.simplifies.cl/api/productsale', this.data)
          .then(() => {
          this.dialogAddProduct = false;
          this.student_id = '',
          this.product_id = '';
          this.cant = ''; 
          this.product_exit = '';
        }).finally(() => {
          this.showAlert("success", "Producto asignado correctamente al estudiante", 3000);
          this.showProducts(this.productSelect);
          });
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
          .put('https://api2.simplifies.cl/api/productstore', this.data)
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
      //this.showProducts(this.productSelect)
    },
    deleteProduct() {
      let request = {
        id: this.productsale_id
      };
      axios
        .post('https://api2.simplifies.cl/api/productsale-destroy', request)
        .then(() => {
          this.dialogRequestProduct = false;
          this.productsale_id = '';
        }).finally(() => {
          this.showAlert("success", "Asignación eliminada correctamente", 3000);  
          this.showProducts(this.productSelect); 
          });
    },

    //professionals
    showAddProfessional(item){
      this.courseSelect = item;
          axios
          .get('https://api2.simplifies.cl/api/course-professional', {
            params: {
              course_id: this.courseSelect.id
            }
          })
          .then((response) => {
            this.courseprofessionals = response.data.courseProfessionals;
          });
          this.dialogAddProfessional = true;
    },
    closeProfessional() {
      this.dialogAddProfessional = false;
      /*this.$nextTick(() => {
        this.editedStudent = Object.assign({}, this.defaultStudent)
      })*/
      //this.showStudents(this.courseSelect)
    },
    saveProfessional() {
      this.valid = false,
        this.data.course_id = this.courseSelect.id;
      this.data.professional_id = this.professional_id;
      console.log(this.data);
      axios
        .post('https://api2.simplifies.cl/api/course-professional', this.data)
        .then(() => {
          this.dialogAddProf = false;
          //this.initialize();
        }).finally(() => {
          this.showAddProfessional(this.courseSelect);
          this.showAlert("success", "Professional asignado correctamente al curso", 3000);
          });
    },
    showAdddialogProfessionals(){
      axios
        .get('https://api2.simplifies.cl/api/course-professional-show-Notin', {
          params: {
            course_id: this.courseSelect.id
          }
        })
        .then((response) => {
          this.professionals = response.data.professionals;
        });
        this.dialogAddProf = true;
    },
    closeAdddialogProfessionals(){
      this.dialogAddProf = false;
    },
    deleteProfessional(item) {
      this.dialogRequestProfessional = true;
      //this.editedItem.branch_id=item.id
      this.professional_id = item.professional_id
    },
    requestDeleteProfessional() {
      let request = {
        course_id: this.courseSelect.id,
        professional_id: this.professional_id
      };
      axios
        .post('https://api2.simplifies.cl/api/course-professional-destroy', request)
        .then(() => {
          this.dialogRequestProfessional = false;
        }).finally(() => {
          this.professional_id = '',
          this.showAddProfessional(this.courseSelect);
          this.showAlert("success", "Afiliación eliminada correctamente", 3000);
          });
    },
    closerequestProfessional() {
      this.dialogRequestProfessional = false;
      this.professional_id = '';
      //this.showProfessionals(this.branchSelect)
    },
    //
    editState(item) {
      console.log("Este es el Item")
      console.log(item)
      this.dialogUpdateState = true;
      //this.editedItem.branch_id=item.id
      this.enabled = item.enabled;
      this.payment_status = item.payment_status;
      this.amount_pay = item.amount_pay;
      //this.editedItemS.image_url = item.image_url;
      this.editedItemS.student_id = item.id;
      this.editedStudent.student_id = item.id;

    },
    closeState() {
      this.dialogUpdateState = false;
      this.enabled = '';
      this.payment_status = '';
      this.amount_pay = '';
      this.editedItemS.student_id = '';
      this.editedStudent.student_id = '';
      //this.showStudents(this.courseSelect)
    },
    StateSave() {
      this.valid = false,
        this.data.course_id = this.course_id;
      this.data.student_id = this.editedStudent.student_id;
      this.data.enabled = this.enabled;
      this.data.payment_status = this.payment_status;
      this.data.amount_pay = this.payment_status ? 0 : this.amount_pay;

      console.log('this.data------------');
      console.log(this.data);
   
      axios
        .post('https://api2.simplifies.cl/api/course-student-update2', this.data)
        .then(() => {
          this.dialogUpdateState = false;
        }).finally(() => {
          this.showAlert("success", "Estado en el curso actualizado correctamente", 3000);
          this.showStudents(this.courseSelect);
          });
          this.closeState();
    },
  },//endMethods
}
</script>