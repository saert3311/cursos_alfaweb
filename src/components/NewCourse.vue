<template>
  <q-dialog v-model="newCourseControl">
    <q-card style="width: 500px; max-width: 90vw">
      <q-toolbar>
        <q-avatar>
          <q-icon
            name="add_comment"
            color="primary"
            size="1.2rem"
            class="q-pa-sm"
          />
        </q-avatar>

        <q-toolbar-title
          ><span class="text-weight-bold">Nuevo curso</span></q-toolbar-title
        >

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <div class="q-gutter-md">
          <q-input
            v-model="form.name"
            label="Nombre"
            :error="v$.form.name.$invalid"
            bottom-slots
          >
            <template v-slot:error>
              <span v-for="error of v$.form.name.$errors" :key="error.$uid">
                {{ error.$message }}
                <br v-if="v$.form.name.$errors.length > 1" />
              </span>
            </template>
          </q-input>
          <q-input
            v-model="form.img"
            label="Url de la imagen del curso"
            :error="v$.form.img.$invalid"
            bottom-slots
          >
            <template v-slot:error>
              <span v-for="error of v$.form.img.$errors" :key="error.$uid">
                {{ error.$message }}
                <br v-if="v$.form.img.$errors.length > 1" />
              </span>
            </template>
          </q-input>
          <div class="row">
            <div class="col-6 col-sm-4 q-px-sm">
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
            <div class="col-6 col-sm-4 q-px-sm">
              <q-input
                v-model="form.cost"
                label="Costo del curso"
                type="number"
                :error="v$.form.cost.$invalid"
                bottom-slots
              >
                <template v-slot:error>
                  <span v-for="error of v$.form.cost.$errors" :key="error.$uid">
                    {{ error.$message }}
                    <br v-if="v$.form.cost.$errors.length > 1" />
                  </span>
                </template>
              </q-input>
            </div>
          </div>
          <q-input
            v-model="form.duration"
            label="Duración del curso"
            :error="v$.form.duration.$invalid"
            bottom-slots
          >
            <template v-slot:error>
              <span v-for="error of v$.form.duration.$errors" :key="error.$uid">
                {{ error.$message }}
                <br v-if="v$.form.duration.$errors.length > 1" />
              </span>
            </template>
          </q-input>
          <q-input
            v-model="form.desc"
            label="Descripción"
            type="textarea"
            :error="v$.form.desc.$invalid"
            bottom-slots
          >
            <template v-slot:error>
              <span v-for="error of v$.form.desc.$errors" :key="error.$uid">
                {{ error.$message }}
                <br v-if="v$.form.desc.$errors.length > 1" />
              </span>
            </template>
          </q-input>
        </div>
      </q-card-section>
      <q-separator />

      <q-card-actions align="right">
        <q-btn color="primary" icon="save" label="Guardar" @click="trySave" />
        <q-btn flat @click="closeModal">Cancelar</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
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
import { useCourses } from "src/stores/CourseStore";
import { useModal } from "src/stores/ModalStore";
import { mapActions, mapWritableState } from "pinia";
export default {
  name: "NewCourse",
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  props: ["display"],
  data() {
    return {
      form: {
        cost: 0,
        desc: "",
        duration: "",
        finished: false,
        img: "",
        name: "",
        quota: 0,
        registered: 0,
      },
    };
  },
  validations() {
    return {
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
    ...mapActions(useCourses, ["createCourse", "fetchCourses"]),
    closeModal() {
      this.newCourseControl = false;
    },
    async trySave() {
      this.$q.loading.show();
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) {
        return this.$q.loading.hide();
      }
      const resp = await this.createCourse(this.form);
      if (resp.id !== undefined) {
        this.newCourseControl = false; //oculto popup primero para hacer todo detras
        (this.form = {
          cost: 0,
          desc: "",
          duration: "",
          finished: false,
          img: "",
          name: "",
          quota: 0,
          registered: 0,
        }),
          await this.fetchCourses();
        this.v$.$reset();
        this.$q.loading.hide();
        this.$q.notify({
          type: "positive",
          message: `Curso registrado`,
        });
      } else {
        this.$q.loading.hide();
        this.$q.notify({
          type: "negative",
          message: resp,
        });
      }
    },
  },
  computed: {
    ...mapWritableState(useModal, ["newCourseControl"]),
  },
};
</script>

<style>
</style>