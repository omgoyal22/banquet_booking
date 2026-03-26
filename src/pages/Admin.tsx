import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, Banquet, LOCATIONS } from '../lib/supabase';
import { BanquetForm } from '../components/BanquetForm';
import './Admin.css';

export function Admin() {
  const { user } = useAuth();
  const [banquets, setBanquets] = useState<Banquet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanquet, setEditingBanquet] = useState<Banquet | null>(null);
  const [filterLocation, setFilterLocation] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchBanquets();
    }
  }, [user]);

  const fetchBanquets = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('banquets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setBanquets(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banquet?')) return;

    const { error } = await supabase
      .from('banquets')
      .delete()
      .eq('id', id);

    if (!error) {
      setBanquets(banquets.filter(b => b.id !== id));
    }
  };

  const handleTogglePublish = async (banquet: Banquet) => {
    const { error } = await supabase
      .from('banquets')
      .update({ published: !banquet.published })
      .eq('id', banquet.id);

    if (!error) {
      setBanquets(banquets.map(b =>
        b.id === banquet.id ? { ...b, published: !b.published } : b
      ));
    }
  };

  const handleEdit = (banquet: Banquet) => {
    setEditingBanquet(banquet);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBanquet(null);
    fetchBanquets();
  };

  const filteredBanquets = filterLocation === 'all'
    ? banquets
    : banquets.filter(b => b.location === filterLocation);

  if (!user) {
    return (
      <div className="admin">
        <div className="admin-container">
          <p>Please log in to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={20} />
          Add Banquet
        </button>
      </div>

      <div className="admin-container">
        <div className="admin-controls">
          <div className="filter-group">
            <label htmlFor="location-filter">Filter by Location:</label>
            <select
              id="location-filter"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              <option value="all">All Locations</option>
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div className="stats">
            <span>{filteredBanquets.length} banquet{filteredBanquets.length !== 1 ? 's' : ''}</span>
            <span className="divider">|</span>
            <span>{filteredBanquets.filter(b => b.published).length} published</span>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading banquets...</p>
          </div>
        ) : filteredBanquets.length === 0 ? (
          <div className="empty-state">
            <p>No banquets found. Click "Add Banquet" to create your first listing.</p>
          </div>
        ) : (
          <div className="banquets-table">
            {filteredBanquets.map(banquet => (
              <div key={banquet.id} className="banquet-row">
                <div className="banquet-info">
                  <div className="banquet-image-small">
                    <img
                      src={banquet.images[0] || 'https://images.pexels.com/photos/1395964/pexels-photo-1395964.jpeg?auto=compress&cs=tinysrgb&w=200'}
                      alt={banquet.name}
                    />
                  </div>
                  <div className="banquet-details">
                    <h3>{banquet.name}</h3>
                    <p className="banquet-meta">
                      {banquet.location} • ₹{banquet.price.toLocaleString('en-IN')}
                    </p>
                    <p className="banquet-desc">{banquet.description}</p>
                  </div>
                </div>
                <div className="banquet-actions">
                  <button
                    className={`btn-icon ${banquet.published ? 'published' : 'unpublished'}`}
                    onClick={() => handleTogglePublish(banquet)}
                    title={banquet.published ? 'Unpublish' : 'Publish'}
                  >
                    {banquet.published ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    className="btn-icon edit"
                    onClick={() => handleEdit(banquet)}
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="btn-icon delete"
                    onClick={() => handleDelete(banquet.id)}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <BanquetForm
          banquet={editingBanquet}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
