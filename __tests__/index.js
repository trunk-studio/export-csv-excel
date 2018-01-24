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
      { caption: '字串', type: 'string' },
      { caption: '電話', type: 'string' },
      { 
        caption: '身分證',
        type: 'string',
        beforeCellWrite: (row, cellData) => cellData.replace(/.{4}$/, '***')
      }
    ],
    data: [
      ['王小明', '09000000001', 'Y123456789'],
      ['王小華', '09000000002', 'Y2987654321'],
      ['周咏蒨', '09000000003', 'Y2987654321'],
      ['등원청', '09000000004', 'Y2987654321'],
      ['訂購者', '09000000005', 'Y2987654321'],
      ['안갯길', '09000000006', 'Y2987654321'],
      ['LM•BU•WH', '09000000007', 'Y2987654321'],
      ['香港尖沙咀金马伦道48号中国保险大厦15楼B室', '09000000008', 'Y2987654321'],
    ]
  });
});


test('export csv', async () => {
  let result = await exportHelper.csv({
    // fileName: '123',
    columns: [
      { caption: '字串', type: 'string' },
      { caption: '電話', type: 'string' },
      { 
        caption: '身分證',
        type: 'string',
        beforeCellWrite: (row, cellData) => cellData.replace(/.{4}$/, '***')
      }
    ],
    data: [
      ['王小明', '09000000001', 'Y123456789'],
      ['王小華', '09000000002', 'Y2987654321'],
      ['周咏蒨', '09000000003', 'Y2987654321'],
      ['등원청', '09000000004', 'Y2987654321'],
      ['訂購者', '09000000005', 'Y2987654321'],
      ['안갯길', '09000000006', 'Y2987654321'],
      ['LM•BU•WH', '09000000007', 'Y2987654321'],
      ['香港尖沙咀金马伦道48号中国保险大厦15楼B室', '09000000008', 'Y2987654321'],
    ]
  });
});

test("export csv no columns", async () => {
  let result = await exportHelper.csv({
    fileName: 'no_columns',
    data: [
      ["王小明", "09000000001", "Y123456789"],
      ["王小華", "09000000002", "Y2987654321"],
      ["周咏蒨", "09000000003", "Y2987654321"],
      ["등원청", "09000000004", "Y2987654321"],
      ["訂購者", "09000000005", "Y2987654321"],
      ["안갯길", "09000000006", "Y2987654321"],
      ["LM•BU•WH", "09000000007", "Y2987654321"],
      ["香港尖沙咀金马伦道48号中国保险大厦15楼B室", "09000000008", "Y2987654321"]
    ]
  });
});
