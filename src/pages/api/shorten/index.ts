import { nanoid } from "nanoid";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../db/client";
import { z } from "zod";

const Link = z.object({
  url: z.string(),
  expirationTime: z.number(),
});

type Link = z.infer<typeof Link>;

export default async function shorten(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body as Link;

  if (!Link.safeParse(body).success) {
    res.status(400).send(JSON.stringify({ error: "invalid url or time type" }));
  }

  if (body.url == null) {
    res.status(404).send(JSON.stringify({ message: "url is required" }));
  }

  const shortUrl = await prisma.shortLink.create({
    data: {
      url: body.url,
      expiresAt: new Date(Date.now() + body.expirationTime).toISOString(),
      slug: nanoid(7),
    },
  });

  return res.status(200).json(shortUrl);
}
