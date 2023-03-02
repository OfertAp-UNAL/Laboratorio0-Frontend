import http from "./httpService";
import config from "../config.json";
const apiUrl = config.apiUrl;

const apiEndpoint = apiUrl + "/personas/";

function personUrl(id) {
  return `${apiEndpoint}${id}/`;
}

// localhost:8000/api/v1/personas/
export function getPeople() {
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

export function addPersonHouse(person, houses) {
  const body = {"houses": houses}
  console.log("The body here is", body);
  return http.patch(personUrl(person.id), body)
}

export function deletePerson(personId) {
  return http.delete(personUrl(personId));
}
