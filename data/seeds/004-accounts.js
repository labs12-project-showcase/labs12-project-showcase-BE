exports.seed = function(knex, Promise) {
  return knex("accounts").insert([
    {
      name: "Alvin Allison",
      email: "alvin@gmail.com",
      sub_id: "AAAA"
    },
    {
      name: "Bartholomew Bonds",
      email: "bartholomew@gmail.com",
      sub_id: "BBBB"
    },
    {
      name: "Cory Carter",
      email: "cory@gmail.com",
      sub_id: "CCCC"
    },
    {
      name: "Devin Destrier",
      email: "devin@gmail.com",
      sub_id: "DDDD"
    },
    {
      name: "Elminster Eyring",
      email: "elminster@gmail.com",
      sub_id: "EEEE"
    },
    {
      name: "Faenor Fitzsimmons",
      email: "faenor@gmail.com",
      sub_id: "ffff"
    },
    {
      name: "Garth Gifford",
      email: "garth@gmail.com",
      sub_id: "GGGG"
    },
    {
      name: "Harry Hepburn",
      email: "harry@gmail.com",
      sub_id: "HHHH"
    },
    {
      name: "Ivan Illuminati",
      email: "ivan@gmail.com",
      sub_id: "IIII"
    },
    {
      name: "Jacobus Josephus",
      email: "jacobus@gmail.com",
      sub_id: "JJJJ"
    },
  ]);
};