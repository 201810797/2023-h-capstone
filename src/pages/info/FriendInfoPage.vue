<template>
  <div style="padding-top: 4rem; padding-bottom: 3rem; padding-left: 1rem; padding-right: 1rem">
    <q-card class="my-card" flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-btn round>
            <q-avatar>
              <img
                :src="this.info['image']"
              />
            </q-avatar>
          </q-btn>
        </q-item-section>
        <q-item-section>
          <q-item-label class="flex row justify-between" style="margin: 5px">
            <span>
              <h6 style="margin: 0; padding: 0">{{this.info['nickname']}}</h6>
            </span>
            친구 <q-btn color="white" @click="seamless = true" text-color="black" :label="this.friendInfo !== undefined ? this.friendInfo.length : '0'" />
          </q-item-label>
          <q-item-label caption style="margin: 5px">친구</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-btn
        style="width: 100%"
        color="white"
        text-color="black"
        icon="content_cut"
        label="친구 추가 취소하기"
      />
      <q-separator />
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
              {{ locationInfo.title }}
            </q-card-section>
            <q-card-section style="padding-top: 0">
              <q-avatar
                size="sm"
                color="red"
                text-color="white"
                icon="language"
              />
              {{ locationInfo.location }}
            </q-card-section>
          </q-card-section>
          <q-separator vertical />
          <q-card-section class="col">
            {{locationInfo.tags}}
          </q-card-section>
        </q-card-section>
      </q-item>
      <q-separator />
    </q-card>
    <q-dialog v-model="seamless" seamless position="bottom">
      <q-card style="width: 350px">
        <q-card-section class="row items-center no-wrap">
          {{'친구 목록'}}
          <q-space />
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
        <q-list bordered >
          <q-separator />
          <q-item clickable class="q-mb-sm" v-ripple v-for="(ele, index) in friendInfo" v-bind:key="index" @click="toFriendInfo(ele.auth_id)">
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
  name: 'FriendInfoPage',
  components: {},
  setup() {
    return {
      //
    };
  },
  data() {
    return {
      user_id: '',
      places: ref<Place[]>([]),
      myPlace: '',
      friendInfo: ref([]),
      info: ref({}),
      seamless: false
    }
  },
  async mounted() {
    // 현재 경로를 가져옵니다.
    const currentPath = this.$router.currentRoute.value.fullPath;

    // 경로를 '/' 문자로 분리하여 배열로 만듭니다.
    const pathSegments = currentPath.split('/');

    // 배열에서 'c'를 추출합니다. 'c'는 배열의 마지막 요소입니다.
    const friendId = pathSegments[pathSegments.length - 1];

    this.info = (await axios.post(
      "https://beyhjxqxv3.execute-api.us-east-2.amazonaws.com/default/2023-c-capstone-DAO",
      {
        DML: "SELECT",
        columns: "*",
        table: "smususer",
        where: `auth_id = '${friendId}'`,
      },
    )).data[0]

    this.friendInfo = (await axios.post(
      "https://beyhjxqxv3.execute-api.us-east-2.amazonaws.com/default/2023-c-capstone-DAO",
      {
        DML: "SELECT",
        columns: "*",
        table: "smusfollow, smususer",
        where: `smusfollow.from_id = '${friendId}' and smusfollow.to_id=auth_id`,
      },
    )).data
    const res = await axios.post('https://gqdfxlv6p3.execute-api.us-east-2.amazonaws.com/default/2023-h-capstone-article-theme', {
      user_id: this.info['auth_id']
    })
    this.places = res.data.map(ele => ({
      ...ele,
      path: `/info/mymap?id=${ele.id}`
    }))
    console.log(this.places)
  },
  methods: {
    toFriendInfo: function (id) {
      location.href = `/info/friend/${id}`
    }
  }
});
</script>
