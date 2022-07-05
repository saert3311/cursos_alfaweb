<template>
  <q-page padding class="boxed">
    <div class="text-h3 text-center q-py-md">Lista de cursos</div>
    <div class="row q-col-gutter-md">
      <div
        class="col-12 col-md-6 col-lg-4"
        v-for="course in courses"
        :key="course.id"
      >
        <course-card :course="course" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "pinia";
import CourseCard from "src/components/CourseCard.vue";
import { useCourses } from "src/stores/CourseStore";

export default defineComponent({
  name: "IndexPage",
  components: { "course-card": CourseCard },
  computed: {
    ...mapState(useCourses, ["courses"]),
  },
});
</script>

<style>
.boxed {
  margin: 0 auto;
  max-width: 1280px;
}
</style>