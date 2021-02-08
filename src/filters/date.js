import Vue from "vue";
import { format } from "date-fns/fp";

Vue.filter("date", function (value, prettyFormat = "dd/MM") {
    return format(prettyFormat)(value)
})