import OryLogoHorizontal from "../../assets/ory-badge-horizontal.svg"
import OryLogoVertical from "../../assets/ory-badge-vertical.svg"

export function Badge() {
  return (
    <div className="font-bold bg-branding-bg-default absolute max-md:rounded-b-md p-2 max-md:bottom-0 max-md:translate-y-full max-md:left-8  md:right-0 md:translate-x-full md:top-8 md:rounded-r-md">
      <OryLogoHorizontal className="md:hidden" />
      <OryLogoVertical className="max-md:hidden" />
    </div>
  )
}
