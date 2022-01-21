import React from 'react';
import { useEffect, useState } from 'react';

import { gql } from "./utils/gql";

import "./styles/styles.css";

function App() {
  const [openGate, setOpenGate] = useState(true);
  const [allFood, setAllFood] = useState([]);

  const getGreeting = async () => {
    setOpenGate(false);

    const r = await gql(`{
      all_food {
        id
        is_active
        userid
	      item_name
        quantity
        purchased_date
        pretty_purchased_date
        expiration_date
        pretty_expiration_date
        delta
        food_type
        created
      }
    }
    `);

    setAllFood(r.all_food);
  }

  useEffect(() => {
    if (openGate) getGreeting();
  });

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date Purchased</th>
            <th>Date Expires</th>
            <th>Days Remaining</th>
          </tr>
        </thead>
        <tbody>
          {allFood.map(food => (
            <tr>
              <td key={"item-name-" + food.id} id={"item-name-" + food.id}>{food.item_name}</td>
              <td key={"purchased-date-" + food.id} id={"purchased-date-" + food.id}>{food.pretty_purchased_date}</td>
              <td key={"expiration-date-" + food.id} id={"expiration-date-" + food.id}>{food.pretty_expiration_date}</td>
              <td key={"delta-" + food.id} id={"delta-" + food.id}>{food.delta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;