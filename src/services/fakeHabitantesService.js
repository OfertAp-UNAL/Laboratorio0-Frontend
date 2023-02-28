const habitantes = [
  {
    id: 1,
    name: "Norine",
    phone: "1546766200",
    age: 69,
    gender: "Female",
    governor_from: {
      id: "1",
      name: "Sopo",
    },
    home: {
      id: "1",
      address: "Calle 1 # 2 - 3",
    },
    houses: [
      {
        id: 1,
        address: "Calle 1 # 2 - 3",
      },
    ],
    depends_on: {
      id: "1",
      name: "Norine",
    },
  },
];

export function getHabitantes() {
  return habitantes;
}

export function getHabitante(id) {
  return habitantes.find((p) => p.id === parseInt(id));
}

export function saveHabitante(person) {
  let personInDb = habitantes.find((p) => p.id === person.id) || {};
  personInDb.name = person.name;
  personInDb.phone = person.phone;
  personInDb.age = person.age;
  personInDb.gender = person.gender;
  personInDb.governor = habitantes.find((p) => p.name === person.name) || {};

  if (!personInDb.id) {
    personInDb.id = parseInt(Date.now().toString());
    habitantes.push(personInDb);
  }

  return personInDb;
}

export function deleteHabitante(id) {
  let habitanteInDb = habitantes.find((h) => h.id === parseInt(id));
  habitantes.splice(habitantes.indexOf(habitanteInDb), 1);
  return habitanteInDb;
}
