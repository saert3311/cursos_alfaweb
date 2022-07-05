<template>
  <q-dialog v-model="deleteCourseControl" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="delete" color="primary" text-color="white" />
        <span class="q-ml-sm"
          >Deseas eliminar el curso<br />{{ courseData.name }}</span
        >
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn
          label="Eliminar"
          icon="delete_forever"
          color="primary"
          @click="processDelete(courseData.id)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import { useModal } from "src/stores/ModalStore";
import { useCourses } from "src/stores/CourseStore";
export default {
  name: "DeleteDialog",
  props: ["courseData"],
  computed: {
    ...mapWritableState(useModal, ["deleteCourseControl"]),
  },
  methods: {
    ...mapActions(useCourses, ["deleteCourseById", "fetchCourses"]),
    async processDelete(id) {
      this.$q.loading.show();
      try {
        const resp = await this.deleteCourseById(id);
        if (resp === "ok") {
          this.deleteCourseControl = false;
          await this.fetchCourses();
          this.$q.loading.hide();
          this.$q.notify({
            type: "positive",
            message: `Curso Eliminado`,
          });
        } else {
          this.deleteCourseControl = false;
          await this.fetchCourses();
          this.$q.loading.hide();
          this.$q.notify({
            type: "negative",
            message: resp.error,
          });
        }
      } catch (e) {
        console.log(e);
        this.$q.loading.hide();
        await this.fetchCourses();
      }
    },
  },
};
</script>

<style>
</style>