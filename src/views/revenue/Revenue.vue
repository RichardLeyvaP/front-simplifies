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
         <span class="text-subtitle-1"> <strong>Operaciones de Ingresos</strong></span>
       </v-col>
        <v-col cols="12" md="5" class="mr-12"></v-col>
       <v-col cols="12" md="2">          
       
           <v-dialog v-model="dialog" max-width="600">
             <template v-slot:activator="{ props }">              
               <v-btn v-bind="props" class="text-subtitle-1  ml-12 " color="#E7E9E9" variant="flat" elevation="2"
               prepend-icon="mdi-plus-circle">
               Nuevo Ingreso
             </v-btn>
             </template>
             <v-card>
               <v-toolbar color="#F18254">
               <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
             </v-toolbar>
                 <v-card-text>
                   <v-form ref="form" v-model="valid" enctype="multipart/form-data">
                   <v-container>
                     <v-row>
                       <v-col cols="12" md="10">
                      
                           <v-text-field v-model="editedItem.name" clearable label="Nombre del ingreso" prepend-icon="mdi-format-list-bulleted-type"
                     variant="underlined" :rules="nameRules">
                   </v-text-field>

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
           <v-dialog v-model="dialogDelete" max-width="500px">
             <v-card>
              
             <v-toolbar color="red">
               <span class="text-subtitle-2 ml-4"> Eliminar operación de Ingreso</span>
             </v-toolbar>        

               <v-card-text class="mt-2 mb-2"> ¿Desea eliminar la operación de ingreso?</v-card-text>
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
              hide-details></v-text-field>
   <v-data-table :headers="headers" :items-per-page-text="'Elementos por páginas'" :search="search" :items="results" class="elevation-1" no-data-text="No hay datos disponibles"
     no-results-text="No hay datos disponibles">
     <template v-slot:item.actions="{ item }">
       <!--<v-icon size="25" color="blue" class="me-2" @click="editItem(item)">
         mdi-pencil
       </v-icon>
       <v-icon size="25" color="red" @click="deleteItem(item)">
         mdi-delete
       </v-icon>-->
       <v-btn density="comfortable" icon="mdi-pencil"  @click="editItem(item)" color="primary" variant="tonal"
            elevation="1" class="mr-1 mt-1 mb-1" title="Editar operación de ingreso"></v-btn>
          <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="red-darken-4" variant="tonal"
            elevation="1" title="Eliminar operación de ingreso"></v-btn>
     </template>
   </v-data-table>
 </v-card-text>
   </v-card>
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
    search: '',
   dialog: false,
   dialogDelete: false,

   headers: [

     { title: 'Nombre del Ingreso', key: 'name' },
     { title: 'Acciones', key: 'actions', sortable: false },
   ],
   results: [],
   editedIndex: -1,

   editedItem: {
     name: '',
     id: ''
   },
   data: {},

   defaultItem: {
     name: '',
   },



   nameRules: [
     (v) => !!v || "El campo es requerido",
     /*(v) =>
       (v && v.length <= 40) ||
       "El campo debe tener menos de 41 caracteres",
(v) => /^[a-zA-ZáÁéÉíÍóÓúÚñÑ\s']+$/.test(v) || "El campo no es válido",*/],
 }),

 computed: {
   formTitle() {
     return this.editedIndex === -1 ? 'Nueva operación de ingreso' : 'Editar operación de ingreso'
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
       .get('http://127.0.0.1:8000/api/revenue')
       .then((response) => {
         this.results = response.data.revenues;
       })
   },
   editItem(item) {
     this.editedIndex = 1;
     this.editedItem = Object.assign({}, item)
     this.dialog = true
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
       .post('http://127.0.0.1:8000/api/revenue-destroy', request)
       .then(() => {
         this.initialize();
         this.showAlert("success","Operación de Ingreso eliminada correctamente", 3000)
       }).catch(()=>{
         this.showAlert("error","No se puede Eliminar la operación de Ingreso", 3000)
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
     this.dialogDelete = false
     this.$nextTick(() => {
       this.editedItem = Object.assign({}, this.defaultItem)
       this.editedIndex = -1
     })
   },
    save() {    
       if (this.editedIndex > -1) {
         this.valid = false,
         this.data.id = this.editedItem.id;
         this.data.name = this.editedItem.name;
         axios
           .put('http://127.0.0.1:8000/api/revenue', this.data)
           .then(() => {
             this.initialize();
             this.showAlert("success","Ingreso actualizado correctamente", 3000)
           })
       } else {
         this.valid = false,
         this.data.name = this.editedItem.name;
         axios
           .post('http://127.0.0.1:8000/api/revenue', this.data)
           .then(() => {
             this.initialize();
             this.showAlert("success","Ingreso registrado correctamente", 3000)
           })
       }
       this.close()
    

   },
 },
}
</script>