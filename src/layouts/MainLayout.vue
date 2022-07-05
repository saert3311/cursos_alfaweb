<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-avatar class="q-ml-sm">
          <svg
            id="Capa_1"
            data-name="Capa 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 189.53 189.6"
          >
            <path
              d="M5.24,99.82C5,47.89,48,5.08,100.25,5.2c51.95.12,94.72,43,94.51,95.19-.21,51.88-42.95,94.57-95.08,94.41C47.73,194.64,4.78,151.85,5.24,99.82Zm80.45,39.4h7.06c8,0,16,0,24,0,2.73,0,4.41-1.51,4.4-3.67s-1.67-3.58-4.4-3.69c-.43,0-.86,0-1.29,0H89.32q-13.47,0-26.95,0c-2.33,0-2.41-.19-1.25-2.23l.43-.74L97.21,68.2c1.39-2.36,1.55-2.36,2.94,0q19.83,33.61,39.67,67.22a9.17,9.17,0,0,0,1.47,2.08c1.23,1.15,2.75,1.73,4.28.69a3.4,3.4,0,0,0,1.33-4.32,11.52,11.52,0,0,0-.88-1.71q-16.38-27.95-32.77-55.89c-3.64-6.21-7.25-12.44-10.94-18.62-1.88-3.15-4.46-3.14-6.53-.07-.32.48-.61,1-.89,1.46q-19.48,33.19-39,66.4c-1.59,2.7-3.24,5.37-4.72,8.14-1.57,3-.27,5.26,3,5.6.71.07,1.42.05,2.14.05Z"
              transform="translate(-5.24 -5.2)"
              style="fill: #fff"
            />
          </svg>
        </q-avatar>

        <q-toolbar-title> Cursos Alpha Web </q-toolbar-title>

        <div>{{ user.email }}</div>
        <q-btn
          outline
          color="white"
          icon="logout"
          class="q-ml-md"
          @click="processLogout"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section @click="$router.push('/')"> Inicio </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section @click="$router.push('/admin')">
              Administrar
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="web" />
            </q-item-section>
            <q-item-section @click="openGithub()"> Repositorio </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import { mapState, mapActions } from "pinia";
import { useAuth } from "../stores/AuthStore";
import { useCourses } from "src/stores/CourseStore";
import { openURL } from "quasar";

export default defineComponent({
  name: "MainLayout",
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  computed: {
    ...mapState(useAuth, ["user"]),
  },
  mounted() {
    this.refreshUser();
    this.processLoad();
  },
  methods: {
    ...mapActions(useAuth, ["refreshUser", "logoutUser"]), //puedo tener diferentes contenedores de estados con pinia
    ...mapActions(useCourses, ["fetchCourses"]), //asi que puedo llamar a cada uno segun lo necesite
    processLogout() {
      if (this.logoutUser()) {
        this.$q.notify({
          type: "info",
          message: `Saliste satisfactoriamente`,
        });
        this.$router.push("/user/login");
      }
    },
    async processLoad() {
      this.$q.loading.show();
      await this.fetchCourses();
      this.$q.loading.hide();
    },
    openGithub() {
      openURL("https://github.com/saert3311/cursos_alfaweb");
    },
  },
  watch: {
    $route(to, from) {
      this.processLoad(); //me aseguro de refrescar los datos al cambiar de ruta, mas que todo pensando si estuviesemos en un entorno multiusuario
    },
  },
});
</script>



