import { createMcpHandler } from 'mcp-handler';

const handler = createMcpHandler(
  (server) => {
    server.tool(
      'hello_world',
      'Returns Hello World',
      {},
      async () => ({
        content: [{ type: 'text', text: 'Hello World' }],
      }),
    );
  },
  {},
  { basePath: '/api' },
);

export { handler as GET, handler as POST, handler as DELETE };
