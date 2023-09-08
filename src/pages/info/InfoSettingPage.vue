<template>
  <div v-if="this.$q" style="padding-top: 4rem; padding-bottom: 3rem; padding-left: 1rem; padding-right: 1rem">
    <q-card class="my-card">
      <q-item clickable class="flex justify-center items-center column">
        <q-item-section style="padding: 0" avatar>
          <q-avatar rounded size="96px">
            <input
              type="file"
              accept="image/*"
              @change="handleImageChange"
              style="opacity: 0; position: absolute; top: 0; left: 0; width: 100%; height: 100%; cursor: pointer;"
            />
            <img
              :src="previewImage"
              alt="미리보기"
              @click="openFileInput"
              style="cursor: pointer;"
            />
            <q-badge floating color="teal"
            ><q-avatar rounded icon="edit" size="24px"
            /></q-badge>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label style="font-size: 18px">{{ $q.cookies.get('user_id') }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-list bordered separator>
        <q-item clickable v-ripple>
          <q-item-section>닉네임</q-item-section>
          <q-item-section side style="margin: 10px">{{this.$q.cookies.get('nickname')}}</q-item-section>
          <q-btn round icon="edit" />
        </q-item>
        <q-separator />
        <q-item>
          <q-btn
            class="text-red"
            style="width: 100%"
            label="계정 삭제하기"
          ></q-btn>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';



const $q = useQuasar();
const selectedImage = ref('');
const previewImage = ref($q.cookies.get('image'));
const openFileInput = () => {
  const inputElement = document.querySelector('input[type="file"]');
  if (inputElement) {
    inputElement.click();
  }
};

const handleImageChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    // 선택한 이미지 파일을 업로드하고 미리보기에 설정합니다.
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result.split(',')[1];
      previewImage.value = reader.result;
      await axios.post(
        "https://v6zrlbp2u0.execute-api.us-east-2.amazonaws.com/default/2023-h-capstone-upload",
        {
          /**API JSON 형식 참조하여 post 요청을 보내주세요**/
          type: "user",
          fileName: file.name, // 저장할 파일명
          file: JSON.stringify(base64Image), // 파일 값
          id: $q.cookies.get('_key'),
          user_id: $q.cookies.get('user_id')
        },
      );
      $q.cookies.set("image",
        `https://2023-h-capstone.s3.us-east-2.amazonaws.com/user/${$q.cookies.get('user_id')}/${file.name}`)
    };
    reader.readAsDataURL(file);
  }
};
</script>
