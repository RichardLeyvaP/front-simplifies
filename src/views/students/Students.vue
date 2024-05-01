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
     <span class="text-subtitle-1"> <strong>Listado de Estudiantes</strong></span>
   </v-col>
   <v-col cols="12" md="4" class="mr-12"></v-col>
   <v-col cols="12" md="3" class="pl-12 ">
     
     <v-dialog v-model="dialog" max-width="1000px">
       <template v-slot:activator="{ props }">

         <v-btn v-bind="props" class="text-subtitle-1  ml-12  " color="#E7E9E9" variant="flat" elevation="2"
           prepend-icon="mdi-plus-circle">
           Agregar Estudiante
         </v-btn>

       </template>
       <v-card>
         <v-toolbar color="#F18254">
           <span class="text-subtitle-2 ml-4"> Estudiante</span>
         </v-toolbar>
         <v-card-text>
           <v-form v-model="valid" enctype="multipart/form-data">
           <v-row>
             <v-col cols="12" md="4">
               <v-text-field v-model="editedItem.name" clearable label="Nombre"
                 prepend-icon="mdi-account-tie-outline" variant="underlined" :rules="nameRules">
               </v-text-field>

             </v-col>
             <v-col cols="12" md="4">
               <v-text-field v-model="editedItem.surname" clearable label="Primer Apellido"
                 prepend-icon="mdi-account-tie-outline" variant="underlined" :rules="nameRules">
               </v-text-field>

             </v-col>
             <v-col cols="12" md="4">
               <v-text-field v-model="editedItem.second_surname" clearable label="Segundo Apellido"
                 prepend-icon="mdi-account-tie-outline" variant="underlined" :rules="nameRules">
               </v-text-field>
             </v-col>
           </v-row>
           <v-row>
             <v-col cols="12" md="6">
               <v-text-field v-model="editedItem.email" clearable label="Correo Electrónico"
                 prepend-icon="mdi-email-outline" variant="underlined" :rules="emailRules">
               </v-text-field>
             </v-col>
             <v-col cols="12" md="6">
               <v-text-field v-model="editedItem.phone" clearable label="Teléfono" prepend-icon="mdi-phone-outline"
                 variant="underlined" :rules="mobileRules">
               </v-text-field>
             </v-col>
           </v-row>
           <v-row>
             <v-col cols="12" md="6">
               <v-file-input clearable v-model="file" ref="fileInput" label="Imagen de Estudiante" variant="underlined" density="compact" name="file" accept=".png, .jpg, .jpeg" @change="onFileSelected">
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
           <v-btn color="#F18254" variant="flat" @click="save"  :disabled="!valid">
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
           <span class="text-subtitle-2 ml-4"> Eliminar Estudiante</span>
         </v-toolbar>

         <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el Estudiante seleccionado?</v-card-text>
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
 <v-data-table :headers="headers"  :items="results" :search="search" class="elevation-1" no-data-text="No hay datos disponibles"
   no-results-text="No hay datos disponibles">
   <template v-slot:top>

     <v-divider class="mx-4" inset vertical></v-divider>
     <v-spacer></v-spacer>
   </template>
   <template v-slot:item.name="{ item }">

   <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
     <v-img :src="'http://127.0.0.1:8000/api/images/'+item.student_image" alt="image"></v-img>
   </v-avatar>
   {{ item.name }}
   </template>
   <template v-slot:item.actions="{ item }">
     <!--<v-icon size="25" color="blue" class="me-2" @click="editItem(item)">
       mdi-pencil
     </v-icon>
     <v-icon size="25" color="red" @click="deleteItem(item)">
       mdi-delete
     </v-icon>-->
     <v-btn density="comfortable" icon="mdi-pencil"  @click="editItem(item)" color="primary" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Editar Estudiante"></v-btn>
          <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar Estudiante"></v-btn>
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
search:'',
editando: false,
dialog: false,
message_delete: true,
dialogDelete: false,
headers: [
 { title: 'Nombre', key: 'name' },
 { title: 'Primer Apellido', key: 'surname' },
 { title: 'Segundo Apellido', key: 'second_surname' },
 { title: 'Correo', key: 'email' },
 { title: 'Teléfono', key: 'phone' },
 { title: 'Acciones', key: 'actions', sortable: false },
],
results: [],
editedIndex: -1,
users: [],
file: null,
imgMiniatura: '',
editedItem: {
 name: '',
 surname: '',
 second_surname: '',
 email: '',
 phone: '',
 student_image: '',
 id: ''
},
data: {},

defaultItem: {
 name: '',
 surname: '',
 second_surname: '',
 email: '',
 phone: '',
 student_image: '',
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
 return this.editedIndex === -1 ? 'Nueva Persona' : 'Editar Persona'
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
this.initialize()
},

methods: {
  imagenDisponible() {
      if (this.imgedit !== undefined && this.imgedit !== '') {
      
        // Intenta cargar la imagen en un elemento oculto para verificar si está disponible
        let img = new Image();
        img.src = this.imgedit;

        return true; // Devuelve true si la imagen está disponible
      }
      return false; // Si la URL de la imagen no está definida o está vacía, devuelve false*/
    },
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
   .get('http://127.0.0.1:8000/api/student')
   .then((response) => {
     this.results = response.data.clients;
   });
   /*axios
   .get('http://127.0.0.1:8000/api/usuario')
   .then((response) => {
     this.users = response.data.users;
   });*/
},
onFileSelected(event) {
   let file = event.target.files[0];
 this.editedItem.student_image = file;
 console.log("esta es la imagen")
 console.log(this.editedItem.student_image);
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
  this.file = null;
      var img = new Image();
      img.src = 'http://127.0.0.1:8000/api/images/' + item.student_image;
      img.onload = () => {
        this.imgMiniatura = 'http://127.0.0.1:8000/api/images/' + item.student_image;
      };
      img.onerror = () => {
        this.imgMiniatura = '';
      };
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
   .post('http://127.0.0.1:8000/api/student-destroy', request)
   .then(() => {
     this.initialize();
     this.message_delete = true
     this.showAlert("success","Estudiante eliminado correctamente", 3000)
   })
 this.closeDelete()
},
close() {
 this.dialog = false
 this.$nextTick(() => {
   this.editedItem = Object.assign({}, this.defaultItem)
   this.editedIndex = -1
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
   const formData = new FormData();
     for (let key in this.editedItem) {
       formData.append(key, this.editedItem[key]);
     }  
   axios
     .post('http://127.0.0.1:8000/api/student-update', formData)
     .then(() => {
       this.initialize();
      this.showAlert("success","Estudiante editado correctamente", 3000)
      this.imgMiniatura = '';
        this.file = '';
     })
 } else {
   this.valid = false;
   const formData = new FormData();
     for (let key in this.editedItem) {
       formData.append(key, this.editedItem[key]);
     } 
   axios
     .post('http://127.0.0.1:8000/api/student', formData)
     .then(() => {
       this.initialize();
       this.showAlert("success","Estudiante registrado correctamente", 3000)
       this.imgMiniatura = '';
        this.file = '';
     })
 }
 this.close()
},
},
}
</script>