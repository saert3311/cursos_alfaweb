<template>
  <q-card flat bordered>
    <q-card-section horizontal>
      <q-icon
        :name="stat.icon"
        :color="stat.color"
        size="4rem"
        class="q-pa-sm"
      />
      <q-card-section>
        <div class="text-h6">{{ stat.text }}</div>
        <div class="text-subtitle2">{{ stat.data() }}</div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "InfoCard",
  props: ["stat"],
};
</script>

<style>
</style>