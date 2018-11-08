import React, { Component } from "react";
import styled, { createGlobalStyle, css } from "styled-components";
import { random } from "lodash";
import { GetRecommendedPlayerAction as getChartResult } from "blackjack-strategy";
import { ToastContainer, Flip, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { newDeck } from "./deck";

const GlobalStyle = createGlobalStyle`
	@import url('https://fonts.googleapis.com/css?family=Quicksand:400,700');
	* {
		box-sizing: border-box;
		font-family: 'Quicksand';
	}
	.toast_override {
		border-radius: 6px;
		padding: 10px 20px;
	}
`;
const Wrapper = styled.section`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #152936;
`;

const CircleDec = styled.div`
  width: 82.5vw;
  height: 82.5vw;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 150px solid rgba(0, 0, 0, 0.3);
  border-radius: 9999px;
`;

const Title = styled.h1`
  text-align: center;
  color: #fff;
  font-size: 36px;
  position: relative;

  &:after {
    content: "What do you do?";
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
  height: 300px;
`;

const DealerHand = styled(Hand)``;

const PlayerHand = styled(Hand)`
  height: 400px;
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

const Card = styled.div`
  height: 210px;
  width: 140px;
  padding: 20px;
  font-size: 24px;
  background: ${p => (p.down ? "#006db2" : "#fff")};
  box-shadow: -3px 2px 3px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  color: ${p => (p.suit === "♠" || p.suit === "♣" ? "#333" : "#e60000")};
  position: absolute;
  overflow: hidden;

  &:nth-child(3) {
    left: calc(50% - 10px);
    transform: rotate(${p => random(2, 6)}deg);
  }

  &:before {
    content: "";
    transform: skewY(-40deg);
    position: absolute;
    left: -50px;
    top: 120px;
    height: 250px;
    background: ${p => (p.down ? "rgba(255,255,255,0.2)" : "aliceblue")};
    width: 200px;
  }
`;

const CardValue = styled.span`
	&:after {
		content: '${p => `${p.rank}${p.suit}`}';
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
  background: rgba(255, 255, 255, 0.1);
  position: absolute;
  top: 0;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 2px 1px 4px rgba(0, 0, 0, 0.2);

  &:after {
    top: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(255, 255, 255, 0);
    border-top-color: rgba(255, 255, 255, 0.1);
    border-width: 15px;
    margin-left: -15px;
  }
`;

const Button = styled.button`
  border-radius: 6px;
  border: none;
  margin-right: 10px;
  color: #fff;
  background: #8313d2;
  font-size: 16px;
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 15px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
  outline: none;

  &:hover {
    background: #a223fa;
  }

  &:disabled {
    background: #999;
  }

  &:last-child {
    margin-right: 0;
  }
`;

const Score = styled.span`
  font-size: 18px;
`;

const GameScore = styled.span`
  font-size: 36px;

  & > small {
    font-weight: bold;
    font-size: 28px;
    color: rgba(255, 255, 255, 0.6);
  }
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
        total: 0
      }
    };
  }

  componentDidMount() {
    this.resetDeck();
  }

  guess = answer => {
    const { gameScore, playerHand, dealerHand } = this.state;
    const options = {
      hitSoft17: false,
      surrender: "none",
      offerInsurance: false,
      numberOfDecks: 6
    };

    const result = getChartResult(
      playerHand.map(c => this.cardValue(c.rank)),
      this.cardValue(dealerHand[1].rank),
      1,
      false,
      options
    );

    let earned = 0;
    if (result === answer) {
      earned = 1;
      toast.success("Correct!");
    } else {
      toast.error(`Wrong! (${result})`);
    }

    this.setState(
      {
        gameScore: {
          correct: gameScore.correct + earned,
          total: gameScore.total + 1
        }
      },
      this.deal
    );
  };

  drawCard = (down = false) => {
    const [card, ...deck] = this.state.deck;
    this.setState({ deck });
    return {
      down,
      ...card
    };
  };

  resetDeck = () => {
    const deck = newDeck(6);
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
      playerHand
    });
  };

  cardValue(rank) {
    let value;
    const parsedRank = parseInt(rank);
    if (rank === "A") {
      value = 11;
    } else if (isNaN(parsedRank)) {
      value = 10;
    } else {
      value = parsedRank;
    }
    return value;
  }

  calculateScore = () => {
    const { playerHand } = this.state;
    if (playerHand[0].rank === "A" && playerHand[1].rank === "A") {
      return "Soft 12";
    }

    let soft = false;
    if (playerHand[0].rank === "A" || playerHand[1].rank === "A") {
      soft = true;
    }
    const total =
      this.cardValue(playerHand[0].rank) + this.cardValue(playerHand[1].rank);
    return total === 21 ? "Blackjack!" : `${soft ? "Soft" : "Hard"} ${total}`;
  };

  render() {
    const { dealerHand, playerHand, gameScore, deck } = this.state;
    const renderHand = hand =>
      hand.length > 0 && (
        <>
          {hand.map(card => (
            <Card down={card.down} suit={card.suit} key={card.id}>
              <CardValue hidden={card.down} rank={card.rank} suit={card.suit}>
                {card.rank}
                {card.suit}
              </CardValue>
            </Card>
          ))}
        </>
      );

    const disableButtons = deck.length === 0;

    return (
      <>
        <GlobalStyle />
        <Wrapper>
          <CircleDec />
          <Title>Blackjack Practice Tool</Title>
          <DealerHand>
            <Name>Dealer</Name>
            {renderHand(dealerHand)}
          </DealerHand>
          <PlayerHand>
            <Name>Your Hand</Name>
            {renderHand(playerHand)}
            <HandScore>
              {playerHand.length > 0 && this.calculateScore()}
            </HandScore>
            <ButtonGroup>
              <Button
                onClick={() => this.guess("hit")}
                disabled={disableButtons}
              >
                Hit
              </Button>
              <Button
                onClick={() => this.guess("stand")}
                disabled={disableButtons}
              >
                Stand
              </Button>
              <Button
                onClick={() => this.guess("double")}
                disabled={disableButtons}
              >
                Double
              </Button>
              <Button
                onClick={() => this.guess("split")}
                disabled={disableButtons}
              >
                Split
              </Button>
              <Button onClick={this.resetDeck}>Reset Deck</Button>
            </ButtonGroup>
          </PlayerHand>
          <ActionBar>
            <GameScore>
              {gameScore.correct}/{gameScore.total}{" "}
              <small>
                {gameScore.total > 0
                  ? Math.ceil((gameScore.correct / gameScore.total) * 100)
                  : 0}
                %
              </small>
            </GameScore>
            <Score>Cards left: {deck.length}</Score>
          </ActionBar>
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
