import semver from "semver";

const minimum_node_version = ">=v20.17.0";
const current_node_version = process.version;

if (!semver.satisfies(current_node_version, minimum_node_version)) {
  console.log(
    `minimum node version is ${minimum_node_version}, your current node version is ${current_node_version}`
  );
  process.exit(1);
}
