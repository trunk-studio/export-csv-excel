const ExportHelper = require('./../index')
const config = require('config');

let {
  CSV,
  EXCEL,
} = config.EXPORT_PATH

let {ENV} = config;

let constructorParams = {
  CSV,
  EXCEL,
}

let exportHelper = new ExportHelper(constructorParams);

test('export excel', async () => {
  let result = await exportHelper.excel({
    // fileName: '123',
    columns: [
      { caption: '姓名', type: 'string' },
      { caption: '電話', type: 'string', width: 1000, },
      { 
        caption: '身分證',
        type: 'string',
        beforeCellWrite: (row, cellData) => cellData.replace(/.{4}$/, '***')
      }
    ],
    data: [
      ['王小明', '09000000000', 'Y123456789'],
      ['王小明', '09000000000', 'Y2987654321'],
    ]
  });
});