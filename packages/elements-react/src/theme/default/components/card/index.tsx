import { OryCardProps } from "../../../../components"
import { Badge } from "./badge"
import { DefaultCardContent } from "./content"
import { DefaultCardFooter } from "./footer"
import { DefaultCardHeader } from "./header"
import { DefaultCardLogo } from "./logo"

export function DefaultCard({ children }: OryCardProps) {
  return (
    <div className="grid grid-cols-1 max-w-sm md:max-w-[480px] md:w-[480px] gap-8 bg-dialog-bg-default px-8 md:px-12 py-12 md:py-14 relative rounded-border-radius-cards border border-dialog-border-default">
      {children}
      <Badge />
    </div>
  )
}

export {
  DefaultCardContent,
  DefaultCardFooter,
  DefaultCardHeader,
  DefaultCardLogo,
}
