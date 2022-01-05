import React, { Component } from 'react'
import { Field, getIn } from 'formik';

function getStyles(errors, fieldName) {
    if (getIn(errors, fieldName)) {
        return {
            border: '1px solid red'
        }
    }
}

function CustomInputStyle({ field, form: { errors } }) {
    return <div>
        <input {...field} style={getStyles(errors, field.name)} />
    </div>
}


class CustomInput extends Component {

    handleChange = value => {
        const { name, onChange } = this.props;
        onChange(name, value.target.value);
    };

    handleBlur = () => {
        const { name, onBlur } = this.props;
        if (onBlur) {
            onBlur(name, true);
        }
    };

    render() {

        const { label, errors, id, name, value, ...attributes } = this.props;
        const err = getIn(errors, name);
        return (
            <>
                {label !== undefined && <label htmlFor={id || name}>{label ? label : '\u00a0'}</label>}<br />
                <Field
                    // component={attributes.as == undefined ? CustomInputStyle : ''}
                    {...attributes}
                    name={name}
                    value={value || ''}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                />
                {err ? <div style={{ color: 'red' }}>{err}</div> : null}
            </>
        );
    }
}


export default CustomInput;

