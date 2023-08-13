<!--<template>-->
<!--  <div-->
<!--    style="height: 100vh"-->
<!--    class="flex row justify-center items-center content-center"-->
<!--  >-->
<!--    <q-btn-->
<!--      @click="kakao_signin"-->
<!--      style="margin: auto"-->
<!--      size="60px"-->
<!--      round-->
<!--      color="deep-orange"-->
<!--      icon="edit_location"-->
<!--    />-->
<!--  </div>-->
<!--</template>-->

<!--<script lang="ts">-->
<!--import {defineComponent, ref} from 'vue';-->

<!--export default defineComponent({-->
<!--  name: 'IndexPage',-->
<!--  components: {},-->
<!--  setup() {-->
<!--    return {-->
<!--    };-->
<!--  },-->
<!--  mounted() {-->
<!--    if(Kakao.Auth.getAccessToken() != null) {-->
<!--      this.$router.push('/main')-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    kakao_signin: function () {-->
<!--      Kakao.Auth.authorize(-->
<!--      { redirectUri: 'https://xa3kge3eskjrhwxaefosvqa3kq0ugcth.lambda-url.us-east-2.on.aws' }-->
<!--      );-->
<!--    }-->
<!--  }-->
<!--});-->
<!--</script>-->

<template>
  <div class="q-pa-md" view="hHh lpR fFf">
    <q-layout
      view="lHh lpr lFf"
      container
      style="height: 100vh"
      class="shadow-2 rounded-borders"
    >
      <q-header bordered class="bg-white text-primary">
        <q-toolbar>
          <q-toolbar-title class="text-center">
            <h3 style="margin: 5%">수뭉이네밥집</h3>
          </q-toolbar-title>
        </q-toolbar>
      </q-header>
      <footer class="fixed-bottom" style="text-align: center">
        <span>2023-h-capstone</span>
      </footer>
      <q-page-container>
        <div class="q-pa-md" style="max-width: 100vw; margin: auto">
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-input
              filled
              v-model="id"
              label="ID"
              hint="아이디를 입력해주세요"
              aria-autocomplete="none"
              autocomplete="off"
              lazy-rules
              :rules="[
                (val) => (val && val.length >= 0) || '아이디를 입력해주세요',
              ]"
            ></q-input>
            <q-input
              filled
              type="password"
              v-model="password"
              label="Password"
              hint="비밀번호를 입력해주세요"
              maxlength="20"
              aria-autocomplete="none"
              autocomplete="off"
              lazy-rules
              :rules="[
                (val) => (val && val.length >= 0) || '비밀번호를 입력해주세요',
                (val) =>
                  (val && val.length <= 20) || '패스워드는 20자 이내입니다',
              ]"
            ></q-input>
            <q-toggle
              v-model="autoSignIn"
              label="자동로그인"
              keep-color
              checked-icon="check"
              unchecked-icon="clear"
            />
            <div>
              <q-btn
                unelevated
                rounded
                label="로그인"
                type="submit"
                color="primary"
              ></q-btn>
            </div>
          </q-form>
        </div>
        <div class="row justify-center" style="margin: 10% 0 auto 0">
          <q-btn
            style="width: 70%"
            class="btn-fixed-width"
            @click="normalSignup"
            unelevated
            rounded
            color="primary"
            label="회원가입"
          />
        </div>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';

export default defineComponent({
  name: 'SignIn',
  components: {},
  setup() {
    const $q = useQuasar();
    const cookieOptions = {
      path: '/',
      expires: '24h',
    };
    $q.loading.show({
      delay: 400, // ms
    });

    $q.loading.hide();
    return {
      $q,
      cookieOptions,
    };
  },
  data() {
    return {
      id: '',
      password: '',
      autoSignIn: false,
    };
  },
  async mounted() {
    //
  },
  methods: {
    /** MARK: 회원가입
     * */
    onSubmit: async function () {
      /** 로그인 api 추가 **/
      const res = await axios.post('https://h8viqjk6ob.execute-api.us-east-2.amazonaws.com/default/2023-c-capstone-login', {
        id: this.id,
        password: this.password
      })
      const statusCode = res.status
      switch (statusCode) {
        // 계정 정보 존재하는 경우 status 201
        case 201:
          this.$q.cookies.set('user_id', res.data.id, this.cookieOptions);
          this.$q.cookies.set('user_name', res.data.nickname, this.cookieOptions);
          this.$q.cookies.set('user_picture', res.data.picture, this.cookieOptions);
          this.$router.push('/main')
          break
        // 계정 정보 맞지 않은 경우 status 202
        case 202:
          alert('아이디 혹은 패스워드 오류')
          break
        default:
          break
      }
    },
    setSessionKey: async function (user_key: string) {
      const key = JSON.stringify(crypto.randomUUID())
        .toUpperCase()
        .replaceAll('-', '');
      await fetch('http://127.0.0.1:3000/DAO/INSERT', {
        method: 'POST',
        body: new URLSearchParams({
          table: 'sessions',
          columns: '`key`, user_key',
          values: `'${key}', ${user_key}`,
        }),
      });
      this.$q.cookies.set('session_key', key, this.cookieOptions);
    },
    /** MARK: index 페이지 입장 시 자동로그인 체크
     * */
    getSessionKey: async function () {
      // MARK: 세션키를 가지고 있다면
      if (this.$q.cookies.has('session_key')) {
        // MARK: 만료 일자 검색
        const expire = await (
          await fetch('http://127.0.0.1:3000/DAO/SELECT', {
            method: 'POST',
            body: new URLSearchParams({
              columns: '*',
              table: 'sessions',
              where: `\`key\` = '${this.$q.cookies.get('session_key')}'`,
            }),
          })
        ).json();
        // MARK: 세션 키 만료일자가 현재 시각보다 이전일경우 세션키 만료
        if (new Date(expire[0].expire) < new Date(Date.now())) {
          await fetch('http://127.0.0.1:3000/DAO/DETETE', {
            method: 'POST',
            body: new URLSearchParams({
              from: 'sessions',
              where: `\`key\` = '${this.$q.cookies.get('session_key')}'`,
            }),
          });
          this.$q.cookies.remove('session_key');
          return false
        }
        // MARK: 세션 키 만료일자가 현재 시각보다 이후일경우 자동로그인 등록
        else {
          const auto_signin_result = await (
            await fetch('http://127.0.0.1:3000/DAO/SELECT', {
              method: 'POST',
              body: new URLSearchParams({
                columns: '*',
                table: 'user',
                where: `\`key\` in ( SELECT user_key FROM sessions WHERE \`key\` = '${this.$q.cookies.get(
                  'session_key'
                )}')`,
              }),
            })
          ).json();
          this.$q.cookies.set(
            'user_key',
            this.$q.cookies.get('user_key'),
            this.cookieOptions
          );
          this.$q.cookies.set(
            'user_id',
            this.$q.cookies.get('user_id'),
            this.cookieOptions
          );
          this.$q.cookies.set(
            'user_nickname',
            this.$q.cookies.get('user_nickname'),
            this.cookieOptions
          );
          this.$q.cookies.set(
            'user_image',
            this.$q.cookies.get('user_image'),
            this.cookieOptions
          );
          this.$q.cookies.set(
            'session_key',
            this.$q.cookies.get('session_key'),
            this.cookieOptions
          );
          return true;
        }
      } else {
        return false;
      }
    },
    onReset: function () {
      console.log('reset');
    },
    normalSignup: function () {
      this.$router.push('/signup/normal');
    },
    rand: function (max: number, min: number) {
      return Math.floor(Math.random() * (max - min) + min);
    },
  },
});
</script>
