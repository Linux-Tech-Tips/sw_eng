//script to extract a list of words from sample man pages

const fs = require('fs');
const tp = require('/Users/elisabeth/Desktop/Year2/SWE/SWE/sw_eng/backend/textProcessing.js');

let dirName = '/Users/elisabeth/Desktop/Year2/SWE/SWE/sw_eng/backend/vocabularyProcessing/htmlPages';
let file = [];
let words = "";
//let output = dirName + '/processedPages.txt';
//fs.writeFileSync(output, "");

file[0] = fs.readFileSync(dirName + '/IFE.8.html');
file[1] = fs.readFileSync(dirName + '/abidb.1.html');
file[2] = fs.readFileSync(dirName + '/abipkgdiff.1.html');
file[3] = fs.readFileSync(dirName + '/access.2.html');
file[4] = fs.readFileSync(dirName + '/aio.h.0p.html');
file[5] = fs.readFileSync(dirName + '/arp.7.html');
file[6] = fs.readFileSync(dirName + '/batch.1p.html');
file[7] = fs.readFileSync(dirName + '/blkmapd.8.html');
file[8] = fs.readFileSync(dirName + '/border.3x.html');
file[9] = fs.readFileSync(dirName + '/btrfs-rescue.8.html');
file[10] = fs.readFileSync(dirName + '/cacoshl.3p.html');
file[11] = fs.readFileSync(dirName + '/cancel.1.html');
file[12] = fs.readFileSync(dirName + '/cat.1.html');
file[13] = fs.readFileSync(dirName + '/clock_getres.3p.html');
file[14] = fs.readFileSync(dirName + '/cryptsetup-luksformat.8.html');
file[15] = fs.readFileSync(dirName + '/deb-origin.5.html');
file[16] = fs.readFileSync(dirName + '/des_crypt.3.html');
file[17] = fs.readFileSync(dirName + '/dirname.1.html');
file[18] = fs.readFileSync(dirName + '/dracut-catimages.8.html');
file[19] = fs.readFileSync(dirName + '/echo.1.html');
file[20] = fs.readFileSync(dirName + '/endprotoent.3p.html');
file[21] = fs.readFileSync(dirName + '/error--fault.7stap.html');
file[22] = fs.readFileSync(dirName + '/exportfs.8.html');
file[23] = fs.readFileSync(dirName + '/factor.1.html');
file[24] = fs.readFileSync(dirName + '/fchmod.2.html');
file[25] = fs.readFileSync(dirName + '/fdisk.8.html');
file[26] = fs.readFileSync(dirName + '/fwide.3.html');
file[27] = fs.readFileSync(dirName + '/gcc.1.html');
file[28] = fs.readFileSync(dirName + '/get_default_role.3.html');
file[29] = fs.readFileSync(dirName + '/getconf.1p.html');
file[30] = fs.readFileSync(dirName + '/git-push.1.html');
file[31] = fs.readFileSync(dirName + '/has_mouse.3x.html');
file[32] = fs.readFileSync(dirName + '/hash.3.html');
file[33] = fs.readFileSync(dirName + '/hypot.3.html');
file[34] = fs.readFileSync(dirName + '/intro.1.html');
file[35] = fs.readFileSync(dirName + '/intro.5.html');
file[36] = fs.readFileSync(dirName + '/isless.3.html');
file[37] = fs.readFileSync(dirName + '/journal-remote.conf.5.html');
file[38] = fs.readFileSync(dirName + '/kill.1p.html');
file[39] = fs.readFileSync(dirName + '/ldap_count_messages.3.html');
file[40] = fs.readFileSync(dirName + '/mailaddr.7.html');
file[41] = fs.readFileSync(dirName + '/motd.5.html');
file[42] = fs.readFileSync(dirName + '/nftw.3.html');
file[43] = fs.readFileSync(dirName + '/org.freedesktop.logcontrol1.5.html');
file[45] = fs.readFileSync(dirName + '/pkey_free.2.html');
file[46] = fs.readFileSync(dirName + '/printf_function.3head.html');
file[47] = fs.readFileSync(dirName + '/qmcgroup.3.html');
file[48] = fs.readFileSync(dirName + '/rm.1.html');
file[49] = fs.readFileSync(dirName + '/sd_bus_error_no_memory.3.html');
file[50] = fs.readFileSync(dirName + '/strlcpy.7.html');
file[51] = fs.readFileSync(dirName + '/table.5.html');
file[52] = fs.readFileSync(dirName + '/tar.1.html');
file[53] = fs.readFileSync(dirName + '/tty.1.html');
file[54] = fs.readFileSync(dirName + '/umad_alloc.3.html');
file[55] = fs.readFileSync(dirName + '/vcs.4.html');
file[56] = fs.readFileSync(dirName + '/vgimport.8.html');
file[57] = fs.readFileSync(dirName + '/wait.3p.html');
file[58] = fs.readFileSync(dirName + '/watch.1.html');
file[59] = fs.readFileSync(dirName + '/windres.1.html');
file[60] = fs.readFileSync(dirName + '/xdr_reference.3.html');
file[61] = fs.readFileSync(dirName + '/xminicom.1.html');
file[62] = fs.readFileSync(dirName + '/ynf.3.html');
file[63] = fs.readFileSync(dirName + '/zdump.8.html');
file[64] = fs.readFileSync(dirName + '/zos-remote.conf.5.html');
file[65] = fs.readFileSync(dirName + '/LinkedHashMap.html');
file[66] = fs.readFileSync(dirName + '/Spliterators.AbstractLongSpliterator.html');
file[67] = fs.readFileSync(dirName + '/ArrayList.html');
file[68] = fs.readFileSync(dirName + '/variables.html'); 
file[69] = fs.readFileSync(dirName + '/if.html');  
file[70] = fs.readFileSync(dirName + '/for.html');
file[71] = fs.readFileSync(dirName + '/wiki.html');
file[72] = fs.readFileSync(dirName + '/Public_class_fields.html');
file[73] = fs.readFileSync(dirName + '/Event_loop.html');
file[74] = fs.readFileSync(dirName + '/API.html');
file[75] = fs.readFileSync(dirName + '/programming.html');
file[76] = fs.readFileSync(dirName + '/llm.html');
file[77] = fs.readFileSync(dirName + '/Creating_the_content.html');
file[78] = fs.readFileSync(dirName + '/HTML.html');
file[79] = fs.readFileSync(dirName + '/memory.html');

for(i in file) {
  words+=tp.stripText(tp.htmlToText(file[i])[1]);
}
words = words.split(' ');

//console.log(words);
let vectors = {};
let glove = fs.readFileSync('glove.txt');
glove = JSON.parse(glove);
for(i in words) {
  if(glove[words[i]]!=undefined) {
    vectors[words[i]] = glove[words[i]] 
  }
}
//console.log(Reflect.ownKeys(vectors).length);
//console.log(vectors);
fs.writeFileSync("technicalVectors.txt", JSON.stringify(vectors));
