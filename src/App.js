import React, { Component } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { GetRecommendedPlayerAction as getChartResult } from 'blackjack-strategy';
import { ToastContainer, Flip, toast } from 'react-toastify';
import Toggle from 'react-toggle';
import { Sparklines, SparklinesCurve, SparklinesSpots } from 'react-sparklines';
import { random } from 'lodash';
import { newDeck } from './deck';

import 'react-toastify/dist/ReactToastify.css';

const GlobalStyle = createGlobalStyle`
	@import url('https://fonts.googleapis.com/css?family=KoHo:400,700');

	* {
		box-sizing: border-box;
		font-family: 'KoHo';
		text-transform: uppercase;
	}

	body {
		margin: 0;
		padding: 0;
		overflow: hidden;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		user-select: none;
	}

	.toast_override {
		border-radius: 6px;
		padding: 10px 20px;
	}

	.react-toggle {
		touch-action: pan-x;

		display: inline-block;
		position: relative;
		cursor: pointer;
		background-color: transparent;
		border: 0;
		padding: 0;

		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;

		-webkit-tap-highlight-color: rgba(0,0,0,0);
		-webkit-tap-highlight-color: transparent;
	}

	.react-toggle-screenreader-only {
		border: 0;
		clip: rect(0 0 0 0);
		height: 1px;
		margin: -1px;
		overflow: hidden;
		padding: 0;
		position: absolute;
		width: 1px;
	}

	.react-toggle--disabled {
		cursor: not-allowed;
		opacity: 0.5;
		-webkit-transition: opacity 0.25s;
		transition: opacity 0.25s;
	}

	.react-toggle-track {
		width: 50px;
		height: 24px;
		padding: 0;
		border-radius: 30px;
		background-color: #4D4D4D;
		-webkit-transition: all 0.2s ease;
		-moz-transition: all 0.2s ease;
		transition: all 0.2s ease;
	}

	.react-toggle:hover:not(.react-toggle--disabled) .react-toggle-track {
		background-color: #000000;
	}

	.react-toggle--checked .react-toggle-track {
		background-color: #19AB27;
	}

	.react-toggle--checked:hover:not(.react-toggle--disabled) .react-toggle-track {
		background-color: #128D15;
	}

	.react-toggle-track-check {
		position: absolute;
		width: 14px;
		height: 10px;
		top: 0px;
		bottom: 0px;
		margin-top: auto;
		margin-bottom: auto;
		line-height: 0;
		left: 8px;
		opacity: 0;
		-webkit-transition: opacity 0.25s ease;
		-moz-transition: opacity 0.25s ease;
		transition: opacity 0.25s ease;
	}

	.react-toggle--checked .react-toggle-track-check {
		opacity: 1;
		-webkit-transition: opacity 0.25s ease;
		-moz-transition: opacity 0.25s ease;
		transition: opacity 0.25s ease;
	}

	.react-toggle-track-x {
		position: absolute;
		width: 10px;
		height: 10px;
		top: 0px;
		bottom: 0px;
		margin-top: auto;
		margin-bottom: auto;
		line-height: 0;
		right: 10px;
		opacity: 1;
		-webkit-transition: opacity 0.25s ease;
		-moz-transition: opacity 0.25s ease;
		transition: opacity 0.25s ease;
	}

	.react-toggle--checked .react-toggle-track-x {
		opacity: 0;
	}

	.react-toggle-thumb {
		transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
		position: absolute;
		top: 1px;
		left: 1px;
		width: 22px;
		height: 22px;
		border: 1px solid #4D4D4D;
		border-radius: 50%;
		background-color: #FAFAFA;

		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;

		-webkit-transition: all 0.25s ease;
		-moz-transition: all 0.25s ease;
		transition: all 0.25s ease;
	}

	.react-toggle--checked .react-toggle-thumb {
		left: 27px;
		border-color: #19AB27;
	}

	.react-toggle--focus .react-toggle-thumb {
		-webkit-box-shadow: 0px 0px 3px 2px #0099E0;
		-moz-box-shadow: 0px 0px 3px 2px #0099E0;
		box-shadow: 0px 0px 2px 3px #0099E0;
	}

	.react-toggle:active:not(.react-toggle--disabled) .react-toggle-thumb {
		-webkit-box-shadow: 0px 0px 5px 5px #0099E0;
		-moz-box-shadow: 0px 0px 5px 5px #0099E0;
		box-shadow: 0px 0px 5px 5px #0099E0;
	}
`;

