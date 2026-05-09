---
layout: page
title: Architecture Tracer
---

Architecture Tracer is a web-based application which allows you to construct system architecture simulations and run simultation traces through them via a Command Line Interface(CLI).

You can try out Architecture Tracer directly below, or use it on your local machine after installing it by following the installation guide below.

<iframe
src="./app/"
title="Architecture Tracer App"
width="100%"
height="650px" 
style="border:1px solid #e0e0e0; border-radius:8px;">
</iframe>

## Installation guide
1. Install Node.js from https://nodejs.org.
2. Download the latest release here.
3. Unzip the folder, and open the terminal inside the folder.
4. Paste these two commands one at a time:
   ```
   npm install
   npm run dev
   ```
5. Open http://localhost:5173 in your browser.

## Commands
<box type="info" seamless>

**Notes about the command format:**

- Words in `SCREAMING_SNAKE_CASE` are parameters to be supplied by the user.
  e.g. in `add n/LABEL`, `LABEL` is a parameter, so you might write `add n/Database`.

- Unrecognised commands or commands with incorrect formatting will result in an error message and be rejected by the app.

</box>

### Adding a new node: `add n/`
Adds a new node with a given label.

Format: `add n/LABEL`

Example:
- `add n/Internet`: Creates a new node labelled "Internet".

### Adding a new edge: `add e/`
Adds a new edge connecting two nodes.

Format: `add e/n#INDEX n#INDEX`

Example: 
- `add e/n#1 n#3`: Connects the nodes with id 1 and 3 together.

### Adding a new edge: `add e/`
Adds a new edge connecting two nodes.

Format: `add e/n#ID n#ID`

Example: 
- `add e/n#1 n#3`: Connects the nodes with id 1 and 3 together.

### Deleting a node or edge: `del`
Delete a node or an edge using its id.

Format: `del n#ID` or `del e#ID`

Example:
- `del n#1`: Deletes the node with id 1.
- `del e#3`: Deletes the edge with id 3.

### Begin/Continue a simulation trace: `trace`
If there is currently an ongoing simulation trace, progress to a given node if it is accessible. Else begins a simulation trace on the given node.

Format: `trace n#ID`

Example:
- `trace n#3` when a simulation trace is currently not in progress: Begin a simulation trace on the node with ID 3.
- `trace n#3` when a simulation trace is in progress, and the node with ID 3 is accessible to the current node: Progress to the node with ID 3.
- `trace n#3` when a simulation trace is in progress, however the node with ID 3 is currently inaccessible to the current node: An error message will be displayed as this is not a valid command under the current circumstances.

### End the current simulation trace: `trace end`
Ends the current simulation trace, if any, allowing the user to begin a new simulation trace on a separate node.

<box type="warning" seamless>

For more detailed information, consult the User Guide.

</box>

Development information here.

<box type="warning" seamless>

For more detailed information, consult the Developer Guide.

</box>

