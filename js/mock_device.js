const MockDeviceDB = {
    "LEAF-101": {
        "show ip route": `
LEAF-101# show ip route
IP Route Table for VRF "Production_VRF"
'*' denotes best ucast next-hop, '**' denotes best mcast next-hop

10.20.1.0/24, 1 ubest/mbest, via Gateway
    *via 10.20.1.1, vlan101, [0/0], 04d12h, direct
10.20.2.0/24, 1 ubest/mbest, via Fabric
    *via 10.0.240.65, eth1/1, [115/20], 12d08h, ospf-default
0.0.0.0/0, 1 ubest/mbest
    *via 10.10.1.254, eth1/48, [1/0], static`,

        "show interface status": `
LEAF-101# show interface status
--------------------------------------------------------------------------------
Port          Name               Status    Vlan      Duplex  Speed   Type
--------------------------------------------------------------------------------
Eth1/1        Uplink_Spine201    connected trunk     full    40G     QSFP-40G-SR4
Eth1/2        Uplink_Spine202    connected trunk     full    40G     QSFP-40G-SR4
Eth1/10       To_Web_Server_50   connected 101       full    10G     10gbase-tp
Eth1/11       To_DB_Server_80    connected 102       full    10G     10gbase-tp`,

        "show bgp summary": `
LEAF-101# show bgp summary
BGP summary information for VRF default, address family IPv4 Unicast
BGP router identifier 10.0.240.1, local AS number 65001
Neighbor        V    AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd
10.0.240.2      4 65001   12402   12405       48    0    0 04d12h 12`,

        "show lldp neighbors": `
LEAF-101# show lldp neighbors
Capability codes: (R) Router, (B) Bridge, (T) Telephone, (D) Docsis
Device ID            Local Intf      Hold-time  Capability  Port ID
SPINE-201            Eth1/1          120        RB          Eth1/1
SPINE-202            Eth1/2          120        RB          Eth1/1`,

        "show system status": `
LEAF-101# show system status
Kernel uptime:           45 days, 03 hours
CPU utilization:         usr 1.8%, sys 0.9%, idle 97.3%
Memory utilization:      Total 16321200K, Used 5912000K, Free 10409200K`
    },

    "LEAF-102": {
        "show ip route": `
LEAF-102# show ip route
IP Route Table for VRF "Production_VRF"
10.20.2.0/24, 1 ubest/mbest, via Gateway
    *via 10.20.2.1, vlan102, [0/0], 08d02h, direct`,

        "show interface status": `
LEAF-102# show interface status
Eth1/1        Uplink_Spine201    connected trunk     full    40G
Eth1/12       To_App_Server_80   connected 102       full    10G`
    },

    "APIC-01": {
        "show health": `
apic1# show health score
System Health Score : 99 / 100
Cluster Status      : Fully Fit (3/3 APICs active)`,

        "show faults": `
apic1# show faults
No Critical Faults. 2 Minor Faults detected on Leaf-103 PSU Fan-2.`
    }
};
