export const seedData = {
  wallpaper: "linear-gradient(145deg,#07172c 0%,#164b68 45%,#0c1326 100%)",
  notifications: [
    {id:1,app:"메시지",title:"민준",body:"오늘 일정 확인했어!"},
    {id:2,app:"캘린더",title:"내일 일정",body:"프로젝트 회의 · 10:30"}
  ],
  messages: [
    {id:1,name:"민준",last:"오늘 일정 확인했어!",messages:[
      {mine:false,text:"오늘 일정 확인했어!"},
      {mine:true,text:"응, 확인했어. 고마워!"}
    ]},
    {id:2,name:"서연",last:"사진 보내줄게.",messages:[
      {mine:false,text:"사진 보내줄게."}
    ]}
  ],
  photos: ["🌊","🌸","🌌","🏠","☁️","🌲","🌙","🪩","🌷"],
  notes: [{id:1,title:"새로운 메모",body:"여기에 자유롭게 메모하세요."}],
  events: [{date:"26",title:"프로젝트 작업",time:"19:30"}],
  settings: {wifi:true, bluetooth:true, focus:false, brightness:75, volume:55},
  recent: []
};
