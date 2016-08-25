React countTo Compnent
=====================
[react-countTo](https://github.com/noitidart/react-countTo) is a React component that will count up (or down) to a target number with a specified cubic-bezier timing function in a sepecified amount of time.

This was inspired by [jQuery countTo](https://github.com/mhuggins/jquery-countTo) plugin by [@mhuggins](https://github.com/mhuggins).

Notable difference is that there are no functions to pause/stop/play the counter. This is because the design is meant to work with CSS easing functions. A `duration` in milliseconds is supplied as well as the `x2, y2` and `x3, y3` of the cubic-bezier easing function.

Demo
-----
[https://noitidart.github.io/react-countTo/demo/demo.htm](https://noitidart.github.io/react-countTo/demo/demo.htm)

Links
------
* [GitHub Repository](https://github.com/Noitidart/react-countTo)
* [npm Package](https://www.npmjs.com/package/react-countTo)
* [React Components](http://react-components.com/component/react-color)

Requirements
-------------
* v15.1.0 of react.js or react-with-addons.js
  * Respective react-dom.js

* **Note** I have not tested this in version of React less than v15.1.0. It will probably work.

Usage
------
There is one approaches to using this component: through `props` set on the component.

### API
#### props
| Name     | Type          | Default | Description                                                                                                                                                                                                                                                                       |
|----------|---------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| mountval | Integer       | 0       | The value to be when mounted. If it matches the `end` value on mount, then no transition will take place.                                                                                                                                                                         |
| bezier   | Array or Enum | ease    |  Enum of strings: `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`. Or supply an array, this is the same way you provide a CSS `cubic-bezier`. Provide the 4 inner coordinate components. You can use [cubic-bezier.com](http://cubic-bezier.com/) to help generate curves. |
| duration | Integer       |         | Number of milliseconds the transition should take                                                                                                                                                                                                                                 |
| end      | Integer       |         | The number to end the transition at. If the current value is same as the `end`, then no transition will take place.                                                                                                                                                               |
