import { defineStore } from "pinia";
//uso este estore para controlar los modales
export const useModal = defineStore("ModalStore", {
  state: () => ({
    newCourseControl: false,
    editCourseControl: false,
    deleteCourseControl: false,
  }),
  getters: {},
  actions: {},
});
