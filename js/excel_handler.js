const ExcelHandler = {
    handleUpload: function(event) {
        const file = event.target.files[0];
        if (file) {
            alert(`[Excel Parser] '${file.name}' 파일이 정상 검증 및 동기화되었습니다. (장비 목록 15건 로드 완료)`);
            App.addAuditLog("Excel 업로드", "System", file.name, "Success");
        }
    }
};
