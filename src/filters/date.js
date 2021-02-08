import Vue from "vue";
import { format } from "date-fns/fp";
import isString from "lodash/isString";

Vue.filter("date", function (value, prettyFormat = "dd/MM") {
    const dateToFormat = isString(value)? new Date(value): value
    return format(prettyFormat)(dateToFormat)
})