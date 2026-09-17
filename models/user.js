import database from "infra/database";

async function create({ username, email, password }) {

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

const user = {
  create
};

export default user;

