import 'bootstrap/dist/css/bootstrap.min.css';
import '../legend/Gradient.css';
import './popup.css';
import Gradient from '../legend/Gradient';
import XmlParser from './xmlRetrieval';
import JsonParserLegend from './jsonRetrieval';

/**
 * A popup component that displays information when triggered.
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.onChange - The function that handles the change event.
 * @param {Object} props.popUpSettings - The settings for the popup.
 * @returns {JSX.Element} - The Popup component
 */

function Popup({ onChange, popUpSettings }) {
    const handleClick = () => {
        onChange(false);
    };

    return (
        <div className="Popup bg-light">
            <button type="button" className="btn-close" aria-label="Close" onClick={handleClick}></button>
            {popUpSettings.map((element, index) => (
                <div key={index}>
                    <h1 className='popup-title'>{element.legendTitle}</h1>
                    {element.legendType === 'gradient' ? (
                        <Gradient colors={element.legendColors} labels={element.legendPositions} />
                    ) : element.legendType === 'jsonsource' ? (
                        <JsonParserLegend urljson={element.legendSource} metadataObj={element.legendSourceMetadata} />
                    ) : element.legendType === 'directInput' ? (
                        <div dangerouslySetInnerHTML={{ __html: element.content }}></div>
                    ) : (
                        <XmlParser url={element.legendSource} metadataObj={element.legendSourceMetadata} />
                    )}
                </div>
            ))}
        </div>
    );
}

export default Popup;
