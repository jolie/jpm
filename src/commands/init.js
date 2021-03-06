const fs = require("fs-extra")
const os = require("os");

const { JPM_JSON } = require("../utils/jpmJson")
const { parsePom } = require("../utils/parsePom")
const { makeMvnArtifactJson } = require("../utils/makeMvnArtifactJson")
const { getLatestArtifactVersion } = require("../utils/getLatestArtifactVersion")

const LIB_DIR = require("../constants/lib")
const LATEST_VERSION = require("../constants/latestVersion")

async function init() {

    if (JPM_JSON.exists()) throw new Error("Found jpm.json already initiated in this folder.")

    fs.existsSync(LIB_DIR) && fs.removeSync(LIB_DIR)

    let distJar, mvnPeers, parsedPom = {}

    if (fs.existsSync('pom.xml')) {
        parsedPom = await parsePom({ filePath: 'pom.xml' })
        const { artifactid, version } = parsedPom.pomObject.project
        distJar = `${artifactid}-${version}.jar`
    }

    const mvn = parsedPom.dependencies
    const mvnEntries = mvn ? Object.entries(mvn) : []

    const updateInitPeers = async entries => {
        for (let [artifact, version] of entries) {
            const [groupId, artifactId] = artifact.split(":");

            (!version || version === LATEST_VERSION) && (version = await getLatestArtifactVersion({ groupId, artifactId }))

            const parsedPom = await makeMvnArtifactJson({ groupId, artifactId, version })

            const newEntries = Object.entries(parsedPom)

            if (newEntries.length > 0) {
                !mvnPeers && (mvnPeers = {})
                mvnPeers = {
                    ...mvnPeers,
                    [`${groupId}:${artifactId}`]: parsedPom
                }
                await updateInitPeers(newEntries)
            }

        }
    }

    await updateInitPeers(mvnEntries)

    const npm = {}

    const jpmJson = {
        name: process.cwd().split("/").pop().split("\\").pop(),
        description: "",
        author: "",
        version: '1.0.0',
        license: "ISC",
        keywords: [],
        scripts: {
            "jolive": "npx nodemon --exec jolie ./server.ol",
            "clean": "rm ./hs_err_pid*"
        },
        distJar,
        dependencies: { mvn, npm },
        mvnPeers
    }
    JPM_JSON.write(jpmJson)

    fs.writeFileSync('.npmignore', "lib/\ntarget/\n.settings/\n.classpath\n.project\nsrc/\npom.xml\npackages/\n.vscode/" + os.EOL)

}

module.exports = { init }