import React, { useState } from 'react';
import classNames from 'classnames';
import { InputText } from 'primereact/inputtext';
import { InputIcon } from 'primereact/inputicon';
import { IconField } from 'primereact/iconfield';
import Label from '../Label/Label.jsx';

function PasswordField({ className, name, placeholder, label, fieldClassName, labelClassName, onChange, value }) {
  const [show, setShow] = useState(false);
  const icon = {
    true: 'pi pi-eye-slash',
    false: 'pi pi-eye',
  };
  const type = {
    true: 'text',
    false: 'password',
  };

  return (
    <div className={classNames('field flex flex-column', className || 'col-12')}>
      <Label labelClassName={labelClassName} name={name} title={label}/>
      <IconField>
        <InputIcon onClick={() => setShow(!show)} className={icon[show]} />
        <InputText
          type={type[show]}
          name={name}
          id={name}
          className={classNames('w-full', fieldClassName || '')}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </IconField>
    </div>
  );
}

export default PasswordField;
