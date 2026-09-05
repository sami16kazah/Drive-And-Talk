'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSession, signIn } from 'next-auth/react';
import RatingStars from '@/components/ui/RatingStars';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LoginIcon from '@mui/icons-material/Login';

interface ReviewItem {
  _id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsSectionProps {
  courseId: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ courseId }) => {
  const t = useTranslations('CourseDetail');
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?courseId=${courseId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchReviews();
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          rating: userRating,
          comment: comment.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit review');
      }

      setComment('');
      setUserRating(5);
      fetchReviews();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error posting review');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div className="space-y-8">
      {/* Reviews Summary Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-brand-mint rounded-2xl border border-brand-green/20">
        <div>
          <h3 className="text-2xl font-bold text-brand-heading flex items-center gap-2">
            <RateReviewIcon className="text-brand-green" />
            <span>{t('reviewsTitle')}</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {reviews.length} {reviews.length === 1 ? 'beoordeling' : 'beoordelingen'}
          </p>
        </div>

        {reviews.length > 0 && (
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100">
            <span className="text-3xl font-extrabold text-brand-heading">{averageRating}</span>
            <div>
              <RatingStars rating={Number(averageRating)} size="sm" />
              <span className="text-xs text-gray-500 font-medium">Gemiddelde score</span>
            </div>
          </div>
        )}
      </div>

      {/* Review Submission Form (Only for Authenticated Google Users) */}
      <div className="p-6 bg-white rounded-2xl shadow-card border border-gray-100 space-y-4">
        <h4 className="text-lg font-bold text-brand-heading">{t('leaveReview')}</h4>

        {status === 'authenticated' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{errorMsg}</div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                {t('rating')}
              </label>
              <RatingStars
                rating={userRating}
                interactive={true}
                onRatingChange={(r) => setUserRating(r)}
                size="lg"
              />
            </div>

            <div>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('commentPlaceholder')}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="px-6 py-2.5 bg-brand-green hover:bg-brand-hover text-white font-bold text-sm rounded-xl shadow transition-all disabled:opacity-50"
            >
              {submitting ? 'Plaatsen...' : t('submitReview')}
            </button>
          </form>
        ) : (
          <div className="p-4 bg-brand-mint rounded-xl text-center space-y-3">
            <p className="text-sm text-gray-600 font-medium">{t('signInToReview')}</p>
            <button
              onClick={() => signIn('google')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-dark text-white text-sm font-bold rounded-xl hover:bg-brand-heading transition-colors"
            >
              <LoginIcon fontSize="small" />
              <span>Inloggen met Google</span>
            </button>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-8 text-center text-gray-400">Laden van beoordelingen...</div>
        ) : reviews.length === 0 ? (
          <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            {t('noReviews')}
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev._id}
              className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {rev.userAvatar ? (
                    <img
                      src={rev.userAvatar}
                      alt={rev.userName}
                      className="w-10 h-10 rounded-full border border-brand-green/30 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-green text-white font-bold flex items-center justify-center">
                      {rev.userName[0]}
                    </div>
                  )}
                  <div>
                    <h5 className="font-bold text-sm text-brand-heading">{rev.userName}</h5>
                    <span className="text-xs text-gray-400">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <RatingStars rating={rev.rating} size="sm" />
              </div>

              <p className="text-sm text-brand-body leading-relaxed">{rev.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
