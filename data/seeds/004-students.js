
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('table_name').del()
    .then(function () {
      // Inserts seed entries
      return knex('table_name').insert([
        {
          account_id: 1, 
          cohort_id: 2, 
          track_id: 1, 
          profile_pic: "https://ca.slack-edge.com/T4JUEB3ME-UBSLZM15L-65ba36e527d4-72", 
          location: "Morgan, UT", 
          lat: "", 
          lon: "", 
          desired_title: "Full-Stack Web Developer", 
          about: "I skateboard for the ladies.",
          approved: true,
          hired: false,
          graduated: false,
          website: "https://facebook.com/jake-thomas",
          github: "https://github.com/jmaxt12",
          linkedin: "https://linkedin.com/in/jmaxt12",
          twitter: "https://twitter.com/jmaxt12",
          acclaim: ""
        },
        {
          account_id: 2, 
          cohort_id: 2, 
          track_id: 1, 
          profile_pic: "https://ca.slack-edge.com/T4JUEB3ME-UE6DQ1MSS-1a6b08505809-72", 
          location: "Pigeon, MI", 
          lat: "", 
          lon: "", 
          desired_title: "Full-Stack Web Dev", 
          about: "I get buckets.",
          approved: false,
          hired: false,
          graduated: false,
          website: "https://facebook.com/ticotheps",
          github: "https://github.com/ticotheps",
          linkedin: "https://linkedin.com/in/ticotheps",
          twitter: "https://twitter.com/ticotheps",
          acclaim: ""
        },
        {
          account_id: 3, 
          cohort_id: 2, 
          track_id: 3, 
          profile_pic: "https://ca.slack-edge.com/T4JUEB3ME-UETPP7WHG-24cd2243a35b-72", 
          location: "Knoxville, TN", 
          lat: "", 
          lon: "", 
          desired_title: "Full-Stack Software Engineer", 
          about: "I'm Brad Pitt's Stunt Double.",
          approved: false,
          hired: false,
          graduated: false,
          website: "https://facebook.com/jameig",
          github: "https://github.com/jameig",
          linkedin: "https://linkedin.com/in/jameig",
          twitter: "https://twitter.com/jameig",
          acclaim: ""
        },
      ]);
    });
};
