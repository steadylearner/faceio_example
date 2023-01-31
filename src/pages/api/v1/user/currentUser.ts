// import { getUsers } from "../../../lib/db";
import { withNextCorsSessionRoute } from "../../../../withSession";

// $curl http://localhost:3000/api/v1/user/currentUser
export default withNextCorsSessionRoute(async (req, res) => {
  const { user } = req.session;

  // console.log("$curl http://localhost:3000/api/v1/user/currentUser");
  // console.log("user");
  // console.log(user);

  if (user) {
    const { 
      // id, 
      ...currentUser
    } = user;

    res.status(200).json(currentUser);
  } else {
    res.status(401).send("");
  }
});
