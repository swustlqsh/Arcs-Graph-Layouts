<template>
  <div id="graph-container">
      <div class="graph" ref="graph"></div>
  </div>
</template>

<script>
import Graph from "./graph"
let graph = undefined

export default {
  name: "app",
  data() {
    return {
    }
  },
  mounted() {
    const data = [
      { name: "group1", value: 3, g: 0 },
      { name: "group2", value: 2, g: 1 },
      { name: "group3", value: 3, g: 2 },
      { name: "group4", value: 4, g: 3 },
      { name: "group5", value: 5, g: 4 }
    ]
    graph = new Graph(this.$refs.graph, data)
    graph
      .createArc()
      .createGraph()
  }
};
</script>
<style lang="less" scoped>
#graph-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  .graph {
    width: 500px;
    svg line {
      fill: #ccc;
    }
  }
}
</style>