import { useSearchParams } from "next/navigation"
import Consent from "./consent"

/**
 * This is a server-side component that fetches the consent challenge data for us from Ory.
 **/

export default async function Page({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}) {
  const consent_challenge = searchParams.consent_challenge || ""

  let data: Response

  try {
    data = await fetch(
      `http://localhost:3000/api/consent?consent_challenge=${consent_challenge}`,
      {
        method: "GET",
      },
    )
  } catch (err) {
    throw Error(`Unable to fetch consent challenge data: ${err}`)
  }

  if (data.status !== 200) {
    throw Error(`Unable to fetch consent challenge data: ${data.status}`)
  }

  const { consent, csrf_token } = await data.json()

  return <Consent consent={consent} csrf_token={csrf_token} />
}
