import Vue from "vue";
import { formatWithOptions } from "date-fns/fp";
import { es } from 'date-fns/locale';
import isString from "lodash/isString";


const formatDateTime = (defaultFormat) => 
    (value, prettyFormat = defaultFormat) => {
        const dateToFormat = isString(value)? new Date(value): value
        return formatWithOptions({ locale: es }, prettyFormat)(dateToFormat)
    }

Vue.filter("date", formatDateTime("dd/MM"))
Vue.filter("dayMonth", formatDateTime("d MMMM"))
Vue.filter("time", formatDateTime("HH:mm"))
Vue.filter("dayWeek", formatDateTime("eeee"))

