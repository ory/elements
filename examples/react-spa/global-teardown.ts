import { exec } from "child_process"

const globalTeardown = async () => {
  return exec("kill $(lsof -t -i:4000) && kill $(lsof -t -i:3000)")
}

export default globalTeardown
