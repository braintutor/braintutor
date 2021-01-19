
import range from "lodash/range";

const thursday = 10
const friday = 11

const mondayTo = (endDay, event) => range(7, endDay + 1).map(x => '2019-01-'+x)
    .map(date => ({
        name: event.name,
        start: date + " " + event.startTime,
        end: date + " " + event.endTime,
        color: event.color
    }))

const db = [
    // ejemplo 4to año 
    // https://sites.google.com/site/colegionuevomundolaserena/alumnos/hora
  {
    name: 'Lenguaje y comunicación',
    day: "Monday",
    startTime: '08:00',
    endTime: '09:30',
    color: "blue",
  },
  {
    name: "Matematicas",
    day: "Monday",
    startTime: '09:50',
    endTime: '11:20',
    color: "red lighten-1"
  },
  {
    name: 'Educación Física',
    day: "Monday",
    startTime: '11:40',
    endTime: '12:40',
    color: "lime"
  },
  {
    name: 'Educación Física',
    day: "Monday",
    startTime: '13:10',
    endTime: '13:55',
    color: "lime"
  },
  {
    name: 'Ingles',
    day: "Monday",
    startTime: '13:55',
    endTime: '15:25',
    color: "teal darken-4"
  },
  // friday
  {
    name: 'Lenguaje y comunicación',
    day: "Friday",
    startTime: '09:50',
    endTime: '11:20',
    color: "blue"
  },
  {
    name: 'Ciencias Naturales',
    day: "Friday",
    startTime: '11:40',
    endTime: '12:40',
    color: "red accent-1"
  },
  {
    name: 'Pequeños Lectores',
    day: "Friday",
    startTime: "12:40",
    endTime: "13:10",
    color: "indigo darken-1"
  }
]


function getDate( dayName, { startDate, endDate }){
    console.log(startDate, endDate)
    return dayName === "Monday" ? "2019-01-07": "2019-01-11"
}

export function getEvents(rangeDate){
  // const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const events = db.map(x => ({
    name: x.name,
    start: getDate(x.day, rangeDate) + " " + x.startTime,
    end: getDate(x.day, rangeDate) + " " + x.endTime,
    color: x.color
  }))

  return [...events, 
          ...mondayTo(friday, {
            name: 'Recreo',
            startTime: '09:30',
            endTime: '09:50',
            color: "teal lighten-3",
          }),
          ...mondayTo(friday, {
            name: 'Recreo',
            startTime: '11:20',
            endTime: '11:40',
            color: "teal lighten-3"
          }),
          ...mondayTo(thursday, {
            name: 'Almuerzo',
            startTime: '12:40',
            endTime: '13:10',
            color: "cyan lighten-3"
          })]
}
