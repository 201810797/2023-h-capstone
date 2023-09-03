<template>
  <div style="padding-top: 4rem; padding-bottom: 3rem; padding-left: 1rem; padding-right: 1rem">
    <q-dialog v-model="seamless" seamless position="bottom">
      <q-card style="width: 350px">
        <q-card-section class="row items-center no-wrap">
          {{'친구 목록'}}
          <q-space />
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
        <q-list bordered >
          <q-separator />
          <q-item clickable class="q-mb-sm" v-ripple v-for="(ele, index) in friendInfo" v-bind:key="index" @click="this.$router.push(`/info/friend/${ele.auth_id}`)">
            <q-item-section avatar>
              <q-avatar>
                <img :src="ele.image">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ ele.nickname }}</q-item-label>
              <q-item-label caption lines="1">{{ ele.auth_id }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-dialog>
    <q-card class="my-card" flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-btn round>
            <q-avatar>
              <img
                :src="this !== undefined ? this.$q.cookies.get('image') : ''"
              />
            </q-avatar>
          </q-btn>
        </q-item-section>
        <q-item-section>
          <q-item-label class="flex row justify-between" style="margin: 5px">
            <div style="display: inline-block !important">
              <h6 style="margin: 0; padding: 0">{{this !== undefined ? this.$q.cookies.get('nickname') : ''}}</h6>
            </div>
            <div style="display: inline-block !important">
              {{'친구 수'}} <q-btn color="white" text-color="black" :label="this.friendInfo !== undefined ? this.friendInfo.length : '0'" @click="seamless = true"/>
            </div>
          </q-item-label>
          <q-item-label caption style="margin: 5px">
            <q-btn
              color="white"
              icon="settings"
              text-color="black"
              to="/info/setting"
            />
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
      <div>
        <q-btn
          style="width: 50%"
          color="white"
          icon="star"
          text-color="black"
          to="/info/favorite"
          label="즐겨찾기 모음"
        />
        <q-btn
          style="width: 50%"
          color="white"
          icon="menu_book"
          text-color="black"
          to="/info/theme"
          label="테마 모음"
        />
      </div>
    </q-card>
    <q-card
      style="margin: 5px"
      class="my-card"
      flat
      bordered
      v-for="(locationInfo, index) in places"
      v-bind:key="index"
    >
      <q-item clickable style="padding: 0 !important" :to="locationInfo.path">
        <q-card-section horizontal>
          <q-img
            style="width: 20%"
            class="col-5"
            :src="locationInfo.image"
          />
          <q-card-section style="padding: 0">
            <q-card-section>
              {{ locationInfo.user_id }}
            </q-card-section>
            <q-card-section style="padding-top: 0">
              <q-avatar
                size="sm"
                color="red"
                text-color="white"
                icon="language"
              />
              {{ locationInfo.title }}
            </q-card-section>
          </q-card-section>
          <q-separator vertical />
          <q-card-section class="col">
            #{{locationInfo.tags}}
          </q-card-section>
        </q-card-section>
      </q-item>
      <q-separator />
    </q-card>
  </div>
</template>
<script lang="ts">
import axios from 'axios';

interface Place {
  id: number,
  title: string,
  tags: string,
  image: string,
  paths: string
}
import { defineComponent, ref } from 'vue';
export default defineComponent({
  data() {
    return {
      user_id: '',
      places: ref<Place[]>([]),
      myPlace: '',
      friendInfo: ref([]),
      seamless: false
    }
  },
  async mounted() {
    this.user_id = String(this.$q.cookies.get('user_id'))
    const res = await axios.post('https://gqdfxlv6p3.execute-api.us-east-2.amazonaws.com/default/2023-h-capstone-article-theme', {
      user_id: this.user_id
    })
    this.places = res.data.map(ele => ({
      ...ele,
      path: `/info/mymap?id=${ele.id}`
    }))
    this.friendInfo = (await axios.post(
      "https://beyhjxqxv3.execute-api.us-east-2.amazonaws.com/default/2023-c-capstone-DAO",
      {
        DML: "SELECT",
        columns: "*",
        table: "smusfollow, smususer",
        where: `smusfollow.from_id = '${this.$q.cookies.get('user_id')}' and smusfollow.to_id=auth_id`,
      },
    )).data
  },
});
</script>
