'use strict';

const urlJoin = require('url-join');
const axios = require('axios');
const semver = require('semver');

const { DEFAULT_REGISTRY, SUCCESS_CODE } = require('./constants')

async function getNpmPkgInfo(pkgName, registry) {
	const registryUrl = registry || DEFAULT_REGISTRY
	const npmUrl = urlJoin(registryUrl, pkgName)
	try {
		const res = await axios.get(npmUrl)
		if (res.status = SUCCESS_CODE) return res.data
	} catch (e) {
		throw new Error(e.message)
	}
}

async function getNpmPkgVersions(pkgName, registry) {
	const pkgInfo = await getNpmPkgInfo(pkgName, registry)
	return Object.keys(pkgInfo.versions)
}

async function getAvailableHigherVersions(pkgName, baseVersion, registry) {
	const allAvailableVersions = await getNpmPkgVersions(pkgName, registry)
	return allAvailableVersions
		.filter(version => semver.gt(version, baseVersion))
		.sort((v1, v2) => { return semver.gt(v1, v2) ? -1 : 1 })
}

async function getPkgLatestVersion(pkgName, baseVersion, registry) {
	const availableHigherVersions = await getAvailableHigherVersions(pkgName, baseVersion, registry);
	return availableHigherVersions[0]
}


module.exports = {
	// getNpmPkgInfo,
	// getNpmPkgVersions,
	// getAvailableHigherVersions,
	getPkgLatestVersion
};