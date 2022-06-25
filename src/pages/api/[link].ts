import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../db/client";

export default async function redirect(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const shortLink = req.query.link as string;

  const data = await prisma.shortLink.findFirst({
    where: {
      slug: {
        equals: shortLink,
      },
    },
  });

  if (data === null) {
    res.statusCode = 404;

    res.send(JSON.stringify({ message: "slug not found" }));

    return;
  }

  console.log(data.url);

  res.redirect(data.url);
}
