<template>
  <div class="q-pa-md" view="hHh lpR fFf">
    <q-layout
      view="lHh lpr lFf"
      container
      style="height: 100vh"
      class="shadow-2 rounded-borders"
      v-if="this"
    >
      <q-header bordered class="bg-white text-primary">
        <q-toolbar>
          <q-toolbar-title class="text-center">
            <h4 style="margin: 5%">회원가입</h4>
          </q-toolbar-title>
        </q-toolbar>
      </q-header>
      <footer class="fixed-bottom" style="text-align: center">
        <span>2023-h-capstone</span>
      </footer>
      <q-page-container>
        <router-view></router-view>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import NormalSignUp from 'pages/signup/NormalSignUp.vue';
export default defineComponent({
  name: 'SignUp',
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
