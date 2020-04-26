import React, { useEffect } from "react";
import classNames from "classnames";

import Card from "../card/Card";

import StyledCardExchanges from "./cardExchanges.style";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCardExchangeOrders,
  selectPusherId,
  startGame,
} from "../../gameSlice";
import { selectPlayersPseudo } from "../../../room/roomSlice";

export default () => {
  const orders = useSelector(selectCardExchangeOrders);
  const playersPseudo = useSelector(selectPlayersPseudo);
  const playerId = useSelector(selectPusherId);

  const giveOrder = orders?.find((order) => order.from === playerId);
  const receiveOrder = orders?.find((order) => order.to === playerId);
  const dispatch = useDispatch();

  useEffect(() => {
    if (orders?.every((order) => order.cards.length === order.number)) {
      const timerId = setTimeout(() => {
        dispatch(startGame());
      }, 3000);
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [orders, dispatch]);

  return (
    <StyledCardExchanges>
      <section className={classNames("orders", "glows")}>
        {orders &&
          orders.map((order) => (
            <div>
              {playersPseudo[order.from]} gives {order.number} {order.type}{" "}
              cards to {playersPseudo[order.to]} :{" "}
              {order.cards.length === order.number ? "✅" : "❌"}
            </div>
          ))}
      </section>
      <section className="exchanges">
        {giveOrder && (
          <div>
            <div className="glows">GIVING :</div>
            <div className="cards">
              {giveOrder.cards.map((cardId, index) => (
                <Card
                  cardIndex={cardId}
                  key={index}
                  selected={false}
                  handleClick={() => {}}
                ></Card>
              ))}
            </div>
          </div>
        )}
        {receiveOrder && (
          <div>
            <div className="glows">RECEIVING :</div>
            <div className="cards">
              {receiveOrder.cards.map((cardId, index) => (
                <Card
                  cardIndex={cardId}
                  key={index}
                  selected={false}
                  handleClick={() => {}}
                ></Card>
              ))}
            </div>
          </div>
        )}
      </section>
    </StyledCardExchanges>
  );
};
