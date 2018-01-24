const nodeExcel = require("excel-export");
const debug = require("debug")("trunk-export");
const fs = require("fs");
const stringify = require("csv-stringify");
const iconv = require("iconv-lite");

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

  async csv({ fileName=new Date().toISOString().slice(0, 10), columns=[], data=[] } = {}) {
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
    await fs.writeFileSync(filePath, dataBuffer);
    return { filePath, fileName, binary: dataBuffer};
  }

}

module.exports = ExportHelper;
