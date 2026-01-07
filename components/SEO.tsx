import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    type?: string;
}

// Business details for JSON-LD Schema
const BUSINESS_INFO = {
    name: "Mousse and Melts",
    phone: "+923214944712",
    address: {
        street: "Johar Town CII, Phase 1, near UMT",
        city: "Lahore",
        country: "PK"
    },
    priceRange: "$$",
    url: "https://www.moussenmelts.com",
    logoUrl: "https://www.moussenmelts.com/logo.png"
};

// Default SEO values
const DEFAULTS = {
    title: "Mousse & Melts | Premium Bakery & Cakes",
    description: "Order the best cakes, sundaes, and pastries online. Freshly baked Banana Bread, Molten Lava, and more. Fast delivery in Lahore.",
    keywords: "Mousse and Melts, Mousse N Melts, bakery Lahore, cakes near me, online cake delivery, banana bread, molten lava cake, sundaes, pastries, cupcakes, best bakery Lahore",
    image: "https://www.moussenmelts.com/social-share.jpeg",
    type: "website"
};

const SEO: React.FC<SEOProps> = ({
    title = DEFAULTS.title,
    description = DEFAULTS.description,
    keywords = DEFAULTS.keywords,
    image = DEFAULTS.image,
    type = DEFAULTS.type
}) => {
    // JSON-LD Schema for Bakery (helps with "near me" searches)
    const bakerySchema = {
        "@context": "https://schema.org",
        "@type": "Bakery",
        "name": BUSINESS_INFO.name,
        "image": image,
        "description": "Premium bakery serving authentic cakes, sundaes, cupcakes, and savory treats. Fresh banana bread, molten lava cakes, and artisan pastries.",
        "url": BUSINESS_INFO.url,
        "telephone": BUSINESS_INFO.phone,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": BUSINESS_INFO.address.street,
            "addressLocality": BUSINESS_INFO.address.city,
            "addressCountry": BUSINESS_INFO.address.country
        },
        "priceRange": BUSINESS_INFO.priceRange,
        "servesCuisine": ["Bakery", "Desserts", "Pastries", "Cakes"],
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "10:00",
            "closes": "00:00"
        },
        "hasMenu": `${BUSINESS_INFO.url}/#/`,
        "acceptsReservations": false,
        "currenciesAccepted": "PKR",
        "paymentAccepted": "Cash, Credit Card"
    };

    // Local Business Schema for enhanced local SEO
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": BUSINESS_INFO.name,
        "image": image,
        "priceRange": BUSINESS_INFO.priceRange,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": BUSINESS_INFO.address.street,
            "addressLocality": BUSINESS_INFO.address.city,
            "addressCountry": BUSINESS_INFO.address.country
        },
        "telephone": BUSINESS_INFO.phone,
        "url": BUSINESS_INFO.url
    };

    const fullTitle = title === DEFAULTS.title ? title : `${title} | Mousse & Melts`;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={BUSINESS_INFO.url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content={BUSINESS_INFO.name} />
            <meta property="og:locale" content="en_PK" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={BUSINESS_INFO.url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Additional SEO Tags */}
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />
            <meta name="geo.region" content="PK-PB" />
            <meta name="geo.placename" content="Lahore" />
            <link rel="canonical" href={BUSINESS_INFO.url} />

            {/* JSON-LD Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(bakerySchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(localBusinessSchema)}
            </script>
        </Helmet>
    );
};

export default SEO;
