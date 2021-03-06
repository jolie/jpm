const fs = require("fs-extra");
const PACKAGE_DIR = require('../constants/packageDir');
const REPOSITORIES = require("../constants/repositories");
const LIB_DIR = require('../constants/lib');
const { JPM_JSON } = require('../utils/jpmJson');
const { install } = require("./install");
const chalk = require('chalk')

function remove(artifactRef) {

    const jpmJson = JPM_JSON.read()

    const [repo, artifact] =
        artifactRef.slice(-4, -3) === '@'
            ? [artifactRef.slice(-3), artifactRef.slice(0, -4)]
            : ['npm', artifactRef]

    if (!REPOSITORIES.map(r => `@${r}`).includes(`@${repo}`)) {
        throw new Error("Package repository " + repo + " does not exist.")
    }

    const split = artifact.split(":")

    if (split.length > 2) {
        throw new Error(`Usage: ${chalk.green("jpm remove pkg-name@repo")}`)
    }

    delete jpmJson.dependencies[repo][artifact]
    delete jpmJson.mvnPeers

    fs.removeSync(`${PACKAGE_DIR}`, { recursive: true });
    fs.removeSync(`${LIB_DIR}`, { recursive: true });

    JPM_JSON.write(jpmJson)

    install()

}

module.exports = { remove }