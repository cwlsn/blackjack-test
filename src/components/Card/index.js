import React from 'react';
import styled from 'styled-components';
import { random } from 'lodash';

// 0.714 is playing card aspect ratio
const CardWrapper = styled.div`
	width: calc(30vh * 0.714);
	height: 30vh;
	min-height: 120px;
	min-width: calc(120px * 0.714);
	font-size: 24px;
	padding: 20px;
	background: ${(p) =>
		p.down
			? 'linear-gradient(#0a91e7, #006db2)'
			: 'linear-gradient(aliceblue, white)'};
	box-shadow: -4px 3px 1px rgba(0, 0, 0, 0.1);
	border-radius: 12px;
	color: ${(p) => (p.suit === '♠' || p.suit === '♣' ? '#333' : '#e60000')};
	position: absolute;
	left: calc(50% - 110px);
	overflow: hidden;
	cursor: default;

	&:nth-child(3) {
		left: calc(50% - 50px);
		transform: rotate(${() => random(3, 8)}deg);
	}

	&:before {
		content: '';
		transform: skewY(-40deg);
		position: absolute;
		left: 0;
		top: calc(50% - 20px);
		border-top: 20px solid rgba(255, 255, 255, 0.05);
		height: 250px;
		background: ${(p) =>
			p.down ? 'rgba(255,255,255,0.2)' : 'linear-gradient(#d8e7f4, aliceblue)'};
		width: 100%;
	}
`;

const CardValue = styled.span`
	&:after {
		content: '${(p) => `${p.rank}${p.suit}`}';
		position: absolute;
		bottom: 20px;
		right: 20px;
		transform: rotate(180deg);
	}
`;

function Card({ down, suit, id, rank }) {
	return (
		<CardWrapper down={down} suit={suit} key={id}>
			<CardValue hidden={down} rank={rank} suit={suit}>
				{rank}
				{suit}
			</CardValue>
		</CardWrapper>
	);
}

export default Card;
