This folder contains two example files, `example.js` in Javascript and
`example.ts` in Typescript. Both work the same way, demonstrating the many
different formats you can use to pass input to logger functions (most of which
conform to what you'd expect from standard `console.log` behavior). When running
the example files from this directory, the logger configuration is provided by
`logger.config.js`. This file shows how to customize options for a whole project
by providing a single `logger.config.js` file in the project's working
directory, and demonstrates that these project-wide settings can be overridden
on a per-file basis by passing additional options to the logger constructor.
