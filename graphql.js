import { buildSchema } from 'graphql';
import { query } from "./dbconnect.js";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';

dayjs.extend(relativeTime);

export const schema = buildSchema(`
  type Query {
    greet: String
    all_food: [Food_Item]
    all_expired: [Food_Item]
    food_item(id: Int!): Food_Item
  }

  type Mutation {
    newFoodItem(
      item_name: String!,
      purchased_date: String!,
      expiration_date: String!,
      food_type: Int,
      userid: Int
      ): mysqlResponse

    editFoodItem(
      id: Int!,
      item_name: String!,
      purchased_date: String!,
      expiration_date: String!
      ): mysqlResponse

    deleteFoodItem(
      id: Int!
      ): mysqlResponse
}

  type Food_Item {
    id: Int
    is_active: Boolean
    userid: Int
	  item_name: String
    quantity: Int
    purchased_date: String
    pretty_purchased_date: String
    expiration_date: String
    pretty_expiration_date: String
    delta: String
    food_type: Int
    created: Int
  }

  type mysqlResponse {
    fieldCount: Int
    afffieldCount: Int
    affectedRows: Int
    insertId: Int
    serverStatus: Int
    warningCount: Int
    message: String
    protocol41: Boolean
    changedRows: Int
}
`);

const prettyDate = (rawDate) => dayjs(rawDate).format("MMM DD, YYYY");
const kabobDate = (rawDate) => dayjs(rawDate).format("YYYY-MM-DD");

export const root = {
  greet: () => {
    return "Satan"
  },
  all_food: async () => {
    const r = await query("select * from food_items where is_active = 1 and expiration_date > now() order by expiration_date asc");
    for (let i = 0; i < r.length; i++) {
      r[i].pretty_purchased_date = prettyDate(r[i].purchased_date);
      r[i].pretty_expiration_date = prettyDate(r[i].expiration_date);
      const catchDelta = dayjs(new Date()).to(r[i].expiration_date, true);
      console.log(dayjs(new Date()).to(r[i].expiration_date, true) + " - " + r[i].item_name);
      r[i].delta = catchDelta.substring(0, 1) === "a" ? "1 " + catchDelta.split("a ")[1] : catchDelta;
    }
    return r;
  },
  all_expired: async () => {
    const r = await query("select * from food_items where is_active = 1 and expiration_date < now() order by expiration_date asc");
    for (let i = 0; i < r.length; i++) {
      r[i].pretty_expiration_date = prettyDate(r[i].expiration_date);
      r[i].delta = dayjs(new Date()).to(r[i].expiration_date, true) + " ago";
    }
    return r;
  },
  food_item: async (args) => {
    const r = await query("select * from food_items where id = ?", [args.id]);
    r[0].pretty_purchased_date = prettyDate(r[0].purchased_date);
    r[0].pretty_expiration_date = prettyDate(r[0].expiration_date);
    r[0].purchased_date = kabobDate(r[0].purchased_date);
    r[0].expiration_date = kabobDate(r[0].expiration_date);
    r[0].delta = dayjs(new Date()).to(r[0].expiration_date, true);
    return r[0];
  },
  // Mutations --
  newFoodItem: async (args) => {
    const r = await query("insert into food_items set ?", [args]);
    return r;
  },
  editFoodItem: async (args) => {
    const r = await query("update food_items set ? where id = ?", [args, args.id]);
    return r;
  },
  deleteFoodItem: async (args) => {
    const r = await query("update food_items set is_active = 0 where id = ?", [args.id]);
    return r;
  }
};

export default {
  schema,
  root
}