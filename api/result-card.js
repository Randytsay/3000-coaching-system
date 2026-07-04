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
const SINGLE_ANALYSES = {
  A:"你的天賦，是讓人安心。你可能不是團隊裡最會演講的人，也不是最會成交的人，但你很容易讓人願意敞開心房。當新人遇到挫折時，你的陪伴和傾聽，往往比答案更有力量。",
  B:"你的天賦，是把複雜變簡單。你擅長整理流程、解決問題，讓別人更快上手。團隊因為有你，很多事情都變得更有效率。",
  C:"你的天賦，是用真實經驗創造信任。你喜歡分享產品帶來的改變，也願意用心經營顧客關係。你的影響力，來自每一個真誠的見證與服務。",
  D:"你的天賦，是點燃希望。你擅長建立信任，也善於把機會分享得自然真誠。你不是在說服別人，而是在幫助別人看見更多可能。",
  E:"你的天賦，是讓價值被更多人看見。你對內容創作、說故事、經營個人品牌充滿興趣，也樂於嘗試新的表達方式。你不只是分享，而是在幫助團隊被更多人認識。"
};
const DUAL_ANALYSES = {
  AB:"組合優勢｜你既能讓人安心，也能把複雜的事情拆解清楚；別人不只願意相信你，也知道下一步怎麼做。\n最適合｜新人啟動、一對一陪跑與流程教學，先理解卡點，再給出剛剛好的工具。\n留意｜不要太快替對方解決一切；保留空間讓他自己練習，才能真正建立能力。",
  AC:"組合優勢｜你擅長以關心建立信任，再用真實的產品經驗回應需求，讓分享自然、不像推銷。\n最適合｜顧客關係經營、產品體驗追蹤與生活型健康陪伴，把一次購買發展成長期信任。\n留意｜別因為怕造成壓力而只陪伴、不提出清楚建議；溫柔也可以很有方向。",
  AD:"組合優勢｜你能先接住一個人的不安，再幫他看見可能性並鼓起勇氣行動，是兼具溫度與推進力的教練。\n最適合｜陪伴猶豫中的新人、邀約前演練與低潮重啟，讓對方感到被理解又願意跨出一步。\n留意｜分清楚鼓勵與施壓；用提問確認那一步是對方真正想走的，而不是替他決定。",
  AE:"組合優勢｜你能聽見人的真實故事，也懂得把其中的價值轉化成有共鳴的內容，讓信任自然擴散。\n最適合｜人物故事、社群互動、見證內容與個人品牌定位，讓鏡頭前後都保有真誠。\n留意｜分享前先尊重隱私與界線；不要只追求感動或流量，長期一致比偶爾爆紅更重要。",
  BC:"組合優勢｜你兼具產品經驗與系統思維，能把『為什麼有效』整理成別人容易理解、容易照做的方法。\n最適合｜產品教學、體驗流程、顧客追蹤 SOP 與新人零售訓練，提升團隊服務的一致性。\n留意｜避免資訊一次給太多；先抓住對方當下最需要的一件事，再逐步補充細節。",
  BD:"組合優勢｜你不只會點燃行動，也能把行動變成可複製的步驟，讓熱情不會停在口號。\n最適合｜新人啟動、邀約流程、團隊挑戰與招募訓練，把目標拆成每天做得到的任務。\n留意｜不要只看速度和完成率；不同的人需要不同節奏，流程應該服務人，而不是綁住人。",
  BE:"組合優勢｜你能把工具、流程與內容創作結合，將一次靈感整理成穩定產出的系統，是團隊的內容效率引擎。\n最適合｜內容 SOP、AI 工具導入、素材管理與社群排程，幫助夥伴更輕鬆地持續曝光。\n留意｜別為了最佳化而失去人味；工具應放大真實觀點，而不是製造大量相似內容。",
  CD:"組合優勢｜你能從真實產品價值建立信任，再自然地帶人看見事業機會，讓零售與招募彼此支撐。\n最適合｜從顧客到夥伴的培育、產品故事分享與商機說明，讓機會建立在實際體驗之上。\n留意｜不要把每位顧客都當成招募對象；先尊重他的需求與意願，關係才走得長久。",
  CE:"組合優勢｜你擅長把產品體驗轉化成清楚、有畫面的內容，讓看不見的價值被更多人理解。\n最適合｜產品實測、生活情境短影音、顧客故事與教育型內容，用真實細節累積可信度。\n留意｜避免誇大效果或只呈現完美結果；清楚標示個人經驗並遵守產品宣稱規範。",
  DE:"組合優勢｜你同時具備號召力與傳播力，能把願景說得令人想參與，並透過內容快速放大影響。\n最適合｜招募活動、直播、短影音企劃與團隊品牌造勢，將線上關注轉化為真實行動。\n留意｜避免只追求聲量與情緒高點；承諾之後要有清楚跟進，影響力才會沉澱成信任。"
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

function wrapParagraphs(text, maxChars){
  return String(text).split("\n").flatMap(paragraph=>wrapText(paragraph,maxChars));
}

function point(index, factor, cx=540, cy=590, radius=210){
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
    const primaryKeys = primaryIndexes.map(index=>TYPE_DATA[index].key);

    // 計算副修天賦（當只有一個主修時，取次高分者為副修）
    const sortedIndexes = [0,1,2,3,4].sort((a,b)=>scores[b]-scores[a]);
    const secondaryIndex = primaryIndexes.length === 1
      ? (sortedIndexes.find(idx => scores[idx] < topScore) ?? null)
      : null;
    const secondaryKey = secondaryIndex !== null ? TYPE_DATA[secondaryIndex].key : null;
    const secondaryCoach = secondaryIndex !== null ? TYPE_DATA[secondaryIndex].coach : "";
    const secondaryDesc = secondaryIndex !== null ? SINGLE_ANALYSES[secondaryKey] : "";

    let analysisText = "";
    if (primaryIndexes.length === 1) {
      analysisText = SINGLE_ANALYSES[primaryKeys[0]];
    } else if (primaryIndexes.length === 2) {
      analysisText = DUAL_ANALYSES[[...primaryKeys].sort().join("")];
    } else {
      const names = primaryIndexes.map(index => TYPE_DATA[index].coach).join("、");
      analysisText = `你同時並列了 ${names} 的主修天賦！這代表你是一位「多元全能型陪跑者」，在團隊中具備高度靈活性：\n` +
        primaryIndexes.map(index => {
          const key = TYPE_DATA[index].key;
          const name = TYPE_DATA[index].coach;
          const desc = SINGLE_ANALYSES[key];
          return `【${name}】${desc}`;
        }).join("\n");
    }
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
      return `<line x1="540" y1="590" x2="${x}" y2="${y}" stroke="#E4DDEB" stroke-width="2"/>`;
    }).join("");
    const dataPoints = scores.map((score,i)=>point(i,score/maxScore));
    const radar = `<polygon points="${dataPoints.map(p=>p.join(",")).join(" ")}" fill="#5B2C8230" stroke="#5B2C82" stroke-width="7" stroke-linejoin="round"/>`+
      dataPoints.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="11" fill="${TYPE_DATA[i].color}" stroke="#FFF" stroke-width="5"/>`).join("");
    const labelPositions = [
      {x:540,y:338,anchor:"middle"},
      {x:802,y:505,anchor:"start"},
      {x:764,y:810,anchor:"start"},
      {x:316,y:810,anchor:"end"},
      {x:278,y:505,anchor:"end"}
    ];
    const labels = TYPE_DATA.map((type,i)=>{
      const {x,y,anchor}=labelPositions[i];
      return textLines([`${type.name} ${scores[i]}`],x,y,{size:28,fill:"#4A3B78",weight:700,anchor});
    }).join("");
    // 依據是否有副修天賦決定成果圖卡的排版結構 (三箱式 vs. 兩箱式)
    let contentSvg = "";

    if (secondaryIndex !== null) {
      // 1. 三箱式版面 (主修解析 + 副修天賦 + 下一步發展)
      const mainLines = wrapParagraphs(analysisText, 38).slice(0, 4);
      const secLines = wrapParagraphs(secondaryDesc, 38).slice(0, 4);
      const devLines = wrapText(developmentText, 38).slice(0, 3);

      contentSvg = `
      <!-- 你的專屬解析 -->
      <rect x="92" y="850" width="896" height="235" rx="24" fill="#FFF7EC"/>
      <text x="128" y="900" fill="#FF6F91" font-size="28" font-weight="700">你的專屬解析</text>
      ${textLines(mainLines, 128, 948, {size: 23, fill: "#4A3B78", lineHeight: 1.45})}

      <!-- 副修天賦 -->
      <rect x="92" y="1105" width="896" height="235" rx="24" fill="#EEF7FF"/>
      <text x="128" y="1155" fill="#4B9CD3" font-size="28" font-weight="700">副修天賦：${secondaryCoach}</text>
      ${textLines(secLines, 128, 1203, {size: 23, fill: "#4A3B78", lineHeight: 1.45})}

      <!-- 下一步發展 -->
      <rect x="92" y="1360" width="896" height="195" rx="24" fill="#F0FBF8"/>
      <text x="128" y="1410" fill="#3CA99A" font-size="28" font-weight="700">下一步發展</text>
      ${textLines(devLines, 128, 1458, {size: 23, fill: "#4A3B78", lineHeight: 1.45})}
      `;
    } else {
      // 2. 兩箱式版面 (主修解析多重並列 + 下一步發展，無副修)
      const charCount = analysisText.length;
      let fontSize = 27;
      let lineHeight = 1.45;
      let charsPerLine = 31;
      let maxLines = 12;

      if (charCount > 180) {
        fontSize = 18;
        lineHeight = 1.35;
        charsPerLine = 47;
        maxLines = 18;
      } else if (charCount > 100) {
        fontSize = 22;
        lineHeight = 1.4;
        charsPerLine = 38;
        maxLines = 14;
      }

      const mainLines = wrapParagraphs(analysisText, charsPerLine).slice(0, maxLines);
      const devLines = wrapText(developmentText, 38).slice(0, 3);

      contentSvg = `
      <!-- 你的專屬解析 -->
      <rect x="92" y="850" width="896" height="465" rx="24" fill="#FFF7EC"/>
      <text x="128" y="900" fill="#FF6F91" font-size="28" font-weight="700">你的專屬解析</text>
      ${textLines(mainLines, 128, 948, {size: fontSize, fill: "#4A3B78", lineHeight: lineHeight})}

      <!-- 下一步發展 -->
      <rect x="92" y="1335" width="896" height="220" rx="24" fill="#F0FBF8"/>
      <text x="128" y="1385" fill="#3CA99A" font-size="28" font-weight="700">下一步發展</text>
      ${textLines(devLines, 128, 1435, {size: 23, fill: "#4A3B78", lineHeight: 1.45})}
      `;
    }

    let badgeFontSize = 31;
    if (primaryLabel.length > 30) {
      badgeFontSize = 18;
    } else if (primaryLabel.length > 20) {
      badgeFontSize = 23;
    } else if (primaryLabel.length > 12) {
      badgeFontSize = 27;
    }
    const badgeTextY = 239 + badgeFontSize * 0.35;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="1080" height="1800" viewBox="0 0 1080 1800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#FFF7EC"/><stop offset="1" stop-color="#F3EEFF"/></linearGradient>
        <linearGradient id="title" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#5B2C82"/><stop offset="1" stop-color="#FF6F91"/></linearGradient>
        <style>text{font-family:'Noto Sans CJK TC',sans-serif}</style>
      </defs>
      <rect width="1080" height="1800" fill="url(#bg)"/>
      <rect x="46" y="42" width="988" height="1716" rx="52" fill="#FFFFFF" opacity="0.96"/>
      <text x="540" y="112" text-anchor="middle" fill="#7E7398" font-size="26" font-weight="700">五力陪跑系統｜教練天賦分析</text>
      ${textLines([`${name} 的五力雷達圖`],540,175,{size:48,fill:"#5B2C82",weight:700,anchor:"middle"})}
      <rect x="220" y="205" width="640" height="68" rx="34" fill="url(#title)"/>
      ${textLines([primaryLabel],540,badgeTextY,{size:badgeFontSize,fill:"#FFFFFF",weight:700,anchor:"middle"})}
      ${grid}${axes}${radar}${labels}
      ${contentSvg}
      <!-- 頁尾品牌宣告 (取代舊 QR Code) -->
      <text x="540" y="1655" text-anchor="middle" fill="#5B2C82" font-size="22" font-weight="700">五力陪跑系統 ｜ 找到你的教練天賦</text>
      <text x="540" y="1695" text-anchor="middle" fill="#8F85A4" font-size="19">此圖呈現個人相對傾向，不代表能力高低</text>
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
