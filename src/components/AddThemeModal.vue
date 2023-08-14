<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn
      style="width: 100%"
      icon="menu_book"
      label="새로운 테마 추가"
      @click="open('bottom')"
    />

    <q-dialog v-model="dialog" :position="position">
      <q-card dark bordered class="bg-white my-card">
        <q-card-section>
          <q-input v-model="title" rounded filled label="테마 이름" />
        </q-card-section>
        <q-separator dark inset />
        <q-card-section class="flex row" style="padding: 0 !important">
          <q-input
            style="width: 100%; margin: 5px"
            rounded
            outlined
            label="해쉬태그"
            v-model="tags"
          />
        </q-card-section>
        <q-btn
          class="text-black"
          style="width: 100%"
          icon="edit"
          label="선택된 테마 추가하기"
          @click="onSubmit"
        />
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import axios from 'axios';

interface Place {
  name: string,
  location: string
}
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'AddThemeModal',
  components: {},
  setup() {
    const dialog = ref(false);
    const position = ref<string | any>('bottom');
    const places = ref<Place[]>([])
    const title = ref<string>('')
    const tags = ref<string>('')
    return {
      dialog,
      position,
      places,
      title, tags,
      open(pos: any) {
        position.value = pos;
        dialog.value = true;
      },
      check: ref(false),
    };
  },
  methods: {
    onSubmit: function () {
      this.dialog = !this.dialog
      axios.post('https://7ljjza9aa0.execute-api.us-east-2.amazonaws.com/default/2023-h-capstone-add-theme-modal', {
        user_id: this.$q.cookies.get('user_id'),
        title: this.title,
        tags: this.tags
      })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
});
</script>
