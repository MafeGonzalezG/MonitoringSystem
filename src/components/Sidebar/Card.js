import 'bootstrap/dist/css/bootstrap.min.css';
import CustomDropdown from './dropdown/Dropdown';
import './Card.css';
function Card({ title, options, onChange }) {
  const optionChange = (option) => {
    onChange(option);
  };

  return (
    <div className='card bg-light'>
      <div className='card-body'>
        <h5 className='card-title'>{title}</h5>
        <CustomDropdown
          options={options}
          defaultText="Select an option"
          onChange={optionChange}
        />
      </div>
    </div>
  );
}
export default Card;