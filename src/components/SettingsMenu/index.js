import React from 'react';
import styled from 'styled-components';
import Toggle from 'react-toggle';
import Button from '../Button';

const SettingsButton = styled(Button)`
	font-size: 14px;
	background: #0469aa;
	font-weight: bold;
	padding: 0 10px;
	height: 30px;

	&:hover {
		background: #0783d4;
	}

	&:active {
		padding: 0 9px 0 11px;
	}
`;

const SettingsPopout = styled.div`
	background: #1a4460;
	color: #fff;
	border-radius: 10px;
	padding: 15px 15px 5px;
	width: 350px;
	position: absolute;
	bottom: 10px;
	right: 10px;
	box-shadow: -2px -2px 6px rgba(0, 0, 0, 0.1);
`;

const SettingsField = styled.div`
	border-top: 1px solid rgba(255, 255, 255, 0.2);
	padding: 10px 0;

	& > label {
		display: flex;
		align-items: center;
		flex-flow: row-reverse;
		justify-content: space-between;
		font-size: 15px;
	}
`;

const SettingsHeading = styled.h4`
	margin: 0 0 10px;
	font-size: 18px;
	padding: 0;
	display: flex;
	align-items: center;
`;

const CloseSettings = styled.span`
	color: rgba(255, 255, 255, 0.5);
	position: absolute;
	top: -3px;
	right: 15px;
	font-size: 32px;
	cursor: pointer;
	transition: color 0.2s ease-in-out;

	&:hover {
		color: rgba(255, 255, 255, 0.75);
	}
`;

function SettingsMenu({ settings, saveSetting, hidden, close, resetScore }) {
	return (
		<SettingsPopout hidden={hidden}>
			<SettingsHeading>Settings</SettingsHeading>
			<CloseSettings onClick={close}>&times;</CloseSettings>
			<SettingsField>
				<label>
					<Toggle
						checked={settings.allowSave}
						onChange={(e) => saveSetting('allowSave', e.target.checked)}
					/>
					<span>Save when window closes</span>
				</label>
			</SettingsField>
			<SettingsField>
				<label>
					<Toggle
						checked={settings.hitSoft17}
						disabled
						onChange={(e) => saveSetting('hitSoft17', e.target.checked)}
					/>
					<span>Dealer hits soft 17</span>
				</label>
			</SettingsField>
			<SettingsField>
				<label>
					<Toggle
						checked={settings.offerInsurance}
						onChange={(e) => saveSetting('offerInsurance', e.target.checked)}
					/>
					<span>Offer Insurance</span>
				</label>
			</SettingsField>
			<SettingsField>
				<SettingsButton onClick={resetScore}>Reset Score</SettingsButton>
			</SettingsField>
		</SettingsPopout>
	);
}

export default SettingsMenu;
