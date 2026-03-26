import { MapPin } from 'lucide-react';
import { LOCATIONS } from '../lib/supabase';
import './Home.css';
import delhiCover from '../assets/location-covers/delhi.png';
import mumbaiCover from '../assets/location-covers/mumbai.png';
import indoreCover from '../assets/location-covers/indore.png';
import lucknowCover from '../assets/location-covers/lucknow.png';
import ahmedabadCover from '../assets/location-covers/ahmedabad.png';
import agraCover from '../assets/location-covers/agra.png';

interface HomeProps {
  onSelectLocation: (location: string) => void;
}

const locationImages: Record<string, string> = {
  Delhi: delhiCover,
  Mumbai: mumbaiCover,
  Indore: indoreCover,
  Lucknow: lucknowCover,
  Agra: agraCover,
  Ahmedabad: ahmedabadCover
};

export function Home({ onSelectLocation }: HomeProps) {
  return (
    <div className="home">
      <div className="hero">
        <h1>Find Your Perfect Banquet Hall</h1>
        <p>Discover the best banquet venues across India</p>
      </div>

      <div className="locations-container">
        <h2>Browse by Location</h2>
        <div className="locations-grid">
          {LOCATIONS.map((location) => (
            <div
              key={location}
              className="location-card"
              onClick={() => onSelectLocation(location)}
            >
              <div className="location-image">
                <img src={locationImages[location]} alt={location} />
                <div className="location-overlay"></div>
              </div>
              <div className="location-content">
                <MapPin size={20} />
                <h3>{location}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
