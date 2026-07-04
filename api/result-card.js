const path = require("node:path");
const {Resvg} = require("@resvg/resvg-js");
const QRCode = require("qrcode");

const TYPE_DATA = [
  {key:"A", name:"關係力", coach:"關係教練", color:"#FF6F91"},
  {key:"B", name:"工具力", coach:"工具教練", color:"#4ECDC4"},
  {key:"C", name:"零售力", coach:"零售教練", color:"#FFB347"},
  {key:"D", name:"招募力", coach:"招募教練", color:"#A685E2"},
  {key:"E", name:"自媒體力", coach:"自媒體/IP教練", color:"#5B9BD5"}
];
const STRENGTHS = {
  A:"你能創造安全感，讓人願意說出真正的需要。",
  B:"你能把複雜變簡單，幫助夥伴清楚採取下一步。",
  C:"你能以真實體驗建立信任，將產品價值說得具體。",
  D:"你能點燃希望與行動，陪人勇敢跨出舒適圈。",
  E:"你能把價值說成有共鳴的故事，讓更多人看見。"
};
const DEVELOPMENT = {
  A:"練習先傾聽與復述感受，再提出你的建議。",
  B:"把一項常見任務整理成三步驟，並帶一位夥伴完成。",
  C:"每週深入一項產品，記錄使用情境與真實體驗。",
  D:"每週完成兩次低壓邀約演練，以提問代替說服。",
  E:"每週固定發布一則真實、清楚且只有一個重點的內容。"
};
const LIFF_URL = "https://liff.line.me/2010602059-PZay1fzR";

function escapeXml(value){
  return String(value).replace(/[<>&"']/g, char=>({"<":"&lt;",">":"&gt;","&":"&amp;","\"":"&quot;","'":"&apos;"}[char]));
}

function wrapText(text, maxChars){
  const chars = [...String(text)];
  const lines = [];
  while(chars.length) lines.push(chars.splice(0,maxChars).join(""));
  return lines;
}

function point(index, factor, cx=540, cy=570, radius=245){
  const angle = (-90 + index * 72) * Math.PI / 180;
  return [cx + Math.cos(angle)*radius*factor, cy + Math.sin(angle)*radius*factor];
}

function textLines(lines, x, y, options={}){
  const {size=32, fill="#4A3B78", weight=400, lineHeight=1.45, anchor="start"} = options;
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${fill}" font-size="${size}" font-weight="${weight}">${lines.map((line,index)=>`<tspan x="${x}" dy="${index===0?0:size*lineHeight}">${escapeXml(line)}</tspan>`).join("")}</text>`;
}

