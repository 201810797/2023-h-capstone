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

    <q-dialog v-model="this.dialog" :position="this.position">
      <q-card style="width: 350px" class="flex column content-center">
        <q-card-section class="row items-center no-wrap">
          <div>
            <q-input outlined label="id입력" />
            <q-btn
              style="width: 100%"
              color="white"
              text-color="black"
              label="요청"
            />
          </div>
          <q-space />
        </q-card-section>
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
        <q-item clickable v-ripple @click="open('top')">
          <q-item-section avatar>
            <q-icon name="add" />
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

    <q-img
      class="absolute-top"
      src="https://i.pinimg.com/564x/2d/de/41/2dde4170e8b2b36265057013ebe7cfd2.jpg"
      style="height: 150px"
    >
      <div class="absolute-bottom bg-transparent">
        <div class="text-weight-bold text-black">수뭉이네 밥집</div>
      </div>
    </q-img>
  </q-drawer>
</template>

<script setup lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
const $q = useQuasar()
const dialog = ref(false);
const regionFilterDialog = ref(false);
const hashtagFilterDialog = ref(false);
const position = ref('top');
const drawer =  ref(false);
const tab = ref('home');
const open = (pos: string, filter?: string) => {
  position.value = pos;
  if (filter === 'region') {
    regionFilterDialog.value = true;
  } else if (filter === 'hashtag') {
    hashtagFilterDialog.value = true;
  } else {
    dialog.value = true;
  }
}
</script>
<script lang="ts">
import {defineComponent} from 'vue';
import {useQuasar} from 'quasar';

export default defineComponent({
  name: 'MainDrawer',
  methods: {
    logout: function () {
      this.$q.cookies.remove('user_id');
      this.$q.cookies.remove('user_name');
      this.$q.cookies.remove('user_picture');
      this.$router.push('/')
    }
  }
});
</script>
