import reviews from '../data/reviews'
import './Reviews.scss'

const Reviews = () => {
  return (
    <section className="reviews">
      <h2 className="reviews__title">Lo que dicen las familias</h2>
      <div className="reviews__grid">
        {reviews.map((review) => (
          <div key={review.id} className="reviews__card">
            <p className="reviews__text">"{review.text}"</p>
            <p className="reviews__name"> {review.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Reviews
