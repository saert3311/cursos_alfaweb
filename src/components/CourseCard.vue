<template>
  <q-card>
    <q-img
      :src="course.img"
      :alt="course.name"
      :fit="cover"
      class="course-img"
    />
    <q-card-section>
      <div class="text-h6">{{ course.name }}</div>
      <div class="text-subtitle2">
        Completado:
        <q-icon
          v-if="course.finished"
          color="primary"
          name="check_circle"
          size="1.3em"
        />
        <q-icon
          v-else
          color="negative"
          name="remove_circle_outline"
          size="1.3em"
        />
      </div>
    </q-card-section>
    <q-list>
      <q-item clickable>
        <q-item-section avatar>
          <q-icon color="green-9" name="payments" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Costo</q-item-label>
          <q-item-label caption>{{ costLocale }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section avatar>
          <q-icon color="primary" name="schedule" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Duración</q-item-label>
          <q-item-label caption>{{ course.duration }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section avatar>
          <q-icon color="teal-9" name="people" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Cupos</q-item-label>
          <q-item-label caption>{{ course.quota }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section avatar>
          <q-icon color="deep-orange-9" name="date_range" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Fecha de Registro</q-item-label>
          <q-item-label caption>{{ dateLocale }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section avatar>
          <q-icon color="secondary" name="description" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Descripción</q-item-label>
          <q-item-label caption>{{ course.desc }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script>
export default {
  name: "CourseCard",
  props: ["course"],
  computed: {
    costLocale() {
      return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
      }).format(this.course.cost);
    },
    dateLocale() {
      return this.course.date.toDate().toLocaleDateString("es-CL");
    },
  },
};
</script>

<style>
.course-img {
  min-height: 200px;
  max-height: 200px;
}
</style>