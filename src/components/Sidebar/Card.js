import 'bootstrap/dist/css/bootstrap.min.css';
import CustomDropdown from './dropdown/Dropdown';
import './Card.css';
function Card({ title, options, onChange,isSelected }) {
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
        />
      </div>
    </div>
  );
}
export default Card;