<template>
    <v-container>
    <v-stepper
      bg-color = ""
      v-model="step"
      :items="items"
      show-actions
    >
      <template v-slot:item.1>
        <h3 class="text-h6">Servicios</h3>
  
        <v-sheet border>
            <v-list>
  <v-list-item-group
    v-model="selected"
    multiple
    active-class="deep-purple--text text--accent-4"
  >
    <v-list-item
      :prepend-avatar = "'http://127.0.0.1:8000/api/images/'+service.image_service"
      v-for="service in services"
      :key="service.id"
      @click="toggleService(service.id)"
      :class="{ 'selected-item': isSelected(service.id) } "
       class="pt-4 pb-4"

    >
      
      <v-list-item-content>
        <v-list-item-title class="text-h6">{{ service.name }}</v-list-item-title>
        <v-list-item-subtitle>Precio: ${{ service.price_service }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list-item-group>
</v-list>
        </v-sheet>
      </template>
  
      <template v-slot:item.2>
        <h3 class="text-h6">Barberos Disponibles</h3>
  
        <br>
  
        <v-sheet border>
            <v-list>
  <v-list-item-group
    v-model="professional"
    
    active-class="deep-purple--text text--accent-4"
  >
    <v-list-item
      :prepend-avatar = "'http://127.0.0.1:8000/api/images/'+professional.image_url"
      v-for="professional in professionals"
      :key="professional.id"
      @click="toggleService2(professional.id)"
      :class="{ 'selected-item': isProfessional(professional.id) } "
       class="pt-4 pb-4"

    >
      
      <v-list-item-content>
        <v-list-item-title class="text-h6">{{ professional.name+' '+professional.surname+' '+professional.second_surname }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list-item-group>
</v-list>
        </v-sheet>
      </template>
  
      <template v-slot:item.3>
        <h3 class="text-h6">Confirm</h3>
  
        <br>
  
        <v-sheet border>
          <v-table>
            <thead>
              <tr>
                <th>Description</th>
                <th class="text-end">Quantity</th>
                <th class="text-end">Price</th>
              </tr>
            </thead>
  
            <tbody>
              <tr v-for="(product, index) in products" :key="index">
                <td v-text="product.name"></td>
                <td class="text-end" v-text="product.quantity"></td>
                <td class="text-end" v-text="product.quantity * product.price"></td>
              </tr>
  
              <tr>
                <td>Shipping</td>
                <td></td>
                <td class="text-end" v-text="shipping"></td>
              </tr>
  
              <tr>
                <th>Total</th>
                <th></th>
                <th class="text-end">
                  ${{ total }}
                </th>
              </tr>
            </tbody>
          </v-table>
        </v-sheet>
      </template>
    </v-stepper>
</v-container>
  </template>
  
  <script>
import axios from "axios";

    export default {
      data: () => ({
        selected_services: [],
        services: [],
        professionals: [],
        selected: [],
        professional: [],
        //
        //
        //
        //
        shipping: 0,
        step: 1,
        items: [
          'Servicios',
          'Profesionales',
          'Horario Disponible',
          'Datos Personales',
        ],
        products: [
          {
            name: 'Product 1',
            price: 10,
            quantity: 2,
          },
          {
            name: 'Product 2',
            price: 15,
            quantity: 10,
          },
        ],
      }),
  
      computed: {

        subtotal () {
          return this.products.reduce((acc, product) => acc + product.quantity * product.price, 0)
        },
        total () {
          return this.subtotal + Number(this.shipping ?? 0)
        },
      },
      mounted() {
    this.chargeServices();
     

          },

      methods:
      {

       

//servicios
        toggleService(serviceId) {
      const index = this.selected.indexOf(serviceId);
      this.chargeProfessionals();
      console.log(this.selected);
      if (index > -1) {
        this.selected.splice(index, 1);
      } else {
        this.selected.push(serviceId);
      }
    },
    isSelected(serviceId) {
      return this.selected.includes(serviceId);
    },

    //profesionales
    toggleService2(serviceId2) {
  const index = this.professional.indexOf(serviceId2);
  console.log(this.professional);
  if (index > -1) {
    // Si el servicio ya está seleccionado, no hagas nada
    return;
  }
 
  
  // Limpiar la selección anterior y agregar el nuevo servicio seleccionado
  this.professional = [serviceId2];
},
isProfessional(serviceId2) {
  return this.professional.length === 1 && this.professional[0] === serviceId2;
},
  
        chargeServices() {
      axios
        .get(`http://127.0.0.1:8000/api/branchservice-show?branch_id=1`)
        .then((response) => {
          console.log(response.data)
          this.services = response.data.services;
          

        })
        .catch((err) => {
          console.log(err, "error");
          
        });
    },

    chargeProfessionals() {
        const data = {
  services: this.selected,
  branch_id: 1
};
console.log('sssssssssssssssssss'+this.selected);
      axios
      .post(`http://127.0.0.1:8000/api/branch-professionals-service`,data)
        .then((response) => {
          console.log(response.data)
          this.professionals = response.data.professionals;
          console.log(response.data);

        })
        .catch((err) => {
          console.log(err, "error");
          /*  this.displayNotification(
              "error",
              "Error",
              "Error al obtener el calendario de la Sucursal"
            );*/
        });
    },

      }
    }
  </script>
  <style>
  .selected-item {
    background-color: orange !important;
  }

  /* Espacio entre los items */
.list-item-spacing {
  margin-bottom: 8px; /* Ajusta según necesites */
}
  </style>