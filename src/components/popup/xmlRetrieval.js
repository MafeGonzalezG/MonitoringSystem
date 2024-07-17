import React, { useEffect, useState } from 'react';
/**
 * A custom XML parser component.
 * @component
 * @param {object} props - The component props.
 * @param {string} props.url - The URL of the XML file.
 * @param {object} props.metadataObj - The object containing the metadata keys and their corresponding XML paths.
 * @returns {JSX.Element} - The XmlParser component
 */
const XmlParser = ({ url,metadataObj}) => {
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

                // // Example of checking for a specific element existence
                // const resTitleElement = xmlDoc.querySelector('resTitle');
                // if (!resTitleElement) {
                //     throw new Error('Element "resTitle" not found in XML');
                // }
                const metadata = {};
                for(let key in metadataObj){
                    metadata[key] = xmlDoc.querySelector(metadataObj[key])?.textContent || '';
                }

                // Extract metadata (adjust paths based on your XML structure)
                // const metadata = {
                //     title: resTitleElement.textContent,
                //     abstract: xmlDoc.querySelector('idAbs')?.textContent || '',
                //     language: xmlDoc.querySelector('languageCode')?.getAttribute('value') || '',
                //     // Add more fields as needed
                // };

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
        <div>
        {Object.keys(metadata).map((key) => (
            <div key={key} dangerouslySetInnerHTML={{ __html: metadata[key] }}></div>
        ))}
        </div>
    );
};

export default XmlParser;
