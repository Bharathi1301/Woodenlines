import { useEffect, useState } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { serviceApi } from '../../api/services';

const blank = {
  name: '',
  description: '',
  icon: 'Hammer',
  startingPrice: '',
  priceUnit: 'per_project',
  active: true,
  order: 0
};

export default function ServicesAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const load = () => {
    setMsg('');

    return serviceApi
      .list()
      .then((r) => {
        setItems(r.data || []);
      })
      .catch((e) => {
        setMsg(e.message || 'Failed to load services');
      });
  };

  // FIXED useEffect
  useEffect(() => {
    load();
  }, []);

  const change = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]:
        e.target.type === 'checkbox'
          ? e.target.checked
          : e.target.value
    }));
  };

  const save = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      const p = {
        ...form,
        startingPrice: form.startingPrice
          ? Number(form.startingPrice)
          : undefined,
        order: Number(form.order) || 0
      };

      if (editing) {
        await serviceApi.update(editing, p);
      } else {
        await serviceApi.create(p);
      }

      setForm(blank);
      setEditing(null);

      await load();

      setMsg('Saved successfully.');
    } catch (e) {
      setMsg(e.message || 'Failed to save service');
    }
  };

  const edit = (s) => {
    setEditing(s._id);

    setForm({
      ...s,
      startingPrice: s.startingPrice || ''
    });
  };

  const remove = async (id) => {
    if (!confirm('Delete this service?')) {
      return;
    }

    try {
      setMsg('');

      await serviceApi.remove(id);

      await load();
    } catch (e) {
      setMsg(e.message || 'Failed to delete service');
    }
  };

  return (
    <div className="admin-page">

      <div className="admin-heading">
        <div>
          <span className="eyebrow">CATALOGUE</span>
          <h1>Services</h1>
        </div>
      </div>

      <div className="admin-split">

        {/* ADD / EDIT SERVICE */}
        <form
          className="admin-card admin-form"
          onSubmit={save}
        >
          <h3>
            {editing ? 'Edit service' : 'Add service'}
          </h3>

          <label>
            Name

            <input
              name="name"
              value={form.name}
              onChange={change}
              required
            />
          </label>

          <label>
            Description

            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={change}
              required
            />
          </label>

          <div className="two-col">

            <label>
              Starting price

              <input
                type="number"
                name="startingPrice"
                value={form.startingPrice}
                onChange={change}
              />
            </label>

            <label>
              Price unit

              <select
                name="priceUnit"
                value={form.priceUnit}
                onChange={change}
              >
                <option value="per_sqft">
                  Per sq.ft
                </option>

                <option value="per_piece">
                  Per piece
                </option>

                <option value="per_project">
                  Per project
                </option>
              </select>
            </label>

          </div>

          <div className="two-col">

            <label>
              Icon name

              <input
                name="icon"
                value={form.icon}
                onChange={change}
              />
            </label>

            <label>
              Order

              <input
                type="number"
                name="order"
                value={form.order}
                onChange={change}
              />
            </label>

          </div>

          <label>
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={change}
            />
            {' '}Active for visitors
          </label>

          {msg && (
            <div className="notice">
              {msg}
            </div>
          )}

          <button
            className="btn"
            type="submit"
          >
            {editing
              ? 'Update service'
              : 'Create service'}
          </button>

          {editing && (
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setEditing(null);
                setForm(blank);
                setMsg('');
              }}
            >
              Cancel edit
            </button>
          )}

        </form>

        {/* SERVICE CATALOGUE */}
        <div className="admin-card table-card">

          <h3>Service catalogue</h3>

          {items.map((s) => (
            <div
              className="admin-list-row"
              key={s._id}
            >

              <div>

                <div className="list-icon">
                  {s.icon}
                </div>

                <div>
                  <strong>{s.name}</strong>

                  <small>
                    {s.description}
                  </small>
                </div>

              </div>

              <div className="row-actions">

                <button
                  type="button"
                  onClick={() => edit(s)}
                  title="Edit"
                >
                  <Edit3 size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => remove(s._id)}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </div>
          ))}

          {items.length === 0 && !msg && (
            <div className="empty-state">
              No services found.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}