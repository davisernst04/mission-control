# Mission Control

A local OpenClaw workspace dashboard built with Next.js, React, TypeScript, Tailwind CSS, and Zustand. Includes agent status, projects, task boards, career views, and memory-log views. Some screens remain prototypes or depend on a running local workspace.

## Development

Install dependencies with `npm ci`, configure `NEXT_PUBLIC_API_URL` using `.env.example`, and run `npm run dev`. The companion API is at https://github.com/davisernst04/mission-control-api.

This is a trusted-local-workspace prototype, not a public hosted service. It reads local memory and workspace data, and the companion API does not implement authentication. Do not expose either development server to the public Internet. Some routes still contain machine-specific paths or private-network addresses and require configuration for another machine.

## License

MIT. See LICENSE. Third-party dependencies retain their own licenses.
