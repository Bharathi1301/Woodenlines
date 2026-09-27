import { useEffect, useState } from 'react';
import { Check, Trash2 } from 'lucide-react';
import { testimonialApi } from '../../api/services';

export default function TestimonialsAdmin() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const load = () => {
    setError('');

    return testimonialApi
      .list()
      .then((r) => setItems(r.data || []))
      .catch((e) => setError(e.message || 'Failed to load testimonials'));
  };

  // FIX: don't pass the Promise-returning load function directly
  useEffect(() => {
    load();
  }, []);

  const approve = async (id, approved) => {
    try {
      setError('');
      await testimonialApi.update(id, { approved });
      await load();
    } catch (e) {
      setError(e.message || 'Failed to update testimonial');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete review?')) return;

    try {
      setError('');
      await testimonialApi.remove(id);
      await load();
    } catch (e) {
      setError(e.message || 'Failed to delete testimonial');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-heading">
        <div>
          <span className="eyebrow">REVIEWS</span>
          <h1>Testimonials</h1>
        </div>
      </div>

      {error && <div className="notice">{error}</div>}

      <div className="review-admin-grid">
        {items.length === 0 ? (
          <div className="admin-card">
            <p>No testimonials found.</p>
          </div>
        ) : (
          items.map((r) => (
            <article className="admin-review" key={r._id}>
              <div className="stars">
                {'★'.repeat(r.rating)}
                <span>{'★'.repeat(5 - r.rating)}</span>
              </div>

              <p>“{r.message}”</p>

              <strong>{r.clientName}</strong>
              <small>{r.location || '—'}</small>

              <div className="review-actions">
                <button
                  type="button"
                  className="btn mini"
                  onClick={() => approve(r._id, !r.approved)}
                >
                  <Check size={15} />
                  {r.approved ? 'Approved' : 'Approve'}
                </button>

                <button
                  type="button"
                  className="icon-danger"
                  onClick={() => remove(r._id)}
                  title="Delete review"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}