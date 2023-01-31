import { withNextCorsSessionRoute } from "../../../../withSession";

// $curl http://localhost:3000/api/v1/user/logout
export default withNextCorsSessionRoute(async (req, res) => {
  // req.session.user = undefined;
  req.session.destroy();

  await req.session.save();
  res.status(200).send("");
});
