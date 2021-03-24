const { JPM_JSON } = require("../utils/jpmJson")
const fs = require("fs-extra")
const { parsePom } = require("../utils/parsePom")
const { makeArtifactPomUrl } = require("../utils/downloadMvnArtifact")
const fetch = require("node-fetch")
const { makeMvnArtifactJson } = require("../utils/makeMvnArtifactJson")
const LIB_DIR = require("../constants/lib")

async function init() {

    if (JPM_JSON.exists()) throw new Error("Found jpm.json already initiated in this folder.")

    fs.existsSync(LIB_DIR) && fs.removeSync(LIB_DIR)

    const mvn =
        fs.existsSync('pom.xml')
            ? (await parsePom({ filePath: 'pom.xml' }))
            : {}

    let mvnPeers = {}
    const mvnEntries = Object.entries(mvn)

    const updateInitPeers = async entries => {
        for (let [artifact, version] of entries) {
            const [groupId, artifactId] = artifact.split(":")
            const parsedPom = await makeMvnArtifactJson({ groupId, artifactId, version })

            const newEntries = Object.entries(parsedPom)

            if (newEntries.length > 0) {
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
        dependencies: { mvn, npm },
        peerDependencies: {
            mvn: mvnPeers
        },
        scripts: {
            "jolive": "npx nodemon --exec jolie ./server.ol",
            "clean": "rm ./hs_err_pid*"
        }
    }
    JPM_JSON.write(jpmJson)

}

module.exports = { init }