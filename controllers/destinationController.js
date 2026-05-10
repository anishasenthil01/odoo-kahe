const MOCK_CITIES = [
  { id: 1, city: 'Paris', country: 'France', popularity: 99, cost_index: '$$$', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
  { id: 2, city: 'Kyoto', country: 'Japan', popularity: 95, cost_index: '$$', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e' },
  { id: 3, city: 'Santorini', country: 'Greece', popularity: 92, cost_index: '$$$', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5f1' },
  { id: 4, city: 'Bali', country: 'Indonesia', popularity: 98, cost_index: '$', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4' },
  { id: 5, city: 'London', country: 'UK', popularity: 97, cost_index: '$$$$', image: 'https://images.unsplash.com/photo-1513635269975-5969336cd442' },
  { id: 6, city: 'Rome', country: 'Italy', popularity: 96, cost_index: '$$', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5' },
  { id: 7, city: 'New York', country: 'USA', popularity: 99, cost_index: '$$$$', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9' },
  { id: 8, city: 'Bangkok', country: 'Thailand', popularity: 94, cost_index: '$', image: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a' },
];

const MOCK_ACTIVITIES = [
  // Paris
  { id: 101, city: 'Paris', title: 'Eiffel Tower Summit', type: 'Sightseeing', cost: 35.00, duration_minutes: 120, rating: 4.8, image_url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f' },
  { id: 102, city: 'Paris', title: 'Louvre Museum Guided Tour', type: 'Museum', cost: 50.00, duration_minutes: 180, rating: 4.7, image_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
  { id: 103, city: 'Paris', title: 'Seine River Dinner Cruise', type: 'Dining', cost: 120.00, duration_minutes: 150, rating: 4.9, image_url: 'https://images.unsplash.com/photo-1520627961223-14917406a143' },
  // Kyoto
  { id: 201, city: 'Kyoto', title: 'Traditional Tea Ceremony', type: 'Cultural', cost: 45.00, duration_minutes: 90, rating: 4.9, image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e' },
  { id: 202, city: 'Kyoto', title: 'Fushimi Inari Shrine Hike', type: 'Nature', cost: 0.00, duration_minutes: 180, rating: 4.8, image_url: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36' },
  // General fallback
  { id: 999, city: 'Any', title: 'Local City Walking Tour', type: 'Sightseeing', cost: 20.00, duration_minutes: 120, rating: 4.5, image_url: 'https://images.unsplash.com/photo-1513635269975-5969336cd442' },
  { id: 998, city: 'Any', title: 'Food Tasting Experience', type: 'Dining', cost: 60.00, duration_minutes: 150, rating: 4.8, image_url: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a' },
];

export const searchCities = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(200).json(MOCK_CITIES);
    }

    const query = q.toLowerCase();
    const results = MOCK_CITIES.filter(
      c => c.city.toLowerCase().includes(query) || c.country.toLowerCase().includes(query)
    );

    res.status(200).json(results);
  } catch (error) {
    console.error('Error searching cities:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getActivities = async (req, res) => {
  try {
    const { city, type, maxCost, minRating, maxDuration } = req.query;
    
    let results = MOCK_ACTIVITIES;

    if (city) {
      const query = city.toLowerCase();
      results = results.filter(a => a.city.toLowerCase() === query || a.city === 'Any');
    }

    if (type) {
      results = results.filter(a => a.type === type);
    }

    if (maxCost) {
      results = results.filter(a => a.cost <= parseFloat(maxCost));
    }

    if (minRating) {
      results = results.filter(a => a.rating >= parseFloat(minRating));
    }

    if (maxDuration) {
      results = results.filter(a => a.duration_minutes <= parseInt(maxDuration));
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
