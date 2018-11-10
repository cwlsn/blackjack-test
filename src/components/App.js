import React, { Component } from 'react';
import styled from 'styled-components';
import { GetRecommendedPlayerAction as getChartResult } from 'blackjack-strategy';
import { ToastContainer, Flip, toast } from 'react-toastify';

import Button from './Button';
import Card from './Card';
import GlobalStyle from './GlobalStyle';
import Graph from './Graph';
import SettingsMenu from './SettingsMenu';

import { newDeck } from '../deck';
import { cardValue, calculateScore } from '../util';

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

const GameScore = styled.span`
	font-size: 56px;
	font-weight: bold;

	&:after {
		content: '%';
		font-size: 36px;
		color: rgba(255, 255, 255, 0.4);
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
class App extends Component {
	state = {
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
			playerHand.map((c) => cardValue(c.rank)),
			cardValue(dealerHand[1].rank) % 10, // lib wants A = 1
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
		hand.length > 0 &&
		hand.map((card) => (
			<Card down={card.down} suit={card.suit} rank={card.rank} key={card.id} />
		));

	saveSetting = (key, value) => {
		this.setState({
			settings: {
				...this.state.settings,
				[key]: value,
			},
		});
	};

	closeSettings = () => {
		this.setState({ settingsHidden: true });
	};

	render() {
		const {
			dealerHand,
			playerHand,
			gameScore,
			settings,
			settingsHidden,
		} = this.state;

		return (
			<>
				<GlobalStyle />
				<Wrapper>
					<CircleDec />
					<Graph data={gameScore.recentPercents} />
					<Title>Blackjack Practice Tool</Title>
					<DealerHand>
						<Name>Dealer</Name>
						{this.renderHand(dealerHand)}
					</DealerHand>
					<PlayerHand>
						<Name>Your Hand</Name>
						{this.renderHand(playerHand)}
						<HandScore>
							{playerHand.length > 0 && calculateScore(playerHand)}
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
					<SettingsMenu
						settings={settings}
						saveSetting={this.saveSetting}
						resetScore={this.resetScore}
						close={this.closeSettings}
						hidden={settingsHidden}
					/>
					<SettingsIcon
						hidden={!settingsHidden}
						onClick={() => this.setState({ settingsHidden: false })}
					>
						&#9881;
					</SettingsIcon>
				</Wrapper>
				<ToastContainer
					position="bottom-left"
					toastClassName="toast_override"
					autoClose={3000}
					newestOnTop={false}
					draggable={false}
					transition={Flip}
					pauseOnHover={false}
					closeButton={false}
					style={{
						borderRadius: '6px',
						fontFamily: 'KoHo, sans-serif',
					}}
					pauseOnVisibilityChange
					hideProgressBar
					closeOnClick
				/>
			</>
		);
	}
}

export default App;
