# ship-migrations-separately

```
on: [pull_request]

jobs:
  on_all_pull_requests:
    runs-on: ubuntu-latest
    name: Ship Migrations Separately
    steps:
      - uses: lawnstarter/ship-migrations-separately@0.1.0
        with:
          token: ${{ secrets.TOKEN_GH }}

```
