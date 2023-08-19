<template>
  <q-layout style="text-align: left; padding-top: 4rem; padding-left: 1rem; padding-right: 1rem">
    <q-list bordered>
      <q-item
        v-for="(place, key) in places"
        v-bind:key="key"
        class="q-my-sm"
        clickable
        v-ripple
      >
        <q-item-section>
          <q-item-label style="font-size: 20px">{{ place.title }}</q-item-label>
          <q-item-label style="font-size: 15px" caption lines="1">
            <span v-for="(tag, key) in place.tags" v-bind:key="key">
              {{ tag }}
            </span>
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-radio v-model="shape" :val="place.id" />
        </q-item-section>
      </q-item>
      <q-separator />
    </q-list>
  </q-layout>
  <q-footer reveal elevated class="bg-black justify-end">
    <q-toolbar class="justify-between">
      <div class="flex items-center justify-end" style="width: 100%">
        <q-btn
          :to="writePath"
          icon="keyboard_tab"
          color="white"
          text-color="black"
          label="계속 작성하기"
        />
      </div>
    </q-toolbar>
  </q-footer>
</template>

<script lang="ts">
interface Place {
  id: number,
  title: string,
  tags: string,
  image: string
}
import { defineComponent, ref } from 'vue';
import { myPlaces } from 'assets/ContentModel';
import axios from 'axios';
export default defineComponent({
  name: 'ArticlePage',
  components: {},
  setup() {
    return {
      shape: ref(null),
      fixed: ref(false),
    };
  },
  data() {
    return {
      contentStyle: {
        width: '100%',
        height: '100vh',
        display: 'block',
      },
      places: ref<Place[]>([]),
      title: ref<string>(''),
      tag: ref<string>(''),
      tags: ref<string[]>([]),
      user_id: ref<string>(''),
      writePath: "/article/write"
    };
  },
  async mounted() {
    this.user_id = String(this.$q.cookies.get('user_id'))
    const res = await axios.post('https://gqdfxlv6p3.execute-api.us-east-2.amazonaws.com/default/2023-h-capstone-article-theme', {
      user_id: this.user_id
    })

    this.places = res.data
    this.writePath = `/article/write?id=${this.shape}`
    this.$q.loading.show();
    this.$q.loading.hide();
  },
  watch: {
    shape(newV, oldV) {
      this.writePath = `/article/write?id=${newV}`
    }
  },
  methods: {
    //
  },
});
</script>
