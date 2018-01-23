// import fs from "fs";
const nodeExcel = require("excel-export");
const debug = require("debug")("trunk-export");
const fs = require("fs");

class ExportHelper {
  constructor(config) {
    console.log("config", config);
    this.ENV = config.ENV;
    this.EXPORT_CSV_PATH = config.CSV.slice(-1) === '/' ? config.CSV : `${config.CSV}/`;
    this.EXPORT_EXCEL_PATH = config.EXCEL.slice(-1) === '/' ? config.EXCEL : `${config.EXCEL}/`;
  }
  async excel({ fileName=new Date().toISOString().slice(0, 10), columns=[], data=[] } = {}) {
    if (!this.EXPORT_EXCEL_PATH) throw Error('EXCEL not set');

    const excelResult = nodeExcel.execute({
      cols: columns,
      rows: data,
    });
    
    fileName = fileName.indexOf('xlsx') < 0 ? `${fileName}.xlsx` : fileName;
    const filePath = `${this.EXPORT_EXCEL_PATH}${fileName}`;
    await fs.writeFileSync(filePath, excelResult, 'binary');
    let dataBuffer = new Buffer(excelResult, "binary");
    return { filePath, fileName, binary: dataBuffer};
  }
}

module.exports = ExportHelper;
