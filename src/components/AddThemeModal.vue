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
          <q-input rounded filled label="테마 이름" />
        </q-card-section>
        <q-separator dark inset />
        <q-card-section class="flex row" style="padding: 0 !important">
          <q-input
            style="width: 30%; margin: 5px"
            rounded
            outlined
            label="지역구"
          />
          <q-input
            style="width: 60%; margin: 5px"
            rounded
            outlined
            label="음식점 이름"
          />
        </q-card-section>
        <q-card-section class="flex row" style="padding: 0 !important">
          <q-input
            style="width: 100%; margin: 5px"
            rounded
            outlined
            label="해쉬태그"
          />
        </q-card-section>
        <q-card-section>
          <q-item tag="label" v-ripple>
            <q-item-section class="text-black flex row" style="font-size: 14px">
              <span style="display: inline-block">상호명</span>
              <span>주소</span>
            </q-item-section>
            <q-item-section side top>
              <q-checkbox v-model="check" />
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item tag="label" v-ripple>
            <q-item-section class="text-black flex row" style="font-size: 14px">
              <span style="display: inline-block">상호명</span>
              <span>주소</span>
            </q-item-section>
            <q-item-section side top>
              <q-checkbox v-model="check" />
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item tag="label" v-ripple>
            <q-item-section class="text-black flex row" style="font-size: 14px">
              <span style="display: inline-block">상호명</span>
              <span>주소</span>
            </q-item-section>
            <q-item-section side top>
              <q-checkbox v-model="check" />
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item tag="label" v-ripple>
            <q-item-section class="text-black flex row" style="font-size: 14px">
              <span style="display: inline-block">상호명</span>
              <span>주소</span>
            </q-item-section>
            <q-item-section side top>
              <q-checkbox v-model="check" />
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item tag="label" v-ripple>
            <q-item-section class="text-black flex row" style="font-size: 14px">
              <span style="display: inline-block">상호명</span>
              <span>주소</span>
            </q-item-section>
            <q-item-section side top>
              <q-checkbox v-model="check" />
            </q-item-section>
          </q-item>
          <q-separator />
        </q-card-section>
        <q-btn
          class="text-black"
          style="width: 100%"
          icon="edit"
          label="선택된 테마 추가하기"
          @click="dialog = !dialog"
        />
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
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
    return {
      dialog,
      position,
      places,

      open(pos: any) {
        position.value = pos;
        dialog.value = true;
      },
      check: ref(false),
    };
  },
});
</script>
