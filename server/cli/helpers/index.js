const Fs = require('fs')
const Path = require('path')
const Edge = require('edge.js')
const Consola = require('consola')

/**
 * This method creates a file and writes provided content into that file
 *
 * Returns true if the operation was successful
 * and false if it failed.
 *
 * @returns {boolean}
 *
 */
const createAndWriteToFile = (pathToFile, fileContent) => {
    try {
        Fs.writeFileSync(pathToFile, fileContent, { flag: 'w' })

        return true
    } catch (e) {
        Consola.error(`
An error occured creating and writing to file.

${e}`)

        return false
    }
}

/**
 *
 * Fetch the content of a stub, parse the template and return the
 * results
 *
 * @param {string} stubName
 * @param {object} stubData
 *
 * @return {string}
 *
 */
const getStubContent = (stubName, stubData) => {
    try {
        const stubContent = Fs.readFileSync(
            Path.resolve(__dirname, '..', 'stubs', `${stubName}.edge`)
        ).toString()

        return Edge.renderString(stubContent, stubData)
    } catch (error) {
        Consola.error(`
An error occured getting resource stub content.

${error}`)
        return null
    }
}

/**
 *
 * Get the string path to a resource
 *
 * @param {string} resourceName
 *
 * @return {string}
 *
 */
const getResourcePath = resourceName =>
    Path.resolve(process.cwd(), 'pangaso', `${resourceName}.js`)

/**
 *
 * Check if a resource exists
 *
 * @param {string} resourceName
 *
 * @return {boolean}
 *
 */
const resourceExists = resourceName => {
    try {
        return !!Fs.readFileSync(getResourcePath(resourceName))
    } catch (e) {
        return false
    }
}

module.exports = {
    resourceExists,
    getStubContent,
    getResourcePath,
    createAndWriteToFile
}
