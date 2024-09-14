import 'bootstrap/dist/css/bootstrap.min.css';
import CustomDropdown from './dropdown/Dropdown';
import './Card.css';
/**
 * A card component that displays a title and a dropdown.
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the card.
 * @param {Array} props.options - The list of options to be displayed in the dropdown.
 * @param {Function} props.onChange - The function that handles the change event.
 * @param {boolean} props.isSelected - A boolean that determines whether an option is selected.
 * @param {Array} props.disabledOptions - The list of options to be disabled.
 * @returns {JSX.Element} - The Card component
 * @example
 * <Card
 * title='Card title'
 * options={['Option 1', 'Option 2', 'Option 3']}
 * onChange={(option) => console.log(option)}
 * isSelected={false}
 * disabledOptions={['Option 2']}
 * />
 */
function Card({ title, options, onChange,isSelected,disabledOptions }) {
  const optionChange = (option) => {
    onChange(option);
  };

  return (
    <div className='card mb-3 bg-light'>
      <div className='card-body'>
        <h5 className='card-title'>{title}</h5>
        <CustomDropdown
          options={options}
          defaultText="Select an option"
          onChange={optionChange}
          isSelected={isSelected} 
          disabledOptions={disabledOptions}
        />
      </div>
    </div>
  );
}
export default Card;