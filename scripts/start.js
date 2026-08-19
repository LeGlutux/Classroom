const { spawn } = require('child_process')
const path = require('path')

const major = parseInt(process.versions.node, 10)
if (major >= 17) {
    const extra = '--openssl-legacy-provider'
    const current = process.env.NODE_OPTIONS || ''
    if (!current.includes(extra)) {
        process.env.NODE_OPTIONS = `${current} ${extra}`.trim()
    }
}

const root = path.join(__dirname, '..')
const tailwind = path.join(root, 'node_modules', 'tailwindcss', 'lib', 'cli.js')
const reactScripts = path.join(
    root,
    'node_modules',
    'react-scripts',
    'bin',
    'react-scripts.js'
)

function run(script, args) {
    return new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [script, ...args], {
            stdio: 'inherit',
            env: process.env,
            cwd: root,
        })
        child.on('exit', (code) => {
            if (code === 0) resolve()
            else reject(code || 1)
        })
    })
}

const command = process.argv[2] === 'build' ? 'build' : 'start'

run(tailwind, ['build', 'src/index.css', '-o', 'src/tailwind.css'])
    .then(() => run(reactScripts, [command]))
    .catch((code) => {
        process.exit(typeof code === 'number' ? code : 1)
    })
