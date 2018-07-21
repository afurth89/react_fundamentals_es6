const axios = require('axios');

const id = "22205565806f95bacab9";
const sec = "5f236b0a4445f1052994a556832baa770d97aa3a";
const params = `?client_id=${id}&client_secret=${sec}`;

function getProfile (username) {
  return axios.get(`https://api.github.com/users/${username}${params}`)
    .then(({ data }) => data)
}

function getRepos (username) {
  return axios.get(`https://api.github.com/users/${username}/repos${params}&per_page=100`);
}

function getStarCount (repos) {
  return repos.data.reduce((count, { stargazers_count }) => count +stargazers_count, 0);
}

function calculateScore ({followers}, repos) {
  return (followers * 3) + getStarCount(repos);
}

function handleError (error) {
  console.warn(error);
  return null;
}

function getUserData (player) {
  return axios.all([
    getProfile(player),
    getRepos(player)
  ]).then(([profile, repos]) => {
    return {
      profile,
      score: calculateScore(profile, repos)
    }
  });
}

function sortPlayers (players) { 
  return players.sort((a,b) => { b.score - a.score })
}

module.exports = {
  battle: (players) => {
    return axios.all(players.map(getUserData))
      .then(sortPlayers)
      .catch(handleError)
  },
  fetchPopularRepos: (language) => {
    const encodedURI = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`);
    return axios.get(encodedURI).then(({data}) => { data.items })
  }
}