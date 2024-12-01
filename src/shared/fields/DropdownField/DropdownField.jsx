import classNames from 'classnames';
import Label from '../Label/Label.jsx';
import { Dropdown } from 'primereact/dropdown';

function DropdownField({ className, name, placeholder, label, fieldClassName, labelClassName, value, onChange, options, optionLabel, optionValue }) {
    return (
        <div className={classNames('field flex flex-column', className || 'col-12')}>
            <Label labelClassName={labelClassName} name={name} title={label} />
            <Dropdown
                onChange={onChange}
                value={value}
                id={name}
                name={name}
                placeholder={placeholder || ''}
                className={classNames('w-full', fieldClassName || '')}
                options={options || []}
                showClear
                filter
                optionLabel={optionLabel || 'name'}
                optionValue={optionValue || 'value'}
            />
        </div>
    );
}

export default DropdownField;
