<template>
  <q-dialog v-model="commentModal">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">댓글</div>
      </q-card-section>
      <div v-if="comments.length !== 0" >
        <q-item v-for="(comment, index) in comments" :key="index" class="q-mb-sm" clickable v-ripple>
          <q-item-section avatar>
            <q-avatar>
              <img :src="comment.image !== undefined ? comment.image : ''">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ comment.comment }}</q-item-label>
            <q-item-label caption lines="1">{{ comment.nickname }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="chat_bubble" color="grey" />
          </q-item-section>
        </q-item>
      </div>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="commentText" autofocus @keyup.enter="addComment" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="취소" v-close-popup />
        <q-btn flat label="댓글 추가" @click="addComment" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-layout id="map" :style="mapStyle"></q-layout>

  <q-footer reveal elevated class="bg-black justify-end">
    <q-toolbar class="justify-between">
      <q-list style="width: 100%" class="flex row justify-start">
        <q-item v-for="(item, key) in placeCategory" v-bind:key="key" clickable>
          <q-item-section>
            <q-item-label>{{ item }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-btn color="white" text-color="black" label="댓글 보기" @click="showComment"/>
      <q-btn
        to="/main"
        style="width: 10%"
        icon="check"
        color="white"
        text-color="black"
      />
    </q-toolbar>
  </q-footer>
</template>

<script lang="ts">
interface Place {
  title: string,
  tags: string,
  image: string
}
interface Location {
  id: number,
  x: string,
  y: string,
  category_name: string,
  place_name: string,
  road_address_name: string,
}
import { defineComponent, ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'WritePage',
  components: {},
  setup() {
    return {
      seamless: ref(false),
      commentModal: ref(false)
    };
  },
  data() {
    return {
      mapStyle: {
        width: '100%',
        height: '100vh',
        display: 'block',
      },
      map: ref(null),
      infowindow: ref(null),
      ps: ref(null),
      searchText: ref<string>(''),
      hashTagFilter: ref<string>(''),
      placeFilter: ref<string>(''),
      markers: ref<any>([]),
      places: ref<any>([]),
      placeCategory: ref<string[]>([]),
      favoriteFlag: false,
      gradeFlag: false,
      tag: ref<string>(''),
      tags: ref<string>(''),
      placeName: ref<string>(''),
      placeAddress: ref<string>(''),
      myPlaces: ref<Place[]>([]),
      placesInfos: ref<Location[]>([]),
      x: '',
      y: '',
      category_name: '',
      place_name: '',
      road_address_name: '',
      commentText: '',
      comments: []
    };
  },
  async mounted() {
    let res = await axios.post('https://beyhjxqxv3.execute-api.us-east-2.amazonaws.com/default/2023-c-capstone-DAO', {
      DML: 'SELECT',
      columns: '*',
      table: 'smuslocation',
      where: `post_id=${this.$route.query.id}`
    })
    this.placesInfos = res.data
    res = await axios.post('https://beyhjxqxv3.execute-api.us-east-2.amazonaws.com/default/2023-c-capstone-DAO', {
      DML: 'SELECT',
      columns: '*',
      table: 'smuspost',
      where: `id=${this.$route.query.id}`
    })
    this.myPlaces = res.data
    this.placeCategory = this.myPlaces.tags;
    res = await axios.post('https://beyhjxqxv3.execute-api.us-east-2.amazonaws.com/default/2023-c-capstone-DAO', {
      DML: 'SELECT',
      columns: '*',
      table: 'smuscomment',
      where: `post_id=${this.$route.query.id}`
    })
    this.comments = res.data.map(({ comment, from_image: image, from_nickname: nickname }) => ({
      comment,
      image,
      nickname
    }))
    this.$q.loading.show();
    setTimeout(() => {
      if (!window.kakao || !window.kakao.maps) {
        // script 태그 객체 생성
        const script = document.createElement('script');
        // src 속성을 추가하며 .env.local에 등록한 service 키 활용
        // 동적 로딩을 위해서 autoload=false 추가
        script.src =
          '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=' +
          `${process.env.KAKAOMAP_KEY}` +
          '&libraries=services,clusterer,drawing';
        /* global kakao */
        document.head.appendChild(script);
        script.addEventListener('load', () => {
          kakao.maps.load(this.initMap);
        });
      } else {
        this.initMap();
      }
      this.showPlace(0);
      this.$q.loading.hide();
    }, 1000);
  },
  methods: {
    initMap: function () {
      setTimeout(() => {
        const container = document.getElementById('map');
        const options = {
          center: new kakao.maps.LatLng(37.566826, 126.9786567),
          level: 5,
        };
        this.map = new kakao.maps.Map(container, options);
        this.infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
        this.ps = new kakao.maps.services.Places();
      }, 100);
    },
    addPlace: async function () {
      this.seamless = false
      await axios.post('https://beyhjxqxv3.execute-api.us-east-2.amazonaws.com/default/2023-c-capstone-DAO', {
        DML: 'INSERT',
        table: 'smuslocation',
        columns: 'post_id,x,y,category_name,place_name,road_address_name',
        values: `${this.$route.query.id}, '${this.x}', '${this.y}', '${this.category_name}', '${this.place_name}', '${this.road_address_name}'`
      })
    },
    placesSearchCB: function (
      data: string | any[],
      status: any,
      pagination: any
    ) {
      if (status === kakao.maps.services.Status.OK) {
        // MARK: 기존 마커 삭제
        if (this.markers.length !== 0) {
          if (this.infowindow != null) {
            this.infowindow.close();
          }
          for (let i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
          }
          this.markers = [];
        }
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds();
        this.places = [];
        for (let i = 0; i < data.length; i++) {
          this.places.push(data[i]);
          this.displayMarker(data[i]);
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        if (this.map != null) {
          // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
          this.map.setBounds(bounds);
        }
      }
    },
    // 지도에 마커를 표시하는 함수입니다
    displayMarker: function (place: {
      y: any;
      x: any;
      place_name: string;
      road_address_name: string;
      category_name: string;
    }) {
      // 마커를 생성하고 지도에 표시합니다
      const marker = new kakao.maps.Marker({
        map: this.map,
        position: new kakao.maps.LatLng(place.y, place.x),
      });
      this.markers.push(marker);
      // 마커에 클릭이벤트를 등록합니다
      kakao.maps.event.addListener(marker, 'click', () => {

        this.placeName = place.place_name;
        this.placeAddress = place.road_address_name;
        if (this.infowindow != null) {
          this.seamless = true
          this.x = place.x
          this.y = place.y
          this.category_name = place.category_name
          this.place_name = place.place_name
          this.road_address_name = place.road_address_name
          // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
          this.infowindow.setContent('');
          this.infowindow.open(this.map, marker);
        }
      });
    },
    search: function () {
      if (this.ps != null) {
        this.ps.keywordSearch(this.searchText, this.placesSearchCB);
        this.searchText = '';
      }
    },
    searchPlaces: function () {
      if (this.ps != null) {
        this.ps.keywordSearch(this.tag, this.placesSearchCB);
        this.tag = '';
      }
    },
    addMarker: function (
      position: any,
      place: {
        y: any;
        x: any;
        place_name: string;
        road_address_name: string;
        category_name: string;
      }
    ) {
      // 마커를 생성합니다
      const marker = new kakao.maps.Marker({
        position: position,
      });
      // 마커가 지도 위에 표시되도록 설정합니다
      marker.setMap(this.map);
      // 생성된 마커를 배열에 추가합니다
      this.markers.push(marker);
      // 마커에 클릭이벤트를 등록합니다
      kakao.maps.event.addListener(marker, 'click', () => {
        this.placeName = place.place_name;
        this.placeAddress = place.road_address_name;
        let placeTheme = '';
        place.category_name.split(' > ').forEach((e) => {
          placeTheme += `#${e}`;
        });
        if (this.infowindow != null) {
          // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
          this.infowindow.setContent(
            `
<div style="padding:5px;font-size:12px;margin: auto;">
                    <p>${place.place_name}</p>
                    <p>${place.road_address_name}</p>
                    <p>${placeTheme}</p>
                    </div>`
          );
          this.infowindow.open(this.map, marker);
        }
      });
    },
    // 배열에 추가된 마커들을 지도에 표시하거나 삭제하는 함수입니다
    setMarkers: function (map: any) {
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(map);
      }
    },
    // "마커 보이기" 버튼을 클릭하면 호출되어 배열에 추가된 마커를 지도에 표시하는 함수입니다
    showMarkers: function () {
      this.setMarkers(this.map);
    },
    // "마커 감추기" 버튼을 클릭하면 호출되어 배열에 추가된 마커를 지도에서 삭제하는 함수입니다
    hideMarkers: function () {
      this.setMarkers(null);
    },
    showPlace: function (id: number) {
      this.initMap();
      setTimeout(() => {
        // MARK: 기존 마커 삭제
        if (this.markers.length !== 0) {
          if (this.infowindow != null) {
            this.infowindow.close();
          }
          for (let i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
          }
          this.markers = [];
        }
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds();
        this.places = [];
        this.placesInfos.forEach(
          (place: Location) => {
            this.places.push(place);
            this.addMarker(
              new kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x)),
              place
            );
            bounds.extend(
              new kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x))
            );
          }
        );
        if (this.map != null) {
          // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
          this.map.setBounds(bounds);
        }
      }, 200);
    },
    showComment: async function() {
      this.commentModal = true
    },
    addComment: async function() {
      const res = await axios.post('https://beyhjxqxv3.execute-api.us-east-2.amazonaws.com/default/2023-c-capstone-DAO', {
        DML: 'INSERT',
        table: 'smuscomment',
        columns: 'from_id,to_id,comment,post_id, from_nickname, from_image',
        values: `'${this.$q.cookies.get('user_id')}', '${this.myPlaces[0].user_id}', '${this.commentText}', ${this.$route.query.id}, '${this.$q.cookies.get('nickname')}', '${this.$q.cookies.get('image')}'`
      })
      this.comments.push({
        image: this.$q.cookies.get('image'),
        comment: this.commentText,
        nickname: this.$q.cookies.get('nickname')
      })
      this.commentText = ''
    }
  },
});
</script>
<style scoped>
/* 스타일링 */
.modal-container {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

</style>
