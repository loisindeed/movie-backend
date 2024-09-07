const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(request, response, next) {
  const reviewId = request.params.reviewId;
  const review = await service.read(reviewId);

  if (review) {
    response.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
}

async function destroy(request, response, next) {
  try {
    await service.destroy(response.locals.review.review_id);
    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

async function list(request, response, next) {
  const movieId = request.params.movieId;
  try {
    const reviews = await service.list(movieId);
    const formatted = reviews.map(review => (
    {
      movie_id: review.movie_id,
          review_text: review.content,
        critic: {
          preferred_name: review.preferred_name,
          surname: review.surname,
          organization_name: review.organization_name
        }
    }
    ));

    response.json({ data: formatted });
  } catch (error) {
    next(error);
  }
}

function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  return methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  return next();
}

async function update(request, response, next) {
  const updatedReview = {
    ...response.locals.review,
    ...request.body.data,
    review_id: response.locals.review.review_id,
  };
  try {
    const data = await service.update(updatedReview);
    response.json({ data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  destroy: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};