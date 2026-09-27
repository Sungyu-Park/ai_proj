const AIEngine = {
    parsePrompt: function(input) {
        const text = input.toLowerCase();
        let target = "LEAF-101";
        let command = "show interface status";
        let isDangerous = false;

        // 1. 위험 명령 감지 (명세서 규격 반영)
        if (text.includes("reload") || text.includes("reboot") || text.includes("delete") || text.includes("shutdown")) {
            isDangerous = true;
        }

        // 2. 대상 장비 및 명령어 패턴 파싱
        if (text.includes("apic")) {
            target = "APIC-01";
            command = "show health";
        } else if (text.includes("vlan")) {
            command = "show vlan";
        } else if (text.includes("system") || text.includes("cpu")) {
            command = "show system status";
        }

        return {
            targetDevice: target,
            convertedCommand: command,
            isDangerous: isDangerous,
            summary: `[AI Analysis] 요청사항이 장비 [${target}]의 '${command}' 명령으로 해석되었습니다.`
        };
    }
};
