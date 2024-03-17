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
  <v-card elevation="6" class="mx-5">
    <v-toolbar color="#F18254">
      <v-row align="center">
        <v-col cols="12" md="4" class="grow ml-4">
          <span class="text-subtitle-1"> <strong>Listado de Cursos</strong></span>
        </v-col>
         <v-col cols="12" md="5" class="mr-12"></v-col>
        <v-col cols="12" md="2">

          <v-dialog v-model="dialog" max-width="1000px">
            <template v-slot:activator="{ props }">

              <v-btn v-bind="props" class="text-subtitle-1  ml-12  " color="#E7E9E9" variant="flat" elevation="2"
                prepend-icon="mdi-plus-circle">
                Agregar Curso
              </v-btn>

            </template>
            <v-card>
              <v-toolbar color="#F18254">
                <span class="text-subtitle-2 ml-4"> Curso</span>
              </v-toolbar>
              <v-card-text>
                <v-form v-model="valid" enctype="multipart/form-data">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="editedItem.name" clearable label="Nombre"
                        prepend-icon="mdi-account-tie-outline" variant="underlined" :rules="nameRules">
                      </v-text-field>

                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="editedItem.description" clearable label="Descripción"
                        prepend-icon="mdi-account-tie-outline" variant="underlined" :rules="nameRules">
                      </v-text-field>

                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="editedItem.price" clearable label="Precio" prepend-icon="mdi-currency-usd"
                        variant="underlined" :rules="priceRules">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-autocomplete clearable v-model="editedItem.enrollment_id" :items="enrollments" label="Academia"
                        prepend-icon="mdi-school-outline" item-title="name" item-value="id" variant="underlined"
                        :rules="selectRules"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-menu v-model="menu1" :close-on-content-click="false" :nudge-right="40"
                        transition="scale-transition" offset-y min-width="290px">
                        <template v-slot:activator="{ props }">
                          <v-text-field v-bind="props" :model-value="dateFormatted1" variant="underlined"
                            append-inner-icon="mdi-calendar" label="Fecha inicial"></v-text-field>
                        </template>
                        <v-locale-provider locale="es">
                          <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2" :model-value=input1 @update:model-value="updateDate1"
                            format="yyyy-MM-dd"></v-date-picker>
                        </v-locale-provider>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                        transition="scale-transition" offset-y min-width="290px">
                        <template v-slot:activator="{ props }">
                          <v-text-field v-bind="props" :model-value="dateFormatted" variant="underlined"
                            append-inner-icon="mdi-calendar" label="Fecha final"></v-text-field>
                        </template>
                        <v-locale-provider locale="es">
                          <v-date-picker header="Calendario" title="Seleccione la fecha" color="orange lighten-2" :model-value=input @update:model-value="updateDate"
                            format="yyyy-MM-dd"></v-date-picker>
                        </v-locale-provider>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-file-input clearable v-model="file" ref="fileInput" label="Avatar Curso" variant="underlined"
                        density="compact" name="file" accept=".png, .jpg, .jpeg" @change="onFileSelected">
                      </v-file-input>
                      <v-avatar elevation="3" color="grey-lighten-4" size="large">
                        <img v-if="imgedit" :src="imgedit" height="70" width="70">
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
      <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :items="results" class="elevation-1" no-data-text="No hay datos disponibles"
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
          <v-icon size="25" color="blue" class="me-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>          
          <v-icon size="25" color="primary" @click="showStudents(item)">
            mdi-school-outline
          </v-icon>
          <v-icon size="25" color="red" @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>

      <!--Professionals-->
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

            <v-data-table :headers="headers2" :items="courseStudents" :search="search2" class="elevation-1"  :items-per-page-text="'Elementos por páginas'"  no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">

              <template v-slot:item.name="{ item }">

                <v-avatar elevation="3" color="grey-lighten-4" size="large">
                  <v-img :src="'http://127.0.0.1:8000/api/images/' + item.student_image" alt="image"></v-img>
                </v-avatar>
                {{ item.name + ' ' + item.surname + ' ' + item.second_surname }}
              </template>

              <template v-slot:item.actions="{ item }">
                <v-icon size="25" color="red" @click="deleteS(item)">
                  mdi-delete
                </v-icon>
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
  <br>
</template>
<script>

import axios from "axios";
import { format } from "date-fns";

export default {
  data: () => ({
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
    editando: false,
    dialog: false,
    message_delete: true,
    dialogDelete: false,
    dialogStudents: false,
    dialogAddStudent: false,
    dialogRequest: false,
    course_id: '',
    search2:'',

    isDatePickerOpen: false,
    selectedDate: null,
    headers: [
      { title: 'Nombre', key: 'name' },
      { title: 'Descripción', key: 'description' },
      { title: 'Precio', key: 'price' },
      { title: 'Fecha Inicio', key: 'startDate' },
      { title: 'Fecha Final', key: 'endDate' },
      { title: 'Academia', align: 'start', value: 'enrollment.name' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    headers2: [
      { title: 'Nombre', value: 'name' },
      { title: 'Crreo', value: 'email' },
      { title: 'Teléfono', value: 'phone' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    results: [],
    courseStudents: [],
    editedIndex: -1,
    users: [],
    file: null,
    imgMiniatura: '',
    editedItem: {
      name: '',
      description: '',
      price: '',
      startDate: '',
      endDate: '',
      enrollment_id: '',
      course_image: '',
      id: ''
    },
    editedStudent: {
      student_id: '',
      course_id: ''
    },
    defaultStudent: {
      student_id: '',
      course_id: ''
    },
    data: {},

    defaultItem: {
      name: '',
      description: '',
      price: '',
      startDate: '',
      endDate: '',
      enrollment_id: '',
      course_image: '',
    },
    selectRules: [(v) => !!v || "Seleccionar al menos un elemeto"],
  }),

  computed: {
    imgedit() {
      return this.imgMiniatura;
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Curso' : 'Editar Curso'
    },
    dateFormatted() {
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

  created() {
    this.business_id = localStorage.getItem('business_id');
    this.initialize()
  },

  methods: {
    updateDate(val) {
      this.input = val;
      this.editedItem.endDate = format(val, "yyyy-MM-dd");
      this.menu = false;
    },
    updateDate1(val) {
      this.input1 = val;
      this.editedItem.startDate = format(val, "yyyy-MM-dd");
      this.menu1 = false;
    },
    showStudents(item) {
      this.courseSelect = item;
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
        });
      this.dialogStudents = true;
    },
    deleteS(item) {
      this.dialogRequest = true
      //this.editedItem.branch_id=item.id
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
          console.log(this.courseSelect);
          this.showStudents(this.courseSelect)
          this.showAlert("success", "Cliente  eliminado del curso correctamente", 3000)
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
      this.editedIndex = 1;
      this.editedItem = Object.assign({}, item)
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
          this.initialize();
          this.message_delete = true
          this.showAlert("success", "Curso eliminado correctamente", 3000)
        })
      this.closeDelete()
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    closeDelete() {
      this.dialogStudents = false;
      this.dialogDelete = false;
      this.dialogRequest = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedStudent = Object.assign({}, this.defaultStudent)
        this.editedIndex = -1
      })
    },
    save() {
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
          .post('http://127.0.0.1:8000/api/course-update', formData)
          .then(() => {
            this.initialize();
            this.showAlert("success", "Curso editado correctamente", 3000)
          })
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
          .post('http://127.0.0.1:8000/api/course', formData)
          .then(() => {
            this.initialize();
            this.showAlert("success", "Curso registrado correctamente", 3000)
          })
      }
      this.close()
    },
  },
}
</script>