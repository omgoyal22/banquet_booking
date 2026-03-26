import { useState, FormEvent, useEffect } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, Banquet, LOCATIONS } from '../lib/supabase';
import './BanquetForm.css';

interface BanquetFormProps {
  banquet: Banquet | null;
  onClose: () => void;
}

export function BanquetForm({ banquet, onClose }: BanquetFormProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('Delhi');
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (banquet) {
      setName(banquet.name);
      setDescription(banquet.description);
      setPrice(banquet.price.toString());
      setLocation(banquet.location);
      setImages(banquet.images);
      setPublished(banquet.published);
    }
  }, [banquet]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setImageFiles([...imageFiles, ...newFiles]);

    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return images;

    const uploadedUrls: string[] = [];

    for (const file of imageFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user!.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('banquet-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('banquet-images')
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    }

    return [...images.filter(img => !img.startsWith('data:')), ...uploadedUrls];
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setUploading(true);

    try {
      const uploadedImages = await uploadImages();

      if (uploadedImages.length === 0) {
        setError('Please add at least one image');
        setLoading(false);
        setUploading(false);
        return;
      }

      const banquetData = {
        name,
        description,
        price: parseFloat(price),
        location,
        images: uploadedImages,
        published,
        user_id: user!.id,
      };

      if (banquet) {
        const { error: updateError } = await supabase
          .from('banquets')
          .update(banquetData)
          .eq('id', banquet.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('banquets')
          .insert([banquetData]);

        if (insertError) throw insertError;
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{banquet ? 'Edit Banquet' : 'Add New Banquet'}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Banquet Name *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Grand Palace Banquet Hall"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            >
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (₹) *</label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="1"
              placeholder="e.g., 50000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Describe the banquet hall features, capacity, amenities, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="images">Images *</label>
            <div className="image-upload">
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="images" className="upload-button">
                <Upload size={20} />
                Upload Images
              </label>
            </div>

            {images.length > 0 && (
              <div className="image-preview-grid">
                {images.map((img, index) => (
                  <div key={index} className="image-preview">
                    <img src={img} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
              <span>Publish this banquet (make it visible to users)</span>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || uploading}
            >
              {uploading ? 'Uploading images...' : loading ? 'Saving...' : banquet ? 'Update Banquet' : 'Create Banquet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
