import classNames from 'classnames';
import Label from '../Label/Label.jsx';
import { Calendar } from 'primereact/calendar';

function CalendarField({ className, name, placeholder, label, fieldClassName, labelClassName, value, onChange, selectionMode, numberOfMonths }) {
    return (
        <div className={classNames('field flex flex-column', className || 'col-12')}>
            <Label labelClassName={labelClassName} name={name} title={label} />
            <Calendar
                className={fieldClassName || ''}
                placeholder={placeholder || ''}
                locale="uk"
                showIcon
                selectionMode={selectionMode}
                readOnlyInput
                numberOfMonths={numberOfMonths}
                name={name}
                value={value}
                onChange={onChange}
                touchUI
                dateFormat="dd.mm.yy"
            />
        </div>
    );
}

export default CalendarField;
