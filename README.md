# mitch-incidentconfig-component

A Pulumi multi-language component that manages incident.io configuration as code.

## Overview

The `IncidentConfig` component groups common incident.io resources into a single
reusable unit:

- **Severities** -- incident severity levels (e.g. Critical, Major, Minor)
- **Roles** -- incident responder roles (e.g. Incident Commander, Comms Lead)
- **Custom Fields** -- metadata fields attached to incidents (e.g. Affected Teams)
- **Statuses** -- incident lifecycle statuses (e.g. Investigating, Resolved)

## Installation

Consumers add this component to their Pulumi project with:

```bash
pulumi package add https://github.com/pulumi-demos/mitch-incidentconfig-component
```

## Configuration

The incident.io API key must be configured via:

```bash
pulumi config set --secret incident:apiKey <your-api-key>
```

Or by setting the `INCIDENT_API_KEY` environment variable.

## Usage (TypeScript)

```typescript
import { IncidentConfig } from "@pulumi/mitch-incidentconfig-component";

const config = new IncidentConfig("acme", {
    severities: [
        { name: "Critical", description: "Total outage.", rank: 4 },
        { name: "Minor", description: "Limited impact.", rank: 2 },
    ],
    roles: [
        {
            name: "Incident Commander",
            description: "Owns the incident.",
            instructions: "Coordinate the response.",
            shortform: "ic",
        },
    ],
    customFields: [
        { name: "Affected Teams", description: "Impacted teams.", fieldType: "multiSelect" },
    ],
    statuses: [
        { name: "Investigating", description: "Team is investigating.", category: "triage" },
        { name: "Resolved", description: "Incident resolved.", category: "closed" },
    ],
});
```

## Publishing

Publish to the Pulumi private registry:

```bash
pulumi package publish https://github.com/pulumi-demos/mitch-incidentconfig-component --publisher demo
```
