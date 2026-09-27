import { useEffect, useState } from 'react';
import { Edit3, Plus, Trash2, UploadCloud } from 'lucide-react';
import { projectApi } from '../../api/services';

const empty = {
  title: '',
  category: 'kitchen',
  description: '',
  material: '',
  location: '',
  durationDays: '',
  featured: false,
  published: true
};

export default function ProjectsAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [files, setFiles] = useState([]);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => {
    setMsg('');

    return projectApi
      .list({ limit: 50 })
      .then((r) => {
        setItems(r.data || []);
      })
      .catch((e) => {
        setMsg(e.message || 'Failed to load projects');
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

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg('');

    try {
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) => {
        if (v !== '' && v !== null) {
          fd.append(k, v);
        }
      });

      files.forEach((f) => {
        fd.append('images', f);
      });

      if (editing) {
        await projectApi.update(editing, fd);
      } else {
        await projectApi.create(fd);
      }

      setForm(empty);
      setFiles([]);
      setEditing(null);

      await load();

      setMsg('Saved successfully.');
    } catch (err) {
      setMsg(err.message || 'Failed to save project');
    } finally {
      setBusy(false);
    }
  };

  const edit = (p) => {
    setEditing(p._id);

    setForm({
      title: p.title,
      category: p.category,
      description: p.description,
      material: p.material || '',
      location: p.location || '',
      durationDays: p.durationDays || '',
      featured: !!p.featured,
      published: !!p.published
    });
  };

  const remove = async (id) => {
    if (!confirm('Delete this project?')) {
      return;
    }

    try {
      setMsg('');

      await projectApi.remove(id);

      await load();
    } catch (e) {
      setMsg(e.message || 'Failed to delete project');
    }
  };

  return (
    <div className="admin-page">

      <div className="admin-heading">
        <div>
          <span className="eyebrow">PORTFOLIO</span>
          <h1>Projects</h1>
        </div>
      </div>

      <div className="admin-split">

        {/* ADD / EDIT PROJECT */}
        <form
          className="admin-card admin-form"
          onSubmit={submit}
        >
          <h3>
            {editing ? 'Edit project' : 'Add project'}
          </h3>

          <label>
            Title
            <input
              name="title"
              value={form.title}
              onChange={change}
              required
            />
          </label>

          <div className="two-col">

            <label>
              Category

              <select
                name="category"
                value={form.category}
                onChange={change}
              >
                {[
                  'kitchen',
                  'wardrobe',
                  'furniture',
                  'interior',
                  'doors',
                  'office',
                  'other'
                ].map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Duration (days)

              <input
                type="number"
                name="durationDays"
                value={form.durationDays}
                onChange={change}
              />
            </label>

          </div>

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
              Material

              <input
                name="material"
                value={form.material}
                onChange={change}
              />
            </label>

            <label>
              Location

              <input
                name="location"
                value={form.location}
                onChange={change}
              />
            </label>

          </div>

          <label className="upload-field">
            <UploadCloud size={18} />

            Images (up to 8)

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              onChange={(e) =>
                setFiles(
                  Array.from(e.target.files || [])
                )
              }
            />

            <small>
              {files.length} new file(s) selected
            </small>
          </label>

          <div className="check-row">

            <label>
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={change}
              />
              Featured
            </label>

            <label>
              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={change}
              />
              Published
            </label>

          </div>

          {msg && (
            <div className="notice">
              {msg}
            </div>
          )}

          <button
            className="btn"
            disabled={busy}
            type="submit"
          >
            <Plus size={17} />

            {busy
              ? 'Saving…'
              : editing
                ? 'Update project'
                : 'Create project'}
          </button>

          {editing && (
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setEditing(null);
                setForm(empty);
                setFiles([]);
              }}
            >
              Cancel edit
            </button>
          )}

        </form>

        {/* EXISTING PROJECTS */}
        <div className="admin-card table-card">

          <h3>Existing projects</h3>

          <div className="admin-list">

            {items.map((p) => (
              <div
                className="admin-list-row"
                key={p._id}
              >

                <div>

                  {p.coverImage ? (
                    <img
                      src={p.coverImage}
                      alt=""
                    />
                  ) : (
                    <div className="thumb-placeholder" />
                  )}

                  <div>
                    <strong>{p.title}</strong>

                    <small>
                      {p.category} ·{' '}
                      {p.published
                        ? 'Published'
                        : 'Draft'}
                    </small>
                  </div>

                </div>

                <div className="row-actions">

                  <button
                    type="button"
                    onClick={() => edit(p)}
                    title="Edit"
                  >
                    <Edit3 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(p._id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>
            ))}

            {items.length === 0 && !msg && (
              <div className="empty-state">
                No projects found.
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}