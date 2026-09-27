const App = {
    auditLogs: [],

    // 명령어 그룹 정의
    cmdGroups: {
        switch_std: ["show interface status", "show ip route", "show bgp summary"],
        apic_std: ["show health", "show faults"],
        custom: ["show interface status", "show system status"]
    },

    init: function() {
        this.onCmdGroupChange();
    },

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
        ['dashboard', 'check', 'ai-cmd', 'ip-path', 'audit-log'].forEach(id => {
            const el = document.getElementById(`tab-${id}`);
            const nav = document.getElementById(`nav-${id}`);
            if(el) el.classList.add('hidden');
            if(nav) nav.classList.remove('sidebar-item-active');
        });
        document.getElementById(`tab-${tabId}`).classList.remove('hidden');
        document.getElementById(`nav-${tabId}`).classList.add('sidebar-item-active');
    },

    // 점검 명령어 그룹 변경 시 프리뷰 업데이트
    onCmdGroupChange: function() {
        const selectedGroup = document.getElementById('checkCmdGroup').value;
        const cmds = this.cmdGroups[selectedGroup] || [];
        const preview = document.getElementById('cmdListPreview');
        preview.innerHTML = cmds.map(c => `<div>• ${c}</div>`).join('');
    },

    // 정기 점검 실행 (선택한 장비 + 선택한 명령어 그룹)
    runMonthlyCheck: function() {
        const selectedDevices = Array.from(document.querySelectorAll('.check-device:checked')).map(cb => cb.value);
        const selectedGroup = document.getElementById('checkCmdGroup').value;
        const cmds = this.cmdGroups[selectedGroup];

        if (selectedDevices.length === 0) {
            alert("점검할 장비를 최소 1개 이상 선택해주세요.");
            return;
        }

        const term = document.getElementById('checkTerminal');
        term.innerHTML = `<p class="text-blue-400">[Start] 선택한 장비(${selectedDevices.join(', ')}) 대상 점검을 시작합니다...</p>`;

        let delay = 0;
        selectedDevices.forEach(dev => {
            cmds.forEach(cmd => {
                delay += 400;
                setTimeout(() => {
                    term.innerHTML += `<p>[${dev}] Executing '${cmd}' -> Complete OK</p>`;
                    term.scrollTop = term.scrollHeight;
                }, delay);
            });
        });

        setTimeout(() => {
            term.innerHTML += `<p class="text-emerald-400 mt-2">[Complete] 모든 선택 항목 점검 완료 및 결과 저장을 완료했습니다.</p>`;
            term.scrollTop = term.scrollHeight;
        }, delay + 300);

        this.addAuditLog("월간정기점검", selectedDevices.join(','), `Group: ${selectedGroup}`, "Success");
    },

    executeAIPrompt: function() {
        const input = document.getElementById('aiInput').value;
        if (!input) return;

        const result = AIEngine.parsePrompt(input);

        document.getElementById('aiConverted').textContent = `Target: ${result.targetDevice} | Cmd: ${result.convertedCommand}`;
        document.getElementById('aiSummary').textContent = result.summary;
        document.getElementById('targetNodeBadge').textContent = result.targetDevice;

        const cliOutput = document.getElementById('cliOutput');
        const outputText = (MockDeviceDB[result.targetDevice] && MockDeviceDB[result.targetDevice][result.convertedCommand]) 
            ? MockDeviceDB[result.targetDevice][result.convertedCommand] 
            : `\n${result.targetDevice}# ${input}\n% Command executed successfully`;

        cliOutput.innerHTML += `<p class="text-emerald-400 mt-2">${outputText}</p>`;
        cliOutput.scrollTop = cliOutput.scrollHeight;

        this.addAuditLog("자연어/CLI", result.targetDevice, input, "Success");
    },

    quickPrompt: function(text) {
        document.getElementById('aiInput').value = text;
        this.executeAIPrompt();
    },

    // 라우팅 경로 / GW -> EP Ping 진단 로직
    tracePath: function() {
        const src = document.getElementById('srcIp').value;
        const dst = document.getElementById('dstIp').value;
        const res = document.getElementById('ipResult');
        res.classList.remove('hidden');

        res.innerHTML = `
            <div class="text-slate-400 border-b border-slate-800 pb-2">
                <i class="fa-solid fa-network-wired text-blue-400 mr-1"></i> [1단계] 연결 스위치 라우팅 테이블(Routing Table) 검증
            </div>
            <div class="text-slate-300 pl-3">
                <p>• LEAF-101 (Source Leaf): <span class="text-emerald-400">10.20.1.0/24 (Direct/VLAN101) 정상 등록됨</span></p>
                <p>• LEAF-102 (Dest Leaf): <span class="text-emerald-400">10.20.2.0/24 (Direct/VLAN102) 정상 등록됨</span></p>
                <p>• Spine Transit Fabric: <span class="text-emerald-400">OSPF/BGP Fabric Route Active</span></p>
            </div>

            <div class="text-slate-400 border-b border-slate-800 pb-2 pt-2">
                <i class="fa-solid fa-bolt text-amber-400 mr-1"></i> [2단계] Gateway(10.20.1.1) → Endpoint(${dst}) ICMP Ping 테스트
            </div>
            <div class="text-emerald-400 pl-3">
                <p>Sending 5, 100-byte ICMP Echos to ${dst}, timeout is 2 seconds:</p>
                <p class="font-bold text-white mt-1">!!!!! (5/5 packets received, 0% loss, rtt min/avg/max = 0.8/1.2/2.1 ms)</p>
                <p class="text-xs text-slate-400 mt-1">결과: 스위치 라우팅 인프라 및 Gateway-Endpoint 간 통신 상태가 최적입니다.</p>
            </div>
        `;

        this.addAuditLog("IP 경로/Ping", "Fabric Gateway", `${src} -> ${dst}`, "Success");
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
                    <td class="p-3 font-semibold text-slate-200">${log.target}</td>
                    <td class="p-3 font-mono text-slate-300">${log.cmd}</td>
                    <td class="p-3 text-emerald-400">${log.status}</td>
                </tr>
            `).join('');
        }
    }
};

// 페이지 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => App.init());
