import React from 'react';
import { useEffect, useState } from 'react';

import { gql } from "./utils/gql";
import { verifyUser } from "./utils/verifyUser";

function Expired(props) {
    const [openGate, setOpenGate] = useState(true);
    const [allExpired, setAllExpired] = useState([]);

    const getData = async () => {
        setOpenGate(false);

        const allExpired = await gql(`{
            all_expired {
                id
	            item_name
                pretty_expiration_date
                delta {
                    time
                }
            }
        }`);

        setAllExpired(allExpired.all_expired);
    }

    const handleDeleteFood = async (e) => {
        const loggedIn = await verifyUser();
        if (loggedIn) {
            const id = Number(e.target.id);

            try {
                const r = await gql(`mutation{
                    deleteFoodItem(
                    id: ${id}
                    ){ changedRows }}`);
                if (r.deleteFoodItem.changedRows === 1) getData();
            } catch (e) {
                console.error(e);
            }
        }
    }

    useEffect(() => {
        if (openGate) getData();
    });

    if (allExpired.length > 0) {
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th className="date-col">Date Expired</th>
                            <th className="time-col">Expired</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allExpired.map(food => (
                            <tr key={"food-" + food.id} id={"food-" + food.id} >
                                <td key={"item-name-" + food.id} id={"item-name-" + food.id} className="item-col"><a href={`/edit/${food.id}`}>{food.item_name} {food.quantity > 1 && " x" + food.quantity}</a><button id={food.id} onClick={handleDeleteFood}>X</button></td>
                                <td key={"expiration-date-" + food.id} id={"expiration-date-" + food.id} className="date-col">{food.pretty_expiration_date}</td>
                                <td key={"delta-" + food.id} id={"delta-" + food.id} className="red time-col">{food.delta.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    } else {
        return (<></>);
    }
}

export default Expired;