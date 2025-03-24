import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// PrimeVue
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Menu from 'primevue/menu'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import Avatar from 'primevue/avatar'
import Toast from 'primevue/toast'
import Password from 'primevue/password'
import InputNumber from 'primevue/inputnumber'

// Estilos de PrimeVue
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

const app = createApp(App)

// Registrar PrimeVue
app.use(PrimeVue)
app.use(ToastService)

// Registrar componentes de PrimeVue
app.component('Menubar', Menubar)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Menu', Menu)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Dialog', Dialog)
app.component('Dropdown', Dropdown)
app.component('Tag', Tag)
app.component('Badge', Badge)
app.component('Avatar', Avatar)
app.component('Toast', Toast)
app.component('Password', Password)
app.component('InputNumber', InputNumber)

app.use(router)

app.mount('#app')