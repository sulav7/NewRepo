import React from 'react';
import { ErrorMessage, useField } from 'formik';
import { RiErrorWarningFill } from 'react-icons/ri';
const TextField = ({ label, placeholder, type, ...otherProps }) => {
	const [field, meta] = useField(otherProps);
	return (
		<div className="input__text__feild__gap form-group mb-3">
			<label
				className={`input__label ${
					meta.error && meta.touched
						? 'input__label__error__color'
						: 'position-relative'
				} `}
				htmlFor={field.name}
			>
				{label}{' '}
				<b
					className="text-danger position-absolute"
					style={{ marginLeft: '.2rem' }}
				>
					*
				</b>
			</label>

			<input
				className={`form-control  ${
					meta.touched && meta.error ? 'is-invalid' : ''
				} ${!meta.error ? 'is-valid' : ''}`}
				{...field}
				type={type}
				placeholder={placeholder}
				autoComplete="off"
			/>
			{meta.touched && meta.error ? (
				<div className="input__error__icon">
					<RiErrorWarningFill />
				</div>
			) : (
				''
			)}
			<ErrorMessage
				component="div"
				name={field.name}
				className="input__error__container mb-3"
			/>
		</div>
	);
};

export default TextField;
