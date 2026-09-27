const MockDeviceDB = {
    "LEAF-101": {
        "show interface status": `
LEAF-101# show interface status
--------------------------------------------------------------------------------
Port          Name               Status    Vlan      Duplex  Speed   Type
--------------------------------------------------------------------------------
Eth1/1        --                 connected trunk     full    10G     10gbase-sfp
Eth1/2        --                 connected trunk     full    10G     10gbase-sfp
Eth1/10       To_App_Server_01   connected 101       full    10G     10gbase-tp
Eth1/11       To_DB_Server_01    connected 102       full    10G     10gbase-tp
Eth1/12       --                 disabled  1         auto    auto    10gbase-tp`,

        "show vlan": `
LEAF-101# show vlan
VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Eth1/12
101  Web_Production_EPG               active    Eth1/1, Eth1/2, Eth1/10
102  DB_Production_EPG                active    Eth1/1, Eth1/2, Eth1/11`,

        "show system status": `
LEAF-101# show system status
Kernel uptime:           42 days, 11 hours, 23 minutes
CPU utilization:         usr 2.10%, sys 1.15%, idle 96.75%
Memory utilization:      Total 16321200K, Used 6201100K, Free 10120100K`
    },

    "APIC-01": {
        "show health": `
apic1# show health score
System Health Score : 99 / 100
Total Active Faults : 0 Critical, 2 Major, 5 Minor`
    }
};
