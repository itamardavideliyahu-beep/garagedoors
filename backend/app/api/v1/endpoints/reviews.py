"""Reviews / testimonials endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc, select

from app.core.deps import DbSession, require_admin
from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewOut

router = APIRouter()


@router.get("", response_model=list[ReviewOut])
async def list_reviews(db: DbSession, limit: int = 20, featured_only: bool = False) -> list[Review]:
    query = select(Review).where(Review.is_published.is_(True))
    if featured_only:
        query = query.where(Review.is_featured.is_(True))
    query = query.order_by(desc(Review.created_at)).limit(min(limit, 100))
    result = await db.execute(query)
    return list(result.scalars().all())


@router.post("", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
async def submit_review(payload: ReviewCreate, db: DbSession) -> Review:
    review = Review(**payload.model_dump(), is_published=False)
    db.add(review)
    await db.commit()
    await db.refresh(review)
    return review


@router.patch(
    "/{review_id}/publish",
    response_model=ReviewOut,
    dependencies=[Depends(require_admin)],
)
async def publish_review(review_id: int, db: DbSession) -> Review:
    review = await db.get(Review, review_id)
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
    review.is_published = True
    await db.commit()
    await db.refresh(review)
    return review
