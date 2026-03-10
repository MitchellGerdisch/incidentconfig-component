import * as pulumi from "@pulumi/pulumi";
import * as incident from "@pulumi/incident";

// ---------------------------------------------------------------------------
// Args interfaces -- flat, Input<T>-wrapped, no unions or callbacks.
// These are serializable across language boundaries for multi-language support.
// ---------------------------------------------------------------------------

/** Definition for an incident severity level. */
export interface SeverityDefinition {
    /** Human-readable name (e.g. "Critical"). */
    name: pulumi.Input<string>;
    /** Explanation of when this severity applies. */
    description: pulumi.Input<string>;
    /** Sort rank -- lower numbers are less severe. */
    rank?: pulumi.Input<number>;
}

/** Definition for an incident role. */
export interface RoleDefinition {
    /** Human-readable name (e.g. "Communications Lead"). */
    name: pulumi.Input<string>;
    /** Purpose of the role. */
    description: pulumi.Input<string>;
    /** Instructions shown to the person assigned this role. */
    instructions: pulumi.Input<string>;
    /** Short label used in Slack (e.g. "comms"). */
    shortform: pulumi.Input<string>;
}

/** Definition for a custom field attached to incidents. */
export interface CustomFieldDefinition {
    /** Human-readable name (e.g. "Affected Teams"). */
    name: pulumi.Input<string>;
    /** Explanation of what this field captures. */
    description: pulumi.Input<string>;
    /** Field type: "singleSelect", "multiSelect", "text", "link", or "numeric". */
    fieldType: pulumi.Input<string>;
}

/** Definition for an incident lifecycle status. */
export interface StatusDefinition {
    /** Human-readable name (e.g. "Investigating"). */
    name: pulumi.Input<string>;
    /** Description of this status. */
    description: pulumi.Input<string>;
    /**
     * Status category. Possible values: "triage", "declined", "merged",
     * "canceled", "live", "learning", "closed", "paused".
     */
    category: pulumi.Input<string>;
}

/** Arguments accepted by the IncidentConfig component. */
export interface IncidentConfigArgs {
    /** Severity levels to create. */
    severities?: SeverityDefinition[];
    /** Incident roles to create. */
    roles?: RoleDefinition[];
    /** Custom fields to create. */
    customFields?: CustomFieldDefinition[];
    /** Incident statuses to create. */
    statuses?: StatusDefinition[];
}

// ---------------------------------------------------------------------------
// Component resource
// ---------------------------------------------------------------------------

/**
 * IncidentConfig groups common incident.io configuration resources --
 * severities, roles, custom fields, and statuses -- into a single
 * reusable component.
 *
 * This component is designed for multi-language consumption via
 * `pulumi package add`.
 */
export class IncidentConfig extends pulumi.ComponentResource {
    /** The IDs of the severity resources created by this component. */
    public readonly severityIds: pulumi.Output<string[]>;
    /** The IDs of the incident role resources created by this component. */
    public readonly roleIds: pulumi.Output<string[]>;
    /** The IDs of the custom field resources created by this component. */
    public readonly customFieldIds: pulumi.Output<string[]>;
    /** The IDs of the status resources created by this component. */
    public readonly statusIds: pulumi.Output<string[]>;

    constructor(
        name: string,
        args: IncidentConfigArgs,
        opts?: pulumi.ComponentResourceOptions,
    ) {
        super("mitch-incidentconfig-component:index:IncidentConfig", name, {}, opts);

        const childOpts: pulumi.CustomResourceOptions = { parent: this };

        // --- Severities ---------------------------------------------------
        const severities = (args.severities ?? []).map((sev, i) => {
            return new incident.Severity(`${name}-severity-${i}`, {
                name: sev.name,
                description: sev.description,
                rank: sev.rank,
            }, childOpts);
        });

        // --- Roles --------------------------------------------------------
        const roles = (args.roles ?? []).map((role, i) => {
            return new incident.IncidentRole(`${name}-role-${i}`, {
                name: role.name,
                description: role.description,
                instructions: role.instructions,
                shortform: role.shortform,
            }, childOpts);
        });

        // --- Custom Fields ------------------------------------------------
        const customFields = (args.customFields ?? []).map((field, i) => {
            return new incident.CustomField(`${name}-field-${i}`, {
                name: field.name,
                description: field.description,
                fieldType: field.fieldType,
            }, childOpts);
        });

        // --- Statuses -----------------------------------------------------
        const statuses = (args.statuses ?? []).map((status, i) => {
            return new incident.Status(`${name}-status-${i}`, {
                name: status.name,
                description: status.description,
                category: status.category,
            }, childOpts);
        });

        // Expose serializable outputs (IDs) for cross-language consumption.
        this.severityIds = pulumi.output(severities.map(s => s.id));
        this.roleIds = pulumi.output(roles.map(r => r.id));
        this.customFieldIds = pulumi.output(customFields.map(f => f.id));
        this.statusIds = pulumi.output(statuses.map(s => s.id));

        this.registerOutputs({
            severityIds: this.severityIds,
            roleIds: this.roleIds,
            customFieldIds: this.customFieldIds,
            statusIds: this.statusIds,
        });
    }
}
