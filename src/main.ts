import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

createApp(App).mount('#app');

// vuetify
import vuetify from './plugins/vuetify';
const app = createApp(App);
app.use(vuetify);
app.mount('#app');
