import { UiNode } from "@ory/client-fetch"
import { useComponents } from "../../context"
import { useIntl } from "react-intl"

const getLinkButtons = (nodes: UiNode[]): UiNode[] =>
  nodes.filter(
    (node) => "name" in node.attributes && node.attributes.name === "link",
  )

const getUnlinkButtons = (nodes: UiNode[]): UiNode[] =>
  nodes.filter(
    (node) => "name" in node.attributes && node.attributes.name === "unlink",
  )

export interface HeadlessSettingsOidcProps {
  nodes: UiNode[]
}

export function OrySettingsOidc({ nodes }: HeadlessSettingsOidcProps) {
  const { Settings } = useComponents()
  const intl = useIntl()

  const linkButtons = getLinkButtons(nodes)
  const unlinkButtons = getUnlinkButtons(nodes)

  return (
    <>
      <Settings.SectionContent
        title={intl.formatMessage({ id: "settings.oidc.title" })}
        description={intl.formatMessage({ id: "settings.oidc.description" })}
      >
        <Settings.Oidc
          linkButtons={linkButtons}
          unlinkButtons={unlinkButtons}
        />
      </Settings.SectionContent>
      <Settings.SectionFooter>
        <span>{intl.formatMessage({ id: "settings.oidc.info" })}</span>
      </Settings.SectionFooter>
    </>
  )
}
