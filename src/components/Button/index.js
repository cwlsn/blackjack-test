import React from 'react';
import styled from 'styled-components';

const ButtonWrapper = styled.button`
	border-radius: 6px;
	border: none;
	margin-right: 10px;
	color: #fff;
	background: #8313d2;
	font-weight: bold;
	font-size: 21px;
	display: flex;
	align-items: center;
	height: 50px;
	padding: 0 15px;
	cursor: pointer;
	transition: background 0.2s ease-in-out;
	outline: none;
	box-shadow: inset 2px 2px 0px rgba(0, 0, 0, 0.3);
	text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.15);
	font-family: 'KoHo', sans-serif;
	text-transform: uppercase;

	&:hover {
		background: #a223fa;
	}

	&:disabled {
		background: #999;
	}

	&:active {
		box-shadow: inset 4px 4px 4px rgba(0, 0, 0, 0.3);
		padding: 0 14px 0 16px;
	}

	&:last-child {
		margin-right: 0;
	}
`;

function Button({ children, onClick, disabled, className }) {
	return (
		<ButtonWrapper onClick={onClick} disabled={disabled} className={className}>
			{children}
		</ButtonWrapper>
	);
}

export default Button;
