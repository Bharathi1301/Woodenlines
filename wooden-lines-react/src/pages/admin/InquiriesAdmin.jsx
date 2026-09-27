import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { inquiryApi } from '../../api/services';

const statuses = ['new', 'contacted', 'quoted', 'won', 'lost'];

export default function InquiriesAdmin() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    setError('');

    inquiryApi
      .list({
        status: status || undefined,
        page: 1,
        limit: 50
      })
      .then((r) => {
        setItems(r.data || []);
      })
      .catch((e) => {
        setError(e.message || 'Failed to load enquiries');
      });
  };

  // FIXED: Do not pass load directly to useEffect
  useEffect(() => {
    load();
  }, [status]);

  const update = async (id, next) => {
    try {
      setError('');

      await inquiryApi.update(id, {
        status: next
      });

      load();
    } catch (e) {
      setError(e.message || 'Failed to update enquiry');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete enquiry?')) {
      return;
    }

    try {
      setError('');

      await inquiryApi.remove(id);

      load();
    } catch (e) {
      setError(e.message || 'Failed to delete enquiry');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-heading">
        <div>
          <span className="eyebrow">LEADS</span>
          <h1>Enquiries</h1>
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>

          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="notice">
          {error}
        </div>
      )}

      <div className="admin-card table-card">
        <div className="inquiry-table">

          <div className="inquiry-head">
            <span>Client</span>
            <span>Request</span>
            <span>Status</span>
            <span>Date</span>
            <span></span>
          </div>

          {items.map((i) => (
            <div
              className="inquiry-row"
              key={i._id}
            >
              {/* CLIENT */}
              <div>
                <strong>{i.name}</strong>

                <a href={`tel:${i.phone}`}>
                  {i.phone}
                </a>

                {i.email && (
                  <small>{i.email}</small>
                )}
              </div>

              {/* REQUEST */}
              <div>
                <strong>
                  {i.serviceType || 'General enquiry'}
                </strong>

                <p>{i.message}</p>

                {i.budget && (
                  <small>
                    Budget ₹
                    {Number(i.budget).toLocaleString('en-IN')}
                  </small>
                )}
              </div>

              {/* STATUS */}
              <div>
                <select
                  value={i.status}
                  onChange={(e) =>
                    update(i._id, e.target.value)
                  }
                >
                  {statuses.map((s) => (
                    <option
                      key={s}
                      value={s}
                    >
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* DATE */}
              <div>
                {i.createdAt
                  ? new Date(i.createdAt).toLocaleDateString(
                      'en-IN'
                    )
                  : '-'}
              </div>

              {/* DELETE */}
              <button
                type="button"
                onClick={() => remove(i._id)}
                title="Delete enquiry"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {/* EMPTY STATE */}
          {items.length === 0 && !error && (
            <div className="empty-state">
              No enquiries found.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}