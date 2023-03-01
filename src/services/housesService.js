import http from "./httpService";
import config from "../config.json";
const apiUrl = config.apiUrl;

const apiEndpoint = apiUrl + "/viviendas/";

function houseUrl(id) {
  return `${apiEndpoint}${id}`;
}

// localhost:8000/api/v1/personas/
export function getHouses() {
  return http.get(apiEndpoint);
}

// localhost:8000/api/v1/personas/:id
export function getHouse(houseId) {
  return http.get(houseUrl(houseId));
}

export function savePerson(house) {
  // if (person.id) {
  //   const body = { ...person };
  //   delete body.id;
  //   return http.put(personUrl(person.id), body);
  // }
  return http.post(apiEndpoint, house);
}

export function deleteHouse(houseId) {
  return http.delete(houseUrl(houseId));
}
