<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  watch: {
    $route: {
      inmediate: true,
      handler(to, from) {
        document.title = to.meta.title || "Cursos Alfaweb";
      },
    },
  },
});
</script>
