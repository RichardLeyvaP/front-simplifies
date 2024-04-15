<template>
  <v-app>
    <v-main>
      <v-card elevation="6" class="mx-5">
        <v-toolbar color="#F18254">
          <v-row align="center">
            <v-col cols="12" md="4" class="grow ml-4">
              <span class="text-subtitle-1"> <strong>Historial de Cliente</strong></span>
            </v-col>
            <v-col cols="12" md="4" class="mr-12"></v-col>
          </v-row>
        </v-toolbar>
        <v-container>
          <v-row>
            <!-- Primera columna -->
            <!-- Segunda columna -->
            <!-- Tercera columna -->
            <v-col cols="12" sm="12" md="4">
              <v-autocomplete v-model="client_id" :items="clients"  label="Seleccione el Cliente"
                prepend-inner-icon="mdi-account-tie-outline" item-title="name" item-value="id" variant="outlined"
                @update:model-value="clientHistory"></v-autocomplete>
            </v-col>
            <!--<v-col cols="12" sm="12" md="6">
              <v-autocomplete v-model="branch_id" :items="branches"  label="Seleccione una Sucursal"
                prepend-inner-icon="mdi-store" item-title="name" item-value="id" variant="outlined"
                @update:model-value="clientHistory"></v-autocomplete>
            </v-col>-->
          </v-row>
          <v-row v-if="client_id">

            <v-col cols="12" md="4">

              <v-card class="mx-auto" max-width="400">
                <v-img class="align-end text-white" height="300"
                  :src="'http://127.0.0.1:8000/api/images/' + results.imageLook" cover>
                  <v-card-title>

                    <v-chip class="ma-2" color="" label>
                      <v-icon icon="mdi-camera" start></v-icon>
                      Último Look
                    </v-chip>
                  </v-card-title>
                </v-img>

                <v-card-text class="pt-2">

                  {{ results.clientName }}
                  <v-chip class="ma-1 " color="warning" label size="small">
                    <v-icon icon="mdi-timer" start></v-icon>
                    {{ results.frecuencia }}
                  </v-chip>

                  <v-chip class="" color="warning" label size="small">
                    <v-icon icon="mdi-store" start></v-icon>
                    {{ results.cantVisit }} Visitas
                  </v-chip>
                  <br>
                  <v-divider class="mt-2"></v-divider>
                  <!--<v-subheader class="text-h8 mt-3">Última vez atendido</v-subheader><br>
                  <v-avatar elevation="3" class="mx-auto" max-width="60" max-height="60">
                    <v-img :src="'http://127.0.0.1:8000/api/images/' + results.image_url" alt="Imagen"></v-img>
                  </v-avatar>
                  {{ results.professionalName }}
                -->
  <v-row>
    <!-- First column -->
    <v-col cols="6" colspan="2">
      <v-subheader class="text-h8 text-center mt-3">Última vez atendido</v-subheader>
    </v-col>
  </v-row>
  <v-row>
    <!-- First column -->
    <v-col cols="6">
      {{ results.branchName }}
    </v-col>

    <!-- Second column -->
    <v-col cols="6">
      <v-avatar elevation="3" class="mx-auto" max-width="60" max-height="60">
        <v-img :src="'http://127.0.0.1:8000/api/images/' + results.image_url" alt="Imagen"></v-img>
      </v-avatar>
      {{ results.professionalName }}
    </v-col>
  </v-row>
                  <v-divider></v-divider>
                  <br>
                  <v-textarea label=" Comentario " row-height="25" rows="3" variant="outlined" auto-grow shaped
                    v-model="results.endLook" prepend-inner-icon="mdi-comment">
                  </v-textarea>
                </v-card-text>

              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="mx-auto" max-width="450">
                <v-toolbar>
                  <v-btn icon="mdi-menu" variant="text"></v-btn>

                  <v-toolbar-title class="text-subtitle-2">Servicios más demandados</v-toolbar-title>

                </v-toolbar>

                <v-list lines="two" item-props>
                  <v-list-item v-for="service in results.services" :key="service.id" :title="service.name"
                    :subtitle="service.cant">
                    <template v-slot:prepend>
                      <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                        <v-img :src="'http://127.0.0.1:8000/api/images/' + service.image_service" alt="image"></v-img>
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

                  <v-toolbar-title class="text-subtitle-2">Productos más Comprados</v-toolbar-title>

                </v-toolbar>

                <v-list lines="two" item-props>
                  <v-list-item v-for="product in results.products" :key="product.id" :title="product.name"
                    :subtitle="product.cant">
                    <template v-slot:prepend>
                      <v-avatar class="mr-5" elevation="3" color="grey-lighten-4">
                        <v-img :src="'http://127.0.0.1:8000/api/images/' + product.image_product" alt="image"></v-img>
                      </v-avatar>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import LocalStorageService from "@/LocalStorageService";
export default {
  watch: {
  },
  data() {
    return {
      branch_id: '',
      client_id: '',
      business_id: '',
      charge: '',
      results: [],
      clients: [],
      branches: [],
    };
  },
  computed: {
  },
  created() {
    // Recuperar datos del localStorage al cargar la aplicación
    this.branch_id = parseInt(LocalStorageService.getItem("branch_id"));
    this.business_id = parseInt(LocalStorageService.getItem("business_id"));
    this.charge = JSON.parse(LocalStorageService.getItem("charge"));
    /*axios
      .get('http://127.0.0.1:8000/api/show-business', {
        params: {
          business_id: this.business_id
        }
      })
      .then((response) => {
        this.branches = response.data.branches;
        //this.branch_id = !this.branch_id ? this.branch_id : this.branches[0].id;
        if (this.charge === 'Administrador') {
          this.branch_id = this.branches[0].id;
        }

        this.initialize()
      });*/

      this.initialize();
  },
  methods: {
    initialize() {
      axios
        .get('http://127.0.0.1:8000/api/client-index-autocomplete')
        .then((response) => {
          this.clients = response.data.clients;
        });
    },
    clientHistory() {
      console.log(this.client_id);
      this.results = [];
      axios
        .get('http://127.0.0.1:8000/api/client-history', {
          params: {
            //branch_id: this.branch_id,
            client_id: this.client_id
          }
        })
        .then((response) => {
          this.results = response.data.clientHistory;
        })
    },
  },
};
</script>