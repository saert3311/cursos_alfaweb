<template>
  <q-page padding class="boxed">
    <div class="text-h3 text-center q-py-md">
      Administración
      <q-btn
        color="secondary"
        icon-right="post_add"
        label="Agregar"
        @click="updateForm(true)"
      />
    </div>
    <div class="q-gutter-md">
      <q-table
        title="Cursos Registrados"
        :rows="courses"
        :columns="columns"
        row-key="id"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="quota" :props="props">
              {{ props.row.quota }}
            </q-td>
            <q-td key="registered" :props="props">
              {{ props.row.registered }}
            </q-td>
            <q-td key="duration" :props="props">
              {{ props.row.duration }}
            </q-td>
            <q-td key="cost" :props="props" class="text-center">
              <q-btn
                unelevated
                rounded
                color="secondary"
                :label="costLocale(props.row.cost)"
              />
            </q-td>
            <q-td key="finished" :props="props">
              <q-icon
                v-if="props.row.finished"
                color="primary"
                name="check_circle"
                size="2em"
              />
              <q-icon
                v-else
                color="negative"
                name="remove_circle_outline"
                size="2em"
              />
            </q-td>
            <q-td key="date" :props="props">
              <q-btn
                unelevated
                rounded
                color="secondary"
                :label="dateLocale(props.row.date)"
              />
            </q-td>
            <q-td key="actions" :props="props">
              <div class="q-pa-xs q-gutter-sm">
                <q-btn
                  round
                  color="deep-orange"
                  icon="edit"
                  @click="
                    $router.push({
                      name: 'editCourse',
                      params: { id: props.row.id },
                    })
                  "
                >
                  <q-tooltip> Editar </q-tooltip></q-btn
                >
                <q-btn
                  round
                  color="black"
                  icon="delete"
                  @click="tryDeleteCourse(props.row.id)"
                  ><q-tooltip> Eliminar </q-tooltip></q-btn
                >
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="row q-col-gutter-md q-ma-sm justify-center">
        <div class="col-12 col-md-4" v-for="stat in statics" :key="stat.icon">
          <info-card :stat="stat" />
        </div>
      </div>
    </div>
  </q-page>
  <new-course />
  <delete-course :courseData="courseToDelete" />
</template>

<script>
import { mapState, mapWritableState } from "pinia";
import { useCourses } from "src/stores/CourseStore";
import { useModal } from "src/stores/ModalStore";
import InfoCard from "components/InfoCard.vue";
import NewCourse from "components/NewCourse.vue";
import DeleteDialog from "components/DeleteDialog.vue";
export default {
  name: "AdminPage",
  components: {
    "info-card": InfoCard,
    "new-course": NewCourse,
    "delete-course": DeleteDialog,
  },
  data() {
    return {
      display: false,
      columns: [
        {
          name: "name",
          required: true,
          align: "left",
          label: "Curso",
          field: "name",
          sortable: true,
        },
        {
          name: "quota",
          align: "left",
          label: "Cupos",
          field: "quota",
          sortable: true,
        },
        {
          name: "registered",
          align: "left",
          label: "Inscritos",
          field: "registered",
          sortable: true,
        },
        {
          name: "duration",
          align: "left",
          label: "Duración",
          field: "duration",
          sortable: true,
        },
        {
          name: "cost",
          align: "left",
          label: "Costo",
          field: "cost",
          sortable: true,
        },
        {
          name: "finished",
          align: "left",
          label: "Terminado",
          field: "finished",
          sortable: true,
        },
        {
          name: "date",
          align: "left",
          label: "Fecha",
          field: "date",
          sortable: true,
        },
        {
          name: "actions",
          align: "left",
          label: "Acciones",
          field: "actions",
          sortable: false,
        },
      ],
      statics: [
        {
          icon: "people",
          data: () => this.fullResume.max_alumns,
          color: "deep-purple",
          text: "Alumnos permitidos",
        },
        {
          icon: "account_box",
          data: () => this.fullResume.total_alumns,
          color: "indigo-9",
          text: "Alumnos inscritos",
        },
        {
          icon: "event_available",
          data: () => this.fullResume.avaliable,
          color: "green-9",
          text: "Cupos restantes",
        },
        {
          icon: "cancel",
          data: () => this.fullResume.finished,
          color: "deep-orange-9",
          text: "Cursos terminados",
        },
        {
          icon: "notifications_active",
          data: () => this.fullResume.running,
          color: "positive",
          text: "Cursos activos",
        },
        {
          icon: "add_alert",
          data: () => this.fullResume.total_courses,
          color: "lime-10",
          text: "Total cursos",
        },
      ],
      courseToDelete: "",
    };
  },
  computed: {
    ...mapState(useCourses, ["courses", "fullResume"]),
    ...mapWritableState(useModal, [
      "newCourseControl",
      "editCourseControl",
      "deleteCourseControl",
    ]),
  },
  methods: {
    costLocale(cost) {
      return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
      }).format(cost);
    },
    dateLocale(date) {
      return date.toDate().toLocaleDateString("es-CL");
    },
    updateForm(value) {
      //este metodo me permite sincronizar el estado del popup entre ambos componentes
      this.newCourseControl = value;
    },
    tryDeleteCourse(id) {
      this.courseToDelete = this.courses.find((course) => course.id == id); //establesco valor para pasar como prop al dialogo
      this.deleteCourseControl = true; //muestro el dialog, la eliminacion se procesa desde alla
    },
  },
};
</script>

<style>
</style>