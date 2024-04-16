// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  playlist_id: string;
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { playlist_id, selected_songs, token, playlist_name } = req.body;

 console.log("Payload Received:", req.body)

  // Simulate processing delay
  setTimeout(() => {
    res.status(200).json({ playlist_id: "5Atp90vWJuz6iQWEtoKCQ9" , message:`Successfully created playlist with ID: ${"5Atp90vWJuz6iQWEtoKCQ9"}` });
  }, 5000); // 2 seconds delay, adjust as needed
}
