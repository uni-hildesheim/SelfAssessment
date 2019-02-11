import { Vendor } from './resource.vendor.model';

/**
 * A Resource is an application-specific object, that contains
 * static information e.g the application-name or the vendor as
 * well as language-specific information which sits in the
 * strings object.
 */
export class Resource {

    /**
     * The footer text content.
     */
    footer: string;

    /**
     * The header text content.
     */
    header: string;

    /**
     * The word language in the respective language.
     */
    language: string;

    /**
     * The application name.
     */
    name: string;

    /**
     * The language properties.
     */
    strings: Object;

    /**
     * The vendor information.
     */
    vendor: Vendor;
}
