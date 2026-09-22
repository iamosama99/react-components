import { useState } from 'react'

interface StarRatingProps {
  totalStars?: number
}

function StarRating({ totalStars = 5 }: StarRatingProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  const stars = Array.from({ length: totalStars })
  const displayRating = hoverRating || rating

  return (
    <div className="container" onMouseLeave={() => setHoverRating(0)}>
      {
        stars.map((_, index) => (
          <span
            className='star'
            key={index}
            onClick={() => setRating(index + 1)}
            onMouseEnter={() => setHoverRating(index + 1)}
          >{index + 1 <= displayRating ? '★' : '☆'}
          </span>
        ))
      }
    </div>
  )
}

export default StarRating
