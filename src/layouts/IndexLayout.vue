<template>
  <q-layout view="lHh Lpr lFf">
    <router-view />
  </q-layout>
</template>

<script lang="ts" setup>
import {defineComponent} from 'vue';
import { useQuasar } from 'quasar';
</script>
<script lang="ts">
import {defineComponent} from 'vue';
import {useQuasar} from 'quasar';

export default defineComponent({
  name: 'IndexLayout',
  mounted() {
    const $q = useQuasar()
    if($q.cookies.get('user_id') !== null) {
      this.$router.push('/main')
    }
  },
});
</script>
