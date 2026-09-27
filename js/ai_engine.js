const AIEngine = {
    parsePrompt: function(input) {
        const text = input.toLowerCase();
        let target = "LEAF-101";
        let command = "show interface status";

        if (text.includes("apic")) {
            target = "APIC-01";
            command = text.includes("fault") ? "show faults" : "show health";
        } else {
            if (text.includes("102")) target = "LEAF-102";
            
            if (text.includes("route") || text.includes("라우팅")) {
                command = "show ip route";
            } else if (text.includes("bgp")) {
                command = "show bgp summary";
            } else if (text.includes("lldp") || text.includes("이웃")) {
                command = "show lldp neighbors";
            } else if (text.includes("system") || text.includes("cpu")) {
                command = "show system status";
            } else if (text.includes("interface") || text.includes("상태")) {
                command = "show interface status";
            }
        }

        return {
            targetDevice: target,
            convertedCommand: command,
            summary: `[AI Analysis] 요청을 장비 [${target}]의 '${command}' 실행 결과로 분석/요약했습니다.`
        };
    }
};
