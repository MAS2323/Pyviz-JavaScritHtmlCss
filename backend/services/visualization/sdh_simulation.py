# # 导入OMNeT++的Python绑定库
# import omnetpp
# def run_sdh_simulation():
#     # 初始化仿真环境
#     omnetpp.Global.Setup()
#     # 创建节点容器
#     nodes = omnetpp.NodeContainer()
#     # 添加两个节点（例如发送端和接收端）
#     node_sender = omnetpp.Node()
#     node_receiver = omnetpp.Node()
#     nodes.Add(node_sender)
#     nodes.Add(node_receiver)

#     # 创建点对点链路，并设置链路参数
#     pointToPoint = omnetpp.PointToPointHelper()
#     pointToPoint.SetDeviceAttribute("DataRate", omnetpp.StringValue("1Mbps"))
#     pointToPoint.SetChannelAttribute("Delay", omnetpp.StringValue("1ms"))
#     # 安装链路到节点之间
#     devices = pointToPoint.Install(nodes)
#     # 创建并配置UDP流应用
#     onOffApp = omnetpp.OnOffApplication()
#     onOffApp.SetAttribute("PacketSize", omnetpp.UintegerValue(1024))  # 包大小：1024字节
#     onOffApp.SetAttribute("DataRate", omnetpp.StringValue("100kbps"))  # 数据速率：100kbps
#     # 将应用程序安装到发送端节点
#     onOffApp.Install(node_sender)
#     # 启动仿真
#     print("启动SDH网络仿真...")
#     omnetpp.Global.Run()
#     # 结束仿真
#     omnetpp.Global.Cleanup()
#     print("SDH网络仿真结束。")
# if __name__ == "__main__":
#     run_sdh_simulation()
    
    
    
    

# if __name__ == "__main__":
#     # 初始化仿真环境
#     omnetpp.Global.Setup()

#     # 创建网络拓扑
#     nodes, devices = setup_sdh_topology()

#     # 在发送端节点上安装UDP业务
#     install_udp_application(nodes.Get(0))

#     # 启动仿真
#     print("启动SDH网络仿真...")
#     omnetpp.Global.Run()

#     # 清理资源
#     omnetpp.Global.Cleanup()
#     print("SDH网络仿真完成。")