import { useState } from 'react'

interface StarRatingProps {
  totalStars?: number
}

function StarRating({ totalStars = 5 }: StarRatingProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  const stars = Array.from({ length: totalStars })
  const displayRating = hoverRating || rating

  function getRatingFromEvent (e: React.MouseEvent<HTMLSpanElement>, index: number) {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    return offsetX < rect.width / 2 ? index + 0.5 : index + 1;
  }

  function handleClick (e: React.MouseEvent<HTMLSpanElement>, index: number) {
    setRating(getRatingFromEvent(e, index));
  }

  function handleMouseMove (e: React.MouseEvent<HTMLSpanElement>, index: number) {
    setHoverRating(getRatingFromEvent(e, index));
  }

  return (
    <div className="container" onMouseLeave={() => setHoverRating(0)}>
      {stars.map((_, index) => {
        const fillPercent = Math.min(1, Math.max(0, displayRating - index)) * 100

        return (
          <span
            className="star"
            key={index}
            style={{ '--fill': `${fillPercent}%` } as React.CSSProperties}
            onClick={(e) => handleClick(e, index)}
            onMouseMove={(e) => handleMouseMove(e, index)}
          >
            ★
          </span>
        )
      })}
    </div>
  )
}

export default StarRating
