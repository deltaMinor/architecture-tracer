---
layout: page
title: Developer Guide
---

## Design

architecture-tracer utilises a Model View Controller(MVC) design pattern. As such the app can be largely split into the following three components:

- UI: The UI of architecture-tracer. Amongst other imported shadcn/ui elements, architecture-tracer also contains custom Node, Edge, command box, response box and side bar UI elements.
- Logic: The command executor of architecture-tracer. This component includes files `command.tsx`, `commandParser.tsx`, and `validationParser.tsx`.
- Model: Holds the data of the architecture-tracer currently in user. This is encapsulated by the `ArchitectureState` class.

In addition, architecture-tracer also utilises the Command pattern to execute the tasks.

Said patterns are used in this project as they are both very fitting for an application which executes tasks based on user input one at a time; as well as an application which centres around changing stored information based on external inputs and displaying said information to the user.

## Requirements and Assumptions

- Should be accessed primarily via a Command Line Interface.
- Should utilise React for the frontend.
- Architecture data must be compatible with React Flow’s Node and Edge formats.
- Should run smoothly (e.g. always respond to user input within 250 milliseconds).

## Future Enhancements

As this project was made from scratch in the span of 3-4 days, there remains a lot of room for improvement. Here are the enhancements I would like to implement if given more time, in no particular order:

- Enhanced UI elements: The current GUI elements are quite barebones, with no option to customise them available to the user. Examples of improvements I would like to implement:
  - More fluid UI: Pop-up animations for added nodes and edges, smooth transition of highlights during simulation trace
  - Hover over nodes and edges for additional data
  - Customisable UI elements: Allow the user to change the colour scheme and formatting of the app
- Persistent storage: Currently, the architecture-tracer app starts from a fresh slate on startup, with no option to save and load data. With more time, such features would be implemented.
- Undo/redo functions: Currently, there is no way to retrieve old data that is removed/changed by mistake. With more time, such features would be implemented.
- Edge direction: Currently, the direction of an edge does not matter in a simulation trace. Perhaps the simulation trace mechanics can be adjusted such that the edge can only be travelled by the trace in one direction.
- Higher test coverage: Currently, the test coverage of this project is around 68%. The coverage should ideally be higher for the sake of ensuring better code quality and easier development of the project in the future.
