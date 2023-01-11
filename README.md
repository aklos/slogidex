<p> <div align="center"><img alt="Slogidex" width="880" height="240" src="https://github.com/aklos/autotool/blob/main/src/banner.svg"></div>
<a href="https://github.com/aklos/autotool/releases"><img alt="Download latest release" src="https://img.shields.io/badge/Download-latest%20release-brightgreen"></a></p>

Slogidex is an evironment for writing and executing processes inspired by the concept of gradual automation. It's pretty simple: formalize a process into discrete steps, then try to replace steps with automated scripts. If you can't, that's fine, just outlining the process can already be helpful for remembering tasks, onboarding team members, or working through harder problems.

The point of Slogidex is to make that process easier with

- A unified GUI for managing processes
- Components for defining processes; like rich text blocks, code blocks, and forms
- Embedded script execution
- Instancing and progress tracking

Whether you're doing operations, system administration, or just tinkering, there's probably something you'd like to automate or simplify.

## Supported platforms

Currently Slogidex has builds for MacOS and Ubuntu 20.04 (and other debian-based linux distros).

Windows support is coming soon (likely in the earlier Beta releases).

## Development

### Requirements

- [Install Rust](https://www.rust-lang.org/tools/install)
- [Install yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)

### Setup

1. Install tauri dependencies with: `yarn install`
2. Then start the development build with: `yarn tauri dev`

This will install and compile all required packages then launch the application for testing.

## Contributing

We're happy to accept community contributions. If you're interested in adding a feature, please create an issue for it.

## License

Slogidex is an open source project (MIT license) with separate proprietary modules targeted for enterprise users. See the [LICENSE](https://github.com/aklos/autotool/blob/main/LICENSE.md) file for licensing information as it pertains to
files in this repository.
