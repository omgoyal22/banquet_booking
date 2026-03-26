import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, IndianRupee, MessageCircle } from 'lucide-react';
import { supabase, Banquet } from '../lib/supabase';
import './LocationDetail.css';

interface LocationDetailProps {
  location: string;
  onBack: () => void;
}

export function LocationDetail({ location, onBack }: LocationDetailProps) {
  const [banquets, setBanquets] = useState<Banquet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanquets();
  }, [location]);

  const fetchBanquets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('banquets')
      .select('*')
      .eq('location', location)
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error && data) {
      setBanquets(data);
    }
    setLoading(false);
  };

  const handleSendQuery = (banquet: Banquet) => {
    const message = `Hi, I am interested in ${banquet.name} at ${banquet.location}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="location-detail">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading banquets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="location-detail">
      <div className="location-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h1>
          <MapPin size={28} />
          {location}
        </h1>
        <p>{banquets.length} banquet{banquets.length !== 1 ? 's' : ''} available</p>
      </div>

      <div className="banquets-container">
        {banquets.length === 0 ? (
          <div className="empty-state">
            <p>No banquet halls available in this location yet.</p>
          </div>
        ) : (
          <div className="banquets-grid">
            {banquets.map((banquet) => (
              <div key={banquet.id} className="banquet-card">
                <div className="banquet-image">
                  <img
                    src={banquet.images[0] || 'https://images.pexels.com/photos/1395964/pexels-photo-1395964.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={banquet.name}
                  />
                </div>
                <div className="banquet-content">
                  <h3>{banquet.name}</h3>
                  <div className="banquet-location">
                    <MapPin size={16} />
                    <span>{banquet.location}</span>
                  </div>
                  <p className="banquet-description">{banquet.description}</p>
                  <div className="banquet-footer">
                    <div className="banquet-price">
                      <IndianRupee size={18} />
                      <span>{banquet.price.toLocaleString('en-IN')}</span>
                    </div>
                    <button
                      className="btn-query"
                      onClick={() => handleSendQuery(banquet)}
                    >
                      <MessageCircle size={18} />
                      Send Query
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
