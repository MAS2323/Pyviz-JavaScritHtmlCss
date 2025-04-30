import React from "react";
import Plot from "react-plotly.js";
import "./styles/NetworkGraph.css";

const NetworkGraph = ({ networkData }) => {
  // Procesar los datos de la API para extraer nodos y conexiones
  const processNetworkData = (networkData) => {
    if (!networkData || !networkData.features) {
      return { nodes: [], edges: [] };
    }

    // Extraer nodos únicos (source_sn y target_sn)
    const nodeSet = new Set();
    networkData.features.forEach((feature) => {
      const { source_sn, target_sn } = feature.properties;
      nodeSet.add(source_sn);
      nodeSet.add(target_sn);
    });
    const nodeList = Array.from(nodeSet);

    // Asignar posiciones a los nodos (usamos un layout simple para este ejemplo)
    const nodes = nodeList.map((node, index) => {
      const angle = (2 * Math.PI * index) / nodeList.length; // Distribución circular
      return {
        id: node,
        x: Math.cos(angle) * 2, // Escala para mejor visualización
        y: Math.sin(angle) * 2,
      };
    });

    // Extraer conexiones (edges)
    const edges = networkData.features.map((feature) => ({
      source: feature.properties.source_sn,
      target: feature.properties.target_sn,
    }));

    return { nodes, edges };
  };

  const { nodes, edges } = processNetworkData(networkData);

  // Preparar datos para Plotly
  const nodeX = nodes.map((node) => node.x);
  const nodeY = nodes.map((node) => node.y);
  const nodeLabels = nodes.map((node) => node.id);

  // Preparar las líneas (edges)
  const edgeX = [];
  const edgeY = [];
  edges.forEach((edge) => {
    const sourceNode = nodes.find((node) => node.id === edge.source);
    const targetNode = nodes.find((node) => node.id === edge.target);
    if (sourceNode && targetNode) {
      edgeX.push(sourceNode.x, targetNode.x, null); // null para discontinuidad
      edgeY.push(sourceNode.y, targetNode.y, null);
    }
  });

  // Datos para Plotly
  const plotData = [
    // Líneas (edges)
    {
      type: "scatter",
      x: edgeX,
      y: edgeY,
      mode: "lines",
      line: { color: "#888", width: 2 },
      hoverinfo: "none",
    },
    // Nodos
    {
      type: "scatter",
      x: nodeX,
      y: nodeY,
      mode: "markers+text",
      text: nodeLabels,
      textposition: "top center",
      marker: {
        size: 30,
        color: "#69b3a2",
        opacity: 0.8,
        line: { color: "#000", width: 1 },
      },
      hoverinfo: "text",
    },
  ];

  const layout = {
    title: "Red de Conexiones",
    showlegend: false,
    xaxis: { showgrid: false, zeroline: false, showticklabels: false },
    yaxis: { showgrid: false, zeroline: false, showticklabels: false },
    height: 300,
    width: 350,
    margin: { t: 50, b: 20, l: 20, r: 20 },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
  };

  return (
    <div className="network-graph-container">
      <Plot data={plotData} layout={layout} />
    </div>
  );
};

export default NetworkGraph;
