<template>
  <div>
    <div class="m-menu mb-3">
      <m-btn
        v-for="(item, idx) in menu"
        :key="idx"
        @click="item.action()"
        text
        small
        color="dark"
        class="mr-2"
        >{{ item.text }}</m-btn
      >
      <m-btn @click="mode_calendar = !mode_calendar" text small color="dark"
        >Cambiar vista</m-btn
      >
    </div>

    <section v-show="mode_calendar" class="calendar">
      <div class="calendar__control">
        <span class="calendar__month">{{ `${months[month]} de ${year}` }}</span>
        <div class="calendar__actions">
          <m-btn @click="today()" icon class="mr-1">
            <i class="fa fa-calendar"></i>
          </m-btn>
          <m-btn @click="prev()" icon class="mr-1">
            <i class="fa fa-angle-left"></i>
          </m-btn>
          <m-btn @click="next()" icon>
            <i class="fa fa-angle-right"></i>
          </m-btn>
        </div>
      </div>

      <div class="calendar__body">
        <div
          v-for="(_, idx) in Array(7)"
          :key="idx + '_'"
          class="calendar__day-week"
        >
          {{ days[idx].substring(0, 3) }}
        </div>
        <div v-for="(_, idx) in Array(42)" :key="idx">
          <div v-show="false">{{ (day = getDayValuesByIdx(idx)) }}</div>
          <div
            class="day"
            :class="day.classname"
            @click="
              $emit(
                'on-date-click',
                date.getFullYear(),
                date.getMonth(),
                getDayValuesByIdx(idx).number
              )
            "
          >
            <span class="day__number">{{ day.number }}</span>
            <div class="day__events">
              <div
                v-for="(event, idx) in day.events"
                :key="idx"
                @click="showEvent(event, $event)"
                class="day__event"
                :style="{ background: event.color }"
              >
                {{ event.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-show="!mode_calendar">
      <div
        v-for="(e, idx) in events_ordered"
        :key="idx"
        class="hevent m-card mt-3"
      >
        <!-- <div class="hevent__options">
          <v-menu v-if="options && show_options(e)" offset-y left>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item
                v-for="(option, idx) in options"
                :key="idx"
                @click="option.action(e)"
              >
                <v-list-item-title>{{ option.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div> -->
        <div class="hevent__dateinfo" :style="{ background: e.color }">
          <p class="hevent__date">{{ e.date.getDate() }}</p>
          <p class="hevent__month">
            {{
              `${months[e.date.getMonth()].substring(0, 3)}, ${
                days[e.date.getDay()]
              }`
            }}
          </p>
          <p class="hevent__year">{{ e.date.getFullYear() }}</p>
        </div>
        <div class="hevent__body">
          <p class="hevent__time">{{ _getTime(e.date) }}</p>
          <p class="hevent__title">{{ e.title }}</p>
          <!-- CUSTOM INFO -->
          <!-- TODO Add to MVUECSS (methods) -->
          <slot name="event_info" :event="e" :methods="{ hideEvent }"></slot>
        </div>
      </div>

      <div v-show="events_ordered.length <= 0" class="text-center">
        No hay Eventos
      </div>
    </section>

    <!-- EVENT SELECTED -->
    <div
      v-if="mode_calendar"
      ref="m-event"
      class="event m-card"
      :class="{ 'event--disabled': !show_event }"
      :style="{ width: `${event_width}px`, ...event_selected_style }"
    >
      <div class="event__menu m-card__actions">
        <m-btn @click="show_event = false" icon>
          <svg
            class="event__icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 36 36"
          >
            <path fill="none" d="M0 0 36 36 M36 0 0 36" />
          </svg>
        </m-btn>
      </div>
      <div class="event__body m-card__body">
        <h2 class="event__title">{{ event_selected.title }}</h2>
        <p class="event__date">
          {{ _formatDate(event_selected.date || new Date()) }}
        </p>
        <p
          class="mt-5"
          style="white-space: pre-line"
          v-html="toHTML(event_selected.description)"
        ></p>
        <!-- CUSTOM INFO -->
        <!-- TODO Add to MVUECSS (methods) -->
        <slot
          name="event_info"
          :event="event_selected"
          :methods="{ hideEvent }"
        ></slot>
      </div>
      <div v-if="false" class="event__actions m-card__actions">
        <m-btn color="primary" small>Ver Más</m-btn>
      </div>
    </div>
  </div>
</template>

<script>
// Resource: https://codepen.io/jacknumber/pen/bVgLVd
export default {
  props: {
    events: {
      type: Array,
      default: () => [],
    },
    menu: {
      type: Array,
    },
    // show_options: {
    //   type: Function,
    // },
    // options: {
    //   type: Array,
    // },
  },
  data: () => ({
    days: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
    months: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    now: new Date(),
    date: new Date(),
    mode_calendar: true,
    // Event
    show_event: false,
    event_selected: {},
    event_selected_style: {},
    event_width: 400,
    //
    year: null,
    month: null,
    day_first: 0,
    days_in_month: 0,
  }),
  computed: {
    events_ordered() {
      return this.orderObjectsByDate(this.events, "date");
    },
  },
  watch: {
    date() {
      this.showDate(this.date);
    },
  },
  mounted() {
    this.showDate(this.date);

    this._updateSize();
    window.onresize = this._updateSize;
  },
  methods: {
    showEvent(event, e) {
      this.event_selected = event;
      this.show_event = true;

      setTimeout(() => {
        let { top, left, bottom, right } = e.target.getBoundingClientRect();
        let card_bounds = this.$refs["m-event"].getBoundingClientRect();

        let event_left = right + 10;
        // use this.event_width or card_bounds.width
        if (event_left + this.event_width > window.innerWidth)
          event_left = left - this.event_width - 10;

        let event_top = top;
        // use card_bounds.height or 500 (visual comfort)
        // if (event_top + card_bounds.height > window.innerHeight)
        if (event_top + 450 > window.innerHeight)
          event_top = bottom - card_bounds.height;

        this.event_selected_style = {
          top: `${event_top}px`,
          left: `${event_left}px`,
        };
      }, 100);

      e.stopPropagation();
    },
    hideEvent() {
      // TODO Add to MVUECSS
      // this.event_selected = {};
      this.show_event = false;
    },
    showDate(date) {
      let { year, month, first_day, total_days } = this.getDateValues(date);
      this.year = year;
      this.month = month;
      this.first_day = first_day;
      this.total_days = total_days;
    },
    getDateValues(date) {
      let year = date.getFullYear();
      let month = date.getMonth();
      let first_day = new Date(year, month, 1).getDay();
      // 0 = last day of the previous month
      let total_days = new Date(year, month + 1, 0).getDate();

      return { year, month, first_day, total_days };
    },
    getDayValuesByIdx(idx) {
      let number = idx - this.first_day + 1;
      let classname = "";
      let events = this.events.filter(({ date }) => {
        return (
          this.date.getFullYear() === date.getFullYear() &&
          this.date.getMonth() === date.getMonth() &&
          number === date.getDate()
        );
      });

      if (number < 1) {
        let prev_total_days = new Date(
          this.date.getFullYear(),
          this.date.getMonth(),
          0
        ).getDate();
        number = prev_total_days + number;
        classname = "day--disabled";
      } else if (number > this.total_days) {
        number = number - this.total_days;
        classname = "day--disabled";
      } else if (
        this.now.getFullYear() === this.date.getFullYear() &&
        this.now.getMonth() === this.date.getMonth() &&
        number === this.now.getDate()
      ) {
        classname = "day--now";
      }
      return { number, classname, events };
    },
    _updateSize() {
      let elements = document.getElementsByClassName("day");
      elements.forEach((element) => {
        let { width } = element.getBoundingClientRect();
        let new_min_height = Math.max((width * 4) / 5, 80);
        element.style.minHeight = `${new_min_height}px`;
      });
    },
    _formatDate(date) {
      let options = {
        month: "long",
        day: "numeric",
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
      };
      let date_format = date.toLocaleDateString("es-ES", options);
      date_format = date_format.charAt(0).toUpperCase() + date_format.slice(1);
      return date_format;
    },
    _getTime(date) {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      return `${hours}:${minutes}`;
    },
    // CALENDAR CONTROL
    today() {
      this.date = this.now;
    },
    prev() {
      this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    },
    next() {
      this.date = new Date(
        this.date.getFullYear(),
        this.date.getMonth() + 1,
        1
      );
    },
  },
};
</script>

<style lang='scss' scoped>
@import "../styles/_breakpoints.scss";

.m-menu {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.calendar {
  overflow: hidden;
  border-radius: 6px;
  box-shadow: 0 2px 10px #ccc;

  &__control {
    padding: 20px;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__body {
    display: grid;
    grid-template-columns: repeat(7, 1fr);

    & > * {
      // important: prevent grid resize
      overflow: hidden;
    }
  }
  &__actions {
    display: flex;
  }

  &__month {
    padding-left: 10px;
    font-size: 1.4rem;
    font-weight: bold;
  }
  &__day-week {
    padding: 18px 0;
    color: rgb(100, 100, 100);
    font-weight: bold;
    font-size: 0.85rem;
    text-align: center;
  }
}

.day {
  padding: 5px;
  transition: var(--time-transition);
  // cursor: pointer;
  user-select: none;

  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    background: #eaf3ff;
  }
  // &:active {
  //   background: #cde3ff;
  // }

  &__number {
    height: 32px;
    width: 32px;
    border-radius: 50%;
    font-size: 0.9rem;
    font-weight: bold;

    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__events {
    width: 100%;
  }
  &__event {
    padding: 4px 8px 2px 8px;
    margin-top: 4px;
    cursor: pointer;

    font-size: 0.9rem;
    color: #fff;
    text-align: center;
    border-radius: 4px;

    white-space: nowrap;
    // display: -webkit-box;
    // -webkit-line-clamp: 1;
    // -webkit-box-orient: vertical;
  }

  &--disabled {
    opacity: 0.3;
    pointer-events: none;
  }
  &--now {
    .day__number {
      background: rgb(23, 138, 226);
      color: #fff;
    }
  }
}

.event {
  width: 100%;
  z-index: var(--z-event); // important from Braintutor

  position: fixed;
  top: 50%;
  left: 50%;
  transition: var(--time-transition);

  &__menu {
    background: transparent;
    padding: 4px;
  }
  &__body {
    padding-top: 0;
    overflow-y: auto;
    max-height: 35vh;
  }
  &__actions {
    padding-top: 20px;
  }

  &__title {
    margin-bottom: 12px;
    font-size: 1.6rem;
  }
  &__date {
    font-size: 0.9rem;
  }
  &__icon {
    flex-shrink: 0;
    width: 12px;
    height: 12px;
    stroke-width: 6;
    stroke: rgb(46, 46, 46);
  }
  &--disabled {
    opacity: 0;
    pointer-events: none;
  }
}

@include media-breakpoint(md) {
  .calendar {
    &__control {
      padding: 0;
    }
    &__day-week {
      padding: 10px 0;
    }
  }
  .day {
    padding: 1px;
    &__number {
      height: 20px;
      width: 20px;
    }
    &__event {
      max-height: 18px; // important
      margin-top: 1px;
      padding: 1px;
    }
  }
  .event {
    height: 100vh !important;
    width: 100vw !important;

    top: 56px !important; // important from Braintutor
    // top: 0 !important;
    left: 0 !important;

    border-radius: 0;

    &__body {
      // important
      max-height: 100%;
    }
  }
}

//
.hevent {
  position: relative;
  overflow: hidden;
  display: flex;
  &__options {
    position: absolute;
    top: 8px;
    right: 4px;
    z-index: 1;
  }
  &__dateinfo {
    flex-shrink: 0;
    width: 25%;
    max-width: 120px;
    margin: 0;
    padding: 10px;
    color: #fff;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  &__date {
    margin: 0;
    font-weight: bold;
    font-size: 2.5rem;
  }
  &__month {
    margin-bottom: 8px;
    font-weight: bold;
    font-size: 0.85rem;
    text-transform: uppercase;
  }
  &__year {
    margin: 0;
    font-size: 0.8rem;
    opacity: 0.5;
  }
  //
  &__body {
    padding: 20px;
    flex-grow: 1;
  }
  &__time {
    margin-bottom: 8px;
    opacity: 0.75;
  }
  &__title {
    margin-bottom: 10px;
    font-weight: bold;
    font-size: 1.2rem;
  }
  &__description {
    margin: 0;
  }
}
</style>