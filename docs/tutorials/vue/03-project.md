# 实战项目：天气仪表盘

使用 Vue 3 + Vite + Pinia + Vue Router + TanStack Query + Tailwind CSS 构建天气仪表盘。

## 项目初始化

```sh
npm create vite@latest weather-dashboard -- --template vue-ts
cd weather-dashboard
npm install
npm install pinia vue-router@4 @tanstack/vue-query axios
npm install -D tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
```

## 类型定义

```ts
// types/weather.ts
export interface City {
  id: number
  name: string
  country: string
  lat: number
  lon: number
}

export interface Weather {
  cityName: string
  temp: number
  feelsLike: number
  humidity: number
  windSpeed: number
  description: string
  icon: string
}
```

## API 层

```ts
// api/weather.ts
import axios from 'axios'

const http = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
})

const APPID = import.meta.env.VITE_OWM_KEY

export async function fetchCity(name: string): Promise<City[]> {
  const { data } = await http.get('/find', {
    params: { q: name, type: 'like', appid: APPID },
  })
  return data.list.map((c: any) => ({
    id: c.id,
    name: c.name,
    country: c.sys.country,
    lat: c.coord.lat,
    lon: c.coord.lon,
  }))
}

export async function fetchWeather(lat: number, lon: number): Promise<Weather> {
  const { data } = await http.get('/weather', {
    params: { lat, lon, units: 'metric', lang: 'zh_cn', appid: APPID },
  })
  return {
    cityName: data.name,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    description: data.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
  }
}
```

## 状态管理（Pinia）

```ts
// stores/favorites.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<City[]>(JSON.parse(localStorage.getItem('favCities') || '[]'))

  const isFavorite = computed(() => (city: City) =>
    favorites.value.some(f => f.id === city.id)
  )

  function toggle(city: City) {
    const idx = favorites.value.findIndex(f => f.id === city.id)
    if (idx >= 0) {
      favorites.value.splice(idx, 1)
    } else {
      favorites.value.push(city)
    }
    localStorage.setItem('favCities', JSON.stringify(favorites.value))
  }

  return { favorites, isFavorite, toggle }
})
```

## 路由配置

```ts
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/Home.vue') },
  { path: '/favorites', name: 'favorites', component: () => import('@/views/Favorites.vue') },
  { path: '/city/:lat/:lon', name: 'city', component: () => import('@/views/CityDetail.vue') },
]

export default createRouter({ history: createWebHistory(), routes })
```

## 城市搜索组件

```vue
<!-- components/CitySearch.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { fetchCity } from '@/api/weather'

const query = ref('')

const { data, isFetching } = useQuery({
  queryKey: ['citySearch', query],
  queryFn: () => fetchCity(query.value),
  enabled: () => query.value.length >= 2,
  staleTime: 60_000,
})

const emit = defineEmits<{ select: [city: City] }>()
</script>

<template>
  <div class="relative">
    <input
      v-model="query"
      placeholder="搜索城市..."
      class="w-full px-4 py-2 border rounded-lg"
    />
    <ul v-if="data && query.length >= 2" class="absolute w-full bg-white shadow-lg rounded mt-1 z-10">
      <li
        v-for="city in data"
        :key="city.id"
        @click="emit('select', city); query = ''"
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      >
        {{ city.name }}, {{ city.country }}
      </li>
    </ul>
  </div>
</template>
```

## 天气展示组件

```vue
<!-- components/WeatherCard.vue -->
<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { fetchWeather } from '@/api/weather'
import { useFavoritesStore } from '@/stores/favorites'

const props = defineProps<{ lat: number; lon: number }>()
const favoritesStore = useFavoritesStore()

const { data: weather, isLoading, isError } = useQuery({
  queryKey: ['weather', props.lat, props.lon],
  queryFn: () => fetchWeather(props.lat, props.lon),
  staleTime: 300_000,
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-md p-6">
    <div v-if="isLoading">加载中...</div>
    <div v-else-if="isError">加载失败</div>
    <div v-else class="text-center">
      <img :src="weather!.icon" class="mx-auto w-20 h-20" />
      <h2 class="text-2xl font-bold">{{ weather!.cityName }}</h2>
      <p class="text-5xl font-extralight my-2">{{ weather!.temp }}°C</p>
      <p class="text-gray-500">{{ weather!.description }}</p>
      <div class="flex justify-center gap-6 mt-4 text-sm text-gray-600">
        <span>体感 {{ weather!.feelsLike }}°C</span>
        <span>湿度 {{ weather!.humidity }}%</span>
        <span>风速 {{ weather!.windSpeed }} m/s</span>
      </div>
    </div>
  </div>
</template>
```

## 首页

```vue
<!-- views/Home.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CitySearch from '@/components/CitySearch.vue'
import WeatherCard from '@/components/WeatherCard.vue'
import { useFavoritesStore } from '@/stores/favorites'
import type { City } from '@/types/weather'

const router = useRouter()
const favoritesStore = useFavoritesStore()
const selectedCity = ref<City | null>(null)

function onSelect(city: City) {
  selectedCity.value = city
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 space-y-6">
    <h1 class="text-3xl font-bold text-center">天气仪表盘</h1>
    <CitySearch @select="onSelect" />
    <WeatherCard v-if="selectedCity" :lat="selectedCity.lat" :lon="selectedCity.lon" />
    <div class="flex gap-2">
      <button
        v-if="selectedCity"
        @click="favoritesStore.toggle(selectedCity)"
        class="px-4 py-2 rounded bg-blue-500 text-white"
      >
        {{ favoritesStore.isFavorite(selectedCity) ? '取消收藏' : '收藏' }}
      </button>
      <button @click="router.push('/favorites')" class="px-4 py-2 rounded bg-gray-500 text-white">
        收藏列表
      </button>
    </div>
  </div>
</template>
```

## 收藏页面

```vue
<!-- views/Favorites.vue -->
<script setup lang="ts">
import { useFavoritesStore } from '@/stores/favorites'
import WeatherCard from '@/components/WeatherCard.vue'

const favoritesStore = useFavoritesStore()
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 space-y-4">
    <h1 class="text-2xl font-bold">收藏城市</h1>
    <div v-if="favoritesStore.favorites.length === 0" class="text-gray-400">暂无收藏</div>
    <div v-for="city in favoritesStore.favorites" :key="city.id">
      <WeatherCard :lat="city.lat" :lon="city.lon" />
    </div>
  </div>
</template>
```

## 入口文件

```ts
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import router from './router'
import App from './App.vue'
import './style.css'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(VueQueryPlugin)
  .mount('#app')
```

## 官方文档与延伸阅读

- **Vue 核心**：[Vue 3 官方文档](https://cn.vuejs.org/guide/introduction.html)
- **状态管理**：[Pinia](https://pinia.vuejs.org/zh/)
- **数据获取**：[TanStack Vue Query](https://tanstack.com/query/latest/docs/framework/vue/overview)
- **样式**：[Tailwind CSS](https://tailwindcss.com/docs)
- **脚手架**：[Vite](https://cn.vite.dev/guide/) · [create-vue](https://cn.vuejs.org/guide/quick-start.html)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。 |
