/**
 * COMO CONFIGURAR (EVITE ERROS):
 * 
 * O erro "Cannot read properties of null" acontece se você criar o script solto.
 * O script precisa estar "preso" a uma planilha.
 * 
 * PASSO A PASSO CORRETO:
 * 1. Crie uma NOVA Planilha no Google Sheets (digite 'sheets.new' no navegador).
 * 2. Dê um nome para a planilha.
 * 3. Vá no menu: Extensões > Apps Script.
 * 4. Apague qualquer código que estiver lá e cole este código.
 * 5. Salve e execute a função 'setup()' uma vez (dê as permissões necessárias).
 * 6. Clique em Implantar (Deploy) -> Nova Implantação -> Tipo: App da Web.
 * 7. Configure "Quem pode acessar" como "Qualquer pessoa" (Anyone).
 * 8. Copie a URL gerada e coloque no seu arquivo .env.
 */

function setup() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Logs');
    if (!sheet) {
        sheet = ss.insertSheet('Logs');
        sheet.appendRow(['Timestamp', 'Type', 'Format', 'UserAgent']);
    }
}

function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Logs');

        sheet.appendRow([
            new Date(),
            data.type || 'scan',
            data.format || 'unknown',
            data.userAgent || 'unknown'
        ]);

        return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}
