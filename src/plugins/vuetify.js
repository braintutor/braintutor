import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import DatetimePicker from 'vuetify-datetime-picker'
import es from 'vuetify/es5/locale/es'

Vue.use(Vuetify);
Vue.use(DatetimePicker);

export default new Vuetify({
    lang: {
        locales: { es },
        current: 'es',
    },
});
