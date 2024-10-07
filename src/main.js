import { createApp } from 'vue';
import './style.css';
import ElementPlus from 'element-plus';
import ko from 'element-plus/es/locale/lang/ko';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';
import VueKonva from 'vue-konva';

const app = createApp(App);
app.use(router);
app.use(ElementPlus, { locale: ko });
app.use(VueKonva);
app.mount('#app');
