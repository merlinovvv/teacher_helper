import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';

function Label({ name, title, labelClassName }) {
  const { errors, touched } = useFormikContext();

  if (!errors || !touched) {
    console.error('No Formik context(');
    return null;
  }

  const names = name.split('.');

  const getNestedValue = (obj, path) => {
    return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
  };

  const errorMessage = getNestedValue(errors, names);

  return (
    <label className={labelClassName || 'font-bold text-color'}>
      {errorMessage ? <span className="text-red-500">{errorMessage}</span> : title}
    </label>
  );
}

Label.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  labelClassName: PropTypes.string
};

export default Label;