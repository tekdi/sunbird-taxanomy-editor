# Integrating a New Next.js Micro-frontend in an Nx Monorepo

This guide walks you through the process of integrating a new Next.js micro-frontend (MFE) within an Nx monorepo structure.

## Prerequisites

- Nx workspace already set up
- Host application configured
- Basic understanding of Next.js and micro-frontend architecture

## Step-by-Step Integration Process

### Step 1: Scaffold a New Next.js Application

Create a new Next.js application using the Nx generator:

```bash
nx g @nx/next:application test-mfe --directory=mfes/test-mfe
```

### Step 2: Update the Host Application Middleware

Update the `middleware.ts` file of the host application where the MFE will be integrated:

```typescript
if (url.pathname.startsWith('/test')) {
  url.hostname = 'localhost';
  url.port = '4107';
  return NextResponse.rewrite(url);
}
```

**Note**: This configuration makes the MFE accessible at the `/test` route of the host application's URL.

### Step 3: Configure the MFE Base Path

In the `next.config.js` file of the newly created MFE (in this case `test-mfe`), add the base path configuration:

```javascript
const nextConfig = {
  nx: {
    svgr: false,
  },
  basePath: '/test',
};
```

### Step 4: Run the Applications

Start both the host application and the MFE using Nx development commands:

```bash
# Run the host application
nx dev <host-app-name>

# Run the MFE
nx dev test-mfe
```

## Key Configuration Points

- **Route Mapping**: The middleware configuration determines which routes are forwarded to the MFE
- **Port Configuration**: Ensure the port specified in middleware matches the MFE's running port
- **Base Path**: The `basePath` in the MFE's configuration must match the route prefix in the middleware
- **Development**: Both applications need to run simultaneously during development

## Troubleshooting

- Verify that the ports don't conflict with other running services
- Ensure the base path in the MFE matches the route prefix in the host application
- Check that both applications start successfully before testing the integration
