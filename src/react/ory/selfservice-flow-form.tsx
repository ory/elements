import React, { ReactNode } from "react";
import { SelfServiceFlow } from "./FlowTypes";

export interface SelfServiceFlowForm extends React<HTMLFormElement> {
    name: string
    flow: SelfServiceFlow,
    children: ReactNode
    submitOnEnter?: boolean
    className?: string
}

export const SelfServiceFlowForm = ({
    name,
    flow,
    children,
    submitOnEnter,
    className
}: SelfServiceFlowForm) => {
    return (
        <form
            className={className}
            action={flow.ui.action}
            method={flow.ui.method}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !submitOnEnter) {
                    e.stopPropagation()
                    e.preventDefault()
                }
            }}>
            {/*always add csrf token to form*/}

            {children}
        </form>
    )
}