const cron = require('node-cron');

const executor = async (chr)=> {
  for (var i = 0; i <= 10; i++){
    chr.start();
  }
}

var chr = cron.schedule('*/1 * * * * *', ()=> {
  console.log(`We are who we are`);
})

var christo = async ()=> {
  var cron = require('node-cron');
  await executor(chr);
}

await christo();
chr.destroy();