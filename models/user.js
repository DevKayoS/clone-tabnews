import database from "infra/database";
import { NotFoundError, ValidationError } from "infra/errors";
import password from "./password";

async function create({ username, email, password }) {
  await validateUniqueEmail(email);
  await validateUniqueUsername(username);
  password = await hashPasswordInObject(password);

  const newUser = await runInsertQuery({ username, email, password });
  return newUser;

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
}

async function validateUniqueEmail(email) {
  const validateUniqueEmail = await database.query({
    text: `SELECT email FROM users WHERE LOWER(email) = LOWER($1);`,
    values: [email],
  });

  if (validateUniqueEmail.rows.length > 0) {
    throw new ValidationError({
      message: "O email informado ja esta sendo utilizado",
      action: "Utilize outro email para realizar esta operacao",
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
      action: "Utilize outro username para realizar esta operacao",
    });
  }
}

async function hashPasswordInObject(userPassword) {
  const hashedPassword = await password.hash(userPassword);
  return hashedPassword;
}

async function findOneByUsename(username) {
  const user = runSelectQuey(username);

  return user;

  async function runSelectQuey(username) {
    const user = await database.query({
      text: `SELECT * FROM users WHERE LOWER(username) = LOWER($1);`,
      values: [username],
    });

    if (user.rows == 0) {
      throw new NotFoundError({
        message: "O username informado nao foi encontrado no sistema.",
        action: "Verifique se o username esta digitado corretamente",
      });
    }
    return user.rows[0];
  }
}

async function update(username, userInputValues) {
  console.log({
    username,
    userInputValues,
  });
  const currentUser = await findOneByUsename(username);

  if ("username" in userInputValues) {
    await validateUniqueUsername(userInputValues.username);
  }

  if ("email" in userInputValues) {
    await validateUniqueEmail(userInputValues.email);
  }

  if ("password" in userInputValues) {
    const password = await hashPasswordInObject(userInputValues.password);
    userInputValues.password = password;
  }

  const userWithNewValues = { ...currentUser, ...userInputValues };
  const userUpdated = await runUpdateQuery(userWithNewValues);

  return userUpdated;

  async function runUpdateQuery(user) {
    const results = await database.query({
      text: `
        UPDATE 
          users 
        SET 
          username = LOWER($2),
          email = LOWER($3),
          password = $4,
          updated_at = timezone('utc', now())
        WHERE id = $1
        RETURNING *
      `,
      values: [user.id, user.username, user.email, user.password],
    });

    return results.rows[0];
  }
}

const user = {
  create,
  findOneByUsename,
  update,
};

export default user;
