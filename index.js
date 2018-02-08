const nodeExcel = require("excel-export");
const debug = require("debug")("trunk-export");
const fs = require("fs-extra");
const stringify = require("csv-stringify");
const iconv = require("iconv-lite");
const parseExcel = require('node-xlsx');


class ExportHelper {
  constructor({ ENV='', CSV=__dirname, EXCEL=__dirname, PARSE_EXCEL } = {}) {
    console.log("config", { CSV, EXCEL });
    this.ENV = ENV;
    this.EXPORT_CSV_PATH = CSV.slice(-1) === '/' ? CSV : `${CSV}/`;
    if (!fs.existsSync(this.EXPORT_CSV_PATH)) {
      fs.ensureDirSync(this.EXPORT_CSV_PATH);
    }
    
    this.EXPORT_EXCEL_PATH = EXCEL.slice(-1) === '/' ? EXCEL : `${EXCEL}/`;
    if (!fs.existsSync(this.EXPORT_EXCEL_PATH)) {
      fs.ensureDirSync(this.EXPORT_EXCEL_PATH);
    }

  }

  async excel({ fileName=new Date().toISOString().slice(0, 10), columns=[], data=[], save=true } = {}) {
    if (!this.EXPORT_EXCEL_PATH) throw Error('EXCEL not set');

    const excelResult = nodeExcel.execute({
      cols: columns,
      rows: data,
    });

    fileName = fileName.indexOf('xlsx') < 0 ? `${fileName}.xlsx` : fileName;
    const filePath = `${this.EXPORT_EXCEL_PATH}${fileName}`;
    if (save) {
      await fs.writeFileSync(filePath, excelResult, 'binary');
    }
    let dataBuffer = new Buffer(excelResult, "binary");
    return { ...save ? {filePath, fileName} : {}, binary: dataBuffer};
  }

  async parse({ filePath, sheetIndex = 0, startIndex = 0 } = {}) {
    if (!filePath) throw Error('filePath not set');
    const buffer = fs.readFileSync(filePath);
    let workSheets = parseExcel.parse(buffer);
    workSheets = workSheets[sheetIndex].data;
    return workSheets;
  } 

  async csv({ fileName=new Date().toISOString().slice(0, 10), columns=[], data=[], save=true } = {}) {
    if (!this.EXPORT_CSV_PATH) throw Error('CSV not set');

    let dataString = await new Promise((defer, reject) => {
      let header = true;
      if (columns.length > 0) {
        data = data.map((row, i) => {
          return row.map((item, j) => {
            if (columns[j].beforeCellWrite) {
              return columns[j].beforeCellWrite(j, item);
            } else {
              return item;
            }
          });
        });
        columns = columns.map(data => data.caption);
      } else {
        header = false;
      }
      console.log(data);
      stringify(data, { header, ...header ? { columns } : {} }, function(err, output){
        if (err) reject(err);
        defer(output);
      });
    });
    dataString = "\uFEFF" + dataString
    const encoding = 'utf-8';
    let dataBuffer = new Buffer(dataString);
    dataBuffer = iconv.encode(dataBuffer, encoding);
    fileName = fileName.indexOf('csv') < 0 ? `${fileName}.csv` : fileName;
    const filePath = `${this.EXPORT_CSV_PATH}${fileName}`;
    if (save) {
      await fs.writeFileSync(filePath, dataBuffer);
    }
    return { ...save ? {filePath, fileName} : {}, binary: dataBuffer};
  }

}

module.exports = ExportHelper;
