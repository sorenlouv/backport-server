Backport Server should be used together with [`backport`](https://github.com/sqren/backport) to automatically backport commits when a pull request is merged.

## Getting Started

### Start server

```
# install dependencies
yarn

# Start server (will run on port 3000 by default, unless changed via `SERVER_PORT`)
yarn start
```

Note: You can specify `USERNAME`, `ACCESS_TOKEN` and `SERVER_PORT` via .env file or environment variables.

### Add webhook

To call the server when a pull request is merged you must add a webhook to the selected repository:

1. Settings -> Webhooks -> Add webhook
2. Payload url: the address `backport-server` is running on
3. Content-type: application/json
4. Secret: _empty_
5. Events to trigger webhook: Pull requests

## Related:

https://github.com/sqren/backport
