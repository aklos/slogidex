<p align="center"> <img alt="Autotool" width="880" height="350" src="https://github.com/aklos/autotool/blob/main/src/banner.svg"> </p>

Autotool, or "Automation tool", is a desktop application for writing and executing processes inspired by the concept of gradual automation. It's pretty simple: formalize a process into discrete steps, then try to replace some of the steps with automated scripts.

The point of Autotool is to make *that* process easier with

- A unified environment for managing processes
- Components for defining processes; like rich text blocks, code blocks, and forms
- Embedded script execution

Whether you're doing **devops**, **business operations**, **system administration**, or just **tinkering**, there's probably something you'd like to automate or simplify.


https://user-images.githubusercontent.com/8189043/203539025-27cc33f3-9aac-4589-afa9-c57f87f4a8d5.mp4


## Supported platforms

Currently Autotool has builds for MacOS and Ubuntu 20.04 (and other debian-based linux distros). **The MacOS build is unsigned, since we don't have access to signing credentials.**

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

Autotool is an open source project (MIT license) with separate proprietary modules targeted for enterprise users. See the [LICENSE](https://github.com/aklos/autotool/blob/main/LICENSE.md) file for licensing information as it pertains to
files in this repository.
