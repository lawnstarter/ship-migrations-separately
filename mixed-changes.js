function mixesMigrationsWithOtherChanges(filenames, migrationDirectory) {
  const prefix = migrationDirectory.replace(/\/$/, "") + "/";
  const isMigration = (filename) => filename.startsWith(prefix);
  const isTest = (filename) => filename.indexOf("tests/") !== -1;

  return (
    filenames.some(isMigration) &&
    filenames.some((filename) => !isMigration(filename) && !isTest(filename))
  );
}

module.exports = { mixesMigrationsWithOtherChanges };
