const rentalSchema = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "The Alichemist - Cerritos Beach Rentals",
  "description": "Luxury beachfront vacation rentals at Cerritos Beach, Baja California Sur. Featuring Casa Malibu and The Sand Castle, designed and renovated by The Alichemist.",
  "url": "https://alichemist.com/projects/rentals",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Cerritos Beach",
    "addressRegion": "Baja California Sur",
    "addressCountry": "Mexico"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "23.3197",
    "longitude": "-110.1784"
  },
  "priceRange": "$$-$$$",
  "amenityFeature": [
    {
      "@type": "LocationFeatureSpecification",
      "name": "Beach Access",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Ocean View",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Surfing",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Luxury Design",
      "value": true
    }
  ],
  "makesOffer": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Accommodation",
        "name": "Casa Malibu",
        "description": "Modern Hollywood Hills-style rambler with stunning ocean views"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Accommodation",
        "name": "The Sand Castle",
        "description": "Mediterranean-style beach house with luxury amenities"
      }
    }
  ]
};

// Add the schema to your page
const script = document.createElement('script');
script.type = 'application/ld+json';
script.text = JSON.stringify(rentalSchema);
document.head.appendChild(script); 