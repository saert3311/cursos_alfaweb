<template>
  <div class="q-pa-md row justify-center items-center q-gutter-md">
    <q-card class="login-card">
      <q-card-section>
        <div class="row justify-center">
          <svg
            id="LogoSvg"
            data-name="Capa 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 189.53 189.6"
            class="q-my-md"
          >
            <path
              d="M5.24,99.82C5,47.89,48,5.08,100.25,5.2c51.95.12,94.72,43,94.51,95.19-.21,51.88-42.95,94.57-95.08,94.41C47.73,194.64,4.78,151.85,5.24,99.82Zm80.45,39.4h7.06c8,0,16,0,24,0,2.73,0,4.41-1.51,4.4-3.67s-1.67-3.58-4.4-3.69c-.43,0-.86,0-1.29,0H89.32q-13.47,0-26.95,0c-2.33,0-2.41-.19-1.25-2.23l.43-.74L97.21,68.2c1.39-2.36,1.55-2.36,2.94,0q19.83,33.61,39.67,67.22a9.17,9.17,0,0,0,1.47,2.08c1.23,1.15,2.75,1.73,4.28.69a3.4,3.4,0,0,0,1.33-4.32,11.52,11.52,0,0,0-.88-1.71q-16.38-27.95-32.77-55.89c-3.64-6.21-7.25-12.44-10.94-18.62-1.88-3.15-4.46-3.14-6.53-.07-.32.48-.61,1-.89,1.46q-19.48,33.19-39,66.4c-1.59,2.7-3.24,5.37-4.72,8.14-1.57,3-.27,5.26,3,5.6.71.07,1.42.05,2.14.05Z"
              transform="translate(-5.24 -5.2)"
              style="fill: #000"
            />
          </svg>
        </div>
        <div class="text-h4 text-center">Login</div>
        <div class="text-subtitle2 text-center">Bienvenido</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="email"
          label="Email"
          class="q-my-md"
          :error="v$.email.$invalid"
          bottom-slots
        >
          <template v-slot:error>
            <span v-for="error of v$.email.$errors" :key="error.$uid">
              {{ error.$message }}</span
            >
          </template>
        </q-input>
        <q-input
          type="password"
          v-model="password"
          label="Contraseña"
          class="q-my-md"
          :error="v$.password.$invalid"
          bottom-slots
        >
          <template v-slot:error>
            <span v-for="error of v$.password.$errors" :key="error.$uid">
              {{ error.$message }}</span
            >
          </template></q-input
        >
        <div class="text-center text-body2">
          Si no tienes cuenta puedes crear una
          <router-link to="/user/register">aqui</router-link>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="center">
        <q-btn flat @click="tryLogin">Entrar</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import { mapActions, mapState } from "pinia";
import { useAuth } from "../stores/AuthStore";
export default {
  name: "LoginPage",
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  validations() {
    return {
      email: {
        required: helpers.withMessage("El email es requerido", required),
        email: helpers.withMessage("El email debe ser valido", email),
        $lazy: true,
      },
      password: {
        required: helpers.withMessage("Necesitamos una contraseña", required),
        $lazy: true,
      },
    };
  },
  computed: {
    ...mapState(useAuth, ["user"]),
  },
  methods: {
    ...mapActions(useAuth, ["loginUser"]),
    async tryLogin() {
      this.$q.loading.show();
      const { email, password } = this;
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return this.$q.loading.hide();
      const result = await this.loginUser({ email: email, password: password });
      if (result == "authenticated") {
        this.$router.push("/");
        this.$q.loading.hide();
        this.$q.notify({
          type: "positive",
          message: `Bienvenido ${this.user.email}`,
        });
      } else {
        this.$q.loading.hide();
        this.$q.notify({
          type: "negative",
          message: result,
        });
      }
    },
  },
};
</script>

<style lang="scss">
.login-card {
  width: 100%;
  max-width: 300px;
}
#LogoSvg {
  max-height: 150px;
}
</style>