import React from "react"
import { gridStyle, typographyStyle } from "../theme"
import cn from "classnames"

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  title?: string
  className?: string
}

export const Image = ({ title, className, ...props }: ImageProps) => {
  return (
    <div className={cn(className, gridStyle({ gap: 4 }))}>
      {title && (
        <div className={typographyStyle({ size: "small", type: "regular" })}>
          {title}
        </div>
      )}
      <img {...props} />
    </div>
  )
}
