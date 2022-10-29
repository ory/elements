import cn from "classnames"
import React from "react"
import { gridStyle, typographyStyle } from "../theme"

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  header?: string
  className?: string
}

export const Image = ({ header: title, className, ...props }: ImageProps) => {
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
