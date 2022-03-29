export default class ExportService {
    constructor(columns, data, gapi) {
        this.columns = columns;
        this.data = data;
        this.gapi = gapi;
        this.spreadsheetId = null;
    }

    export() {
        this.gapi.auth2.getAuthInstance().signIn()
            .then(() => {
                this.createSpreadsheet();
            });
    }

    createSpreadsheet() {
        this.gapi.client.sheets.spreadsheets.create({
            properties: {
                title: 'MVP Data Export'
            }
        }).then((response) => {
            this.spreadsheetId = response.result.spreadsheetId;
            this.writeRows();
            this.openSpreadsheet(response.result.spreadsheetUrl)
        });
    }

    writeRows() {
        console.log(this.data)
        this.data.unshift(this.columns);
        this.gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: this.spreadsheetId,
            range: 'A1:K1',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: this.data
            }
        }).then((response) => {
            var result = response.result;
            console.log(`${result.updates.updatedCells} cells appended.`)
        });
    }

    openSpreadsheet(url) {
        window.open(url, '_blank');
    }
}