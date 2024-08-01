import { getJestProjects } from "@nx/jest"

export default {
  projects: [...getJestProjects(), "<rootDir>/jest.config.ts"],
}
