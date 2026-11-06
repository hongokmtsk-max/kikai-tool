// ===== ISO 286-1:2010 / JIS B 0401-1:2016 — 0 < D ≤ 500 mm =====
const RANGES=[3,6,10,18,30,50,80,120,180,250,315,400,500];
const IT={1:[0.8,1,1,1.2,1.5,1.5,2,2.5,3.5,4.5,6,7,8],2:[1.2,1.5,1.5,2,2.5,2.5,3,4,5,7,8,9,10],3:[2,2.5,2.5,3,4,4,5,6,8,10,12,13,15],4:[3,4,4,5,6,7,8,10,12,14,16,18,20],5:[4,5,6,8,9,11,13,15,18,20,23,25,27],6:[6,8,9,11,13,16,19,22,25,29,32,36,40],7:[10,12,15,18,21,25,30,35,40,46,52,57,63],8:[14,18,22,27,33,39,46,54,63,72,81,89,97],9:[25,30,36,43,52,62,74,87,100,115,130,140,155],10:[40,48,58,70,84,100,120,140,160,185,210,230,250],11:[60,75,90,110,130,160,190,220,250,290,320,360,400],12:[100,120,150,180,210,250,300,350,400,460,520,570,630],13:[140,180,220,270,330,390,460,540,630,720,810,890,970],14:[250,300,360,430,520,620,740,870,1000,1150,1300,1400,1550],15:[400,480,580,700,840,1000,1200,1400,1600,1850,2100,2300,2500],16:[600,750,900,1100,1300,1600,1900,2200,2500,2900,3200,3600,4000]};
// shaft fundamental deviations (µm) per main range
const SH={d:[-20,-30,-40,-50,-65,-80,-100,-120,-145,-170,-190,-210,-230],e:[-14,-20,-25,-32,-40,-50,-60,-72,-85,-100,-110,-125,-135],f:[-6,-10,-13,-16,-20,-25,-30,-36,-43,-50,-56,-62,-68],g:[-2,-4,-5,-6,-7,-9,-10,-12,-14,-15,-17,-18,-20],h:[0,0,0,0,0,0,0,0,0,0,0,0,0],k:[0,1,1,1,2,2,2,3,3,4,4,4,5],m:[2,4,6,7,8,9,11,13,15,17,20,21,23],n:[4,8,10,12,15,17,20,23,27,31,34,37,40],p:[6,12,15,18,22,26,32,37,43,50,56,62,68]};
// r, s: sub-ranges above 50 mm
const SUB=[[3,6,10,18,30,50,65,80,100,120,140,160,180,200,225,250,280,315,355,400,450,500]];
const RS={r:[10,15,19,23,28,34,41,43,51,54,63,65,68,77,80,84,94,98,108,114,126,132],s:[14,19,23,28,35,43,53,59,71,79,92,100,108,122,130,140,158,170,190,208,232,252]};
const SUBR=SUB[0];
function idx(arr,D){for(let i=0;i<arr.length;i++){if(D<=arr[i])return i;}return -1;}
function rangeOf(D){const i=idx(RANGES,D);return i<0?null:{i,lo:i?RANGES[i-1]:0,hi:RANGES[i]};}
function itv(g,D){const r=rangeOf(D);return IT[g][r.i];}
function shaftEi(L,D){const j=idx(SUBR,D);return RS[L][j];}
// returns {upper, lower} in µm, or {error}
function shaft(L,g,D){
  const r=rangeOf(D); if(!r) return {error:'寸法は 0 < D ≤ 500 mm の範囲で入力してください'};
  if(!IT[g]) return {error:'等級が範囲外です'};
  const t=IT[g][r.i];
  if(L==='js') return {upper:t/2,lower:-t/2,it:t};
  if('defgh'.includes(L)&&L.length===1){const es=SH[L][r.i];return {upper:es,lower:es-t,it:t};}
  let ei;
  if(L==='k'){ei=(g>=4&&g<=7)?SH.k[r.i]:0; if(D<=3) ei=0;}
  else if(L==='m'||L==='n'||L==='p') ei=SH[L][r.i];
  else if(L==='r'||L==='s') ei=shaftEi(L,D);
  else return {error:'未対応の公差域'};
  return {upper:ei+t,lower:ei,it:t};
}
function delta(g,D){ if(D<=3||g<2||g>8) return 0; return itv(g,D)-itv(g-1,D);} // Δ = ITn − IT(n−1)
function hole(L,g,D){
  const r=rangeOf(D); if(!r) return {error:'寸法は 0 < D ≤ 500 mm の範囲で入力してください'};
  if(!IT[g]) return {error:'等級が範囲外です'};
  const t=IT[g][r.i];
  if(L==='JS') return {upper:t/2,lower:-t/2,it:t};
  const l=L.toLowerCase();
  if('DEFGH'.includes(L)){const EI=-SH[l][r.i];return {upper:EI+t,lower:EI,it:t};}
  let ES;
  if(L==='K'){ if(g>8) return {error:'K は IT8 以下のみ対応（IT8超は規格上の扱いが異なるため）'};
    ES = D<=3?0:-SH.k[r.i]+delta(g,D);}
  else if(L==='M'){ if(g>8) return {error:'M は IT8 以下のみ対応'};
    ES = D<=3?-2:-SH.m[r.i]+delta(g,D);
    if(g===6&&D>250&&D<=315) ES=-9; // ISO 286-1 特例
  }
  else if(L==='N'){ ES = D<=3?-4:(g<=8?-SH.n[r.i]+delta(g,D):0);}
  else if('PRS'.includes(L)){ const ei = L==='P'?SH.p[r.i]:shaftEi(l,D); ES = -ei + (g<=7?delta(g,D):0);}
  else return {error:'未対応の公差域'};
  return {upper:ES,lower:ES-t,it:t};
}
function fit(D,H,S){
  const maxC=H.upper-S.lower, minC=H.lower-S.upper;
  let type = minC>=0?'clearance':(maxC<=0?'interference':'transition');
  return {maxC,minC,type};
}
if(typeof module!=='undefined') module.exports={shaft,hole,fit,rangeOf,RANGES};
