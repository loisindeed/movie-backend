const db = require("../db/connection");

const tableName = "reviews";

async function destroy(review_id) {
  return db(tableName).where({ review_id }).del();
}

// GET `/movies/:movieId/reviews` returns the reviews, with critic property
async function list(movie_id) {
  return db("reviews as r")
      .join("critics as c", "r.critic_id", "c.critic_id")
      .select("*")
      .where({"r.movie_id": movie_id})
}

async function read(review_id) {
  return db(tableName).select("*").where({ review_id }).first();
}

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function update(review) {
  return db(tableName)
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

module.exports = {
  destroy,
  list,
  read,
  update,
};
