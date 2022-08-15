const formatVersion = (versionHeartbeat: number | undefined) => {
  if (!versionHeartbeat) return;

  const versionString = versionHeartbeat.toString().padStart(10, "0");
  const major = parseInt(versionString.slice(0, 3));
  const minor = parseInt(versionString.slice(3, 6));
  const patch = parseInt(versionString.slice(6, 10));

  return [major, minor, patch].join(".");
};

export default formatVersion;
