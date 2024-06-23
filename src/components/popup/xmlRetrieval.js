import React, { useEffect, useState } from 'react';

const XmlParser = ({ url }) => {
    const [metadata, setMetadata] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const xmlText = await response.text();

                // Parse XML using DOMParser
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

                // Example of checking for a specific element existence
                const resTitleElement = xmlDoc.querySelector('resTitle');
                if (!resTitleElement) {
                    throw new Error('Element "resTitle" not found in XML');
                }

                // Extract metadata (adjust paths based on your XML structure)
                const metadata = {
                    title: resTitleElement.textContent,
                    abstract: xmlDoc.querySelector('idAbs')?.textContent || '',
                    language: xmlDoc.querySelector('languageCode')?.getAttribute('value') || '',
                    // Add more fields as needed
                };

                setMetadata(metadata);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            }
        };

        fetchData();
    }, [url]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!metadata) {
        return <div>Loading...</div>;
    }

    return (
        <div dangerouslySetInnerHTML={{ __html: metadata.abstract }} />
    );
};

export default XmlParser;
