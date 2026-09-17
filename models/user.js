import database from "infra/database";
import { validate } from "node_modules/uuid/dist/cjs";

async function create({ username, email, password }) {
  await validateUniqueEmail(email);


  const newUser = await runInsertQuery({ username, email, password })
  return newUser;
}


async function runInsertQuery({ username, email, password }) {
  const newUser = await database.query({
    text: `
      INSERT INTO 
          users (username, email, password) 
      values
          ($1, $2, $3)
      RETURNING *
    ;`,
    values: [username, email, password]
  })

  return newUser.rows[0]
}


async function validateUniqueEmail(email) {
  const validateUniqueEmail = await database.query({
    text: `
      SELECT
        email
      FROM
        users
      WHERE
        LOWER(email) = LOWER($1)
    ;`,
    values: [email]
  })

  if (validateUniqueEmail.rowsCount > 0)

    return validateUniqueEmail.rows[0]

}

const user = {
  create
};

export default user;

