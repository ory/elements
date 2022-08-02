import { UiNode, UiNodeInputAttributes } from "@ory/client";
import { getNodeLabel, isUiNodeAnchorAttributes, isUiNodeImageAttributes } from "@ory/integrations/ui";
import e from "express";
import { Button } from "../button";
import { ButtonSocial } from "../button-social";


export const Node = (node: UiNode) => {
    if (isUiNodeAnchorAttributes(node.attributes)) {
        return (
            <></>
        )
    } else if (isUiNodeImageAttributes(node.attributes)) {
        switch (node.attributes.node_type) {
            case 'hidden':
                return (
                    <></>
                )
            case 'submit':
                const attrs = node.attributes as UiNodeInputAttributes
                const isSocial = (attrs.name === 'provider' || attrs.name === 'link') && node.group === 'oidc'
                return isSocial ? (
                    <ButtonSocial title={getNodeLabel(node)}></ButtonSocial>
                ) : (
                    <Button title={getNodeLabel(node)} name={attrs.name} onclick={attrs.onclick} type={attrs.node_type}></Button>
                )
        }
    }
}