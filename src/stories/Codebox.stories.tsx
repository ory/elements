import { ComponentMeta, Story } from "@storybook/react"
import { CodeBox, CodeBoxProps } from "../react-components/codebox"
import { Container } from "./storyhelper"

export default {
  title: "Component/CodeBox",
  component: CodeBox,
} as ComponentMeta<typeof CodeBox>

const Template: Story<CodeBoxProps> = (args: CodeBoxProps) => (
  <Container>
    <CodeBox {...args}>{args.children}</CodeBox>
  </Container>
)

export const NormalCodeBox = Template.bind({})

NormalCodeBox.args = {
  children: `{
    "active": true,
    "authenticated_at": "2019-08-24T14:15:22Z",
    "authentication_methods": [
      {
        "aal": "aal0",
        "completed_at": "2019-08-24T14:15:22Z",
        "method": "link_recovery"
      }
    ],
    "authenticator_assurance_level": "aal0",
    "expires_at": "2019-08-24T14:15:22Z",
    "id": "string",
    "identity": {
      "created_at": "2019-08-24T14:15:22Z",
      "credentials": {
        "property1": {
          "config": {},
          "created_at": "2019-08-24T14:15:22Z",
          "identifiers": [
            "string"
          ],
          "type": "password",
          "updated_at": "2019-08-24T14:15:22Z",
          "version": 0
        },
        "property2": {
          "config": {},
          "created_at": "2019-08-24T14:15:22Z",
          "identifiers": [
            "string"
          ],
          "type": "password",
          "updated_at": "2019-08-24T14:15:22Z",
          "version": 0
        }
      },
      "id": "string",
      "metadata_admin": null,
      "metadata_public": null,
      "recovery_addresses": [
        {
          "created_at": "2019-08-24T14:15:22Z",
          "id": "string",
          "updated_at": "2019-08-24T14:15:22Z",
          "value": "string",
          "via": "string"
        }
      ],
      "schema_id": "string",
      "schema_url": "string",
      "state": "active",
      "state_changed_at": "2019-08-24T14:15:22Z",
      "traits": null,
      "updated_at": "2019-08-24T14:15:22Z",
      "verifiable_addresses": [
        {
          "created_at": "2014-01-01T23:28:56.782Z",
          "id": "string",
          "status": "string",
          "updated_at": "2014-01-01T23:28:56.782Z",
          "value": "string",
          "verified": true,
          "verified_at": "2019-08-24T14:15:22Z",
          "via": "string"
        }
      ]
    },
    "issued_at": "2019-08-24T14:15:22Z"
  }`,
}
