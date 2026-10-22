const assert = require("assert");
const { mixesMigrationsWithOtherChanges } = require("./mixed-changes");

const dir = "database/migrations";
const cases = [
  [["database/migrations/x.php", "app/a.php"], true],
  [["tests/Integration/internal/database/migrations/xTest.php", "app/a.php"], false],
  [["database/migrations/x.php", "tests/a.php"], false],
];

for (const [files, expected] of cases) {
  for (const d of [dir, dir + "/"]) {
    assert.strictEqual(mixesMigrationsWithOtherChanges(files, d), expected, `${d}: ${files}`);
    console.log(`ok ${expected ? "fails" : "passes"} [${d}] ${files.join(" + ")}`);
  }
}
