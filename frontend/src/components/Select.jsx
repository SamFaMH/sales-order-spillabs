import React from 'react';

const Select = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Select...',
    disabled = false,
    className = '',
    valueKey = 'id',
    labelKey = 'name',
    ...props
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && <label className="label">{label}</label>}
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="input-field"
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option[valueKey]} value={option[valueKey]}>
                        {option[labelKey]}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;
