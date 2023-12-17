/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `index` command */
  export type Index = ExtensionPreferences & {
  /** Sidekick Profile Path - Path to Sidekick profile folder. Leave empty to use default profile. Default at /Users/username/Library/Application Support/Sidekick/Default */
  "profilePathSidekick"?: string
}
}

declare namespace Arguments {
  /** Arguments passed to the `index` command */
  export type Index = {}
}


