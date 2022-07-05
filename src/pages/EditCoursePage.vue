<template>
  <q-page padding class="boxed">
    <div class="text-h3 text-center q-py-md">Editando Curso</div>
    <div class="row q-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section class="q-mb-md">
            <div class="row">
              <div class="col-12 col-md-8">
                <div class="q-gutter-md">
                  <div class="row">
                    <div class="col-12 col-md-6 q-pr-xs">
                      <q-input
                        v-model="form.name"
                        label="Nombre"
                        :error="v$.form.name.$invalid"
                        bottom-slots
                      >
                        <template v-slot:error>
                          <span
                            v-for="error of v$.form.name.$errors"
                            :key="error.$uid"
                          >
                            {{ error.$message }}
                            <br v-if="v$.form.name.$errors.length > 1" />
                          </span>
                        </template>
                      </q-input>
                    </div>
                    <div class="col-12 col-md-6 q-pl-xs">
                      <q-input
                        v-model="form.img"
                        label="Url de la imagen del curso"
                        :error="v$.form.img.$invalid"
                        bottom-slots
                      >
                        <template v-slot:error>
                          <span
                            v-for="error of v$.form.img.$errors"
                            :key="error.$uid"
                          >
                            {{ error.$message }}
                            <br v-if="v$.form.img.$errors.length > 1" />
                          </span>
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-6 col-sm-4 q-pr-xs">
                      <q-input
                        v-model="form.quota"
                        label="Cupos del curso"
                        :error="v$.form.quota.$invalid"
                        bottom-slots
                      >
                        <template v-slot:error>
                          <span
                            v-for="error of v$.form.quota.$errors"
                            :key="error.$uid"
                          >
                            {{ error.$message }}
                            <br v-if="v$.form.quota.$errors.length > 1" />
                          </span>
                        </template>
                      </q-input>
                    </div>
                    <div class="col-6 col-sm-4 q-px-sm">
                      <q-input
                        v-model="form.registered"
                        label="Incritos del curso"
                        :error="v$.form.registered.$invalid"
                        bottom-slots
                      >
                        <template v-slot:error>
                          <span
                            v-for="error of v$.form.registered.$errors"
                            :key="error.$uid"
                          >
                            {{ error.$message }}
                            <br v-if="v$.form.registered.$errors.length > 1" />
                          </span>
                        </template>
                      </q-input>
                    </div>
                    <div class="col-6 col-sm-4 q-pl-xs">
                      <q-input
                        v-model="form.cost"
                        label="Costo del curso"
                        type="number"
                        :error="v$.form.cost.$invalid"
                        bottom-slots
                      >
                        <template v-slot:error>
                          <span
                            v-for="error of v$.form.cost.$errors"
                            :key="error.$uid"
                          >
                            {{ error.$message }}
                            <br v-if="v$.form.cost.$errors.length > 1" />
                          </span>
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 col-md-4 q-pr-xs">
                      <q-input
                        v-model="form.duration"
                        label="Duración del curso"
                        :error="v$.form.duration.$invalid"
                        bottom-slots
                      >
                        <template v-slot:error>
                          <span
                            v-for="error of v$.form.duration.$errors"
                            :key="error.$uid"
                          >
                            {{ error.$message }}
                            <br v-if="v$.form.duration.$errors.length > 1" />
                          </span>
                        </template>
                      </q-input>
                    </div>
                    <div class="col-12 col-md-8 q-pl-xs">
                      <q-input
                        v-model="form.desc"
                        label="Descripción"
                        :error="v$.form.desc.$invalid"
                        bottom-slots
                      >
                        <template v-slot:error>
                          <span
                            v-for="error of v$.form.desc.$errors"
                            :key="error.$uid"
                          >
                            {{ error.$message }}
                            <br v-if="v$.form.desc.$errors.length > 1" />
                          </span>
                        </template>
                      </q-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-4 q-px-md">
                <q-img
                  :src="this.form.img"
                  :alt="this.form.name"
                  :fit="cover"
                  class="course-img"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-md-3">
                <q-toggle v-model="form.finished" label="Curso Finalizado" />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  v-model="stringDate"
                  label="Fecha"
                  type="date"
                  :error="v$.stringDate.$invalid"
                  bottom-slots
                >
                  <template v-slot:error>
                    <span
                      v-for="error of v$.form.stringDate.$errors"
                      :key="error.$uid"
                    >
                      {{ error.$message }}
                      <br v-if="v$.form.stringDate.$errors.length > 1" />
                    </span>
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>
          <q-separator />

          <q-card-actions align="right">
            <q-btn
              color="primary"
              icon="save"
              label="Guardar"
              @click="trySave"
            />
            <q-btn flat @click="goLastPage()">Cancelar</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import {
  required,
  helpers,
  maxValue,
  minValue,
  url,
} from "@vuelidate/validators";
import { mapActions } from "pinia";
import { useCourses } from "src/stores/CourseStore";
export default {
  name: "EditCoursePage",
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      stringDate: "",
      form: {
        cost: 0,
        desc: "",
        duration: "",
        finished: false,
        img: "",
        name: "",
        quota: 0,
        registered: 0,
        date: {},
      },
    };
  },
  validations() {
    return {
      stringDate: {
        required: helpers.withMessage("Se requiere fecha", required),
        $lazy: true,
      },
      form: {
        cost: {
          minValue: helpers.withMessage("El costo no puede ser 0", minValue(1)),
          required: helpers.withMessage("El costo es requedido", required),
          $lazy: true,
        },
        desc: {
          required: helpers.withMessage(
            "La descripción es requerida",
            required
          ),
          $lazy: true,
        },
        duration: {
          required: helpers.withMessage(
            "La duración del curso es requerida",
            required
          ),
          $lazy: true,
        },
        img: {
          required: helpers.withMessage("Necesitamos una url", required),
          url: helpers.withMessage("No es una url valida", url),
          $lazy: true,
        },
        name: {
          required: helpers.withMessage("El nombre es requerido", required),
          $lazy: true,
        },
        quota: {
          minValue: helpers.withMessage("El valor es invalido", minValue(1)),
          required: helpers.withMessage("Campo requerido", required),
          $lazy: true,
        },
        registered: {
          minValue: helpers.withMessage("El valor es invalido", minValue(1)),
          maxValue: helpers.withMessage(
            "Numero de registros supera los cupos",
            maxValue(this.form.quota)
          ),
          required: helpers.withMessage("Campo requerido", required),
          $lazy: true,
        },
      },
    };
  },
  methods: {
    ...mapActions(useCourses, ["fetchCourseById", "updateCourse"]),
    async mountData() {
      try {
        //prefero hacer fetch directamente del firebase para estar seguro que estoy trabajando con la info mas actualizada
        const result = await this.fetchCourseById(this.$route.params.id);
        if ("error" in result) {
          throw this.form.error;
        }
        this.form = result.course;
        this.stringDate = result.stringDate;
      } catch (e) {
        this.$q.notify({
          type: "negative",
          message: e,
        });
        this.$router.push("/admin");
      }
    },
    async trySave() {
      this.$q.loading.show();
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) {
        return this.$q.loading.hide();
      }
      const resp = await this.updateCourse({
        docData: this.form,
        stringDate: this.stringDate,
      });
      if (resp === "ok") {
        this.$router.push("/admin");
        this.$q.notify({
          type: "positive",
          message: `Curso Actualizado`,
        });
      } else {
        this.$q.loading.hide();
        this.$q.notify({
          type: "negative",
          message: resp.error,
        });
      }
    },
    goLastPage() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.mountData();
  },
};
</script>

<style>
.boxed {
  margin: 0 auto;
  max-width: 1280px;
}
</style>