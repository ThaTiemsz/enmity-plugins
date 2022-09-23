import commonjs from "@rollup/plugin-commonjs"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import { defineConfig, type Plugin } from "rollup"
import esbuild from "rollup-plugin-esbuild"

import { existsSync, readdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const plugins = readdirSync("./Plugins").map(name => {
    const basePath = `./Plugins/${name}/`
    const path = existsSync(basePath + "index.tsx")
        ? basePath + "index.tsx"
        : basePath + "index.ts"
    return [name, path]
})

export default defineConfig({
    input: Object.fromEntries(plugins),
    output: [
        {
            dir: "dist",
            entryFileNames: "[name].js",
            format: "cjs",
            strict: false,
        },
    ],
    plugins: [
        nodeResolve(),
        commonjs(),
        esbuild({ minify: true, target: "ES2019" }),
        createPluginJson(),
    ]
})

function createPluginJson(options = {}): Plugin {
    return {
        name: "plugin-info",
        writeBundle: (err) => {
            for (const [pluginName, path] of plugins) {
                const info = require(join(process.cwd(), path, "..", "package.json"))
                const data = {
                    "name": pluginName,
                    "description": info?.description ?? "No description was provided.",
                    "author": info?.author?.name ?? "Unknown",
                    "version": info?.version ?? "1.0.0"
                }

                writeFileSync(`dist/${pluginName}.json`, JSON.stringify(data, null, "\t"))
            }
        }
    }
}