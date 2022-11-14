import { Theme } from "../../theme"

declare module "express" {
  export interface Request {
    theme?: Theme
  }
}