const Wrapper = styled.section`
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background: linear-gradient(45deg, #152936 0%, #3f4c6b 100%);
`;

const CircleDec = styled.div`
	width: 170vh;
	height: 170vh;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	border: 150px solid rgba(0, 0, 0, 0.2);
	border-radius: 9999px;

	&:after {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		border-radius: 999px;
		border: 20vh solid rgba(0, 0, 0, 0.12);
	}
`;

const Title = styled.h1`
	text-align: center;
	color: #fff;
	font-size: 42px;
	position: relative;
	text-transform: none;
	text-shadow: 4px 4px 0px rgba(0, 0, 0, 0.2);

	&:after {
		content: "What's your first move?";
		text-transform: uppercase;
		text-shadow: none;
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		text-align: right;
		font-size: 18px;
		color: rgba(255, 255, 255, 0.6);
	}
`;

const Hand = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	justify-content: center;
	height: 35vh;
`;

const DealerHand = styled(Hand)``;

const PlayerHand = styled(Hand)`
	padding-top: 130px;
`;

const Name = styled.span`
	font-size: 24px;
	color: #fff;
	font-weight: bold;
	position: absolute;
	left: 50%;
	transform: translateX(-400px);
	text-align: right;
	width: 200px;
	display: inline-block;
`;

const HandScore = styled.span`
	font-size: 28px;
	color: rgba(255, 255, 255, 0.8);
	position: absolute;
	left: 50%;
	transform: translateX(200px);
	width: 200px;
	display: inline-block;
`;
// 0.714 is playing card aspect ratio
const Card = styled.div`
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

const ActionBar = styled.footer`
	position: fixed;
	top: 0;
	height: 60px;
	display: flex;
	width: 100%;
	align-items: center;
	color: #fff;
	justify-content: space-between;
	padding: 0 10px;
`;

const ButtonGroup = styled.div`
	display: flex;
	position: absolute;
	top: 0;
	padding: 10px;
	border-radius: 10px;
`;

const Button = styled.button`
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

const SettingsButton = styled(Button)`
	font-size: 14px;
	background: #0469aa;
	font-weight: bold;
	padding: 0 10px;
	height: 30px;

	&:hover {
		background: #0783d4;
	}
