import { buildSchema } from 'graphql';
import { query } from "./dbconnect.js";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

export const schema = buildSchema(`
  type Query {
    greet: String
    all_food(alpha: Boolean): [Food_Item]
    all_expired: [Food_Item]
    food_item(id: Int!): Food_Item
    spice_rack: [Spice]
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

    newSpice(
      spice_name: String
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
    delta: Delta_Object
    food_type: Int
    created: Int
  }

  type Delta_Object {
    time: String
    warning: Boolean
  }

  type Spice {
    id: Int
    is_active: Boolean
    spice_name: String
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
  all_food: async (args) => {
    const r = await query(`select * from food_items where is_active = 1 and expiration_date > now() order by ${args.alpha ? "item_name" : "expiration_date"} asc`);
    const warningDays = 3;
    const warningTime = warningDays * 8.64e+7; // Gives warningDays in milliseconds --

    for (let i = 0; i < r.length; i++) {
      r[i].pretty_purchased_date = prettyDate(r[i].purchased_date);
      r[i].pretty_expiration_date = prettyDate(r[i].expiration_date);
      const delta = dayjs(new Date()).to(r[i].expiration_date, true);

      const expiration = dayjs(r[i].expiration_date);
      const nowPlusWarningTime = dayjs(new Date() + warningTime);
      const warning = expiration.diff(nowPlusWarningTime);

      r[i].delta = {
        time: delta,
        warning: warning < warningTime
      }
    }
    return r;
  },
  all_expired: async () => {
    const r = await query("select * from food_items where is_active = 1 and expiration_date < now() order by expiration_date asc");
    for (let i = 0; i < r.length; i++) {
      r[i].pretty_expiration_date = prettyDate(r[i].expiration_date);
      r[i].delta = {
        time: dayjs(new Date()).to(r[i].expiration_date, true) + " ago"
      }
    }
    return r;
  },
  spice_rack: async () => {
    const r = await query("select * from spice_rack where is_active = 1 order by spice_name asc");
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
  },
  newSpice: async (args) => {
    const r = await query("insert into spice_rack set ?", [args]);
    return r;
  }
};

export default {
  schema,
  root
}