# memory-usage-webpack-plugin

Plugin for generating insightful data about your Webpack runtime memory consumption.

The plugin watches for a rss memory consumption over a threshold, and when the memory is greater logs a `.heapsnapshot` that can be loaded in the chrome developer tools or [heapviz.com](https://heapviz.com/)

## Install

`npm i -D memory-usage-webpack-plugin`

## Usage

###### webpack.config.js

```js
const MemoryUsageWebpackPlugin = require('memory-usage-webpack-plugin')

module.exports = {
  // webpackConfig,
  plugins: [
    // ...plugins,
    new MemoryUsageWebpackPlugin({ 
        // ...options
     })
  ]
}
```
## Options 

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| threshold | <code>number</code> | <code>1024</code> | Memory in mb when to save the first heapsnaptshot |
| tresholdIncrease | <code>number</code> | <code>100</code> | Memory in mb to increase threshold after a threshold is reached |
| snaptshotOnKill | <code>boolean</code> | <code>true</code> | Logs a heapsnaptshot when a kill -9 kills the process |
| snaptshotOnSignal | <code>boolean</code> | <code>true</code> | Logs a heapsnaptshot when a kill -USR2 kills the process |
