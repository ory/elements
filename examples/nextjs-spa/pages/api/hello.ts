// Copyright © 2022 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  res.status(200).json({ name: "John Doe" })
}
