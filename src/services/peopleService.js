import http from "./httpService";
import config from "../config.json";
const apiUrl = config.apiUrl;

const apiEndpoint = apiUrl + "/personas/";

function personUrl(id) {
  return `${apiEndpoint}${id}`;
}

// localhost:8000/api/v1/personas/
export function getPeople() {
  console.log("getPeople() called with " + apiEndpoint);
  return http.get(apiEndpoint);
}

// localhost:8000/api/v1/personas/:id
export function getPerson(personId) {
  return http.get(personUrl(personId));
}

export function savePerson(person) {
  // if (person.id) {
  //   const body = { ...person };
  //   delete body.id;
  //   return http.put(personUrl(person.id), body);
  // }
  return http.post(apiEndpoint, person);
}

export function deleteHabitante(personId) {
  return http.delete(personUrl(personId));
}
