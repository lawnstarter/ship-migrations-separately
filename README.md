# ship-migrations-separately

```
on: [pull_request]

jobs:
  on_all_pull_requests:
    runs-on: ubuntu-latest
    name: Ship Migrations Separately
    steps:
      - uses: lfkwtz/ship-migrations-separately@0.0.11
        with:
          token: ${{ secrets.TOKEN_GH }}

```
