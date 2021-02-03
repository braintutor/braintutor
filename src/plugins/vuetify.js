import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import DatetimePicker from 'vuetify-datetime-picker'
import es from 'vuetify/es5/locale/es'

Vue.use(Vuetify);
Vue.use(DatetimePicker);

export default new Vuetify({
    theme: {
        themes: {
          light: {
            primary: '#178ae2',
            secondary: '#ecf4ff',
            accent: '#8c9eff',
            error: '#b71c1c',
          },
        },
      },
    lang: {
        locales: { es },
        current: 'es',
    },
});


