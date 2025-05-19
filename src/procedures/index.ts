import fs from "fs"
import path from "path"
import Procedure from "./procedure"

export interface IProcedure {
    path: string
    Procedure: typeof Procedure
}

export default function getProcedures(): any[] {
    const procedures: IProcedure[] = []
    const baseDir = __dirname

    fs.readdirSync(baseDir).forEach(function (file) {
        const dirPath = path.join(baseDir, file)
        if (fs.statSync(dirPath).isDirectory()) {
            fs.readdirSync(dirPath).forEach(function (fileName) {
                const filePath = path.join(dirPath, fileName)
                const requiredModule = require(filePath)

                procedures.push({
                    path: file,
                    Procedure: requiredModule.default || requiredModule,
                })
            })
        }
    })

    return procedures
}
