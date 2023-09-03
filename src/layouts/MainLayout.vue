<template>
  <q-layout view="lHh Lpr lFf" v-if="this">
    <main-drawer />
    <router-view />
  </q-layout>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';
import { useQuasar } from 'quasar';
import MainDrawer from 'components/MainDrawer.vue';

export default defineComponent({
  name: 'MainLayout',
  components: { MainDrawer },
  mounted() {
    const $q = useQuasar()
    if($q.cookies.get('user_id') === null) {
      this.$router.push('/')
    }
  },
});
</script>