`;

const GameScore = styled.span`
	font-size: 56px;
	font-weight: bold;

	&:after {
		content: '%';
		font-size: 36px;
		color: rgba(255, 255, 255, 0.4);
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

const SettingsIcon = styled.i`
	position: absolute;
	bottom: 10px;
	right: 10px;
	font-size: 21px;
	font-style: normal;
	cursor: pointer;
	display: ${(p) => (p.hidden ? 'none' : 'flex')};
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	border-radius: 99px;
	transition: background 0.2s ease-in-out;

	&:hover {
		background: rgba(255, 255, 255, 0.2);
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

const Graph = styled.div`
	position: absolute;
	top: 60px;
	left: 10px;
	width: 200px;
	height: 50px;
`;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			deck: [],
			deadCards: [],
			dealerHand: [],
			playerHand: [],
			gameScore: {
				correct: 0,
				total: 0,
				recentPercents: [],
			},
			settings: {
				decks: 6,
				redealTolerance: 0.15,
				allowSave: true,
				hitSoft17: false,
				offerInsurance: false,
			},
			settingsHidden: true,
		};
	}

	componentDidMount() {
		// Get items from localstorage regardless of settings to check
		let savedSettings = JSON.parse(
			localStorage.getItem('cwlsn:blackjack:settings')
		);
		// If no saved settings, means first visit or hard reset
		// so set it to default
		if (!savedSettings) {
			localStorage.setItem(
				'cwlsn:blackjack:settings',
				JSON.stringify(this.state.settings)
			);
			savedSettings = this.state.settings;
		} else {
			this.setState({ settings: { ...savedSettings } });
		}
		// Get gameData if any
		const savedGameData = JSON.parse(localStorage.getItem('cwlsn:blackjack'));
		if (savedGameData) {
			this.setState(savedGameData);
			toast.info('Previous session restored');
		} else {
			this.resetDeck();
		}
		// Setup close listener
		window.addEventListener('beforeunload', () => {
			this.onUnload();
		});
	}

	onUnload = () => {
		// Use current state
		const { settings, ...gameData } = this.state;
		if (settings.allowSave) {
			localStorage.setItem('cwlsn:blackjack', JSON.stringify(gameData));
		} else {
			localStorage.removeItem('cwlsn:blackjack');
		}
		// Always save settings
		localStorage.setItem('cwlsn:blackjack:settings', JSON.stringify(settings));
	};

	guess = (answer) => {
		const { gameScore, playerHand, dealerHand, deck, settings } = this.state;
		const options = {
			hitSoft17: settings.hitSoft17,
			surrender: 'none',
			offerInsurance: settings.offerInsurance,
			numberOfDecks: 6,
		};

		const result = getChartResult(
			playerHand.map((c) => this.cardValue(c.rank)),
			this.cardValue(dealerHand[1].rank) % 10, // lib wants A = 1
			1,
			false,
			options
		);

		let earned = 0;
		if (result === answer) {
			earned = 1;
			toast.success('Correct!');
		} else {
			toast.error(`Wrong! (${result})`);
		}

		const correct = gameScore.correct + earned;
		const total = gameScore.total + 1;
		const newPercent = Math.ceil((correct / total) * 100);

		this.setState(
			(prevState) => ({
				gameScore: {
					recentPercents: [...prevState.gameScore.recentPercents, newPercent],
					correct,
					total,
				},
			}),
			() => {
				if (deck.length / (settings.decks * 52) > settings.redealTolerance) {
					this.deal();
				} else {
					toast.info('Deck re-shuffled!');
					this.resetDeck();
				}
			}
		);
	};

	drawCard = (down = false) => {
		const [card, ...deck] = this.state.deck;
		this.setState({ deck });
		return {
			down,
			...card,
		};
	};

	resetDeck = () => {
		const deck = newDeck(this.state.settings.decks);
		this.setState({ deck }, this.deal);
	};

	deal = async () => {
		const dealerHand = [];
		const playerHand = [];
		// lol
		playerHand.push(await this.drawCard());
		dealerHand.push(await this.drawCard(true));
		playerHand.push(await this.drawCard());
		dealerHand.push(await this.drawCard());

		this.setState({
			dealerHand,
			playerHand,
		});
	};

	cardValue(rank) {
		let value = parseInt(rank);
		if (rank === 'A') {
			value = 11;
		} else if (isNaN(value)) {
			value = 10;
		}
		return value;
	}

	calculateScore = (hand) => {
		// this desctructure is madness, don't do this at your job
		const [{ rank: firstRank }, { rank: secondRank }] = hand;
		if (firstRank === 'A' && secondRank === 'A') {
			return 'Soft 12';
		}

		let soft = false;
		if (firstRank === 'A' || secondRank === 'A') {
			soft = true;
		}

		const total = this.cardValue(firstRank) + this.cardValue(secondRank);
		return total === 21 ? 'Blackjack!' : `${soft ? 'Soft' : 'Hard'} ${total}`;
	};

	resetScore = () => {
		this.setState({
			gameScore: {
				correct: 0,
				total: 0,
				recentPercents: [],
			},
		});
	};

	renderHand = (hand) =>
		hand.length > 0 && (
			<>
				{hand.map((card) => (
					<Card down={card.down} suit={card.suit} key={card.id}>
						<CardValue hidden={card.down} rank={card.rank} suit={card.suit}>
							{card.rank}
							{card.suit}
						</CardValue>
					</Card>
				))}
			</>
		);

	saveSetting = (key, value) => {
		this.setState({
			settings: {
				...this.state.settings,
				[key]: value,
			},
		});
	};

	render() {
		const {
			dealerHand,
			playerHand,
			gameScore,
			deck,
			settings,
			settingsHidden,
		} = this.state;

		return (
			<>
				<GlobalStyle />
				<Wrapper>
					<CircleDec />
					<Graph>
						<Sparklines
							data={gameScore.recentPercents}
							min={0}
							max={100}
							width={200}
							height={50}
							margin={3}
						>
							<SparklinesCurve color="white" style={{ strokeWidth: 2 }} />
							<SparklinesSpots
								size={3}
								spotColors={{
									'-1': '#ff4848',
									'0': 'white',
									'1': '#48ff55',
								}}
							/>
						</Sparklines>
					</Graph>
					<Title>Blackjack Practice Tool</Title>
					<DealerHand>
						<Name>Dealer</Name>
						{this.renderHand(dealerHand)}
					</DealerHand>
					<PlayerHand>
						<Name>Your Hand</Name>
						{this.renderHand(playerHand)}
						<HandScore>
							{playerHand.length > 0 && this.calculateScore(playerHand)}
						</HandScore>
						<ButtonGroup>
							<Button onClick={() => this.guess('hit')}>Hit</Button>
							<Button onClick={() => this.guess('stand')}>Stand</Button>
							<Button onClick={() => this.guess('double')}>Double</Button>
							<Button onClick={() => this.guess('split')}>Split</Button>
							{settings.offerInsurance && (
								<>
									<Button
										onClick={() => this.guess('insurance')}
										disabled={dealerHand[1].rank !== 'A'}
									>
										Insurance
									</Button>
									<Button
										onClick={() => this.guess('noinsurance')}
										disabled={dealerHand[1].rank !== 'A'}
									>
										No Insurance
									</Button>
								</>
							)}
						</ButtonGroup>
					</PlayerHand>
					<ActionBar>
						<GameScore>
							{gameScore.total > 0
								? Math.ceil((gameScore.correct / gameScore.total) * 100)
								: 0}
						</GameScore>
					</ActionBar>
					<SettingsPopout hidden={settingsHidden}>
						<SettingsHeading>Settings</SettingsHeading>
						<CloseSettings
							onClick={() => this.setState({ settingsHidden: true })}
						>
							&times;
						</CloseSettings>
						<SettingsField>
							<label>
								<Toggle
									checked={settings.allowSave}
									onChange={(e) =>
										this.saveSetting('allowSave', e.target.checked)
									}
								/>
								<span>Save when window closes</span>
							</label>
						</SettingsField>
						<SettingsField>
							<label>
								<Toggle
									checked={settings.hitSoft17}
									disabled
									onChange={(e) =>
										this.saveSetting('hitSoft17', e.target.checked)
									}
								/>
								<span>Dealer hits soft 17</span>
							</label>
						</SettingsField>
						<SettingsField>
							<label>
								<Toggle
									checked={settings.offerInsurance}
									onChange={(e) =>
										this.saveSetting('offerInsurance', e.target.checked)
									}
								/>
								<span>Offer Insurance</span>
							</label>
						</SettingsField>
						<SettingsField>
							<SettingsButton onClick={this.resetScore}>
								Reset Score
							</SettingsButton>
						</SettingsField>
					</SettingsPopout>
					<SettingsIcon
						hidden={!settingsHidden}
						onClick={() => this.setState({ settingsHidden: false })}
					>
						&#9881;
					</SettingsIcon>
					<ToastContainer
						position="bottom-left"
						toastClassName="toast_override"
						autoClose={3000}
						newestOnTop={false}
						rtl={false}
						pauseOnVisibilityChange
						draggable={false}
						transition={Flip}
						pauseOnHover={false}
						closeButton={false}
						hideProgressBar
						closeOnClick
					/>
				</Wrapper>
			</>
		);
	}
}

export default App;