module.exports = async function handler(req,res){
  try {
    if(!["GET","HEAD"].includes(req.method)) return res.status(405).json({error:"Method not allowed"});
    const name = String(req.query.name || "我的").trim().slice(0,30) || "我的";
    const scores = String(req.query.scores || "").split(",").map(Number);
    if(scores.length !== 5 || scores.some(score=>!Number.isInteger(score) || score<0 || score>20) || scores.reduce((a,b)=>a+b,0)!==20){
      return res.status(400).json({error:"Invalid scores"});
    }

    const topScore = Math.max(...scores);
    const primaryIndexes = scores.map((score,index)=>score===topScore?index:-1).filter(index=>index>=0);
    const primaryLabel = primaryIndexes.map(index=>TYPE_DATA[index].coach).join(" × ");
    const candidates = scores.map((score,index)=>({score,index})).filter(item=>!primaryIndexes.includes(item.index));
    const minScore = candidates.length ? Math.min(...candidates.map(item=>item.score)) : null;
    const developmentIndex = minScore === null ? null : candidates.find(item=>item.score===minScore).index;
    const strengthText = primaryIndexes.length <= 2
      ? primaryIndexes.map(index=>STRENGTHS[TYPE_DATA[index].key]).join(" ")
      : "你的五力分布多元，能依不同情境切換合適的教練角色。";
    const developmentText = developmentIndex === null
      ? "你的五力相當均衡，可以依團隊需要選擇一項深入發展。"
      : DEVELOPMENT[TYPE_DATA[developmentIndex].key];
    const maxScore = Math.max(...scores,1);
    const grid = [1,2,3,4,5].map(level=>{
      const points = TYPE_DATA.map((_,i)=>point(i,level/5).join(",")).join(" ");
      return `<polygon points="${points}" fill="${level%2?"#fbf8ff":"#f7fbfa"}" stroke="#DDD5EA" stroke-width="2"/>`;
    }).join("");
    const axes = TYPE_DATA.map((_,i)=>{
      const [x,y]=point(i,1);
      return `<line x1="540" y1="570" x2="${x}" y2="${y}" stroke="#E4DDEB" stroke-width="2"/>`;
    }).join("");
    const dataPoints = scores.map((score,i)=>point(i,score/maxScore));
    const radar = `<polygon points="${dataPoints.map(p=>p.join(",")).join(" ")}" fill="#5B2C8230" stroke="#5B2C82" stroke-width="7" stroke-linejoin="round"/>`+
      dataPoints.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="11" fill="${TYPE_DATA[i].color}" stroke="#FFF" stroke-width="5"/>`).join("");
    const labels = TYPE_DATA.map((type,i)=>{
      const [x,y]=point(i,1.28);
      const anchor=x<500?"end":x>580?"start":"middle";
      return textLines([`${type.name} ${scores[i]}`],x,y,{size:27,fill:"#4A3B78",weight:700,anchor});
    }).join("");
    const qrDataUrl = await QRCode.toDataURL(LIFF_URL,{width:180,margin:1,color:{dark:"#5B2C82",light:"#FFFFFF"}});
    const qrBase64 = qrDataUrl.split(",")[1];
    const strengthLines = wrapText(strengthText,24).slice(0,3);
    const developmentLines = wrapText(developmentText,24).slice(0,3);

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#FFF7EC"/><stop offset="1" stop-color="#F3EEFF"/></linearGradient>
        <linearGradient id="title" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#5B2C82"/><stop offset="1" stop-color="#FF6F91"/></linearGradient>
        <style>text{font-family:'Noto Sans CJK TC',sans-serif}</style>
      </defs>
      <rect width="1080" height="1350" fill="url(#bg)"/>
      <rect x="46" y="42" width="988" height="1266" rx="52" fill="#FFFFFF" opacity="0.96"/>
      <text x="540" y="112" text-anchor="middle" fill="#7E7398" font-size="26" font-weight="700">五力陪跑系統｜教練天賦分析</text>
      ${textLines([`${name} 的五力雷達圖`],540,175,{size:48,fill:"#5B2C82",weight:700,anchor:"middle"})}
      <rect x="220" y="205" width="640" height="68" rx="34" fill="url(#title)"/>
      ${textLines([primaryLabel],540,250,{size:31,fill:"#FFFFFF",weight:700,anchor:"middle"})}
      ${grid}${axes}${radar}${labels}
      <rect x="92" y="875" width="896" height="158" rx="28" fill="#FFF7EC"/>
      <text x="128" y="924" fill="#FF6F91" font-size="29" font-weight="700">你的自然優勢</text>
      ${textLines(strengthLines,128,971,{size:27,fill:"#4A3B78",lineHeight:1.45})}
      <rect x="92" y="1057" width="896" height="154" rx="28" fill="#F0FBF8"/>
      <text x="128" y="1106" fill="#3CA99A" font-size="29" font-weight="700">下一步發展</text>
      ${textLines(developmentLines,128,1153,{size:27,fill:"#4A3B78",lineHeight:1.45})}
      <image href="data:image/png;base64,${qrBase64}" x="824" y="1130" width="132" height="132"/>
      <text x="92" y="1264" fill="#8F85A4" font-size="20">此圖呈現個人相對傾向，不代表能力高低</text>
      <text x="92" y="1294" fill="#8F85A4" font-size="20">掃描 QR Code，找到你的教練天賦</text>
    </svg>`;

    const fontPath = path.join(process.cwd(),"assets","fonts","NotoSansCJKtc-Regular.otf");
    const renderer = new Resvg(svg,{
      fitTo:{mode:"width",value:1080},
      font:{fontFiles:[fontPath],loadSystemFonts:false,defaultFontFamily:"Noto Sans CJK TC"}
    });
    const png = renderer.render().asPng();
    res.setHeader("Content-Type","image/png");
    res.setHeader("Content-Disposition",`inline; filename*=UTF-8''${encodeURIComponent(`${name}-五力教練天賦.png`)}`);
    res.setHeader("Cache-Control","public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800");
    res.setHeader("Access-Control-Allow-Origin","*");
    if(req.method === "HEAD") return res.status(200).end();
    return res.status(200).send(png);
  } catch(error){
    console.error(error);
    return res.status(500).json({error:"Unable to generate result card"});
  }
};
