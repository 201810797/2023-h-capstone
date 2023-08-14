<template>
  <div style="padding-top: 4rem; padding-bottom: 3rem; padding-left: 1rem; padding-right: 1rem">
    <add-theme-modal />
    <q-card
      class="my-card"
      flat
      bordered
      v-for="(friendInfo, index) in places"
      v-bind:key="index"
    >
      <q-separator />
      <q-item clickable style="padding: 0 !important" to="article/write">
        <q-card-section horizontal>
<!--          <q-img-->
<!--            style="width: 20%"-->
<!--            class="col-5"-->
<!--            :src="friendInfo.placeImage"-->
<!--          />-->
          <q-card-section style="padding: 0">
            <q-card-section>
              {{ friendInfo.user_id }}
            </q-card-section>
            <q-card-section style="padding-top: 0">
              <q-avatar
                size="sm"
                color="red"
                text-color="white"
                icon="language"
              />
              {{ friendInfo.title }}
            </q-card-section>
          </q-card-section>
          <q-separator vertical />
          <q-card-section class="col">
            {{friendInfo.tags}}
          </q-card-section>
        </q-card-section>
      </q-item>
      <q-separator />
    </q-card>
  </div>
</template>

<script lang="ts">
interface FriendInfo {
  avatar: string;
  name: string;
  relationship: string;
  placeImage: string;
  post: string;
  location: string;
  tags: string[];
}
import axios from 'axios';

interface Place {
  id: number,
  title: string,
  tags: string,
  image: string
}
import { defineComponent, ref } from 'vue';
import AddThemeModal from 'components/AddThemeModal.vue';

export default defineComponent({
  name: 'MyTheme',
  components: {
    AddThemeModal,
  },
  data() {
    return {
      user_id: '',
      places: ref<Place[]>([])
    }
  },
  async mounted() {
    this.user_id = String(this.$q.cookies.get('user_id'))
    const res = await axios.post('https://gqdfxlv6p3.execute-api.us-east-2.amazonaws.com/default/2023-h-capstone-article-theme', {
      user_id: this.user_id
    })
    this.places = res.data
  }
});
</script>
