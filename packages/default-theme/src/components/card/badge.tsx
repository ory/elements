import Image from "next/image"
import OryLogoHorizontal from "../../assets/ory-badge-horizontal.svg"
import OryLogoVertical from "../../assets/ory-badge-vertical.svg"

// TODO: de-nextify
export function Badge() {
  return (
    <div className="font-bold bg-branding-bg-default absolute max-md:rounded-b-md p-2 max-md:bottom-0 max-md:translate-y-full max-md:left-8  md:right-0 md:translate-x-full md:top-8 md:rounded-r-md">
      <Image src={OryLogoHorizontal} alt="" className="md:hidden" />
      <Image src={OryLogoVertical} alt="" className="max-md:hidden" />
    </div>
  )
}
