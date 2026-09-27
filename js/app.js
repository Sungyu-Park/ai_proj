const App = {
    auditLogs: [],

    handleLogin: function(e) {
        e.preventDefault();
        const id = document.getElementById('loginId').value;
        const pw = document.getElementById('loginPw').value;

        if (id === 'sdnuser' && pw === 'testpw11') {
            document.getElementById('loginModal').classList.add('hidden');
            document.getElementById('app').classList.remove('opacity-20', 'pointer-events-none');
            this.addAuditLog("로그인", "sdnuser", "System Login", "Success");
        } else {
            document.getElementById('loginError').classList.remove('hidden');
        }
    },

    logout: function() {
        document.getElementById('loginModal').classList.remove('hidden');
        document.getElementById('app').classList.add('opacity-20', 'pointer-events-none');
    },

    switchTab: function(tabId) {
        ['dashboard', 'check', 'ai-cmd', 'ip-path', 'data-mgmt', 'audit-log'].forEach(id => {
            document.getElementById(`tab-${id}`).classList.add('hidden');
            document.getElementById(`nav-${id}`).classList.remove('sidebar-item-active');
        });
        document.getElementById(`tab-${tabId}`).classList.remove('hidden');
        document.getElementById(`nav-${tabId}`).classList.add('sidebar-item-active');
    },

    executeAIPrompt: function() {
        const input = document.getElementById('aiInput').value;
        if (!input) return;

        const result = AIEngine.parsePrompt(input);

        // 위험 명령 알림 (FR-2 스펙 반영)
        if (result.isDangerous) {
            alert("⚠️ [위험 명령 경고 / Alert]\n\n입력하신 요청에 시스템 변경/중단 위험 키워드(reload/shutdown 등)가 포함되어 있습니다.\n본 시스템은 조회/점검 전용입니다.");
        }

        document.getElementById('aiConverted').textContent = `Target: ${result.targetDevice} | Cmd: ${result.convertedCommand}`;
        document.getElementById('aiSummary').textContent = result.summary;
        document.getElementById('targetNodeBadge').textContent = result.targetDevice;

        // Mock CLI Terminal 실행 출력
        const cliOutput = document.getElementById('cliOutput');
        const outputText = (MockDeviceDB[result.targetDevice] && MockDeviceDB[result.targetDevice][result.convertedCommand]) 
            ? MockDeviceDB[result.targetDevice][result.convertedCommand] 
            : `\n${result.targetDevice}# ${input}\n% Command executed successfully (Mock Response)`;

        cliOutput.innerHTML += `<p class="text-emerald-400 mt-2">${outputText}</p>`;
        cliOutput.scrollTop = cliOutput.scrollHeight;

        this.addAuditLog("자연어/CLI", result.targetDevice, input, "Success");
    },

    quickPrompt: function(text) {
        document.getElementById('aiInput').value = text;
        this.executeAIPrompt();
    },

    runMonthlyCheck: function() {
        const term = document.getElementById('checkTerminal');
        term.innerHTML = '<p class="text-blue-400">[Start] 2026-09 정기 점검 시뮬레이션을 시작합니다...</p>';
        
        const steps = [
            "[APIC-01] GET https://apic/api/node/class/mgmtMgmtIf.json -> OK (200)",
            "[LEAF-101] SSH Connect (10.10.1.11:22) -> Success",
            "[LEAF-101] Executing 'show interface status' -> Done",
            "[LEAF-102] SSH Connect (10.10.1.12:22) -> Success",
            "[System] 점검 결과 저장 완료: logs/LEAF-101/2026-09-27_CHK.txt"
        ];

        steps.forEach((msg, idx) => {
            setTimeout(() => {
                term.innerHTML += `<p>${msg}</p>`;
                term.scrollTop = term.scrollHeight;
            }, (idx + 1) * 500);
        });

        this.addAuditLog("월간정기점검", "ALL_DEVICES", "2026_Q3_CheckSet", "Success");
    },

    tracePath: function() {
        const src = document.getElementById('srcIp').value;
        const dst = document.getElementById('dstIp').value;
        const res = document.getElementById('ipResult');
        res.classList.remove('hidden');
        res.innerHTML = `
        <p>[Endpoint Tracker] ${src} -> Attached to LEAF-101 (Eth1/10)</p>
        <p>[Endpoint Tracker] ${dst} -> Attached to LEAF-102 (Eth1/12)</p>
        <p>[Ping Test] Sending 5, 100-byte ICMP Echos to ${dst}, timeout is 2 seconds:</p>
        <p class="text-white">!!!!! (5/5 success, rtt min/avg/max = 1/2/4 ms)</p>`;
        
        this.addAuditLog("IP 경로추적", "FABRIC", `${src} -> ${dst}`, "Success");
    },

    addAuditLog: function(type, target, cmd, status) {
        const time = new Date().toLocaleString();
        this.auditLogs.unshift({ time, type, target, cmd, status });
        
        const tbody = document.getElementById('auditTableBody');
        if (tbody) {
            tbody.innerHTML = this.auditLogs.map(log => `
                <tr>
                    <td class="p-3 text-slate-400">${log.time}</td>
                    <td class="p-3"><span class="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">${log.type}</span></td>
                    <td class="p-3 font-semibold">${log.target}</td>
                    <td class="p-3 font-mono text-slate-300">${log.cmd}</td>
                    <td class="p-3 text-emerald-400">${log.status}</td>
                </tr>
            `).join('');
        }
    }
};
