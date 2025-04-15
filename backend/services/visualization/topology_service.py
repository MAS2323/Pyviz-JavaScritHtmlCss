import networkx as nx
import holoviews as hv
from holoviews import opts
from sqlalchemy.orm import Session, joinedload
from models.fibcab_models import FibcabDevInfo
from models.device_info import DeviceInfo
import numpy as np
from fastapi.responses import FileResponse
import os

hv.extension('bokeh')

def create_network_topology(db: Session):
    # Eager load the config relationship to avoid N+1 queries
    fibcabs = db.query(FibcabDevInfo).options(joinedload(FibcabDevInfo.config)).all()
    devices = {d.sn: d for d in db.query(DeviceInfo).all()}
    
    # Map string-based SNs to unique integers
    sn_to_id = {sn: idx for idx, sn in enumerate(devices.keys())}
    
    # Create network graph
    G = nx.Graph()
    
    # Add nodes (devices)
    for sn, device in devices.items():
        node_id = sn_to_id[sn]
        G.add_node(node_id, 
                   sn=sn,  # Preserve original SN
                   name=device.name,
                   type=device.Producer,
                   location=device.location)
    
    # Add edges (connections)
    for fib in fibcabs:
        if fib.source_sn in devices and fib.target_sn in devices:
            source_id = sn_to_id[fib.source_sn]
            target_id = sn_to_id[fib.target_sn]
            # Get capacity from config if it exists
            capacity = fib.config.ficab_capacity if fib.config else None
            G.add_edge(source_id, target_id,
                       type=fib.Type,
                       capacity=capacity)
    
    # Create positions for all nodes using spring layout
    pos = nx.spring_layout(G)
    
    # Prepare node data for HoloViews
    node_data = [(node_id, pos[node_id][0], pos[node_id][1], data['name'], data['type'], data['location']) 
                 for node_id, data in G.nodes(data=True)]
    
    # Prepare edge data for HoloViews
    edge_data = [(src, tgt, data['type'], data.get('capacity'))
                 for src, tgt, data in G.edges(data=True)]
    
    # Create HoloViews graph
    nodes = hv.Nodes(
        node_data,
        vdims=['name', 'type', 'location']
    )
    edges = hv.Graph(
        (edge_data, nodes),
        vdims=['type', 'capacity']
    )
    
    # Customize the visualization
    graph = (edges * nodes).opts(
        opts.Graph(
            width=800,
            height=600,
            directed=False,
            node_size=10,
            edge_color='type',
            node_color='type',
            cmap='Category20',
            tools=['hover', 'tap'],
            inspection_policy='nodes',
            node_hover_fill_color='red',
            edge_hover_line_color='red'
        )
    )
    return graph

def get_network_topology(db: Session):
    # Generate the graph
    topology = create_network_topology(db)
    
    # Save the graph as an HTML file
    temp_html_file = "network_topology.html"
    hv.save(topology, temp_html_file, backend='bokeh')
    
    # Return the HTML file as a response
    return FileResponse(temp_html_file, media_type="text/html")