import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

type tokenProps = { 
  user_id: string;
  username: string;
  email: string;
}

function token({ user_id, username, email }: tokenProps) {
  const user: tokenProps = { user_id, username, email };
  return jwt.sign(user, process.env.ACCESS_TOKEN, {
    expiresIn: "20h",
  });
}

export { token };