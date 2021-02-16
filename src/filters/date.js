import Vue from "vue";
import { format } from "date-fns/fp";
import isString from "lodash/isString";


const formatDateTime = (defaultFormat) => 
    (value, prettyFormat = defaultFormat) => {
        const dateToFormat = isString(value)? new Date(value): value
        return format(prettyFormat)(dateToFormat)
    }

Vue.filter("date", formatDateTime("dd/MM"))
Vue.filter("time", formatDateTime("HH:mm"))