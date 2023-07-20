import { oryIdentity, oryOAuth } from "@/pkg/sdk"
import type { NextApiRequest, NextApiResponse } from "next"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { searchParams } = new URL(req.url || "")

  const consent_challenge = searchParams.get("consent_challenge") || ""

  if (!consent_challenge) {
    return new NextResponse(
      "The consent_challenge is missing from the request",
      {
        status: 400,
      },
    ).json()
  }

  return oryOAuth
    .getOAuth2ConsentRequest({
      consentChallenge: consent_challenge.toString(),
    })
    .then(async ({ data }) => {
      if (data.skip || data.client?.skip_consent) {
        let grantScope: string[] = data.requested_scope || []
        if (!Array.isArray(grantScope)) {
          grantScope = [grantScope]
        }

        const id_token: { [key: string]: any } = {}

        if (data.subject && grantScope.length > 0) {
          const identity = (await oryIdentity.getIdentity({ id: data.subject }))
            .data

          if (grantScope.indexOf("email") > -1) {
            // Client may check email of user
            id_token.email = identity.traits["email"] || ""
          }
          if (grantScope.indexOf("phone") > -1) {
            // Client may check phone number of user
            id_token.phone = identity.traits["phone"] || ""
          }
        }

        const session = {
          access_token: {
            // foo: 'bar'
          },

          // This data will be available in the ID token.
          id_token,
        }
        // Now it's time to grant the consent request. You could also deny the request if something went terribly wrong
        return oryOAuth
          .acceptOAuth2ConsentRequest({
            consentChallenge: consent_challenge.toString(),
            acceptOAuth2ConsentRequest: {
              // We can grant all scopes that have been requested - hydra already checked for us that no additional scopes
              // are requested accidentally.
              grant_scope: grantScope,

              // ORY Hydra checks if requested audiences are allowed by the client, so we can simply echo this.
              grant_access_token_audience: data.requested_access_token_audience,

              // The session allows us to set session data for id and access tokens
              session,
            },
          })
          .then(({ data: body }) => {
            // All we need to do now is to redirect the user back to hydra!
            return redirect(String(body.redirect_to))
          })
          .catch((err) => {
            console.error(err)
            return new NextResponse(err.response.data, {
              status: 500,
            }).json()
          })
      } else {
        return NextResponse.json({
          consent: data,
          // WARNING!! ===> Don't use this in production <===
          csrf_token: Math.random().toString(36).slice(2),
        })
      }
    })
    .catch((err) => {
      console.error(err)
      return new NextResponse(err.response.data, {
        status: 500,
      }).json()
    })
}

export async function POST(req: Request, res: NextApiResponse) {
  // The challenge is a hidden input field, so we have to retrieve it from the request body
  const body = await req.json()
  const challenge = body.consent_challenge

  // Let's see if the user decided to accept or reject the consent request..
  if (body.consent_action === "reject") {
    try {
      const resp = await oryOAuth.rejectOAuth2ConsentRequest({
        consentChallenge: challenge,
        rejectOAuth2Request: {
          error: "access_denied",
          error_description: "The resource owner denied the request",
        },
      })

      return redirect(String(resp.data.redirect_to))
    } catch (err) {
      console.error(err)
      return new NextResponse(
        `Something went wrong when rejecting the consent request ${err}`,
        {
          status: 500,
        },
      )
    }
  }

  let grantScope = body.grant_scope
  if (!Array.isArray(grantScope)) {
    grantScope = [grantScope]
  }

  try {
    let id_token: { [key: string]: any } = {}

    const consentResp = await oryOAuth
      .getOAuth2ConsentRequest({ consentChallenge: challenge })
      // This will be called if the HTTP request was successful
      .then(async ({ data }) => {
        const id_token: { [key: string]: any } = {}

        if (data.subject && grantScope.length > 0) {
          const identity = (await oryIdentity.getIdentity({ id: data.subject }))
            .data

          if (grantScope.indexOf("email") > -1) {
            // Client may check email of user
            id_token.email = identity.traits["email"] || ""
          }
          if (grantScope.indexOf("phone") > -1) {
            // Client may check phone number of user
            id_token.phone = identity.traits["phone"] || ""
          }
        }
        return data
      })

    const acceptResp = await oryOAuth.acceptOAuth2ConsentRequest({
      consentChallenge: challenge,
      acceptOAuth2ConsentRequest: {
        // We can grant all scopes that have been requested - hydra already checked for us that no additional scopes
        // are requested accidentally.
        grant_scope: grantScope,

        session: {
          id_token,
          access_token: {},
        },

        // ORY Hydra checks if requested audiences are allowed by the client, so we can simply echo this.
        grant_access_token_audience:
          consentResp.requested_access_token_audience,

        // This tells hydra to remember this consent request and allow the same client to request the same
        // scopes from the same user, without showing the UI, in the future.
        remember: Boolean(body.remember),

        // When this "remember" sesion expires, in seconds. Set this to 0 so it will never expire.
        remember_for: process.env.REMEMBER_CONSENT_FOR_SECONDS
          ? Number(process.env.REMEMBER_CONSENT_SESSION_FOR_SECONDS)
          : 3600,
      },
    })
    return NextResponse.redirect(acceptResp.data.redirect_to)
  } catch (err) {
    console.error(err)
    return new NextResponse(
      `Something went wrong when accepting the consent request ${err}`,
      {
        status: 500,
      },
    )
  }
}
