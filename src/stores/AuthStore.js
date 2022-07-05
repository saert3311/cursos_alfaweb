//estoy probando pinia como gestor de estado para vue 3 sera el que vendra por defecto en las nuevas instalaciones
//de hecho tambien este proyecto lo inicie con vue 3 para ir probandolo

import { defineStore } from "pinia";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

export const useAuth = defineStore("AuthStore", {
  state: () => ({
    isAuthenticated: false,
    isLoading: false,
    user: {},
  }),
  getters: {},
  actions: {
    async loginUser(payload) {
      const { email, password } = payload;
      try {
        let result = await signInWithEmailAndPassword(auth, email, password);
        if ("user" in result) {
          this.user = result.user;
          this.isAuthenticated = true;
          return "authenticated";
        }
      } catch (e) {
        console.log(e);
        return { error: e.message };
      }
    },
    async registerUser(payload) {
      const { email, password } = payload;
      try {
        let result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        if ("user" in result) {
          this.user = result.user;
          this.isAuthenticated = true;
          return true;
        }
      } catch (e) {
        console.log(e);
        return { error: e.message };
      }
    },
    async logoutUser() {
      try {
        await signOut(auth);
        this.user = {};
        this.isAuthenticated = false;
        return true;
      } catch (e) {
        console.log(e);
      }
    },
    refreshUser() {
      // con esto me aseguro que si cierro la pagina no pierdo la sesion
      onAuthStateChanged(auth, (user) => {
        if (user && this.isAuthenticated == false) {
          this.user = user;
          this.isAuthenticated = true;
        }
      });
    },
  },
});
