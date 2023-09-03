<template>
  <q-header elevated class = "bg-black">
    <q-toolbar>
      <q-toolbar-title
        >수뭉이네<br />밥집 <q-btn flat round dense icon="home" to="/main"
      /></q-toolbar-title>
    </q-toolbar>
  </q-header>
  <q-footer elevated class="bg-black flex column" style="heigt: 5vh">
    <q-toolbar>
      <q-tabs
        no-caps
        active-color="primary"
        style="width: 100%"
        indicator-color="transparent"
        class="text-grey-8 flex row justify-evenly"
        v-model="tab"
      >
        <q-btn
          style="margin: auto"
          flat
          color="white"
          name="home"
          icon="home"
          round
          to="/main"
        />
        <q-btn
          style="margin: auto"
          flat
          color="white"
          name="add"
          icon="add"
          round
          to="/article/theme"
        />
        <q-btn
          style="margin: auto"
          flat
          color="white"
          @click="drawer = !drawer"
          round
          dense
          icon="menu"
        />
      </q-tabs>
    </q-toolbar>
  </q-footer>

  <q-drawer v-model="drawer" show-if-above :width="200" :breakpoint="800">
    <q-dialog v-if="drawer && seamless" v-model="seamless" seamless position="top">
      <q-card style="width: 350px">
        <q-linear-progress :value="1.0" color="pink" />
        <q-card-section>
          <q-input v-model="search" filled type="search" hint="Search">
            <template v-slot:append>
              <q-icon name="search" @click="onSearch"/>
            </template>
          </q-input>
        </q-card-section>
        <q-list bordered >
          <q-separator />
          <q-item class="q-mb-sm" v-ripple v-for="(ele, index) in searchResult" v-bind:key="index">
            <q-item-section avatar>
              <q-avatar>
                <img :src="ele.image">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ ele.nickname }}</q-item-label>
              <q-item-label caption lines="1">{{ ele.auth_id }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn @click="addFriend(ele.auth_id)">
                <q-icon name="person_add" color="grey" />
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-dialog>

    <q-dialog v-model="this.regionFilterDialog" :position="this.position">
      <q-card style="width: 350px" class="flex column content-center">
        <q-card-section class="row items-center no-wrap">
          <div>
            <q-input outlined label="지역구 입력" />
            <q-btn
              style="width: 100%"
              color="white"
              text-color="black"
              label="필터링하기"
            />
          </div>
          <q-space />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="this.hashtagFilterDialog" :position="this.position">
      <q-card style="width: 350px" class="flex column content-center">
        <q-card-section class="row items-center no-wrap">
          <div>
            <q-input outlined label="해시태그 입력" />
            <q-btn
              style="width: 100%"
              color="white"
              text-color="black"
              label="필터링하기"
            />
          </div>
          <q-space />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-scroll-area
      style="
        height: calc(100% - 150px);
        margin-top: 150px;
        border-right: 1px solid #ddd;
      "
    >
      <q-list padding>
        <q-item clickable v-ripple @click="open('top', 'region')">
          <q-item-section avatar>
            <q-icon name="language" />
          </q-item-section>
          <q-item-section> 지역구 필터 </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="open('top', 'hashtag')">
          <q-item-section avatar>
            <q-icon name="tag" />
          </q-item-section>
          <q-item-section> 해시태그 필터 </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="seamless = !seamless">
          <q-item-section avatar>
            <q-icon name="add"/>
          </q-item-section>
          <q-item-section> 친구 추가 </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/info/favorite">
          <q-item-section avatar>
            <q-icon name="star" />
          </q-item-section>
          <q-item-section>즐겨찾기 모음</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/info/my">
          <q-item-section avatar>
            <q-icon name="face" />
          </q-item-section>
          <q-item-section> 마이페이지 </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-ripple @click="logout">
          <q-item-section> 로그아웃 </q-item-section>
        </q-item>
      </q-list>

    </q-scroll-area>

    <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
      <div class="absolute-bottom bg-transparent" v-if="this.$q">
        <q-avatar size="56px" class="q-mb-sm">
          <img :src="this.$q.cookies === undefined ? '' : this.$q.cookies.get('image')">
        </q-avatar>
        <div class="text-weight-bold">{{this.$q.cookies === undefined ? '' : this.$q.cookies.get('nickname')}}</div>
        <div>{{this.$q.cookies === undefined ? '' : this.$q.cookies.get('user_id')}}</div>
      </div>
    </q-img>
  </q-drawer>
</template>

<script setup>
import {ref, watch} from 'vue';
import axios from 'axios';
import {useQuasar} from 'quasar';
const seamless = ref(false)
const drawer =  ref(false);
const tab = ref('home');
const search = ref('')
const searchResult = ref([])
const $q = useQuasar()
const onSearch = async () => {
  try {
    const response = await axios
      .post(
        "https://beyhjxqxv3.execute-api.us-east-2.amazonaws.com/default/2023-c-capstone-DAO",
        {
          DML: "SELECT",
          columns: "*",
          table: "smususer",
          where: `(auth_id like '%${search.value}%' or nickname like '%${search.value}%') and auth_id != '${$q.cookies.get('user_id')}'`,
        },
      )
    searchResult.value = response.data
  }
  catch (e) {
    console.log('search error', e)
  }
}
const addFriend = async (auth_id) => {
  try {
    await axios.post(
      "https://beyhjxqxv3.execute-api.us-east-2.amazonaws.com/default/2023-c-capstone-DAO",
      {
        DML: "INSERT",
        table: "smusfollow",
        columns: "from_id, to_id",
        values: `'${$q.cookies.get('user_id')}', '${auth_id}'`,
      },
    );
    await axios.post(
      "https://beyhjxqxv3.execute-api.us-east-2.amazonaws.com/default/2023-c-capstone-DAO",
      {
        DML: "INSERT",
        table: "smusfollow",
        columns: "from_id, to_id",
        values: `'${auth_id}', '${$q.cookies.get('user_id')}'`,
      },
    );
  }
  catch (e) {
    console.log("addFriend error", e)
  }
  window.location.reload()
}
watch([drawer, searchResult], ([newDrawerValue, newSearchResultValue], [oldDrawerValue, OldSearchResultValue]) => {
  if(!newDrawerValue) {
    seamless.value = false
  }
  console.log(searchResult)
}, {deep: true})
</script>
<script>
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'MainDrawer',
  created() {
    if(this.$q.cookies.get('user_id') === undefined) {
      this.$router.push('/')
    }
  },
  methods: {
    logout: function () {
      this.$q.cookies.remove('user_id');
      this.$q.cookies.remove('user_name');
      this.$q.cookies.remove('user_picture');
      this.$router.push('/')
    },
  }
});
</script>
