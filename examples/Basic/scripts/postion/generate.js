/*eslint-disable*/
const fs = require('fs');
var pinyin = require("pinyin");  // https://github.com/hotoo/pinyin

var arguments = process.argv.splice(2);
var filePath = './position.csv';
if(arguments.length > 0){
  filePath = arguments[0];
}

console.log('arguments: ', arguments);
var fb = fs.readFileSync(filePath);
var array = fb.toString().split('\n');
console.log('array length', array.length);

// 排序
// array = array.sort(pinyin.compare);
// console.log(array)


var formatPY = function (arr){
   var arrResult = [""]; // 默认有一个元素，方便拼接

   // 遍历拼音数组，考虑多音字情况
   for(var i = 0; i < arr.length; i++){
     var item = arr[i];
     var itemLen = item.length;

     if(itemLen == 1){ //如果是单拼音，拼接到arrResult 每一个元素末尾
      for(var j = 0; j < arrResult.length; j++){
        arrResult[j] += item;
      }
     }else{ // 是多音字情况， 遍历多音字，拼接拼音到arrResult 每一个元素后面
       var arrTemp = arrResult.slice(0); // 复制结果
       arrResult = [];
       for(var k = 0; k < itemLen; k++){ // 遍历多音字
         var temp = arrTemp.slice(0);
         for(var o = 0; o < temp.length; o++){ // 添加元素到结果元素末尾
            temp[o] += item[k];
         }
         arrResult = arrResult.concat(temp)
       }
     }
   }
   return arrResult;
};

var data = [];
for(var k of array){
  var postion = k.split(',');
  var id = postion[0];
  var item = postion[1] && postion[1].replace('\n','\r').replace(/\r/g,'');
  var py = pinyin(item, {
    heteronym: true,
    segment: true,
    style: pinyin.STYLE_NORMAL
  });

  var firstPY = pinyin(item, {
    heteronym: true,
    segment: true,
    style: pinyin.STYLE_FIRST_LETTER
  });

  data.push({
    id: id,
    name: item,
    PY: formatPY(py),
    firstPY: formatPY(firstPY)
  });
}
fs.writeFileSync('./postionData.js', JSON.stringify(data));
console.log(data)
console.log('\n=======================================\n')

// 生成 AtoZ list
var atoz = {};
for(var k of array){
  var postion = k.split(',');
  var id = postion[0];
  var item = postion[1] && postion[1].replace('\n','\r').replace(/\r/g,'');
  var data = {'id': id, 'name': item};
  var py = pinyin(item, {
    heteronym: true,
    segment: true,
    style: pinyin.STYLE_FIRST_LETTER
  });
  py = formatPY(py);
  if(py.length <= 0){
    atoz['$'] ? atoz['$'].push(data) : atoz['$'] = [data];
    continue;
  }

  try{
    var k = py[0][0].toUpperCase();
    atoz[k] ? atoz[k].push(data) : atoz[k] = [data];
  }catch(e){
    console.info(e)
  }

}
fs.writeFileSync('./atozData.js', JSON.stringify(atoz));
console.log(atoz)
