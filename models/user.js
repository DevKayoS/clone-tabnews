import database from "infra/database";
import { ValidationError } from "infra/errors";

async function create({ username, email, password }) {
  await validateUniqueEmail(email);
  await validateUniqueUsername(username);

  const newUser = await runInsertQuery({ username, email, password });
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
    values: [username, email, password],
  });

  return newUser.rows[0];
}

async function validateUniqueEmail(email) {
  const validateUniqueEmail = await database.query({
    text: `SELECT email FROM users WHERE LOWER(email) = LOWER($1);`,
    values: [email],
  });

  if (validateUniqueEmail.rows.length > 0) {
    throw new ValidationError({
      message: "O email informado ja esta sendo utilizado",
      action: "Utilize outro email para realizar o cadastro",
    });
  }
}

async function validateUniqueUsername(username) {
  const validateUniqueUsername = await database.query({
    text: `SELECT username FROM users WHERE LOWER(username) = LOWER($1);`,
    values: [username],
  });

  if (validateUniqueUsername.rows.length > 0) {
    throw new ValidationError({
      message: "O username informado ja esta sendo utilizado",
      action: "Utilize outro username para realizar o cadastro",
    });
  }
}

const user = {
  create,
};

export default user;
