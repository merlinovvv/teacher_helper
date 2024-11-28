import classNames from 'classnames';
import { InputText } from 'primereact/inputtext';
import Label from '../Label/Label.jsx';

function TextField({ className, name, type, placeholder, label, fieldClassName, labelClassName, value, onChange }) {
  return (
    <div className={classNames('field', className || 'col-12')}>
      <Label labelClassName={labelClassName} name={name} title={label}/>
      <InputText
        onChange={onChange}
        value={value}
        id={name}
        name={name}
        type={type || 'text'}
        placeholder={placeholder || ''}
        className={classNames('w-full', fieldClassName || '')}
      />
    </div>
  );
}

export default TextField;
