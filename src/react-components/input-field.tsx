// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import cn from "classnames"
import { JSX, useRef, useState } from "react"

import {
  gridStyle,
  inputFieldStyle,
  inputFieldTitleStyle,
  inputFieldVisibilityToggleLabelStyle,
  typographyStyle,
} from "../theme"
import { Message, MessageStyleProps } from "./message"
import { useIdWithFallback } from "../common/useIdWithFallback"

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    MessageStyleProps {
  header: string
  helperMessage?: React.ReactNode | string
  messageTestId?: string
  dataTestid?: string
  className?: string
}

export const InputField = ({
  header: title,
  helperMessage,
  messageTestId,
  className,
  dataTestid,
  id,
  ...props
}: InputFieldProps): JSX.Element => {
  const inputId = id ?? useIdWithFallback()

  const [visibility, setVisibility] = useState(false)
  const visibilityToggleRef = useRef<HTMLDivElement>(null)

  return (
    <div
      data-testid={dataTestid}
      className={cn(className, gridStyle({ gap: 4 }))}
    >
      {title && props.type !== "hidden" && (
        <label
          htmlFor={inputId}
          className={typographyStyle({ size: "small", type: "regular" })}
        >
          {title}{" "}
          {props.required && <span className={inputFieldTitleStyle}>*</span>}
        </label>
      )}

      {props.type === "password" ? (
        <div style={{ position: "relative" }}>
          <input
            className={cn(
              inputFieldStyle,
              typographyStyle({ size: "small", type: "regular" }),
            )}
            placeholder={" "} // we need this so the input css field border is not green by default
            id={inputId}
            {...props}
            type={visibility ? "text" : "password"}
          />
          <div
            ref={visibilityToggleRef}
            onClick={(e) => {
              setVisibility(!visibility)
              e.currentTarget.dataset.checked =
                e.currentTarget.dataset.checked === "true" ? "false" : "true"
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setVisibility(!visibility)
                e.currentTarget.dataset.checked =
                  e.currentTarget.dataset.checked === "true" ? "false" : "true"
              }
            }}
            data-checked="false"
            className={inputFieldVisibilityToggleLabelStyle}
            tabIndex={0}
            aria-label="Toggle password visibility"
          >
            <svg
              width="22"
              height="20"
              viewBox="0 0 22 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11 0C15.2909 0 18.8627 2.4287 21.6646 7.15399L21.8844 7.53293L21.9302 7.63283L21.9591 7.71602L21.9736 7.77062L21.988 7.853L21.999 7.95346L21.9982 8.0639L21.9849 8.17441C21.9784 8.21115 21.9698 8.24773 21.9591 8.28398L21.9203 8.39157L21.8844 8.46707L21.8682 8.49616C19.1039 13.3334 15.5685 15.8773 11.3127 15.9957L11 16C6.6044 16 2.96348 13.4514 0.131768 8.49616C-0.0439228 8.18872 -0.0439228 7.81128 0.131768 7.50384C2.96348 2.54862 6.6044 0 11 0ZM11 2C7.59033 2 4.69918 3.89478 2.27859 7.80591L2.161 8L2.27859 8.19409C4.63002 11.9935 7.42551 13.8901 10.709 13.9954L11 14C14.4097 14 17.3008 12.1052 19.7214 8.19409L19.838 8L19.7214 7.80591C17.37 4.00652 14.5745 2.10992 11.291 2.00464L11 2ZM11 5C9.34315 5 8 6.34315 8 8C8 9.65685 9.34315 11 11 11C12.6569 11 14 9.65685 14 8C14 6.34315 12.6569 5 11 5ZM11 7C11.5523 7 12 7.44772 12 8C12 8.55228 11.5523 9 11 9C10.4477 9 10 8.55228 10 8C10 7.44772 10.4477 7 11 7Z"
                fill="#0F172A"
              />
            </svg>
            <svg
              width="22"
              height="20"
              viewBox="0 0 22 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.29289 0.292893C1.65338 -0.0675907 2.22061 -0.0953203 2.6129 0.209705L2.70711 0.292893L16.9832 14.569C17.0385 14.6134 17.0897 14.6643 17.1356 14.7214L20.7071 18.2929C21.0976 18.6834 21.0976 19.3166 20.7071 19.7071C20.3466 20.0676 19.7794 20.0953 19.3871 19.7903L19.2929 19.7071L16.206 16.6203C14.6021 17.5382 12.8623 18 11 18C6.6044 18 2.96348 15.4514 0.131768 10.4962C-0.0439426 10.1887 -0.0439215 9.8112 0.131824 9.50374C1.32272 7.42032 2.65271 5.76402 4.12709 4.5413L1.29289 1.70711C0.902369 1.31658 0.902369 0.683418 1.29289 0.292893ZM5.54861 5.96282C4.40937 6.87487 3.34586 8.11002 2.3617 9.67319L2.161 10L2.27859 10.1941C4.63002 13.9935 7.42551 15.8901 10.709 15.9954L11 16C12.326 16 13.5644 15.7155 14.7281 15.1423L12.2945 12.7087C11.1784 13.2434 9.80013 13.048 8.87564 12.1229C7.95169 11.1982 7.75698 9.82091 8.29127 8.70548L5.54861 5.96282ZM10.2356 10.6498L10.3502 10.7644C10.3297 10.7469 10.3097 10.7285 10.2904 10.7091C10.2712 10.6899 10.2529 10.6701 10.2356 10.6498ZM11 1.99994C15.3956 1.99994 19.0365 4.54859 21.8682 9.50384C22.0439 9.81133 22.0439 10.1888 21.8682 10.4963C21.0533 11.9217 20.1753 13.1455 19.2314 14.1668C18.8565 14.5723 18.2238 14.5972 17.8182 14.2224C17.4127 13.8475 17.3878 13.2148 17.7626 12.8092C18.413 12.1056 19.0355 11.283 19.6296 10.3407L19.839 10L19.7214 9.8059C17.37 6.00649 14.5743 4.10986 11.2878 4.00458L10.9965 3.99993C10.1988 3.99716 9.40484 4.10708 8.63803 4.32643C8.10705 4.47833 7.55346 4.17102 7.40157 3.64003C7.24967 3.10905 7.55698 2.55546 8.08797 2.40357C9.0359 2.1324 10.0174 1.99652 11 1.99994Z"
                fill="#0F172A"
              />
            </svg>
          </div>
        </div>
      ) : (
        <input
          className={cn(
            inputFieldStyle,
            typographyStyle({ size: "small", type: "regular" }),
          )}
          placeholder={" "} // we need this so the input css field border is not green by default
          id={inputId}
          {...props}
        />
      )}

      {typeof helperMessage === "string" ? (
        <Message data-testid={messageTestId} severity={props.severity}>
          {helperMessage}
        </Message>
      ) : (
        helperMessage
      )}
    </div>
  )
}
