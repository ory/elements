import { spawn } from "child_process"

const globalTeardown = async () => {
  // Currently you can kill ports running on TCP or UDP protocols
  const process = spawn("kill-port", ["3200"], {
    cwd: __dirname,
    shell: true,
  })

  process.stdout?.on("data", (data) => {
    console.log(`stdout: ${data}`)
  })

  process.stderr?.on("data", (data) => {
    console.log(`stderr: ${data}`)
  })

  process.on("error", (err) => {
    console.error(`kill-port encountered an error ${err}`)
  })

  process.on("close", (code) => {
    console.log(`child process exited with code ${code}`)
  })
}

export default globalTeardown
