import React, { useEffect, useRef } from "react";
import classNames from "classnames";

import Card from "../card/Card";

import StyledCardExchanges from "./cardExchanges.style";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCardExchangeOrders,
  selectPusherId,
  startGame,
} from "../../gameSlice";
import { selectPlayersPseudo, selectIsHost } from "../../../room/roomSlice";

export default () => {
  const orders = useSelector(selectCardExchangeOrders);
  const playersPseudo = useSelector(selectPlayersPseudo);
  const playerId = useSelector(selectPusherId);

  const giveOrder = orders?.find((order) => order.from === playerId);
  const receiveOrder = orders?.find((order) => order.to === playerId);

  const isHost = useSelector(selectIsHost);
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
  }, [orders]);

  return (
    <StyledCardExchanges>
      <section>
        <ul>
          {orders &&
            orders.map((order) => (
              <li>
                {playersPseudo[order.from]} gives {order.number} {order.type}{" "}
                cards to {playersPseudo[order.to]} :{" "}
                {order.cards.length === order.number ? "✅" : "❌"}
              </li>
            ))}
        </ul>
      </section>
      <section>
        {giveOrder && (
          <div>
            GIVING :{" "}
            {giveOrder.cards.map((cardId, index) => (
              <Card
                cardIndex={cardId}
                key={index}
                selected={false}
                handleClick={() => {}}
              ></Card>
            ))}
          </div>
        )}
        {receiveOrder && (
          <div>
            RECEIVING :{" "}
            {receiveOrder.cards.map((cardId, index) => (
              <Card
                cardIndex={cardId}
                key={index}
                selected={false}
                handleClick={() => {}}
              ></Card>
            ))}
          </div>
        )}
      </section>
    </StyledCardExchanges>
  );
};
