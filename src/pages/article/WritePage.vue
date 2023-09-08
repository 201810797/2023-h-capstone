<template>
  <q-layout id="map" :style="mapStyle"></q-layout>
  <q-dialog v-model="seamlessTop" seamless position="top" style="max-height: 30vh; overflow-y: auto;">
    <q-card style="width: 350px">
      <q-list bordered separator>
        <q-item v-for="(item, index) in myPlacesInfo" v-bind:key="index" clickable v-ripple>
          <q-item-section>
            <q-item-label>{{item.place_name}}</q-item-label>
            <q-item-label caption>{{item.road_address_name}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-dialog>
  <q-dialog v-model="seamless" seamless position="bottom">
    <q-card style="width: 350px">
      <q-list bordered separator>
        <q-item clickable v-ripple><q-item-section>{{this.x}}</q-item-section></q-item>
        <q-item clickable v-ripple><q-item-section>{{this.y}}</q-item-section></q-item>
        <q-item clickable v-ripple><q-item-section>{{this.category_name}}</q-item-section></q-item>
        <q-item clickable v-ripple><q-item-section>{{this.place_name}}</q-item-section></q-item>
        <q-item clickable v-ripple><q-item-section>{{this.road_address_name}}</q-item-section></q-item>
      </q-list>
      <q-card-section class="row items-center no-wrap">
        <div>
          <div class="text-weight-bold">장소를 추가하려면 버튼을 눌러주세요</div>
          <div class="text-grey">!</div>
        </div>

        <q-space />

        <q-btn color="black" label="추가" @click="addPlace" />
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-footer reveal elevated class="bg-black justify-end">
    <h5 style="margin: 1.5%">{{ myPlaces.title }}</h5>
    <q-input standout bottom-slots v-model="tag" label="Label" counter maxlength="12" :dense="false" bg-color="grey">
      <template v-slot:hint>
        Field hint
      </template>
      <template v-slot:after>
        <q-btn round dense flat icon="send" color="black"/>
      </template>
      <q-btn color="white" text-color="black" label="찾기" @click="searchPlaces"/>
    </q-input>
    <q-toolbar class="justify-between">
      <q-list style="width: 100%" class="flex row justify-start">
        <q-item v-for="(item, key) in placeCategory" v-bind:key="key" clickable>
          <q-item-section>
            <q-item-label>{{ item }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
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
      seamlessTop: ref(true)
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
      myPlacesInfo: []
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
    this.$q.loading.show();
    res = await axios.post('https://beyhjxqxv3.execute-api.us-east-2.amazonaws.com/default/2023-c-capstone-DAO', {
      DML: 'SELECT',
      columns: '*',
      table: 'smuslocation',
      where: `post_id=${this.$route.query.id}`
    })
    this.myPlacesInfo = res.data
    console.log(this.myPlacesInfo)
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
      }
    )
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
      console.log(this)
      this.myPlacesInfo.push(this)
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
            `<div style="padding:5px;font-size:12px;margin: auto;">
                    <p>${place.place_name}</p>
                    <p>${placeTheme}</p>
                    <input type="button" value="추가"/>
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
  },
});
</script>
