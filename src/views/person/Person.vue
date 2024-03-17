<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
       <v-snackbar class="mt-12" location="right top" :timeout="sb_timeout" :color="sb_type"
        elevation="24"  :multi-line="true"  vertical v-model="snackbar">
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
          <span class="text-subtitle-1"> <strong>Listado de Profesionales</strong></span>
        </v-col>
         <v-col cols="12" md="5" class="mr-12"></v-col>
        <v-col cols="12" md="2">
          
          <v-dialog v-model="dialog" max-width="1000px">
            <template v-slot:activator="{ props }">

              <v-btn v-bind="props" class="text-subtitle-1 " color="#E7E9E9" variant="flat" elevation="2"
                prepend-icon="mdi-plus-circle">
                Agregar Profesional
              </v-btn>

            </template>
            <v-card >
              <v-toolbar color="#F18254">
                <span class="text-subtitle-2 ml-4"> Profesional</span>
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
                    <v-text-field v-model="editedItem.surname" clearable label="Primer Apellido"
                      prepend-icon="mdi-account-tie-outline" variant="underlined" :rules="nameRules">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="editedItem.second_surname" clearable label="Segundo Apellido"
                      prepend-icon="mdi-account-tie-outline" variant="underlined" :rules="nameRules">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="editedItem.email" clearable label="Correo Electrónico"
                      prepend-icon="mdi-email-outline" variant="underlined" :rules="emailRules">
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field v-model="editedItem.user" clearable label="Usuario"
                      prepend-icon="mdi-email-outline" variant="underlined">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-if="mostrar" v-model="editedItem.password" clearable label="Contraseña"
                      prepend-icon="mdi-form-textbox-password" variant="underlined" >
                    </v-text-field>
                  </v-col>  
                  <v-col cols="12" md="6">
                    <v-text-field v-model="editedItem.phone" clearable label="Teléfono" prepend-icon="mdi-phone-outline"
                      variant="underlined" :rules="mobileRules">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-autocomplete v-model="editedItem.charge_id" :items="charges" clearable label="Cargo" prepend-icon="mdi-account-tie-outline" item-title="name" item-value="id" variant="underlined" :rules="selectRules"></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-file-input clearable v-model="file" ref="fileInput" label="Avatar Professionals" variant="underlined" density="compact" name="file" accept=".png, .jpg, .jpeg" @change="onFileSelected">
                    </v-file-input>
                  </v-col>
                  <v-col cols="12" md="6">
                    <img v-if="imgedit" :src="imgedit" height="90" width="90">
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
                <span class="text-subtitle-2 ml-4"> Eliminar Profesional</span>
              </v-toolbar>

              <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el Profesional seleccionado?</v-card-text>
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
      <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details>
            </v-text-field>
      <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'"  :search="search " :items="results" class="elevation-1" no-results-text="No hay datos disponibles" no-data-text="No hay datos disponibles">
        <template v-slot:top>

          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
        </template>
        <template v-slot:item.name="{ item }">

        <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
          <v-img :src="'http://127.0.0.1:8000/api/images/'+item.image_url" alt="image"></v-img>
        </v-avatar>
        {{ item.name }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon size="25" color="blue" class="me-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon size="25" color="red" @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>




  <br>
</template>
<script>

import axios from "axios";


export default {
  data: () => ({
    valid: true,
    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title:'',
    sb_icon:'',
    mostrar: true,
    search:'',
    dialog: false,
    editando: false,
    message_delete: true,
    dialogDelete: false,
    headers: [
      { title: 'Nombre', key: 'name' },
      { title: 'Primer Apellido', key: 'surname' },
      { title: 'Segundo Apellido', key: 'second_surname' },
      { title: 'Correo', key: 'email' },
      { title: 'Teléfono', key: 'phone' },
     
      { title: 'Usuario', align: 'start', value: 'user' },
      { title: 'Cargo', align: 'start', value: 'charge' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    results: [],
    users: [],
    charges: [],
    editedIndex: -1,
    file: null,
    imgMiniatura: '',
    options: [
        {
          "name": "Si",
          "id": 1
        },
        {
          "name": "No",
          "id": 0
        }
      ],
    editedItem: {
      name: '',
      surname: '',
      user:'',
      userName: '',
      password:'',
      second_surname: '',
      email: '',
      phone: '',
      user_id: '',
      charge_id: '',
      image_url: '',
      state: '',
      id: ''
    },
    data: {},

    defaultItem: {
      name: '',
      password:'',
      user:'',
      surname: '',
      second_surname: '',
      email: '',
      phone: '',
      user_id: '',
      charge_id: '',
      image_url: '',
      state: '',
    },    
    nameRules: [
        (v) => !!v || "El campo es requerido",
        (v) => (v && v.length <= 50) ||
          "El campo debe tener menos de 51 caracteres",
          (v) => (v && v.length >= 3) ||
          "El campo debe tener al menos de 3 caracteres",
      ],
      emailRules: [
        (v) => !!v || "El Correo Electrónico es requerido",
        (v) => /.+@.+\..+/.test(v) || "El Correo Electrónico no es válido",
      ],
      mobileRules: [(v) => !!v || "El Teléfono es requerido"],
      selectRules: [(v) => !!v || "Seleccionar al menos un elemeto"],
  }),

  computed: {
    imgedit() {
        return this.imgMiniatura;
      },
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Profesional' : 'Editar Profesional'
    }
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
    this.initialize()
  },

  methods: {

    showAlert(sb_type,sb_message, sb_timeout)
    {    
      this.sb_type= sb_type

      if(sb_type=="success")
      {
        this.sb_title='Éxito'
        this.sb_icon='mdi-check-circle'
      }
      
      if(sb_type=="error")
      {
        this.sb_title='Error'
        this.sb_icon='mdi-check-circle'
      }

      if(sb_type=="warning")
      {
        this.sb_title='Advertencia'
        this.sb_icon='mdi-alert-circle'
      }
      this.sb_message= sb_message
      this.sb_timeout= sb_timeout
      this.snackbar= true
    },
    initialize() {
      axios
        .get('http://127.0.0.1:8000/api/professional')
        .then((response) => {
          this.results = response.data.professionals;
        });
        axios
        .get('http://127.0.0.1:8000/api/usuario')
        .then((response) => {
          this.users = response.data.users;
        });
        axios
        .get('http://127.0.0.1:8000/api/charge')
        .then((response) => {
          this.charges = response.data.charges;
        });
        
    },
    onFileSelected(event) {
        let file = event.target.files[0];
      this.editedItem.image_url = file;
      console.log(this.editedItem.image_url);
      this.cargarImage(file);
      },
      cargarImage(file){
        let reader = new FileReader();
        reader.onload = (e) => {
          this.imgMiniatura = e.target.result;
        }
        reader.readAsDataURL(file);
      },
    editItem(item) {
      this.file = '';
      this.imgMiniatura = 'http://127.0.0.1:8000/api/images/'+item.image_url;
      this.editedIndex = 1;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.editando = true;
      this.mostrar = false;
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
        .post('http://127.0.0.1:8000/api/professional-destroy', request)
        .then(() => {
          this.initialize();
          this.message_delete = true
          this.showAlert("success","Profesional eliminado correctamente", 3000)
        })
      this.closeDelete()
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1;
        this.imgMiniatura = '';
        this.file = '';
      })
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
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
        this.data.phone = this.editedItem.phone;
        this.data.user_id = this.editedItem.user_id;
        this.data.charge_id = this.editedItem.charge_id;
        this.data.state = this.editedItem.state;*/
        const formData = new FormData();
          for (let key in this.editedItem) {
            formData.append(key, this.editedItem[key]);
          }   
        axios
          .post('http://127.0.0.1:8000/api/professional-update', formData)
          .then(() => {
            this.initialize();
           this.showAlert("success","Profesional editado correctamente", 3000);
           this.mostrar = true;
           this.imgMiniatura = '';
            this.file = '';
          })
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
          .post('http://127.0.0.1:8000/api/register_professional', formData)
          .then(() => {
            this.initialize();
            this.showAlert("success","Profesional registrado correctamente", 3000);
            this.imgMiniatura = '';
            this.file = '';
          })
      }
      this.close()
    },
  },
}
</script>